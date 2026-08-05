"""Tests for BM25 and Qdrant retrieval behaviour."""
from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest

from app.rag.retriever import HybridRetriever, RetrievedDocument


# ── BM25 tests ────────────────────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_bm25_returns_results_for_known_query():
    ret = HybridRetriever()
    results = await ret.search("PixelLearn courses", limit=3)
    # Should return at least one document from seed_knowledge.json.
    assert len(results) > 0
    assert all(isinstance(r, RetrievedDocument) for r in results)


@pytest.mark.asyncio
async def test_bm25_returns_empty_for_nonsense_query():
    ret = HybridRetriever()
    results = await ret.search("xyzzy frobble wumpus", limit=5)
    # All BM25 scores will be 0 for a nonsense query — should return an empty list.
    assert isinstance(results, list)
    assert len(results) == 0


@pytest.mark.asyncio
async def test_bm25_respects_limit():
    ret = HybridRetriever()
    results = await ret.search("course learning python", limit=2)
    assert len(results) <= 2


@pytest.mark.asyncio
async def test_retrieved_document_fields():
    ret = HybridRetriever()
    results = await ret.search("playground code", limit=1)
    if results:
        doc = results[0]
        assert hasattr(doc, "title")
        assert hasattr(doc, "source")
        assert hasattr(doc, "content")
        assert hasattr(doc, "score")
        assert isinstance(doc.score, float)


# ── Qdrant tests (skipped when unavailable) ───────────────────────────────────


@pytest.mark.asyncio
async def test_qdrant_skipped_when_url_empty(override_settings):
    """When qdrant_url is empty, QdrantStore.search returns [] immediately."""
    from app.vectorstore.qdrant_store import QdrantStore
    results = await QdrantStore().search("test query", limit=5)
    assert results == []


@pytest.mark.asyncio
async def test_hybrid_retriever_falls_back_to_bm25_on_qdrant_error():
    """If Qdrant raises an exception, the retriever returns BM25-only results."""
    with patch(
        "app.rag.retriever.QdrantStore.search",
        new_callable=AsyncMock,
        side_effect=Exception("Qdrant unavailable"),
    ):
        ret = HybridRetriever()
        results = await ret.search("courses", limit=5)
    # Should still get BM25 results rather than crashing.
    assert isinstance(results, list)


@pytest.mark.asyncio
async def test_hybrid_retriever_no_duplicate_documents():
    """RRF fusion should not produce duplicate document titles in results."""
    ret = HybridRetriever()
    results = await ret.search("PixelLearn platform overview", limit=10)
    titles = [r.title for r in results]
    assert len(titles) == len(set(titles)), "Duplicate documents in hybrid results"
