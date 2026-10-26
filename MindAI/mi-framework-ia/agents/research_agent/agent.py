# -*- coding: utf-8 -*-
"""Agente de investigacion: usa web_search y document_generator."""

from typing import Any

from core.agent_base.agent_registry import register_agent
from core.agent_base.base_agent import BaseAgent


@register_agent
class ResearchAgent(BaseAgent):
    name = "research_agent"
    role = "system_audit"

    async def run(self, task: dict[str, Any]) -> dict[str, Any]:
        self.require_skill("web_search")
        raise NotImplementedError("research_agent fuera del alcance del MVP MindFlow")
