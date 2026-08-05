from enum import StrEnum


class Intent(StrEnum):
    PROGRESS = "progress"
    RECOMMENDATION = "recommendation"
    NAVIGATION = "navigation"
    PLAYGROUND = "playground"
    COURSE = "course"
    KNOWLEDGE = "knowledge"


def detect_intent(message: str, has_playground: bool = False) -> Intent:
    text = message.lower()
    if has_playground or any(term in text for term in ("compiler", "my code", "error", "debug")):
        return Intent.PLAYGROUND
    if any(term in text for term in ("how many", "my progress", "solved", "streak", "my xp")):
        return Intent.PROGRESS
    if any(term in text for term in ("what should", "recommend", "learn next")):
        return Intent.RECOMMENDATION
    if any(term in text for term in ("where is", "navigate", "page", "find the")):
        return Intent.NAVIGATION
    if any(term in text for term in ("course", "courses", "arrays", "python available")):
        return Intent.COURSE
    return Intent.KNOWLEDGE
