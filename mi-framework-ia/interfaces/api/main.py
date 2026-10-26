"""Punto de entrada FastAPI báslico - Fase 1 Estructura Inicial.

Este módulo crea la aplicación FastAPI con configuración mínima para levantar
el servidor en localhost:8000 con CORS híbrido Web/Móvil.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Creación de la aplicación FastAPI
app = FastAPI(
    title="MindFlow AI - API Híbrida (Fase 1)",
    description="API REST asíncrona para plataforma híbrida Web + Mental Healthcare Mobile - Fase 1: Estructura Inicial",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
)

# --- Configuración CORS para arquitectura híbrida ---
# Permitir orígenes específicos en producción, todos en desarrollo
allowed_origins = [
    "http://localhost:3000",  # Web React
    "http://localhost:19000", # Mobile React Native
    "http://localhost:8080",  # Alternativa Mobile
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    expose_headers=["X-Request-ID"],
    max_age=86400,
)

# --- Endpoints básicos ---

@app.get("/health", tags=["health"])
async def health_check() -> dict:
    """Endpoint de salud básico."""
    return {"status": "ok", "service": "mindflow-api", "version": "1.0.0", "phase": "1"}

@app.get("/health/detailed", tags=["health"])
async def detailed_health() -> dict:
    """Health check detallado."""
    return {
        "status": "healthy",
        "service": "mindflow-api",
        "version": "1.0.0",
        "phase": "1",
        "components": {
            "fastapi": "ok",
            "cors": "configured",
        },
    }

# --- Ruta de información ---
@app.get("/api/v1/info", tags=["info"])
async def api_info() -> dict:
    """Metadatos de la API."""
    return {
        "title": "MindFlow AI - API Híbrida",
        "version": "1.0.0",
        "description": "API REST para plataforma híbrida de salud mental - Fase 1",
        "phase": "1",
        "endpoints": {
            "health": "/health, /health/detailed",
        },
    }