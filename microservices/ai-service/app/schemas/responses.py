from pydantic import BaseModel


class Source(BaseModel):
    title: str
    source: str
    score: float | None = None


class ChatResponse(BaseModel):
    answer: str
    intent: str
    tools: list[str]
    sources: list[Source] = []
    request_id: str


class HealthResponse(BaseModel):
    status: str
    service: str = "pixellearn-ai"
