# -*- coding: utf-8 -*-
"""Plan determinista del pipeline MindFlow.

El triage depende del analisis emocional y de las distorsiones, por lo que el
orden efectivo de ejecucion es:
emotion_analysis -> cognitive_distortion -> triage -> report.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class PipelineStep:
    stage: str
    agent: str
    depends_on: tuple[str, ...] = ()


PIPELINE: tuple[PipelineStep, ...] = (
    PipelineStep(stage="emotion", agent="emotion_analysis_agent"),
    PipelineStep(stage="distortion", agent="cognitive_distortion_agent", depends_on=("emotion",)),
    PipelineStep(stage="triage", agent="triage_agent", depends_on=("emotion", "distortion")),
    PipelineStep(stage="report", agent="report_agent", depends_on=("triage",)),
)


def build_plan() -> list[PipelineStep]:
    return list(PIPELINE)
