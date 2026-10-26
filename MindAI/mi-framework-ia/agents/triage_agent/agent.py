# -*- coding: utf-8 -*-
"""Agente de triage - MindFlow."""

from core.agent_base.agent_registry import register_agent
from core.agent_base.base_agent import BaseAgent


@register_agent
class TriageAgent(BaseAgent):
    name = "triage_agent"
    description = "Clasifica nivel de atencion sugerido sin diagnostico ni prescripcion."
    role = "triage"

    def _validate_input(self, payload):
        if not isinstance(payload, dict):
            raise ValueError("payload debe ser un diccionario")
        if not payload.get("anonymized"):
            raise ValueError("El texto debe estar anonimizado")
        return payload

    async def run(self, payload):
        validated = self._validate_input(payload)
        analysis = validated.get("analysis") or {}
        if not isinstance(analysis, dict):
            if hasattr(analysis, "model_dump"):
                analysis = analysis.model_dump()
            else:
                raise ValueError("analysis invalido")
        if not analysis:
            raise ValueError("No hay analysis para triage")

        risk = bool(analysis.get("risk_detected"))
        scores = sorted(
            (int(emotion.get("score", 0)) for emotion in analysis.get("emotions", []) if isinstance(emotion, dict)),
            reverse=True,
        )[:2]
        distortions = analysis.get("distortions") or []

        if risk:
            level = "high"
        elif sum(scores) >= 140 or len(distortions) >= 2:
            level = "medium"
        else:
            level = "low"

        return {
            "triage_level": level,
            "justification": analysis.get("summary", ""),
            "signals": {
                "risk_detected": risk,
                "top_scores": scores,
                "distortions": len(distortions),
            },
        }
