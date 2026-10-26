# -*- coding: utf-8 -*-
"""Seleccion de proveedor LLM segun configuracion y disponibilidad de claves."""

from core.config import Settings
from core.llm_gateway.providers import AnthropicProvider, LLMProvider, MockLLMProvider, OpenAIProvider


def build_provider(settings: Settings) -> LLMProvider:
    if settings.llm_mode != "real":
        return MockLLMProvider()

    provider = settings.llm_provider.lower()
    if provider == "anthropic" and settings.anthropic_api_key:
        return AnthropicProvider(settings)
    if provider == "openai" and settings.openai_api_key:
        return OpenAIProvider(settings)
    return MockLLMProvider()
