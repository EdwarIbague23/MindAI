# -*- coding: utf-8 -*-
"""Orquestador del pipeline multi-agente: emociones -> distorsiones -> triaje -> reporte."""

from typing import Any

from core.agent_base.agent_registry import instantiate_agents
from core.config import BASE_DIR
from core.llm_gateway.gateway import LLMGateway
from core.manifest_validator import load_and_validate
from core.observability.logger import get_logger
from core.observability.tracer import trace_event
from core.orchestrator.executor import PipelineExecutor
from core.schemas.analysis import AnalysisResponse

logger = get_logger("mindflow.orchestrator")


def _load_manifests() -> dict[str, dict[str, Any]]:
    agents, _ = load_and_validate(BASE_DIR / "config")
    return {agent["name"]: agent for agent in agents}


class AnalysisOrchestrator:
    def __init__(
        self,
        gateway: LLMGateway,
        agents: dict[str, Any] | None = None,
        manifests: dict[str, dict[str, Any]] | None = None,
    ) -> None:
        import agents as agents_package  # noqa: F401  (registra los agentes MindFlow)

        self.gateway = gateway
        manifests = manifests if manifests is not None else _load_manifests()
        self.agents = agents if agents is not None else instantiate_agents(manifests, gateway)
        self.executor = PipelineExecutor(self.agents)

    async def run(
        self, anonymized_text: str, session_id: str | None = None
    ) -> tuple[AnalysisResponse, dict[str, Any]]:
        trace_event("mindflow.orchestrator", "pipeline.begin", agents=sorted(self.agents))
        analysis, report = await self.executor.run(anonymized_text, session_id)
        trace_event(
            "mindflow.orchestrator",
            "pipeline.end",
            triage_level=analysis.triage_level,
            report_format=report.get("format") if isinstance(report, dict) else None,
        )
        return analysis, report

    async def generate_report(self, analysis: AnalysisResponse, session_id: str) -> dict[str, Any]:
        return await self.executor.generate_report(analysis, session_id)

    def cost_snapshot(self) -> dict[str, Any]:
        return self.gateway.cost_tracker.snapshot()
