# -*- coding: utf-8 -*-
"""Agente de analisis emocional - MindFlow."""

from core.agent_base.agent_registry import register_agent
from core.agent_base.base_agent import BaseAgent


@register_agent
class EmotionAnalysisAgent(BaseAgent):
    name = "emotion_analysis_agent"
    description = "Analiza texto clinico anonimizado para emociones, distorsiones y preguntas guia."
    role = "emotion_analysis"

    def _validate_input(self, payload):
        if not isinstance(payload, dict):
            raise ValueError("payload debe ser un diccionario")
        if not payload.get("anonymized"):
            raise ValueError("El texto debe estar anonimizado")
        if not payload.get("text"):
            raise ValueError("Texto requerido")
        return payload

    async def run(self, payload):
        validated = self._validate_input(payload)
        if self.gateway is None:
            raise RuntimeError("gateway no configurado")
        from core.schemas.analysis import AnalysisResponse

        result = await self.gateway.analyze(validated["text"], agent=self.name)
        if not isinstance(result, AnalysisResponse):
            raise ValueError("Respuesta invalida")
        return result.model_dump()
