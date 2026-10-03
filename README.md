# MindFlow AI — Plataforma Híbrida de Salud Mental con Copiloto Profesional

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Estado](https://img.shields.io/badge/Estado-En_Desarrollo-yellow)](https://github.com/EdwarIbague23/Electiva_IA-/graphs/activity)
[![Curso](https://img.shields.io/badge/UNIMINUTO-Electiva_IA_2026--2-green)](https://uniminuto.edu)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-MIREDIS-FF4438.svg)](https://redis.io/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.73-61DAFB.svg)](https://reactnative.dev/)

---

## 📋 Tabla de contenido

- [Visión del proyecto](#-visión-del-proyecto)
- [Arquitectura del sistema](#-arquitectura-del-sistema)
- [Stack tecnológico](#-stack-tecnológico)
- [Alcance del MVP](#-alcance-del-mvp)
- [Estructura del repositorio](#-estructura-del-repositorio)
- [Documentación técnica](#-documentación-técnica)
- [Equipo](#-equipo)
- [Disclaimer ético](#-disclaimer-ético)
- [Soporte](#-soporte)

---

## 📌 Visión del Proyecto

MindFlow AI es una plataforma híbrida para pacientes y profesionales de salud mental, con un copiloto de análisis de notas de uso exclusivo del terapeuta. Los clientes web y móvil comparten una API. El copiloto presenta señales y evidencia para revisión profesional; no genera diagnósticos ni decisiones clínicas. Proyecto desarrollado para la **Electiva CPC Integración IA** (UNIMINUTO Ibagué, 2026‑2). El repositorio contiene actualmente el framework y documentación de preparación; no representa todavía una aplicación lista para uso clínico.

---

## 🏗️ Arquitectura del Sistema

La plataforma emplea una arquitectura **hibrida Web + Móvil** con las siguientes capas:

| Capa | Tecnología | Descripción |
|------|------------|-------------|
| **Presentación web** | React + TypeScript | Portal web de paciente y profesional |
| **Presentación móvil** | React Native | Aplicación Android/iOS para tareas prioritarias de paciente y profesional |
| **Aplicación** | FastAPI (Python) | Servidor API REST con async/await, validación Pydantic |
| **Orquestación** | Orchestrator Core | Router/Planner/Executor que coordina skills y agents |
| **Infraestructura** | PostgreSQL + Redis | Base de datos relacional + caché de sesiones en memoria |

---

## 🛠️ Stack Tecnológico (Validación 8vo Semestre)

| Categoría | Tecnología | Justificación |
|-----------|------------|---------------|
| **Lenguaje / Servidor** | **Python + FastAPI** | Async nativo para LLM calls y DB I/O, validación automática con Pydantic, documentación Swagger automática, mejor rendimiento en cargas de IA vs Node.js |
| **Base de Datos** | **PostgreSQL (SQL relacional)** | Transacciones ACID para datos sensibles, consultas complejas para análisis clínico, ya configurado via Alembic |
| **Caché** | **Redis** | Acceso O(1) para sesiones activas, TTL automático para contexto de conversación, reduce latencia en respuestas del copiloto |
| **Móvil** | **React Native** | Aplicación Android/iOS que consume la misma API REST/OpenAPI que la web |
| **IA / LLM** | **Claude 3.5 Sonnet** | Proveedor principal a través del LLM Gateway |
| **Procesamiento** | **SpaCy + LLM Gateway** | Anonimización y análisis estructurado; LangChain queda sujeto a necesidad comprobada |

---

## 🎯 Alcance funcional objetivo V1

| **Incluido en V1** | **Posterior a V1 / prohibido** |
| :--- | :--- |
| Registro/consentimiento, búsqueda de profesionales verificados, disponibilidad y agenda; notas con acceso restringido. | Videollamada, pagos, cuestionarios longitudinales e integración EHR. |
| Copiloto profesional: señales emocionales/cognitivas, evidencia textual y preguntas guía para revisión. | Diagnóstico, prescripción, recomendación automática de especialistas o decisiones clínicas autónomas. |

---

## 🗂️ Estructura del Repositorio (`mi-framework-ia`)

El inventario siguiente se regenera localmente al crear, modificar, renombrar o eliminar archivos del repositorio:

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
|   |   |   |   |-- analisis_emocional.md
|   |   |   |   `-- legacy_bateria_08_10.md
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
|   |   `-- env.py
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
|   |   |   |-- prompts_anonimizacion_pii.md
|   |   |   `-- prompts_pii_anonymizer_origen.md
|   |   |-- skill_base/
|   |   |   |-- __init__.py
|   |   |   |-- base_skill.py
|   |   |   `-- skill_registry.py
|   |   |-- __init__.py
|   |   |-- base.py
|   |   |-- prompt_llm_gateway.md
|   |   `-- prompts_seguridad_cripto.md
|   |-- deployment/
|   |   |-- prompts_devops.md
|   |   `-- prompts_infraestructura_devops_origen.md
|   |-- docs/
|   |   |-- 01_contexto_y_entrevista.md
|   |   |-- 02_requerimientos_rf_rnf.md
|   |   |-- 03_historias_de_usuario.md
|   |   |-- AI_CODEGEN_PLAYBOOK.md
|   |   |-- architecture.md
|   |   |-- decision_tecnologica.md
|   |   |-- diagrama_componentes_mindflow.drawio
|   |   |-- diagrama_componentes_mindflow.mmd
|   |   |-- diagrama_erd_mindflow.drawio
|   |   |-- diagrama_erd_mindflow.mmd
|   |   |-- manifest_schema.md
|   |   |-- prompt_01_arquitectura.md
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
|   |   `-- prompts_testing_unitario_mock.md
|   |-- interfaces/
|   |   |-- api/
|   |   |   |-- main.py
|   |   |   |-- prompts_api_dominio_v1.md
|   |   |   |-- prompts_contratos_y_seguridad.md
|   |   |   |-- prompts_schemas_openapi.md
|   |   |   `-- prompts_seguridad_api.md
|   |   |-- chat_ui/
|   |   |   `-- README.md
|   |   |-- cli/
|   |   |   `-- main.py
|   |   |-- frontend/
|   |   |   |-- prompts_export_pdf_origen.md
|   |   |   |-- prompts_report_pdf.md
|   |   |   |-- prompts_ui_react.md
|   |   |   `-- prompts_ui_roles_react.md
|   |   `-- mobile/
|   |       `-- prompts_mobile_react_native.md
|   |-- models/
|   |   |-- __init__.py
|   |   |-- analyses.py
|   |   |-- clinical_notes.py
|   |   |-- cognitive_distortions.py
|   |   |-- emotion_scores.py
|   |   |-- guiding_questions.py
|   |   |-- prompts_base_de_datos_origen.md
|   |   |-- prompts_modelado_datos.md
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
`-- README.md
```
_Este inventario se genera localmente desde los archivos del repositorio._
<!-- README-AUTO:END -->

---

## 👥 Roles del Equipo

- **Product Owner / Lead AI Architect** – Edwar Ibagué
- **Full‑Stack Developer** – Daniel Felipe Andrade
- **NLP Engineer** – Nicol Sneider Murillo
- **Frontend Developer** – Interfaz React / React Native
- **QA / Tester** – Validación de prompts y casos clínicos
- **DevOps** – Despliegue Docker, Render

---

## ⚠️ Disclaimer Ético y de Estado

**MindFlow AI es una herramienta de apoyo analítico para profesionales de la salud mental.**

- **No emite diagnósticos clínicos** ni sustituye la evaluación profesional.
- El tratamiento de datos sensibles requiere consentimiento explícito y cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia.
- Los resultados (emociones, distorsiones cognitivas, preguntas sugeridas) deben ser **validados y reinterpretados por el terapeuta** antes de ser incorporados a la historia clínica.
- El uso indebido de la herramienta para tomar decisiones médicas por cuenta propia está **estrictamente prohibido**.
- El prototipo y las pruebas deben usar datos sintéticos. La existencia de un diagrama o prompt no significa que la función esté implementada.

---

## 💬 Soporte

¿Tienes dudas? Revisa la sección de [**Issues**](https://github.com/EdwarIbague23/Electiva_IA-/issues) o abre un nuevo reporte.

---

<div align="center">

Distribuido bajo licencia **MIT**. Ver [`LICENSE`](./LICENSE) para más información.

</div>