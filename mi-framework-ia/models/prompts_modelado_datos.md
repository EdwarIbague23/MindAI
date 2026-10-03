# Prompt de generación — Modelo de datos V1

**Responsabilidad:** `models/` y `alembic/`. Fuente: ERD `docs/diagrama_erd_mindflow.mmd`, RF/US y `docs/AI_CODEGEN_PLAYBOOK.md`.

> El esquema del diagrama es un contrato lógico que requiere revisión humana; no generar migraciones hasta aprobar relaciones, borrado, retención y política de consentimiento.

## Prompt

Actúa como arquitecto de datos SQLAlchemy 2.x/PostgreSQL para una plataforma de salud mental. Inspecciona los modelos y migraciones existentes. Conserva el framework docente y entrega primero un diff lógico (entidades, claves, cardinalidades, restricciones) comparado con el ERD antes de editar.

Implementa, solo después de aprobación, entidades V1: `User` con roles patient/therapist/admin; `TherapistProfile` con verificación; `Consent`; `AvailabilitySlot`; `Appointment`; `ClinicalNote`; `Analysis`; `EmotionScore`; `CognitiveDistortion`; `GuidingQuestion`; `Report`; `RiskAssessment`; `Notification`; `AuditEvent`.

Reglas obligatorias:
- Usar UUID, timestamps con zona (`TIMESTAMPTZ`) en UTC, FK/indexes, enums estables y constraints DB donde apliquen. El rol se modela una sola vez; no crear `is_therapist` redundante.
- La nota se cifra con AES-GCM antes de persistir; almacenar ciphertext y versión/identificador de clave, nunca plaintext ni una columna `note_text` que induzca a guardarlo sin cifrar. No incluir claves en DB.
- No usar `patient_hash` como autorización ni identificador de 32 caracteres para SHA-256. La relación paciente-terapeuta se representa con FK y permisos de dominio; no inventar un hash reversible.
- `score` y `confidence` son NUMERIC 0–100, con `CHECK` de rango; mantener idéntica escala en schemas, API, fixtures, web y móvil.
- La agenda impide solapamientos en concurrencia mediante transacción y restricción apropiada de PostgreSQL; no depender solo de una consulta previa en la aplicación.
- Auditoría es append-only y no guarda nota, PII, token ni respuesta libre. Datos de riesgo se minimizan y restringen.
- Evitar cascadas que borren historia clínica/auditoría sin política explícita. Definir retención/anonimización como decisión pendiente si falta aprobación.

Actualiza todos los modelos relacionados, exports de `models/__init__.py`, migración(es), schemas afectados y tests en un mismo cambio coherente. Si la migración inicial ya fue aplicada/compartida, crea una migración nueva en vez de reescribir historia. Ejecuta revisión Alembic, upgrade desde DB limpia, downgrade cuando sea viable y pruebas de constraints. Reporta incertidumbres; no añadas tablas de pagos/videollamada en V1.