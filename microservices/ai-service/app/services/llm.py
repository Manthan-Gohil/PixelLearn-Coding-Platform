"""LLM provider abstraction.

Any OpenAI-compatible endpoint (Groq, OpenAI, local Ollama, etc.) is supported.
When the LLM is not configured or a network/API error occurs, the provider
returns an empty string; ``execute_workflow`` will then fall back to returning
the raw retrieved context so the user still gets a useful response.
"""
from __future__ import annotations

import logging
from abc import ABC, abstractmethod

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)


class LLMProvider(ABC):
    @abstractmethod
    async def generate(self, system: str, prompt: str) -> str: ...


class OpenAICompatibleProvider(LLMProvider):
    """Calls any OpenAI-compatible chat completions endpoint (default: Groq)."""

    async def generate(self, system: str, prompt: str) -> str:
        settings = get_settings()
        if not all([settings.llm_api_key, settings.llm_base_url, settings.llm_model]):
            logger.debug("LLM not configured — returning empty response")
            return ""

        url = f"{settings.llm_base_url.rstrip('/')}/chat/completions"
        payload = {
            "model": settings.llm_model,
            "temperature": 0.2,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
        }
        try:
            async with httpx.AsyncClient(
                timeout=httpx.Timeout(
                    connect=5.0,
                    read=float(settings.request_timeout_seconds),
                    write=10.0,
                    pool=5.0,
                )
            ) as client:
                response = await client.post(
                    url,
                    headers={"Authorization": f"Bearer {settings.llm_api_key}"},
                    json=payload,
                )
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
        except httpx.TimeoutException:
            logger.warning("LLM request timed out after %ss", settings.request_timeout_seconds)
            return ""
        except httpx.HTTPStatusError as exc:
            logger.warning("LLM API returned %s: %s", exc.response.status_code, exc.response.text[:200])
            return ""
        except httpx.RequestError as exc:
            logger.warning("LLM network error: %s", exc)
            return ""
        except (KeyError, IndexError, ValueError) as exc:
            logger.warning("LLM response parse error: %s", exc)
            return ""


def get_llm_provider() -> LLMProvider:
    """Return the configured LLM provider.

    Other providers (Gemini, Claude, local Ollama) implement the same interface.
    Swap the return value here without touching routes or agents.
    """
    return OpenAICompatibleProvider()
