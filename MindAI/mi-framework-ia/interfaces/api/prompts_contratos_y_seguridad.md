# Prompts 02 y 07 – Schemas Pydantic y Security Middleware

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 7‑8 y 14‑15).  
**Bloque:** D – Backend API REST.  
**Prioridad:** 1 (Prompt 02) / 2 (Prompt 07).  
**Área / Submódulo:** Backend / Schemas Pydantic / Backend / Security Middleware.  
**Rol Senior:** Senior Backend Engineer / Senior Backend Security Engineer.

---

## Prompt 02 – Schemas Pydantic

### Tarea específica y casos borde

Diseñar todos los contratos de datos de MindFlow AI antes de implementar los endpoints: User, Login, Token, NoteUpload, AnalysisRequest, Emotion, CognitiveDistortion, GuidingQuestion, AnalysisResponse, Report, ErrorResponse. Validar strings vacíos y contenido excesivamente grande, validar scores fuera de rango, campos obligatorios y tipos incorrectos, manejo de valores null.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `{ "note": "El paciente manifestó preocupación constante..." }` | `{ "analysis_id": "uuid", "emotions": [{"name":"ansiedad","score":78}], ... }` |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| `{"name":"ansiedad","score":78}` | Validación exitosa (score entre 0 y 100). |
| `{"name":"ansiedad","score":150}` | `ValidationError (score fuera de rango 0 100).` |

### Restricciones técnicas y de seguridad

- Scores entre 0 y 100.
- UUID para identificadores.
- No permitir campos arbitrarios.
- No aceptar HTML ejecutable.
- No almacenar contenido clínico en schemas de error.
- No devolver stack traces al cliente.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior Backend Engineer, an expert in FastAPI and Pydantic v2.

Context:
Backend / Schemas Pydantic. Design all of MindFlow AI's data contracts before implementing the endpoints: User, Login, Token, NoteUpload, AnalysisRequest, Emotion, CognitiveDistortion, GuidingQuestion, AnalysisResponse, Report, ErrorResponse.

Task:
Design all of MindFlow AI's data contracts before implementing the endpoints: User, Login, Token, NoteUpload, AnalysisRequest, Emotion, CognitiveDistortion, GuidingQuestion, AnalysisResponse, Report, ErrorResponse.

Consider:
- Validate empty strings and excessively large content; validate out‑of‑range scores; required fields and incorrect types; handling of null values.

Format:
78

Examples of the expected format and level:
{"name":"anxiety","score":78}
{"name":"anxiety","score":150}
0 100 ).

Constraints:
- Scores between 0 and 100; UUID for identifiers; do not allow arbitrary fields; do not accept executable HTML; do not store clinical content in error schemas; do not return stack traces to the client.
```
---

## Prompt 07 – Security Middleware

### Tarea específica y casos borde

Implementar headers de seguridad, CORS, request ID, logging estructurado seguro y manejo global de excepciones.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `POST /analyze` con header `X‑Request‑ID: abc123` | Response con `X‑Request‑ID: abc123` y en error: `{"error":"INTERNAL_ERROR","message":"No fue posible procesar la solicitud.","request_id":"abc123"}` |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| Credenciales incorrectas | `401 { "error": "…" }` |

### Restricciones técnicas y de seguridad

- Nunca devolver stack trace.
- Nunca devolver API key.
- Nunca devolver database URL.
- Nunca devolver prompt interno.
- Nunca devolver nota clínica ni PII.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior Backend Security Engineer specialized in FastAPI.

Context:
Security / Middleware. Implement security headers, CORS, request ID, secure structured logging, and global exception handling.

Task:
Implement security headers, CORS, request ID, secure structured logging, and global exception handling.

Format:

Examples of the expected format and level:
- Request
- ID: abc123
- 123
- Request
- ID: abc123 and on error: {"error":"INTERNAL_ERROR","message":"The request could not be processed.","request_id":"abc123"}

Constraints:
- Never return a stack trace; never return an API key; never return the database URL; never return the internal prompt; never return a clinical note or PII.
```
---
*Contratos de datos y middleware de seguridad para la API REST de MindFlow AI.*