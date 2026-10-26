# Traspaso a otra IA — MindFlow AI / MindIA

**Fecha de verificación:** 2026-10-25
**Repo raíz:** `C:\Users\edwar\OneDrive - uniminuto.edu\Otavo semestre\Electiva Cpc\MindIA`
**Proyecto real:** `MindAI\mi-framework-ia`
**Carpeta obsoleta (ignorar):** `MindIA\mi-framework-ia` (solo contiene `agents\report_agent`)

---

## 1. Objetivo de la tarea

1. Crear `MindAI\mi-framework-ia\LO_QUE_LLEVA_Y_LO_QUE_FALTA.md` con el documento del usuario **tal cual** y añadir al final un anexo de verificación contra el código.
2. Corregir las brechas P0 listadas abajo para que el pipeline multi-agente y la descarga de reportes funcionen realmente.

> El texto original de "LO QUE LLEVA Y LO QUE FALTA" debe aportarlo el usuario o recuperarse del historial. No inventarlo.

---

## 2. Stack y estado técnico

- Python `>=3.12` (`pyproject.toml`), versión `2.0.0`.
- FastAPI 0.115.4, Pydantic 2.9.2, SQLAlchemy 2.0.36 (async), Alembic 1.14.0, spaCy 3.8.2.
- Frontend: React 18.3.1 + Vite + TanStack Query + Zustand + axios + recharts + zod.
- DB: PostgreSQL 15 (`docker-compose.yml`, solo servicio `db`); tests con SQLite temporal.
- LLM: mock determinista por defecto (`LLM_MODE=mock`), adaptadores OpenAI/Anthropic.
- Tests: **11 existentes** (conteo por archivos; no se ejecutó pytest durante esta verificación):
  - `tests/test_analysis_api.py` (3)
  - `tests/test_pii_and_encryption.py` (4)
  - `tests/test_llm_gateway.py` (2)
  - `tests/test_manifest_validator.py` (2)
- `tests/conftest.py` fuerza `LLM_MODE=mock`, SQLite temporal, `AUTO_CREATE_TABLES=true`, `REPORTS_DIR` temporal.

---

## 3. Brechas P0 verificadas

### 3.1 Los 4 agentes MindFlow son código muerto
- `agents/__init__.py:2` importa `from .agent import ...`, pero **no existe** `agents/agent.py`.
- Estos archivos importan un módulo inexistente:
  - `agents/triage_agent/agent.py:4`
  - `agents/report_agent/agent.py:4`
  - `agents/emotion_analysis_agent/agent.py:4`
  - `agents/cognitive_distortion_agent/agent.py:4`
  - Usan `from core.agent_base.agent_base import BaseAgent` → debe ser `from core.agent_base.base_agent import BaseAgent`.
- Además usan `self.llm_gateway`, pero `BaseAgent.__init__` expone `self.gateway` (`core/agent_base/base_agent.py:18-20`). Corregir a `self.gateway`.
- Solo `coding_agent` y `research_agent` tienen `manifest.yaml` y usan `register_agent`. Los 4 agentes MindFlow no tienen manifiesto ni registro.
- Consecuencia: `import agents` falla y el pipeline multi-agente no puede instanciarse.

### 3.2 El orquestador es mono-agente
- `core/orchestrator/orchestrator.py` solo llama `gateway.analyze(..., agent="emotion_analysis_agent")`.
- El triage real es heurístico (`_triage`), no usa `TriageAgent`.
- `CognitiveDistortionAgent`, `TriageAgent` y `ReportAgent` no se ejecutan.
- `core/orchestrator/planner.py`, `router.py` y `executor.py` son stubs de **1 línea** (solo docstring).

### 3.3 No existe endpoint de reportes
- Routers registrados en `interfaces/api/main.py`: health, auth, sessions, analysis.
- No hay `GET /reports/{...}` ni `FileResponse`.
- El reporte se genera en `core/reporting/report_service.py` y se guarda en `reports_dir`, pero no se sirve.

### 3.4 El frontend construye una URL inválida y filtra la ruta del servidor
- `interfaces/frontend/src/pages/Dashboard.tsx` usa:
  `/${report.file_path.replace(/\\/g, '/')}`
- Resultado: `/C:/Users/.../reports/....md` → 404 y exposición de ruta absoluta.
- Corrección: el backend debe devolver una URL relativa (`/reports/{analysis_id}`) y el frontend consumirla con `baseURL`.

### 3.5 Stubs de observabilidad
- `core/observability/logger.py` y `core/observability/tracer.py`: 1 línea (solo docstring).
- `interfaces/api/middleware/security.py` solo añade headers y `X-Request-ID`; no hay logging estructurado ni trazas.
- No hay uso de `logger` en el código.

### 3.6 Ruta inexistente en la documentación
- `core/database/` **no existe**; solo `core/db/` (`database.py`, `models.py`, `repositories.py`).

---

## 4. Brechas P1 de documentación

- `MindAI/README.md` tiene **conflictos de merge sin resolver** (`<<<<<<< HEAD`, `=======`, `>>>>>>> ac7cafa...` en líneas 3, 8, 18, 20, 35, 40, 79, 125, 154, 196).
- `backend.md:55`, `frontend.md:51`, `web.md:43` están **truncados** ("resto truncado por brevedad", "se completarán").
- `docs/manifest_schema.md:315` dice que `core/manifest_validator.py` está "a implementar", pero ya existe y está implementado (`core/manifest_validator.py:129`).
- `DOCUMENTACION_TECNICA_COMPLETA.md` presenta artefactos de codificación (p. ej. `"equest_id"` en lugar de `"request_id"`; 15 CR aislados).
- Inconsistencia de versión de Python: docs dicen 3.11+, `pyproject.toml` exige `>=3.12`.
- `.env.example` y `docker-compose.yml` están en la raíz del repo, no dentro de `mi-framework-ia` (funciona porque `core/config.py` carga `REPO_ROOT/.env`).
- `docker-compose.yml` solo define PostgreSQL; no levanta backend ni frontend.

