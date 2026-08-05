"""Database session management.

Neon's DATABASE_URL may use psycopg-style query parameters (``sslmode=require``
and ``channel_binding=require``).  asyncpg uses different parameter names
(``ssl=require``).  This module normalises the URL for asyncpg before creating
the engine.

The async engine is created once at first use and reused across all requests.
A new session is provided per-request via ``get_session``; if ``DATABASE_URL``
is empty the generator yields ``None`` so callers can degrade gracefully.
"""
from __future__ import annotations

import logging
from collections.abc import AsyncIterator

from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings

logger = logging.getLogger(__name__)

# Module-level singletons — created once, reused for the process lifetime.
_engine: AsyncEngine | None = None
_factory: async_sessionmaker[AsyncSession] | None = None


class Base(DeclarativeBase):
    pass


def _normalise_asyncpg_url(raw_url: str) -> str:
    """Convert a psycopg-style Neon URL to an asyncpg-compatible URL.

    Neon dashboard copies produce URLs with ``sslmode=require`` and sometimes
    ``channel_binding=require``.  asyncpg expects ``ssl=require`` and does not
    accept ``channel_binding`` as a query parameter.
    """
    parsed = make_url(raw_url)
    query = dict(parsed.query)
    # sslmode → ssl  (psycopg libpq param → asyncpg param)
    if "sslmode" in query and "ssl" not in query:
        query["ssl"] = query.pop("sslmode")
    # channel_binding is passed as a connect_arg by asyncpg, not a URL param.
    query.pop("channel_binding", None)
    return str(parsed.set(query=query))


def _get_engine() -> AsyncEngine | None:
    """Return (and lazily create) the shared async engine."""
    global _engine, _factory
    if _engine is not None:
        return _engine
    raw_url = get_settings().database_url
    if not raw_url:
        return None
    url = _normalise_asyncpg_url(raw_url)
    _engine = create_async_engine(
        url,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        connect_args={"ssl": "require"},  # asyncpg connect_args for SSL
    )
    _factory = async_sessionmaker(_engine, expire_on_commit=False)
    logger.info("Database engine created")
    return _engine


async def get_session() -> AsyncIterator[AsyncSession | None]:
    """FastAPI dependency that yields an ``AsyncSession`` or ``None``."""
    _get_engine()
    if _factory is None:
        yield None
        return
    async with _factory() as session:
        yield session
