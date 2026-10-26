# -*- coding: utf-8 -*-
"""Middleware de seguridad, request_id y logging HTTP sin contenido clinico."""

import time

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from core.observability.logger import get_logger, log_event
from core.observability.tracer import new_request_id, set_request_id

logger = get_logger("mindflow.http")


class SecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID") or new_request_id()
        set_request_id(request_id)
        request.state.request_id = request_id
        started = time.perf_counter()

        try:
            response = await call_next(request)
        except Exception as exc:
            log_event(
                logger,
                "http.request.error",
                request_id=request_id,
                method=request.method,
                path=request.url.path,
                error_type=type(exc).__name__,
                duration_ms=round((time.perf_counter() - started) * 1000, 2),
            )
            raise

        log_event(
            logger,
            "http.request.completed",
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration_ms=round((time.perf_counter() - started) * 1000, 2),
        )

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "no-referrer"
        return response
