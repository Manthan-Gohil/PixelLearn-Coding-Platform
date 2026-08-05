"""Conversation history storage.

All functions handle ``session is None`` (no DB configured) and database errors
gracefully — a history failure must never crash the chat endpoint.
"""
from __future__ import annotations

import logging
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat import ChatMessage

logger = logging.getLogger(__name__)


async def recent_history(
    session: AsyncSession | None, user_id: str, conversation_id: str
) -> list[ChatMessage]:
    """Return the last 8 messages for a conversation, oldest first."""
    if session is None:
        return []
    try:
        result = await session.execute(
            select(ChatMessage)
            .where(
                ChatMessage.user_id == user_id,
                ChatMessage.conversation_id == conversation_id,
            )
            .order_by(ChatMessage.created_at.desc())
            .limit(8)
        )
        return list(reversed(result.scalars().all()))
    except SQLAlchemyError as exc:
        logger.warning("Could not load conversation history: %s", exc)
        return []


async def save_message(
    session: AsyncSession | None,
    user_id: str,
    conversation_id: str,
    role: str,
    content: str,
) -> None:
    """Persist a chat message; silently skips on DB error."""
    if session is None:
        return
    try:
        session.add(
            ChatMessage(
                id=str(uuid4()),
                user_id=user_id,
                conversation_id=conversation_id,
                role=role,
                content=content,
            )
        )
        await session.commit()
    except SQLAlchemyError as exc:
        logger.warning("Could not save chat message: %s", exc)
        await session.rollback()
