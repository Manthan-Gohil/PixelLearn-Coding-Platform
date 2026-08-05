"""Shared pytest fixtures for the PixelLearn AI service tests.

All tests run with real config values replaced by safe test values so no live
databases, Qdrant instances, or LLM keys are required.
"""
from __future__ import annotations

import hashlib
import hmac
import time
import uuid
from typing import AsyncIterator
from unittest.mock import AsyncMock, MagicMock

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

# ── Settings override ─────────────────────────────────────────────────────────

TEST_SECRET = "test-internal-secret-not-real"
TEST_USER = "user_test_clerk_id"


class _TestSettings:
    """Minimal settings object for isolated unit/integration tests."""
    app_env = "test"
    api_v1_prefix = "/api/v1"
    database_url = ""
    qdrant_url = ""
    qdrant_collection = "pixellearn_knowledge"
    embedding_model = "BAAI/bge-small-en-v1.5"
    llm_provider = "openai_compatible"
    llm_base_url = ""
    llm_api_key = ""
    llm_model = ""
    internal_auth_secret = TEST_SECRET
    request_timeout_seconds = 5
    enable_reranking = False


@pytest.fixture(autouse=True)
def override_settings():
    """Replace the lru_cached get_settings() with a function returning test settings.

    We do this by patching the cached function in place using ``unittest.mock.patch``
    so that every call throughout the application gets the test settings object,
    and we properly restore the original afterwards.
    """
    from unittest.mock import patch

    test_settings = _TestSettings()

    # Clear the lru_cache so we start fresh, patch the canonical function,
    # then clear again on teardown.
    from app.core import config as _cfg
    _cfg.get_settings.cache_clear()

    with patch("app.core.config.get_settings", return_value=test_settings) as _mock, \
         patch("app.api.deps.get_settings", return_value=test_settings, create=True), \
         patch("app.services.llm.get_settings", return_value=test_settings, create=True), \
         patch("app.vectorstore.qdrant_store.get_settings", return_value=test_settings, create=True), \
         patch("app.embeddings.provider.get_settings", return_value=test_settings, create=True), \
         patch("app.db.session.get_settings", return_value=test_settings, create=True):
        yield test_settings

    _cfg.get_settings.cache_clear()


# ── HMAC helper ───────────────────────────────────────────────────────────────


def make_auth_headers(user_id: str = TEST_USER, secret: str = TEST_SECRET) -> dict[str, str]:
    """Generate a valid signed header set for the given user and secret."""
    timestamp = str(int(time.time()))
    request_id = str(uuid.uuid4())
    payload = f"{user_id}.{timestamp}.{request_id}".encode()
    signature = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return {
        "X-PixelLearn-User": user_id,
        "X-PixelLearn-Timestamp": timestamp,
        "X-PixelLearn-Request-Id": request_id,
        "X-PixelLearn-Signature": signature,
    }


@pytest.fixture
def auth_headers() -> dict[str, str]:
    return make_auth_headers()


# ── Async HTTP client ─────────────────────────────────────────────────────────


@pytest_asyncio.fixture
async def client() -> AsyncIterator[AsyncClient]:
    """AsyncClient backed by the FastAPI app (no real network)."""
    from app.main import app
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


# ── DB session mock ───────────────────────────────────────────────────────────


@pytest.fixture
def mock_session():
    """A MagicMock that quacks like an AsyncSession."""
    session = AsyncMock()
    session.execute = AsyncMock()
    session.add = MagicMock()
    session.commit = AsyncMock()
    return session
