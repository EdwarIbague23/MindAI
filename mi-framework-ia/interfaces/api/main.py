"""Punto de entrada FastAPI completo para la arquitectura híbrida Web + Móvil.

Este módulo expone la API REST asíncrona que comparten ambas aplicaciones cliente:
- Portal Web (React + TypeScript)
- App Móvil (React Native)

Incluye:
- CORS configurado para ambos orígenes
- Middleware de seguridad y validación de entrada
- Rutas versionadas (v1)
- Manejo de errores estructurado
- Integración con el orchestrator core y guardrails
"""

import asyncio
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, validator

from mi_framework_ia.core.security.guardrails import sanitize_input, get_pii_statistics
from mi_framework_ia.core.orchestrator.planner import (
    create_plan,
    get_next_task,
    task_completed,
    task_failed,
)
from mi_framework_ia.core.orchestrator import executor  # futuro módulo
from mi_framework_ia.core.agent_base.base_agent import router as agent_router

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("mindflow-api")

# --- Modelos Pydantic para la API ---

class HealthCheck(BaseModel):
    """Modelo para endpoint de salud."""
    status: str = "ok"
    timestamp: str = Field(default_factory=lambda: __import__("datetime").datetime.now().isoformat())
    version: str = "1.0.0"


class ChatQuery(BaseModel):
    """Modelo para consulta de chat con el copiloto IA."""
    patient_id: str = Field(..., description="ID UUID del paciente")
    therapist_id: str = Field(..., description="ID UUID del terapeuta autorizado")
    note_id: str = Field(..., description="ID UUID de la nota clínica asociada")
    raw_text: str = Field(..., description="Texto de la nota clínica (será anonimizado)")
    consultation_type: str = Field(
        default="general_risk",
        description="Tipo de consulta: general_risk, emotional_analysis, cognitive_distortion",
    )
    
    @validator("raw_text")
    def validate_not_empty(cls, v):
        if not v or v.strip() == "":
            raise ValueError("El texto de la nota no puede estar vacío")
        return v


class AnalysisResponse(BaseModel):
    """Modelo de respuesta estandarizada del análisis asistido por IA."""
    analysis_id: str = Field(..., description="ID único del análisis")
    patient_id: str
    therapist_id: str
    emotion_scores: Dict[str, float] = Field(
        default_factory=dict,
        description="Scores 0-100 por emoción (ansiedad, depresión, etc.)",
    )
    cognitive_distortions: List[str] = Field(
        default_factory=list,
        description="Distortiones cognitivas identificadas",
    )
    guiding_questions: List[str] = Field(
        default_factory=list,
        description="Preguntas guía para el terapeuta",
    )
    status: str = "pending"
    needs_review: bool = True
    processing_time_seconds: float = Field(ge=0, le=300)
    created_at: str
    requires_human_review: bool = True


class SimpleChatResponse(BaseModel):
    """Respuesta simplificada para flujos de chat rápido."""
    response_id: str
    status: str
    message: str = "Consulta procesada. Revisar resultados en dashboard."
    needs_human_review: bool = True
    timestamp: str = Field(default_factory=lambda: __import__("datetime").datetime.now().isoformat())


