# -*- coding: utf-8 -*-
"""Agente de reportes - MindFlow."""

from core.agent_base.agent_registry import register_agent
from core.agent_base.base_agent import BaseAgent


@register_agent
class ReportAgent(BaseAgent):
    name = "report_agent"
    description = "Compone reporte en Markdown con aviso de revision profesional."
    role = "report_generation"

    def _validate_input(self, payload):
        if not isinstance(payload, dict):
            raise ValueError("payload debe ser un diccionario")
        if not payload.get("analysis"):
            raise ValueError("Se requiere analysis")
        return payload

    async def run(self, payload):
        from core.reporting.report_service import generate_report

        validated = self._validate_input(payload)
        analysis = validated["analysis"]
        session_id = validated.get("session_id")
        if hasattr(analysis, "model_dump"):
            analysis_obj = analysis
        else:
            from core.schemas.analysis import AnalysisResponse

            analysis_obj = AnalysisResponse.model_validate(analysis)
        path, report_format = await generate_report(analysis_obj, session_id)
        return {"file_path": str(path), "format": report_format}
