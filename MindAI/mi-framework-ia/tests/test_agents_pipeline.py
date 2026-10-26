# -*- coding: utf-8 -*-
from pathlib import Path

import pytest

import agents  # noqa: F401  (registra los agentes MindFlow)
from core.agent_base.agent_registry import AGENT_REGISTRY, instantiate_agents
from core.llm_gateway.gateway import LLMGateway
from core.llm_gateway.providers import MockLLMProvider
from core.manifest_validator import load_and_validate
from core.orchestrator.orchestrator import AnalysisOrchestrator

MIND_FLOW_AGENTS = {
    "emotion_analysis_agent",
    "cognitive_distortion_agent",
    "triage_agent",
    "report_agent",
}

NOTE = (
    "Me siento muy ansioso y triste. Siempre creo que todo va a salir mal y es un desastre. "
    "No puedo dormir y me cuesta concentrarme."
)


def _manifests() -> dict[str, dict]:
    agents_doc, _ = load_and_validate("config")
    return {agent["name"]: agent for agent in agents_doc}


def test_agents_import_registry_and_instantiation():
    assert MIND_FLOW_AGENTS <= set(AGENT_REGISTRY)
    gateway = LLMGateway(provider=MockLLMProvider())
    instances = instantiate_agents(_manifests(), gateway)
    assert MIND_FLOW_AGENTS <= set(instances)
    assert all(instance.gateway is gateway for instance in instances.values())


@pytest.mark.asyncio
async def test_full_pipeline_runs_all_four_agents_and_writes_report(tmp_path):
    gateway = LLMGateway(provider=MockLLMProvider())
    orchestrator = AnalysisOrchestrator(gateway)

    assert set(orchestrator.agents) == MIND_FLOW_AGENTS

    analysis, report = await orchestrator.run(NOTE, str(tmp_path))

    assert analysis.emotions
    assert analysis.triage_level in {"low", "medium", "high"}
    assert report["format"] == "markdown"
    assert Path(report["file_path"]).is_file()
    assert gateway.cost_tracker.snapshot()

    report_again = await orchestrator.generate_report(analysis, str(tmp_path))
    assert report_again["file_path"] == report["file_path"]
