# PLAN PROTOTIPO MAESTRO - INSTRUCCIONES DE CONSTRUCCIÓN FASE A FASE

> **ESTE DOCUMENTO ES EL "PROMPT MAESTRO" PARA CONSTRUIR EL SISTEMA.**
> No contiene historiales de iteraciones previas ni reportes de avances.
> Sirve como hoja de ruta para construir el prototipo funcional en localhost,
> fase por fase, con tu corrección entre cada fase para evitar desvíos.
> 
> **ORDENANZA:** No avanzar a la siguiente fase hasta que la actual esté
> funcional y verificada. Cada fase incluye archivos a crear/modificar y
> criterios de aceptación.

---

## FASE 1: Estructura Inicial y Configuración del Proyecto

### Objetivo
Establecer la estructura base del proyecto MindFlow AI con la arquitectura híbrida Web/Mobile, FastAPI, PostgreSQL v16 y Redis v7 según el diseño de AI Studio.

### Archivos a crear/ modificar
1. `mi-framework-ia/` - Raíz del framework core
2. `mi-framework-ia/core/` - Core utilities
3. `mi-framework-ia/core/security/` - Seguridad y guardrails
4. `mi-framework-ia/core/orchestrator/` - Motor de planificación
5. `mi-framework-ia/interfaces/api/` - Endpoints FastAPI
6. `mi-framework-ia/interfaces/frontend/` - Componentes React
7. `mi-framework-ia/interfaces/mobile/` - Componentes React Native
8. `mindflow-clinical-portal/` - Prototype source of truth reference
9. `alembic/` - Migraciones de base de datos
10. `requirements.txt` / `pyproject.toml` - Dependencias Python
11. `package.json` - Dependencias Node.js/Tailwind

### Especificaciones técnicas
- **Arquitectura de 5 capas** (según `architecture-diagram.drawio`):
  - Capa 1: Presentación Web (React + TypeScript)
  - Capa 2: Presentación Móvil (React Native)
  - Capa 3: Aplicación (FastAPI híbrida)
  - Capa 4: Orquestación (Router/Planner/Executor)
  - Capa 5: Infraestructura (PostgreSQL v16 + Redis v7 + LLM Gateway)
- **CORS híbrido:** Orígenes `http://localhost:3000` (Web), `http://localhost:19000` y `http://localhost:8080` (Mobile)
- **Variables de entorno:** `GEMINI_API_KEY`, `POSTGRES_URL`, `REDIS_URL`, `CORS_ORIGINS`
- **Estructura de carpetas** sin duplicar `backend/app` + `frontend/src`

### Criterios de aceptación para pasar a la Fase 2
- [ ] Estructura de carpetas creada respetando la estructura de `mi-framework-ia`
- [ ] `main.py` básico de FastAPI en ejecución en `http://localhost:8000`
- [ ] CORS configurado para orígenes Web y Mobile
- [ ] `.env.example` creado con variables necesarias
- [ ] `alembic.ini` configurado con URL PostgreSQL
- [ ] `package.json` con dependencias básicas (fastapi, uvicorn, react, tailwind)
- [ ] Proyecto levanta sin errores en `localhost:8000` y `localhost:3000`

---

## FASE 2: Pipeline Obligatorio de Seguridad PII

### Objetivo
Implementar el pipeline de anonimización PII como middleware transversal obligado, conforme a la Ley 1581/2012 y Decreto 1377. Este pipeline se ejecuta ANTES que cualquier interacción con LLM o persistencia de datos.

### Archivos a crear/ modificar
1. `mi-framework-ia/core/security/guardrails.py` - Pipeline completo PII+toxicity+injection
2. `mi-framework-ia/core/security/prompts_anonimizacion_pii.md` - Prompt canónico
3. `mi-framework-ia/interfaces/api/main.py` - Middleware de sanitización en endpoints
4. `mi-framework-ia/models/` - Modelos SQLAlchemy con campos hasheados

