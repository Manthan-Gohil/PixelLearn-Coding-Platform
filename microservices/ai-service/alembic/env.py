"""Alembic environment configuration.

The DATABASE_URL in .env uses the asyncpg format (postgresql+asyncpg://...).
Alembic runs with psycopg (synchronous), so this file:
  1. Switches the driver to postgresql+psycopg.
  2. Translates asyncpg-only query parameters that psycopg does not understand:
       ssl=require       → sslmode=require
       channel_binding=* → stripped (psycopg ignores / rejects it)
"""
import sys
from pathlib import Path

from alembic import context
from sqlalchemy.engine import make_url

# Make the service package importable regardless of which directory alembic
# was invoked from (Windows and Linux compatible).
SERVICE_ROOT = Path(__file__).resolve().parents[1]
if str(SERVICE_ROOT) not in sys.path:
    sys.path.insert(0, str(SERVICE_ROOT))

from app.core.config import get_settings
from app.db.session import Base
from app.models.chat import ChatMessage  # noqa: F401 — registers table with Base.metadata

alembic_config = context.config

# Build the synchronous psycopg URL from the asyncpg app URL.
_raw_url = make_url(get_settings().database_url)
_sync_url = _raw_url.set(drivername="postgresql+psycopg")

# Translate / strip parameters that psycopg does not accept.
_query = dict(_sync_url.query)
if "ssl" in _query:
    _query["sslmode"] = _query.pop("ssl")
_query.pop("channel_binding", None)   # asyncpg-only — not valid for psycopg

alembic_config.set_main_option("sqlalchemy.url", str(_sync_url.set(query=_query)))
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=alembic_config.get_main_option("sqlalchemy.url"),
        target_metadata=target_metadata,
        literal_binds=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    from sqlalchemy import create_engine

    engine = create_engine(alembic_config.get_main_option("sqlalchemy.url"))
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