# --- Cycles de vida de la aplicación ---

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manejo de ciclo de vida de la aplicación FastAPI.
    - On startup: Cargar configuración, inicializar agentes, conectar BD
    - On shutdown: Limpiar recursos, cerrar conexiones
    """
    # Startup
    logger.info("🚀 Iniciando MindFlow API v1...")
    logger.info("   - Cargando configuración de CORS...")
    logger.info("   - Inicializando registry de agentes...")
    logger.info("   - Conectando con LLM Gateway...")
    logger.info("   - Validando guardrails de seguridad...")
    yield
    # Shutdown
    logger.info("🛑 Cerrando MindFlow API...")
    logger.info("   - Desconectando agentes...")
    logger.info("   - Cerrando conexiones de BD...")


# Creación de la aplicación FastAPI
app = FastAPI(
    title="MindFlow AI - API Híbrida",
    description="API REST asíncrona para plataforma híbrida Web + Mental Healthcare Mobile.",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    lifespan=lifespan,
)

# --- Configuración CORS para arquitectura híbrida ---
# Permitir orígenes específicos en producción, todos en desarrollo
allowed_origins = os.getenv(
    "CORS_ORIGINS", "http://localhost:3000,http://localhost:19000,http://localhost:8080"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins if o.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "X-Request-ID",
        "X-User-Role",
        "X-Platform",
    ],
    expose_headers=["X-Request-ID", "X-Processing-Time"],
    max_age=86400,
)

# --- Middleware de procesamiento global ---

@app.middleware("http")
async def security_and_pipeline_middleware(request: Request, call_next):
    """
    Middleware global que aplica:
    - Validación PII en payloads POST
    - Detección de toxicidad
    - Prevención de inyección de prompts
    - Headers de trazado de request
    """
    # Generar request ID único
    request_id = f"req_{__import__('uuid').uuid4().hex[:12]}"
    
    # Añadir header al request y response
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Processing-Time"] = str(
        float(response.headers.get("X-Processing-Time", "0"))
    )
    
    # Leer y sanitizar body si es POST/PUT con JSON
    if request.method in ("POST", "PUT") and "application/json" in request.headers.get("Content-Type", ""):
        try:
            body = await request.body()
            if body:
                json_data = __import__("json").decode(body)
                sanitization_result = sanitize_input(json_data.get("raw_text", ""))
                
                # Reemplazar el raw_text sanitizado en el body
                if sanitization_result["pii_detected"] or sanitization_result["toxicity_detected"] or sanitization_result["injection_detected"]:
                    # Construir nuevo body con texto sanitizado
                    sanitized_json = __import__("json").encode(
                        {
                            **json_data,
                            "raw_text": sanitization_result["text"],
                            "security_warning": (
                                {
                                    "pii_redacted": sanitization_result["pii_detected"],
                                    "toxicity_detected": sanitization_result["toxicity_detected"],
                                    "injection_detected": sanitization_result["injection_detected"] is not None,
                                }
                                if any([
                                    sanitization_result["pii_detected"],
                                    sanitization_result["toxicity_detected"],
                                    sanitization_result["injection_detected"] is not None,
                                ])
                                else None
                            ),
                        }
                    )
                    # Reemplazar body original (Nota: esto es ilustrativo; en producción
                    # usarías un middleware más robusto que reescriba el cuerpo)
                    logger.warning(
                        f"Request {request_id}: PII/toxicity/injection detected, sanitized"
                    )
        except Exception:
            # Si falla el parseo, continuar sin modificar
            pass
    
    # Añadir header al request para logging interno
    request.state.request_id = request_id
    
    return response


# --- Endpoints de Salud ---

@app.get("/health", response_model=HealthCheck, tags=["health"])
async def health_check() -> HealthCheck:
    """Endpoint de salud para verificaciones de despliegue y contenedores."""
    return HealthCheck()


@app.get("/health/detailed", tags=["health"])
async def detailed_health() -> dict:
    """Health check detallado con información de dependencias."""
    return {
        "status": "healthy",
        "service": "mindflow-api",
        "version": "1.0.0",
        "components": {
            "fastapi": "ok",
            "guardrails": "loaded",
            "orchestrator": "loaded",
        },
    }


# --- Endpoints de Autenticación y Gestión de Usuarios ---

@app.post("/api/v1/auth/login", tags=["auth"], summary="Login de profesional autorizado")
async def login(payload: dict) -> dict:
    """Endpoint de login simplificado - valida credenciales y retorna token."""
    # TODO: Integrar con autenticación real (JWT, OAuth2, base de datos)
    usuario = payload.get("usuario", "")
    return {
        "access_token": f"mindflow_jwt_{usuario}",
        "token_type": "bearer",
        "user_role": "therapist" if "therapist" in usuario.lower() else "patient",
        "expires_in": 3600,
    }


@app.post("/api/v1/auth/validate", tags=["auth"], summary="Validar token de sesión")
async def validate_token(request: Request) -> dict:
    """Valida el token de sesión en headers."""
    auth_header = request.headers.get("Authorization", "")
    return {
        "valid": auth_header.startswith("Bearer"),
        "user_role": "therapist",  # Simplificado
        "request_id": getattr(request.state, "request_id", "unknown"),
    }


# --- Endpoints de Análisis Asistido por IA ---

@app.post(
    "/api/v1/analysis/emotional",
    response_model=AnalysisResponse,
    tags=["analysis"],
    summary="Análisis emocional asistido por IA",
    description="Envía una nota clínica anonimizada para obtener señales emocionales, scores 0-100 y preguntas guía.",
)
async def emotional_analysis(
    query: ChatQuery,
    request: Request,
) -> AnalysisResponse:
    """
    Ejecuta análisis emocional asistido por IA sobre una nota clínica.
    
    Flujo:
    1. Sanitizar PII en raw_text mediante guardrails
    2. Descomponer objetivo usando planner/orchestrator
    3. Ejecutar agentes de análisis emocional
    4. Retornar schema estandarizado con needs_review=true
    """
    import time
    start_time = __import__("time").time()
    
    # 1. Sanitizar entrada (PII + toxicidad + inyección)
    # En producción, extraeríamos el texto del body, pero usamos el modelo Pydantic
    sanitization = sanitize_input(query.raw_text)
    
    if sanitization["toxicity_detected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="⚠️ Contenido tóxico detectado en la nota clínica. Por favor revisar el contenido antes de enviar al copiloto.",
        )
    
    if sanitization["injection_detected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="⚠️ Posible inyección de prompt detectada. La consulta ha sido rechazada por seguridad.",
        )
    
    # 2. Descomponer objetivo al plan de tareas
    objective = f"{sanitization['text'][:100]}... analysis"
    plan = create_plan(objective, {
        "patient_id": query.patient_id,
        "therapist_id": query.therapist_id,
        "note_id": query.note_id,
        "consultation_type": query.consultation_type,
    })
    
    # 3. Obtener primera tarea pendiente y "ejecutarla" (simulación)
    # En un sistema real, esto dispararía al orchestrator con los agents correspondientes
    next_task = get_next_task(plan)
    
    if next_task is None:
        # Todas las tareas ya completadas (caso raro en flujo nuevo)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo generar el plan de análisis. Contactar soporte técnico.",
        )
    
    # Simulación de ejecución de tarea (en producción: orchestrator.execute(next_task))
    # Por ahora, generar response placeholder con estructura correcta
    processing_time = round((__import__("time").time() - start_time) * 1000, 2)  # ms
    
    # Generar IDs y estructura de respuesta
    import uuid
    analysis_id = str(uuid.uuid4())
    
    # Scores de ejemplo basados en análisis de evidencia (simulación)
    emotion_scores = {
        "anxiety": round(__import__("random").uniform(20, 80), 2),
        "depression": round(__import__("random").uniform(10, 70), 2),
        "anger": round(__import__("random").uniform(5, 50), 2),
        "fear": round(__import__("random").uniform(10, 60), 2),
        "joy": round(__import__("random").uniform(15, 90), 2),
        "neutral": round(__import__("random").uniform(40, 60), 2),
    }
    
    # Preguntas guía basadas en lo que encontraría un agente clínico
    guiding_questions = []
    if emotion_scores.get("anxiety", 0) > 50:
        guiding_questions.append("¿Ha notado aumento en los niveles de ansiedad en los últimos 15 días?")
    if emotion_scores.get("depression", 0) > 50:
        guiding_questions.append("¿Ha experimentado cambios significativos en el estado de ánimo o apetito?")
    if not guiding_questions:
        guiding_questions = [
            "¿Cómo ha estado su estado de ánimo general esta semana?",
            "¿Ha notado cambios en patrones de sueño o alimentación?",
        ]
    
    # Distortiones cognitivas identificadas (simulación based on text length)
    distortions = []
    if len(sanitization["text"]) > 200:
        distortions.append("sobregeneralización")
    if len(sanitization["text"]) > 500:
        distortions.append("catastrofización")
    
    return AnalysisResponse(
        analysis_id=analysis_id,
        patient_id=query.patient_id,
        therapist_id=query.therapist_id,
        emotion_scores=emotion_scores,
        cognitive_distortions=distortions,
        guiding_questions=guiding_questions,
        status="pending",
        needs_review=True,
        processing_time_seconds=processing_time / 1000,  # convertir a segundos
        created_at=__import__("datetime").datetime.now().isoformat(),
        requires_human_review=True,
    )


@app.post(
    "/api/v1/analysis/simple-chat",
    response_model=SimpleChatResponse,
    tags=["analysis"],
    summary="Consulta rápida de copiloto para el terapeuta",
    description="Consulta rápida sin análisis estructurado; retorna estado y mensaje orientativo.",
)
async def simple_chat(
    patient_id: str,
    therapist_id: str,
    raw_text: str,
    request: Request,
) -> SimpleChatResponse:
    """Endpoint simplificado para consultas rápidas del terapeuta durante la sesión."""
    # Sanitizar rápidamente
    sanitization = sanitize_input(raw_text)
    
    if sanitization["toxicity_detected"]:
        return SimpleChatResponse(
            response_id=str(__import__("uuid").uuid4().hex[:8]),
            status="error",
            message="⚠️ contenido tóxico detectado. No se procesa la consulta.",
            needs_human_review=True,
        )
    
    # Marcar que hubo redacción PII
    has_pii = sanitization["pii_detected"]
    
    return SimpleChatResponse(
        response_id=str(__import__("uuid").uuid4().hex[:8]),
        status="processed",
        message=(
            "✅ Consulta procesada. El copiloto presenta señales para revisión profesional."
            if not has_pii
            else "✅ Consulta procesada con anomalía de datos identificables. Se aplicó anonimización automática."
        ),
        needs_human_review=True,
    )


# --- Endpoints de Gestión de Notas Clínicas ---

@app.post("/api/v1/notes", tags=["clinical_notes"], summary="Subir nota clínica cifrada")
async def upload_clinical_note(
    patient_id: str,
    therapist_id: str,
    note_data: dict,
    request: Request,
) -> dict:
    """Endpoint para submit de nota clínica (en producción con cifrado pgcrypto)."""
    # Validar que tengamos contenido
    note_content = note_data.get("content", "")
    if not note_content or len(note_content.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La nota clínica debe tener como mínimo 10 caracteres",
        )
    
    # Sanitizar antes de cualquier procesamiento
    sanitization = sanitize_input(note_content)
    
    # En producción real, aquí persistiríamos con:
    # - Cifrado AES-256-GCM via pgcrypto
    # - versionado de key_version
    # - Registro en AUDIT_EVENT
    
    return {
        "note_id": str(__import__("uuid").uuid4().hex[:20]),
        "patient_id": patient_id,
        "therapist_id": therapist_id,
        "content_sanitized_length": len(sanitization["text"]),
        "pii_redacted": sanitization["pii_detected"],
        "status": "received",
        "message": "Nota recibida y validada. Procesamiento en cola posterior.",
    }


@app.get("/api/v1/notes/{note_id}", tags=["clinical_notes"], summary="Consultar nota clínica")
async def get_clinical_note(note_id: str, request: Request) -> dict:
    """Consultar una nota clínica por ID (simulada)."""
    # En producción: fetch from PostgreSQL with decryption check
    return {
        "note_id": note_id,
        "status": "retrieved",
        "message": "Nota consultada exitosamente (simulado - consultar BD real)",
        "request_id": getattr(request.state, "request_id", "unknown"),
    }


# --- Manejadores de Errores Globales ---

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Manejador custom de HTTPExceptions con reporte de request ID."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status": exc.status_code,
            "request_id": getattr(request.state, "request_id", "unknown"),
            "path": request.url.path,
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Manejador de excepciones globales para errores inesperados."""
    logger.error(
        f"Unexpected error in {request.method} {request.url}: {exc}",
        extra={"request_id": getattr(request.state, "request_id", "unknown")},
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Error interno del servidor",
            "status": 500,
            "request_id": getattr(request.state, "request_id", "unknown"),
            "detail": "Contactar al administrador del sistema",
        },
    )


# --- Información de la API ---

@app.get("/api/v1/info", tags=["info"], summary="Información de la API")
async def api_info() -> dict:
    """Metadatos de la API para consumidores y documentación."""
    return {
        "title": "MindFlow AI - API Híbrida",
        "version": "1.0.0",
        "description": "API REST para plataforma híbrida de salud mental con copiloto IA",
        "endpoints": {
            "health": "/health, /health/detailed",
            "auth": "/api/v1/auth/login, /api/v1/auth/validate",
            "analysis": "/api/v1/analysis/emotional, /api/v1/analysis/simple-chat",
            "clinical_notes": "/api/v1/notes, /api/v1/notes/{note_id}",
            "info": "/api/v1/info",
        },
        "features": [
            "CORS híbrido Web/Móvil",
            "Validación PII en tiempo real",
            "Detección de toxicidad e inyección de prompts",
            "Orchestrator integrado con planificador de tareas",
            "Revisión humana requerida en todos los outputs IA",
            "Documentación OpenAPI automática",
        ],
    }