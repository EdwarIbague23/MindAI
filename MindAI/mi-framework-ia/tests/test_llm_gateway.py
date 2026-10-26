# -*- coding: utf-8 -*-
import pytest

from core.errors import RateLimitError
from core.llm_gateway.gateway import LLMGateway
from core.llm_gateway.providers import MockLLMProvider


@pytest.mark.asyncio
async def test_mock_analysis_is_structured_and_detects_risk():
    gateway = LLMGateway(provider=MockLLMProvider())
    result = await gateway.analyze("Me siento ansioso y con pensamientos de suicidio.")

    assert result.emotions
    assert result.triage_level == "high"
    assert result.risk_detected is True
    assert result.summary


@pytest.mark.asyncio
async def test_rate_limit_blocks_excess_requests():
    gateway = LLMGateway(provider=MockLLMProvider(), max_requests_per_minute=1)
    await gateway.analyze("Me siento tranquilo y contento con mi progreso.")
    with pytest.raises(RateLimitError):
        await gateway.analyze("Me siento tranquilo y contento con mi progreso.")
