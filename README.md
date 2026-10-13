# HealthFlow AI — Global Clinical Copilot & Integrated Healthcare Platform

📋 Table of Contents
- Project Vision
- System Architecture
- Tech Stack
- MVP Scope
- Repository Structure
- Technical Documentation
- Team
- Ethical Disclaimer
- Support

📌 Project Vision
HealthFlow AI es una plataforma híbrida orientada a pacientes y profesionales de la salud en todas las ramas de la medicina y la atención primaria, integrada con un copiloto de análisis exclusivo para médicos. El sistema permite el seguimiento continuo, la prevención, el diagnóstico temprano y el manejo integral de patologías y enfermedades crónicas (hipertensión, diabetes, riesgo cardiovascular y afecciones multisistémicas) conectando el entorno clínico, físico y social del paciente. Las interfaces Web y Mobile comparten una API unificada. El copiloto presenta evidencias, patrones sintomáticos y alertas clínicas tempranas para revisión profesional; no genera diagnósticos automatizados ni decisiones clínicas autónomas. Desarrollado para la Electiva CPC Integración IA (UNIMINUTO Ibagué, 2026‑2).

🏗️ System Architecture
La plataforma emplea una arquitectura Híbrida Web + Mobile con las siguientes capas:
Layer | Technology | Description
--- | --- | ---
Web Frontend | React + TypeScript | Portal web para médicos generales, especialistas, personal de enfermería y gestión administrativa.
Mobile Frontend | React Native | App Android/iOS para pacientes (seguimiento de tratamiento, citas) y profesionales de la salud (alertas prioritarias).
Application | FastAPI (Python) | Servidor REST API asíncrono con validación Pydantic y documentación OpenAPI.
Orchestration | Orchestrator Core | Router/Planner/Executor coordinando agentes y skills de evaluación médica multidisciplinaria.
Infrastructure | PostgreSQL v16 + SQLAlchemy 2.x + Alembic + Redis v7 | BD relacional con garantías ACID, caché de sesiones y pgcrypto (AES-256-GCM) para cifrado de historias clínicas.

🛠️ Tech Stack (Validated 8th Semester)
Category | Technology | Justification
--- | --- | ---
Language / Server | Python + FastAPI | Asincronía nativa para llamadas a LLM y I/O de BD, validación Pydantic y documentación Swagger implícita.
Database | PostgreSQL v16 + SQLAlchemy 2.x + Alembic | Transacciones ACID para datos clínicos sensibles, RLS/schemas para aislamiento y cifrado pgcrypto AES-256-GCM.
Cache | Redis | Acceso O(1) para sesiones activas y almacenamiento de contexto conversacional en tiempo real.
Mobile | React Native | Aplicación multiplataforma (Android/iOS) consumiendo la misma API REST/OpenAPI.
IA / LLM | Claude 3.5 Sonnet | Proveedor principal a través de LLM Gateway para extracción de factores de riesgo y análisis pragmático general.
Processing | SpaCy + LLM Gateway | Anonimización estructurada PII y procesamiento sintomático inicial para cualquier especialidad médica.

🎯 Functional Scope Target V1
Included in V1 | Post V1 / Prohibited
--- | ---
Registro/consentimiento informado, agenda y búsqueda unificada de profesionales de la salud. | Videollamadas integradas, pasarela de pagos, interoperabilidad EHR/HL7 FHIR compleja.
Copiloto Clínico: Alertas de riesgo cardiovascular, metabólico o general, análisis de fichas de seguimiento y preguntas guía. | Diagnóstico automatizado, prescripción farmacológica directa o decisiones médicas autónomas.
Cuestionarios de hábitos/prevención y registro de síntomas prevalentes transversales. | Recomendación automática de especialistas sin validación del médico tratante.

