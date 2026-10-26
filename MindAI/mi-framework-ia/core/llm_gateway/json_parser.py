# -*- coding: utf-8 -*-
"""Parser tolerante de JSON devuelto por el LLM (markdown, texto extra, etc.)."""

import json
import re
from typing import Any

from core.errors import StructuredOutputError

FENCE_RE = re.compile(r"```(?:json)?\s*(.*?)```", re.DOTALL | re.IGNORECASE)


def parse_json_response(raw: str) -> dict[str, Any]:
    if not raw or not raw.strip():
        raise StructuredOutputError("El modelo devolvio una respuesta vacia")

    candidate = raw.strip()
    fence_match = FENCE_RE.search(candidate)
    if fence_match:
        candidate = fence_match.group(1).strip()
    else:
        start = candidate.find("{")
        end = candidate.rfind("}")
        if start != -1 and end != -1 and end > start:
            candidate = candidate[start : end + 1]

    try:
        data = json.loads(candidate)
    except json.JSONDecodeError as exc:
        raise StructuredOutputError("La respuesta del modelo no es JSON valido") from exc

    if not isinstance(data, dict):
        raise StructuredOutputError("La respuesta del modelo debe ser un objeto JSON")
    return data