### Especificaciones técnicas
- **Patrones PII** (Regex + SpaCy `es_core_news_sm`):
  - `email`: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`
  - `colombia_id`: `\d{8,10}` (CC, NIT básico)
  - `phone_colombia`: `(?:\+57|57)?3[0-9]{8}`
  - `full_name`: `(?:[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)\s+(?:[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)`
  - `credit_card`: `\b(?:\d[ -]*?){13,16}\b`
  - `medical_record`: `\bMED-\d{4,8}\b|EXP-\d{3,6}\b`
- **Palabras clave de toxicidad:** `matar`, `asesinar`, `hurtar`, `robar`, `dañar`, `odio`, `prejudicar`, `vengar`, `threaten`
- **Patrones inyección de prompt:** `ignore previous instructions`, `forget all previous`, `new system prompt`, `system role override`
- **Token de enmascaramiento:** `[PIX_REDACTED]`
- **Orden de ejecución:** PII → toxicidad → inyección de prompt
- **Fail-closed:** Si el pipeline no puede asegurar su salida, no enviar al LLM

### Criterios de aceptación para pasar a la Fase 3
- [ ] `guardrails.py` implementado con las 6 funciones: `redact_pii`, `detect_toxicity`, `validate_prompt_injection`, `sanitize_input`, `get_pii_statistics`
- [ ] Middleware en `main.py` que sanitiza payloads POST/PUT con `raw_text`
- [ ] Texto original Nunca se imprime en logs/telemetría
- [ ] Si detecta PII/toxicidad/injection: response con `security_warning` pero continúa con texto sanitizado
- [ ] Si el pipeline falla: respuesta 500 y no se envía al LLM
- [ ] Pruebas con dato sintético: `Ana Pérez llamó al 3001234567` → `[PERSONA_1] llamó al [TELEFONO_1]`

---

## FASE 3: Modelos de Base de Datos y Esquema ERD

### Objetivo
Definir el esquema completo de PostgreSQL v16 con todas las tablas relaciones según el ERD V2 ampliado de `erd-database.drawio`, e implementar los modelos SQLAlchemy 2.x + Alembic migrations.

### Archivos a crear/ modificar
1. `mi-framework-ia/docs/erd-database.drawio` - Diagrama ERD V2 (fuente de verdad)
2. `mi-framework-ia/models/users.py` - Modelo Usuario
3. `mi-framework-ia/models/clinical_notes.py` - Modelo Nota Clínica
4. `mi-framework-ia/models/analyses.py` - Modelo Análisis
5. `mi-framework-ia/models/emotion_scores.py` - Modelo Scores Emocionales
6. `mi-framework-ia/models/cognitive_distortions.py` - Modelo Distorsiones Cognitivas
7. `mi-framework-ia/models/guiding_questions.py` - Modelo Preguntas Guía
8. `mi-framework-ia/models/reports.py` - Modelo Reportes
9. `mi-framework-ia/models/risk_assessments.py` - Modelo Evaluación Riesgo
10. `alembic/versions/` - Migraciones versionadas
11. `alembic/env.py` - Configuración de migraciones

### Especificaciones técnicas (según `erd-database.drawio`)
- **Tabla USER:** PK id UUID, UK email VARCHAR(255) UNIQUE, role ENUM(patient|therapist|admin), password_hash, timestamps
- **Tabla THERAPIST_PROFILE:** FK user_id, license_number, specialty, modality (presencial|virtual), zone, verification_status
- **Tabla CONSENT:** FK user_id, policy_version, policy_hash, accepted_at, withdrawn_at
- **Tabla APPOINTMENT:** PK id UUID, FK patient_id, therapist_id, slot_id, starts_at, ends_at, status
- **Tabla AVAILABILITY_SLOT:** PK id UUID, FK therapist_id, starts_at, ends_at, status
- **Tabla CLINICAL_NOTE:** PK id UUID, FK appointment_id/patient_id/therapist_id, ciphertext BYTEA (AES-256-GCM), key_version, language, is_anonymous, timestamps
- **Tabla ANALYSIS:** PK id UUID, FK clinical_note_id UNIQUE, status (pending|completed|reviewed), provider_model, processing_time_seconds, needs_review, timestamps
- **Tabla EMOTION_SCORE:** PK id UUID, FK analysis_id UNIQUE, emotion_name ENUM, score NUMERIC(3,2) 0-100, confidence NUMERIC(3,2) 0-100, timestamps
- **Tabla COGNITIVE_DISTORTION:** PK id UUID, FK analysis_id, distortion_type ENUM, confidence NUMERIC(3,2) 0-100, evidence_excerpt TEXT, timestamps
- **Tabla GUIDING_QUESTION:** PK id UUID, FK analysis_id, question_text TEXT, category ENUM, priority INT, timestamps
- **Tabla REPORT:** PK id UUID, FK analysis_id UNIQUE, format ENUM(pdf|json|csv), ciphertext BYTEA, encryption_key_version, generated_at, timestamps
- **Tabla RISK_ASSESSMENT:** PK id UUID, FK patient_id, FK appointment_id?, source ENUM, status ENUM, acknowledged_at, no_free_text BOOLEAN, timestamps
- **Tabla NOTIFICATION:** PK id UUID, FK user_id, FK appointment_id?, channel ENUM, status ENUM, timestamps
- **Tabla AUDIT_EVENT:** PK id UUID, FK actor_user_id?, action VARCHAR(100), resource_type VARCHAR(50), resource_id UUID, occurred_at TIMESTAMPTZ, append-only

### Relaciones (según ERD)
- USER 1:N clinical_notes, therapist_notifications, risk_assessments, audit_events
- USER 1:0..1 consent
- USER 1:N appointments (como paciente)
- USER 1:N availability_slots
- THERAPIST_PROFILE 1:N availability_slots, appointments
- APPOINTMENT 1:N clinical_notes (FK appointment_id)
- CLINICAL_NOTE 1:N analyses (FK clinical_note_id)
- ANALYSIS 1:N emotion_scores, cognitive_distortions, guiding_questions
- ANALYSIS 1:1 reports (FK analysis_id)
- PATIENT 1:N risk_assessments
- APPOINTMENT 0..1 risk_assessment
- USER 1:N notifications (FK user_id)
- APPOINTMENT 0..1 notifications (FK appointment_id)

### Criterios de aceptación para pasar a la Fase 4
- [ ] Todos los 15 modelos SQLAlchemy creados con campos y tipos de datos exactos
- [ ] Migración Alembic `alembic upgrade head` se ejecuta sin errores
- [ ] Tabla USER creada con PK id UUID, UK email UNIQUE, role ENUM
- [ ] Tabla CLINICAL_NOTE con ciphertext BYTEA y FKs configurados
- [ ] Tabla ANALYSIS con FK clinical_note_id UNIQUE y status ENUM
- [ ] Todas las relaciones FK definidas y coherentes
- [ ] Encriptación AES-256-GCM definida en modelo CLINICAL_NOTE

---

## FASE 4: Orchestrator y Motor de Planificación

### Objetivo
Implementar el orchestrator core con el TaskDecomposer y Plan dataclasses para la descomposición de objetivos clínicos en subtareas delegables a agentes especializados.

### Archivos a crear/ modificar
1. `mi-framework-ia/core/orchestrator/planner.py` - TaskDecomposer, Plan, Task dataclasses
2. `mi-framework-ia/core/orchestrator/executor.py` - Ejecutor de tareas
3. `mi-framework-ia/core/agent_base/base_agent.py` - Agente base
4. `mi-framework-ia/core/agent_base/agent_registry.py` - Registro de agentes

### Especificaciones técnicas
- **Dataclass Task:** id, description, agent_type, priority, status, context, result, error, timestamps
- **Dataclass Plan:** plan_id, objective, tasks, status, timestamps
- **OBJECTIVE_AGENT_MAP:** `emotional_analysis` → emotion, `cognitive_distortion` → clinical, `risk_assessment` → clinical, `note_summary` → clinical, `patient_feedback` → emotion, `treatment_guidance` → clinical
- **TASK_PRIORITY:** urgent(1), high(2), medium(3), low(4), background(5)
- **Descomposición emocional:** 3 tareas (extract, scoring, evidence)
- **Descomposición clínica:** 3 tareas (extract, distortions, questions)
- **create_plan(objective, context)** - Función de conveniencia
- **get_next_task(plan)** - Obtener próxima tarea pendiente
- **task_completed(task)** / **task_failed(task)** - Marcadores de estado

### Criterios de aceptación para pasar a la Fase 5
- [ ] `planner.py` con Task y Plan dataclasses completos
- [ ] OBJECTIVE_AGENT_MAP mapeado correctamente
- [ ] _decompose_emotional_analysis() retorna 3 tareas con IDs y prioridades
- [ ] _decompose_clinical_analysis() retorna 3 tareas con IDs y prioridades
- [ ] create_plan() crea un plan con estructura válida
- [ ] get_next_task() retorna la tarea pending o None
- [ ] task_completed() y task_failed() actualizan estado y timestamps

---

## FASE 5: API FastAPI V1 - Endpoints y Rutas

### Objetivo
Implementar la API REST versionada v1 con todos los endpoints definidos en `prompts_api_dominio_v1.md`, con validación PII integrada, manejo de errores estructurado y autorización por rol.

### Archivos a crear/ modificar
1. `mi-framework-ia/interfaces/api/main.py` - API FastAPI completa (532 líneas base)
2. `mi-framework-ia/interfaces/api/prompts_api_dominio_v1.md` - Contratos de rutas
3. `mi-framework-ia/interfaces/api/endpoints/auth.py` - Endpoints auth/consent
4. `mi-framework-ia/interfaces/api/endpoints/notes.py` - Endpoints clínicas
5. `mi-framework-ia/interfaces/api/endpoints/analysis.py` - Endpoints análisis IA
6. `mi-framework-ia/interfaces/api/endpoints/appointments.py` - Endpoints agenda
7. `mi-framework-ia/interfaces/api/schemas/` - Modelos Pydantic
8. Manejadores de errores globales

### Especificaciones técnicas (según `prompts_api_dominio_v1.md`)
- **Convención de rutas:** `/api/v1/...`
- **Endpoints obligatorios:**
  - `GET /health, /health/detailed` - Health checks
  - `POST /api/v1/auth/login` - Login profesional
  - `POST /api/v1/auth/validate` - Validar token
  - `POST /api/v1/analysis/emotional` - Análisis emocional IA
  - `POST /api/v1/analysis/simple-chat` - Chat rápido copiloto
  - `POST /api/v1/notes` - Subir nota clínica
  - `GET /api/v1/notes/{note_id}` - Consultar nota
- **Validación PII:** Todos los endpoints que reciben `raw_text` deben pasar por `sanitize_input()` antes de procesar
- **Manejo de errores:** 400/422 validación, 401 no autenticado, 403/404 sin acceso, 409 conflicto, 429 límite, 5xx genérico con request_id
- **CORS:** Solo orígenes configurados (no *)

### Modelos Pydantic requeridos
- HealthCheck: status, timestamp, version
- ChatQuery: patient_id, therapist_id, note_id, raw_text, consultation_type
- AnalysisResponse: analysis_id, patient_id, therapist_id, emotion_scores, cognitive_distortions, guiding_questions, status, needs_review, processing_time_seconds, created_at, requires_human_review
- SimpleChatResponse: response_id, status, message, needs_human_review, timestamp

### Criterios de aceptación para pasar a la Fase 6
- [ ] FastAPI levanta en `localhost:8000` sin errores
- [ ] `/health` y `/health/detailed` responden 200
- [ ] `/api/v1/auth/login` acepta payload {usuario: "..."} y retorna token
- [ ] `/api/v1/analysis/emotional` acepta ChatQuery y retorna AnalysisResponse
- [ ] `/api/v1/notes` acepta POST con sanitización PII integrada
- [ ] Errores HTTP estructurados con request_id
- [ ] Documentación OpenAPI automática en `/api/v1/openapi.json`

---

## FASE 6: Componente Frontend React - Vistas y Modales

### Objetivo
Implementar la interfaz de usuario React + TypeScript + TailwindCSS con las 11 vistas navegables y 4 modales, consumiendo la API V1 con acceso por rol (paciente/profesional/admin).

### Archivos a crear/ modificar
1. `mindflow-clinical-portal/src/App.tsx` - Componente principal con navegación
2. `mindflow-clinical-portal/src/main.tsx` - Renderizado React root
3. `mindflow-clinical-portal/src/index.css` - Tailwind + propiedades custom
4. `mindflow-clinical-portal/src/components/Header.tsx` - Barra navegación
5. `mindflow-clinical-portal/src/components/Sidebar.tsx` - Menú lateral
6. **Vistas (11 total):**
   - `DashboardView.tsx` - Página principal KPIs
   - `AgendaView.tsx` - Planificador terapéutico
   - `PacientesView.tsx` - Directorio de pacientes
   - `CitaDetalleView.tsx` - Detalle de cita
   - `Paciente360View.tsx` - Expediente completo (5 tabs)
   - `NotasClinicasView.tsx` - Editor SOAP note
   - `CopilotIAView.tsx` - Panel copiloto IA
   - `DisponibilidadView.tsx` - Configuración disponibilidad
   - `AlertasRiesgoView.tsx` - Centro alertas riesgo
   - `InformesView.tsx` - Generador reportes clínicos
   - `PerfilAjustesView.tsx` - Perfil y seguridad
7. **Modales (4 total):**
   - `TeleconsultaModal.tsx` - Teleconsulta con breathing pacer
   - `SignNoteModal.tsx` - Firma ED25519 + PIN
   - `QuickNoteModal.tsx` - Notas rápidas
   - `ManualAppointmentModal.tsx` - Cita manual

### Especificaciones de acceso por rol (según `prompts_ui_roles_react.md`)
- **Paciente:** registro/login/2FA, consentimiento versionado, directorio profesionales verificados, agenda, historial, recordatorios, autorreporte riesgo
- **Profesional:** login, verificación agenda, configurar disponibilidad, lista pacientes asignados, nota clínica, dashboard IA, reportes
- **Administrador:** verificar profesionales (solo vistas necesarias)

### Restricciones UI
- WCAG 2.1 AA, responsive desktop/tablet/móvil
- Carga, vacío, validación, error/reintento, sesión expirada 403/404
- Conflictos 409, scores 0-100 como señales nunca diagnóstico
- "Análisis generado por IA. Debe ser revisado por el profesional"
- Sin datos clínicos en localStorage/IndexedDB/logs/analytics
- No recomendar tratamientos/especialistas

### Criterios de aceptación para pasar a la Fase 7
- [ ] App.tsx con selector de 11 vistas navegables
- [ ] Sidebar y Header renderizados correctamente
- [ ] Cada vista consume endpoints `/api/v1/...` correctamente
- [ ] Acceso por rol: solo vistas permitidas según role en token
- [ ] Modales funcionales con sus comportamientos
- [ ] Sin PII expuesta en devtools console/logs
- [ ] Responsivo al redimensionar ventana

---

## FASE 7: Integración Completa y Pruebas en Localhost

### Objetivo
Integrar todas las fases anteriores, ejecutar el prototipo en localhost y verificar el alineamiento 100% con el diseño de AI Studio. Fase de pruebas end-to-end y corrección de inconsistencias.

### Actividades
1. **Levantar el entorno completo:**
   - `uvicorn mi_framework_ia.interfaces.api.main:app --reload --port 8000`
   - `npm run dev` en `mindflow-clinical-portal` (puerto 3000)
   
2. **Flujos end-to-end a probar:**
   - Login profesional → Agenda → Crear nota clínica → Sanitización PII → Análisis IA → Dashboard
   - Paciente registrarse → Ver directorio → Reserva cita → Recibir nota con PII redactado
   - Admin verificar profesional → Actualizar estado

3. **Validaciones técnicas:**
   - PII se redacta antes de enviar al LLM (verificar en logs que NO hay texto original)
   - Tokens no se guardan en localStorage
   - CORS funciona para Web y Mobile
   - Errores HTTP consistentes
   - OpenAPI documentation accesible en `/api/v1/docs`

4. **Correcciones identificadas:**
   - [ ] Any inconsistencias entre diagramas drawio y código implementado
   - [ ] Endpoints que no validan PII correctamente
   - [ ] Vistas UI que consumen endpoints erróneos
   - [ ] Modelos DB que no match con ERD
   - [ ] Middleware que falla Open en lugar de fail-closed

### Criterios de aceptación finales
- [ ] Prototipo funcional en `http://localhost:3000` consumiendo `http://localhost:8000`
- [ ] Flujo completo: Login → Crear nota → Sanitizar PII → Análisis emocional → Ver dashboard
- [ ] Ningún dato PII original aparece en consola del navegador ni logs de servidor
- [ ] Los 11 vistas son accesibles según el rol de usuario
- [ ] Los 4 modales funcionales operativos
- [ ] Diagramas `.drawio` coherentes con esquema BD real y código
- [ ] Sustentación lista: prototipo coherente con AI Studio source of truth

---

*PLAN DE CONSTRUCCIÓN ACTUALIZADO: 26 de octubre de 2026*
*Para ejecución fase a fase con corrección entre fases*
*Fuente de verdad absoluta: AI Studio export en `mindflow-clinical-portal`*