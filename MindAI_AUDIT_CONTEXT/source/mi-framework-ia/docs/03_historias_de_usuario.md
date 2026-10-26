# Historias de Usuario y Criterios de Aceptación — MindFlow AI V1

## Convenciones

- Roles del producto: paciente, profesional/terapeuta y administrador. Los dos clientes (web React y móvil React Native) usan la misma API FastAPI.
- Cada criterio debe probarse con datos sintéticos. Una función no se considera entregada por aparecer en un prototipo o prompt.
- El copiloto es solo para profesionales autorizados. Señales y preguntas guía no son diagnóstico ni recomendación de tratamiento; el profesional revisa antes de usarlas.
- Los scores de emoción y confianza se expresan en escala 0–100 en API, persistencia y UI.

| ID | Flujo principal | Trazabilidad |
|---|---|---|
| US-001 | Registro, autenticación y consentimiento | RF-01, RF-12, RNF-02, RNF-09 |
| US-002 | Directorio y profesional verificado | RF-02, RF-10 |
| US-003 | Disponibilidad y reserva de cita | RF-03, RF-13, RNF-05 |
| US-004 | Cancelación, reprogramación e historial | RF-04, RF-08 |
| US-005 | Notificaciones de cita | RF-05 |
| US-006 | Notas clínicas y permisos | RF-06, RF-07, RNF-01, RNF-03 |
| US-007 | Autorreporte de riesgo y escalamiento humano | RF-09 |
| US-008 | Análisis asistido por IA para el terapeuta | Alcance MindFlow, RF-17, RNF-08 |
| US-009 | Uso móvil por paciente y profesional | RNF-05, RNF-07, RNF-08 |

## US-001: Registro, autenticación y consentimiento

**Como** paciente, **quiero** crear una cuenta, verificar mi identidad y revisar el consentimiento informado, **para** usar la plataforma sabiendo cómo se tratarán mis datos.

- El registro valida correo único y contraseña; los errores no revelan si una cuenta ajena existe.
- El acceso clínico requiere segundo factor. El consentimiento aceptado registra usuario, fecha/hora, versión y texto/hash de la versión; sin aceptación no se crea una cita ni se captura información clínica.
- Paciente, terapeuta y administrador tienen roles distintos; un cliente no puede elevar su rol ni consultar datos de otro usuario.
- Web y móvil llaman al mismo endpoint de autenticación. La sesión móvil usa almacenamiento seguro del SO; la web no guarda contraseñas ni tokens en `localStorage`.

## US-002: Directorio y profesional verificado

**Como** paciente, **quiero** buscar profesionales por especialidad, modalidad y zona, **para** elegir con quién solicitar una cita.

- Solo aparecen perfiles con verificación profesional aprobada por un administrador.
- Se puede filtrar por especialidad, modalidad presencial/virtual y zona de Ibagué; estado vacío y error de red tienen mensajes recuperables.
- El directorio muestra información profesional aprobada, nunca notas clínicas ni datos privados de otros pacientes.
- El MVP no recomienda un especialista usando resultados de IA; la selección la hace el paciente.

## US-003: Disponibilidad y reserva de cita

**Como** paciente, **quiero** ver horarios disponibles y reservar una cita, **para** solicitar atención con un profesional verificado.

- La reserva exige consentimiento vigente y muestra profesional, modalidad, fecha, hora y zona horaria `America/Bogota` antes de confirmar.
- Dos solicitudes concurrentes para el mismo horario no pueden confirmar ambas; la API responde conflicto y ofrece horarios vigentes.
- El flujo presenta confirmación con identificador de cita y estado; la ruta feliz cumple la meta de reserva menor a 60 segundos.
- Web y móvil usan la misma regla de disponibilidad; ocultar un horario en UI no sustituye la validación transaccional del servidor.

## US-004: Cancelación, reprogramación e historial

**Como** paciente o profesional participante, **quiero** cancelar o reprogramar una cita dentro de las reglas permitidas y consultar las citas pasadas, **para** gestionar mi agenda.

- Solo participantes autorizados pueden ver o modificar la cita.
- Cancelación/reprogramación respeta el mínimo de 12 horas; fuera de plazo el servidor rechaza la operación y explica la política.
- Cambiar la cita libera el horario anterior y reserva el nuevo de forma atómica.
- El paciente ve historial de sus citas; el terapeuta ve solo las citas de su agenda. Web y móvil muestran estados `scheduled`, `cancelled`, `completed` y el estado definido por dominio.

## US-005: Notificaciones de cita

**Como** paciente o profesional, **quiero** recibir recordatorios antes de una cita y avisos de cambios, **para** no perder información de agenda.

