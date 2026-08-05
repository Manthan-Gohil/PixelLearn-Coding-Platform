# -*- coding: utf-8 -*-
"""Manual endpoint tester — generates valid HMAC headers and tests all endpoints.

Run from the ai-service directory with the venv activated:
    python tests/manual_test.py

Requires a running FastAPI server on localhost:8000.
Never prints secret values.
"""
import hashlib
import hmac
import json
import os
import sys
import time
import uuid
import io
import urllib.request
import urllib.error
import sys

# Force UTF-8 output on Windows (avoids cp1252 emoji errors).
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

BASE = "http://localhost:8000/api/v1"

# Read secret from environment or .env — never hardcode.
secret = os.environ.get("INTERNAL_AUTH_SECRET", "")
if not secret:
    # Try reading from .env file.
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_path):
        for line in open(env_path).readlines():
            if line.startswith("INTERNAL_AUTH_SECRET="):
                secret = line.strip().split("=", 1)[1].strip().strip('"')
                break

if not secret:
    print("ERROR: INTERNAL_AUTH_SECRET not set. Set it in .env or as an environment variable.")
    sys.exit(1)

TEST_USER = "manual_test_user"


def make_headers():
    ts = str(int(time.time()))
    rid = str(uuid.uuid4())
    payload = f"{TEST_USER}.{ts}.{rid}".encode()
    sig = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return {
        "Content-Type": "application/json",
        "X-PixelLearn-User": TEST_USER,
        "X-PixelLearn-Timestamp": ts,
        "X-PixelLearn-Request-Id": rid,
        "X-PixelLearn-Signature": sig,
    }


def request(method, path, body=None):
    url = f"{BASE}{path}"
    data = json.dumps(body).encode() if body else None
    headers = make_headers() if path != "/health" and path != "/metrics" else {"Content-Type": "application/json"}
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())


def run():
    tests = [
        ("GET",  "/health",              None,                                       200),
        ("GET",  "/metrics",             None,                                       200),
        ("POST", "/platform/search",     {"query": "courses", "limit": 3},          200),
        ("POST", "/chat",                {"message": "What courses are available?", "conversation_id": "manual-test-1"}, 200),
        ("POST", "/recommendations",     {"focus": "data structures"},               200),
        ("POST", "/embeddings/reindex",  None,                                       202),
    ]

    print(f"\n{'='*60}")
    print("PixelLearn AI Service — Manual Endpoint Tests")
    print(f"{'='*60}\n")
    passed = failed = 0
    for method, path, body, expected in tests:
        status, resp = request(method, path, body)
        ok = status == expected
        icon = "[PASS]" if ok else "[FAIL]"
        print(f"{icon} {method:4} {path:<30} -> {status} (expected {expected})")
        if not ok or "--verbose" in sys.argv:
            print(f"   Response: {json.dumps(resp)[:200]}")
        if ok:
            passed += 1
        else:
            failed += 1

    print(f"\n{'='*60}")
    print(f"Results: {passed} passed, {failed} failed")
    print(f"{'='*60}\n")
    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    run()
