# -*- coding: utf-8 -*-
"""Agente de codigo: usa code_executor."""

from typing import Any

from core.agent_base.agent_registry import register_agent
from core.agent_base.base_agent import BaseAgent


@register_agent
class CodingAgent(BaseAgent):
    name = "coding_agent"
    role = "system_audit"

    async def run(self, task: dict[str, Any]) -> dict[str, Any]:
        self.require_skill("code_executor")
        raise NotImplementedError("coding_agent fuera del alcance del MVP MindFlow")
