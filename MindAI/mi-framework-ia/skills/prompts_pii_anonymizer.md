# Prompt 05 – Pipeline de Detección PII con Regex + SpaCy

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 12‑13).  
**Bloque:** B – Seguridad & PII.  
**Prioridad:** 1.  
**Área / Submódulo:** Seguridad / Anonimización PII.  
**Rol Senior:** Senior Security Engineer y NLP Engineer especializado en protección de datos y PLN en español.

## Tarea específica y casos borde

Crear `pii_detector.py` y `pii_anonymizer.py`, detectando como mínimo: nombres, teléfonos, correos, documentos, direcciones, números de historia clínica, fechas potencialmente identificables, URLs e identificadores explícitos, combinando Regex + SpaCy (`es_core_news_sm`).

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `"Juan Pérez llamó al 3105551234 y su correo es juan@gmail.com"` | `"María vive en Calle 10 #20 - 30."` (texto anonimizado). |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| `"María vive en Calle 10 #20 - 30."` | `"lives on 10 #20 - 30."` |

### Restricciones técnicas y de seguridad

- No imprimir PII detectada en logs.
- No enviar PII al LLM.
- Evitar falsos positivos excesivos.
- Permitir pruebas unitarias.
- Diseño reemplazable (otro NER a futuro).
- La anonimización se ejecuta antes del módulo de IA.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior Security Engineer and NLP Engineer specialized in data protection and Spanish
language NLP.

Context:
Security / PII Anonymization. Create pii_detector.py and pii_anonymizer.py, detecting at minimum: names, phone numbers, emails, ID documents, addresses, medical record numbers, potentially identifying dates, URLs, and explicit identifiers, combining Regex + SpaCy (es_core_news_sm).

Task:
Create pii_detector.py and pii_anonymizer.py, detecting at minimum: names, phone numbers, emails, ID documents, addresses, medical record numbers, potentially identifying dates, URLs, and explicit identifiers, combining Regex + SpaCy (es_core_news_sm).

Format:
3105551234 and his email is juan@gmail.com" called and his email is " + metadata: {"anonymized_text":"...","entities_detected": 3}

Examples of the expected format and level:
"María lives on Calle 10 #20 - 30 lives on ."

Constraints:
- Do not print detected PII to logs; do not send PII to the LLM; avoid excessive false positives; allow unit testing; keep the design replaceable (a different NER engine in the future); anonymization runs before the AI module.
```
---
*Capa de anonimización de datos personales antes del procesamiento por IA.*