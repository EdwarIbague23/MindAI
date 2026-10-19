# Prompt 20 – Exportación PDF

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 29‑31).  
**Bloque:** E – Frontend Components.  
**Prioridad:** 4.  
**Área / Submódulo:** Frontend / Reports & PDF Export.  
**Rol Senior:** Senior Frontend Engineer especializado en generación de reportes profesionales y exportación PDF.

## Tarea específica y casos borde

Crear `ReportPreview` y `ExportPDFButton`. El documento debe incluir: encabezado MindFlow AI, fecha, ID del análisis, resumen y radar emocional, distorsiones identificadas con evidencia, preguntas guía y el aviso: "Este documento contiene análisis asistido por IA y no constituye diagnóstico médico".

### Contrato de entrada / salida

| Entrada | Salida esperada |
|---|---|
| `interface ReportData { analysisId, createdAt, ... }` | PDF descargable: `MindFlow_AI_Report_123.pdf` |

### Few‑shot examples

| Entrada de ejemplo | Salida esperada |
|---|---|
| Datos de análisis completos. | PDF generado con el formato especificado y el aviso de no diagnóstico. |

### Restricciones técnicas y de seguridad

- No incluir secretos.
- No incluir PII innecesaria (anónimizada o no).
- Escape HTML.
- Validar datos antes de generar.
- El PDF nunca presenta conclusiones de IA como diagnósticos.

### Prompt listo para ejecutar (Act as…)

```
Act as Senior Frontend Engineer specialized in professional report generation and PDF export.

Context:
Frontend / Reports & PDF Export. Create ReportPreview and ExportPDFButton.

Task:
Create ReportPreview and ExportPDFButton. The document must include: a MindFlow AI header, date, analysis ID, summary and emotional radar chart, identified distortions with evidence, guiding questions, and the notice: "This document contains AI-assisted analysis and does not constitute a medical diagnosis."

Format:

Examples of the expected format and level:
123.pdf

Constraints:
- Do not include secrets.
- Do not include unnecessary PII (anonymized or not).
- Escape HTML.
- Validate data before generating.
- The PDF never presents AI conclusions as diagnoses.
```
---
*Generación de reportes PDF con aviso de no diagnóstico para MindFlow AI.*