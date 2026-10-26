# Prompt de generación — Pipeline obligatorio de PII

**Ubicación y propietario:** `core/security/`. Es middleware transversal obligatorio, no una skill invocable u omitible por un agente. Ver RF/RNF, arquitectura y `docs/AI_CODEGEN_PLAYBOOK.md`.

## Prompt

Implementa componentes pequeños y testeables para detectar y anonimizar nombres, teléfonos, correos, documentos, direcciones, identificadores de historia clínica, fechas identificables y URLs en texto español. Usa reglas deterministas para patrones y un detector NER en español solo como complemento; configura modelos/dependencias explícitamente y permite sustituirlos.

Contrato: recibir texto y devolver texto anonimizado más metadata no identificable (tipos/cantidad de entidades, estado y versión de política). No devolver ni persistir el mapa de reemplazo ni el texto original salvo que exista una decisión aprobada de reidentificación segura. Reemplazar por marcadores estables dentro de una solicitud (`[PERSONA_1]`, `[TELEFONO_1]`) y evitar que la anonimización fabrique contenido clínico.

Restricciones:
- Se ejecuta antes del LLM y no puede omitirse por configuración de agente.
- Nunca imprimir texto original, spans, valores detectados o nota en excepciones/logs/telemetría.
- Fallar cerrado: si el pipeline no puede asegurar su salida, no enviar la nota al proveedor LLM.
- No prometer detección perfecta; devolver metadata `needs_review` si hay ambigüedad y documentar falsos positivos/negativos.
- Probar español colombiano con datos sintéticos, múltiples entidades, texto vacío, Unicode, formatos maliciosos y regresión. Los fixtures nunca contendrán datos reales.

Ejemplo sintético: `Ana Pérez llamó al 3001234567` -> `[PERSONA_1] llamó al [TELEFONO_1]`; no conservar el original en output ni en logs. La prueba debe verificar ausencia literal de los valores de entrada.