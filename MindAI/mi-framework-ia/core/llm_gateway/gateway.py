# -*- coding: utf-8 -*-
"""Gateway unico hacia el LLM: rate limit, timeout, reintentos y validacion."""

import asyncio
import time
from collections import deque
from typing import Any
from uuid import uuid4

import httpx
from pydantic import ValidationError as PydanticValidationError

from core.config import Settings, get_settings
from core.errors import (
    LLMTimeoutError,
    ProviderUnavailableError,
    RateLimitError,
    StructuredOutputError,
    ValidationError,
)
from core.llm_gateway.cost_tracker import CostTracker
from core.llm_gateway.provider_router import build_provider
from core.llm_gateway.providers import LLMProvider
from core.schemas.analysis import AnalysisResponse
from core.security.guardrails import Guardrails

RETRYABLE_ERRORS = (ProviderUnavailableError, StructuredOutputError, httpx.HTTPError)


class LLMGateway:
    def __init__(
        self,
        settings: Settings | None = None,
        provider: LLMProvider | None = None,
        max_requests_per_minute: int = 60,
    ) -> None:
        self.settings = settings or get_settings()
        self.provider = provider or build_provider(self.settings)
        self.cost_tracker = CostTracker()
        self.max_requests_per_minute = max_requests_per_minute
        self._calls: deque[float] = deque()
        self._lock = asyncio.Lock()

    async def _check_rate_limit(self) -> None:
        async with self._lock:
            now = time.monotonic()
            while self._calls and now - self._calls[0] >= 60:
                self._calls.popleft()
            if len(self._calls) >= self.max_requests_per_minute:
                raise RateLimitError()
            self._calls.append(now)

    async def _invoke(self, text: str) -> dict[str, Any]:
        try:
            return await asyncio.wait_for(
                self.provider.analyze(text), timeout=self.settings.llm_timeout_seconds
            )
        except TimeoutError as exc:
            raise LLMTimeoutError() from exc

    async def analyze(
        self,
        text: str,
        agent: str = "emotion_analysis_agent",
        max_retries: int = 2,
    ) -> AnalysisResponse:
        if not text or not text.strip():
            raise ValidationError("El texto anonimizado no puede estar vacio")

        await self._check_rate_limit()

        last_error: Exception | None = None
        for attempt in range(max_retries + 1):
            try:
                raw = await self._invoke(text)
                self.cost_tracker.record(agent)
                return self._validate(raw, text)
            except RETRYABLE_ERRORS as exc:
                last_error = exc
                if attempt < max_retries:
                    await asyncio.sleep(0.3 * (2**attempt))

        if isinstance(last_error, ProviderUnavailableError | StructuredOutputError):
            raise last_error
        raise ProviderUnavailableError()

    def _validate(self, raw: dict[str, Any], original_text: str) -> AnalysisResponse:
        Guardrails.assert_non_diagnostic(raw)

        allowed_keys = set(AnalysisResponse.model_fields)
        payload = {key: value for key, value in raw.items() if key in allowed_keys}
        payload["summary"] = Guardrails.sanitize_output(str(payload.get("summary", "")))
        payload["analysis_id"] = uuid4()

        if Guardrails.detect_risk(original_text):
            payload["risk_detected"] = True
            payload["triage_level"] = "high"

        try:
            return AnalysisResponse.model_validate(payload)
        except PydanticValidationError as exc:
            raise StructuredOutputError("La respuesta del modelo no cumple el esquema") from exc
