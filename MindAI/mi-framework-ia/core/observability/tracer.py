# -*- coding: utf-8 -*-
"""Trazabilidad por request_id / analysis_id sin registrar contenido clinico."""

import contextvars
import time
import uuid
from collections.abc import Iterator
from contextlib import contextmanager
from typing import Any

from core.observability.logger import get_logger, log_event

_request_id: contextvars.ContextVar[str | None] = contextvars.ContextVar("request_id", default=None)
_analysis_id: contextvars.ContextVar[str | None] = contextvars.ContextVar("analysis_id", default=None)


def new_request_id() -> str:
    return str(uuid.uuid4())


def set_request_id(value: str | None) -> str:
    request_id = value or new_request_id()
    _request_id.set(request_id)
    return request_id


def get_request_id() -> str | None:
    return _request_id.get()


def set_analysis_id(value: str | None) -> None:
    _analysis_id.set(value)


def get_analysis_id() -> str | None:
    return _analysis_id.get()


def _base_fields() -> dict[str, Any]:
    fields: dict[str, Any] = {}
    request_id = get_request_id()
    analysis_id = get_analysis_id()
    if request_id:
        fields["request_id"] = request_id
    if analysis_id:
        fields["analysis_id"] = analysis_id
    return fields


def trace_event(logger_name: str, event: str, **fields: Any) -> None:
    log_event(get_logger(logger_name), event, **_base_fields(), **fields)


@contextmanager
def trace_span(logger_name: str, event: str, **fields: Any) -> Iterator[None]:
    logger = get_logger(logger_name)
    started = time.perf_counter()
    log_event(logger, f"{event}.start", **_base_fields(), **fields)
    try:
        yield
    except Exception as exc:
        log_event(
            logger,
            f"{event}.error",
            **_base_fields(),
            **fields,
            error_type=type(exc).__name__,
            duration_ms=round((time.perf_counter() - started) * 1000, 2),
        )
        raise
    else:
        log_event(
            logger,
            f"{event}.end",
            **_base_fields(),
            **fields,
            duration_ms=round((time.perf_counter() - started) * 1000, 2),
        )
