# Prompt de generación — Schemas y contrato OpenAPI V1

**Ubicación:** `interfaces/api/`. Fuente normativa: requisitos, historias, ERD y `docs/AI_CODEGEN_PLAYBOOK.md`.

Antes de codificar, crea el contrato de datos y obtén revisión. Define Pydantic v2/OpenAPI DTOs para: registro/login/MFA/tokens; paciente/profesional/admin; consentimiento/versiones; perfil profesional/verificación; horarios/citas; nota estructurada (entrada transitoria) y referencia cifrada (salida); análisis; emociones; distorsiones/evidencia; preguntas guía; riesgo estructurado; notificación; reporte; auditoría metadata; errores.

Invariantes:
- `role` solo `patient|therapist|admin`; el cliente nunca envía un rol confiable al registrarse.
- Scores y confidence son enteros 0–100. Enum/nombre de emoción y estado deben ser comunes en API, DB y clientes.
- `needs_review` debe ser `true` para salida del copiloto V1. Es imposible representar `diagnosis`, `prescription` o `specialist_recommendation` en respuesta clínica.
- Entrada de análisis exige marca interna `anonymized: true`; no permitir que un cliente la use para evadir el middleware. El API anonimiza del lado servidor antes del gateway.
- No incluir ciphertext, clave, secreto, stack trace ni nota clínica en DTO de error. La respuesta de log/analytics es metadata mínima.
- Timestamps ISO-8601 con zona; agenda interna UTC, presentación `America/Bogota`.
- Schemas separan entidades persistidas de DTOs públicos. No serializar datos de otros pacientes ni campos internos del proveedor.

Entrega ejemplos JSON sintéticos válidos e inválidos, límites de texto y criterios de compatibilidad. Ejecuta generación OpenAPI y pruebas de schema. Mantén errores versionables; no reutilices un schema genérico que filtre contenido sensible. El contrato debe ser una única API para web y móvil.