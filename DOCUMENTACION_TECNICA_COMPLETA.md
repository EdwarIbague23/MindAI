# DOCUMENTACIÓN TÉCNICA COMPLETA - MindFlow AI

## 1. Ficha Técnica y Resumen Ejecutivo

### 1.1. Información General

| Campo | Valor |
| :-- | :-- |
| **Nombre del Proyecto** | MindFlow AI - Copiloto de Triaje y Análisis Emocional para Terapeutas |
| **Versión Actual** | 2.0.0 |
| **Estado del Proyecto** | En desarrollo (MVP) |
| **Repositorio Principal** | mi-framework-ia/ |
| **Licencia** | MIT |
| **Institución** | UNIMINUTO - Electiva CPC Integración IA (Ibagué, 2026-2) |

### 1.2. Descripción General

**MindFlow AI** es un copiloto inteligente basado en agentes diseñado para optimizar el análisis de notas clínicas en salud mental y el triaje emocional. Mediante modelos avanzados de Procesamiento de Lenguaje Natural (NLP), la plataforma transforma transcripciones clínicas anonimizadas en mapas visuales de emociones, detecta distorsiones cognitivas y sugiere preguntas guía para la siguiente sesión terapéutica.

La herramienta actúa **exclusivamente como apoyo analítico** y **no sustituye el juicio profesional del terapeuta**. No emite diagnósticos clínicos, ni prescripciones médicas.

### 1.3. Objetivos Técnicos y Funcionales

#### Objetivos Funcionales
- **Procesamiento Clínico**: Analizar notas clínicas o transcripciones anonimizadas para extraer estados emocionales y distorsiones cognitivas.
- **Visualización Inteligente**: Presentar un dashboard con gráfico de emociones, hallazgos clave y preguntas sugeridas para la próxima sesión.
- **Soporte al Terapeuta**: Generar reportes estructurados en lenguaje profesional para facilitar la revisión clínica.
- **Triage Emocional**: Clasificar y priorizar el nivel de atención sugerido basado en el contenido analizado.

#### Objetivos Técnicos
- **Arquitectura Agentic**: Implementar un framework modular basado en agentes especializados orquestados centralmente.
- **Seguridad por Diseño**: Garantizar anonimización obligatoria de PII, cifrado en reposo y trazabilidad completa sin almacenar datos clínicos identificables.
- **Abstracción de LLM**: Desacoplar la lógica de negocio de proveedores específicos mediante un LLM Gateway reemplazable.
- **Validación Estructurada**: Aplicar esquemas JSON estrictos para todas las entradas y salidas de agentes y habilidades.
- **Extensibilidad**: Facilitar la adición de nuevos agentes, habilidades y proveedores LLM mediante manifiestos YAML.
- **Observabilidad**: Implementar trazabilidad con request_id sin registro de contenido clínico sensible.

## 2. Arquitectura del Sistema

### 2.1. Patrón de Arquitectura

MindFlow AI adopta una **Arquitectura Basada en Agentes (Agentic Architecture)** con los siguientes patrones complementarios:

| Patrón | Aplicación |
| :-- | :-- |
| **Clean Architecture + Hexagonal (Ports & Adapters)** | Separación estricta entre dominio (core/, agents/, skills/) e interfaces de entrada/salida (interfaces/). |
| **Modular Agent Framework** | Orquestación basada en agentes especializados, habilidades atómicas modulares y registro centralizado. |
| **Domain-Driven Design (ligero)** | Organización por capacidades (memoria, LLM Gateway, seguridad, observabilidad). |
| **Registry Pattern** | Registro dinámico de agentes y habilidades mediante manifiestos YAML. |
| **Strategy Pattern** | Selección de proveedores LLM según política y costos. |
| **Pipeline Orchestration** | Flujo unidireccional: Plan → Route → Execute con validación en cada etapa. |

### 2.2. Diagrama de Arquitectura (Mermaid)

