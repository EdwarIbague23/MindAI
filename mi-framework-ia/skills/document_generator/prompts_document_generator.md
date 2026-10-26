# Prompt de generación — Skill document_generator

**Responsabilidad:** skill de servidor en `skills/document_generator/`; consume solo resultados estructurados y autorizados. No es el componente visual de exportación de React.

Implementa una skill determinista que acepte `analysis_id`, scores 0–100, señales/evidencias ya aprobadas y preguntas guía. Valida schema, escaping, tamaño y formato antes de producir un artefacto PDF/Markdown. No recibe nota clínica cruda, PII, credenciales ni acceso general a la base de datos. No crea diagnóstico, conclusión clínica, tratamiento ni recomendación de especialista.

Devuelve bytes/metadatos del documento mediante el contrato aprobado; no expone rutas locales del servidor ni enlaces públicos. Si el artefacto persiste, cifrarlo y comprobar autorización antes de descargarlo; si no hay política de almacenamiento aprobada, generar bajo demanda y no persistir. Añade manifest de la skill, pruebas con fixtures sintéticos, entradas malformadas y validación de disclaimer. No realices llamadas de red en la skill.