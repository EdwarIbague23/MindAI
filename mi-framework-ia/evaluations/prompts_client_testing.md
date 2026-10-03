# Prompt de generación — Pruebas de clientes e integración híbrida

**Ubicación:** `evaluations/`. Ejecutar después de existir contrato OpenAPI, clientes y comandos reproducibles.

Actúa como QA automation para React web, React Native y FastAPI. Inspecciona runners ya instalados antes de elegir librerías. Diseña tests de contrato API compartidos y E2E para historias US-001 a US-009 sin datos reales ni llamadas de proveedor externas.

Cobertura mínima:
- Acceso por rol, consentimiento ausente/retiro, sesión expirada, acceso cruzado a paciente/nota, profesional sin verificar.
- Agenda: slot libre, conflicto concurrente, reintento idempotente, cancelación antes/después de 12 h, timezone y notificación cancelada.
- Seguridad: nota nunca aparece en logs/analytics/push, ciphertext en persistencia, fallo de anonimización bloquea LLM, evento auditoría no incluye cuerpo clínico.
- Copiloto: score 0–100, schema inválido, evidencia no presente, salida vacía, `needs_review`, timeout/retry limitado, ningún diagnóstico o especialista recomendado.
- Web y móvil: loading/empty/error/offline, pantalla pequeña, accesibilidad, almacenamiento de token esperado y permiso push/micrófono denegado. No se guardan notas en caché offline.
- Integración: clientes web/móvil generan requests compatibles con el mismo OpenAPI, errores y autenticación; no asumir paridad visual idéntica.

Usar fixtures sintéticos, mock del LLM/email/push y DB aislada. Incluir comandos para ejecutar y limpiar. Reportar cobertura relevante y casos que necesitan dispositivo real; no afirmar que E2E Android/iOS pasó si solo se ejecutó test unitario.