`mermaid
flowchart TD
    A[Terapeuta / Usuario] -->|Nota clínica anonimada| B[Interfaces - API REST + Frontend React]
    B -->|JWT + 2FA + Request| C{Core - Orquestador}
    
    C -->|Obligatorio| D[[Core/Security - PII Pipeline]]
    D -->|Texto anonimizado| C
    
    C -->|Enrutamiento según agents.yaml| E[Agentes - Triage/Emotion/Report/Audit]
    E -->|Solicitud validada| F[[Core - LLM Gateway]]
    F -->|Proveedor configurado| G[(Proveedor LLM Externo)]
    G -->|Respuesta cruda| F
    F -->|Validación output_schema| E
    
    E -->|Skill autorizada| H[Skills - Document Generator/DB Query/Code Executor/Web Search]
    E -->|Resultado estructurado| C
    
    C -->|Cifrado AES-256-GCM| I[(PostgreSQL - Cifrado en Reposo)]
    C -->|Generación reporte| J[Agente Report Generation]
    J --> H
    H --> K[Reporte PDF/Markdown]
    K --> B
    B -->|Dashboard + Reporte| A
    
    C -.->|request_id, latencia, status SIN PII| L[[Core - Observabilidad]]
    C -.->|Alertas operativas| M[[Tools - Slack Client]]
    C -.->|Issues técnicos| N[[Tools - GitHub Client]]
    
    style D fill:#ff9999
    style F fill:#99ccff
    style I fill:#99ff99
    style L fill:#ffff99
    style M fill:#ffcc99
    style N fill:#ffcc99
`

### 2.3. Stack Tecnológico

#### Backend / Procesamiento
| Tecnología | Versión | Propósito |
| :-- | :-- | :-- |
| **Python** | 3.12+ | Lenguaje base del framework |
| **FastAPI** | 0.115.4 | API REST asíncrona con validación Pydantic |
| **Uvicorn** | 0.32.0 | Servidor ASGI |
| **Pydantic** | 2.9.2 | Validación estricta de esquemas y DTOs |
| **LangChain** | 0.3.15 | Dependencia del framework (el orquestador actual es propio) |
| **LangGraph** | 0.2.60 | Dependencia disponible; aún no usada por el pipeline |
| **spaCy** | 3.8.2 | NLP para extracción de entidades y apoyo en anonimización |

#### Frontend / Interfaz
| Tecnología | Versión | Propósito |
| :-- | :-- | :-- |
| **React** | 18.3.1 | Interfaz web principal del dashboard clínico |
| **Vite** | 5.4.10 | Build tool y servidor de desarrollo |
| **Recharts** | 2.13.3 | Radar emocional y gráficas |

#### Bases de Datos & Almacenamiento
| Tecnología | Versión | Propósito |
| :-- | :-- | :-- |
| **PostgreSQL** | 15+ | Base de datos principal con cifrado en reposo |
| **SQLAlchemy** | 2.0.36+ | ORM asíncrono |
| **Alembic** | 1.14.0+ | Migraciones de base de datos |
| **AsyncPG** | 0.30.0+ | Driver asíncrono para PostgreSQL |

#### Mensajería / Event Streaming
| Tecnología | Estado | Propósito |
| :-- | :-- | :-- |
| **Interno (Orquestador)** | Implementado conceptualmente | Comunicación sincrónica entre agentes y skills vía orquestador central |

#### Infraestructura & Contenerización
| Tecnología | Versión | Propósito |
| :-- | :-- | :-- |
| **Docker** | (Recomendado) | Contenerización de servicios |
| **Docker Compose** | (Recomendado) | Orquestación local de desarrollo |
| **Git** | - | Control de versiones |

