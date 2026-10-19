# Prompts 08, 09 y 10 – Análisis Emocional y Validación JSON

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 16‑19).  
**Bloque:** C – Pipeline IA / LangChain.  
**Prioridad:** 2 (todos).  
**Área / Submódulo:** IA / Análisis Emocional / Output Parser / LLM Provider.  
**Rol Senior:** Senior Prompt Engineer / Senior Python/LLM Engineer / Senior AI QA Engineer.

---

## Prompt 08 – Contrato de Análisis Emocional

### Tarea específica y casos borde

Crear un system prompt para analizar texto anonimizado y extraer emociones, intensidad, evidencia textual, distorsiones cognitivas, evidencia y preguntas guía. El sistema **no debe diagnosticar**.

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| Texto anonimizado | JSON con `emotions: [{name, score}]`, `cognitive_distortions: [{type, evidence}]`, `guiding_questions: [...]`, `evidence: "..."`, o lista vacía si no hay suficiente evidencia. |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| “Si fallo esta entrevista, nunca conseguiré trabajo.” | `{"distortions":[{"type":"catastrofización"}],"evidence":"frase sobre fracaso", "guiding_questions":["¿Qué estrategia ha funcionado antes?"], "emotions":[]}` |

### Restricciones técnicas y de seguridad

- No diagnóstico clínico ni prescripción.
- No afirmar causalidad clínica.
- Distinguir evidencia textual de inferencia.
- Retornar lista vacía si no hay suficiente evidencia.
- No inventar quotes.
- JSON de salida es obligatorio.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior Prompt Engineer specialized in Spanish and semantic classification.

Context:
IA / Structured Output. Create a system prompt to analyze anonymized text and extract emotions, intensity, textual evidence, cognitive distortions, evidence, and guiding questions. The system must NOT diagnose.

Task:
Design a system prompt to analyze anonymized text and extract emotions, intensity, textual evidence, cognitive distortions, evidence, and guiding questions. The system must NOT diagnose. Format: JSON output is mandatory.

Constraints:
- No diagnosis; no prescription; do not assert clinical causality; distinguish textual evidence from inference; return an empty list if there isn't enough evidence; do not invent quotes; JSON output is mandatory.
```
---

## Prompt 09 – Few‑Shot Prompting

### Tarea específica y casos borde

Crear un conjunto de ejemplos few‑shot para emociones (ansiedad/preocupación, tristeza, ira, miedo, frustración, alegría, culpa, vergüenza) y distorsiones cognitivas (pensamiento dicotómico, catastrofización, generalización, lectura de mente).

### Contexto

IA / Few‑Shot Examples. Create a set of few‑shot examples for emotions and cognitive distortions.

### Tarea

Crear un conjunto de ejemplos few‑shot para emociones (ansiedad/preocupación, tristeza, ira, miedo, frustración, alegría, culpa, vergüenza) y distorsiones cognitivas (pensamiento dicotómico, catastrofización, generalización, lectura de mente).

### Formato

- Ejemplos en español; cortos y sin información identificable.
- No incluir diagnósticos.
- Evitar inducir al modelo a confirmar patologías.

### Restricciones técnicas y de seguridad

- Ejemplos en español.
- Cortos y sin información identificable.
- No incluir diagnósticos.
- Evitar inducir al modelo a confirmar patologías.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior Prompt Engineer specialized in Spanish and semantic classification.

Context:
IA / Few‑Shot Examples. Create a set of few‑shot examples for emotions (anxiety/worry, sadness, anger, fear, frustration, joy, guilt, shame) and cognitive distortions (dichotomous thinking, catastrophizing, overgeneralization, mind reading).

Task:
Create a set of few‑shot examples for emotions and cognitive distortions.

Format:
- Spanish examples; short and free of identifying information; do not include diagnoses; avoid leading the model to confirm pathologies.

Constraints:
- Spanish examples.
- Short and without identifying information.
- No diagnoses.
- Avoid leading the model to confirm pathologies.
```
---

## Prompt 10 – Parser y Validador JSON del LLM

### Tarea específica y casos borde

Implementar un parser que reciba respuestas del LLM y las convierta al schema Pydantic correspondiente, manejando JSON inválido, Markdown, campos faltantes, tipos incorrectos, arrays vacíos y contenido inesperado.

### Contexto

IA / Output Parser. Implement a parser that receives LLM responses and converts them into the corresponding Pydantic schema, handling invalid JSON, Markdown, missing fields, incorrect types, empty arrays, and unexpected content.

### Tarea

Implementar un parser que reciba respuestas del LLM y las convierta al schema Pydantic correspondiente, manejando JSON inválido, Markdown, campos faltantes, tipos incorrectos, arrays vacíos y contenido inesperado.

### Formato

```
```json
```
AnálisisResponse(...) validado con Pydantic.
```

### Restricciones técnicas y de seguridad

- Validación Pydantic.
- Limitar reintentos.
- Nunca ejecutar contenido recibido del modelo.
- Nunca usar `eval()`.
- Registrar únicamente metadata técnica.
- Timeout obligatorio.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior Python/LLM Engineer specialized in fault‑tolerant systems.

Context:
IA / Output Parser. Implement a parser that receives LLM responses and converts them into the corresponding Pydantic schema, handling invalid JSON, Markdown, missing fields, incorrect types, empty arrays, and unexpected content.

Task:
Implement a parser that receives LLM responses and converts them into the corresponding Pydantic schema, handling invalid JSON, Markdown, missing fields, incorrect types, empty arrays, and unexpected content.

Format:
```
```
Examples of the expected format and level:
- 
```
Constraints:
- Pydantic validation; limit retries; never execute content received from the model; never use eval(); log only technical metadata; timeout is mandatory.
```
---
*Parser robusto para garantizar Schemas estructurados del LLM.*