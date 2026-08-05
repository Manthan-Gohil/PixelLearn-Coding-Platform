"""FastAPI route handlers for the PixelLearn AI service.

All endpoints except ``/health`` and ``/metrics`` require a valid HMAC-signed
server-to-server identity (``authenticated_identity`` dependency).
"""
from __future__ import annotations

import logging
import time

from fastapi import APIRouter, BackgroundTasks, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.workflow import execute_workflow
from app.api.deps import AuthenticatedIdentity, authenticated_identity
from app.db.session import get_session
from app.memory.service import save_message
from app.rag.retriever import retriever
from app.schemas.requests import ChatRequest, RecommendationRequest, SearchRequest
from app.schemas.responses import ChatResponse, HealthResponse, Source

router = APIRouter()
logger = logging.getLogger(__name__)


# ── Public endpoints ──────────────────────────────────────────────────────────


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")


@router.get("/metrics")
async def metrics() -> dict:
    # Extend with Prometheus counters / OpenTelemetry gauges when infra is ready.
    return {"service": "pixellearn-ai", "status": "ok"}


# ── Authenticated endpoints ───────────────────────────────────────────────────


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    identity: AuthenticatedIdentity = Depends(authenticated_identity),
    session: AsyncSession | None = Depends(get_session),
) -> ChatResponse:
    started = time.perf_counter()
    await save_message(session, identity.user_id, request.conversation_id, "user", request.message)
    state = await execute_workflow(request, identity.user_id, session)
    await save_message(session, identity.user_id, request.conversation_id, "assistant", state["answer"])
    duration_ms = round((time.perf_counter() - started) * 1000)
    logger.info(
        "ai_request",
        extra={
            "request_id": identity.request_id,
            "user_id": identity.user_id,
            "duration_ms": duration_ms,
            "intent": state["intent"],
            "tools": state["tools"],
            "retrieved_documents": len(state["sources"]),
        },
    )
    return ChatResponse(
        answer=state["answer"],
        intent=state["intent"],
        tools=state["tools"],
        sources=[Source(**source) for source in state["sources"]],
        request_id=identity.request_id,
    )


@router.post("/recommendations", response_model=ChatResponse)
async def recommendations(
    request: RecommendationRequest,
    identity: AuthenticatedIdentity = Depends(authenticated_identity),
    session: AsyncSession | None = Depends(get_session),
) -> ChatResponse:
    chat_request = ChatRequest(
        message=request.focus or "What should I study next?",
        conversation_id="recommendations",
        feature="mentor",
    )
    state = await execute_workflow(chat_request, identity.user_id, session)
    return ChatResponse(
        answer=state["answer"],
        intent=state["intent"],
        tools=state["tools"],
        sources=[Source(**source) for source in state["sources"]],
        request_id=identity.request_id,
    )


@router.post("/platform/search")
async def platform_search(
    request: SearchRequest,
    _: AuthenticatedIdentity = Depends(authenticated_identity),
) -> dict:
    documents = await retriever.search(request.query, request.limit)
    return {"results": [Source(title=d.title, source=d.source, score=d.score) for d in documents]}


@router.post("/embeddings/reindex", status_code=202)
async def reindex_embeddings(
    tasks: BackgroundTasks,
    _: AuthenticatedIdentity = Depends(authenticated_identity),
) -> dict:
    # Import here (inside the function) so that the scripts package is resolved
    # relative to the service root that is on sys.path at runtime, not import time.
    from scripts.ingest_seed_knowledge import main as ingest  # noqa: PLC0415

    async def safe_ingest() -> None:
        """Wraps ingest() so a failure only logs, never crashes the ASGI server."""
        try:
            await ingest()
        except Exception as exc:  # noqa: BLE001
            logger.error("Background reindex failed: %s", exc, exc_info=True)

    tasks.add_task(safe_ingest)
    return {"status": "accepted", "message": "Knowledge reindexing has been scheduled."}

