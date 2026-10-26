# Prompt 11 – AI Service Abstraction

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 19‑20).  
**Bloque:** C – Pipeline IA / LangChain.  
**Prioridad:** 3.  
**Área / Submódulo:** IA / LLM Provider Service.  
**Rol Senior:** Senior AI Platform Architect.

## Tarea específica y casos borde

Crear una abstracción `LLMProvider` con el método async `analyze(text) > AnalysisResponse`, e implementarla para el proveedor configurado mediante variables de entorno.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| texto anonimizado | `AnalysisResponse` (o `ProviderUnavailableError` en caso de fallo). |

### Restricciones técnicas y de seguridad

- No enviar PII.
- No guardar prompts completos en logs.
- Retry con backoff controlado.
- Rate limit.
- El proveedor debe ser sustituible sin modificar `AnalysisService`.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior AI Platform Architect.

Context:
AI / LLM Provider Service. Create an LLMProvider abstraction with the async analyze(text) > AnalysisResponse method, and implement it for the provider configured via environment variables.

Task:
Create an LLMProvider abstraction with the async analyze(text) > AnalysisResponse method, and implement it for the provider configured via environment variables.

Format:

Constraints:
- Timeout; retry with controlled backoff; rate limiting; do not send PII; do not store full prompts in logs; the provider must be swappable without modifying AnalysisService.
```
---
*Abstracción sobre el proveedor LLM para permitir cambio de proveedor sin reescribir el servicio.*