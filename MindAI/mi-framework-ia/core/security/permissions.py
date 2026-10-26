# -*- coding: utf-8 -*-
"""Control de permisos por agente y skill (principio de minimo privilegio)."""

from core.errors import PermissionDeniedError


def ensure_skill_allowed(agent_name: str, skill_name: str, allowed_skills: list[str]) -> None:
    if skill_name not in allowed_skills:
        raise PermissionDeniedError(f"El agente '{agent_name}' no tiene permitida la skill '{skill_name}'")


def ensure_data_scope(agent_name: str, requested_scope: str, declared_scope: str) -> None:
    if declared_scope == "none" or requested_scope not in {declared_scope, "own_session"}:
        raise PermissionDeniedError(
            f"El agente '{agent_name}' no puede acceder al alcance de datos '{requested_scope}'"
        )


def ensure_network_allowed(agent_name: str, network_access: str, requires_network: bool) -> None:
    if requires_network and network_access == "none":
        raise PermissionDeniedError(f"El agente '{agent_name}' no tiene acceso de red")
