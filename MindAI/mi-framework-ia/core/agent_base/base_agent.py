# -*- coding: utf-8 -*-
"""Clase abstracta que define el ciclo de vida de un agente.

Todo agente concreto (en agents/) hereda de BaseAgent e implementa run().
Opcionalmente hereda de AgentMixin para obtener permisos del manifiesto.
"""

from abc import ABC, abstractmethod
from typing import Any

from core.security.permissions import ensure_skill_allowed


class BaseAgent(ABC):
    name: str = "unnamed_agent"
    role: str = "emotion_analysis"

    def __init__(self, config: dict[str, Any] | None = None, gateway: Any | None = None) -> None:
        self.config = config or {}
        self.gateway = gateway

    @property
    def allowed_skills(self) -> list[str]:
        return list((self.config.get("permissions") or {}).get("allowed_skills") or [])

    def require_skill(self, skill_name: str) -> None:
        ensure_skill_allowed(self.name, skill_name, self.allowed_skills)

    @abstractmethod
    async def run(self, task: dict[str, Any]) -> dict[str, Any]:
        """Ejecuta la tarea y devuelve un resultado estructurado."""
        raise NotImplementedError
