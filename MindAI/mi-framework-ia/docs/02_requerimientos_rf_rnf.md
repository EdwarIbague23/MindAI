# Requisitos Funcionales y No Funcionales – MindFlow AI

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 44‑45).  
**Bloque:** Fundación.

## Requisitos Funcionales (RF)

| ID | Tipo | Prioridad | Descripción técnica y medible |
|----|------|-----------|--------------------------------|
| RF‑01 | RF | Must | El sistema permite al paciente registrarse y autenticarse mediante correo electrónico y verificación en dos pasos (2FA) antes de acceder a cualquier funcionalidad clínica. |
| RF‑02 | RF | Must | El sistema permite al paciente buscar y filtrar profesionales disponibles por especialidad, modalidad (presencial/virtual) y zona de Ibagué. |
| RF‑03 | RF | Must | El sistema permite al paciente agendar una cita seleccionando fecha, hora y profesional disponible, confirmando la reserva en menos de 60 segundos. |
| RF‑04 | RF | Must | El sistema permite al paciente y al profesional cancelar o reprogramar una cita con un mínimo de 12 horas de anticipación. |
| RF‑05 | RF | Must | El sistema notifica al paciente y al profesional mediante correo y/o notificación push 24 horas y 1 hora antes de cada cita. |
| RF‑06 | RF | Must | El sistema permite al profesional registrar notas de evolución clínica estructuradas (motivo de consulta, observaciones, plan) al finalizar cada sesión. |
| RF‑07 | RF | Must | El sistema restringe el acceso a las notas clínicas de un paciente exclusivamente al profesional tratante asignado, salvo autorización explícita de transferencia de caso. |
| RF‑08 | RF | Must | El sistema permite al paciente visualizar el historial de sus citas pasadas. |
| RF‑09 | RF | Must | El sistema activa un protocolo de alerta ante indicadores de riesgo (ideación suicida/autolesión) detectados en un formulario de auto‑reporte, notificando de inmediato al profesional tratante y mostrando líneas de atención en crisis de Ibagué/Tolima. |
| RF‑10 | RF | Must | El sistema requiere la verificación de la tarjeta profesional (registro oficial) antes de publicar el perfil de un psicólogo en el directorio visible para pacientes. |
| RF‑11 | RF | Should | El sistema ofrece videollamada integrada y cifrada para sesiones virtuales, sin depender de enlaces de terceros. *[SUPUESTO: proveedor de videollamada no confirmado]* |
| RF‑12 | RF | Should | El sistema permite al paciente registrar y consultar la autorización de tratamiento de datos personales (consentimiento informado), con fecha y versión aceptada. |
| RF‑13 | RF | Should | El sistema permite al profesional configurar su disponibilidad semanal y bloquear franjas horarias específicas. |
| RF‑14 | RF | Should | El sistema genera un comprobante electrónico tras el pago de cada sesión mediante pasarela de pago local. *[SUPUESTO: método de pago específico no confirmado]* |
| RF‑15 | RF | Could | El sistema permite al paciente completar cuestionarios de seguimiento periódico (ej. escalas de ansiedad/depresión) y visualizar su evolución. |
| RF‑16 | RF | Could | El sistema permite calificar la sesión de forma anónima al finalizar, sin exponer comentarios directamente al profesional en tiempo real. |
| RF‑17 | RF | Won't (v1) | El sistema no incluirá diagnóstico automatizado ni recomendaciones clínicas generadas por IA en esta primera versión. |

## Requisitos No Funcionales (RNF)

| ID | Tipo | Prioridad | Descripción |
|----|------|-----------|-------------|
| RNF‑01 | RNF | Must | La plataforma cifra las historias clínicas y notas de sesión en reposo con AES‑256 y en tránsito con TLS 1.3. |
| RNF‑02 | RNF | Must | El sistema cumple con la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia sobre protección de datos personales y datos sensibles de salud. |
| RNF‑03 | RNF | Must | El sistema mantiene un registro de auditoría inmutable de todo acceso, modificación o consulta a una historia clínica (usuario, fecha/hora, acción realizada). |
| RNF‑04 | RNF | Must | La plataforma garantiza una disponibilidad mínima del 99.5 % mensual para los módulos de agenda y videollamada. |
| RNF‑05 | RNF | Must | El sistema responde las operaciones críticas (inicio de sesión, agendar cita) en menos de 3 segundos bajo condiciones normales de red móvil 4G. |
| RNF‑06 | RNF | Should | La arquitectura soporta escalabilidad horizontal para atender el crecimiento de usuarios en Ibagué sin degradar el rendimiento. *[SUPUESTO: volumen exacto no definido]* |
| RNF‑07 | RNF | Should | El sistema optimiza el consumo de datos móviles para funcionar adecuadamente en zonas de conectividad limitada en la periferia de Ibagué. |
| RNF‑08 | RNF | Should | La plataforma cumple con pautas de accesibilidad WCAG 2.1 Nivel AA en sus interfaces principales. |
| RNF‑09 | RNF | Must | Las contraseñas se almacenan utilizando un algoritmo de hashing con sal (ej. bcrypt/Argon2), nunca en texto plano. |
| RNF‑10 | RNF | Should | El sistema realiza copias de seguridad cifradas diarias de la base de datos clínica, con retención mínima de 30 días. *[SUPUESTO: política de retención no definida]* |

---
*Resumen de requisitos extraído del anexo del documento maestro.*