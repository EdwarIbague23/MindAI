# Decision tecnologica - MindFlow AI

## Arquitectura propuesta

Se recomienda un **monolito modular con FastAPI** para el MVP, organizado por dominios y con contratos REST. Esta opcion mantiene la estructura actual de `mi-framework-ia`, reduce la complejidad operativa y permite separar servicios posteriormente cuando el volumen lo justifique.

| Capa | Tecnologia | Motivo |
|---|---|---|
| Cliente web | React + TypeScript para navegador | Interfaz web responsiva para terapeutas y pacientes; consume la API REST compartida. |
| Cliente móvil | React Native + TypeScript para Android/iOS (Expo recomendado para scaffold) | Aplicación independiente; consume el mismo API y usa Keychain/Keystore. No duplica reglas de negocio. |
| Contrato entre clientes y servidor | API REST FastAPI + OpenAPI | Autenticación, autorización, validación y lógica de dominio centralizadas; ningún cliente llama directamente al LLM, Redis o PostgreSQL. |
| API | Python 3.11+ + FastAPI + Pydantic | Ya es la base declarada; ofrece validacion, OpenAPI y buen rendimiento para operaciones I/O. |
| Identidad | JWT de corta duracion, refresh token rotatorio, segundo factor por correo en V1 (proveedor desacoplado), Argon2id | Cubre RF-01, RF-12 y RNF-09 con minimo privilegio; nunca confiar en el rol enviado por un cliente. |
| Dominio V1 | Usuarios/roles, consentimiento, perfiles/verificación profesional, directorio, disponibilidad, citas, notas, riesgo, notificaciones y auditoría | Cubre RF-01 a RF-10, RF-12, RF-13 y RF-18 según historias; pagos y videollamada quedan fuera de V1. |
| IA | Orquestador + agentes + LLM Gateway existentes | Mantiene anonimización obligatoria, esquemas estructurados y proveedor reemplazable. |
| Base de datos | PostgreSQL 16 administrado + SQLAlchemy 2.x + Alembic | Transacciones ACID, integridad referencial, restricciones de solapamiento para agenda, auditoría append-only. SQLAlchemy ORM para mapeo objeto-relacional; Alembic para migraciones versionadas y reversibles cuando sea viable. Soporte pgcrypto para cifrado AES-256-GCM de notas clínicas. | |
| Cache y tiempo real | Redis v7 | Sesiones, rate limiting, locks breves de agenda, cache de disponibilidad y canales de notificación. No almacena historia clínica. Acceso O(1) para sesiones activas, TTL automático, optimización de latencia en respuestas del copiloto. |
| Documentos | S3 compatible con cifrado administrado por claves | Tarjetas profesionales, comprobantes y reportes; en PostgreSQL solo se guardan metadatos y referencias. |
| Eventos | Redis Streams inicialmente; RabbitMQ si crece el volumen | Notificaciones, alertas, auditoria y tareas de reportes sin bloquear la API. |
| Videollamada | WebRTC con servidor de señalizacion propio y TURN administrado | Evita enlaces expuestos de terceros; validar proveedor y cifrado extremo a extremo antes de produccion. |
| Despliegue | Docker, PostgreSQL administrado, CDN/WAF y CI/CD | Facilita RNF-04, RNF-06, backups y despliegues repetibles. |

La PWA puede evaluarse como complemento de la web, pero no sustituye la aplicación React Native definida para el canal móvil. Los dos clientes deben reutilizar los contratos de API; no se deben duplicar agentes, persistencia ni reglas clínicas en los dispositivos.

## Justificación de la doble capa de almacenamiento

