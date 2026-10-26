# MindFlow AI — Multi-Agent Copilot & Mental Healthcare Platform

![License: MIT](https://camo.githubusercontent.com/fdf2982b9f5d7489dcf44570e714e3a15fce6253e0cc6b5aa61a075aac2ff71b/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d4d49542d79656c6c6f772e737667)
![Status](https://camo.githubusercontent.com/0be4675a1c281c6ebc0dc053dc657fdc9de23f315319c6bd72f3274855068279/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f45737461646f2d456e5f4465736172726f6c6c6f2d79656c6c6f77)
![Course](https://camo.githubusercontent.com/2e46f603a95c3abe1be818836557942729c7755742285363945d6b3d5d3150b6/68747470733a2f2f696d672e736869656c64732e696f2f554e494d494e55544f2d456c6563746976615f49415f323032362d2d322d677265656e)
![Python](https://camo.githubusercontent.com/9833615dcd5c4175da2140bbe363cb42af4faaeffc0624453b6154e68a60d0aa/68747470733a2f2f696d672e736869656c64732e696f2f507974686f6e2d332e31312b2d626c75652e737667)
![FastAPI](https://camo.githubusercontent.com/b92ff4b5c859eea80a46e97538c4ab17290f99c82be686149809f8d401bc7caf/68747470733a2f2f696d672e736869656c64732e696f2f466173744150492d302e3131352e302d3030393638382e737667)
![PostgreSQL](https://camo.githubusercontent.com/cdd9ba497706a4ecbb8590f152ed0ffa67350e4e68348962ecf260e457445043/68747470733a2f2f696d672e736869656c64732e696f2f506f737467726553514c2d31362d3431363945312e737667)
![Redis](https://camo.githubusercontentous/5ac449cee743c211a6024df7cf7ae2a6d3c41e0f70eb39512572c4cf6e13cab5/68747470733a2f2f696d672e736869656c64732e696f2f52656469732d372d4d4952454449532d4646343433382e737667)
![React](https://camo.githubusercontentous/0e045ac7aeb88d25f0acf0253c7e885cb97188983f6246e29830ba120cad4153/68747470733a2f2f696d672e736869656c64732e696f2f52656163742d31382e332d3631444146422e737667)
![React Native](https://camo.githubusercontentous/9d350288e54b59ef60c08bad9b2fd22ebbf70582b94b214b40f6670caf0af6ad/68747470733a2f2f696d672e736869656c64732e696f2f52656163745f4e61746976652d302e37332d3631444146422e737667)

---

## 📋 Table of Contents

* [Project Vision](#-project-vision)
* [System Architecture](#-system-architecture)
* [Tech Stack](#-tech-stack-validated-8vo-semestre)
* [Improvement Plan](#mejora-plan-basado-en-auditoria)
* [MVP Scope](#-mvp-scope-functional-scope-target-v1)
* [Repository Structure](#-repository-structure-mindflow-framework-ia)
* [Team Roles](#-team-roles)
* [Ethical and Legal Disclaimer](#-ethical-and-legal-disclaimer)
* [Support](#-support)

---

## 📌 Project Vision

**MindFlow AI** es una plataforma híbrida orientada a pacientes y profesionales de la salud mental y psicología, integrada con un copiloto de análisis exclusivo para terapeutas y psicólogos. El sistema permite el seguimiento continuo, la prevención, la detección temprana de patrones de riesgo y el manejo integral en salud mental, conectando el entorno clínico, emocional y social del paciente.

Las interfaces Web y Mobile comparten una API unificada. El copiloto presenta evidencias, patrones sintomáticos y alertas clínicas tempranas para revisión profesional; no genera diagnósticos automatizados ni decisiones clínicas autónomas. Desarrollado para la **Electiva CPC Integración IA (UNIMINUTO Ibagué, 2026-2)**.

---

## 🏗️ System Architecture

La plataforma emplea una arquitectura **Híbrida Web + Mobile** distribuida en las siguientes capas:

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Web Frontend** | React + TypeScript | Portal web para psicólogos, terapeutas, psiquiatras y gestión administrativa. |
| **Mobile Frontend** | React Native | App Android/iOS para pacientes (diario emocional, seguimiento, citas) y profesionales (alertas prioritarias). |
| **Application** | FastAPI (Python) | Servidor REST API asíncrono con validación Pydantic y documentación OpenAPI. |
| **Orchestration** | Orchestrator Core | Router/Planner/Executor coordinando agentes y skills de evaluación psicológica multidisciplinaria. |
| **Infrastructure** | PostgreSQL v16 + SQLAlchemy 2.x + Alembic + Redis v7 | BD relacional con garantías ACID, caché de sesiones y pgcrypto (AES-256-GCM) para cifrado de historias clínicas. |

### Diagrams

*   [Componentes por Capas](mi-framework-ia/docs/architecture-diagram.drawio) — Diagrama visual de la arquitectura híbrida (Web/Móvil → FastAPI → Orchestración → Infraestructura).
*   [ERD Base de Datos](mi-framework-ia/docs/erd-database.drawio) — Modelo Entidad-Relación ampliado con todas las tablas, relaciones y tipos de datos.

---

## 🛠️ Tech Stack *(Validated 8th Semester)*

| Category | Technology | Justification |
| :--- | :--- | :--- |
| **Language / Server** | Python + FastAPI | Asincronía nativa para llamadas a LLM y I/O de BD, validación Pydantic y documentación Swagger implícita. Rendimiento óptimo para cargas de IA vs Node.js. |
| **Database** | PostgreSQL v16 + SQLAlchemy 2.x + Alembic | Transacciones ACID para datos clínicos sensibles, RLS/schemas para aislamiento de tenant, y migraciones versionadas. Cifrado pgcrypto AES-256-GCM para historias clínicas. |
| **Cache** | Redis v7 | Acceso O(1) para sesiones activas, TTL automático para contexto conversacional en tiempo real, reduce latencia en respuestas del copiloto. |
| **Mobile** | React Native | Aplicación multiplataforma (Android/iOS) consumiendo la misma API REST/OpenAPI que la web. |
| **IA / LLM** | Claude 3.5 Sonnet | Proveedor principal a través del LLM Gateway para extracción de factores de riesgo psicoemocional. |
| **Processing** | SpaCy + LLM Gateway | Anonimización estructurada PII y procesamiento sintomático inicial para el ámbito psicológico. |

---

## 📈 Improvement Plan — Based on Technical Audit

*Plan generado a partir de la auditoría técnica por EdwarIbague23 (rama Technical-audit). El proyecto tiene una base arquitectónica sólida pero requiere desarrollo intensivo en código, seguridad y pruebas.*

### Prioridades de Mejora

| Prioridad | Enfoque | Semana(s) |
|-----------|---------|-----------|
| **P1: Seguridad y Cumplimiento** | Guardrails, permisos, cumplimiento Ley 1581/Decreto 1377 (Colombia) | 1-2 |
| **P2: API y Orchestrator** | FastAPI completo, planner/router/executor, endpoints versionados | 3-4 |
| **P3: Agentes y Skills** | base_agent, registry, skills (code_executor, db_query, document_generator, web_search) | 5-6 |
| **P4: Testing y QA** | Pruebas unitarias, integración, benchmarks, seguridad | 5-8 |
| **P5: Documentación y Despliegue** | Diagrams actualizados, Docker, CHANGELOG, Render | Continuo |

### Métricas de Éxito

| Métrica | Meta | Estado Actual |
|---------|------|---------------|
| Cobertura de código | ≥80% | ~10% |
| Vulnerabilidades de seguridad | 0 críticas | Por definir |
| Implementación de endpoints API | 100% definidos | ~5% |
| Cobertura de pruebas de agentes | ≥90% | ~20% |
| Precisión PII redaction | ≥95% | N/A |
| Actualización de documentación | 100% | ~70% |

---

## 🎯 MVP Scope (Functional Scope Target V1)

| Included in V1 | Post V1 / Prohibido |
| :--- | :--- |
| **Registro/consentimiento informado**, agenda y búsqueda unificada de profesionales de salud mental. | Videollamadas integradas, pasarela de pagos, interoperabilidad EHR/HL7 FHIR compleja. |
| **Copiloto Clínico**: Alertas de riesgo emocional/ansiedad/depresión, análisis de fichas de seguimiento y preguntas guía. | Diagnóstico automatizado, prescripción farmacológica directa o decisiones clínicas autónomas. |
| Cuestionarios de hábitos, registro de estado de ánimo y síntomas prevalentes transversales. | Recomendación automática de especialistas sin validación del terapeuta tratante. |

---

## 🗂️ Repository Structure (`mi-framework-ia`)

```text
MindFlow AI/
├── .vscode/
│   └── tasks.json
├── mi-framework-ia/
│   ├── agents/
│   │   ├── coding_agent/
│   │   │   ├── prompts/
│   │   │   │   └── agent.py
│   │   │   └── manifest.yaml
│   │   ├── clinical_analysis_agent/
│   │   │   ├── prompts/
│   │   │   │   ├── general_risk_analysis.md
│   │   │   │   └── clinical_prevention_guide.md
│   │   │   └── manifest.yaml
│   │   ├── research_agent/
│   │   │   ├── prompts/
│   │   │   │   └── agent.py
│   │   │   └── manifest.yaml
│   │   └── __init__.py
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── 20260921_initial_schema.py
│   │   ├── env.py
│   │   └── __init__.py
│   ├── config/
│   │   ├── environments/
│   │   │   ├── dev.yaml
│   │   │   └── prod.yaml
│   │   ├── agents.yaml
│   │   └── skills.yaml
│   ├── core/
│   │   ├── agent_base/
│   │   │   ├── agent_registry.py
│   │   │   └── base_agent.py
│   │   ├── llm_gateway/
│   │   │   ├── cost_tracker.py
│   │   │   └── provider_router.py
│   │   ├── memory/
│   │   │   ├── long_term.py
│   │   │   ├── memory_manager.py
│   │   │   └── short_term.py
│   │   ├── observability/
│   │   │   ├── logger.py
│   │   │   └── tracer.py
│   │   ├── orchestrator/
│   │   │   ├── executor.py
│   │   │   ├── planner.py
│   │   │   └── router.py
│   │   ├── security/
│   │   │   ├── guardrails.py
│   │   │   ├── permissions.py
│   │   │   ├── prompts_anonymization_pii.md
│   │   │   └── prompts_pii_anonymizer_origin.md
│   │   └── skill_base/
│   │       ├── base_skill.py
│   │       └── skill_registry.py
│   ├── deployment/
│   │   ├── prompts_devops.md
│   │   └── prompts_infrastructure_devops_origin.md
│   ├── docs/
│   │   ├── 01_context_and_interview.md
│   │   ├── 02_requirements_rf_rnf.md
│   │   ├── 03_user_stories.md ✨ **Actualizado**
│   │   ├── architecture.md
│   │   ├── decision_technology.md
│   │   ├── Diagram_cases_mindflow.mmd
│   │   ├── Diagram_cases_mindflow.png
│   │   ├── Component_diagram_mindflow.drawio ✨ **Nuevo**
│   │   ├── Component_diagram_mindflow.mmd
│   │   ├── ER_diagram_mindflow.drawio ✨ **Nuevo/Ampliado**
│   │   ├── ER_diagram_mindflow.mmd
│   │   ├── manifest_schema.md
│   │   ├── prompt_01_architecture.md
│   │   ├── STITCH_FULL_PROTOTYPE_SPEC.md
│   │   ├── STITCH_MOBILE_PROTOTYPE_SPEC.md
│   │   └── STITCH_WEB_PROTOTYPE_SPEC.md
│   ├── evaluations/
│   │   ├── agent_benchmarks/
│   │   │   ├── clinical_analysis_agent.md
│   │   │   └── README.md
│   │   ├── skill_tests/
│   │   │   └── README.md
│   │   ├── prompts_client_testing.md
│   │   └── prompts_unitary_testing_mock.md
│   ├── interfaces/
│   │   ├── api/
│   │   │   ├── main.py ⚠️ **En desarrollo**
│   │   │   ├── prompts_api_domain_v1.md
│   │   │   ├── prompts_contracts_and_security.md
│   │   │   ├── prompts_openapi_schemas.md
│   │   │   └── prompts_security_api.md
│   │   ├── chat_ui/
│   │   │   └── README.md
│   │   ├── cli/
│   │   │   └── main.py
│   │   └── frontend/
│   │       ├── prompts_pdf_export_origin.md
│   │       ├── prompts_report_pdf.md
│   │       ├── prompts_ui_react.md
│   │       └── prompts_ui_roles_react.md
│   ├── mobile/
│   │   └── prompts_mobile_react_native.md
│   ├── models/
│   │   ├── analyses.py
│   │   ├── clinical_notes.py
│   │   ├── clinical_followup.py
│   │   ├── guiding_questions.py
│   │   ├── prompts_database_origin.md
│   │   ├── prompts_data_modeling.md
│   │   ├── reports.py
│   │   └── users.py
│   ├── skills/
│   │   ├── code_executor/
│   │   │   ├── manifest.yaml
│   │   │   └── skill.py
│   │   ├── db_query/
│   │   │   ├── manifest.yaml
│   │   │   └── skill.py
│   │   ├── document_generator/
│   │   │   ├── manifest.yaml
│   │   │   ├── prompts_document_generator.md
│   │   │   └── skill.py
│   │   └── web_search/
│   │       └── manifest.yaml
│   └── tools/
│       ├── github_client.py
│       └── slack_client.py
├── .gitignore
├── alembic.ini
├── CHANGELOG_Hybrid_Update.md
├── MindAI_AUDIT_CONTEXT/
│   ├── data/
│   │   ├── ai_signals.json
│   │   ├── api_routes.json
│   │   ├── dependencies.json
│   │   ├── excluded_files.json
│   │   ├── inventory.json
│   │   └── security_signals.json
│   ├── reports/
│   │   ├── AUDIT_README.md
│   │   ├── PROJECT_TREE.md
│   │   └── TECH_STACK.md
│   └── source/
│       └── mi-framework-ia/ (copy de auditoría)
├── MindFlow_Audit_Kit/
│   ├── audit_mindflow.py
│   ├── README.md
│   └── UNIVERSAL_AI_AUDIT_INSTRUCTION.md
├── scripts/
│   ├── update_readme.ps1
│   └── watch_readme.ps1
├── README.md
└── README.md
```

---

## 👥 Team Roles

* **Product Owner / Lead AI Architect:** Edwar Ibagué
* **Full-Stack Developer:** Daniel Felipe Andrade
* **Medical AI Engineer:** Nicol Sneider Murillo
* **Frontend Developer:** React / React Native Interface
* **QA / Tester:** Validation of Clinical Cases and Prompts
* **DevOps:** Docker Deployment, Render

---

## ⚠️ Ethical and Legal Disclaimer

* **MindFlow AI** es una herramienta analítica de soporte para profesionales de la salud mental y psicología.
* No emite diagnósticos clínicos autónomos ni sustituye la evaluación y criterio del profesional de la salud.
* El tratamiento de datos de salud requiere consentimiento explícito y cumplimiento estricto de la **Ley 1581 de 2012** y el **Decreto 1377 de 2013** de Colombia.
* Todos los indicadores y métricas de soporte deben ser revalidados por el terapeuta antes de registrarse en la historia clínica oficial.
* Queda prohibido el uso autónomo por parte de pacientes para autodiagnóstico o toma de decisiones clínicas.
* El repositorio opera con datos sintéticos para pruebas de desarrollo.

---

## 💬 Support

¿Tienes dudas o sugerencias de integración? Revisa la sección de **Issues** en el repositorio o abre un nuevo reporte.

---

## 📦 Improvement Plan Details

For the complete improvement plan generated from the technical audit, see: [IMPROVEMENT_PLAN.md](/IMPROVEMENT_PLAN.md)

*Plan generado el 25 de octubre de 2026 a partir de la auditoría en la rama `Technical-audit` de EdwarIbague23/MindAI.*

---