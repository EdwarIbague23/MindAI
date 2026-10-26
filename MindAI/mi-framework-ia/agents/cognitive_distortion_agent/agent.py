# -*- coding: utf-8 -*-
"""Agente de distorsiones cognitivas - MindFlow."""

from core.agent_base.agent_registry import register_agent
from core.agent_base.base_agent import BaseAgent


@register_agent
class CognitiveDistortionAgent(BaseAgent):
    name = "cognitive_distortion_agent"
    description = "Especializa la deteccion de distorsiones cognitivas sin diagnostico."
    role = "emotion_analysis"

    def _validate_input(self, payload):
        if not isinstance(payload, dict):
            raise ValueError("payload debe ser un diccionario")
        if not payload.get("anonymized"):
            raise ValueError("El texto debe estar anonimizado")
        if not payload.get("analysis") and not payload.get("text"):
            raise ValueError("Se requiere analysis o text")
        return payload

    async def run(self, payload):
        validated = self._validate_input(payload)
        analysis = validated.get("analysis") or {}
        if hasattr(analysis, "model_dump"):
            analysis = analysis.model_dump()

        text = validated.get("text") or ""
        if not text and isinstance(analysis, dict):
            text = analysis.get("summary") or ""

        if text:
            if self.gateway is None:
                raise RuntimeError("gateway no configurado")
            result = await self.gateway.analyze(text, agent=self.name)
            data = result.model_dump()
            return {"distortions": data.get("distortions", [])}

        if isinstance(analysis, dict) and analysis.get("distortions") is not None:
            return {"distortions": analysis.get("distortions", [])}
        raise ValueError("No hay texto ni analysis para analizar")
