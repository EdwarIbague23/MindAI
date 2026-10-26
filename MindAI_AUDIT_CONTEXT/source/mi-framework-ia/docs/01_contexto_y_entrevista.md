# Contexto y Entrevista Simulada – MindFlow AI

**Origen:** Anexo del documento *Batería Maestra de Prompts* (PDF, páginas 43‑47).  
**Bloque:** Inicio / Fundación.

## 1. Entrevista simulada de levantamiento de requerimientos

**Analista:**  
¿Cómo debe gestionarse el consentimiento informado antes de iniciar cualquier proceso terapéutico dentro de la plataforma?  
**Psicólogo:**  
El consentimiento informado debe presentarse de forma clara antes del primer contacto, explicando el manejo de datos y el alcance del servicio (no sustituye atención de urgencias). Debe quedar registrado con fecha y versión aceptada; si no se puede agendar la primera cita.

**Analista:**  
¿Qué información debe recopilarse en la primera sesión y cómo se debe estructurar la historia clínica digital?  
**Psicólogo:**  
La historia clínica debe seguir un formato estructurado (motivo de consulta, antecedentes, evaluación de riesgo, plan terapéutico) y permitir notas de evolución por sesión, todas cifradas y visibles únicamente por el terapeuta tratante, salvo autorización explícita del paciente para compartir un resumen.

**Analista:**  
¿Cómo se debe manejar una situación de riesgo (ideación suicida o crisis) detectada durante una sesión o en un formulario de auto‑reporte?  
**Psicólogo:**  
Debe existir un protocolo de alerta temprana: si el paciente marca indicadores de riesgo alto en un cuestionario, o el terapeuta lo identifica en sesión, el sistema debe activar un flujo de emergencia con líneas de atención en crisis de Ibagué/Tolima y notificar al terapeuta tratante de forma inmediata.

**Analista:**  
¿Qué mecanismos de agenda y disponibilidad necesitan los profesionales?  
**Psicólogo:**  
Cada profesional debe poder configurar su disponibilidad semanal, bloquear horarios, definir duración de sesión (45‑60 minutos) y modalidad (presencial en Ibagué o virtual). El sistema debe evitar dobles reservas automáticamente.

**Analista:**  
¿Qué validaciones se requieren antes de habilitar a un profesional en la plataforma?  
**Psicólogo:**  
Se debe verificar el número de tarjeta profesional (registro ante la entidad de salud/colegio profesional correspondiente). Hasta que esa verificación sea aprobada por un administrador, el perfil no debe aparecer visible para los pacientes.

**Analista:**  
¿Cómo se garantiza la confidencialidad y el cumplimiento normativo colombiano de protección de datos?  
**Psicólogo:**  
Debe cumplirse la Ley 1581 de 2012 y el Decreto 1377 de 2013 sobre protección de datos personales, obteniendo autorización explícita para el tratamiento de datos sensibles de salud, con opción de que el paciente solicite eliminación o portabilidad de su información (derecho de habeas data).

**Analista:**  
¿Qué sucede si un paciente cancela o no asiste a una cita?  
**Psicólogo:**  
Debe permitirse cancelar con al menos 12 horas de anticipación sin penalización. Una inasistencia sin aviso debe quedar registrada en el historial. *[SUPUESTO: la política exacta de cobro por inasistencia no fue provista y se marca como configurable por cambio de analiz]*.

**Analista:**  
¿Se requiere videollamada integrada o se puede usar un servicio externo?  
**Psicólogo:**  
Es preferible una videollamada integrada dentro de la misma plataforma, para no exponer al paciente a enlaces externos ni depender de herramientas que no garanticen cifrado de extremo a extremo. *[SUPUESTO: no se especificó]*.

**Analista:**  
¿Qué reportes o seguimiento necesita el paciente ver de su propio proceso?  
**Psicólogo:**  
El paciente debe poder ver una línea de tiempo de sus sesiones y las notas de evolución que el profesional decida compartir explícitamente, y opcionalmente escalas de seguimiento para visualizar su progreso a lo largo del tiempo.

**Analista:**  
¿Qué necesidades de accesibilidad y contexto local de Ibagué hay que considerar?  
**Psicólogo:**  
La aplicación debe funcionar bien con conexiones móviles limitadas en zonas periféricas de la ciudad, ofrecer opción de citas presenciales en consultorios locales, y un directorio de profesionales filtrable por zona o comuna.

**Analista:**  
¿Qué pasa con los pagos y la facturación de las sesiones?  
**Psicólogo:**  
Debe integrarse una pasarela de pago segura con medios locales colombianos, generar un soporte de la sesión, y permitir tarifas diferenciadas si aplica convenio institucional. *[SUPUESTO: el método de pago específico no fue confirmado; se asume PSE/tarjeta]*.

**Analista:**  
¿Qué controles de auditoría y trazabilidad se requieren sobre el acceso a las historias clínicas?  
**Psicólogo:**  
Todo acceso a una historia clínica debe quedar registrado quién, cuándo y qué se consultó o modificó mediante un log de auditoría inmutable, dado que es un requisito ético y legal en el manejo de información de salud mental.

---
*Este documento es el punto de partida para la estructuración de requisitos y historias de usuario del proyecto MindFlow AI.*