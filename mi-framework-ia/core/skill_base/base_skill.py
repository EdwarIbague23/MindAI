"""Contract that all skills must implement: input/output schema and run()."""

from abc import ABC, abstractmethod


class BaseSkill(ABC):
    name: str = "unnamed_skill"

    @abstractmethod
    def run(self, params: dict) -> dict:
        """Executes the skill deterministically, without own state."""
        raise NotImplementedError