#### Servicios Cloud / APIs Externas
| Servicio | Estado | Propósito |
| :-- | :-- | :-- |
| **Proveedores LLM** | Configurable (OpenAI/Anthropic/etc.) | Análisis y razonamiento mediante Gateway |
| **Vercel/Render** | Planificado | Despliegue cloud (según roadmap) |
| **GitHub** | Integrado vía tools/github_client.py | Automatización de versiones e issues |
| **Slack** | Integrado vía tools/slack_client.py | Notificaciones operativas |

#### Seguridad & Observabilidad
| Tecnología | Versión | Propósito |
| :-- | :-- | :-- |
| **cryptography** | 43.0.3+ | Cifrado AES-256-GCM |
| **structlog** | 24.4.0+ | Logging estructurado JSON |
| **OpenTelemetry** | 1.27.0+ | Tracing y observabilidad |
| **tenacity** | 9.0.0+ | Reintentos con backoff exponencial |

## 3. Estructura del Proyecto

### 3.1. Organización del Repositorio

```text
MindIA/                          # Raíz del repositorio
├── .env.example                 # Variables de entorno de referencia
├── docker-compose.yml           # PostgreSQL 15
├── backend.md
├── frontend.md
├── web.md
├── mobile.md
├── DOCUMENTACION_TECNICA_COMPLETA.md
└── MindAI/
    ├── README.md
    └── mi-framework-ia/         # Framework y aplicación
        ├── agents/
        │   ├── cognitive_distortion_agent/
        │   ├── emotion_analysis_agent/
        │   ├── report_agent/
        │   ├── triage_agent/
        │   ├── coding_agent/
        │   └── research_agent/
        ├── alembic/             # Migraciones
        ├── config/
        │   ├── agents.yaml
        │   ├── skills.yaml
        │   └── environments/
        ├── core/
        │   ├── agent_base/
        │   ├── db/
        │   ├── llm_gateway/
        │   ├── observability/
        │   ├── orchestrator/
        │   ├── reporting/
        │   ├── schemas/
        │   ├── security/
        │   ├── skill_base/
        │   ├── config.py
        │   ├── errors.py
        │   └── manifest_validator.py
        ├── docs/
        ├── evaluations/
        ├── interfaces/
        │   ├── api/
        │   └── frontend/
        ├── skills/
        │   ├── code_executor/
        │   ├── db_query/
        │   ├── document_generator/
        │   └── web_search/
        ├── tests/
        ├── tools/
        ├── alembic.ini
        ├── pyproject.toml
        ├── requirements.txt
        └── README.md
```

### 3.2. Descripción de Componentes Clave

| Componente | Ubicación | Descripción |
| :-- | :-- | :-- |
| **Orquestador** | core/orchestrator/ | Núcleo de control que carga manifiestos, enruta solicitudes, ejecuta ciclo Plan-Act-Observe y aplica guardrails. |
| **LLM Gateway** | core/llm_gateway/ | Abstracción única para proveedores LLM con timeout, reintentos, validación de salida y rate limiting. |
| **Persistencia** | core/db/ | Repositorios async de usuarios, sesiones, análisis y reportes (datos cifrados). |
| **Seguridad** | core/security/ | Pipeline de anonimización PII, servicio de cifrado AES-256-GCM y validaciones transversales. |
| **Observabilidad** | core/observability/ | Trazabilidad con `request_id`/`analysis_id`, logging JSON y redacción de campos sensibles. |
| **Base de Agentes** | core/agent_base/ | Clase base BaseAgent con contrato común, hooks y validación de permisos. |
| **Base de Skills** | core/skill_base/ | Clase base BaseSkill para habilidades modulares auditables. |
| **Agentes** | agents/ | Implementaciones especializadas (triage, emotion_analysis, cognitive_distortion, report). |
| **Skills** | skills/ | Funcionalidades atómicas: ejecución de código, consultas BD, generación de documentos, búsqueda web. |
| **Interfaces** | interfaces/ | API REST (FastAPI), frontend React, CLI y chat UI. |
| **Tools** | tools/ | Clientes para GitHub y Slack (solo automatización, sin acceso a datos clínicos). |