**PostgreSQL v16 + SQLAlchemy 2.x + Alembic:**
- **Cumplimiento ACID:** Garantiza transacciones seguras para datos clínicos sensibles (historias, citas, auditoría). Ningún dato se pierde o corrompe en operaciones concurrentes.
- **Integridad referencial:** Restricciones de clave foránea en citas, disponibilidad y relaciones terapeuta-paciente. Las restricciones de exclusión evitan solapamientos de agenda a nivel de BD.
- **Aislamiento de tenant (tenant isolation):** Cada profesional/paciente tiene acceso controlado a sus propios datos mediante schemas de PostgreSQL y políticas de RLS (Row Level Security). Los roles (patient/therapist/admin) se modelan una sola vez; no se crea `is_therapist` redundante.
- **pgcrypto:** Cifrado AES-256-GCM para notas clínicas en reposo. Las claves de cifrado nunca se almacenan en el propio texto de la nota.
- **Alembic:** Migraciones versionadas, reversibles cuando es viable. Probar siempre desde BD limpia. No se introducen credenciales en scripts.

**Redis v7:**
- **Gestión de sesiones:** Almacena sesiones activas del copiloto con TTL automático; O(1) access time reduce latencia en respuestas del copiloto.
- **Rate limiting y locks:** Locks breves de agenda y rate limiting no bloquean la API principal.
- **Redis Streams:** Para eventos y notificaciones sin bloquear la API. No almacena historia clínica ni PII.

## Alcance y fases

La V1 académica incluye RF-01 a RF-10, RF-12 (promovido a `Must` por la entrevista), RF-18 y el copiloto profesional descrito en README/arquitectura. RF-11 (videollamada), RF-14 (pagos), RF-15 (cuestionarios longitudinales) y RF-16 (calificación) quedan fuera de V1. RF-17 excluye diagnóstico, prescripción y recomendación automatizada de especialistas; el copiloto se limita a señales, evidencia y preguntas guía para revisión profesional.

## Modelo de datos principal

PostgreSQL V1 debe contener, como mínimo, `users`, `therapist_profiles` (incluye estado de verificación), `consents`, `availability_slots`, `appointments`, `clinical_notes`, `analyses`, `emotion_scores`, `cognitive_distortions`, `guiding_questions`, `reports`, `risk_assessments`, `notifications` y `audit_events`. Pagos y videollamada no se modelan como entregables de V1.

Las notas clinicas se cifran antes de persistirlas con AES-256-GCM. Las consultas deben aplicar autorización por relación terapeuta-paciente; no basta con ocultar botones en React. `audit_events` debe ser append-only, con hash encadenado o almacenamiento WORM para sostener la inmutabilidad exigida por RNF-03.

Para evitar dobles reservas, `appointments` debe usar transacciones y una restricción de exclusión por profesional y rango temporal. La confirmación y el envío de notificaciones se desacoplan mediante eventos.

## Trazabilidad de requisitos

- `auth` + `consent`: RF-01/RF-12, US-001, RNF-02/RNF-09.
- `directory` + `professional_verification`: RF-02/RF-10, US-002.
- `scheduling` + `availability`: RF-03/RF-04/RF-13, US-003/US-004, RNF-05.
- `clinical` + `crypto` + `audit`: RF-06/RF-07, US-006, RNF-01/RNF-03/RNF-13.
- `risk` + `notifications`: RF-05/RF-09, US-005/US-007.
- `copilot`: RF-18, US-008; RF-17 prohíbe diagnóstico, prescripción y recomendación automatizada de especialista.
- `mobile`: RNF-05/RNF-07/RNF-08/RNF-11/RNF-12, US-009.
- RF-11/RF-14/RF-15/RF-16 quedan en backlog posterior; decisiones de video/pagos solo se abren al aprobar esas fases.

## Riesgos y decisiones pendientes

1. Confirmar proveedor de videollamada, retención de grabaciones y alcance real del cifrado extremo a extremo.
2. Confirmar pasarela colombiana, conciliación y política de reembolsos o inasistencias.
3. Definir volumen esperado, RPO/RTO y región de residencia de datos antes de contratar infraestructura.
4. Validar legalmente el flujo de consentimiento, eliminación y portabilidad bajo Ley 1581 de 2012 y Decreto 1377 de 2013.