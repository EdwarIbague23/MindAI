# -*- coding: utf-8 -*-
"""Manejadores uniformes de errores de dominio."""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from core.errors import MindFlowError


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(MindFlowError)
    async def mindflow_error_handler(request: Request, exc: MindFlowError) -> JSONResponse:
        request_id = getattr(request.state, "request_id", None)
        return JSONResponse(
            status_code=exc.http_status,
            content={
                "error": exc.code,
                "message": exc.detail,
                "request_id": request_id,
            },
        )