## 4. Componentes del Sistema

### 4.1. Agentes Especializados

| Agente | Rol | Propósito | Entrada | Salida |
| :-- | :-- | :-- | :-- | :-- |
| **triage_agent** | triage | Prioriza y clasifica el nivel de atención sugerido | Texto clínico anonimizado | Nivel de prioridad + justificación textual |
| **emotion_analysis_agent** | emotion_analysis | Extrae emociones, intensidad y evidencia | Texto clínico anonimizado | `emotions` estructuradas |
| **cognitive_distortion_agent** | cognitive_distortion | Detecta distorsiones cognitivas con evidencia | Texto anonimizado o análisis previo | `distortions` estructuradas |
| **report_agent** | report | Compone el reporte profesional para el terapeuta | Resultado del pipeline | Documento estructurado (Markdown) |

**Restricciones:** Todos los agentes que procesen texto clínico deben tener pii_policy: anonymized_only. Los output_schema prohíben explícitamente campos diagnosis, prescription o juicios clínicos definitivos.

### 4.2. Habilidades Modulares (Skills)

| Skill | Categoría | Propósito | Sandbox | Acceso Red |
| :-- | :-- | :-- | :-- | :-- |
| **code_executor** | code_executor | Ejecución segura de código para transformaciones no clínicas | Obligatorio (aislado, sin red, sin filesystem host) | No |
| **db_query** | db_query | Consultas controladas a BD cifrada con validación de ownership | No | No |
| **document_generator** | document_generator | Generación de reportes PDF/Markdown desde datos estructurados | No | No |
| **web_search** | web_search | Búsqueda de referencias públicas (líneas de crisis) con allowlist de dominios | No | Sí (restringido) |

**Principio fundamental:** Las skills no razonan, solo ejecutan capacidades deterministas auditables. El manejo de PII está reservado exclusivamente a core/security/.

### 4.3. Núcleo del Framework (Core)

| Módulo | Responsabilidad | Características Clave |
| :-- | :-- | :-- |
| **orchestrator** | Planificación, enrutamiento y ejecución | Carga manifiestos, valida esquema, aplica permisos, gestiona timeouts/reintentos |
| **llm_gateway** | Abstracción de proveedores LLM | Timeout, backoff, rate limiting, validación obligatoria contra output_schema |
| **db** | Persistencia | Repositorios async; historial de análisis cifrado y asociado a `analysis_id` |
| **security** | Seguridad transversal | PII pipeline (Regex + NER), cifrado AES-256-GCM, guardrails, control de acceso |
| **observability** | Trazabilidad y monitoreo | Logging JSON, `request_id`/`analysis_id` vía contextvars, sin PII |
| **agent_base/skill_base** | Contratos base | Clases abstractas, registro, validación y hooks comunes |

### 4.4. Interfaces de Usuario

| Interfaz | Tecnología | Estado | Propósito |
| :-- | :-- | :-- | :-- |
| **API REST** | FastAPI (interfaces/api/) | En desarrollo | Punto de entrada principal: autenticación, ingesta, análisis, reportes |
| **Frontend Web** | React (interfaces/frontend/) | En desarrollo | Dashboard clínico con visualización emocional |
| **Chat UI** | (Definido en estructura) | Planificado | Interfaz conversacional alternativa |
| **CLI** | (Definido en estructura) | Planificado | Herramienta de línea de comandos para testing/desarrollo |

## 5. Flujo de Datos y Procesamiento

### 5.1. Flujo End-to-End

