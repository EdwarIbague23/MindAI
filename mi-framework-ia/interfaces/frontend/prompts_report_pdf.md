# Prompt de generación — Vista y exportación de reportes

**Responsabilidad:** UI React web en `interfaces/frontend/`. El generador de servidor, si se requiere, vive en `skills/document_generator/`.

Crear `ReportPreview` y `ExportPDFButton` usando exclusivamente el DTO OpenAPI autorizado del análisis. Mostrar fecha, ID opaco, scores 0–100, señales con evidencia permitida, preguntas guía y aviso: “Análisis asistido por IA; no constituye diagnóstico y debe ser revisado por el profesional”. No presentar conclusiones como hechos clínicos.

La acción de exportación requiere clic explícito y autorización vigente. No guardar nota, PDF, token ni contenido clínico en `localStorage`, IndexedDB, logs o analytics. Escapar/validar contenido, manejar error/descarga cancelada, accesibilidad de lector de pantalla y diseño responsive. Usar fixtures sintéticos y probar datos vacíos, errores y texto hostil. No incluir funciones fuera del contrato ni crear una segunda lógica de análisis en el navegador.