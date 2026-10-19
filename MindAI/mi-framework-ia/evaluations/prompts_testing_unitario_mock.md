# Prompts 21 y 22 – Testing, Fixtures y Mock LLM

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 32‑34).  
**Bloque:** F – Testing & DevOps.  
**Prioridad:** 4 (todos).  
**Área / Submódulo:** Testing / Backend Unit & Integration Tests / Testing / AI Mocking.  
**Rol Senior:** Senior QA Automation Engineer / Senior AI QA Engineer.

---

## Prompt 21 – PyTest + Fixtures

### Tarea específica y casos borde

Crear fixtures de: base de datos de prueba, usuario de prueba, cliente autenticado, nota anonimizada de ejemplo, análisis de ejemplo y mock del LLM. Probar auth, upload, PII, cifrado, análisis, reportes y permisos.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `def test_upload_note(authenticated_client): ...` | `response.status_code == 200` |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| `"Juan juan@gmail.com"` | `decrypt(encrypt(text)) == text` |

### Restricciones técnicas y de seguridad

- No utilizar API real durante tests.
- No utilizar datos clínicos reales.
- Tests reproducibles.
- Separar unit/integration.
- Medir cobertura.
- Probar casos negativos.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior QA Automation Engineer specialized in PyTest, FastAPI, and API testing.

Context:
Testing / Backend Unit & Integration Tests. Create fixtures for: test database, test user, authenticated client, sample anonymized note, sample analysis, and LLM mock. Test auth, upload, PII, encryption, analysis, reports, and permissions.

Task:
Create fixtures for: test database, test user, authenticated client, sample anonymized note, sample analysis, and LLM mock. Test auth, upload, PII, encryption, analysis, reports, and permissions.

Format:

Examples of the expected format and level:
"Juan juan@gmail.com"
decrypt(encrypt(text))
== text

Constraints:
- Do not use the real API during tests; do not use real clinical data; reproducible tests; separate unit/integration tests; measure coverage; test negative cases.
```
---

## Prompt 22 – Mock del Proveedor LLM

### Tarea específica y casos borde

Crear `MockLLMProvider` simulando: éxito, timeout, JSON inválido, error del proveedor, respuesta vacía y respuesta malformada.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `provider.analyze(text)` | `AnalysisResponse` (caso exitoso) · `LLMTimeoutError` (timeout) · `StructuredOutputError` (JSON corrupto) |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| Caso exitoso | `AnalysisResponse` con datos estructurados. |
| JSON corrupto | `StructuredOutputError` (no se acepta contenido corrupto silenciosamente). |

### Restricciones técnicas y de seguridad

- Nunca ejecutar llamadas reales al proveedor durante CI.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior AI QA Engineer.

Context:
Testing / AI Mocking. Create MockLLMProvider simulating: success, timeout, invalid JSON, provider error, empty response, and malformed response.

Task:
Create MockLLMProvider simulating: success, timeout, invalid JSON, provider error, empty response, and malformed response.

Format:

Examples of the expected format and level:
StructuredOutputError (corrupted JSON)

Constraints:
- Never make real calls to the provider during CI.
```
---
*Fixtures y mocks para testing automatizado del backend y proveedor LLM.*