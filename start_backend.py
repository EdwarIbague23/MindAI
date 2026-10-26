#!/usr/bin/env python
"""Backend FastAPI Fase 1 - Versión directa sin dependencias de importación de paquete."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Crear aplicación FastAPI directamente
app = FastAPI(
    title="MindFlow AI - API Híbrida (Fase 1)",
    description="API REST asíncrona para plataforma híbrida Web + Mental Healthcare Medical - Fase 1: Estructura Inicial",
    version="1.0.0",
)

# CORS híbrido - configurado exactamente como especifica el plan
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:19000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    expose_headers=["X-Request-ID"],
    max_age=86400,
)

# Endpoints de salud
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "mindflow-api", "version": "1.0.0", "phase": "1"}

@app.get("/health/detailed", tags=["health"])
async def detailed_health():
    return {
        "status": "healthy",
        "service": "mindflow-api",
        "version": "1.0.0",
        "phase": "1",
        "components": {"fastapi": "ok", "cors": "configured"},
    }

@app.get("/api/v1/info", tags=["info"])
async def api_info():
    return {
        "title": "MindFlow AI - API Híbrida",
        "version": "1.0.0",
        "description": "API REST para plataforma híbrida de salud mental - Fase 1",
        "phase": "1",
        "endpoints": {"health": "/health, /health/detailed"},
}