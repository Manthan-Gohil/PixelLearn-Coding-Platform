"""Tests for the PixelLearn data service (user_progress and course_catalog).

These tests use mock DB sessions so no live database is needed.
They also verify that functions degrade gracefully when session is None
or when the database raises an error.
"""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest
from sqlalchemy.exc import OperationalError

from app.services.pixellearn_data import ToolResult, course_catalog, user_progress


# ── Helper ────────────────────────────────────────────────────────────────────


def _make_row(**kwargs):
    """Create a MagicMock that behaves like a SQLAlchemy row mapping."""
    row = MagicMock()
    row.__getitem__ = lambda self, key: kwargs[key]
    return row


# ── user_progress ─────────────────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_user_progress_returns_graceful_message_when_no_session():
    result = await user_progress(None, "user_clerk_123")
    assert isinstance(result, ToolResult)
    assert "unavailable" in result.content.lower()
    assert result.sources == []


@pytest.mark.asyncio
async def test_user_progress_returns_graceful_message_when_user_not_found():
    session = AsyncMock()
    mappings = MagicMock()
    mappings.first.return_value = None
    execute_result = MagicMock()
    execute_result.mappings.return_value = mappings
    session.execute = AsyncMock(return_value=execute_result)

    result = await user_progress(session, "unknown_user")
    assert "No synced PixelLearn profile" in result.content


@pytest.mark.asyncio
async def test_user_progress_returns_data_when_user_found():
    row = {"xp": 1500, "streak": 7, "completed": 23}
    session = AsyncMock()
    mappings = MagicMock()
    mappings.first.return_value = row
    execute_result = MagicMock()
    execute_result.mappings.return_value = mappings
    session.execute = AsyncMock(return_value=execute_result)

    result = await user_progress(session, "user_clerk_abc")
    assert "1500 XP" in result.content
    assert "7-day streak" in result.content
    assert "23 completed" in result.content
    assert len(result.sources) == 1


@pytest.mark.asyncio
async def test_user_progress_handles_db_error_gracefully():
    session = AsyncMock()
    session.execute = AsyncMock(side_effect=OperationalError("conn", {}, Exception("timeout")))

    result = await user_progress(session, "user_xyz")
    assert isinstance(result, ToolResult)
    assert "try again" in result.content.lower()
    assert result.sources == []


# ── course_catalog ────────────────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_course_catalog_returns_graceful_message_when_no_session():
    result = await course_catalog(None, "Python courses")
    assert "unavailable" in result.content.lower()
    assert result.sources == []


@pytest.mark.asyncio
async def test_course_catalog_returns_courses_when_found():
    rows = [
        {"title": "Python Fundamentals", "shortDescription": "Learn Python basics.", "difficulty": "beginner"},
        {"title": "Data Structures", "shortDescription": "Arrays, trees, graphs.", "difficulty": "intermediate"},
    ]
    session = AsyncMock()

    # First execute() call returns matching rows; we make both return the same for simplicity.
    mappings = MagicMock()
    mappings.all.return_value = rows
    execute_result = MagicMock()
    execute_result.mappings.return_value = mappings
    session.execute = AsyncMock(return_value=execute_result)

    result = await course_catalog(session, "Python")
    assert "Python Fundamentals" in result.content
    assert "beginner" in result.content
    # Verify shortDescription (not short_description) is accessed correctly.
    assert "Learn Python basics." in result.content
    assert len(result.sources) == 2


@pytest.mark.asyncio
async def test_course_catalog_returns_graceful_message_when_no_results():
    session = AsyncMock()
    mappings = MagicMock()
    mappings.all.return_value = []
    execute_result = MagicMock()
    execute_result.mappings.return_value = mappings
    session.execute = AsyncMock(return_value=execute_result)

    result = await course_catalog(session, "xyzzy unknown topic frobble")
    assert "could not find" in result.content.lower()


@pytest.mark.asyncio
async def test_course_catalog_handles_db_error_gracefully():
    session = AsyncMock()
    session.execute = AsyncMock(side_effect=OperationalError("conn", {}, Exception("timeout")))

    result = await course_catalog(session, "Python")
    assert "try again" in result.content.lower()
    assert result.sources == []
