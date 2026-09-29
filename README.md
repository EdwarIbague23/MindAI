# MindFlow AI — Copiloto de Triaje y Análisis Emocional para Terapeutas

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Estado](https://img.shields.io/badge/Estado-En_Desarrollo-yellow)](https://github.com/EdwarIbague23/Electiva_IA-/graphs/activity)
[![Curso](https://img.shields.io/badge/UNIMINUTO-Electiva_IA_2026--2-green)](https://uniminuto.edu)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-MIREDIS-FF4438.svg)](https://redis.io/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.73-61DAFB.svg)](https://reactnative.dev/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.38.0-FF5A5F.svg)](https://streamlit.io/)

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

MindFlow AI es un copiloto inteligente diseñado para optimizar el análisis de notas clínicas en salud mental. Mediante modelos avanzados de Procesamiento de Lenguaje Natural (NLP), la plataforma transforma transcripciones en mapas visuales de emociones, detecta distorsiones cognitivas y sugiere enfoques para la próxima consulta. Proyecto desarrollado para la **Electiva CPC Integración IA** (UNIMINUTO Ibagué, 2026‑2). **Esta herramienta actúa exclusivamente como apoyo analítico y no sustituye el juicio profesional.**

---

## 🏗️ Arquitectura del Sistema

La plataforma emplea una arquitectura **hibrida Web + Móvil** con las siguientes capas:

| Capa | Tecnología | Descripción |
|------|------------|-------------|
| **Presentación** | Web (React) + Móvil (React Native) | Interfaces responsivas para terapeutas y pacientes |
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
| **Mobile** | **React Native** | Aplicación móvil híbrida que consume la misma API REST que la Web |
| **IA / LLM** | **Claude 3.5 Sonnet** | Proveedor principal a través del LLM Gateway |
| **Procesamiento** | **SpaCy + LangChain** | NLP y encadenamiento de prompts para extracción de emociones y distorsiones |

---

## 🎯 Alcance del MVP (Demostración Sesión 16)

| **Lo que SE DEMUESTRA** | **Lo que queda EXPLÍCITAMENTE FUERA** |
| :--- | :--- |
| **Entrada:** Carga/pegado de notas clínicas o transcripción anónima de consulta. | Diagnóstico clínico automatizado o emisión de recetas médicas. |
| **Procesamiento:** Extracción en tiempo real de estados de ánimo y distorsiones cognitivas (*pensamiento todo‑o‑nada*, *catastrofismo*). | Chat en vivo de interacción directa con el paciente o terapia presencial. |
| **Salida:** Dashboard con gráfico de emociones, hallazgos clave y 3 preguntas sugeridas para la próxima sesión. | Integración con sistemas de historias clínicas complejas (EHR). |

---

## 🗂️ Estructura del Repositorio (`mi-framework-ia`)

El proyecto está organizado bajo una arquitectura modular y escalable:

```text
mi-framework-ia/
├── agents/                  # Definición de agentes especializados y lógica de ejecución
├── config/                  # Configuraciones del framework
│   ├── environments/        # Variables de entorno y ajustes por ambiente
│   ├── agents.yaml          # Manifiesto de configuración de agentes
│   └── skills.yaml          # Manifiesto de configuración de habilidades
├── core/                    # Núcleo del framework (orquestador, memoria, LLM gateway)
├── docs/                    # Documentación técnica (diagramas .drawio, ERD, historias de usuario)
│   ├── architecture-diagram.drawio
│   ├── erd-database.drawio
│   └── 03_historias_de_usuario.md
├── evaluations/             # Pruebas de rendimiento, precisión y casos de validación
├── interfaces/              # Capas de presentación y puntos de entrada (API / Frontend)
│   ├── api/               # FastAPI server (main.py)
│   └── frontend/          # React y React Native interfaces
├── models/                  # Modelos de datos (SQLAlchemy + Pydantic)
├── skills/                  # Habilidades modulares atómicas
│   ├── code_executor/       # Ejecución segura de código
│   ├── db_query/            # Consultas estructuradas
│   ├── document_generator/  # Generación de reportes clínicos
│   └── web_search/          # Búsqueda y recuperación de información externa
├── tools/                   # Utilidades externas e integraciones
│   ├── github_client.py     # Cliente para automatización y control de versiones
│   └── slack_client.py      # Cliente de notificaciones y alertas
├── .gitignore                # Archivos excluidos del control de versiones
├── README.md                # Descripción principal del proyecto
└── alembic/                 # Migraciones PostgreSQL
```

---

## 👥 Roles del Equipo

- **Product Owner / Lead AI Architect** – Edwar Ibagué
- **Full‑Stack Developer** – Daniel Felipe Andrade
- **NLP Engineer** – Nicol Sneider Murillo
- **Frontend Developer** – Interfaz React / React Native
- **QA / Tester** – Validación de prompts y casos clínicos
- **DevOps** – Despliegue Docker, Render

---

## ⚠️ Disclaimer Ético

**MindFlow AI es una herramienta de apoyo analítico para profesionales de la salud mental.**

- **No emite diagnósticos clínicos** ni sustituye la evaluación profesional.
- **No almacena datos de identificación personal (PII)** sin el consentimiento explícito del paciente y el cumplimiento de normativas locales (HIPAA, LGPD, etc.).
- Los resultados (emociones, distorsiones cognitivas, preguntas sugeridas) deben ser **validados y reinterpretados por el terapeuta** antes de ser incorporados a la historia clínica.
- El uso indebido de la herramienta para tomar decisiones médicas por cuenta propia está **estrictamente prohibido**.

---

## 💬 Soporte

¿Tienes dudas? Revisa la sección de [**Issues**](https://github.com/EdwarIbague23/Electiva_IA-/issues) o abre un nuevo reporte.

---

<div align="center">

Distribuido bajo licencia **MIT**. Ver [`LICENSE`](./LICENSE) para más información.

</div>