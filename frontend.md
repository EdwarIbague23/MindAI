# Frontend — MindFlow AI

Estado: **implementado** como SPA en `MindAI/mi-framework-ia/interfaces/frontend`.

## 1. Propósito

Interfaz para terapeutas: login, carga de notas clínicas, dashboard con radar emocional,
distorsiones cognitivas, resumen de triaje y descarga del reporte Markdown.

## 2. Arquitectura

- **SPA con Vite + React 18 + TypeScript**.
- **Server state con TanStack Query**; **estado de sesión con Zustand + persist**.
- **Rutas con React Router** (`/login`, `/dashboard`, redirección de `/`).
- **Ruta protegida** por presencia de token en `useAuthStore`.
- **Cliente HTTP único** (`src/services/api.ts`) con `baseURL: '/api'` y header
  `Authorization: Bearer <token>`; el proxy de Vite reenvía a `http://localhost:8000`.
- **UI**: Tailwind CSS, Recharts, Lucide, Sonner.

## 3. Stack (versiones reales)

| Tecnología | Versión | Uso |
|---|---|---|
| React / React DOM | ^18.3.1 | UI |
| React Router DOM | ^6.28.0 | Rutas |
| TanStack Query | ^5.59.20 | Server state |
| Zustand | ^5.0.1 | Auth persistida |
| Axios | ^1.7.7 | HTTP |
| Recharts | ^2.13.3 | Radar y barras |
| Tailwind CSS | ^3.4.14 | Estilos |
| Zod / React Hook Form | ^3.23.8 / ^7.53.2 | Validación (disponibles) |
| TypeScript | ^5.6.3 | Tipado |
| Vite | ^5.4.10 | Dev server y build |

## 4. Estructura

```text
src/
├── components/
│   └── NoteDropzone.tsx   # Carga/pegado de nota y envío
├── pages/
│   ├── Dashboard.tsx      # Análisis, gráficas, preguntas y reporte
│   └── LoginPage.tsx      # Login
├── services/
│   └── api.ts             # Axios + endpoints + descarga de reportes
├── store/
│   └── auth.ts            # Zustand persist (token, user)
├── types.ts               # Contratos TypeScript
├── main.tsx               # Router y providers
└── index.css              # Tailwind
```

## 5. Flujo de datos

1. `LoginPage` llama `login()` y guarda token/usuario en `useAuthStore`.
2. `Dashboard` crea una sesión si no existe y llama `analyzeNote()`.
3. El backend devuelve `AnalysisResult` con `report_url`.
4. El dashboard muestra emoción dominante, radar, distorsiones, riesgo y preguntas.
5. "Descargar reporte" llama `downloadReport(report_url)` con `responseType: 'blob'`,
   crea un object URL y fuerza la descarga (necesario para enviar el bearer token;
   un enlace directo no incluiría el header).

## 6. Scripts

```powershell
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc && vite build
npm run preview
```

`npm run build` pasa correctamente (941 módulos). El bundle principal ronda 659 kB
(197 kB gzip); se puede dividir con `manualChunks` si se requiere.

## 7. Contratos

Los tipos viven en `src/types.ts` y reflejan los DTOs del backend:
`User`, `Session`, `AnalysisResult`, `Report`, `EmotionScore`, `Distortion`, `Triage`.

`AnalysisResult.report_url` y `Report.report_url` son obligatorios.

## 8. Seguridad y UX

- El token se persiste en `localStorage` vía Zustand (`mindflow-auth`). Para un
  despliegue real se recomienda cookie `httpOnly` o almacenamiento en memoria.
- `ProtectedRoute` evita el acceso al dashboard sin token.
- Los errores de API se muestran con toasts de Sonner.
- El texto clínico no se registra en consola.

## 9. Limitaciones conocidas

- No hay tests de componentes ni E2E todavía.
- No hay refresco automático de token ni cierre de sesión por expiración.
- El dashboard crea sesión automáticamente; no existe selector de sesiones.
- No se usa `openapi-typescript`; los tipos se mantienen a mano.