1. **Captura**: El terapeuta pega o carga una nota clínica/transcripción en la interfaz React.
2. **Autenticación**: La API valida el JWT antes de procesar la solicitud.
3. **Anonimización Obligatoria**: core/security/pii_pipeline detecta y anonimiza PII (nombres, documentos, teléfonos, correos) mediante Regex + NER. **Paso no omitible**.
4. **Orquestación**: core/orchestrator valida la solicitud contra manifiestos, verifica permisos y enruta al agente apropiado según config/agents.yaml.
5. **Análisis Agentic**: El agente especializado (ej. emotion_analysis_agent) construye la solicitud y delega al LLM Gateway.
6. **Invocación LLM**: LLM Gateway envía al proveedor configurado, aplica timeouts/reintentos y valida la respuesta contra output_schema JSON.
7. **Ejecución de Skills**: Si es necesario, el agente invoca skills autorizadas (document_generator, db_query, etc.) con validación de permisos.
8. **Persistencia Segura**: La nota y los resultados clínicos se cifran con AES-256-GCM antes de persistir en PostgreSQL; solo los metadatos operativos quedan en claro.
9. **Generación de Reporte**: `report_agent` compone el reporte Markdown; se guarda en `REPORTS_DIR` y se expone en `/reports/{analysis_id}`.
10. **Presentación**: El dashboard muestra emociones, distorsiones, hallazgos y preguntas sugeridas. El reporte se descarga en Markdown desde `/reports/{analysis_id}`.
11. **Trazabilidad**: Toda la ejecución queda registrada en observabilidad con request_id, sin contenido clínico.

### 5.2. Puntos de Control Críticos de Seguridad

| Punto de Control | Implementación | Garantía |
| :-- | :-- | :-- |
| **PII Obligatoria** | core/security/pii_pipeline como middleware del Orquestador | Ningún texto clínico llega a agentes sin anonimizar |
| **LLM Gateway Único** | Todo acceso a LLMs pasa por core/llm_gateway | Abstracción, rate limiting, validación centralizada |
| **Validación Estructurada** | Validación contra output_schema en Gateway y Orquestador | Salidas JSON válidas, sin campos clínicos prohibidos |
| **Control de Permisos** | Verificación en Orquestador contra manifiestos | Cada agente/skill solo accede a lo autorizado |
| **Cifrado en Reposo** | core/security/encryption_service AES-256-GCM | Datos clínicos cifrados en PostgreSQL |
| **Aislamiento de Tools** | tools/ sin acceso a datos clínicos | Solo metadata técnica a GitHub/Slack |
| **Sin Diagnóstico/Prescripción** | Validación de esquemas en manifiestos | Rechazo de diagnosis, prescription |
| **Trazabilidad Anónima** | request_id en observabilidad | Logs sin contenido PII/clínico |

## 6. Configuración y Manifiestos

### 6.1. Archivo config/agents.yaml

Define los agentes activos y su configuración completa. Validado contra docs/manifest_schema.md.

**Agentes activos actualmente:**
`triage_agent`, `emotion_analysis_agent`, `cognitive_distortion_agent` y `report_agent`.
`research_agent` y `coding_agent` permanecen como ejemplos base del framework.

**Campos clave por agente:**
- Identificación: `name`, `version`, `role`, `description`, `owner`
- Esquemas: input_schema, output_schema (prohíben diagnóstico/prescripción)
- Permisos: permissions.allowed_skills, permissions.data_scope, permissions.network_access, permissions.pii_access
- Política de modelo: `model_policy.provider`, `structured_output`, `rate_limit_per_minute`
- Políticas: pii_policy, memory_scope
- Ejecución: timeout_seconds, max_retries, max_tokens, temperature

### 6.2. Archivo config/skills.yaml

Define habilidades modulares con sus esquemas y permisos. **Solo 4 categorías válidas:** code_executor, db_query, document_generator, web_search.

**Campos obligatorios:**
`name`, `version`, `description`, `category`, `entrypoint`, `input_schema`, `output_schema`, `permissions`, `sandboxed` (true para code_executor).

**Nota importante:** pii_pipeline y encryption_service NO se declaran como skills - son middleware obligatorio en core/security/.

### 6.3. Variables de Entorno

