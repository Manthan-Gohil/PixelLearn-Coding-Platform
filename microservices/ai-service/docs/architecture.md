# Retrieval and extension guide

`POST /api/v1/chat` follows a LangGraph workflow: intent detection → plan → data retrieval → response generation. Intent determines whether the request uses live SQL, course SQL, navigation, playground context, knowledge retrieval, or a composition of these narrow tools.

Knowledge retrieval applies BM25 to versioned documents and, when configured, Qdrant semantic retrieval. Candidates are merged using reciprocal-rank fusion. This avoids the failure mode where a progress question is answered with stale embedded text and still supports conceptual questions such as dynamic programming.

The initial documents in `app/rag/documents/seed_knowledge.json` describe capabilities that exist in this repository. The ingestion script can later be extended with Prisma exports, Markdown, HTML, and PDF loaders; each document should retain source, route, and version metadata.
