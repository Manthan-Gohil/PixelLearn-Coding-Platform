import json
from dataclasses import dataclass
from pathlib import Path
from rank_bm25 import BM25Okapi
from app.core.config import get_settings
from app.vectorstore.qdrant_store import QdrantStore


@dataclass
class RetrievedDocument:
    title: str
    source: str
    content: str
    score: float
    metadata: dict


class HybridRetriever:
    def __init__(self) -> None:
        path = Path(__file__).parent / "documents" / "seed_knowledge.json"
        self.documents = json.loads(path.read_text(encoding="utf-8"))
        self.bm25 = BM25Okapi([document["content"].lower().split() for document in self.documents])

    async def search(self, query: str, limit: int = 5) -> list[RetrievedDocument]:
        scores = self.bm25.get_scores(query.lower().split())
        lexical = [(str(i), float(score), self.documents[i]) for i, score in sorted(enumerate(scores), key=lambda item: item[1], reverse=True)[:limit] if score > 0]
        vector: list[tuple[str, float, dict]] = []
        try:
            for item in await QdrantStore().search(query, limit):
                vector.append((item.get("id", item.get("title", "")), item["score"], item))
        except Exception:
            # Retrieval degrades to lexical search when Qdrant is unavailable.
            pass
        # Reciprocal-rank fusion balances exact keyword matches and semantic results.
        fused: dict[str, tuple[float, dict]] = {}
        for ranking in (lexical, vector):
            for rank, (doc_id, _, document) in enumerate(ranking, start=1):
                prior, _ = fused.get(doc_id, (0.0, document))
                fused[doc_id] = (prior + 1 / (60 + rank), document)
        return [RetrievedDocument(d["title"], d["source"], d["content"], score, d.get("metadata", {})) for score, d in sorted(fused.values(), key=lambda item: item[0], reverse=True)[:limit]]


retriever = HybridRetriever()
