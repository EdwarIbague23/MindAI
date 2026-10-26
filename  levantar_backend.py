#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Levantador de Backend FastAPI para MindFlow AI Fase 1.
Versión: Autónoma (sin dependencias de paquete mi_framework_ia).
"""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Crear aplicación FastAPI desde cero (inline)
app = FastAPI(
    title="MindFlow AI - API Híbrida (Fase 1 - Estructura Inicial)",
    description="API REST asíncrona para plataforma híbrida Web + Mental Healthcare Medical - Fase 1: Estructura Inicial",
    version="1.0.0",
)

# Configurar CORS híbrido exactamente como lo requiere el plan
allowed_origins = [
    "http://localhost:3000",  # Aplicación React (portal profesional)
    "http://localhost:19000", # Expo/Mobile React Native (pacientes)
    "http://localhost:8080",  # Servidor de desarrollo alternativo
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

# Endpoints básicos Fase 1
@app.get("/health", tags=["health"], summary="Health check básico")
async def health_check():
    """Endpoint básico de verificación de despliegue."""
    return {"status": "ok", "service": "mindflow-api", "version": "1.0.0", "phase": "1"}

@app.get("/health/detailed", tags=["health"], summary="Health check detallado")
async def detailed_health():
    """Health check con información de componentes."""
    return {
        "status": "healthy",
        "service": "mindflow-api",
        "version": "1.0.0",
        "phase": "1",
        "components": {"fastapi": "ok", "cors": "configured"},
    }

@app.get("/api/v1/info", tags=["info"], summary="Metadatos de la API")
async def api_info():
    """Metadatos de la API para consumidores y documentación."""
    return {
        "title": "MindFlow AI - API Híbrida",
        "version": "1.0.0",
        "description": "API REST para plataforma híbrida de salud mental - Fase 1",
        "phase": "1",
        "endpoints": {
            "health": "/health, /health/detailed",
        },
    }


if __name__ == "__main__":
    print("=" * 60)
    print("🚀 MindFlow AI - API Híbrida Fase 1")
    print("=" * 60)
    print("📍 Servidor: http://127.0.0.1:8000")
    print("🌐 CORS: http://localhost:3000, http://localhost:19000, http://localhost:8080")
    print("=" * 60)
    print("📚 Documentación automática:")
    print("   - Swagger: http://127.0.0.1:8000/api/v1/docs")
    print("   - OpenAPI: http://127.0.0.1:8000/api/v1/openapi.json")
    print("=" * 60)
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)