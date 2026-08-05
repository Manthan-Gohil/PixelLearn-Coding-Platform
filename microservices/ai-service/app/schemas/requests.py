from typing import Literal
from pydantic import BaseModel, Field


class PlaygroundContext(BaseModel):
    language: str | None = None
    exercise_id: str | None = None
    code: str | None = Field(default=None, max_length=50_000)
    compiler_output: str | None = Field(default=None, max_length=20_000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=10_000)
    conversation_id: str = Field(min_length=1, max_length=128)
    feature: Literal["platform", "course", "mentor", "progress", "playground"] = "platform"
    playground: PlaygroundContext | None = None


class RecommendationRequest(BaseModel):
    focus: str | None = Field(default=None, max_length=300)


class SearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=1_000)
    limit: int = Field(default=5, ge=1, le=20)
