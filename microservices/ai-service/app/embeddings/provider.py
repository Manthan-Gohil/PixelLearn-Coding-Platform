from functools import lru_cache
from typing import Any
from app.core.config import get_settings


@lru_cache
def embedding_model() -> Any:
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError as exc:
        raise RuntimeError(
            "sentence-transformers is not installed. Install requirements-embeddings.txt "
            "before running vector ingestion or Qdrant semantic search."
        ) from exc
    return SentenceTransformer(get_settings().embedding_model)


def embed(texts: list[str]) -> list[list[float]]:
    return embedding_model().encode(texts, normalize_embeddings=True).tolist()
