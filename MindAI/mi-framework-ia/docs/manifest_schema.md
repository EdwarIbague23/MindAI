# Especificación de Manifiestos — MindFlow AI (`mi-framework-ia`)

**Versión de la especificación:** 2.0.0
**Archivos cubiertos:** `config/agents.yaml`, `config/skills.yaml`
**Estado:** Vigente — validación obligatoria en tiempo de carga del Orquestador (`core/`)

> **Nota de versión:** Se ajustan las categorías válidas de `skills.yaml` a las cuatro carpetas reales de `skills/` (`code_executor`, `db_query`, `document_generator`, `web_search`). Los servicios de PII y cifrado **no** se modelan como skills en esta versión: viven en `core/security/` como middleware obligatorio del Orquestador (ver `architecture.md`, sección 4.2).

---

## 1. Propósito

Este documento define el esquema formal que debe cumplir todo manifiesto de **agente** o **skill** dentro de `mi-framework-ia`. El Orquestador rechaza en tiempo de arranque cualquier manifiesto que no valide contra este esquema, y rechaza en tiempo de ejecución cualquier acción que exceda lo declarado en `permissions`.

---

## 2. Esquema de `config/agents.yaml`

### 2.1 Estructura general

`agents.yaml` contiene una lista bajo la clave raíz `agents`, donde cada elemento define un agente que vive en `agents/`.

