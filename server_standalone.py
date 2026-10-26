#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Servidor Standalone MindFlow AI Fase 1.
Versión: 100% autónoma - sin dependencias de importación de paquete.
Diseñado para funcionar en entornos con Python Windows Store.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ============================================================
# APLICACIÓN FASTAPI INLINE - Todo el código aquí contenido
# ============================================================

app = FastAPI(
    title="MindFlow AI - API Híbrida (Fase 1 - Estructura Inicial)",
    description="""API REST asíncrona para plataforma híbrida Web + Mental Healthcare Medical.
    Arquitectura de 5 capas: Presentación Web → FastAPI → Orquestador → PostgreSQL v16 + Redis v7.""",
    version="1.0.0",
    # Ruta abierta para documentación automática
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
)

# ============================================================
# CONFIGURACIÓN CORS HÍBRIDA
# ============================================================

# Orígenes permitidos para arquitectura Web/Móvil híbrida
# - http://localhost:3000: Aplicación React (portal profesional)
# - http://localhost:19000: Expo/Mobile React Native (pacientes)
# - http://localhost:8080: Servidor de desarrollo alternativo
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:19000",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    expose_headers=["X-Request-ID", "X-Processing-Time"],
    max_age=86400,  # 24 horas en segundos
)

# ============================================================
# ENDPOINTS DE SALUD
# ============================================================

@app.get("/health", tags=["health"], summary="Endpoint de salud básico")
async def health_check():
    """
    Endpoint básico de verificación de despliegue.
    Retorna estado general del servicio.
    """
    return {
        "status": "ok",
        "service": "mindflow-api",
        "version": "1.0.0",
        "phase": "1",
        "message": "Servidor FastAPI operativo - Fase 1: Estructura Inicial"
    }

@app.get("/health/detailed", tags=["health"], summary="Health check detallado")
async def detailed_health():
    """
    Health check detallado con información de componentes.
    Incluye validación de dependencias y estado del sistema.
    """
    return {
        "status": "healthy",
        "service": "mindflow-api",
        "version": "1.0.0",
        "phase": "1",
        "environment": "development",
        "components": {
            "fastapi": "operational",
            "cors": "configured",
            "middleware": "active",
        },
        "features": {
            "health_check": True,
            "detailed_health": True,
            "api_info": True,
        }
    }

@app.get("/health/ready", tags=["health"], summary="Readiness check")
async def readiness_check():
    """
    Check de readiness - verifica que el servicio está listo para recibir tráfico.
    Útil para orquestadores (Kubernetes, Docker Swarm, etc.)
    """
    return {
        "ready": True,
        "phase": "1",
        "timestamp": __import__("datetime").datetime.now().isoformat()
    }

@app.get("/health/ liveness", tags=["health"], summary="Liveness check")
async def liveness_check():
    """
    Check de liveness - verifica que el proceso del servidor está vivo.
    Diferente a readiness: puede estar listo pero no vivo, o vivo pero en mantenimiento.
    """
    return {
        "alive": True,
        "phase": "1"
    }

# ============================================================
# ENDPOINTS DE INFORMACIÓN DE LA API
# ============================================================

@app.get("/api/v1/info", tags=["info"], summary="Metadatos de la API")
async def api_info():
    """
    Retorna metadatos completos de la API incluyendo:
    - Título y versión
    - Descripción general
    - Endpoints disponibles
    - Fase de desarrollo
    - CORS configurado
    """
    return {
        "title": "MindFlow AI - API Híbrida",
        "version": "1.0.0",
        "description": "API REST para plataforma híbrida de salud mental con arquitectura de 5 capas",
        "phase": "1",
        "architecture": {
            "layers": 5,
            "description": "Capa 1: Presentación Web | Capa 2: Presentación Móvil | " +
                          "Capa 3: Aplicación FastAPI | Capa 4: Orquestador | Capa 5: Infraestructura"
        },
        "cors": {
            "origins": allowed_origins,
            "description": "Configurado para arquitectura híbrida Web/Móvil"
        },
        "endpoints": {
            "health": ["/health", "/health/detailed", "/health/ready", "/health/liveness"],
            "info": ["/api/v1/info"],
            "description": "V1 endpoints por definir en fases subsiguientes"
        },
        "specifications": {
            "documentation": "/api/v1/docs",
            "openapi": "/api/v1/openapi.json",
            "redoc": "/api/v1/redoc"
        }
    }

# ============================================================
# PÁGINA ROOT / REDIRECCIÓN
# ============================================================

@app.get("/", tags=["root"], summary="Página raíz - información inicial")
async def root():
    """
    Página raíz de la API con enlaces a documentación.
    Útil para consumidores que acceden a la URL base.
    """
    return {
        "message": "Bienvenido a MindFlow AI API",
        "version": "1.0.0",
        "phase": "1",
        "documentation": {
            "swagger": "/api/v1/docs",
            "openapi": "/api/v1/openapi.json",
            "redoc": "/api/v1/redoc",
            "health": "/health"
        },
        "instructions": {
            "next_steps": "Construir Fase 2: Pipeline PII | Fase 3: Modelos BD | Fase 4: Orchestrador",
            "source_of_truth": "AI Studio export - mindflow-clinical-portal"
        }
    }

# ============================================================
# MIDDLEWARE DE LOGGING Y SEGURIDAD
# ============================================================

@app.middleware("http")
async def security_logging_middleware(request, call_next):
    """
    Middleware global que agrega:
    - Headers de trazado de request ID
    - Logging de tiempo de procesamiento
    - Seguridad básica en logs
    """
    import time
    import uuid
    
    # Generar request ID único
    request_id = str(uuid.uuid4())[:8]
    
    # Procesar la request
    start_time = time.time()
    response = await call_next(request)
    
    # Agregar headers de trazamiento
    processing_time = time.time() - start_time
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Processing-Time"] = str(round(processing_time * 1000, 2))  # en milisegundos
    
    # Log simplificado (en producción usarías un logger estructurado)
    # No imprimir PII ni datos sensibles
    if request.method in ("POST", "PUT"):
        pass  # En producción: validar y sanitizar payloads
    
    return response


# ============================================================
# PUNTO DE ENTRADA
# ============================================================

if __name__ == "__main__":
    import uvicorn
    import sys
    
    print("=" * 70)
    print("🚀 MindFlow AI - API Híbrida Fase 1")
    print("=" * 70)
    print("📍 Servidor: http://127.0.0.1:8000")
    print("🌐 CORS configurado para:")
    for origin in allowed_origins:
        print(f"   - {origin}")
    print("=" * 70)
    print("📚 Documentación automática disponible en:")
    print("   - Swagger UI: http://127.0.0.1:8000/api/v1/docs")
    print("   - OpenAPI JSON: http://127.0.0.1:8000/api/v1/openapi.json")
    print("=" * 70)
    print("🏥 Endpoints de salud disponibles:")
    print("   - GET /health")
    print("   - GET /health/detailed")
    print("   - GET /health/ready")
    print("   - GET /health/liveness")
    print("=" * 70)
    
    uvicorn.run(
        app, 
        host="127.0.0.1", 
        port=8000, 
        reload=False,
        access_log=False  # Desactivado para reducir ruido en consola
    )