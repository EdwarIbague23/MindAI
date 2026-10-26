# Prompt de generación — Seguridad de API V1

**Ubicación:** `interfaces/api/`. Ejecutar después de aprobar contrato OpenAPI y antes de conectar web/móvil.

Implementa autenticación y autorización como servicios FastAPI compartidos por ambos clientes. Antes de cambiar código, inspecciona los módulos existentes y presenta el diseño de sesión/tokens para aprobación.

- Verifica identidad en servidor; asigna roles desde reglas de backend, nunca desde body/header controlado por cliente.
- Segundo factor requerido para acceso clínico según RF-01. Respuestas de login no enumeran cuentas; aplica rate limit y controles de brute force.
- Access token corto y refresh rotatorio; invalidación/logout. Web usa cookie `Secure`, `HttpOnly`, `SameSite` cuando el flujo adoptado lo permita y CSRF donde corresponda. Móvil usa secure storage del SO; jamás `localStorage`, `AsyncStorage` ni logs para secretos.
- Cada endpoint aplica RBAC y ownership/relación terapeuta-paciente, también para descargas y WebSocket futuro. Prueba `patient A -> patient B`, therapist no asignado, admin sin permiso y objeto inexistente.
- CORS solo regula orígenes web; no se usa como autenticación móvil. TLS fuera de localhost, headers seguros, límite de request y validación Pydantic.
- No incluir tokens, contraseñas, PII, notas o texto de riesgo en logs, errores, push ni analytics. Respuesta genérica con `request_id`; auditoría de acceso con metadata mínima y sin body clínico.
- Limita sesiones concurrentes si política lo requiere; no deshabilitar controles en dev sin bandera explícita y pruebas.

Entregables: dependencias justificadas y fijadas, configuración por ambiente sin secretos, tests unitarios/integración con cliente y usuarios sintéticos, pruebas de acceso negativo, comandos ejecutados y riesgos que requieren aprobación legal/operativa. No afirmar cumplimiento legal o seguridad de producción por tener JWT/2FA implementados.