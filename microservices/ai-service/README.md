# PixelLearn AI Microservice

An independent FastAPI service that powers the PixelLearn AI assistant — intent routing, RAG retrieval, live database queries, and LLM generation — served over a signed server-to-server API.

> **Scope**: This service is **standalone**. It does not import from Next.js, share its virtualenv, or expose credentials to the browser. See [Frontend Integration](#frontend-integration) for the planned Next.js proxy.

---

## Architecture

```
Next.js server route (Clerk-verified, future)
  └─ HMAC-signed HTTP request
        └─ FastAPI AI Gateway (this service)
              ├─ Intent detection (deterministic keywords)
              ├─ Tool dispatch
              │     ├─ user_progress   → Neon PostgreSQL (asyncpg)
              │     ├─ course_catalog  → Neon PostgreSQL (asyncpg)
              │     ├─ knowledge       → BM25 + Qdrant (hybrid RRF)
              │     ├─ navigation      → static route map
              │     └─ code_context    → playground payload
              └─ LLM generation (Groq / OpenAI-compatible)
```

---

## Required `.env` Keys

Create `microservices/ai-service/.env` from the template below.  **Never commit real values.**

```env
APP_ENV=development
API_V1_PREFIX=/api/v1

# Neon PostgreSQL — use the asyncpg connection string from Neon dashboard
# Format: postgresql+asyncpg://USER:PASSWORD@HOST/DBNAME?sslmode=require
DATABASE_URL=postgresql+asyncpg://...

# Qdrant vector store
# Use http://localhost:6333 on host, http://qdrant:6333 inside Docker
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=pixellearn_knowledge

# Embedding model (downloaded automatically from HuggingFace on first run)
EMBEDDING_MODEL=BAAI/bge-small-en-v1.5

# LLM provider (Groq example)
LLM_PROVIDER=openai_compatible
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_API_KEY=gsk_...
LLM_MODEL=llama-3.3-70b-versatile

# Shared secret for HMAC server-to-server auth. Generate with:
#   python -c "import secrets; print(secrets.token_hex(32))"
# Share only between Next.js server env and this service. NEVER expose to browsers.
INTERNAL_AUTH_SECRET=your-secret-here

REQUEST_TIMEOUT_SECONDS=30
ENABLE_RERANKING=false
```

> **Important Neon URL note**: The URL from Neon's dashboard may include `channel_binding=require` — the service strips this automatically for asyncpg compatibility. Copy the URL exactly as Neon provides it.

---

## Local Development Setup

### Prerequisites
- Python 3.12+
- Docker Desktop
- The shared `.venv` at the repository root

### Step 1 — Install dependencies (from repo root)

```powershell
# Activate the shared venv
.\.venv\Scripts\Activate.ps1

# Install AI service requirements
pip install -r microservices\ai-service\requirements.txt

# Install embedding model support (downloads ~90 MB model on first use)
pip install -r microservices\ai-service\requirements-embeddings.txt
```

### Step 2 — Set up `.env`

Copy the template above to `microservices/ai-service/.env` and fill in your values.

### Step 3 — Start Qdrant (Docker)

```powershell
cd microservices\ai-service
docker compose up qdrant -d
```

Qdrant will be available at `http://localhost:6333`.

### Step 4 — Run the Alembic migration

This creates the `ai_chat_messages` table in your Neon database.

```powershell
# From microservices\ai-service with venv active:
python -m alembic upgrade head
```

The migration runner translates the asyncpg URL to a psycopg-compatible URL automatically, and strips asyncpg-only parameters (`channel_binding`).

### Step 5 — Ingest seed knowledge into Qdrant

```powershell
# Idempotent upsert (safe to run multiple times):
python -m scripts.ingest_seed_knowledge

# Full rebuild (drops and recreates the collection — prompts for confirmation):
python -m scripts.ingest_seed_knowledge --force-recreate

# Full rebuild without prompt (CI):
python -m scripts.ingest_seed_knowledge --force-recreate --yes
```

### Step 6 — Start the FastAPI server

```powershell
# From microservices\ai-service with venv active and QDRANT_URL overridden for host:
$env:QDRANT_URL = "http://localhost:6333"
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The API docs are at **`http://localhost:8000/docs`**.

---

## Docker (Full Stack)

The `docker-compose.yml` runs both Qdrant and the AI service in Docker.

```powershell
cd microservices\ai-service

# Build and start everything:
docker compose up --build

# View logs:
docker compose logs -f ai-service
```

> **Note**: When running inside Docker, `QDRANT_URL` is automatically set to `http://qdrant:6333` (the Docker service name) by the compose file, overriding the `.env` value.

---

## Running Tests

```powershell
# From microservices\ai-service with venv active:
python -m pytest tests -v
```

**51 tests** covering:
- Intent classification (10 tests)
- HMAC authentication — valid, missing, wrong, expired, tampered (9 tests)
- All 6 API endpoints (17 tests)
- BM25 and Qdrant retrieval with fallback (7 tests)
- Database service with graceful degradation (8 tests)

No live database, Qdrant, or LLM key is required for the test suite.

---

## Manual Endpoint Testing

With the server running (`uvicorn` or Docker), run:

```powershell
python tests/manual_test.py
# Verbose output:
python tests/manual_test.py --verbose
```

This generates valid HMAC-signed requests for all 6 endpoints and reports pass/fail.

### Manually signing a request

```python
import hashlib, hmac, time, uuid, json, urllib.request

SECRET = "your-secret"       # same as INTERNAL_AUTH_SECRET
USER = "user_clerk_id"        # a real Clerk user ID for live progress testing

ts = str(int(time.time()))
rid = str(uuid.uuid4())
payload = f"{USER}.{ts}.{rid}".encode()
sig = hmac.new(SECRET.encode(), payload, hashlib.sha256).hexdigest()

headers = {
    "Content-Type": "application/json",
    "X-PixelLearn-User": USER,
    "X-PixelLearn-Timestamp": ts,
    "X-PixelLearn-Request-Id": rid,
    "X-PixelLearn-Signature": sig,
}

body = json.dumps({"message": "What courses do you have?", "conversation_id": "test-1"}).encode()
req = urllib.request.Request("http://localhost:8000/api/v1/chat", data=body, headers=headers)
with urllib.request.urlopen(req) as resp:
    print(json.loads(resp.read()))
```

---

## Endpoint Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/health` | None | Liveness probe |
| GET | `/api/v1/metrics` | None | Service metrics placeholder |
| POST | `/api/v1/chat` | HMAC | Main AI chat endpoint |
| POST | `/api/v1/recommendations` | HMAC | Study recommendation |
| POST | `/api/v1/platform/search` | HMAC | Hybrid knowledge search |
| POST | `/api/v1/embeddings/reindex` | HMAC | Trigger knowledge reindex (async) |

### Authentication headers (all authenticated endpoints)

```
X-PixelLearn-User        Clerk user ID (passed by Next.js server, never by browser)
X-PixelLearn-Timestamp   Unix timestamp (integer, within 300 s)
X-PixelLearn-Request-Id  UUID v4
X-PixelLearn-Signature   HMAC-SHA256 hex of "USER.TIMESTAMP.REQUEST_ID"
```

---

## Groq Setup

1. Create an account at [console.groq.com](https://console.groq.com).
2. Generate an API key.
3. Set in `.env`:
   ```
   LLM_BASE_URL=https://api.groq.com/openai/v1
   LLM_API_KEY=gsk_...
   LLM_MODEL=llama-3.3-70b-versatile
   ```

The service degrades gracefully when no LLM is configured — it returns the retrieved context directly.

---

## Qdrant Local Setup

Qdrant is started via Docker Compose (see above). Data is persisted to a named Docker volume (`qdrant-data`).

The service falls back to BM25-only search if Qdrant is unavailable — no crash.

**Qdrant Cloud**: Add `QDRANT_API_KEY=...` to `.env` and set `QDRANT_URL` to your cloud cluster URL. The `QdrantStore` passes the API key automatically if present.

---

## Limitations & Known Issues

- **Alembic migration requires DB credentials**: If `DATABASE_URL` in `.env` is rotated on Neon's console, update the `.env` file before running migrations.
- **Embedding model download**: First run of the ingestion script downloads ~90 MB (BAAI/bge-small-en-v1.5). This is cached in the HuggingFace cache after the first run.
- **No authentication on `/docs`**: FastAPI's Swagger UI is available at `/docs` in development. Add a reverse-proxy or auth middleware before exposing this in production.
- **Conversation history requires migration**: The `ai_chat_messages` table must exist before conversation history works. Run `alembic upgrade head` first.

---

## Frontend Integration Plan

> **This step is deliberately deferred** until the microservice is fully stable in production.

The integration requires a **Next.js server-side API route** (never a client component or edge route) that:

1. Verifies the incoming Clerk session token using `auth()` from `@clerk/nextjs/server`.
2. Reads `INTERNAL_AUTH_SECRET` from server environment (never `NEXT_PUBLIC_*`).
3. Signs the Clerk user ID, current Unix timestamp, and a UUID with HMAC-SHA256.
4. Forwards the request to the AI service's private internal URL with the four signed headers.
5. Streams or buffers the response back to the client.

**Required environment variables in Next.js** (server-only):
```
AI_SERVICE_URL=http://ai-service:8000   # internal Docker/Kubernetes URL
INTERNAL_AUTH_SECRET=...                 # same value as in AI service .env
```

**Never expose** to the browser: `AI_SERVICE_URL`, `INTERNAL_AUTH_SECRET`, `GROQ_API_KEY`, `DATABASE_URL`, or any Qdrant credentials.

See `docs/nextjs-integration.md` for the reference implementation.

---

## Adding Capabilities

1. Add a narrow tool function in `app/tools/` and register the intent(s) it handles in `app/tools/registry.py`.
2. Add or update the system prompt in `app/prompts/`.
3. Dispatch the tool in `execute_workflow` inside `app/agents/workflow.py`.
4. Add retrieval and integration tests for the new tool.

The LangGraph graph (`detect_intent → plan`) does not need to change for new tools — only the tool registry and dispatch code.
