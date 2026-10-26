# Prompt 01 – Arquitectura Base del Proyecto

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 6‑7).  
**Bloque:** A – Arquitectura & Datos.  
**Prioridad:** 1.  
**Área / Submódulo:** Arquitectura / Estructura General del Proyecto.  
**Rol Senior:** Senior Solutions Architect specialized in Python, FastAPI, PostgreSQL v16 + SQLAlchemy 2.x + Alembic (relational), Redis v7 (cache/sessions), React, React Native, API security, and AI-enabled healthcare software.

## Tarea específica y casos borde

Revisar y completar la arquitectura existente de `mi-framework-ia` sin sustituir la estructura definida por el docente. MindFlow V1 tiene cliente web React + TypeScript, cliente móvil React Native y una API FastAPI compartida; el producto incluye flujos de paciente/profesional y un copiloto para revisión exclusiva del terapeuta. No crear `backend/app`, no duplicar backend/DB/LLM por cliente y no generar todavía toda la aplicación.

Consider:
- Configuración por ambientes (dev/test/prod).
- Manejo de errores y logging seguro.
- Dependencias claras entre módulos.
- Escalabilidad futura.

## Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| Repositorio y documentos actuales. | Informe de inconsistencias, árbol objetivo dentro de la estructura docente, decisiones pendientes, contratos entre módulos y diagramas actualizados. |

## Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| Crear arquitectura base de MindFlow AI. | analysis_service.py, report_service.py (cada uno con responsabilidad única). |

## Prompt listo para ejecutar (Act as…)

```
Act as Senior Solutions Architect specialized in Python, FastAPI, PostgreSQL, React, React Native, API security, and AI-enabled healthcare software.

Context:
The repository already follows the instructor-provided `mi-framework-ia` structure. Inspect
that structure and the current requirements, stories, decision, models, manifests, prompts,
and diagrams before proposing changes. Target clients are React + TypeScript web and React
Native mobile; both consume the same FastAPI REST/OpenAPI contract. The server owns RBAC,
domain rules, clinical data, the orchestrator, and LLM access.

Task:
Identify contradictions and missing modules, then propose the smallest architecture changes
inside the existing folders. Show the target tree for `interfaces/api`, `interfaces/frontend`,
and `interfaces/mobile`; map each client to the common API and each API domain to existing
`core/`, `agents/`, `skills/`, `models/`, `config/`, and `evaluations/` responsibilities.
Separate V1 from deferred features. Do not claim that stubs or diagrams are implemented code.

Consider:
- Configuration by environments (dev/test/prod).
- Secure error handling and logging.
- Clear dependencies between modules.
- Future scalability.
- **Dual storage: PostgreSQL v16 + SQLAlchemy 2.x + Alembic for relational data with ACID/tenant isolation, Redis v7 for sessions and latency optimization.**

Format:
Architecture decision summary, Mermaid component diagram, data-flow diagram, responsibility
matrix, migration/implementation phases, and unresolved decisions. Keep documentation in Spanish.

Examples of the expected format and level:
- analysis_service.py, report_service.py (each with a single responsibility).

Constraints:
- Preserve the professor's folder structure and all unrelated framework components.
- Do not recreate the obsolete `backend/app` + `frontend/src` tree.
- Keep web and mobile as clients only; no business logic, database credentials, or direct LLM calls in clients.
- No diagnosis, prescription, automated specialist recommendation, real patient data, secrets, or clinical text in logs.
- Make every new domain responsibility trace to an RF, user story and test.
- Mark assumptions and stop if they change consent, crisis response, access policy, or clinical scope.
- Do not write code in this architecture phase; follow `docs/AI_CODEGEN_PLAYBOOK.md` for later staged generation.
```
---
*Estructura base para inicializar el repositorio MindFlow AI.*