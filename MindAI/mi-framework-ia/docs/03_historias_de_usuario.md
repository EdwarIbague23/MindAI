# Historias de Usuario y Criterios de Aceptación (BDD) – MindFlow AI

**Origen:** Documento *Batería Maestra de Prompts* (PDF, páginas 46‑47).  
**Bloque:** Fundación.

## HU‑01: Registro y autenticación segura

**Como** paciente nuevo,  
**quiero** registrarme y autenticarme de forma segura para poder acceder a los servicios de la plataforma con confianza en la protección de mis datos.

**Criterios de aceptación:**
- Dado que un usuario nuevo completa el formulario de registro con datos válidos, cuando envía la solicitud, entonces el sistema crea la cuenta y envía un código de verificación en dos pasos (2FA) al correo o teléfono registrado.
- Dado que un usuario intenta iniciar sesión, cuando ingresa credenciales incorrectas tres veces consecutivas, entonces el sistema bloquea temporalmente el intento de acceso durante 15 minutos y notifica al usuario por correo.

## HU‑02: Búsqueda y filtrado de profesionales

**Como** paciente,  
**quiero** buscar y filtrar profesionales por especialidad y ubicación en Ibagué para encontrar al terapeuta que mejor se ajuste a mis necesidades.

**Criterios de aceptación:**
- Dado que el paciente accede al directorio de profesionales, cuando aplica un filtro de especialidad y zona de la ciudad, entonces el sistema muestra únicamente los perfiles verificados que cumplen ambos criterios.
- Dado que no existen profesionales disponibles con los filtros seleccionados, cuando se ejecuta la búsqueda, entonces el sistema informa la ausencia de resultados y sugiere ampliar los criterios de búsqueda.

## HU‑03: Agendamiento de cita

**Como** paciente,  
**quiero** agendar una cita con un profesional disponible para iniciar mi proceso terapéutico sin fricciones.

**Criterios de aceptación:**
- Dado que el paciente seleccionó un profesional y un horario disponible, cuando confirma la reserva, entonces el sistema bloquea ese horario para otros pacientes y envía confirmación por correo o notificación push en menos de 60 segundos.
- Dado que dos pacientes intentan reservar el mismo horario simultáneamente, cuando el sistema procesa ambas solicitudes, entonces solo la primera transacción confirmada se acepta y la segunda recibe un mensaje de horario no disponible.

## HU‑04: Registro de notas de evolución clínica (profesional)

**Como** profesional tratante,  
**quiero** registrar notas de evolución clínica cifradas después de cada sesión para mantener un historial clínico seguro y auditable.

**Criterios de aceptación:**
- Dado que el profesional finaliza una sesión, cuando registra la nota de evolución y la guarda, entonces el sistema cifra el contenido antes de almacenarlo y queda visible únicamente para el profesional tratante.
- Dado que el profesional intenta acceder a la nota clínica de un paciente que no es de su caso, cuando realiza la solicitud, entonces el sistema deniega el acceso y registra el intento en el log de auditoría.

## HU‑05: Historial de sesiones para el paciente

**Como** paciente,  
**quiero** visualizar mi historial de sesiones y notas de evolución compartidas para llevar un seguimiento activo de mi proceso terapéutico.

**Criterios de aceptación:**
- Dado que el paciente accede a su perfil, el sistema despliega la línea de tiempo de sus citas pasadas con los reportes de evolución autorizados por el profesional.

## HU‑06: Alertas de riesgo en auto‑reporte

**Como** paciente,  
**quiero** recibir una alerta inmediata con líneas de ayuda en caso de detectarse una situación de riesgo, para sentirme acompañado en momentos de crisis.

**Criterios de aceptación:**
- Dado que el paciente responde un cuestionario de auto‑reporte con indicadores de riesgo alto, cuando envía las respuestas, entonces el sistema despliega de inmediato un mensaje con líneas de atención en crisis de Ibagué/Tolima y notifica al profesional tratante en tiempo real.
- Dado que se activó una alerta de riesgo, cuando el profesional revisa la notificación, entonces el sistema le permite contactar al paciente directamente desde la plataforma, registrando el tiempo de reacción.

## HU‑07: Verificación de tarjeta profesional (administrador)

**Como** administrador de la plataforma,  
**quiero** verificar la tarjeta profesional de cada psicólogo antes de publicarlo en el directorio, para garantizar la idoneidad y seguridad del servicio ofrecido a los pacientes.

**Criterios de aceptación:**
- Dado que un profesional completa su registro y carga su tarjeta profesional, cuando el administrador revisa la documentación, entonces el sistema permite aprobar o rechazar la publicación del perfil, notificando el resultado al profesional.
- Dado que un profesional no ha sido verificado, cuando un paciente busca en el directorio, entonces su perfil no aparece visible en los resultados de búsqueda.

## HU‑08: Configuración de disponibilidad semanal (profesional)

**Como** profesional,  
**quiero** configurar mi disponibilidad semanal y bloquear horarios para gestionar mi agenda de manera eficiente.

**Criterios de aceptación:**
- Dado que el profesional define sus horarios disponibles para la semana, cuando guarda la configuración, entonces el sistema actualiza el calendario visible para los pacientes en tiempo real.
- Dado que el profesional bloquea una franja horaria ya reservada por un paciente, cuando intenta guardar el bloqueo, entonces el sistema le advierte del conflicto y no permite el bloqueo sin antes reprogramar o cancelar la cita existente.

---
*Historias de usuario y criterios de aceptación extraídos del anexo del documento maestro. Formato BDD (Given‑When‑Then) no específicamente marcado, pero la lógica está expresada en español claro.*