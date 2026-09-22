
# MindFlow AI — Copiloto de Triaje y Análisis Emocional para Terapeutas
=======
<div align="center">

# 🧠 MindFlow AI
### Copiloto de Triaje y Análisis Emocional para Terapeutas
>>>>>>> ac7cafa7a0d3fb4d4fc5c778c68c6640aa5f0c49

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Estado](https://img.shields.io/badge/Estado-En_Desarrollo-yellow)](https://github.com/EdwarIbague23/Electiva_IA-/graphs/activity)
[![Curso](https://img.shields.io/badge/UNIMINUTO-Electiva_IA_2026--2-green)](https://uniminuto.edu)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3.15-orange.svg)](https://python.langchain.com/)
[![SpaCy](https://img.shields.io/badge/SpaCy-3.7.2-green.svg)](https://spacy.io/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)
<<<<<<< HEAD
[![Streamlit](https://img.shields.io/badge/Streamlit-1.38.0-FF5A5F.svg)](https://streamlit.io/)
=======

</div>

---

## 📋 Tabla de contenido

- [Visión del proyecto](#-visión-del-proyecto)
- [Alcance del MVP](#-alcance-del-mvp)
- [Estructura del repositorio](#️-estructura-del-repositorio-mi-framework-ia)
- [Documentación técnica](#-documentación-técnica)
- [Equipo](#-equipo)
- [Disclaimer ético](#️-disclaimer-ético)
- [Soporte](#-soporte)
>>>>>>> ac7cafa7a0d3fb4d4fc5c778c68c6640aa5f0c49

---

## 📌 Visión del Proyecto
<<<<<<< HEAD
MindFlow AI es un copiloto inteligente diseñado para optimizar el análisis de notas clínicas en salud mental. Mediante modelos avanzados de Procesamiento de Lenguaje Natural (NLP), la plataforma transforma transcripciones en mapas visuales de emociones, detecta distorsiones cognitivas y sugiere enfoques para la siguiente consulta. Proyecto desarrollado para la **Electiva CPC Integración IA** (UNIMINUTO Ibagué, 2026‑2). **Esta herramienta actúa exclusivamente como apoyo analítico y no sustituye el juicio profesional.**

---

## 🎯 Alcance del MVP (Demostración Sesión 16)

| Lo que **SE DEMUESTRA** en 3 minutos | Lo que queda **EXPLÍCITAMENTE FUERA** |
| :--- | :--- |
| **Entrada:** Carga/pegado de notas clínicas o transcripción anónima de consulta. | Diagnóstico clínico automatizado o emisión de recetas médicas. |
| **Procesamiento:** Extracción en tiempo real de estados de ánimo y distorsiones cognitivas (*pensamiento todo‑o‑nada*, *catastrofismo*). | Chat en vivo de interacción directa con el paciente o terapia presencial. |
| **Salida:** Dashboard con gráfico de emociones, hallazgos clave y 3 preguntas sugeridas para la próxima sesión. | Integración con sistemas de historias clínicas complejas (EHR). |

---

## 🗺️ Matriz de Integración de IA (7 Fases del SDLC)

| Fase del Proyecto | Tarea Concreta | Herramienta Candidata | Riesgo a Vigilar |
| :--- | :--- | :--- | :--- |
| **1. Ideación y Diseño** | Definición de prompts de análisis psicológico y taxonomía de distorsiones | Claude 3.5 Sonnet / GPT‑4o | Respuestas ambiguas o diagnósticos clínicos no solicitados |
| **2. Datos / Conocimiento** | Ingestión de texto clínico y anonimización de datos personales (PII) | Python / Regex / SpaCy | Infiltración de datos personales o sensibles del paciente |
| **3. Desarrollo Core** | API de extracción de entidades emocionales y estructuración JSON | FastAPI / LangChain | Latencia en el procesamiento de textos largos |
| **4. Interfaz / UX** | Dashboard visual con gráficos de radar de emociones y métricas | v0.dev / Streamlit / React | Visualización confusa para el terapeuta |
| **5. Testing y Validación** | Pruebas con notas clínicas ficticias y casos de prueba | PyTest / GitHub Copilot | Falsos positivos en la detección de distorsiones cognitivas |
| **6. Despliegue / Ops** | Despliegue en la nube con cifrado de datos | Vercel / Render | Vulnerabilidades de privacidad/seguridad de datos de salud |
| **7. Documentación** | Guion del pitch y estructuración del README inicial | Gamma / Claude | No enfatizar el disclaimer ético de asistencia al profesional |

---

## 📂 Estructura del Repositorio

```text
mindflow-ai/
├── docs/                # Documentación del proyecto y acta de nacimiento
├── backend/             # API en Python (FastAPI + LangChain)
├── frontend/            # Interfaz de usuario (Streamlit / React)
├── prompts/             # Plantillas de prompts y taxonomía de distorsiones
├── .gitignore           # Archivos excluidos del control de versiones
└── README.md            # Descripción principal del proyecto
=======

**MindFlow AI** es un framework y copiloto inteligente diseñado para optimizar el análisis de notas clínicas en salud mental y triaje emocional. Mediante modelos avanzados de Procesamiento de Lenguaje Natural (NLP), la plataforma transforma transcripciones en mapas visuales de emociones, detecta distorsiones cognitivas y sugiere enfoques terapéuticos.

Proyecto desarrollado para la **Electiva CPC Integración IA** (UNIMINUTO Ibagué, 2026-2).

> ⚠️ **Esta herramienta actúa exclusivamente como apoyo analítico y no sustituye el juicio profesional.**

---

## 🎯 Alcance del MVP

| ✅ Lo que **SE DEMUESTRA** en el MVP | 🚫 Lo que queda **EXPLÍCITAMENTE FUERA** |
|---|---|
| **Entrada:** Carga/pegado de notas clínicas o transcripción anónima de consulta. | Diagnóstico clínico automatizado o emisión de recetas médicas. |
| **Procesamiento:** Extracción en tiempo real de estados de ánimo y distorsiones cognitivas (*pensamiento todo-o-nada*, *catastrofismo*). | Chat en vivo de interacción directa con el paciente o terapia presencial. |
| **Salida:** Dashboard con gráfico de emociones, hallazgos clave y preguntas sugeridas para la próxima sesión. | Integración con sistemas complejos de historias clínicas (EHR). |

---

## 🗂️ Estructura del Repositorio (`mi-framework-ia`)

El proyecto está organizado bajo una arquitectura modular y escalable de framework de IA:

```text
mi-framework-ia/
├── agents/                  # Definición de agentes especializados y lógica de ejecución
├── config/                  # Configuraciones del framework
│   ├── environments/        # Variables de entorno y ajustes por ambiente
│   ├── agents.yaml          # Manifiesto de configuración de agentes
│   └── skills.yaml          # Manifiesto de configuración de habilidades
├── core/                    # Núcleo del framework (orquestador, memoria, LLM gateway)
├── docs/                    # Documentación técnica (architecture.md, manifest_schema.md)
├── evaluations/             # Pruebas de rendimiento, precisión y casos de validación
├── interfaces/              # Capas de presentación y puntos de entrada (API / Frontend)
├── skills/                  # Habilidades modulares atómicas
│   ├── code_executor/       # Ejecución segura de código
│   ├── db_query/            # Consultas estructuradas
│   ├── document_generator/  # Generación de reportes clínicos
│   └── web_search/          # Búsqueda y recuperación de información externa
├── tools/                   # Utilidades externas e integraciones
│   ├── github_client.py     # Cliente para automatización y control de versiones
│   └── slack_client.py      # Cliente de notificaciones y alertas
├── .gitignore                # Archivos excluidos del control de versiones
├── Proyecto_MindFlow_AI.pdf   # Documento oficial del proyecto técnico
└── README.md                  # Descripción principal del proyecto
>>>>>>> ac7cafa7a0d3fb4d4fc5c778c68c6640aa5f0c49
```

---


## 👥 Roles del Equipo

- **Product Owner / Lead AI Architect** – Edwar Ibagué  
- **Full‑Stack Developer** – (Daniel Felipe Andrade)  
- **NLP Engineer** – Nicol Sneider Murillo 
- **Frontend Developer** – Interfaz Streamlit / React  
- **QA / Tester** – Validación de prompts y casos clínicos  
- **DevOps** – Despliegue Docker, Render / Vercel  

---


## ⚠️ Disclaimer Ético

> **MindFlow AI es una herramienta de apoyo analítico para profesionales de la salud mental.**  
> - **No emite diagnósticos clínicos** ni sustituye la evaluación profesional.  
> - **No almacena datos de identificación personal (PII)** sin el consentimiento explícito del paciente y el cumplimiento de normativas locales (HIPAA, LGPD, etc.).  
> - Los resultados (emociones, distorsiones cognitivas, preguntas sugeridas) deben ser **validados y reinterpretados por el terapeuta** antes de ser incorporados a la historia clínica.  
> - El uso indebido de la herramienta para tomar decisiones médicas por cuenta propia está **estrictamente prohibido**.

---

*¿Tienes dudas? Revisa la sección de [Issues](https://github.com/EdwarIbague23/Electiva_IA-/issues) o abre un nuevo reporte.*
=======
## 📚 Documentación Técnica

| Documento | Contenido |
|---|---|
| [`docs/architecture.md`](./docs/architecture.md) | Capas del sistema, infraestructura compartida (memoria, LLM Gateway, seguridad, observabilidad) y diagrama de flujo de datos. |
| [`docs/manifest_schema.md`](./docs/manifest_schema.md) | Especificación formal de los campos obligatorios/opcionales de `agents.yaml` y `skills.yaml`. |

---

## 👥 Equipo

| Rol | Integrante |
|---|---|
| Product Owner / Lead AI Architect | Edwar Esteban Ibagué |
| Backend Developer | Daniel Felipe Andrade |
| NLP Engineer & Frontend | Nicol Sneider Murillo |

---

## ⚠️ Disclaimer Ético

**MindFlow AI** es una herramienta de apoyo analítico para profesionales de la salud mental:

- ❌ **No** emite diagnósticos clínicos ni sustituye la evaluación profesional.
- 🔒 **No** almacena datos de identificación personal (PII) sin el consentimiento explícito del paciente y el cumplimiento de normativas de privacidad.
- 👩‍⚕️ Los resultados (emociones, distorsiones cognitivas, preguntas sugeridas) **deben ser validados y reinterpretados** por el terapeuta antes de ser incorporados a la historia clínica.
- 🚫 El uso indebido de la herramienta para tomar decisiones médicas por cuenta propia está **estrictamente prohibido**.

---

## 💬 Soporte

¿Tienes dudas? Revisa la sección de [**Issues**](https://github.com/EdwarIbague23/Electiva_IA-/issues) o abre un nuevo reporte.

---

<div align="center">

Distribuido bajo licencia **MIT**. Ver [`LICENSE`](./LICENSE) para más información.

</div>
>>>>>>> ac7cafa7a0d3fb4d4fc5c778c68c6640aa5f0c49
