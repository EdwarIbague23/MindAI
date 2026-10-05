# Arquitectura del Sistema — MindFlow AI

**Framework:** `mi-framework-ia`
**Versión del documento:** 2.0.0
**Estado:** Vigente — reemplaza la versión 1.0.0 (alineada a la estructura `backend/app` + `frontend/src`)
**Audiencia:** Equipo de ingeniería (Electiva CPC Integración IA, UNIMINUTO Ibagué), auditores de seguridad

> **Nota de versión:** Esta versión documenta la migración oficial del proyecto hacia la estructura de repositorio `mi-framework-ia` (framework de agentes) definida por el docente de la Electiva. La versión 1.0.0 documentaba la arquitectura monolítica original (`backend/app` + `frontend/src`) construida en los prompts #01–#25. El mapeo detallado entre ambas estructuras está en el **Anexo de Migración** del documento maestro de prompts (`MindFlow_AI_Bateria_de_Prompts_EN.docx`).

---

## 1. Propósito y Alcance

MindFlow AI es un **copiloto de triaje y análisis emocional para terapeutas de salud mental**. El sistema no diagnostica ni prescribe: procesa notas clínicas anonimizadas, identifica señales emocionales y distorsiones cognitivas mediante un LLM, y devuelve resultados estructurados (dashboard + reporte) que el profesional tratante revisa antes de tomar cualquier decisión clínica.

**Alcance funcional objetivo de V1:**

| INCLUIDO EN V1 | POSTERIOR A V1 |
|---|---|
| Cuentas de paciente/profesional, consentimiento, profesionales verificados, directorio y agenda básica (RF-01 a RF-10) | Videollamada (RF-11), pagos (RF-14), cuestionarios de seguimiento (RF-15), calificación (RF-16) e integración EHR |
| Notas clínicas cifradas, autorización por terapeuta tratante e historial de citas | Diagnóstico, prescripción o recomendación automatizada de especialistas (RF-17) |
| Copiloto profesional: señales emocionales/cognitivas, evidencia textual y preguntas guía para revisión | Chat de terapia paciente-IA o decisiones clínicas autónomas |

**Canales del producto:** el cliente web se implementa con React + TypeScript y el cliente móvil con React Native para Android/iOS. Ambos consumen la misma API REST; el framework, los agentes y la base de datos no se duplican por canal. La matriz por rol/plataforma está en `03_historias_de_usuario.md`. La IA apoya al profesional autorizado: no recomienda especialistas ni toma decisiones clínicas autónomas.

Este documento describe la arquitectura basada en agentes de `mi-framework-ia`: sus capas, la infraestructura compartida y el flujo de datos extremo a extremo, con énfasis en el aislamiento de PII y el cumplimiento normativo de datos de salud.

---

## 2. Estructura del Repositorio

```text
mi-framework-ia/
├── agents/              # Definición de agentes especializados y lógica de ejecución
├── config/              # Configuraciones del framework
│   ├── environments/    # Variables de entorno y ajustes por ambiente (dev/test/prod)
│   ├── agents.yaml      # Manifiesto de configuración de agentes
│   └── skills.yaml      # Manifiesto de configuración de habilidades
├── core/                # Núcleo del framework: orquestador, memoria, LLM Gateway, seguridad
├── docs/                # architecture.md, manifest_schema.md
├── evaluations/         # Pruebas de rendimiento, precisión y casos de validación
├── interfaces/          # API común y clientes de presentación
├── skills/              # Habilidades modulares atómicas
│   ├── code_executor/   # Ejecución segura de código (sandbox)
│   ├── db_query/        # Consultas estructuradas a la base de datos
│   ├── document_generator/ # Generación de reportes clínicos
│   └── web_search/      # Búsqueda y recuperación de información externa
├── tools/               # Utilidades externas e integraciones (automatización, no clínicas)
│   ├── github_client.py # Cliente para automatización y control de versiones
│   └── slack_client.py  # Cliente de notificaciones y alertas
├── .gitignore
├── Proyecto_MindFlow_AI.pdf
└── README.md
```

---

## 3. Principios de Diseño

| Principio | Aplicación en MindFlow AI |
|---|---|
| **Aislamiento de PII por defecto** | La anonimización vive en `core/` como middleware **no omitible**, no como una `skill` que un agente pudiera decidir saltarse. Ningún agente recibe texto clínico sin anonimizar. |
| **Caché con TTL optimizado** | Redis v7 para sesiones activas, TTL automático y cache de disponibilidad; O(1) access para respuestas del copiloto y reducción de latencia en contexto de conversación. | |
| **Soporte, no sustitución clínica** | Los manifests objetivo prohíben diagnóstico/prescripción; el loader y enforcement runtime siguen pendientes. |
| **Aislamiento de datos (tenant isolation)** | PostgreSQL garantiza aislamiento por medio de schemas y roles; cada tenant (profesional/paciente) tiene acceso controlado a sus propios datos a través de políticas de RLS (Row Level Security). | |
| **Proveedor de LLM reemplazable** | Toda invocación a un modelo pasa por el LLM Gateway en `core/`; ningún agente ni skill llama directamente a un proveedor externo. |
| **Trazabilidad total** | Toda ejecución queda registrada en el bus de observabilidad de `core/` con `request_id`, sin persistir contenido clínico. |
| **Mínimo privilegio** | Cada agente/skill tendrá permisos en su manifest individual; el loader y enforcement del orquestador deben implementarse y probarse antes de considerar esos límites efectivos. |
| **Separación framework / integraciones** | `tools/` (GitHub, Slack) es infraestructura de automatización del equipo de desarrollo — **nunca** tiene acceso a datos clínicos ni a PII. |

