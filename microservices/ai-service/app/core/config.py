"""Application settings loaded from the ai-service `.env` file.

The path is resolved relative to this file (always points to
``microservices/ai-service/.env``) so the settings work correctly regardless
of the working directory — both in development (run from the service root) and
inside Docker (``WORKDIR /app``).
"""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Absolute path to microservices/ai-service/.env — two parents up from this file.
_ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(_ENV_FILE), extra="ignore")

    app_env: str = "development"
    api_v1_prefix: str = "/api/v1"

    # Database — asyncpg URL format (postgresql+asyncpg://...)
    database_url: str = ""

    # Qdrant vector store
    qdrant_url: str = ""
    qdrant_collection: str = "pixellearn_knowledge"

    # Embeddings
    embedding_model: str = "BAAI/bge-small-en-v1.5"

    # LLM provider
    llm_provider: str = "openai_compatible"
    llm_base_url: str = ""
    llm_api_key: str = ""
    llm_model: str = ""

    # Server-to-server HMAC auth
    internal_auth_secret: str = ""

    # Request / connection tuning
    request_timeout_seconds: int = 30
    enable_reranking: bool = False


@lru_cache
def get_settings() -> Settings:
    return Settings()
