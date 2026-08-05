"""Create or update Qdrant points from the versioned seed knowledge file.

Default behaviour (safe): creates the collection if it does not exist, then
upserts all points using deterministic UUIDs derived from the document ID.
Existing vectors for documents not in the seed file are left untouched.

Pass ``--force-recreate`` to drop and rebuild the collection from scratch.
This is destructive and will prompt for confirmation unless ``--yes`` is also
passed.

Usage (from the ai-service directory with the venv activated):

    # Idempotent upsert (safe):
    python -m scripts.ingest_seed_knowledge

    # Full rebuild (prompts for confirmation):
    python -m scripts.ingest_seed_knowledge --force-recreate

    # Full rebuild without prompt (CI / Docker):
    python -m scripts.ingest_seed_knowledge --force-recreate --yes

Environment:
    QDRANT_URL        — e.g. http://localhost:6333
    QDRANT_COLLECTION — defaults to pixellearn_knowledge
"""
from __future__ import annotations

import argparse
import asyncio
import json
import logging
import sys
from pathlib import Path
from uuid import NAMESPACE_URL, uuid5

from qdrant_client import AsyncQdrantClient, models

# Allow running as ``python -m scripts.ingest_seed_knowledge`` from service root.
_SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(_SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(_SERVICE_ROOT))

from app.core.config import get_settings
from app.embeddings.provider import embed

logger = logging.getLogger(__name__)
_SEED_PATH = Path(__file__).parents[1] / "app" / "rag" / "documents" / "seed_knowledge.json"


async def main(force_recreate: bool = False, yes: bool = False) -> None:
    settings = get_settings()
    if not settings.qdrant_url:
        raise RuntimeError("Set QDRANT_URL before running ingestion.")

    documents: list[dict] = json.loads(_SEED_PATH.read_text(encoding="utf-8"))
    logger.info("Embedding %d documents…", len(documents))
    vectors = embed([d["content"] for d in documents])
    vector_size = len(vectors[0])

    ids = [str(uuid5(NAMESPACE_URL, d["id"])) for d in documents]

    client = AsyncQdrantClient(url=settings.qdrant_url)
    try:
        collection = settings.qdrant_collection
        existing = {c.name for c in (await client.get_collections()).collections}

        if force_recreate:
            if collection in existing:
                if not yes:
                    ans = input(
                        f"⚠  This will DELETE collection '{collection}' and rebuild it. "
                        "Type 'yes' to confirm: "
                    )
                    if ans.strip().lower() != "yes":
                        logger.info("Aborted.")
                        return
                await client.delete_collection(collection)
                logger.info("Deleted collection '%s'.", collection)
            existing.discard(collection)

        if collection not in existing:
            await client.create_collection(
                collection,
                vectors_config=models.VectorParams(
                    size=vector_size,
                    distance=models.Distance.COSINE,
                ),
            )
            logger.info("Created collection '%s' (dim=%d).", collection, vector_size)

        await client.upsert(
            collection,
            points=models.Batch(ids=ids, vectors=vectors, payloads=documents),
        )
        logger.info("Upserted %d points into '%s'.", len(documents), collection)
    finally:
        await client.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    parser = argparse.ArgumentParser(description="Ingest seed knowledge into Qdrant.")
    parser.add_argument(
        "--force-recreate",
        action="store_true",
        help="Drop and rebuild the collection (destructive).",
    )
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Skip confirmation prompt (use with --force-recreate in CI).",
    )
    args = parser.parse_args()
    asyncio.run(main(force_recreate=args.force_recreate, yes=args.yes))
