# -*- coding: utf-8 -*-
"""Contrato que toda skill debe cumplir: input/output schema y run()."""

from abc import ABC, abstractmethod
from typing import Any


class BaseSkill(ABC):
    name: str = "unnamed_skill"

    @abstractmethod
    async def run(self, params: dict[str, Any]) -> dict[str, Any]:
        """Ejecuta la skill de forma deterministica, sin estado propio."""
        raise NotImplementedError