🗂️ Repository Structure (healthflow-framework-ia)
HealthFlow AI/
|-- .vscode/
|   `-- tasks.json
|-- mi-framework-ia/
|   |-- agents/
|   |   |-- coding_agent/
|   |   |   |-- prompts/
|   |   |   |-- agent.py
|   |   |   `-- manifest.yaml
|   |   |-- clinical_analysis_agent/
|   |   |   |-- prompts/
|   |   |   |   |-- general_risk_analysis.md
|   |   |   |   `-- clinical_prevention_guide.md
|   |   |   `-- manifest.yaml
|   |   `-- research_agent/
|   |       |-- prompts/
|   |       |   |-- agent.py
|   |       |   `-- manifest.yaml
|   |   `-- __init__.py
|   |-- alembic/
|   |   |-- alembic/
|   |   |   `-- versions/
|   |   |-- versions/
|   |   |   `-- 20260921_initial_schema.py
|   |   |-- env.py
|   |   `-- __init__.py
|   |-- config/
|   |   |-- environments/
|   |   |   |-- dev.yaml
|   |   |   `-- prod.yaml
|   |   |-- agents.yaml
|   |   `-- skills.yaml
|   |-- core/
|   |   |-- agent_base/
|   |   |   |-- __init__.py
|   |   |   |-- agent_registry.py
|   |   |   `-- base_agent.py
|   |   |-- llm_gateway/
|   |   |   |-- __init__.py
|   |   |   |-- cost_tracker.py
|   |   |   `-- provider_router.py
|   |   |-- memory/
|   |   |   |-- __init__.py
|   |   |   |-- long_term.py
|   |   |   |-- memory_manager.py
|   |   |   `-- short_term.py
|   |   |-- observability/
|   |   |   |-- __init__.py
|   |   |   |-- logger.py
|   |   |   `-- tracer.py
|   |   |-- orchestrator/
|   |   |   |-- __init__.py
|   |   |   |-- executor.py
|   |   |   |-- planner.py
|   |   `-- router.py
|   |   |-- security/
|   |   |   |-- __init__.py
|   |   |   |-- guardrails.py
|   |   |   |-- permissions.py
|   |   |   |-- prompts_anonymization_pii.md
|   |   |   `-- prompts_pii_anonymizer_origin.md
|   |   |-- skill_base/
|   |   |   |-- __init__.py
|   |   |   |-- base_skill.py
|   |   |   `-- skill_registry.py
|   |   |-- __init__.py
|   |   |-- base.py
|   |   |-- prompt_llm_gateway.md
|   |   `-- prompts_security_crypto.md
|   |-- deployment/
|   |   |-- prompts_devops.md
|   |   `-- prompts_infrastructure_devops_origin.md
|   |-- docs/
|   |   |-- 01_context_and_interview.md
|   |   |-- 02_requirements_rf_rnf.md
|   |   |-- 03_user_stories.md
|   |   |-- architecture.md
|   |   |-- decision_technology.md
|   |   |-- Diagram_cases_healthflow.mmd
|   |   |-- Diagram_cases_healthflow.png
|   |   |-- Component_diagram_healthflow.drawio
|   |   |-- Component_diagram_healthflow.mmd
|   |   |-- ER_diagram_healthflow.drawio
|   |   |-- ER_diagram_healthflow.mmd
|   |   |-- manifest_schema.md
|   |   |-- prompt_01_architecture.md
|   |   |-- STITCH_FULL_PROTOTYPE_SPEC.md
|   |   |-- STITCH_MOBILE_PROTOTYPE_SPEC.md
|   |   `-- STITCH_WEB_PROTOTYPE_SPEC.md
|   |-- evaluations/
|   |   |-- agent_benchmarks/
|   |   |   |-- clinical_analysis_agent.md
|   |   |   `-- README.md
|   |   |-- skill_tests/
|   |   |   `-- README.md
|   |   |-- prompts_client_testing.md
|   |   `-- prompts_unitary_testing_mock.md
|   |-- interfaces/
|   |   |-- api/
|   |   |   |-- main.py
|   |   |   |-- prompts_api_domain_v1.md
|   |   |   |-- prompts_contracts_and_security.md
|   |   |   |-- prompts_openapi_schemas.md
|   |   `-- prompts_security_api.md
|   |   |-- chat_ui/
|   |   |   `-- README.md
|   |   |-- cli/
|   |   |   |-- main.py
|   |   `-- frontend/
|   |       |-- prompts_pdf_export_origin.md
|   |       |-- prompts_report_pdf.md
|   |       |-- prompts_ui_react.md
|   |       `-- prompts_ui_roles_react.md
|   |-- mobile/
|       `-- prompts_mobile_react_native.md
|   |-- models/
|   |   |-- __init__.py
|   |   |-- analyses.py
|   |   |-- clinical_notes.py
|   |   |-- clinical_followup.py
|   |   |-- guiding_questions.py
|   |   |-- prompts_database_origin.md
|   |   |-- prompts_data_modeling.md
|   |   |-- reports.py
|   `-- users.py
|   |-- skills/
|   |   |-- code_executor/
|   |   |   |-- manifest.yaml
|   |   |   `-- skill.py
|   |   |-- db_query/
|   |   |   |-- manifest.yaml
|   |   |   `-- skill.py
|   |   |-- document_generator/
|   |   |   |-- manifest.yaml
|   |   |   |-- prompts_document_generator.md
|   |   |   `-- skill.py
|   |   |-- web_search/
|   |   |   |-- manifest.yaml
|   |   `-- __init__.py
|   |-- tools/
|   |   |-- __init__.py
|   |   |-- github_client.py
|   |   `-- slack_client.py
|   |-- .gitignore
|   `-- alembic.ini
|-- scripts/
|   |-- update_readme.ps1
|   `-- watch_readme.ps1
-- README.md

👥 Team Roles
- Product Owner / Lead AI Architect – Edwar Ibagué
- Full-Stack Developer – Daniel Felipe Andrade
- Medical AI Engineer – Nicol Sneider Murillo
- Frontend Developer – React / React Native Interface
- QA / Tester – Validation of Clinical Cases and Prompts
- DevOps – Docker Deployment, Render

⚠️ Ethical and Legal Disclaimer
HealthFlow AI es una herramienta analítica de soporte para profesionales de la salud en general.
- No emite diagnósticos clínicos autónomos ni sustituye la evaluación y criterio del profesional médico.
- El tratamiento de datos de salud requiere consentimiento explícito y cumplimiento estricto de la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia.
- Todos los indicadores y métricas de soporte deben ser revalidados por el médico antes de registrarse en la historia clínica oficial.
- Queda prohibido el uso autónomo por parte de pacientes para automedicación o toma de decisiones clínicas.
- El repositorio opera con datos sintéticos para pruebas de desarrollo.

💬 Support
¿Tienes dudas o sugerencias de integración? Revisa la sección de Issues o abre un nuevo reporte. , rectifica que tenga la estrcutura de este proyecto y el nombre el proyecto es: HealthFlow AI