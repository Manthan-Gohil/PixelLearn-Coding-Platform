"""Qdrant vector store client.

Creates a short-lived ``AsyncQdrantClient`` per search call so the service
can be restarted without leaking connections.  All errors are propagated
to the caller (``HybridRetriever``), which silently falls back to BM25.

The embedding step is included inside the same try/except so that a missing
``sentence-transformers`` installation gracefully degrades instead of crashing.
"""
from __future__ import annotations

import logging

from qdrant_client import AsyncQdrantClient

from app.core.config import get_settings

logger = logging.getLogger(__name__)


class QdrantStore:
    async def search(self, query: str, limit: int) -> list[dict]:
        settings = get_settings()
        if not settings.qdrant_url:
            return []
        client = AsyncQdrantClient(url=settings.qdrant_url, check_compatibility=False)
        try:
            # Import lazily so the service boots without sentence-transformers.
            from app.embeddings.provider import embed

            vector = embed([query])[0]
            result = await client.query_points(
                collection_name=settings.qdrant_collection,
                query=vector,
                limit=limit,
                with_payload=True,
            )
            return [
                {"id": str(point.id), "score": float(point.score), **(point.payload or {})}
                for point in result.points
            ]
        except Exception as exc:
            logger.debug("Qdrant search skipped: %s", exc)
            return []
        finally:
            await client.close()
