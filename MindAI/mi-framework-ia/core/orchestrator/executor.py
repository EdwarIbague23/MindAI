# -*- coding: utf-8 -*-
"""Ejecucion del pipeline multi-agente con trazabilidad por etapa."""

from typing import Any

from core.observability.tracer import get_analysis_id, set_analysis_id, trace_span
from core.orchestrator.planner import PipelineStep, build_plan
from core.orchestrator.router import select_agent
from core.schemas.analysis import AnalysisResponse, CognitiveDistortion

VALID_TRIAGE = {"low", "medium", "high"}


class PipelineExecutor:
    def __init__(self, agents: dict[str, Any]) -> None:
        self.agents = agents

    async def _execute(self, step: PipelineStep, payload: dict[str, Any]) -> Any:
        agent = select_agent(step, self.agents)
        with trace_span("mindflow.pipeline", "agent.run", agent=step.agent, stage=step.stage):
            return await agent.run(payload)

    async def run(self, text: str, session_id: str | None = None) -> tuple[AnalysisResponse, dict[str, Any]]:
        plan = {step.stage: step for step in build_plan()}

        emotion_raw = await self._execute(plan["emotion"], {"text": text, "anonymized": True})
        analysis = AnalysisResponse.model_validate(emotion_raw)
        set_analysis_id(str(analysis.analysis_id))

        cognitive_raw = await self._execute(
            plan["distortion"],
            {
                "analysis": analysis.model_dump(mode="json"),
                "text": text,
                "anonymized": True,
            },
        )
        if isinstance(cognitive_raw, dict) and cognitive_raw.get("distortions") is not None:
            distortions = [
                CognitiveDistortion.model_validate(item) for item in cognitive_raw.get("distortions") or []
            ]
            analysis = analysis.model_copy(update={"distortions": distortions})

        triage_raw = await self._execute(
            plan["triage"],
            {"analysis": analysis.model_dump(mode="json"), "anonymized": True},
        )
        if isinstance(triage_raw, dict) and triage_raw.get("triage_level") in VALID_TRIAGE:
            analysis = analysis.model_copy(update={"triage_level": triage_raw["triage_level"]})

        report = await self._execute(
            plan["report"],
            {
                "analysis": analysis,
                "session_id": session_id or get_analysis_id() or str(analysis.analysis_id),
            },
        )
        return analysis, report

    async def generate_report(self, analysis: AnalysisResponse, session_id: str) -> dict[str, Any]:
        set_analysis_id(str(analysis.analysis_id))
        plan = {step.stage: step for step in build_plan()}
        return await self._execute(plan["report"], {"analysis": analysis, "session_id": session_id})
