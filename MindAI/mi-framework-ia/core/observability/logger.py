# -*- coding: utf-8 -*-
"""Logging estructurado en JSON con proteccion de datos clinicos.

Regla dura: este logger nunca debe recibir texto clinico, notas, resumenes ni
evidencia textual. Cualquier campo sensible se redacta antes de serializar.
"""

import json
import logging
import sys
from datetime import UTC, datetime
from typing import Any

SENSITIVE_FIELDS = {
    "note",
    "note_text",
    "text",
    "content",
    "clinica",
    "clinical_text",
    "anonymized_text",
    "encrypted_content",
    "encrypted_payload",
    "summary",
    "evidence",
    "justification",
    "transcript",
    "pii",
}

_REDACTED = "[REDACTED]"
_configured = False


def _sanitize(fields: dict[str, Any]) -> dict[str, Any]:
    sanitized: dict[str, Any] = {}
    for key, value in fields.items():
        if str(key).lower() in SENSITIVE_FIELDS:
            sanitized[key] = _REDACTED
            continue
        if isinstance(value, str | int | float | bool) or value is None:
            sanitized[key] = value
        else:
            sanitized[key] = str(value)
    return sanitized


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "timestamp": datetime.now(UTC).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "event": record.getMessage(),
        }
        fields = getattr(record, "fields", None)
        if isinstance(fields, dict):
            payload.update(_sanitize(fields))
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=False, default=str)


def configure_logging(level: str = "INFO") -> None:
    global _configured
    if _configured:
        return
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    root = logging.getLogger("mindflow")
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(level.upper())
    root.propagate = False
    _configured = True


def get_logger(name: str = "mindflow") -> logging.Logger:
    configure_logging()
    return logging.getLogger(name)


def log_event(logger: logging.Logger, event: str, **fields: Any) -> None:
    logger.info(event, extra={"fields": fields})
