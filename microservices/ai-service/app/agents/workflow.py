"""LangGraph-based agent workflow.

Graph structure: ``detect_intent → plan → END``

All tool dispatch and the single LLM call happen in ``execute_workflow`` after
the graph resolves intent and plans tools.  Moving generation outside the graph
means the LLM sees real retrieved context on the first (and only) call.
"""
from __future__ import annotations

import logging
from functools import lru_cache
from typing import TypedDict

from langgraph.graph import END, START, StateGraph
from sqlalchemy.ext.asyncio import AsyncSession

from app.memory.service import recent_history
from app.prompts.platform import SYSTEM as PLATFORM_SYSTEM
from app.prompts.playground import SYSTEM as PLAYGROUND_SYSTEM
from app.rag.retriever import retriever
from app.schemas.requests import ChatRequest
from app.services.intents import Intent, detect_intent
from app.services.llm import get_llm_provider
from app.services.pixellearn_data import ToolResult, course_catalog, user_progress
from app.tools.registry import ToolRegistry

logger = logging.getLogger(__name__)


class AgentState(TypedDict, total=False):
    request: ChatRequest
    user_id: str
    intent: Intent
    tools: list[str]
    context: list[str]
    sources: list[dict]
    answer: str


# ── Graph nodes ──────────────────────────────────────────────────────────────


async def _detect(state: AgentState) -> AgentState:
    return {"intent": detect_intent(state["request"].message, state["request"].playground is not None)}


async def _plan(state: AgentState) -> AgentState:
    return {"tools": ToolRegistry().for_intent(state["intent"]), "context": [], "sources": []}


# ── Graph compilation (cached) ────────────────────────────────────────────────


@lru_cache(maxsize=1)
def _compiled_graph():
    """Build and compile the LangGraph workflow once per process."""
    graph = StateGraph(AgentState)
    graph.add_node("detect_intent", _detect)
    graph.add_node("plan", _plan)
    graph.add_edge(START, "detect_intent")
    graph.add_edge("detect_intent", "plan")
    graph.add_edge("plan", END)
    return graph.compile()


# ── Public entry point ────────────────────────────────────────────────────────


async def execute_workflow(
    request: ChatRequest, user_id: str, session: AsyncSession | None
) -> AgentState:
    """Run intent detection + planning, dispatch tools, then generate one response."""

    # 1. Detect intent and plan tools via LangGraph.
    state: AgentState = await _compiled_graph().ainvoke(
        {"request": request, "user_id": user_id}
    )

    # 2. Load conversation history (no-op when DB is unavailable).
    history = await recent_history(session, user_id, request.conversation_id)
    context: list[str] = (
        ["Recent conversation: " + " | ".join(f"{m.role}: {m.content}" for m in history)]
        if history
        else []
    )
    sources: list[dict] = []

    # 3. Dispatch tools planned by the graph.
    for tool in state["tools"]:
        result: ToolResult | None = None
        if tool == "user_progress":
            result = await user_progress(session, user_id)
        elif tool == "course_catalog":
            result = await course_catalog(session, request.message)
        elif tool == "navigation":
            result = ToolResult(
                "Relevant PixelLearn pages: Courses `/courses`; "
                "dashboard `/dashboard`; a course exercise playground "
                "`/playground/{courseId}/{exerciseId}`.",
                [{"title": "PixelLearn navigation", "source": "platform-routes"}],
            )
        elif tool == "code_context" and request.playground:
            result = ToolResult(
                "Use the supplied playground language, compiler output, and code "
                "to help the learner diagnose the issue.",
                [{"title": "Current playground context", "source": "playground"}],
            )
        elif tool == "knowledge":
            docs = await retriever.search(request.message)
            context.extend(doc.content for doc in docs)
            sources.extend(
                {"title": doc.title, "source": doc.source, "score": doc.score}
                for doc in docs
            )
        if result:
            context.append(result.content)
            sources.extend(result.sources)

    # 4. Add playground code to context when present.
    playground = request.playground
    context_text = "\n\n".join(context) or "No retrieved context was available."
    if playground:
        context_text += (
            f"\n\nPlayground context:\nLanguage: {playground.language}"
            f"\nCompiler output: {playground.compiler_output}"
            f"\nCode:\n{playground.code}"
        )

    # 5. Single LLM call with full context.
    system = PLAYGROUND_SYSTEM if playground else PLATFORM_SYSTEM
    answer = await get_llm_provider().generate(
        system,
        f"Question: {request.message}\n\nContext:\n{context_text}",
    )
    if not answer:
        # LLM unavailable — return the raw context so the caller still gets value.
        answer = f"Here's what I found:\n\n{context_text}"

    logger.debug(
        "workflow_complete",
        extra={
            "intent": state["intent"],
            "tools": state["tools"],
            "context_chunks": len(context),
            "sources": len(sources),
        },
    )

    state["context"] = context
    state["sources"] = sources
    state["answer"] = answer
    return state