### 2.2 Campos obligatorios

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Identificador único en `snake_case` (p. ej. `emotion_analysis_agent`), debe coincidir con el nombre de su carpeta en `agents/`. |
| `version` | `string (semver)` | `MAJOR.MINOR.PATCH`. Cambios en `output_schema` exigen incremento de `MAJOR`. |
| `description` | `string` | Descripción funcional en una o dos frases, sin PII de ejemplo. |
| `role` | `enum` | `triage` \| `emotion_analysis` \| `report_generation` \| `system_audit`. |
| `input_schema` | `JSON Schema` | Esquema del payload de entrada. Debe exigir `anonymized: true` cuando el agente procese texto clínico. |
| `output_schema` | `JSON Schema` | Esquema de salida. **Prohibido** declarar `diagnosis`, `prescription` o campos que impliquen juicio clínico definitivo. |
| `permissions` | `object` | Ver [2.4](#24-objeto-permissions-agentes). |
| `model_policy` | `object` | Ver [2.5](#25-objeto-model_policy). |
| `pii_policy` | `enum` | `anonymized_only` (obligatorio si procesa texto clínico) \| `no_clinical_data` (agentes de sistema, p. ej. `audit_agent`). |
| `owner` | `string` | Equipo/persona responsable, para trazabilidad de cambios. |

### 2.3 Campos opcionales

| Campo | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `temperature` | `float` | `0.2` | Temperatura de muestreo del LLM. |
| `max_tokens` | `integer` | `2048` | Límite de tokens de salida por invocación. |
| `timeout_seconds` | `integer` | `30` | Tiempo máximo de ejecución antes de que el Orquestador aborte. |
| `max_retries` | `integer` | `2` | Reintentos ante `ProviderUnavailableError`. |
| `fallback_agent` | `string` | `null` | Agente alterno si este falla de forma irrecuperable. |
| `memory_scope` | `enum` | `session` | `session` \| `analysis_history` (requiere `ownership` validado en `core/`). |
| `notify_on_failure` | `object` | `null` | Config de alertas vía `tools/slack_client.py` (solo metadata técnica, nunca contenido clínico). |
| `tags` | `array<string>` | `[]` | Etiquetas para clasificación en `evaluations/`. |
| `evaluation_suite` | `string` | `null` | Ruta al conjunto de casos de prueba en `evaluations/`. |

### 2.4 Objeto `permissions` (Agentes)

| Subcampo | Tipo | Descripción |
|---|---|---|
| `allowed_skills` | `array<string>` | Lista cerrada de `name` de skills (`skills/`) que este agente puede invocar. Fuera de esta lista → `PermissionDeniedError`. |
| `data_scope` | `enum` | `own_session` \| `own_therapist_patients` \| `none`. Alcance de datos vía `skills/db_query`. |
| `network_access` | `enum` | `none` \| `restricted` (allowlist) \| `full` (prohibido si el agente procesa texto clínico). |
| `pii_access` | `enum` | `forbidden` \| `anonymized_only`. Un agente con `forbidden` no puede recibir campos marcados como sensibles en `input_schema`. |

### 2.5 Objeto `model_policy`

| Subcampo | Tipo | Descripción |
|---|---|---|
| `provider` | `string` | Identificador lógico resuelto desde `config/environments/` (p. ej. `env:LLM_PROVIDER`). Nunca un valor hardcodeado. |
| `structured_output` | `boolean` | Si `true`, el LLM Gateway (`core/`) exige y valida salida JSON contra `output_schema`. |
| `rate_limit_per_minute` | `integer` | Límite de invocaciones al Gateway por minuto. |

### 2.6 Ejemplo completo

```yaml
# config/agents.yaml
agents:
  - name: emotion_analysis_agent
    version: "1.2.0"
    description: >
      Analiza texto clínico anonimizado para identificar emociones, intensidad,
      evidencia textual y distorsiones cognitivas, sin emitir diagnóstico.
    role: emotion_analysis
    owner: team-clinical-ai

    input_schema:
      type: object
      required: [text, anonymized]
      properties:
        text: { type: string, maxLength: 8000 }
        anonymized: { type: boolean, const: true }

    output_schema:
      type: object
      required: [emotions, distortions, guiding_questions]
      properties:
        emotions:
          type: array
          items:
            type: object
            required: [name, score, evidence]
            properties:
              name: { type: string }
              score: { type: integer, minimum: 0, maximum: 100 }
              evidence: { type: string }
        distortions:
          type: array
          items:
            type: object
            properties: { type: { type: string } }
        guiding_questions:
          type: array
          items: { type: string }

    permissions:
      allowed_skills: [document_generator, db_query]
      data_scope: own_session
      network_access: none
      pii_access: anonymized_only

    model_policy:
      provider: "env:LLM_PROVIDER"
      structured_output: true
      rate_limit_per_minute: 30

    pii_policy: anonymized_only
    memory_scope: analysis_history

    temperature: 0.2
    max_tokens: 2048
    timeout_seconds: 20
    max_retries: 2
    fallback_agent: null
    notify_on_failure:
      channel: "#mindflow-alerts"
      severity_threshold: HIGH
    tags: [clinical, nlp, emotion]
    evaluation_suite: evaluations/emotion_analysis_agent/
```

---

## 3. Esquema de `config/skills.yaml`

### 3.1 Estructura general

`skills.yaml` contiene una lista bajo la clave raíz `skills`. Cada skill corresponde a una subcarpeta física dentro de `skills/`.

### 3.2 Campos obligatorios

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Identificador único en `snake_case`. |
| `version` | `string (semver)` | Versión de la skill. |
| `description` | `string` | Descripción funcional concreta. |
| `category` | `enum` | **`code_executor` \| `db_query` \| `document_generator` \| `web_search`** — debe coincidir exactamente con una subcarpeta existente en `skills/`. |
| `entrypoint` | `string` | Ruta de importación de la función/clase ejecutable (p. ej. `skills.document_generator:generate`). |
| `input_schema` | `JSON Schema` | Esquema formal de entrada. |
| `output_schema` | `JSON Schema` | Esquema formal de salida. |
| `permissions` | `object` | Ver [3.4](#34-objeto-permissions-skills). |
| `sandboxed` | `boolean` | Obligatorio `true` para `category: code_executor`. |

> **Nota:** `pii_pipeline` y `encryption_service` **no se declaran en `skills.yaml`**. Son middleware fijo de `core/security/`, invocado automáticamente por el Orquestador y no removible ni sustituible desde un manifiesto de agente.

### 3.3 Campos opcionales

| Campo | Tipo | Valor por defecto | Descripción |
|---|---|---|---|
| `timeout_seconds` | `integer` | `10` | Tiempo máximo de ejecución. |
| `rate_limit_per_minute` | `integer` | `60` | Límite de invocaciones por minuto por agente invocador. |
| `retryable` | `boolean` | `true` | Si el Orquestador puede reintentar ante fallo transitorio. |
| `audit_level` | `enum` | `standard` | `standard` \| `elevated` (para skills con acceso a datos, p. ej. `db_query`). |

### 3.4 Objeto `permissions` (Skills)

| Subcampo | Tipo | Descripción |
|---|---|---|
| `requires_network` | `boolean` | `true` únicamente para `web_search`. Debe ser `false` para cualquier skill que procese texto clínico. |
| `pii_access` | `enum` | `forbidden` (valor obligatorio para las 4 categorías de skill; el manejo de PII está reservado a `core/security/`). |
| `data_scope` | `enum` | `none` \| `own_session` \| `own_therapist_patients`. Aplica a `db_query`. |
| `allowed_domains` | `array<string>` | Lista blanca de dominios externos. Obligatorio y no vacío si `requires_network: true`. |

### 3.5 Ejemplo completo

```yaml
# config/skills.yaml
skills:
  - name: document_generator
    version: "1.0.0"
    description: >
      Genera reportes clínicos en PDF/Markdown a partir de datos ya
      estructurados y validados; nunca recibe texto clínico sin procesar.
    category: document_generator
    entrypoint: "skills.document_generator:generate"
    sandboxed: false

    input_schema:
      type: object
      required: [analysis_id, emotions, distortions, guiding_questions]
      properties:
        analysis_id: { type: string, format: uuid }
        emotions: { type: array }
        distortions: { type: array }
        guiding_questions: { type: array }

    output_schema:
      type: object
      required: [file_path, format]
      properties:
        file_path: { type: string }
        format: { type: string, enum: [pdf, markdown] }

    permissions:
      requires_network: false
      pii_access: forbidden
      data_scope: own_session
      allowed_domains: []

    timeout_seconds: 15
    rate_limit_per_minute: 30
    retryable: true
    audit_level: standard

  - name: web_search
    version: "1.0.0"
    description: >
      Búsqueda de referencias públicas no clínicas (p. ej. líneas de atención
      en crisis). Prohibido transmitir PII o texto clínico en las consultas.
    category: web_search
    entrypoint: "skills.web_search:search"
    sandboxed: false

    input_schema:
      type: object
      required: [query]
      properties:
        query: { type: string, maxLength: 200 }

    output_schema:
      type: object
      required: [results]
      properties:
        results:
          type: array
          items:
            type: object
            properties:
              title: { type: string }
              url: { type: string }

    permissions:
      requires_network: true
      pii_access: forbidden
      data_scope: none
      allowed_domains:
        - "minsalud.gov.co"
        - "lineasdeatencion.gov.co"

    timeout_seconds: 8
    rate_limit_per_minute: 20
    retryable: true
    audit_level: standard

  - name: db_query
    version: "1.0.0"
    description: >
      Consultas estructuradas de solo lectura/escritura controlada sobre
      la base de datos cifrada, con validación de ownership obligatoria.
    category: db_query
    entrypoint: "skills.db_query:execute"
    sandboxed: false

    input_schema:
      type: object
      required: [query_type, session_id]
      properties:
        query_type: { type: string, enum: [read_analysis, write_analysis, list_reports] }
        session_id: { type: string, format: uuid }

    output_schema:
      type: object
      required: [rows]
      properties:
        rows: { type: array }

    permissions:
      requires_network: false
      pii_access: forbidden
      data_scope: own_session
      allowed_domains: []

    timeout_seconds: 5
    rate_limit_per_minute: 120
    retryable: true
    audit_level: elevated
```

---

## 4. Reglas de Validación del Orquestador

1. **Unicidad:** no puede existir más de un agente o skill con el mismo `name`.
2. **Semver estricto:** `version` debe cumplir `MAJOR.MINOR.PATCH`.
3. **Coherencia PII:** si `input_schema` de un agente incluye texto libre proveniente de una nota clínica, `pii_policy` no puede ser distinto de `anonymized_only`.
4. **Coherencia de permisos:** toda skill listada en `permissions.allowed_skills` de un agente debe existir en `config/skills.yaml`; referencias inexistentes bloquean el arranque.
5. **Prohibición de campos diagnósticos:** `output_schema` de cualquier agente no puede contener `diagnosis`, `prescription`, `treatment_plan` ni sinónimos equivalentes.
6. **Sandbox obligatorio:** toda skill con `category: code_executor` debe declarar `sandboxed: true`.
7. **Dominios explícitos:** toda skill con `requires_network: true` debe declarar `allowed_domains` no vacío.
8. **Categoría válida:** `category` debe ser exactamente una de `code_executor | db_query | document_generator | web_search`; cualquier otro valor (incluyendo variantes como `tool` o `pii`) es rechazado, ya que esas responsabilidades pertenecen a `core/security/`, no a `skills/`.
9. **`pii_access` de skills:** las 4 categorías de skill deben declarar `permissions.pii_access: forbidden`; ninguna skill puede solicitar acceso a PII.

---

## 5. Referencias Cruzadas

- Descripción de capas y flujo de datos: [`architecture.md`](./architecture.md)
- Definiciones activas: `config/agents.yaml`, `config/skills.yaml`, `config/environments/`
- Middleware de seguridad (fuera del sistema de manifiestos): `core/security/pii_pipeline`, `core/security/encryption_service`
- Validador de esquema (implementación): `core/manifest_validator.py` *(a implementar según esta especificación)*