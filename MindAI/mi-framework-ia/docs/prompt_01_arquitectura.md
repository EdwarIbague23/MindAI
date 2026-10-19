# Prompt 01 – Arquitectura Base del Proyecto

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 6‑7).  
**Bloque:** A – Arquitectura & Datos.  
**Prioridad:** 1.  
**Área / Submódulo:** Arquitectura / Estructura General del Proyecto.  
**Rol Senior:** Senior Solutions Architect especializado en Python, FastAPI, PostgreSQL, React y sistemas SaaS B2B con componentes de IA.

## Tarea específica y casos borde

Diseñar la arquitectura inicial de MindFlow AI con separación estricta de responsabilidades. El sistema recibe notas clínicas desestructuradas, protege/anonimiza PII, ejecuta análisis mediante LLM y devuelve resultados estructurados para revisión del terapeuta. Crear la estructura completa del repositorio (backend/app con api, core, models, schemas, services, middleware, security, ai; frontend/src con components, pages, services, hooks, types; docker-compose.yml, .env.example, README.md).

Consider:
- Configuración por ambientes (dev/test/prod).
- Manejo de errores y logging seguro.
- Dependencias claras entre módulos.
- Escalabilidad futura.

## Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| Configuración vacía de un proyecto nuevo. | Estructura de carpetas + archivos base + responsabilidades de cada módulo + documento ARCHITECTURE.md. |

## Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| Crear arquitectura base de MindFlow AI. | analysis_service.py, report_service.py (cada uno con responsabilidad única). |

## Prompt listo para ejecutar (Act as…)

```
Act as Senior Solutions Architect specialized in Python, FastAPI, PostgreSQL, React, and SaaS
B2B systems with AI components.

Context:
Architecture / General Project Structure. Design the initial architecture of MindFlow AI
with strict separation of responsibilities. The system receives unstructured clinical notes,
protects/anonymizes PII, runs analysis via an LLM, and returns structured results for the
therapist to review. Create the complete repository structure (backend/app with api, core,
models, schemas, services, middleware, security, ai; frontend/src with components, pages,
services, hooks, types; docker-compose.yml, .env.example, README.md).

Task:
Design the initial architecture of MindFlow AI with strict separation of responsibilities.
The system receives unstructured clinical notes, protects/anonymizes PII, runs analysis via
an LLM, and returns structured results for the therapist to review. Create the complete
repository structure (backend/app with api, core, models, schemas, services, middleware,
security, ai; frontend/src with components, pages, services, hooks, types; docker-compose.yml,
.env.example, README.md).

Consider:
- Environment‑based configuration (dev/test/prod).
- Secure error handling and logging.
- Clear dependencies between modules.
- Future scalability.

Format:
ARCHITECTURE.md document.

Examples of the expected format and level:
- analysis_service.py, report_service.py (each with a single responsibility).

Constraints:
- Do not introduce unnecessary dependencies.
- Do not mix business logic with endpoints.
- Do not place API keys in the repository.
- Do not store clinical notes in logs.
- Configuration via environment variables.
- Architecture prepared to replace the LLM provider without rewriting the entire app.
```
---
*Estructura base para inicializar el repositorio MindFlow AI.*