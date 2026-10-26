# Backend — MindFlow AI

Estado: **implementado**. Este documento describe la arquitectura real del backend en
`MindAI/mi-framework-ia`. No incluye componentes planificados sin código.

## 1. Propósito

API REST para procesar notas clínicas anonimizadas, ejecutar un pipeline multi-agente
(emociones, distorsiones cognitivas, triaje y reporte), persistir resultados cifrados y
servir reportes Markdown al terapeuta autenticado.

## 2. Arquitectura

- **Clean Architecture ligera**: `core/` (dominio e infraestructura), `agents/` y `skills/`
  (capacidades), `interfaces/api/` (adaptadores de entrada).
- **Pipeline determinista**: `core/orchestrator/planner.py` define los pasos;
  `router.py` selecciona el agente; `executor.py` ejecuta y fusiona resultados;
  `orchestrator.py` carga manifiestos, instancia agentes y expone `run()`.
- **Registry Pattern**: `core/agent_base/agent_registry.py` y
  `core/skill_base/skill_registry.py`, poblados al importar `agents/__init__.py`.
- **Repository Pattern**: `core/db/repositories.py` abstrae usuarios, sesiones,
  análisis y reportes.
- **LLM Gateway**: `core/llm_gateway/gateway.py` con proveedores mock/OpenAI/Anthropic,
  parser JSON tolerante y `CostTracker`.
- **Seguridad en capas**: `core/security/pii_pipeline.py` (anonimización),
  `encryption_service.py` (AES-256-GCM), `guardrails.py`, `permissions.py`, `auth.py`.
- **Observabilidad**: `core/observability/logger.py` (JSON + redacción) y
  `tracer.py` (contextvars `request_id` / `analysis_id`).

### Flujo de una solicitud

```
POST /analysis/analyze
  -> validar JWT y ownership de sesión
  -> anonimizar nota (PII)
  -> orquestador:
       emotion_analysis_agent
       cognitive_distortion_agent
       triage_agent
       report_agent
  -> cifrar y persistir AnalysisResult + Report
  -> responder AnalysisResult con report_url
```

## 3. Stack (versiones reales)

| Tecnología | Versión | Uso |
|---|---|---|
| Python | >=3.12 | Lenguaje base |
| FastAPI | 0.115.4 | API async y OpenAPI |
| Uvicorn | 0.32.0 | Servidor ASGI |
| Pydantic / pydantic-settings | 2.9.2 / 2.6.1 | DTOs y configuración |
| SQLAlchemy | 2.0.36 | ORM async |
| asyncpg / aiosqlite | 0.30.0 / 0.20.0 | Drivers PostgreSQL / SQLite |
| Alembic | 1.14.0 | Migraciones |
| PyJWT / bcrypt / cryptography | 2.10.1 / 4.2.0 / 43.0.3 | Auth y cifrado |
| spaCy | 3.8.2 | NLP y anonimización |
| httpx / tenacity / PyYAML | 0.27.2 / 9.0.0 / 6.0.2 | HTTP, reintentos, manifiestos |
| structlog / OpenTelemetry API | 24.4.0 / 1.27.0 | Observabilidad |
| pytest / pytest-asyncio / ruff / mypy | 8.3.3 / 0.24.0 / 0.7.3 / 1.13.0 | Calidad |

LangChain y LangGraph figuran en `requirements.txt` como dependencias del framework,
pero el orquestador actual es propio y no usa cadenas de LangChain.

## 4. Estructura relevante

```text
core/
├── agent_base/        # BaseAgent + registro
├── config.py          # Settings (pydantic-settings) y rutas
├── db/                # engine, modelos, repositorios
├── llm_gateway/       # gateway, providers, json_parser, cost_tracker
├── manifest_validator.py
├── observability/     # logger, tracer
├── orchestrator/      # planner, router, executor, orchestrator
├── reporting/         # report_service
├── schemas/           # DTOs Pydantic
└── security/          # pii, cifrado, auth, guardrails, permisos
interfaces/api/
├── deps.py            # sesión DB y usuario actual
├── errors.py          # manejadores de errores
├── middleware/        # request_id, headers, logging
├── routes/            # analysis, auth, health, reports, sessions
└── main.py
```

## 5. API

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/health` | No | Estado, DB y modo LLM |
| POST | `/auth/register` | No | Registro |
| POST | `/auth/login` | No | JWT |
| GET | `/auth/me` | Sí | Usuario actual |
| POST | `/sessions` | Sí | Crear sesión |
| GET | `/sessions` | Sí | Listar sesiones propias |
| GET | `/sessions/{id}/analyses` | Sí | Análisis de una sesión |
| POST | `/analysis/analyze` | Sí | Pipeline completo |
| GET | `/analysis/{id}` | Sí | Análisis propio |
| POST | `/analysis/{id}/report` | Sí | Regenerar reporte |
| GET | `/reports/{analysis_id}` | Sí | Descargar Markdown |

Los análisis y reportes de otro usuario responden `404` para no filtrar su existencia.
`report_url` es relativa (`/reports/{analysis_id}`) y el cliente debe enviar el JWT.

## 6. Seguridad

- PII anonimizada antes de llamar al LLM; `LLM_MODE=mock` por defecto.
- Cifrado AES-256-GCM en reposo para nota y resultados.
- Guardrails bloquean campos diagnósticos/prescripción.
- Reportes resueltos con `Path.is_relative_to` para impedir path traversal.
- Logs JSON con lista de campos sensibles redactados; no se registra texto clínico.
- Headers de seguridad y `X-Request-ID` en el middleware.

## 7. Base de datos

- PostgreSQL en producción; SQLite como fallback de desarrollo
  (`ALLOW_SQLITE_FALLBACK=true`, `AUTO_CREATE_TABLES=true`).
- `alembic/` contiene la migración inicial.
- Modelos: `User`, `Session`, `Analysis`, `Report`.

## 8. Pruebas y calidad

```powershell
.\.venv\Scripts\python.exe -m compileall -q .
.\.venv\Scripts\python.exe -m pytest -q
.\.venv\Scripts\python.exe -m ruff check core agents interfaces tests
```

Estado actual: 20 pruebas aprobadas, `ruff` sin errores.

## 9. Limitaciones conocidas

- `skills/` son esqueletos; solo `document_generator` participa indirectamente en reportes.
- `code_executor` está deshabilitado por configuración.
- LangGraph no se usa todavía.
- La cobertura de tests aún no alcanza el objetivo de 80% del plan.
- `mypy` no está en modo estricto en `pyproject.toml`.
