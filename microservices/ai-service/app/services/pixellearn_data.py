"""Live PixelLearn data tools.

Queries run against the shared Neon PostgreSQL database using raw SQL that
exactly matches the Prisma-generated column names (quoted camelCase where
Prisma did not map to snake_case).

All functions degrade gracefully when the session is ``None`` (no DB
configured) or when a database error occurs.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


@dataclass
class ToolResult:
    content: str
    sources: list[dict]


async def user_progress(session: AsyncSession | None, user_id: str) -> ToolResult:
    """Return a learner's XP, streak, and completed exercise count."""
    if session is None:
        return ToolResult(
            "Live progress is temporarily unavailable because the data connection "
            "is not configured.",
            [],
        )
    # Prisma generates quoted camelCase column names in Postgres.
    query = text(
        'SELECT u.xp, u.streak, COUNT(ce.id) AS completed '
        'FROM "User" u '
        'LEFT JOIN "CompletedExercise" ce ON ce."userId" = u.id '
        'WHERE u."clerkId" = :user_id '
        'GROUP BY u.id'
    )
    try:
        row = (await session.execute(query, {"user_id": user_id})).mappings().first()
    except SQLAlchemyError as exc:
        logger.warning("user_progress query failed: %s", exc)
        return ToolResult("Could not fetch your progress right now. Please try again shortly.", [])
    if not row:
        return ToolResult("No synced PixelLearn profile was found yet.", [])
    return ToolResult(
        f"You have {row['xp']} XP, a {row['streak']}-day streak, "
        f"and {row['completed']} completed exercises.",
        [{"title": "Your PixelLearn progress", "source": "live-user-data"}],
    )


async def course_catalog(session: AsyncSession | None, query_text: str) -> ToolResult:
    """Return matching courses from the catalog, falling back to top courses."""
    if session is None:
        return ToolResult(
            "Course catalog lookup is unavailable until the database connection "
            "is configured.",
            [],
        )
    stopwords = {"what", "which", "courses", "course", "available", "learn"}
    terms = [t for t in query_text.split() if len(t) > 2]
    term = next((v for v in terms if v.lower() not in stopwords), "")

    # Column name is "shortDescription" — Prisma camelCase → Postgres quoted column.
    search_sql = text(
        'SELECT title, "shortDescription", difficulty '
        'FROM "Course" '
        'WHERE title ILIKE :query OR description ILIKE :query '
        'ORDER BY title LIMIT 8'
    )
    fallback_sql = text(
        'SELECT title, "shortDescription", difficulty '
        'FROM "Course" ORDER BY title LIMIT 8'
    )
    try:
        rows = (await session.execute(search_sql, {"query": f"%{term}%"})).mappings().all()
        if not rows:
            rows = (await session.execute(fallback_sql)).mappings().all()
    except SQLAlchemyError as exc:
        logger.warning("course_catalog query failed: %s", exc)
        return ToolResult("Could not fetch the course catalog right now. Please try again shortly.", [])
    if not rows:
        return ToolResult("I could not find a matching course in the current catalog.", [])
    return ToolResult(
        "\n".join(f"- {r['title']} ({r['difficulty']}): {r['shortDescription']}" for r in rows),
        [{"title": r["title"], "source": "course-database"} for r in rows],
    )