---

## 4. Capas del Sistema

### 4.1 Capa de Interfaces (`interfaces/`)

Punto de entrada humano y de sistemas externos hacia el framework. Los clientes no contienen lógica clínica ni acceden directamente a PostgreSQL, Redis o al proveedor LLM.

- **Cliente web (React + TypeScript):** interfaz responsiva para los flujos del MVP; captura notas, presenta el análisis y permite revisar/exportar reportes.
- **Cliente móvil (React Native):** aplicación para Android/iOS que consume la misma API y los mismos contratos que la web. Las capacidades propias del dispositivo (por ejemplo, micrófono o notificaciones push) requieren permisos explícitos y endpoints del backend; no se conectan directamente al LLM Gateway.
- **API REST (FastAPI):** contrato común para autenticación, ingestión, análisis y reportes. Valida identidad, rol, propiedad y forma (Pydantic) antes de delegar al Orquestador en `core/`.
- **Interfaz administrativa:** gestión de manifiestos de `config/`, revisión de auditoría y verificación de profesionales; se restringe por rol y no es un tercer cliente móvil requerido para el MVP.

**Responsabilidad de ambos clientes:** captura, validación de forma y presentación. No deciden qué agente ejecutar ni interpretan resultados clínicos. Ninguna nota clínica se guarda en almacenamiento local no protegido; el MVP no promete operación offline con contenido clínico.

### 4.2 Núcleo del Framework (`core/`)

Es el corazón de control de `mi-framework-ia`. Agrupa cuatro responsabilidades explícitamente asignadas por el docente a esta carpeta: **orquestador, gestión de memoria, LLM Gateway**, y —por decisión de diseño de este equipo— **seguridad transversal**.

1. **Orquestador**
   - **Objetivo de arquitectura, aún no implementado:** cargar `config/agents.yaml`/`config/skills.yaml`, resolver manifests individuales y validarlos según `docs/manifest_schema.md`. El código actual tiene registros por decorador, no loader ni enforcement runtime.
   - En la implementación futura enrutará cada solicitud al agente de rol aprobado y aplicará allowlists, límites y errores tipados.
   - No afirmar permisos efectivos hasta que existan loader, enforcement y pruebas negativas.
2. **Gestión de memoria**
   - Memoria de sesión (corto plazo, TTL corto, sin PII persistida).
   - Memoria de análisis (largo plazo, PostgreSQL v16 cifrado, indexada por `analysis_id`/`note_id`), con `ownership` validado antes de cualquier lectura. ORM: SQLAlchemy 2.x. Migraciones: Alembic. Cumplimiento: transacciones ACID, integridad referencial, restricciones de exclusión para agenda y auditoría append-only.
3. **LLM Gateway**
   - Abstracción única (`analyze(text) -> AnalysisResponse`) independiente del proveedor, configurado por variable de entorno en `config/environments/`.
   - Aplica timeout, reintentos con backoff, rate limiting por agente y validación obligatoria de salida contra `output_schema`.
   - Rechaza cualquier payload que no incluya la marca `anonymized: true`.
4. **Seguridad transversal** *(decisión de diseño documentada — no explícita en el README original del docente, pero necesaria para la naturaleza clínica del proyecto)*
   - `core/security/pii_pipeline`: detección y anonimización de PII (Regex + NER), ejecutada como middleware obligatorio antes de enrutar cualquier texto a un agente.
   - `core/security/encryption_service`: cifrado AES-256-GCM en reposo para notas e historias clínicas.
   - Se modelan aquí —y no como `skill`— precisamente porque no deben ser opcionales ni saltables por un agente.

### 4.3 Capa de Agentes (`agents/`)

Cada agente es una unidad de razonamiento especializada con manifiesto en `agents/<agent_name>/manifest.yaml`; `config/agents.yaml` solo enumera activaciones. El registro actual usa decoradores y los agentes son stubs, por lo que la tabla distingue ejemplos existentes de capacidades planeadas.

| Agente | Rol | Entrada | Salida |
|---|---|---|---|
| `coding_agent` (framework) | Código de tareas no clínicas, con sandbox cuando se implemente. | Tarea sin PII | Resumen técnico |
| `research_agent` (framework) | Investiga información pública no clínica. | Consulta sin PII | Resumen y fuentes |
| `emotion_analysis_agent` (V1 planeado; manifest/prompt spec-only) | Extrae señales, evidencia literal y preguntas para revisión del terapeuta. | Nota anonimizada, `anonymized=true` | DTO estructurado, `needs_review=true`; no diagnóstico ni recomendación |

