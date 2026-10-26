# -*- coding: utf-8 -*-
"""Registro central de skills disponibles para los agentes."""

from core.skill_base.base_skill import BaseSkill

SKILL_REGISTRY: dict[str, type[BaseSkill]] = {}


def register_skill(skill_cls: type[BaseSkill]) -> type[BaseSkill]:
    if skill_cls.name in SKILL_REGISTRY:
        raise ValueError(f"Skill duplicada: {skill_cls.name}")
    SKILL_REGISTRY[skill_cls.name] = skill_cls
    return skill_cls


def get_skill(skill_name: str) -> type[BaseSkill]:
    if skill_name not in SKILL_REGISTRY:
        raise KeyError(f"Skill no registrada: {skill_name}")
    return SKILL_REGISTRY[skill_name]


def list_skills() -> list[str]:
    return sorted(SKILL_REGISTRY)
