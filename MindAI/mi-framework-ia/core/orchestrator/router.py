# -*- coding: utf-8 -*-
"""Seleccion del agente que atiende cada etapa del pipeline."""

from typing import Any

from core.errors import ProviderUnavailableError
from core.orchestrator.planner import PipelineStep


def select_agent(step: PipelineStep, agents: dict[str, Any]) -> Any:
    agent = agents.get(step.agent)
    if agent is None:
        raise ProviderUnavailableError(f"Agente no disponible: {step.agent}")
    return agent
