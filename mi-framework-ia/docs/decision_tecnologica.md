# Decision tecnologica - MindFlow AI

## Arquitectura propuesta

Se recomienda un **monolito modular con FastAPI** para el MVP, organizado por dominios y con contratos REST. Esta opcion mantiene la estructura actual de `mi-framework-ia`, reduce la complejidad operativa y permite separar servicios posteriormente cuando el volumen lo justifique.

| Capa | Tecnologia | Motivo |
|---|---|---|
| Cliente | React + TypeScript como PWA | Reutiliza la direccion del README, funciona en movil y permite WCAG 2.1 AA. |
| API | Python 3.11+ + FastAPI + Pydantic | Ya es la base declarada; ofrece validacion, OpenAPI y buen rendimiento para operaciones I/O. |
| Identidad | JWT de corta duracion, refresh token rotatorio, 2FA TOTP/email, Argon2id | Cubre RF-01, HU-01 y RNF-09 con minimo privilegio. |
| Dominio | Modulos de usuarios, directorio, agenda, clinica, riesgo, pagos y videollamada | Cubre RF-02 a RF-16 y HU-02 a HU-08 sin mezclar seguridad con la interfaz. |
| IA | Orquestador + agentes + LLM Gateway existentes | Mantiene anonimización obligatoria, esquemas estructurados y proveedor reemplazable. |
| Base de datos | PostgreSQL 16 administrado + `pgcrypto` | Transacciones, claves foraneas, restricciones de solapamiento para agenda, auditoria y crecimiento horizontal de lectura. |
| Cache y tiempo real | Redis | Sesiones, rate limiting, locks breves de agenda, cache de disponibilidad y canales de notificacion. No almacena historia clinica. |
| Documentos | S3 compatible con cifrado administrado por claves | Tarjetas profesionales, comprobantes y reportes; en PostgreSQL solo se guardan metadatos y referencias. |
| Eventos | Redis Streams inicialmente; RabbitMQ si crece el volumen | Notificaciones, alertas, auditoria y tareas de reportes sin bloquear la API. |
| Videollamada | WebRTC con servidor de señalizacion propio y TURN administrado | Evita enlaces expuestos de terceros; validar proveedor y cifrado extremo a extremo antes de produccion. |
| Despliegue | Docker, PostgreSQL administrado, CDN/WAF y CI/CD | Facilita RNF-04, RNF-06, backups y despliegues repetibles. |

## Modelo de datos principal

PostgreSQL debe contener, como minimo, `users`, `therapist_profiles`, `professional_verifications`, `consents`, `availability_slots`, `appointments`, `clinical_notes`, `risk_assessments`, `shared_summaries`, `payments`, `notifications` y `audit_events`.

Las notas clinicas se cifran antes de persistirlas con AES-256-GCM. Las consultas deben aplicar autorización por relación terapeuta-paciente; no basta con ocultar botones en React. `audit_events` debe ser append-only, con hash encadenado o almacenamiento WORM para sostener la inmutabilidad exigida por RNF-03.

Para evitar dobles reservas, `appointments` debe usar transacciones y una restricción de exclusión por profesional y rango temporal. La confirmación y el envío de notificaciones se desacoplan mediante eventos.

## Trazabilidad de requisitos

- `auth`: RF-01, HU-01, RNF-09.
- `directory`: RF-02 y RF-10, HU-02 y HU-07.
- `scheduling`: RF-03, RF-04 y RF-13, HU-03 y HU-08.
- `clinical` + `crypto` + `audit`: RF-06 y RF-07, HU-04 y RNF-01/RNF-03.
- `risk` + `notifications`: RF-05, RF-09 y RF-15, HU-06.
- `consent`: RF-12 y RNF-02.
- `payments`: RF-14; el proveedor PSE/tarjeta queda como decisión pendiente.
- `telehealth`: RF-11 y RNF-04; proveedor WebRTC/TURN queda como decisión pendiente.
- RF-17 se mantiene fuera del alcance: no se implementa diagnóstico ni prescripción automatizada.

## Riesgos y decisiones pendientes

1. Confirmar proveedor de videollamada, retención de grabaciones y alcance real del cifrado extremo a extremo.
2. Confirmar pasarela colombiana, conciliación y política de reembolsos o inasistencias.
3. Definir volumen esperado, RPO/RTO y región de residencia de datos antes de contratar infraestructura.
4. Validar legalmente el flujo de consentimiento, eliminación y portabilidad bajo Ley 1581 de 2012 y Decreto 1377 de 2013.