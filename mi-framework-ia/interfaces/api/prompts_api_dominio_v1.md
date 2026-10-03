# Prompt de generación — API de dominio V1

**Ubicación:** `interfaces/api/`
**Depende de:** `docs/AI_CODEGEN_PLAYBOOK.md`, `docs/02_requerimientos_rf_rnf.md`, `docs/03_historias_de_usuario.md`, `docs/decision_tecnologica.md`, `docs/diagrama_erd_mindflow.mmd`.
**Estado:** ejecutar después de aprobar schemas, modelo de datos, seguridad y migraciones.

## Objetivo

Implementar endpoints REST versionados con FastAPI para los flujos V1. Antes de escribir código, revisar la estructura real y schemas/modelos; presentar una tabla de rutas, rol permitido, entrada/salida, errores y criterio de autorización. No inventar contratos contradictorios ni regenerar el framework.

## Dominios y mínimo de rutas

- **Auth/consent:** registro de paciente y profesional; login + segundo factor; refresh/logout; consulta/aceptación/retiro de consentimiento con versión registrada. El usuario no escoge su rol privilegiado durante un alta pública.
- **Profesionales/directorio:** búsqueda pública solo de perfiles verificados; filtros por especialidad, modalidad y zona de Ibagué. Verificación y aprobación son acciones de administrador auditadas.
- **Agenda:** disponibilidad de profesional; lectura de horarios disponibles; reserva, consulta, cancelación/reprogramación conforme a la ventana de 12 h; historial propio. Reservas idempotentes y atómicas para evitar doble asignación.
- **Clínica:** crear y consultar notas estructuradas solo para el paciente/caso asignado; autorización del lado servidor en cada acceso. Contenido se cifra antes de persistir.
- **Copiloto:** crear análisis solo para una nota que el terapeuta puede consultar; responder `202 Accepted` si es asíncrono y exponer estado; validar salida tipada y devolverla solo a ese profesional.
- **Riesgo/notificaciones:** recibir el autorreporte estructurado, crear evento mínimo, notificar al profesional designado y registrar envío/acuse; nunca afirmar éxito si el proveedor no confirmó. No pasar datos clínicos a servicios de correo/push.

Convención propuesta: `/api/v1/...`; definir rutas finales y documentarlas en OpenAPI antes de implementarlas. No crear una API diferente para React Native. No exponer endpoints CRUD genéricos para notas, análisis o auditoría.

## Seguridad y errores obligatorios

- Pydantic valida límites, enumeraciones, scores 0–100 y campos permitidos; timestamps con zona y normalizados a UTC, agenda presentada en `America/Bogota`.
- RBAC + autorización por relación: rol paciente, terapeuta asignado y admin; ocultar botones en UI no es autorización. Respuestas de recursos ajenos no filtran existencia ni contenido.
- TLS se termina en el despliegue; CORS permite únicamente orígenes web configurados. La app móvil no se “protege” con CORS.
- Credenciales/refresh no se registran ni se devuelven en errores. Notas, tokens, autoreportes libres y PII nunca van en logs, analytics o mensajes push.
- Errores estables y documentados: `400/422` validación, `401` no autenticado, `403/404` sin acceso, `409` conflicto de agenda, `429` límite, `5xx` genérico con `request_id`.
- Auditoría append-only para lectura/modificación de historia clínica y cambios de permisos; el evento registra actor, acción, recurso, hora y `request_id`, no el cuerpo del recurso.
- Paginación, orden determinista, límites de request, rate limiting y protección de brute force en login.

## Entregables y pruebas

1. Contrato OpenAPI revisable antes de completar handlers.
2. Routers y servicios bajo `interfaces/api/` y módulos de dominio existentes; no lógica clínica en endpoints.
3. Pruebas de contrato y permisos para cada rol, acceso cruzado, consentimiento ausente/retirado, slot ya reservado, reintento idempotente, ventana de cancelación, proveedor de notificación caído y análisis pendiente/error.
4. Pruebas usan base de datos aislada y proveedores falsos; ninguna llamada LLM/push real.
5. Comandos ejecutados y resultados reales, más archivos creados/modificados.

No implementar pagos, videollamada, cuestionarios longitudinales, auto-recomendación de especialista ni endpoints de auditoría consultables por paciente en V1. Si un requerimiento depende de una decisión legal/operativa no aprobada, detener esa parte y enumerar el bloqueo.