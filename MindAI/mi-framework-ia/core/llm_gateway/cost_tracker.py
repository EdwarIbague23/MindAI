# -*- coding: utf-8 -*-
"""Contador en memoria de invocaciones, tokens y coste estimado por agente."""

from collections import defaultdict
from dataclasses import dataclass, field


@dataclass
class UsageRecord:
    calls: int = 0
    prompt_tokens: int = 0
    completion_tokens: int = 0
    cost_usd: float = 0.0


@dataclass
class CostTracker:
    records: dict[str, UsageRecord] = field(default_factory=lambda: defaultdict(UsageRecord))

    def record(
        self,
        agent: str,
        prompt_tokens: int = 0,
        completion_tokens: int = 0,
        cost_usd: float = 0.0,
    ) -> None:
        record = self.records[agent]
        record.calls += 1
        record.prompt_tokens += prompt_tokens
        record.completion_tokens += completion_tokens
        record.cost_usd += cost_usd

    def snapshot(self) -> dict[str, dict[str, float | int]]:
        return {
            agent: {
                "calls": record.calls,
                "prompt_tokens": record.prompt_tokens,
                "completion_tokens": record.completion_tokens,
                "cost_usd": round(record.cost_usd, 6),
            }
            for agent, record in self.records.items()
        }
