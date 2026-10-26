# -*- coding: utf-8 -*-
"""Guardrails de entrada/salida: validacion, riesgo y prohibicion de juicio clinico."""

import re
from typing import Any

from core.errors import StructuredOutputError, ValidationError

FORBIDDEN_OUTPUT_KEYS = {
    "diagnosis",
    "diagnostico",
    "diagnóstico",
    "prescription",
    "prescripcion",
    "prescripción",
    "treatment_plan",
    "plan_de_tratamiento",
    "tratamiento",
    "medicacion",
    "medicación",
}

RISK_PATTERNS = [
    re.compile(r"\bsuicid", re.IGNORECASE),
    re.compile(r"\bautolesion", re.IGNORECASE),
    re.compile(r"\bautolesión", re.IGNORECASE),
    re.compile(r"no\s+quiero\s+vivir", re.IGNORECASE),
    re.compile(r"quiero\s+morir", re.IGNORECASE),
    re.compile(r"matarme", re.IGNORECASE),
    re.compile(r"acabar\s+con\s+mi\s+vida", re.IGNORECASE),
]

HTML_RE = re.compile(r"<[^>]+>")


class Guardrails:
    MAX_INPUT_LENGTH = 10000

    @classmethod
    def validate_input(cls, text: str) -> tuple[bool, str]:
        if not text or not text.strip():
            return False, "El texto no puede estar vacio"
        if len(text) > cls.MAX_INPUT_LENGTH:
            return False, "El texto excede el maximo de 10000 caracteres"
        if "<script" in text.lower():
            return False, "El texto contiene contenido no permitido"
        return True, "ok"

    @classmethod
    def assert_valid_input(cls, text: str) -> None:
        ok, message = cls.validate_input(text)
        if not ok:
            raise ValidationError(message)

    @classmethod
    def detect_risk(cls, text: str) -> bool:
        return any(pattern.search(text or "") for pattern in RISK_PATTERNS)

    @classmethod
    def _find_forbidden_key(cls, payload: Any) -> str | None:
        if isinstance(payload, dict):
            for key, value in payload.items():
                if str(key).lower() in FORBIDDEN_OUTPUT_KEYS:
                    return str(key)
                found = cls._find_forbidden_key(value)
                if found:
                    return found
        elif isinstance(payload, list):
            for item in payload:
                found = cls._find_forbidden_key(item)
                if found:
                    return found
        return None

    @classmethod
    def assert_non_diagnostic(cls, payload: Any) -> None:
        forbidden = cls._find_forbidden_key(payload)
        if forbidden:
            raise StructuredOutputError(f"El modelo devolvio un campo clinico prohibido: {forbidden}")

    @classmethod
    def sanitize_output(cls, text: str) -> str:
        return HTML_RE.sub("", text or "").strip()
