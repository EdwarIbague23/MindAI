# -*- coding: utf-8 -*-
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import get_settings
from core.db.database import close_db, init_db
from core.llm_gateway.gateway import LLMGateway
from core.orchestrator.orchestrator import AnalysisOrchestrator
from interfaces.api.errors import register_exception_handlers
from interfaces.api.middleware.security import SecurityMiddleware
from interfaces.api.routes import analysis, auth, health, reports, sessions


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    await init_db()
    app.state.gateway = LLMGateway(
        settings=settings,
        max_requests_per_minute=settings.llm_rate_limit_per_minute,
    )
    app.state.orchestrator = AnalysisOrchestrator(app.state.gateway)
    yield
    await close_db()


app = FastAPI(
    title="MindFlow AI API",
    description="Copiloto de Triaje y Analisis Emocional para Terapeutas",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(SecurityMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(sessions.router)
app.include_router(analysis.router)
app.include_router(reports.router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "MindFlow AI API", "docs": "/docs"}
