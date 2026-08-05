"""API integration tests using FastAPI's async test client.

All external integrations (DB, Qdrant, LLM) are mocked so no live services are
needed.  The ``override_settings`` fixture (autouse in conftest) ensures the
app runs in isolated test mode.
"""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from tests.conftest import make_auth_headers

# ── Fixtures ──────────────────────────────────────────────────────────────────


@pytest_asyncio.fixture
async def client():
    from app.main import app
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.fixture
def auth():
    return make_auth_headers()


# ── Helper ────────────────────────────────────────────────────────────────────


def _mock_workflow(answer: str = "Test answer from AI"):
    """Return a patch for execute_workflow that resolves immediately."""
    return patch(
        "app.api.routes.execute_workflow",
        new_callable=AsyncMock,
        return_value={
            "answer": answer,
            "intent": "knowledge",
            "tools": ["knowledge"],
            "sources": [{"title": "Test doc", "source": "test", "score": 0.9}],
        },
    )


def _mock_save():
    return patch("app.api.routes.save_message", new_callable=AsyncMock)


# ── Health / Metrics (no auth required) ──────────────────────────────────────


async def test_health_returns_ok(client):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "pixellearn-ai"


async def test_metrics_returns_ok(client):
    response = await client.get("/api/v1/metrics")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


# ── /platform/search ──────────────────────────────────────────────────────────


async def test_search_valid_request(client, auth):
    response = await client.post(
        "/api/v1/platform/search", json={"query": "Python arrays", "limit": 3}, headers=auth
    )
    assert response.status_code == 200
    body = response.json()
    assert "results" in body
    assert isinstance(body["results"], list)


async def test_search_without_auth_returns_401(client):
    response = await client.post("/api/v1/platform/search", json={"query": "test", "limit": 2})
    assert response.status_code == 401


async def test_search_limit_validated(client, auth):
    """limit must be 1–20; 0 is invalid."""
    response = await client.post(
        "/api/v1/platform/search", json={"query": "test", "limit": 0}, headers=auth
    )
    assert response.status_code == 422


async def test_search_qdrant_unavailable_falls_back_to_bm25(client, auth):
    """When Qdrant is not configured, BM25 results are returned (no 500)."""
    # override_settings already sets qdrant_url="" so Qdrant is skipped.
    response = await client.post(
        "/api/v1/platform/search", json={"query": "courses", "limit": 5}, headers=auth
    )
    assert response.status_code == 200
    # BM25 might return empty list for no matches, but must not crash.
    assert "results" in response.json()


# ── /chat ─────────────────────────────────────────────────────────────────────


async def test_chat_valid_request(client, auth):
    with _mock_workflow(), _mock_save():
        response = await client.post(
            "/api/v1/chat",
            json={"message": "What courses do you offer?", "conversation_id": "conv-001"},
            headers=auth,
        )
    assert response.status_code == 200
    body = response.json()
    assert "answer" in body
    assert "intent" in body
    assert "tools" in body
    assert "sources" in body
    assert "request_id" in body


async def test_chat_without_auth_returns_401(client):
    response = await client.post(
        "/api/v1/chat",
        json={"message": "hello", "conversation_id": "c1"},
    )
    assert response.status_code == 401


async def test_chat_message_too_long_returns_422(client, auth):
    response = await client.post(
        "/api/v1/chat",
        json={"message": "x" * 10_001, "conversation_id": "c1"},
        headers=auth,
    )
    assert response.status_code == 422


async def test_chat_with_db_unavailable_returns_200(client, auth):
    """DB = None → graceful degradation, not a 500."""
    # DB is already unavailable (database_url="" in override_settings).
    with _mock_workflow("Context-only answer"), _mock_save():
        response = await client.post(
            "/api/v1/chat",
            json={"message": "How many exercises?", "conversation_id": "c1"},
            headers=auth,
        )
    assert response.status_code == 200


async def test_chat_llm_unavailable_returns_context_answer(client, auth):
    """When LLM returns empty string, the workflow produces a context-only reply."""
    with _mock_workflow("Here's what I found:\n\nNo retrieved context was available."), _mock_save():
        response = await client.post(
            "/api/v1/chat",
            json={"message": "Tell me about PixelLearn", "conversation_id": "c1"},
            headers=auth,
        )
    assert response.status_code == 200
    assert response.json()["answer"]  # non-empty answer even without LLM


async def test_chat_with_playground_context(client, auth):
    playground = {
        "language": "python",
        "code": "print('hello'",
        "compiler_output": "SyntaxError: '(' was never closed",
    }
    with _mock_workflow("You have a missing closing parenthesis."), _mock_save():
        response = await client.post(
            "/api/v1/chat",
            json={
                "message": "Why does my code fail?",
                "conversation_id": "playground-c1",
                "playground": playground,
            },
            headers=auth,
        )
    assert response.status_code == 200


# ── /recommendations ──────────────────────────────────────────────────────────


async def test_recommendations_valid_request(client, auth):
    with _mock_workflow("You should study arrays next."), _mock_save():
        response = await client.post(
            "/api/v1/recommendations",
            json={"focus": "data structures"},
            headers=auth,
        )
    assert response.status_code == 200
    assert response.json()["answer"]


async def test_recommendations_without_auth_returns_401(client):
    response = await client.post("/api/v1/recommendations", json={})
    assert response.status_code == 401


async def test_recommendations_empty_body(client, auth):
    """focus is optional — empty body should work."""
    with _mock_workflow("General recommendation."), _mock_save():
        response = await client.post("/api/v1/recommendations", json={}, headers=auth)
    assert response.status_code == 200


# ── /embeddings/reindex ───────────────────────────────────────────────────────


async def test_reindex_accepted(client, auth):
    with patch("scripts.ingest_seed_knowledge.main", new_callable=AsyncMock):
        response = await client.post("/api/v1/embeddings/reindex", headers=auth)
    assert response.status_code == 202
    assert response.json()["status"] == "accepted"


async def test_reindex_without_auth_returns_401(client):
    response = await client.post("/api/v1/embeddings/reindex")
    assert response.status_code == 401
