# Prompt de generación — Portal web por roles V1

**Ubicación:** `interfaces/frontend/`. **Stack:** React + TypeScript. **Contrato:** API OpenAPI común con móvil. Fuente obligatoria: historias US-001–US-009 y `docs/AI_CODEGEN_PLAYBOOK.md`.

Antes de editar, inspecciona si hay app/package manifest. Si solo existen prompts, reporta que el cliente aún no está construido y propone el scaffold (scripts, versiones y lockfile) para aprobación; no simules funcionalidad conectada.

Implementa interfaces por rol:

- **Paciente:** registro/login/segundo factor, consentimiento versionado, directorio solo de profesionales verificados y filtros, detalle profesional, selección/reserva de horario, cancelación según ventana, historial, recordatorios y autorreporte de riesgo con ayuda verificada.
- **Profesional:** login, estado de verificación, agenda, configuración de disponibilidad, lista únicamente de pacientes asignados, nota clínica estructurada, inicio/estado de análisis, dashboard con señales y reporte.
- **Administrador:** no crear un tercer portal de V1 a menos que se apruebe; modelar solo las vistas necesarias para verificar profesionales.

Usa rutas protegidas por rol solo como UX; toda autorización se confirma en servidor. Consume cliente generado desde OpenAPI si está disponible; no inventes endpoints. No llames a PostgreSQL, Redis ni LLM desde navegador. Nunca persistir nota, riesgo, token o contenido clínico en `localStorage`, IndexedDB, analytics, logs ni service worker. No implementar modo offline para datos clínicos.

Cada pantalla incluye carga, vacío, validación, error/reintento, sesión expirada, `403/404`, conflicto `409`, responsive desktop/tablet/móvil, teclado/lector de pantalla y WCAG 2.1 AA. Scores son 0–100 y se muestran como señales, nunca como diagnóstico. El análisis indica que es generado por IA y requiere revisión profesional. No recomendar tratamientos/especialistas ni enviar contenido clínico en notificaciones.

Entrega en incrementos: shell/navegación, auth/consentimiento, directorio/agenda, portal profesional/notas, copiloto/reportes. Cada incremento incluye tests de componentes, mocks sintéticos y resultados de typecheck/lint/tests/build. No digas “funciona” hasta probar integración con API real de desarrollo y permisos de ambos roles.