**Restricción de dominio:** el contrato de manifests prohíbe campos `diagnosis`, `prescription` y recomendaciones de especialista; esta regla aún requiere loader y pruebas para hacerse cumplir en runtime.

### 4.4 Capa de Skills (`skills/`)

Las skills son funciones deterministas y auditables que un agente autorizado puede invocar. No razonan: ejecutan una capacidad concreta y devuelven un resultado validado contra `output_schema`.

- **`code_executor/`**: ejecución de código en sandbox aislado (sin red, sin acceso al filesystem del host); usado solo para transformaciones de datos no clínicos.
- **`db_query/`**: acceso de solo lectura/escritura controlada a la base de datos cifrada, siempre con `ownership` validado.
- **`document_generator/`**: composición de reportes PDF/Markdown a partir de datos ya estructurados y validados; nunca recibe texto clínico crudo.
- **`web_search/`**: búsqueda de referencias públicas (p. ej. líneas de atención en crisis); prohibida de recibir o transmitir PII.

### 4.5 Herramientas de Integración (`tools/`)

Utilidades externas de automatización del **equipo de desarrollo**, no del pipeline clínico:

- **`github_client.py`**: automatización de control de versiones. No existe todavía un `audit_agent` ejecutable ni se envían hallazgos clínicos a GitHub.
- **`slack_client.py`**: notificaciones y alertas operativas (caídas del LLM Gateway, fallos de CI, hallazgos de auditoría).

**Restricción explícita:** ningún cliente de `tools/` puede recibir texto clínico, PII, ni resultados de `AnalysisResponse` con contenido identificable — únicamente metadata técnica (severidad, `request_id`, nombre de componente).

### 4.6 Configuración (`config/`)

- **`agents.yaml`** y **`skills.yaml`**: manifiestos formales (ver `manifest_schema.md`).
- **`environments/`**: variables y ajustes específicos por ambiente (`dev`, `test`, `prod`), incluyendo el proveedor de LLM activo, límites de rate limiting y flags de features — nunca secretos en texto plano dentro del repositorio.

### 4.7 Evaluaciones (`evaluations/`)

Casos de prueba de precisión y regresión para cada agente (referenciados desde `config/agents.yaml` vía `evaluation_suite`), y pruebas de rendimiento del LLM Gateway y de los pipelines de seguridad (PII, cifrado).

---

## 5. Diagrama de Flujo de Datos

```mermaid
flowchart TD
   A[Paciente / Terapeuta / Admin] --> W[Cliente web<br/>React + TypeScript]
   A --> M[Cliente móvil<br/>React Native]
   W -->|HTTPS REST / OpenAPI común| API[interfaces/api<br/>FastAPI]
   M -->|HTTPS REST / OpenAPI común| API
   API --> S[Servicios de aplicación<br/>auth, consentimiento, agenda, clínica]
   S -->|CRUD autorizado| DB[(PostgreSQL v16 + SQLAlchemy 2.x + Alembic)<br/>datos cifrados y relaciones)]
   S -->|Solo análisis solicitado y autorizado| C{Orquestador<br/>core/ planeado}
   C -->|Anonimización obligatoria| D[[core/security<br/>PII pipeline planeado]]
   D -->|Texto anonimizado| E[emotion_analysis_agent<br/>planeado; no activo]
   E -->|Solicitud estructurada| F[[LLM Gateway<br/>core/]]
   F -->|Proveedor configurado| G[(Proveedor LLM)]
   G -->|Respuesta| F
   F -->|Validación de schema| E
   E -->|Resultado con needs_review| C
   C -->|DTO validado| S
   S -->|Guardar análisis autorizado| DB
   S -->|Resultado estructurado| H[document_generator<br/>skill planeada]
   H -->|Reporte| S
   S -->|Response API| API
   API --> W
   API --> M
   S -->|Recordatorios / alertas sin contenido clínico| N[Email / push provider]
   C -.->|request_id y metadata sin PII| L[[core/observability]]
   L -.->|Alertas operativas sin datos clínicos| O[Slack / GitHub]
```

**Puntos de control críticos:**

1. Ninguna nota clínica llega a un agente sin pasar por `core/security/pii_pipeline`.
2. Ninguna llamada al proveedor LLM ocurre fuera del LLM Gateway (`core/`).
3. Ninguna respuesta del LLM se persiste o se muestra sin validación contra `output_schema`.
4. `tools/` (GitHub, Slack) solo recibe metadata técnica, nunca datos clínicos.
5. Todo evento se traza con `request_id`, sin registrar contenido clínico.

---

## 6. Referencias Cruzadas

- Especificación de manifiestos: [`manifest_schema.md`](./manifest_schema.md)
- Definiciones activas: `config/agents.yaml`, `config/skills.yaml`, `config/environments/`
- Suite de evaluación: `evaluations/`
- Mapeo detallado de la arquitectura original (`backend/app` + `frontend/src`) hacia `mi-framework-ia`: Anexo de Migración en `MindFlow_AI_Bateria_de_Prompts_EN.docx`