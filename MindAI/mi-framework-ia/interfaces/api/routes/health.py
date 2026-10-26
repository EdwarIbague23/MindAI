# -*- coding: utf-8 -*-
from fastapi import APIRouter
from sqlalchemy import text

from core.config import get_settings
from core.db.database import active_database_url, get_session_factory

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict[str, str]:
    settings = get_settings()
    url = active_database_url()
    database = "sqlite" if url.startswith("sqlite") else "postgresql" if url else "uninitialized"
    db_status = "ok"

    try:
        factory = get_session_factory()
        async with factory() as session:
            await session.execute(text("SELECT 1"))
    except Exception:
        db_status = "unavailable"

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "service": "mindflow-ai",
        "database": database,
        "database_status": db_status,
        "llm_mode": settings.llm_mode,
        "llm_provider": settings.llm_provider if settings.llm_mode == "real" else "mock",
    }
