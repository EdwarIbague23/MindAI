# Prompts 03 y 04 – Modelos SQLAlchemy + PostgreSQL y Alembic y Migraciones

> **ARCHIVO HISTÓRICO / NO EJECUTAR:** se conserva por trazabilidad docente. Su contrato de tablas está obsoleto; usar `prompts_modelado_datos.md` y revisar `../docs/AI_CODEGEN_PLAYBOOK.md`.

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 8‑11).  
**Bloque:** A – Arquitectura & Datos.  
**Prioridad:** 1 (Prompt 03) / 2 (Prompt 04).  
**Área / Submódulo:** Backend / ORM y Modelo de Datos / Backend / Database Migraciones.  
**Rol Senior:** Senior Database Architect / Senior Database Engineer.

---

## Prompt 03 – Modelos SQLAlchemy + PostgreSQL

### Tarea específica y casos borde

Diseñar los modelos `User`, `ClinicalNote`, `Analysis`, `EmotionScore`, `CognitiveDistortion`, `GuidingQuestion` y `Report`, con Timestamps y UUID. Índices y foreign keys. Eliminación controlada. Integridad referencial.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| Definición de entidades y relaciones del dominio clínico. | Modelo relacional listo para PostgreSQL. |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| `note_id = A` | `analysis_id = B` con múltiples emotion_scores, distortions y questions asociados. Eliminar un usuario no debe eliminar información accidentalmente sin política explícita. |

### Restricciones técnicas y de seguridad

- Usar SQLAlchemy 2.x.
- Evitar SQL por concatenación.
- Preparar PostgreSQL v16.
- Índices sobre IDs y timestamps.
- No almacenar tokens.
- Preparar el modelo para cifrado de notas con pgcrypto/AES-256-GCM.
- Usar Alembic para migraciones versionadas; migraciones reversibles cuando sea viable.
- No introducir credenciales en scripts.
- Probar migraciones desde una BD limpia.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior Database Architect specialized in PostgreSQL v16, SQLAlchemy 2.x, Alembic, and multi‑tenant SaaS applications.

Context:
Backend / ORM and Data Model. Design the User, ClinicalNote, Analysis, EmotionScore, CognitiveDistortion, GuidingQuestion, and Report models, with the hierarchical relationship User‑Question, timestamps and UUIDs, indexes and foreign keys, controlled deletion, and referential integrity. The system uses a dual storage approach: PostgreSQL as the relational database for clinical data with ACID compliance, referential integrity, and tenant isolation via schemas/RLS; Alembic for versioned migrations. Redis v7 is used for session cache and latency optimization of the copilot.

Task:
Design the User, ClinicalNote, Analysis, EmotionScore, CognitiveDistortion, GuidingQuestion, and Report models, with the hierarchical relationship User‑Question, timestamps and UUIDs, indexes and foreign keys, controlled deletion, and referential integrity. The system uses a dual storage approach: PostgreSQL as the relational database for clinical data with ACID compliance, referential integrity, and tenant isolation via schemas/RLS; Alembic for versioned migrations. Redis v7 is used for session cache and latency optimization of the copilot.

Consider:
- Timestamps and UUIDs.
- Indexes and foreign keys.
- Controlled deletion.
- Referential integrity.
- Dual storage: PostgreSQL for persistent clinical data with ACID/tenant isolation; Redis for session cache.
- Prepare model for note encryption with pgcrypto/AES-256-GCM.

Format:
-mapped columns (e.g. note_id: Mapped, status: Mapped).
Examples of the expected format and level:
- questions. Deleting a user must not accidentally delete information without an explicit policy.

Constraints:
- Use SQLAlchemy 2.x; avoid SQL built by string concatenation; target PostgreSQL v16; indexes on IDs and timestamps; do not store tokens; prepare the model for note encryption with pgcrypto; use Alembic for migrations; Redis v7 for session cache.
```
---

## Prompt 04 – Alembic y Migraciones

### Tarea específica y casos borde

Configurar Alembic para generar y ejecutar migraciones de las tablas `users`, `clinical_notes`, `analyses`, `emotion_scores`, `cognitive_distortions`, `guiding_questions` y `reports`.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `alembic revision --autogenerate -m "initial schema"` / `alembic upgrade head` / `alembic downgrade -1` | Migración inicial 0001_initial_schema crea todas las tablas y relaciones. |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| Migración inicial | 0001_initial_schema crea todas las tablas y relaciones. |

### Restricciones técnicas y de seguridad

- No borrar columnas automáticamente sin revisión.
- Migraciones reversibles cuando sea viable.
- No introducir credenciales en scripts.
- Probar migraciones desde una BD limpia.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior Database Engineer specialized in Alembic and PostgreSQL.

Context:
Backend / Database Migrations. Set up Alembic to generate and run migrations for the users, clinical_notes, analyses, emotion_scores, cognitive_distortions, guiding_questions, and reports tables.

Task:
Set up Alembic to generate and run migrations for the users, clinical_notes, analyses, emotion_scores, cognitive_distortions, guiding_questions, and reports tables.

Format:
--
autogenerate
-
m "initial schema"
-
1

Examples of the expected format and level:
- 0001_initial_schema creates all tables and relationships.

Constraints:
- Do not automatically drop columns without review; reversible migrations whenever feasible; do not include credentials in scripts; test migrations from a clean database.
```
---
*Prompts de modelo relacional y control de versiones de BD.*