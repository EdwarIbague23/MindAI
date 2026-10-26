# -*- coding: utf-8 -*-
"""Registro central de agentes disponibles para el orquestador."""

from typing import Any

from core.agent_base.base_agent import BaseAgent

AGENT_REGISTRY: dict[str, type[BaseAgent]] = {}


def register_agent(agent_cls: type[BaseAgent]) -> type[BaseAgent]:
    if agent_cls.name in AGENT_REGISTRY:
        raise ValueError(f"Agente duplicado: {agent_cls.name}")
    AGENT_REGISTRY[agent_cls.name] = agent_cls
    return agent_cls


def get_agent(agent_name: str) -> type[BaseAgent]:
    if agent_name not in AGENT_REGISTRY:
        raise KeyError(f"Agente no registrado: {agent_name}")
    return AGENT_REGISTRY[agent_name]


def list_agents() -> list[str]:
    return sorted(AGENT_REGISTRY)


def instantiate_agents(manifests: dict[str, dict[str, Any]], gateway: Any) -> dict[str, Any]:
    agents: dict[str, Any] = {}
    for name, agent_cls in AGENT_REGISTRY.items():
        config = manifests.get(name, {})
        if not config:
            continue
        agents[name] = agent_cls(config=config, gateway=gateway)
    return agents
