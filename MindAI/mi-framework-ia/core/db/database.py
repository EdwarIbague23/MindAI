# -*- coding: utf-8 -*-
"""Motor async, sesiones y creacion de esquema con fallback Postgres -> SQLite."""

import asyncio
from collections.abc import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from core.config import get_settings
from core.db.models import Base

_engine: AsyncEngine | None = None
_session_factory: async_sessionmaker[AsyncSession] | None = None
_active_url: str | None = None


async def _try_engine(url: str) -> AsyncEngine | None:
    engine = create_async_engine(url, future=True, pool_pre_ping=True)
    try:
        async with engine.connect() as connection:
            await asyncio.wait_for(connection.execute(text("SELECT 1")), timeout=3)
        return engine
    except Exception:
        await engine.dispose()
        return None


async def init_db() -> str:
    global _engine, _session_factory, _active_url
    if _engine is not None:
        return _active_url or ""

    settings = get_settings()
    candidates = [settings.database_url]
    if settings.allow_sqlite_fallback:
        candidates.append(settings.sqlite_fallback_url)

    for url in candidates:
        engine = await _try_engine(url)
        if engine is not None:
            _engine = engine
            _active_url = url
            break

    if _engine is None:
        raise RuntimeError("No fue posible conectar a PostgreSQL ni al fallback SQLite")

    _session_factory = async_sessionmaker(_engine, expire_on_commit=False, class_=AsyncSession)

    if settings.auto_create_tables:
        async with _engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)

    return _active_url or ""


async def close_db() -> None:
    global _engine, _session_factory, _active_url
    if _engine is not None:
        await _engine.dispose()
    _engine = None
    _session_factory = None
    _active_url = None


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    if _session_factory is None:
        raise RuntimeError("La base de datos no ha sido inicializada")
    return _session_factory


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    session_factory = get_session_factory()
    async with session_factory() as session:
        yield session


def active_database_url() -> str:
    return _active_url or ""
