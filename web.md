# Web — MindFlow AI

Estado: **propuesta futura, no implementada**.

En la versión actual no existe un módulo `web` separado. La interfaz entregada es una
SPA en `MindAI/mi-framework-ia/interfaces/frontend` (ver `frontend.md`) que ya cubre el
dashboard del terapeuta y se sirve como build estático.

## Posible evolución

Si el proyecto necesita una cara pública (landing, documentación, registro institucional)
separada del dashboard, se evaluarán estas opciones antes de escribir código:

| Opción | Ventaja | Coste |
|---|---|---|
| Landing estática y dashboard SPA actual | Sin nueva infraestructura; reutiliza el build de Vite | Dos despliegues o rutas estáticas |
| Next.js (App Router) | SSR/SEO para páginas públicas y route groups | Nuevo runtime Node y duplicación parcial de UI |
| Extender la SPA actual | Un solo frontend | SEO limitado para contenido público |

## Requisitos si se aprueba

- Compartir contratos con el backend (idealmente generados desde OpenAPI).
- No duplicar lógica de autenticación: reutilizar el flujo JWT existente o migrar a
  cookies `httpOnly` de forma coordinada con `interfaces/api`.
- Mantener las mismas reglas de privacidad: no registrar texto clínico ni PII.
- Añadir tests (componentes y E2E) antes de considerarlo entregable.

No hay fechas ni responsable asignados. Cualquier afirmación de stack (Next.js, Zustand,
Server Actions, etc.) debe tratarse como decisión pendiente, no como implementación.
