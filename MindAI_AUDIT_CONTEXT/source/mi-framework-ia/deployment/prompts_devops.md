# Prompt de generación — Entorno y despliegue

**Responsabilidad:** `deployment/`; no pertenece a `config/`, que contiene configuración de runtime.

Inspecciona dependencias y comandos reales antes de escribir contenedores. Define desarrollo local para FastAPI, React web, PostgreSQL y Redis con healthchecks, volúmenes y red privada. La app React Native no es un servicio de runtime de Docker Compose: documenta su instalación/build Android/iOS y pruebas en jobs separados de CI (Expo/EAS solo si el equipo aprobó Expo). No inventes Dockerfiles o scripts ausentes como si existieran.

Requisitos: separar dev/prod; `.env.example` solo con nombres de variables y valores de ejemplo no secretos; secretos por secret manager/CI; usuario no-root; imágenes fijadas; escaneo de dependencias; CORS/orígenes por ambiente; DB no expuesta; backup cifrado y healthchecks; no logs de PII ni contenido clínico.

CI debe ejecutar checks backend/migraciones, web lint/typecheck/tests/build, pruebas móviles/typecheck/tests y construir la imagen API. No afirmar que Android/iOS está probado si no existe runner/dispositivo. Adjuntar comandos reproducibles, configuración de rollback y limitaciones; disponibilidad SLA/alertas clínicas requieren operación real y no se garantizan con Compose.