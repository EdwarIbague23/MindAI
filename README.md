# MindFlow AI — Hybrid Mental Health Platform with Professional Copilot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-In_Development-yellow)](https://github.com/EdwarIbague23/Electiva_IA-/graphs/activity)
[![Course](https://img.shields.io/badge/UNIMINUTO-Electiva_IA_2026--2-green)](https://uniminuto.edu)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-MIREDIS-FF4438.svg)](https://redis.io/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.73-61DAFB.svg)](https://reactnative.dev/)

---

## 📋 Table of Contents

- [Project Vision](#-project-vision)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [MVP Scope](#-mvp-scope)
- [Repository Structure](#-repository-structure)
- [Technical Documentation](#-technical-documentation)
- [Team](#-team)
- [Ethical Disclaimer](#-ethical-disclaimer)
- [Support](#-support)

## 📌 Project Vision

MindFlow AI is a hybrid platform for mental health patients and professionals, with a therapist-use-only analysis copilot. Web and mobile clients share an API. The copilot presents signals and evidence for professional review; it does not generate diagnoses or clinical decisions. Developed for the **Electiva CPC Integración IA** (UNIMINUTO Ibagué, 2026‑2). The repository currently contains the framework and preparation documentation; it does not yet represent a clinical-use application.

---

## 🏗️ System Architecture

The platform employs a **Hybrid Web + Mobile** architecture with the following layers:

| Layer | Technology | Description |
|-------|------------|-------------|
| **Web Frontend** | React + TypeScript | Patient and professional web portal |
| **Mobile Frontend** | React Native | Android/iOS app for priority patient and professional tasks |
| **Application** | FastAPI (Python) | REST API server with async/await, Pydantic validation |
| **Orchestration** | Orchestrator Core | Router/Planner/Executor coordinating skills and agents |
| **Infrastructure** | PostgreSQL v16 + SQLAlchemy 2.x + Alembic + Redis v7 | Relational DB with ACID guarantees, session caching, pgcrypto for AES-256-GCM encryption of clinical notes |

---

## 🛠️ Tech Stack (Validated 8th Semester)

| Category | Technology | Justification |
|----------|------------|---------------|
| **Language / Server** | **Python + FastAPI** | Native async for LLM calls and DB I/O, automatic Pydantic validation, automatic Swagger documentation, better performance in AI loads vs Node.js |
| **Database** | **PostgreSQL v16 + SQLAlchemy 2.x + Alembic** | ACID transactions for sensitive data, complex queries for clinical analysis, referential integrity, tenant isolation (schemas/RLS), versioned migrations. Configured via Alembic with pgcrypto support for AES-256-GCM encryption of clinical notes. |
| **Cache** | **Redis** | O(1) access for active sessions, automatic TTL for conversation context, reduces copilot response latency |
| **Mobile** | **React Native** | Android/iOS app that consumes the same REST/OpenAPI API as the web |
| **IA / LLM** | **Claude 3.5 Sonnet** | Primary provider through the LLM Gateway |
| **Processing** | **SpaCy + LLM Gateway** | Structured anonymization and analysis; LangChain subject to verified need |

---

## 🎯 Functional Scope Target V1

| **Included in V1** | **Post V1 / Prohibited** |
| :--- | :--- |
| Registration/consent, verified professional search, availability and agenda; restricted-access notes. | Video call, payments, longitudinal questionnaires and EHR integration. |
| Professional copilot: emotional/cognitive signals, textual evidence and guiding questions for review. | Diagnosis, prescribing, automatic specialist recommendation or autonomous clinical decisions. |

---

## 🗂️ Repository Structure (`mi-framework-ia`)

The following inventory is regenerated locally upon creating, modifying, renaming, or deleting repository files:

<!-- README-AUTO:START -->
```text
MindFlow AI/
|-- .vscode/
|   `-- tasks.json
|-- mi-framework-ia/
|   |-- agents/
|   |   |-- coding_agent/
|   |   |   |-- prompts/
|   |   |   |-- agent.py
|   |   |   `-- manifest.yaml
|   |   |-- emotion_analysis_agent/
|   |   |   |-- prompts/
|   |   |   |   |-- emotional_analysis.md
|   |   |   |   `-- legacy_battery_08_10.md
|   |   |   `-- manifest.yaml
|   |   |-- research_agent/
|   |   |   |-- prompts/
|   |   |   |-- agent.py
|   |   |   `-- manifest.yaml
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
|   |   |   `-- router.py
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
|   |   |-- Diagram_cases_mindflow.mmd
|   |   |-- Diagram_cases_mindflow.png
|   |   |-- Component_diagram_mindflow.drawio
|   |   |-- Component_diagram_mindflow.mmd
|   |   |-- ER_diagram_mindflow.drawio
|   |   |-- ER_diagram_mindflow.mmd
|   |   |-- manifest_schema.md
|   |   |-- prompt_01_architecture.md
|   |   |-- STITCH_FULL_PROTOTYPE_SPEC.md
|   |   |-- STITCH_MOBILE_PROTOTYPE_SPEC.md
|   |   `-- STITCH_WEB_PROTOTYPE_SPEC.md
|   |-- evaluations/
|   |   |-- agent_benchmarks/
|   |   |   |-- emotion_analysis_agent.md
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
|   |   |   `-- prompts_openapi_schemas.md
|   |   |   `-- prompts_security_api.md
|   |   |-- chat_ui/
|   |   |   `-- README.md
|   |   |-- cli/
|   |   |   `-- main.py
|   |   |-- frontend/
|   |   |   |-- prompts_pdf_export_origin.md
|   |   |   |-- prompts_report_pdf.md
|   |   |   |-- prompts_ui_react.md
|   |   |   `-- prompts_ui_roles_react.md
|   |   `-- mobile/
|       `-- prompts_mobile_react_native.md
|   |-- models/
|   |   |-- __init__.py
|   |   |-- analyses.py
|   |   |-- clinical_notes.py
|   |   |-- cognitive_distortions.py
|   |   |-- emotion_scores.py
|   |   |-- guiding_questions.py
|   |   |-- prompts_database_origin.md
|   |   |-- prompts_data_modeling.md
|   |   |-- reports.py
|   |   `-- users.py
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
|   |   |   `-- skill.py
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
```
<!-- README-AUTO:END -->
_This inventory is generated locally from the repository files._

---

## 👥 Team Roles

- **Product Owner / Lead AI Architect** – Edwar Ibagué
- **Full-Stack Developer** – Daniel Felipe Andrade
- **NLP Engineer** – Nicol Sneider Murillo
- **Frontend Developer** – React / React Native Interface
- **QA / Tester** – Prompt and clinical case validation
- **DevOps** – Docker Deployment, Render

---

## ⚠️ Ethical and State Disclaimer

**MindFlow AI is a supportive analytical tool for mental health professionals.**

- **Does not issue clinical diagnoses** or substitute professional evaluation.
- Sensitive data treatment requires explicit consent and compliance with Law 1581 of 2012 and Decree 1377 of 2013 of Colombia.
- Results (emotions, cognitive distortions, suggested questions) must be **validated and reinterpreted by the therapist** before being incorporated into the clinical history.
- Misuse of the tool to make medical decisions on one's own account is **strictly prohibited**.
- Prototype and tests must use synthetic data. The existence of a diagram or prompt does not mean the function is implemented.

---

## 💬 Support

Having doubts? Review the [**Issues**](https://github.com/EdwarIbague23/Electiva_IA-/issues) section or open a new report.

---

<div align="center">

Distributed under **MIT** license. See [`LICENSE`](./LICENSE) for more information.

</div>