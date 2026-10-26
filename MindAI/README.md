# MindFlow AI — Copiloto de Triaje y Análisis Emocional para Terapeutas

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Estado](https://img.shields.io/badge/Estado-En_Desarrollo-yellow)](https://github.com/EdwarIbague23/Electiva_IA-/graphs/activity)
[![Curso](https://img.shields.io/badge/UNIMINUTO-Electiva_IA_2026--2-green)](https://uniminuto.edu)
[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.4-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)

## Visión del Proyecto

**MindFlow AI** es un copiloto inteligente para optimizar el análisis de notas clínicas en salud mental y el triaje emocional. Mediante NLP, transforma transcripciones anonimizadas en mapas visuales de emociones, detecta distorsiones cognitivas y sugiere preguntas guía para la siguiente sesión terapéutica.

Proyecto desarrollado para la **Electiva CPC Integración IA** (UNIMINUTO Ibagué, 2026-2).

> **Esta herramienta actúa exclusivamente como apoyo analítico y no sustituye el juicio profesional.**

---

## Alcance del MVP

| Lo que **SE DEMUESTRA** | Lo que queda **EXPLÍCITAMENTE FUERA** |
| :--- | :--- |
| **Entrada:** carga o pegado de notas clínicas anonimizadas. | Diagnóstico clínico automatizado o emisión de recetas médicas. |
| **Procesamiento:** pipeline multi-agente para emociones, distorsiones cognitivas y triaje. | Chat en vivo con el paciente o terapia presencial. |
| **Salida:** dashboard con radar emocional, hallazgos, preguntas guía y reporte Markdown descargable. | Integración con sistemas complejos de historias clínicas (EHR). |

---

## Arquitectura

Flujo principal:

```
Terapeuta -> React (Vite) -> FastAPI
                              -> PII Pipeline (anonimización obligatoria)
                              -> Orquestador multi-agente
                                   emotion_analysis -> cognitive_distortion -> triage -> report
                              -> LLM Gateway (mock | OpenAI | Anthropic)
                              -> PostgreSQL / SQLite (cifrado AES-256-GCM en reposo)
```

Componentes clave:

- **Core**: orquestador, LLM Gateway, seguridad, observabilidad, reportes y base de datos.
- **Agentes**: `emotion_analysis_agent`, `cognitive_distortion_agent`, `triage_agent`, `report_agent`.
- **Skills**: `document_generator`, `db_query`, `web_search`, `code_executor` (deshabilitada por defecto).
- **Interfaces**: API REST (FastAPI) y frontend (React 18 + Vite + TanStack Query).

---

## Estructura del Repositorio

```text
MindIA/
├── .env.example                 # Variables de entorno de referencia
├── docker-compose.yml           # PostgreSQL 15
└── mi-framework-ia/
    ├── agents/                  # Agentes especializados y manifiestos
    ├── alembic/                 # Migraciones de base de datos
    ├── config/
    │   ├── agents.yaml          # Manifiesto de agentes
    │   └── skills.yaml          # Manifiesto de skills
    ├── core/
    │   ├── agent_base/          # BaseAgent + registro de agentes
    │   ├── db/                  # Modelos, repositorios y sesión async
    │   ├── llm_gateway/         # Gateway multi-proveedor (mock/OpenAI/Anthropic)
    │   ├── observability/       # Logging JSON y trazas request_id/analysis_id
    │   ├── orchestrator/        # Planner, router, executor y orquestador
    │   ├── reporting/           # Generación y resolución segura de reportes
    │   ├── schemas/             # DTOs Pydantic
    │   └── security/            # PII, guardrails, JWT, cifrado, permisos
    ├── docs/                    # Arquitectura, requerimientos y manifiestos
    ├── evaluations/             # Pruebas y benchmarks de agentes/skills
    ├── interfaces/
    │   ├── api/                 # FastAPI (rutas, deps, middleware)
    │   └── frontend/            # React + Vite
    ├── skills/                  # Skills atómicas
    ├── tests/                   # Suite pytest
    ├── tools/                   # Integraciones externas (GitHub, Slack)
    └── pyproject.toml
```

---

## Requisitos

- Python 3.12+
- Node.js 20+
- PostgreSQL 15 (opcional; hay fallback SQLite para desarrollo/tests)
- Docker + Docker Compose (opcional)

---

## Puesta en Marcha

### 1. Variables de entorno

Copia `.env.example` a `.env` en la raíz del repositorio (`MindIA/.env`):

```powershell
Copy-Item .env.example .env
```

Variables relevantes: `DATABASE_URL`, `JWT_SECRET_KEY`, `AES_KEY`, `LLM_MODE` (`mock` o `real`), `LLM_PROVIDER`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `REPORTS_DIR`.

### 2. Base de datos

```powershell
docker compose up -d db
```

Si PostgreSQL no está disponible, la aplicación usa automáticamente SQLite (`ALLOW_SQLITE_FALLBACK=true`).

### 3. Backend

```powershell
cd MindAI/mi-framework-ia
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn interfaces.api.main:app --reload
```

- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

### 4. Frontend

```powershell
cd MindAI/mi-framework-ia/interfaces/frontend
npm install
npm run dev
```

- App: `http://localhost:5173` (proxy `/api` hacia el backend)

---

## Endpoints Principales

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/health` | Estado del servicio, DB y modo LLM. |
| `POST` | `/auth/register` | Registro de terapeuta. |
| `POST` | `/auth/login` | Login y emisión de JWT. |
| `GET` | `/auth/me` | Usuario autenticado. |
| `POST` | `/sessions` | Crear sesión. |
| `GET` | `/sessions` | Listar sesiones del usuario. |
| `GET` | `/sessions/{id}/analyses` | Análisis de una sesión. |
| `POST` | `/analysis/analyze` | Anonimiza la nota y ejecuta el pipeline multi-agente. |
| `GET` | `/analysis/{analysis_id}` | Recuperar un análisis (solo dueño). |
| `POST` | `/analysis/{analysis_id}/report` | Regenerar reporte Markdown. |
| `GET` | `/reports/{analysis_id}` | Descargar el reporte Markdown (JWT + ownership). |

`POST /analysis/analyze` devuelve `report_url` relativa (`/reports/{analysis_id}`); el frontend la consume con el `baseURL` de la API y descarga el archivo con el header de autenticación.

---

## Testing y Verificación

```powershell
cd MindIA/mi-framework-ia
python -m compileall -q .
python -m pytest -q
```

```powershell
cd MindIA/mi-framework-ia/interfaces/frontend
npm run build
```

La suite usa `LLM_MODE=mock`, SQLite temporal y un `REPORTS_DIR` temporal (ver `tests/conftest.py`).

---

## Seguridad y Privacidad

- Anonimización obligatoria de PII antes de invocar al LLM (regex + spaCy).
- Cifrado AES-256-GCM de notas y resultados en reposo.
- Guardrails que prohíben campos diagnósticos o de prescripción.
- JWT para autenticación y verificación de ownership en análisis y reportes.
- Reportes servidos con validación anti path traversal y sin exponer rutas absolutas.
- Logs estructurados en JSON que redactan cualquier campo clínico sensible.

---

## Documentación Técnica

| Documento | Contenido |
| :--- | :--- |
| [`docs/architecture.md`](./docs/architecture.md) | Capas del sistema, infraestructura compartida y flujo de datos. |
| [`docs/manifest_schema.md`](./docs/manifest_schema.md) | Especificación de `agents.yaml` y `skills.yaml`; validador implementado. |
| [`docs/02_requerimientos_rf_rnf.md`](./docs/02_requerimientos_rf_rnf.md) | Requerimientos funcionales y no funcionales. |
| [`docs/03_historias_de_usuario.md`](./docs/03_historias_de_usuario.md) | Historias de usuario. |

---

## Equipo

| Rol | Integrante |
| :--- | :--- |
| Product Owner / Lead AI Architect | Edwar Esteban Ibagué |
| Backend Developer | Daniel Felipe Andrade |
| NLP Engineer & Frontend | Nicol Sneider Murillo |

---

## Disclaimer Ético

**MindFlow AI** es una herramienta de apoyo analítico para profesionales de la salud mental:

- **No** emite diagnósticos clínicos ni sustituye la evaluación profesional.
- **No** almacena PII sin consentimiento explícito y cumplimiento normativo.
- Los resultados (emociones, distorsiones, preguntas sugeridas) **deben ser validados y reinterpretados** por el terapeuta antes de incorporarse a la historia clínica.
- El uso indebido para tomar decisiones médicas por cuenta propia está **estrictamente prohibido**.

---

## Soporte

¿Dudas o problemas? Revisa la sección de [Issues](https://github.com/EdwarIbague23/Electiva_IA-/issues) o abre un nuevo reporte.

---

Distribuido bajo licencia **MIT**.