- Se programan recordatorios 24 horas y 1 hora antes, según zona horaria del sistema; una cita cancelada no genera recordatorios posteriores.
- Cada envío registra estado, fecha y canal sin incluir datos clínicos en el mensaje ni en logs.
- El canal push requiere token registrado con consentimiento; correo es el canal de fallback aprobado. Fallos y reintentos son observables y no duplican avisos.
- No afirmar entrega inmediata de una alerta crítica sin confirmación de recepción y responsable humano definido.

## US-006: Nota clínica y autorización

**Como** terapeuta tratante, **quiero** crear notas estructuradas al finalizar una sesión y consultar las notas de mis pacientes asignados, **para** documentar la evolución de forma protegida.

- Campos mínimos de nota: motivo, observaciones y plan; la API valida tamaños y campos requeridos.
- Antes de persistir, el contenido clínico se cifra con cifrado autenticado. No aparece en logs, telemetría ni almacenamiento local no protegido.
- Acceso, lectura, creación y modificación se autorizan en servidor según relación paciente-terapeuta y quedan en auditoría con actor, recurso, acción y fecha, sin copiar el contenido de la nota al evento.
- Un terapeuta no asignado, otro paciente o un rol sin permiso recibe `403`/`404` sin filtrar existencia ni contenido.

## US-007: Autorreporte de riesgo y escalamiento humano

**Como** paciente, **quiero** indicar que estoy en riesgo y recibir opciones claras de ayuda, **para** solicitar apoyo sin depender de un diagnóstico automatizado.

- El flujo se inicia por respuestas explícitas del paciente; un LLM no declara que una persona tiene riesgo ni sustituye al profesional.
- La pantalla presenta líneas de crisis de Ibagué/Tolima previamente verificadas, indica contactar emergencias cuando aplique y explica límites del servicio.
- El profesional tratante recibe una alerta por el canal aprobado; se registra entrega/acuse y se escala a un mecanismo humano de respaldo ante fallo. No mostrar “ayuda notificada” si no existe acuse.
- No almacenar texto libre del autoreporte si no es necesario; restringir y auditar el acceso a datos de riesgo.

## US-008: Análisis asistido de nota

**Como** terapeuta autorizado, **quiero** enviar una nota para obtener señales emocionales/cognitivas con evidencia y preguntas guía, **para** apoyar mi revisión profesional.

- Solo el profesional autorizado puede iniciar y consultar el análisis de su paciente; datos identificables se eliminan/minimizan antes de llamar al proveedor LLM.
- La respuesta valida un schema fijo con score 0–100, evidencia presente en la nota anonimizada, estado de procesamiento y `needs_review=true`.
- El cliente muestra estados pendiente/completado/error y permite reintentar sin duplicar análisis; la latencia del LLM no se promete como respuesta síncrona menor a dos segundos.
- UI y reporte indican que es contenido asistido por IA, no diagnóstico, y requieren revisión humana. No recomienda especialistas, tratamientos o decisiones de urgencia.
- La nota y resultados se guardan cifrados según RNF-01; solo se devuelve al usuario autorizado.

## US-009: Flujos móviles y conectividad limitada

**Como** paciente o profesional, **quiero** realizar en móvil las tareas prioritarias de mi rol, **para** usar la plataforma desde Android/iOS.

- Paciente: registrarse/iniciar sesión, aceptar consentimiento, buscar profesionales, reservar/cancelar citas, consultar historial y ver notificaciones.
- Profesional: iniciar sesión, revisar agenda, crear una nota y consultar análisis de pacientes asignados.
- En pérdida de red se conserva solo estado no sensible del formulario cuando sea seguro; la app nunca afirma que una nota se guardó hasta recibir confirmación del servidor. V1 no ofrece notas clínicas offline.
- Tokens se guardan en Keystore/Keychain mediante el almacén seguro de la plataforma; enlaces profundos y notificaciones no exponen datos clínicos.
- Pruebas cubren pantallas pequeñas, accesibilidad, red lenta, timeout, sesión expirada y permisos denegados.

## Capacidades fuera de V1

- RF-11: videollamada; requiere proveedor, señalización, TURN, privacidad y estrategia de cifrado aprobados.
- RF-14: pagos y comprobantes; requiere pasarela local, conciliación y política de reembolso.
- RF-15: cuestionarios longitudinales e insights; requiere instrumentos y revisión profesional.
- RF-16: calificación anónima.
- Recomendación automatizada de especialistas, diagnóstico o prescripción: excluidos por RF-17.
- Memoria de conversación de tres interacciones y sesión de chat paciente-IA: no son historias de usuario V1 ni se implementan salvo aprobación de alcance y evaluación de privacidad.