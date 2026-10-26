# Contrato de manifests — MindFlow AI

**Versión:** 3.0.0
**Alcance:** activación de agentes/skills y manifests individuales
**Estado:** contrato objetivo; el repositorio aún no implementa un loader/validador de manifests en runtime.

## 1. Fuente y ubicación

`config/agents.yaml` y `config/skills.yaml` contienen listas de activación, no las definiciones completas. Cada componente mantiene su manifest junto al código:

```text
config/agents.yaml             # active_agents: [nombre, ...]
config/skills.yaml             # active_skills: [nombre, ...]
agents/<nombre>/manifest.yaml
skills/<nombre>/manifest.yaml
```

La estructura de activación coincide con los archivos actuales. El código actual solo registra clases mediante decoradores; antes de afirmar que permisos/schema se hacen cumplir, se debe implementar y probar el loader descrito abajo.

## 2. Configuración de activación

Formato esperado:

```yaml
# config/agents.yaml
active_agents:
  - research_agent
  - coding_agent

# config/skills.yaml
active_skills:
  - web_search
  - code_executor
  - db_query
  - document_generator
```

Cada nombre debe ser único, corresponder a una carpeta y tener un manifest válido. Un componente clínico no se activa hasta tener implementación, schema, pruebas y revisión; el manifest spec-only de `emotion_analysis_agent` no lo activa por sí mismo.

## 3. Agent manifest

Ruta: `agents/<name>/manifest.yaml`.

Campos obligatorios:

| Campo | Tipo/regla |
|---|---|
| `name`, `version`, `description`, `owner` | Identificador snake_case igual a carpeta; SemVer; descripción sin datos reales; responsable. |
| `role` | `coding`, `research`, `triage`, `emotion_analysis`, `report_generation` o `system_audit`. |
| `input_schema`, `output_schema` | JSON Schema estricto; `additionalProperties: false` para DTOs de dominio. Texto clínico requiere `anonymized: true`. |
| `permissions` | Objeto descrito abajo. |
| `pii_policy` | `anonymized_only` para agente clínico o `no_clinical_data` para los demás. |
| `model_policy` | Obligatorio para agente que invoque LLM; en otros roles se omite. |

`permissions` incluye `allowed_skills` (allowlist), `data_scope` (`none`, `own_session`, `own_therapist_patients`), `network_access` (`none`, `restricted`, `full`) y `pii_access` (`forbidden`, `anonymized_only`). Un agente que procese texto clínico nunca usa `full` ni recibe PII.

`model_policy` incluye proveedor por referencia a ambiente (`env:LLM_PROVIDER`, no secreto literal), `structured_output: true` y límite de llamadas. `temperature`, `max_tokens`, timeout, reintentos, evaluación y memoria son opcionales con límites. No incluir prompts con casos clínicos reales.

El schema de salida clínico no admite `diagnosis`, `prescription`, `specialist_recommendation` ni juicio clínico definitivo. Para MindFlow V1 usar `needs_review: true`, scores 0–100, evidencia literal y listas vacías cuando no haya señal suficiente.

## 4. Skill manifest

Ruta: `skills/<name>/manifest.yaml`.

Campos obligatorios: `name`, `version`, `description`, `category`, `entrypoint`, `input_schema`, `output_schema`, `permissions`, `sandboxed`. La categoría debe coincidir con `code_executor`, `db_query`, `document_generator` o `web_search`. `permissions` declara `requires_network`, `pii_access`, `data_scope` y dominios permitidos. PII queda prohibida en skills; consultas clínicas se resuelven en capa de dominio con autorización, no por SQL arbitrario de un agente. `code_executor` requiere sandbox real sin red ni filesystem del host.

PII, anonimización y cifrado no son skills: son controles transversales obligatorios de `core/security/` antes/después del orquestador según el flujo.

## 5. Validaciones requeridas al implementar el loader

1. Parsear YAML seguro; rechazar claves desconocidas, duplicados y tipos incorrectos.
2. Resolver activaciones a carpeta, manifest, entrypoint/clase registrada y versión.
3. Validar schemas de entrada/salida y permisos antes de registrar el componente.
4. Bloquear agente clínico si `pii_policy`, schema, anonimización o salida estructurada no cumplen.
5. Bloquear skill con red/PII fuera de allowlist; no tratar permisos declarativos como sustituto de aislamiento real.
6. Probar manifiesto inválido, componente faltante, skill no permitida, PII en entrada y salida clínica prohibida.

## 6. Estado de migración

Los manifests preexistentes de `coding_agent`, `research_agent` y skills son esquemáticos y no cumplen todavía todos estos campos. Actualizarlos y escribir el loader es una fase de generación pendiente; no modificar activaciones para incluir un agente incompleto. Revisar este contrato junto con `docs/AI_CODEGEN_PLAYBOOK.md` antes de generar código.