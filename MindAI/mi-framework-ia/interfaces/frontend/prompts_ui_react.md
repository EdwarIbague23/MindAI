# Prompts 17, 18 y 19 – Componentes Frontend React

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 27‑29).  
**Bloque:** E – Frontend Components.  
**Prioridad:** 3 (todos).  
**Área / Submódulo:** Frontend / Authentication UI / Note Ingestion / Dashboard IA.  
**Rol Senior:** Senior Frontend Engineer / Senior React UX Engineer / Senior Frontend Engineer + UX Designer.

---

## Prompt 17 – Login React

### Tarea específica y casos borde

Crear `LoginPage.tsx` con campos de email y password, validación, estado de carga, manejo de errores, autenticación y redirección al dashboard.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `<LoginPage />` con petición `{ "email": "...", "password": "..." }` | Mensaje genérico de error o redirección al dashboard. |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| Datos de login inválidos | Mensaje de error genérico (sin exponer detalles internos). |

### Restricciones técnicas y de seguridad

- TypeScript estricto.
- No guardar password en localStorage.
- Manejo seguro de tokens.
- No mostrar detalles internos del backend.
- Accesibilidad básica.
- Diseño responsive.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior Frontend Engineer specialized in React, TypeScript, TailwindCSS, and SaaS UX.

Context:
Frontend / Authentication UI. Create LoginPage.tsx with email and password fields, validation, loading state, error handling, authentication, and redirection to the dashboard.

Task:
Create LoginPage.tsx with email and password fields, validation, loading state, error handling, authentication, and redirection to the dashboard.

Format:

Constraints:
- Strict TypeScript; do not store the password in localStorage; secure token handling; do not expose internal backend details; basic accessibility; responsive design.
```
---

## Prompt 18 – Dropzone de Notas

### Tarea específica y casos borde

Crear el componente `NoteDropzone` que permita pegar texto, cargar archivo de texto (si el MVP lo requiere), visualizar caracteres, enviar, cancelar y mostrar progreso.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `<NoteDropzone onUpload={(noteId) => ...} />` | Nota subida; estado visual de progreso. |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| Área de drop con texto | `"noteId"` devuelto tras upload; mensaje si no puede procesarse. |

### Restricciones técnicas y de seguridad

- No mostrar PII procesada.
- No almacenar la nota en localStorage.
- Limitar tamaño de la nota.
- Mostrar claramente que la información será analizada mediante IA.
- Interfaz responsive.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior React UX Engineer specialized in clinical B2B interfaces.

Context:
Frontend / Note Ingestion. Create the NoteDropzone component that lets users paste text, upload a text file (if the MVP requires it), see the character count, submit, cancel, and view progress.

Task:
Create the NoteDropzone component that lets users paste text, upload a text file (if the MVP requires it), see the character count, submit, cancel, and view progress.

Format:

Examples of the expected format and level:
cannot be processed.

Constraints:
- Do not display processed PII; do not store the note in localStorage; limit the note size; clearly indicate that the information will be analyzed using AI; responsive interface.
```
---

## Prompt 19 – Dashboard de Análisis

### Tarea específica y casos borde

Crear el dashboard con `EmotionRadarChart`, `DistortionCard`, `GuidingQuestions` y `AnalysisStatus`. El radar representa: ansiedad, tristeza, ira, miedo, frustración, alegría, culpa.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `{ "emotions": [{"name":"sadness","score":42}, …] }` | `<EmotionRadarChart data={emotions} />` y tarjetas de distorsión por separado. |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| Datos de emociones | Radar con scores y tarjetas de distorsión. |

### Restricciones técnicas y de seguridad

- No usar colores para etiquetar diagnósticos.
- Evitar lenguaje como "el paciente tiene".
- Usar lenguaje como "se identificó una señal" / "el análisis sugiere" / "evidencia textual detectada".
- Mostrar el aviso: "Análisis generado por IA. Debe ser revisado por el profesional."
- Responsivo y accesible.
- No representar los scores como diagnóstico clínico.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior Frontend Engineer + UX Designer specialized in data dashboards built with React.

Context:
Frontend / AI Dashboard. Create the dashboard with EmotionRadarChart, DistortionCard, GuidingQuestions, and AnalysisStatus. The radar chart represents: anxiety, sadness, anger, fear, frustration, joy, guilt.

Task:
Create the dashboard with EmotionRadarChart, DistortionCard, GuidingQuestions, and AnalysisStatus. The radar chart represents: anxiety, sadness, anger, fear, frustration, joy, guilt.

Format:

78
},{"name":"sadness","score":42

Examples of the expected format and level:
Constraints:
- Do not use colors to label diagnoses; avoid language such as "the patient has"; use language such as "a signal was identified" / "the analysis suggests" / "textual evidence detected"; display the notice: "AI-generated analysis. Must be reviewed by the professional."; responsive and accessible; do not present the scores as a clinical diagnosis.
```
---
*Componentes de dashboard emocional y análisis para la interfaz terapeuta.*