Configuración por ambiente en config/environments/. Requiere:
- **Proveedor LLM**: Clave API del proveedor configurado
- **Base de datos**: Credenciales PostgreSQL (cifradas/gestión segura)
- **Seguridad**: Claves para cifrado AES-256-GCM, JWT secrets
- **Integraciones**: Tokens para GitHub/Slack (solo para herramientas de desarrollo)
- **Rate limiting**: Configuración por agente

## 7. Testing, Evaluación y Calidad

### 7.1. Estrategia de Testing

| Tipo de Prueba | Herramienta | Ubicación | Objetivo |
| :-- | :-- | :-- | :-- |
| **Unitarias** | pytest, pytest-asyncio | evaluations/ | Validación de componentes aislados (agentes, skills, core) |
| **Integración** | pytest | evaluations/ | Flujo orquestador → agente → skill → LLM Gateway |
| **Seguridad** | Casos específicos | evaluations/ | Validación de anonimización PII, rechazo de diagnóstico/prescripción, permisos |
| **Rendimiento** | Casos de carga | evaluations/ | Latencia del LLM Gateway, timeouts, rate limiting |
| **Regresión** | Suites por agente | evaluations/agent_evaluations/ | Precisión de análisis emocional, consistencia de salidas |

### 7.2. Calidad de Código

| Herramienta | Propósito | Configuración |
| :-- | :-- | :-- |
| **ruff** | Linting y formateo | Configuración en proyecto |
| **mypy** | Type checking estricto | Tipado estático obligatorio |
| **pytest** | Testing framework | Cobertura en evaluaciones |

### 7.3. Métricas de Evaluación

- **Precisión de Análisis**: Detección correcta de emociones y distorsiones cognitivas
- **Cumplimiento de Esquemas**: 100% de respuestas validadas contra output_schema
- **Anonimización**: Detección exitosa de PII en casos de prueba
- **Seguridad**: Rechazo de solicitudes con campos clínicos prohibidos
- **Performance**: Tiempo de respuesta dentro de timeout_seconds configurado
- **Trazabilidad**: Todos los eventos con request_id sin PII

## 8. Despliegue e Infraestructura

### 8.1. Entornos

| Entorno | Propósito | Configuración |
| :-- | :-- | :-- |
| **Desarrollo** | Desarrollo local | config/environments/dev/ |
| **Testing** | Pruebas automatizadas | config/environments/test/ |
| **Producción** | Despliegue final | config/environments/prod/ |

### 8.2. Opciones de Despliegue

| Plataforma | Estado | Notas |
| :-- | :-- | :-- |
| **Local (Docker Compose)** | Recomendado para desarrollo | Orquestación completa de servicios |
| **Render** | Planificado | Backend API + PostgreSQL |
| **Vercel** | Planificado | Frontend React |
| **Cloud Genérico** | Compatible | Arquitectura containerizada portable |

### 8.3. Requisitos de Infraestructura

- **Compute**: Suficiente para ejecución asíncrona de FastAPI + workers
- **Base de Datos**: PostgreSQL 15+ con soporte para cifrado
- **Red**: Acceso a proveedores LLM configurados
- **Almacenamiento**: Para logs estructurados (sin contenido clínico)
- **Seguridad**: Gestión segura de secretos (no hardcodeados)

## 9. Equipo y Responsabilidades

| Rol | Integrante | Responsabilidades |
| :-- | :-- | :-- |
| **Product Owner / Lead AI Architect** | Edwar Esteban Ibagué | Arquitectura, visión del proyecto, integración IA, documentación |
| **Backend Developer** | Daniel Felipe Andrade | API FastAPI, orquestador, core framework, base de datos |
| **NLP Engineer & Frontend Developer** | Nicol Sneider Murillo | Procesamiento NLP, agentes de análisis emocional, interfaz React |

## 10. Roadmap y Estado Actual

