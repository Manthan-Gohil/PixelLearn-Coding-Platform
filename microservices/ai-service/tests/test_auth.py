"""Tests for HMAC-based server-to-server authentication."""
from __future__ import annotations

import hashlib
import hmac
import time
import uuid

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from tests.conftest import TEST_SECRET, TEST_USER, make_auth_headers


# We test auth via a real endpoint.  /platform/search requires auth and is simple.
SEARCH_URL = "/api/v1/platform/search"
SEARCH_BODY = {"query": "courses", "limit": 2}


@pytest_asyncio.fixture
async def client():
    from app.main import app
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


# ── Valid authentication ──────────────────────────────────────────────────────


async def test_valid_hmac_is_accepted(client):
    headers = make_auth_headers()
    response = await client.post(SEARCH_URL, json=SEARCH_BODY, headers=headers)
    # 200 means auth passed (content may be empty list — that's fine).
    assert response.status_code == 200


# ── Missing headers → 401 ─────────────────────────────────────────────────────


async def test_missing_all_headers_returns_401(client):
    response = await client.post(SEARCH_URL, json=SEARCH_BODY)
    assert response.status_code == 401


async def test_missing_signature_returns_401(client):
    headers = make_auth_headers()
    del headers["X-PixelLearn-Signature"]
    response = await client.post(SEARCH_URL, json=SEARCH_BODY, headers=headers)
    assert response.status_code == 401


async def test_missing_user_returns_401(client):
    headers = make_auth_headers()
    del headers["X-PixelLearn-User"]
    response = await client.post(SEARCH_URL, json=SEARCH_BODY, headers=headers)
    assert response.status_code == 401


# ── Wrong / tampered signature → 401 ─────────────────────────────────────────


async def test_wrong_signature_returns_401(client):
    headers = make_auth_headers()
    headers["X-PixelLearn-Signature"] = "0" * 64  # obviously wrong
    response = await client.post(SEARCH_URL, json=SEARCH_BODY, headers=headers)
    assert response.status_code == 401


async def test_tampered_user_id_returns_401(client):
    """Changing the user ID after signing invalidates the signature."""
    headers = make_auth_headers(user_id="original_user")
    headers["X-PixelLearn-User"] = "different_user"
    response = await client.post(SEARCH_URL, json=SEARCH_BODY, headers=headers)
    assert response.status_code == 401


async def test_wrong_secret_returns_401(client):
    """Signature generated with a different secret must be rejected."""
    headers = make_auth_headers(secret="completely-wrong-secret")
    response = await client.post(SEARCH_URL, json=SEARCH_BODY, headers=headers)
    assert response.status_code == 401


# ── Expired timestamp → 401 ───────────────────────────────────────────────────


async def test_expired_timestamp_returns_401(client):
    """Timestamps older than 300 s must be rejected."""
    old_ts = str(int(time.time()) - 400)
    request_id = str(uuid.uuid4())
    payload = f"{TEST_USER}.{old_ts}.{request_id}".encode()
    signature = hmac.new(TEST_SECRET.encode(), payload, hashlib.sha256).hexdigest()
    headers = {
        "X-PixelLearn-User": TEST_USER,
        "X-PixelLearn-Timestamp": old_ts,
        "X-PixelLearn-Request-Id": request_id,
        "X-PixelLearn-Signature": signature,
    }
    response = await client.post(SEARCH_URL, json=SEARCH_BODY, headers=headers)
    assert response.status_code == 401
    assert "Expired" in response.json().get("detail", "")


# ── Invalid (non-numeric) timestamp → 401 ────────────────────────────────────


async def test_non_numeric_timestamp_returns_401(client):
    headers = make_auth_headers()
    headers["X-PixelLearn-Timestamp"] = "not-a-number"
    response = await client.post(SEARCH_URL, json=SEARCH_BODY, headers=headers)
    assert response.status_code == 401
