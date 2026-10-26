#!/usr/bin/env python
"""Script de inicio directo para la Fase 1 de MindFlow AI.

Levanta el servidor FastAPI de la Fase 1 sin dependencias de recarga complejas.
"""

import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Crear la aplicación FastAPI (mismo contenido que main.py)
app = FastAPI(
    title="MindFlow AI - API Híbrida (Fase 1)",
    description="API REST asíncrona para plataforma híbrida Web + Mental Healthcare Medical - Fase 1: Estructura Inicial",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
)

# Configurar CORS híbrido
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

# Endpoints básicos
@app.get("/health", tags=["health"])
async def health_check() -> dict:
    return {"status": "ok", "service": "mindflow-api", "version": "1.0.0", "phase": "1"}

@app.get("/health/detailed", tags=["health"])
async def detailed_health() -> dict:
    return {
        "status": "healthy",
        "service": "mindflow-api",
        "version": "1.0.0",
        "phase": "1",
        "components": {"fastapi": "ok", "cors": "configured"},
    }

@app.get("/api/v1/info", tags=["info"])
async def api_info() -> dict:
    return {
        "title": "MindFlow AI - API Híbrida",
        "version": "1.0.0",
        "description": "API REST para plataforma híbrida de salud mental - Fase 1",
        "phase": "1",
        "endpoints": {"health": "/health, /health/detailed"},
}

if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("🚀 MindFlow AI - API Híbrida Fase 1")
    print("=" * 60)
    print("📍 Servidor: http://127.0.0.1:8000")
    print("🌐 CORS: http://localhost:3000, http://localhost:19000, http://localhost:8080")
    print("=" * 60)
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)