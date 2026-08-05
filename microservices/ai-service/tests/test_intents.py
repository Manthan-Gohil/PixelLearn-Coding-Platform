"""Tests for the deterministic intent classifier."""
from __future__ import annotations

import pytest

from app.services.intents import Intent, detect_intent


# ── Existing tests (unchanged) ────────────────────────────────────────────────


def test_progress_does_not_use_knowledge_intent():
    assert detect_intent("How many exercises have I solved?") is Intent.PROGRESS


def test_playground_context_overrides_general_question():
    assert detect_intent("Can you help?", has_playground=True) is Intent.PLAYGROUND


def test_course_request_routes_to_catalog():
    assert detect_intent("What Python courses are available?") is Intent.COURSE


# ── Additional intent coverage ────────────────────────────────────────────────


def test_recommendation_intent():
    assert detect_intent("What should I learn next?") is Intent.RECOMMENDATION


def test_recommend_keyword():
    assert detect_intent("Can you recommend something for me?") is Intent.RECOMMENDATION


def test_navigation_intent():
    assert detect_intent("Where is the dashboard page?") is Intent.NAVIGATION


def test_knowledge_fallback():
    """A generic question with no matching keywords should fall through to KNOWLEDGE."""
    assert detect_intent("Explain Big-O notation") is Intent.KNOWLEDGE


def test_playground_debug_keyword():
    assert detect_intent("I have a compiler error in my code") is Intent.PLAYGROUND


def test_streak_routes_to_progress():
    assert detect_intent("What is my current streak?") is Intent.PROGRESS


def test_my_xp_routes_to_progress():
    assert detect_intent("How much my xp do I have?") is Intent.PROGRESS
