# Prompt de generación — Aplicación móvil MindFlow V1

**Ubicación:** `interfaces/mobile/`
**Stack:** React Native + TypeScript, Android/iOS; consumir API REST/OpenAPI común de MindFlow.
**Depende de:** `docs/AI_CODEGEN_PLAYBOOK.md`, `docs/03_historias_de_usuario.md`, `docs/decision_tecnologica.md` y contrato `interfaces/api/` aprobado.

## Objetivo

Crear el cliente móvil por etapas, dentro de `interfaces/mobile/`, sin reemplazar la estructura del framework docente ni generar backend paralelo. Inspeccionar versiones/dependencias existentes y acordar el scaffold (Expo recomendado para V1) antes de instalar paquetes. Fijar versiones y lockfile en el scaffold; no asumir que la app ya existe.

## Flujos y roles V1

- **Paciente:** registro/login y segundo factor; aceptación/consulta de consentimiento; directorio filtrable; reservar/cancelar cita; historial; notificaciones de agenda y flujo de autorreporte de riesgo.
- **Terapeuta:** login; agenda y pacientes asignados; crear nota clínica estructurada; iniciar/ver estado del análisis; revisar resultados y reportes; gestionar disponibilidad si ese flujo queda en el contrato aprobado.
- **Administrador:** no incluir panel administrativo en móvil en V1 salvo requerimiento explícito. La verificación profesional puede quedar en web.

Implementar navegación protegida por rol, estados loading/empty/error/offline y expiración de sesión. Una app no obtiene permisos por conocer un `patient_id`: la API sigue aplicando autorización.

## Requisitos móviles de seguridad/privacidad

- Usar almacenamiento seguro del sistema operativo para tokens/refresh (Keychain/Keystore vía biblioteca aprobada); jamás `AsyncStorage` o preferencias comunes para secretos.
- Nunca guardar password, notas, respuestas de riesgo o resultados clínicos en almacenamiento local, logs, crash reports, notificaciones push ni analytics. V1 no ofrece consulta offline de contenido clínico.
- Solicitar permisos de notificación/micrófono solo justo antes del uso y explicar su propósito. No implementar captura/ transcripción de audio en V1 hasta aprobar proveedor, consentimiento, retención y anonimización.
- Ocultar datos sensibles en vista previa de notificaciones y en app switcher cuando la plataforma lo permita; proteger deep links y logout.
- Configurar base URL por ambiente sin secretos en bundle; TLS obligatorio en entornos no locales; manejar expiración, timeout y reintento sin duplicar reservas ni análisis.
- Diseñar consumo moderado de datos y accesibilidad WCAG 2.1 AA; no interpretar colores/scores como diagnóstico.

## Integración y validación

- Usar únicamente endpoints documentados de `interfaces/api/`; no incluir URL/credenciales de PostgreSQL, Redis o LLM.
- Reutilizar tipos generados desde OpenAPI cuando estén disponibles; no copiar interfaces manualmente si hay contrato generado.
- UI de análisis muestra score 0–100, evidencia, `needs_review` y aviso de revisión profesional. No presenta recomendaciones de especialista, tratamiento o diagnóstico.
- Pruebas de componentes y navegación cubren ambos roles, acceso denegado, sesión vencida, red lenta/desconectada, permiso denegado, reserva en conflicto y notificación sin contenido sensible.
- Añadir comandos reproducibles de start, typecheck, test y build Android/iOS; no declarar build móvil probado si no se ejecutó en el entorno.
- Mantener paridad de comportamiento con web donde la historia lo exige, sin forzar pantallas idénticas a distintos formatos.

Crear una fase a la vez, resumir cambios y ejecutar el check más estrecho. Si el contrato/API aún no existe, construir solo navegación con fixtures sintéticos claramente aislados; no inventar endpoints ni marcar la integración como terminada.