---

## 5. Plan de ejecución recomendado

### Fase 0 — Documento
1. Crear `LO_QUE_LLEVA_Y_LO_QUE_FALTA.md` con el contenido del usuario sin cambios.
2. Añadir anexo "Verificación contra el código — 2026-10-25" con la tabla de brechas P0/P1.

### Fase 1 — Reparar agentes (P0)
1. En los 4 `agent.py`: cambiar import a `core.agent_base.base_agent` y `self.llm_gateway` → `self.gateway`.
2. Crear `agents/__init__.py` correcto (exportar desde cada subpaquete, no desde `.agent`).
3. Añadir `manifest.yaml` a los 4 agentes (rol, versión semver, `pii_policy`, `allowed_skills`, `model_policy`).
4. Registrarlos con `@register_agent` y verificar `instantiate_agents`.
5. Añadir tests: `import agents`, registro único, instanciación y `run` con gateway mock.

### Fase 2 — Pipeline real (P0)
1. Implementar `router/planner/executor` o cablear el pipeline directamente en `orchestrator.py`.
2. Orden: triage → emotion_analysis → cognitive_distortion → report.
3. Mantener guardrails, anonimización y fallback a mock.
4. Test de integración del pipeline completo con `LLM_MODE=mock`.

### Fase 3 — Reportes descargables (P0)
1. Nuevo router `interfaces/api/routes/reports.py`:
   - `GET /reports/{analysis_id}` con auth y ownership.
   - Resolver la ruta desde la DB, validar que esté dentro de `reports_dir` (anti path traversal).
   - `FileResponse` con `media_type="text/markdown"` y `Content-Disposition`.
2. Cambiar la respuesta de `POST /analysis/{id}/report` para devolver `report_url` relativa.
3. Actualizar `Dashboard.tsx` para usar `report_url`.
4. Tests: 200 con dueño, 403 con otro usuario, 404 inexistente, rechazo de path traversal.

### Fase 4 — Observabilidad (P1)
1. Implementar `logger.py` (logging estructurado JSON, sin PII) y `tracer.py` (request_id/analysis_id).
2. Loguear eventos, no texto clínico.

### Fase 5 — Documentación (P1)
1. Resolver conflictos de `MindAI/README.md`.
2. Completar o eliminar `backend.md`, `frontend.md`, `web.md`, `mobile.md`.
3. Actualizar `manifest_schema.md` (validador implementado).
4. Corregir artefactos de codificación y Python 3.11 → 3.12 en `DOCUMENTACION_TECNICA_COMPLETA.md`.

### Fase 6 — Verificación
```powershell
# Backend
python -m compileall -q .
python -m pytest -q

# Frontend
npm run build

# Arranque local
uvicorn interfaces.api.main:app --reload
docker compose up -d db
```

---

## 6. Criterios de aceptación

- Los 11 tests existentes siguen pasando y se añaden los nuevos.
- `import agents` funciona y los 4 agentes se registran e instancian.
- `POST /analysis/analyze` ejecuta el pipeline completo (verificable en logs/trazas).
- `GET /reports/{analysis_id}` devuelve el `.md` solo al dueño; el frontend lo descarga.
- Ningún log contiene texto clínico ni PII.
- README sin marcadores de conflicto.
- Documentación sin afirmaciones falsas sobre `core/database/` ni endpoints inexistentes.

---

## 7. Restricciones y riesgos

- No romper compatibilidad con `LLM_MODE=mock`.
- No servir `reports/` como static sin auth.
- No loggear `note_text` ni texto anonimizado completo.
- `reports_dir` debe resolverse con `pathlib` y validarse contra traversal.
- Evitar tocar la carpeta obsoleta `MindIA/mi-framework-ia`.
- Revisar `git status` antes de commit; hay muchos archivos nuevos sin trackear.

---

## 8. Archivos clave

| Archivo | Rol |
|---|---|
| `core/orchestrator/orchestrator.py` | Orquestación actual mono-agente |
| `core/orchestrator/{planner,router,executor}.py` | Stubs a implementar |
| `core/agent_base/base_agent.py` | `BaseAgent` (`self.gateway`) |
| `core/agent_base/agent_registry.py` | Registro e instanciación |
| `agents/*/agent.py` | Agentes MindFlow |
| `config/agents.yaml` / `config/skills.yaml` | Manifiestos |
| `core/manifest_validator.py` | Validador real |
| `core/reporting/report_service.py` | Generación del `.md` |
| `interfaces/api/main.py` | Registro de routers |
| `interfaces/api/routes/analysis.py` | `analyze`, `get`, `report` |
| `interfaces/frontend/src/pages/Dashboard.tsx` | href roto |
| `interfaces/frontend/src/services/api.ts` | `baseURL` (`VITE_API_URL ?? '/api'`) |
| `core/observability/{logger,tracer}.py` | Stubs |
| `tests/` | 11 tests + `conftest.py` |
| `MindAI/README.md` | Conflictos de merge |
| `docker-compose.yml` | Solo PostgreSQL |