### 10.1. Estado Actual
- **Estructura Base**: framework `mi-framework-ia` con arquitectura agentic.
- **Documentación**: README, `architecture.md` y `manifest_schema.md` actualizados.
- **Manifiestos**: `agents.yaml` y `skills.yaml` validados en tiempo de carga por `core/manifest_validator.py`.
- **Seguridad**: pipeline PII (regex + spaCy), cifrado AES-256-GCM, guardrails, JWT y ownership implementados.
- **Core**: orquestador propio (`planner`/`router`/`executor`), LLM Gateway multi-proveedor y cuatro agentes MindFlow funcionales.
- **Interfaces**: API REST completa (auth, sesiones, análisis, reportes) y SPA React con login, dashboard y descarga de reportes.
- **Calidad**: 20 pruebas aprobadas, `ruff` sin errores y `npm run build` correcto.

### 10.2. Próximos Pasos
- Elevar la cobertura de pruebas al 80% y añadir tests de frontend.
- Configurar `mypy` en modo estricto.
- Evaluar un portal web público y una app móvil (ver `web.md` y `mobile.md`; no implementados).
- Añadir refresh de token y cierre de sesión por expiración.
- Preparar despliegue en un ambiente de demostración (Render/Vercel u otro).

## 11. Consideraciones Éticas y Legales

### 11.1. Principios Éticos
- **Apoyo, no sustitución**: Herramienta exclusivamente analítica, requiere validación profesional
- **Privacidad por defecto**: Anonimización obligatoria, mínimo almacenamiento de datos identificables
- **Transparencia**: Salidas estructuradas, trazables y explicables
- **No diagnóstico**: Prohibido explícitamente emitir diagnósticos o prescripciones
- **Responsabilidad profesional**: El terapeuta mantiene total responsabilidad sobre decisiones clínicas

### 11.2. Cumplimiento Normativo
- **PII Protection**: Diseño alineado con principios HIPAA y LGPD
- **Consentimiento**: Requiere consentimiento explícito para cualquier procesamiento
- **Minimización de datos**: Solo se procesan datos necesarios, anonimizados
- **Trazabilidad**: Auditoría completa sin almacenamiento de contenido clínico
- **Seguridad**: Cifrado en tránsito y reposo, control de acceso estricto

### 11.3. Disclaimer Oficial

> **MindFlow AI es una herramienta de apoyo analítico para profesionales de la salud mental.**
> - No emite diagnósticos clínicos ni sustituye la evaluación profesional.
> - No almacena datos de identificación personal (PII) sin el consentimiento explícito del paciente y el cumplimiento de normativas de privacidad.
> - Los resultados (emociones, distorsiones cognitivas, preguntas sugeridas) deben ser validados y reinterpretados por el terapeuta antes de ser incorporados a la historia clínica.
> - El uso indebido de la herramienta para tomar decisiones médicas por cuenta propia está estrictamente prohibido.

## 12. Referencias y Documentación Relacionada

| Documento | Ubicación | Descripción |
| :-- | :-- | :-- |
| **README Principal** | MindAI/README.md | Visión general, alcance MVP, equipo |
| **Arquitectura Detallada** | MindAI/mi-framework-ia/docs/architecture.md | Arquitectura completa, diagramas, flujos |
| **Esquema de Manifiestos** | MindAI/mi-framework-ia/docs/manifest_schema.md | Especificación formal de agents.yaml y skills.yaml |
| **Documentación Backend** | backend.md | Detalles técnicos del backend FastAPI |
| **Documentación Frontend** | frontend.md | Detalles técnicos del frontend React |
| **Documentación Móvil** | mobile.md | Consideraciones para plataforma móvil |
| **Documentación Web** | web.md | Consideraciones para plataforma web |
| **Proyecto PDF** | MindAI/mi-framework-ia/Proyecto_MindFlow_AI.pdf | Documento oficial del proyecto |

---

**Documento generado:** 25 de Octubre de 2026  
**Elaborado por:** Sistema de documentación automática  
**Versión del documento:** 1.0.0  
**Estado:** Vigente
