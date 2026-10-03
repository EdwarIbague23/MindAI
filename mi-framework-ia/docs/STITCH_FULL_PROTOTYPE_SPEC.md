# ESPECIFICACIÓN TOTAL DE PANTALLAS Y PROTOTIPADO (STITCH)

**Versión:** 1.0
**Estado:** Especificación de prototipo, no implementación ni contrato API aprobado.
**Stack objetivo:** web React + TypeScript y app Android/iOS React Native; ambas consumen la misma API FastAPI.
**Fuente de verdad:** `docs/02_requerimientos_rf_rnf.md`, `docs/03_historias_de_usuario.md`, `docs/01_contexto_y_entrevista.md`, `docs/architecture.md`, `docs/decision_tecnologica.md`, `docs/diagrama_erd_mindflow.mmd` y los modelos/migración existentes.
**Regla para Stitch:** usar solo datos sintéticos. No inventar endpoints, campos persistidos, teléfonos de crisis, precios, especialidades, políticas clínicas o estados no definidos. Las etiquetas **V1**, **PENDIENTE**, **POST-V1** y **PROHIBIDO** que siguen determinan qué puede aparecer como flujo listo y qué debe mostrarse como placeholder o quedar fuera del prototipo.

> **Advertencia de consistencia:** este documento separa el **modelo objetivo del ERD** de los **modelos Python/migración actuales**. No presentar los campos del ERD como si ya estuvieran implementados en el API. La tabla de discrepancias al final es un bloqueo para conectar el prototipo a datos reales.

> **Instrucción de entrega visual a Stitch:** producir frames separados y nombrados por rol (paciente, profesional, admin cuando aplique), además de desktop y mobile. No entregar una sola plantilla genérica con cambio de título. Incluir logo/wordmark y assets de lanzamiento como entregables visuales; el repositorio no contiene todavía archivos de marca (`svg/png/ico`), por lo que el logo propuesto debe identificarse como **concepto pendiente de aprobación**, no marca oficial.

> **Frame inicial obligatorio:** abrir el prototipo web en `WEB-AUTH-01 — Iniciar sesión` y el móvil en `MOB-AUTH-01 — Iniciar sesión`. No empezar en un dashboard. Incluir formulario visible (email/password), logo provisional, links de registro/recuperación y MFA como siguiente estado. Como todavía no hay API de autenticación, añadir un control separado “Solo demo — previsualizar rol” para entrar a los recorridos sintéticos de paciente, profesional y admin; nunca presentarlo como selector de permisos o autenticación real. Ver las especificaciones de plataforma `STITCH_WEB_PROTOTYPE_SPEC.md` y `STITCH_MOBILE_PROTOTYPE_SPEC.md`.

---

## 1. MAPPING GENERAL DE ROLES Y PANTALLAS

### Roles de producto

| Rol | Superficie principal | Navegación base web | Navegación base móvil | Permisos visibles |
|---|---|---|---|---|
| Visitante sin sesión | Entrada/autenticación | Página de acceso, registro paciente, solicitud profesional | Entrada, acceso, registro paciente | Solo información pública y perfiles verificados |
| Paciente (`patient`) | Directorio, citas, consentimiento y autorreporte | Barra superior + navegación lateral compacta; contenido central | Tabs: Inicio, Buscar, Citas, Perfil | Sus datos, consentimiento, citas y autorreportes propios; nunca notas clínicas ni análisis del terapeuta |
| Profesional (`therapist`) | Agenda, pacientes asignados, notas y análisis asistido | Sidebar: Inicio, Agenda, Pacientes, Análisis, Disponibilidad | Tabs: Inicio, Agenda, Pacientes, Perfil; herramientas de análisis desde el detalle | Solo pacientes/citas asignados; revisar análisis, no delegar decisiones clínicas a IA |
| Administrador (`admin`) | Verificación de tarjeta profesional y auditoría restringida | Consola web con sidebar administrativo | No se incluye app admin en V1 | Verificar profesionales y consultar metadata de auditoría según permisos aprobados |

### Shell, navegación e identidad: entregables obligatorios

Stitch debe crear **tres shells de navegación web distintos**. Comparten tokens visuales y componentes, pero no el dashboard, sidebar ni acciones. El rol se recibe de la sesión/autorización del servidor después del login; no existe selector de rol que cambie permisos.

| Shell | Web: pestañas/secciones persistentes | Mobile: navegación persistente | Logo/marca en shell |
|---|---|---|---|
| Paciente | Inicio, Buscar profesionales, Mis citas, Notificaciones, Perfil | Tab bar: Inicio, Buscar, Citas, Perfil. Notificaciones desde campana/perfil | Wordmark en header; icono simplificado en tab/header |
| Profesional | Inicio, Agenda, Pacientes, Análisis/Historial, Disponibilidad, Notificaciones, Perfil | Tab bar: Inicio, Agenda, Pacientes, Perfil; Análisis dentro del paciente/nota | Wordmark en header; badge “Profesional” textual, no diferenciador de autorización |
| Administrador | Verificaciones, Auditoría (si autorizado), Cuenta | Sin app admin V1 | Wordmark + “Administración” para evitar confusión de rol |
| Visitante | Inicio público, Ingresar, Crear cuenta paciente, Solicitud profesional, Privacidad | Sin tabs autenticados; botones apilados | Splash/wordmark, símbolo y favicon |

**Paquete de marca requerido en el prototipo:** `BRAND-01` splash/launch; wordmark MindFlow AI horizontal; símbolo/app icon cuadrado; favicon web; lockup para login; variante monocroma; área segura y tamaño mínimo; alt text. Usar marca provisional rotulada “concepto para aprobación”, sin inventar una identidad corporativa existente. En Stitch estas variantes son assets/frames explícitos y no solo texto escrito en una pantalla.

**Acceso por rol sin duplicar seguridad:** mostrar entradas contextuales “Acceso paciente”, “Acceso profesional” y, si se necesita demo, “Acceso administración” que comparten AUTH-01 visualmente. El contexto puede cambiar subtítulo/retorno; no manda `role` confiable al API. Tras autenticar, servidor devuelve/autoriza rol y el cliente redirige a PAT-01, PRO-01 o ADM-01; si el rol no coincide, se muestra 403.

### Inventario completo V1 para prototipo

| ID | Pantalla/flujo | Rol | Estado | Fuente |
|---|---|---|---|---|
| BRAND-01 | Splash y carga de identidad MindFlow | Todos | V1 visual | Identidad de prototipo; no tiene entidad backend |
| PUB-01 | Entrada pública y selección de acceso | Visitante | V1 derivado | RF-01 |
| AUTH-01 | Inicio de sesión | Todos | V1 | RF-01 / US-001 |
| AUTH-02 | Registro de paciente | Paciente | V1 | RF-01 / US-001 |
| AUTH-03 | Solicitud de cuenta profesional | Profesional | Pendiente de confirmar proceso | RF-10 |
| AUTH-04 | Verificación de segundo factor | Todos | V1 | RF-01 / US-001 |
| AUTH-05 | Consentimiento informado | Paciente | V1 y bloqueo previo a dato sensible | RF-12 / US-001 |
| AUTH-06 | Recuperación de cuenta | Todos | Pendiente: política/canal no especificados |
| AUTH-07 | Sesión expirada | Todos | V1 derivado | RNF-11/12 |
| AUTH-08 | Login contextual paciente/profesional/admin | Visitante | V1 visual; auth compartida, rol server-side | RF-01 / US-001 |
| ONB-PAT-01 | Primera entrada paciente y orientación de privacidad | Paciente | V1 derivado | RF-01/12 / US-001 |
| ONB-PRO-01 | Solicitud enviada / verificación pendiente | Profesional | V1 derivado | RF-10 / US-002 |
| ONB-PRO-02 | Cuenta profesional aprobada/rechazada | Profesional | V1 derivado; motivo de rechazo pendiente | RF-10 / US-002 |
| PAT-01 | Inicio del paciente | Paciente | V1 derivado | RF-03/05/08 |
| PAT-02 | Directorio de profesionales | Paciente | V1 | RF-02/10 / US-002 |
| PAT-03 | Filtros de directorio | Paciente | V1 | RF-02 / US-002 |
| PAT-04 | Perfil público de profesional | Paciente | V1 | RF-02/10 / US-002 |
| PAT-05 | Selección de disponibilidad | Paciente | V1 | RF-03 / US-003 |
| PAT-06 | Confirmación de reserva | Paciente | V1 | RF-03 / US-003 |
| PAT-07 | Reserva confirmada | Paciente | V1 | RF-03 / US-003 |
| PAT-08 | Citas próximas e historial | Paciente | V1 | RF-08 / US-004 |
| PAT-09 | Detalle de cita | Paciente | V1 | RF-03/04/05/08 |
| PAT-10 | Reprogramar cita | Paciente | V1 | RF-04 / US-004 |
| PAT-11 | Autorreporte de riesgo | Paciente | V1, contenido de cuestionario pendiente | RF-09 / US-007 |
| PAT-12 | Ayuda en crisis y estado de alerta | Paciente | V1, teléfonos oficiales pendientes | RF-09 / US-007 |
| PAT-13 | Centro de notificaciones | Paciente | V1 derivado | RF-05 / US-005 |
| PAT-14 | Consentimiento y privacidad | Paciente | V1 | RF-12 / US-001 |
| PAT-15 | Perfil y ajustes | Paciente | V1 derivado; preferencias no modeladas | RNF-12 |
| PRO-01 | Inicio profesional | Profesional | V1 derivado | RF-03/05/06/09/13/18 |
| PRO-02 | Agenda profesional | Profesional | V1 | RF-03/04/05/13 / US-003/004/005 |
| PRO-03 | Detalle de cita profesional | Profesional | V1 | RF-04/05/06/07 |
| PRO-04 | Pacientes asignados | Profesional | V1 derivado con autorización | RF-07 / US-006 |
| PRO-05 | Resumen del paciente asignado | Profesional | V1 derivado, limitado por permisos | RF-07 / US-006 |
| PRO-06 | Crear/editar nota clínica | Profesional | V1 | RF-06/07 / US-006 |
| PRO-07 | Revisar y guardar nota | Profesional | V1 | RF-06/07 / US-006 |
| PRO-08 | Solicitar análisis asistido | Profesional | V1 | RF-18 / US-008 |
| PRO-09 | Análisis en proceso / error | Profesional | V1 | RF-18 / US-008 |
| PRO-10 | Resultado de análisis | Profesional | V1 | RF-18 / US-008 |
| PRO-11 | Historial de análisis/notas | Profesional | V1 derivado, consulta autorizada | RF-06/07/18 |
| PRO-12 | Vista previa y exportación de reporte | Profesional | V1 derivado; API/formatos por aprobar | RF-18 |
| PRO-13 | Configurar disponibilidad | Profesional | V1 | RF-13 / US-003 |
| PRO-14 | Bandeja de alertas/notificaciones | Profesional | V1 | RF-05/09 / US-005/007 |
| PRO-15 | Ajustes profesionales | Profesional | V1 derivado; datos editables pendientes | RF-10/13 |
| PRO-16 | Detalle/acuse de alerta de riesgo | Profesional | V1; protocolo/endpoint pendiente | RF-09 / US-007 |
| ADM-01 | Cola de verificación profesional | Administrador | V1 | RF-10 / US-002 |
| ADM-02 | Revisar tarjeta/perfil profesional | Administrador | V1 | RF-10 / US-002 |
| ADM-03 | Aprobar/rechazar verificación | Administrador | V1 | RF-10 / US-002 |
| ADM-04 | Auditoría de accesos | Administrador autorizado | V1 derivado de RNF-03, permisos exactos pendientes | RNF-03 |
| ADM-05 | Consola técnica de framework | Operación interna, no rol de producto | Excluida del prototipo Stitch | `architecture.md`; no RF de producto |
| SYS-01 | Error 403/404/500 y mantenimiento | Todos | V1 transversal | Seguridad API |
| SYS-02 | Sin red, carga, vacío y reintento | Todos | V1 transversal | RNF-07/11/12 |

### Pantallas fuera de V1 que no deben simularse como funcionales

| ID futuro | Pantalla | Estado y dependencia |
|---|---|---|
| FUT-01 | Sala de videollamada y permisos audiovisuales | POST-V1; RF-11, proveedor/WebRTC/TURN/cifrado no seleccionados. No mostrar botones “Iniciar videollamada” activos en el preview V1. |
| FUT-02 | Checkout, pago y comprobante | POST-V1; RF-14, pasarela y política de reembolso no definidas. No crear precios ni medios de pago ficticios como decisiones del producto. |
| FUT-03 | Cuestionarios longitudinales y evolución | POST-V1; RF-15, instrumentos y modelo `emotion_profiles` sin aprobar. |
| FUT-04 | Calificación anónima de sesión | POST-V1; RF-16. |
| FUT-05 | Notas compartidas al paciente | PENDIENTE; la entrevista permite compartir resumen con autorización explícita, pero no hay entidad/endpoint ni regla detallada. Ocultar hasta aprobación. |
| FUT-06 | Consulta offline de notas/resultados | PROHIBIDO en V1 por RNF-12 y US-009. No guardar contenido clínico en caché/local storage. |
| FUT-07 | Recomendación IA de especialista/tratamiento | PROHIBIDO por RF-17. No debe aparecer ni como CTA sugerida. |
| FUT-08 | SSO / Microsoft/Google login | No especificado. No inventar proveedores ni pantalla; recuperación de cuenta también está pendiente. |
| FUT-09 | Chat de paciente con IA/terapia en vivo | Fuera de alcance; no se desprende de las historias V1. |

| ID de subflujo futuro | Pantalla | Rol | Estado |
|---|---|---|---|
| FUT-01A | Prechequeo de videollamada | Paciente y profesional | POST-V1 |
| FUT-01B | Sala de espera | Paciente y profesional | POST-V1 |
| FUT-01C | Llamada activa | Paciente y profesional | POST-V1 |
| FUT-01D | Reconexión/error de llamada | Paciente y profesional | POST-V1 |
| FUT-01E | Resumen de llamada | Paciente y profesional | POST-V1 |
| FUT-02A | Checkout y resumen de precio | Paciente | POST-V1 |
| FUT-02B | Pago en proceso | Paciente | POST-V1 |
| FUT-02C | Pago exitoso/comprobante | Paciente | POST-V1 |
| FUT-02D | Pago rechazado/cancelado | Paciente | POST-V1 |
| FUT-03A | Selección de cuestionario | Paciente/profesional autorizado | POST-V1 |
| FUT-03B | Completar cuestionario | Paciente | POST-V1 |
| FUT-03C | Resultado de cuestionario | Paciente/profesional autorizado | POST-V1 |
| FUT-03D | Evolución longitudinal | Paciente/profesional autorizado | POST-V1 |
| FUT-05A | Selección de resumen compartible | Profesional | Pendiente aprobación |
| FUT-05B | Ver resumen compartido | Paciente | Pendiente aprobación |

### Desglose de pantallas de fases futuras (no activar en el prototipo V1)

Se documentan para que no se confundan con requisitos olvidados. Cada flujo requiere aprobación de producto/seguridad y un contrato de API antes de convertirse en prototipo funcional.

#### FUT-01A - Prechequeo de videollamada (POST-V1)

- **Objetivo / Caso de Uso:** preparar audio/video para una cita virtual cuando se elija proveedor y se aprueben permisos.
- **Versión Desktop:** resumen de cita, estado de conexión/dispositivos y prueba previa; no mostrar URL de tercero.
- **Versión Mobile:** pantalla vertical, solicitar cámara/micrófono just-in-time; denegación explica ajuste en SO.
- **Componentes UI y Elementos:** appointment summary, permiso, prueba de conexión, continuar/cancelar.
- **Datos Reales de la Interfaz:** `APPOINTMENT.id/starts_at/ends_at/status`; campos provider/room/media no existen.
- **Navegación / Conexiones:** éxito -> FUT-01B; permiso/conexión falla -> estado recuperable; cita no válida -> PAT-09.

#### FUT-01B - Sala de espera de videollamada (POST-V1)

- **Objetivo / Caso de Uso:** esperar admisión del profesional sin grabación no consentida.
- **Versión Desktop:** panel de espera y estado de participante; comunicación accesible.
- **Versión Mobile:** panel adaptado con botón abandonar; nunca ocultar estado de permiso.
- **Componentes UI y Elementos:** avatar solo si existe, estado waiting/connecting, cancelación.
- **Datos Reales de la Interfaz:** no hay entidad telehealth ni room ID en ERD.
- **Navegación / Conexiones:** admitted -> FUT-01C; timeout -> FUT-01D; salir -> PAT-09.

#### FUT-01C - Videollamada activa (POST-V1)

- **Objetivo / Caso de Uso:** sesión virtual integrada y cifrada si proveedor, contrato y política se aprueban.
- **Versión Desktop:** video principal, controles mute/video/end, señal de red; evitar panel clínico dentro del video por defecto.
- **Versión Mobile:** controles grandes, gestión app-switch/privacidad; no superponer contenido que reduzca al mínimo la videollamada.
- **Componentes UI y Elementos:** track de participantes, conectividad, mute, cámara, finalizar, ayuda.
- **Datos Reales de la Interfaz:** ninguna entidad/tabla de llamada, grabación, provider o consent de telehealth está definida.
- **Navegación / Conexiones:** finalizar -> FUT-01E; fallo -> FUT-01D.

#### FUT-01D - Reconexión/error de llamada (POST-V1)

- **Objetivo / Caso de Uso:** informar corte, reintentar dentro de sesión o volver a contactar.
- **Versión Desktop:** mensaje de red y botón reconectar; estado claro de llamada todavía activa/finalizada.
- **Versión Mobile:** reconexión con datos móviles/Wi-Fi no asumidos; no iniciar llamadas automáticamente.
- **Componentes UI y Elementos:** retry, salir, ayuda, duración/estado confirmados por proveedor.
- **Datos Reales de la Interfaz:** falta contrato de provider/WebRTC/TURN y tratamiento de telemetría.
- **Navegación / Conexiones:** retry -> FUT-01C; terminar -> FUT-01E.

#### FUT-01E - Resumen de sesión virtual (POST-V1)

- **Objetivo / Caso de Uso:** confirmar finalización y regresar a cita; no generar diagnóstico/transcripción automática.
- **Versión Desktop:** hora de fin y estado técnico; recording/transcript solo si aprobación legal explícita.
- **Versión Mobile:** summary compacto y volver a agenda.
- **Componentes UI y Elementos:** volver, reportar problema, estado de cita.
- **Datos Reales de la Interfaz:** no hay `call_session` en modelo.
- **Navegación / Conexiones:** vuelve a PAT-09/PRO-03.

#### FUT-02A - Resumen de precio y checkout (POST-V1)

- **Objetivo / Caso de Uso:** pagar cita solo tras seleccionar pasarela local, precios e impuestos.
- **Versión Desktop:** resumen de precio desglosado, política cancelación/reembolso y método; no inventar montos.
- **Versión Mobile:** layout vertical, manos libres del formulario de tarjeta si provider externo aprobado.
- **Componentes UI y Elementos:** total, moneda COP, PSE/tarjeta solo tras aprobación, confirmar/cancelar.
- **Datos Reales de la Interfaz:** `payments` aparece en decisión antigua, pero no está en ERD V1 ni RF14 provider final.
- **Navegación / Conexiones:** continuar -> FUT-02B; cancelar -> appointment detail.

#### FUT-02B - Procesando pago (POST-V1)

- **Objetivo / Caso de Uso:** comunicar redirect/estado del proveedor sin guardar datos de tarjeta.
- **Versión Desktop:** spinner/status y botón cancelar únicamente si provider permite.
- **Versión Mobile:** retorno seguro desde aplicación bancaria mediante universal link validado.
- **Componentes UI y Elementos:** status, retry cuando seguro, request/payment reference opaca.
- **Datos Reales de la Interfaz:** no existen entidad, endpoint, idempotency field o gateway acordado.
- **Navegación / Conexiones:** success -> FUT-02C; fail/cancel -> FUT-02D.

#### FUT-02C/FUT-02D - Resultado y comprobante/fracaso (POST-V1)

- **Objetivo / Caso de Uso:** mostrar pago confirmado o rechazado y comprobante según RF14.
- **Versión Desktop:** comprobante con referencia, importe aprobado y fecha; fracaso con reintento/soporte.
- **Versión Mobile:** compartir comprobante solo por acción explícita y canal seguro.
- **Componentes UI y Elementos:** estado, recibo/descarga, reintentar, volver a cita.
- **Datos Reales de la Interfaz:** `payments`, comprobante y retención no modelados; no usar datos financieros reales en Stitch.
- **Navegación / Conexiones:** resultado -> PAT-09/PAT-08.

#### FUT-03A - Selección de cuestionario (POST-V1)

- **Objetivo / Caso de Uso:** seleccionar instrumento de seguimiento cuando profesional/legal defina escalas.
- **Versión Desktop:** lista de cuestionarios autorizados y periodicidad explicada.
- **Versión Mobile:** lista simple accesible y duración estimada solo si proviene de instrumento aprobado.
- **Componentes UI y Elementos:** instrumento, versión/licencia si aplica, consentimiento, comenzar.
- **Datos Reales de la Interfaz:** RF15 menciona ejemplos ansiedad/depresión, no define escala ni tabla.
- **Navegación / Conexiones:** comenzar -> FUT-03B; historial -> FUT-03D.

#### FUT-03B - Cuestionario de seguimiento (POST-V1)

- **Objetivo / Caso de Uso:** completar un instrumento aprobado sin convertir puntuación en diagnóstico.
- **Versión Desktop:** formulario por secciones y progreso; respuestas no expuestas en URL.
- **Versión Mobile:** pregunta/escala una por vista cuando instrumento lo requiera, conservar solo draft seguro aprobado.
- **Componentes UI y Elementos:** textos exactos del instrumento, escala, siguiente/anterior, salir.
- **Datos Reales de la Interfaz:** question/response/version/status no están modelados.
- **Navegación / Conexiones:** enviar -> FUT-03C; salir -> confirmar borrador.

#### FUT-03C/FUT-03D - Resultado y evolución longitudinal (POST-V1)

- **Objetivo / Caso de Uso:** paciente/profesional autorizados consultan tendencia, nunca diagnóstico automatizado.
- **Versión Desktop:** gráfico temporal con tabla alternativa, fuente/fecha del instrumento y nota de revisión profesional.
- **Versión Mobile:** resumen/lista temporal, no chart ilegible.
- **Componentes UI y Elementos:** puntos y rango con contexto, vacío, período, exportación solo si aprobada.
- **Datos Reales de la Interfaz:** `emotion_profiles` aparece en historia antigua pero no en ERD actual; escala y derechos de acceso requieren decisión.
- **Navegación / Conexiones:** respuesta -> profile history; revisión profesional -> patient panel.

#### FUT-04 - Calificación anónima de sesión (POST-V1)

- **Objetivo / Caso de Uso:** calificar sesión según RF16 sin exponer comentario anónimo al profesional en tiempo real.
- **Versión Desktop:** escala y confirmación anónima explicando límites de anonimización.
- **Versión Mobile:** controles accesibles y un CTA de envío.
- **Componentes UI y Elementos:** rating/questions deben ser aprobados; no inventar categorías o texto libre.
- **Datos Reales de la Interfaz:** no existe tabla/endpoint de rating en ERD.
- **Navegación / Conexiones:** invitación post-cita -> completar -> confirmación; no CTA en V1.

#### FUT-05A/FUT-05B - Compartir resumen clínico (pendiente de decisión)

- **Objetivo / Caso de Uso:** profesional selecciona resumen que el paciente autorizó ver, según entrevista.
- **Versión Desktop:** seleccionar campos permitidos y preview sin exponer la nota original.
- **Versión Mobile:** preview legible y consentimiento/acuse explícito.
- **Componentes UI y Elementos:** select/redact/preview, aceptar/revocar acceso si política lo establece.
- **Datos Reales de la Interfaz:** `shared_summaries` figuraba en una decisión de datos anterior, pero no está en ERD/migración/historias V1.
- **Navegación / Conexiones:** profesional crea -> patient recibe en timeline solo después de aprobación legal/endpoint; no habilitar en V1.

#### FUT-06 - Modo offline clínico (no diseñar como función)

- **Objetivo / Caso de Uso:** no aplica a V1; RNF-07 pide optimizar consumo de red, pero US-009/RNF-12 prohíben almacenar notas/resultados localmente.
- **Versión Desktop:** mostrar error/reintento al perder red, sin afirmar “guardado”.
- **Versión Mobile:** banner sin conexión, borradores clínicos no guardados se descartan bajo política explícita; si se necesita persistencia segura, requiere threat model separado.
- **Componentes UI y Elementos:** reconnect, aviso de no sincronizado, salir sin filtrar texto.
- **Datos Reales de la Interfaz:** ningún cache local clínico ni entidad offline.
- **Navegación / Conexiones:** reintentar cuando red vuelva; nunca seguir un flujo clínico como exitoso sin acuse server.

---

## 2. DESGLOSE EXHAUSTIVO DE PANTALLAS POR ROL

## Pantallas transversales de acceso (visitante y roles autenticados)

### BRAND-01 - Splash, logo y carga inicial

- **Objetivo / Caso de Uso:** establecer la identidad visual al abrir web/app y mostrar el estado inicial mientras se comprueba la sesión.
- **Versión Desktop (Escritorio):** wordmark MindFlow AI en la barra pública; favicon visible en navegador; al cargar sesión, usar pantalla de transición breve sin bloquear indefinidamente.
- **Versión Mobile (Móvil):** splash nativo con app icon/símbolo y wordmark dentro del área segura; no mostrar contenido del usuario antes de autenticar.
- **Componentes UI y Elementos:** wordmark horizontal, símbolo, app icon 1:1, favicon, lockup para login, variante mono/alto contraste, loader accesible, alt text. El activo existente no está en el repositorio: Stitch debe proponer un **concepto provisional** y etiquetarlo “pendiente de aprobación”, no asumir que es logo oficial.
- **Datos Reales de la Interfaz:** identidad estática; versión solo desde build; no requiere USER ni API.
- **Navegación / Conexiones:** primera carga -> restauración de sesión; sin sesión -> PUB-01; sesión paciente -> PAT-01; profesional -> PRO-01; admin autorizado -> ADM-01.

### PUB-01 - Entrada pública y selección de acceso

- **Objetivo / Caso de Uso:** presentar acceso directo a la plataforma y separar entrada de paciente y profesional sin prometer funciones inexistentes.
- **Versión Desktop (Escritorio):** pantalla sobria en dos áreas no-card anidadas: identidad MindFlow y acciones “Ingresar”, “Crear cuenta de paciente” y enlace secundario “Soy profesional”. No usar hero comercial ni mostrar indicadores clínicos de ejemplo como reales.
- **Versión Mobile (Móvil):** columna única; CTA de acceso visible; registro de paciente secundario; entrada profesional como enlace. Respetar safe area y no requerir video/ilustración.
- **Componentes UI y Elementos:** logotipo/nombre, aviso breve “Plataforma de apoyo; no atiende urgencias”, botones, selector de idioma solo si se aprueba, enlace privacidad.
- **Datos Reales de la Interfaz:** no requiere entidad. Mostrar versión/app build solo si proviene del build.
- **Navegación / Conexiones:** Ingresar -> AUTH-01; registro paciente -> AUTH-02; solicitud profesional -> AUTH-03; ayuda de urgencia -> PAT-12 no disponible antes de sesión; puede mostrar solo recursos públicos verificados.

### AUTH-01 - Inicio de sesión

- **Objetivo / Caso de Uso:** autenticar por correo/contraseña y continuar a MFA; nunca revelar si un correo está registrado.
- **Versión Desktop:** formulario centrado y compacto, email, password, mostrar/ocultar password, “Ingresar”, “Olvidé mi contraseña”, enlace de registro paciente y acceso profesional.
- **Versión Mobile:** formulario de una columna, teclado email/password apropiado, CTA fijo sin tapar campos; biometría no se asume.
- **Componentes UI y Elementos:** `email`, `password` (solo entrada, jamás mostrar el hash), validación, loading, banner de error genérico, reveal password accesible, links.
- **Datos Reales de la Interfaz:** `USER.email`, `USER.role` solo después de autenticación, `is_active` según contrato objetivo; no mostrar `password_hash`. **Desfase:** el modelo actual `User` usa `name`, `hashed_password`, `last_login`, roles `therapist/admin`; no soporta `patient` ni el contrato objetivo.
- **Navegación / Conexiones:** login correcto -> AUTH-04; credencial errónea -> misma pantalla con error genérico; sesión bloqueada/inactiva -> estado de acceso denegado; recuperar -> AUTH-06.

### AUTH-02 - Registro de paciente

- **Objetivo / Caso de Uso:** crear cuenta paciente. Antes de tratar datos sensibles debe existir consentimiento vigente.
- **Versión Desktop:** campos en una columna de ancho legible; email, nombre visible, contraseña y confirmación, aceptación de términos/privacidad; no pedir diagnóstico ni historia clínica en el alta.
- **Versión Mobile:** mismo orden, inputs apropiados, aceptación legible sin modal minúsculo; mantener borrador solo de datos de registro no clínicos y nunca password después de envío.
- **Componentes UI y Elementos:** `email`, `display_name`, password, confirmación, checkbox/enlace de política versionada, validación de correo duplicado con respuesta genérica, botón Crear cuenta.
- **Datos Reales de la Interfaz:** objetivo `USER.email`, `USER.display_name`, `USER.role=patient`, `USER.is_active`, `created_at`; `CONSENT.policy_version`, `policy_hash`, `accepted_at`, `withdrawn_at`. No mapear a DB actual como implementado.
- **Navegación / Conexiones:** creación -> AUTH-04 para segundo factor y luego AUTH-05 consentimiento; si registro requiere consent antes de crear cuenta, la secuencia se ajusta tras contrato aprobado. Error de validación permanece; no crear perfil clínico aquí.

### AUTH-03 - Solicitud de cuenta profesional

- **Objetivo / Caso de Uso:** iniciar alta de profesional y recopilar información suficiente para que admin verifique tarjeta antes de publicar.
- **Versión Desktop:** formulario con correo, nombre visible, especialidad, modalidad, zona de servicio y número de tarjeta profesional. Mostrar estado “pendiente de verificación”; ningún perfil aparece en directorio aún.
- **Versión Mobile:** formulario de una columna, selección de modalidad y zona accesible; carga/imagen de tarjeta no incluir hasta que exista contrato de almacenamiento seguro.
- **Componentes UI y Elementos:** campos derivados de `THERAPIST_PROFILE`; aviso de tratamiento de datos, submit, progreso, estado pending/rejected/verified cuando el backend lo provea.
- **Datos Reales de la Interfaz:** objetivo `USER.email/display_name/role=therapist`; `THERAPIST_PROFILE.license_number`, `specialty`, `modality`, `service_zone`, `verification_status`, `verified_at`. La entrevista no define el flujo de registro profesional; **confirmar** si se permite self-signup o solo invitación.
- **Navegación / Conexiones:** enviar -> estado solicitud pendiente; MFA -> AUTH-04; detalles y decisión -> ADM-02/03; pendiente/rechazada no da acceso a directorio profesional público.

### AUTH-04 - Verificación de segundo factor

- **Objetivo / Caso de Uso:** completar 2FA antes de una sesión clínica.
- **Versión Desktop:** código de un solo uso, destino enmascarado, reenvío con cuenta regresiva, confirmar, cambiar canal solo si backend lo admite.
- **Versión Mobile:** input OTP con autofill del SO si está disponible; no copiar el código a logs ni guardar.
- **Componentes UI y Elementos:** OTP, contador, reenviar, error/código vencido, loading, salida de sesión.
- **Datos Reales de la Interfaz:** el modelo objetivo no define entidad/campos MFA; el proveedor de segundo factor está elegido por correo en decisión tecnológica de forma provisional, pero el contrato todavía no existe.
- **Navegación / Conexiones:** éxito -> AUTH-05 si falta consentimiento; si consent vigente, PAT-01 o PRO-01 según rol server-side. Fallo -> reintento limitado / AUTH-01.

### AUTH-05 - Consentimiento informado

- **Objetivo / Caso de Uso:** explicar finalidad, tratamiento de datos sensibles, límites y obtener aceptación registrada.
- **Versión Desktop:** documento legible con versión/fecha; no checkbox premarcado; botones “Aceptar y continuar” y “No aceptar”.
- **Versión Mobile:** lectura desplazable; CTA visible después de lectura completa o sin imponer scroll artificial si no se requiere; accesible.
- **Componentes UI y Elementos:** resumen claro, enlace a texto completo, versión, fecha, aceptar, cancelar, retiro posterior.
- **Datos Reales de la Interfaz:** `CONSENT.user_id`, `policy_version`, `policy_hash`, `accepted_at`, `withdrawn_at`. Si consentimiento falta/retirado, bloquear reserva y captura clínica según US-001.
- **Navegación / Conexiones:** aceptar -> destino autenticado; rechazar -> cerrar flujo y explicar funciones no disponibles; privacidad posterior -> PAT-14.

### AUTH-06 - Recuperación de cuenta (pendiente)

- **Objetivo / Caso de Uso:** restablecer acceso de forma segura; el proyecto no define mecanismo, expiración ni canal.
- **Versión Desktop:** formulario email, aviso genérico, confirmación y nueva contraseña solo cuando el backend lo apruebe.
- **Versión Mobile:** equivalente de una columna; no usar SMS/email links sin decisión de seguridad.
- **Componentes UI y Elementos:** solicitar enlace/código, aviso de privacidad, success genérico, error/retry.
- **Datos Reales de la Interfaz:** no hay entidad/token de recuperación en ERD/migración.
- **Navegación / Conexiones:** desde AUTH-01; regresar a AUTH-01 al terminar. **Stitch debe marcar esta pantalla “flujo pendiente”, no simular recovery conectado.**

### AUTH-07 - Sesión expirada

- **Objetivo / Caso de Uso:** recuperar acceso cuando expira la sesión sin perder ni exponer contenido clínico.
- **Versión Desktop:** diálogo no bloqueante cuando no hay datos sensibles en pantalla; para vistas clínicas, ocultar contenido primero y dirigir al login.
- **Versión Mobile:** reemplazar la vista protegida; limpiar token de memoria/secure store al logout según política.
- **Componentes UI y Elementos:** aviso, “Volver a ingresar”, “Cerrar”; no imprimir token ni request payload.
- **Datos Reales de la Interfaz:** expiración de sesión/token, no campo del modelo clínico.
- **Navegación / Conexiones:** AUTH-01; al reingresar no reenviar automáticamente operaciones de reserva/análisis no idempotentes.

### AUTH-08 - Acceso contextual por rol (variantes del login compartido)

- **Objetivo / Caso de Uso:** permitir que paciente, profesional y administrador lleguen a la misma autenticación con copy/retorno contextual, manteniendo autorización del rol en servidor.
- **Versión Desktop (Escritorio):** frames separados en Stitch “Ingresar como paciente”, “Ingresar como profesional” y entrada admin privada si se aprueba. Comparten estructura del formulario, logo y campos; cambian subtítulo, soporte y ruta de retorno, no permisos.
- **Versión Mobile (Móvil):** misma variante contextual con navegación de retorno; no mostrar tab bar antes de autenticar.
- **Componentes UI y Elementos:** AUTH-01 reutilizado; badge contextual informativo; email/password/MFA; no dropdown que permita cambiar privilegios ni rol en body.
- **Datos Reales de la Interfaz:** `USER.role` devuelto por backend objetivo; rol de entrada no es dato confiable. El login actual no existe como endpoint.
- **Navegación / Conexiones:** login/MFA exitoso -> destino calculado con rol autenticado; paciente PAT-01, profesional PRO-01, admin ADM-01. Rol sin autorización para esa ruta -> SYS-01 403. Enlace a AUTH-02 solo para paciente; solicitud profesional -> AUTH-03.

### ONB-PAT-01 - Orientación inicial de paciente

- **Objetivo / Caso de Uso:** explicar alcance, privacidad y límites antes de directorio/cita, especialmente que la plataforma no sustituye urgencias.
- **Versión Desktop:** introducción de 2–3 pasos, progreso discreto, privacidad/consentimiento y acción continuar; no crear cuestionario diagnóstico.
- **Versión Mobile:** onboarding breve paginado, saltar solo contenido no obligatorio; el consentimiento formal sigue en AUTH-05 y no se reemplaza por onboarding.
- **Componentes UI y Elementos:** wordmark, alcance, privacidad, cómo pedir una cita, botón continuar y acceso a ayuda pública verificada.
- **Datos Reales de la Interfaz:** texto editorial estático versionado; `CONSENT.policy_version` se captura únicamente en AUTH-05.
- **Navegación / Conexiones:** primera sesión -> AUTH-05 si falta consent; si vigente -> PAT-01; ayuda -> recurso público aprobado, no una falsa alerta enviada.

### ONB-PRO-01 - Solicitud profesional recibida / verificación pendiente

- **Objetivo / Caso de Uso:** informar al profesional de que su perfil no se publica hasta completar revisión administrativa.
- **Versión Desktop:** estado `pending`, resumen de pasos y enlace de contacto; ocultar directorio, pacientes, notas y análisis mientras no esté verificado.
- **Versión Mobile:** vista de estado simple con acciones de soporte; sin navegación clínica habilitada.
- **Componentes UI y Elementos:** badge textual “Pendiente de verificación”, fecha de solicitud si existe, cerrar sesión.
- **Datos Reales de la Interfaz:** `THERAPIST_PROFILE.verification_status`, `verified_at`; no hay created_at de solicitud dedicado.
- **Navegación / Conexiones:** pending permanece aquí; aprobación -> ONB-PRO-02 y luego PRO-01; rechazo -> ONB-PRO-02; status de server es autoritativo.

### ONB-PRO-02 - Resultado de verificación profesional

- **Objetivo / Caso de Uso:** mostrar aprobación o rechazo sin revelar datos administrativos no autorizados.
- **Versión Desktop:** estado aprobado permite entrar al panel; rechazado muestra siguiente paso solo si política y motivo se definen.
- **Versión Mobile:** mismo resultado en pantalla compacta; no habilitar botones por estado local.
- **Componentes UI y Elementos:** status verified/rejected, `verified_at` solo para aprobado, volver a login o contactar soporte.
- **Datos Reales de la Interfaz:** `THERAPIST_PROFILE.verification_status`, `verified_at`; motivo rechazo no existe en modelo.
- **Navegación / Conexiones:** verified -> PRO-01; rejected/pending -> logout/soporte, no directorio público.

## 👤 ROL 1: PACIENTE

### PAT-01 - Inicio del paciente

- **Objetivo / Caso de Uso:** punto de entrada con próxima cita, accesos a directorio, historial y ayuda de crisis sin presentar información clínica no compartida.
- **Versión Desktop:** sidebar paciente y contenido central; encabezado con nombre visible; sección próxima cita; acciones Buscar profesional, Ver citas y Solicitar ayuda.
- **Versión Mobile:** tab bar Inicio/Buscar/Citas/Perfil; próxima cita en primer bloque, botones grandes y sin contenido clínico en push preview.
- **Componentes UI y Elementos:** próximo appointment, estado de consentimiento, alertas de cita, botones, loading/empty.
- **Datos Reales de la Interfaz:** `USER.display_name`; `APPOINTMENT.id`, `therapist_id`, `starts_at`, `ends_at`, `status`, modalidad a través del perfil; no mostrar nota/análisis. Campo modalidad falta en `APPOINTMENT` objetivo y debe venir de `THERAPIST_PROFILE` o contrato.
- **Navegación / Conexiones:** Buscar -> PAT-02; cita -> PAT-09; historial -> PAT-08; alertas -> PAT-13; crisis -> PAT-12.

### PAT-02 - Directorio de profesionales

- **Objetivo / Caso de Uso:** buscar solo perfiles verificados por especialidad, modalidad y zona de Ibagué.
- **Versión Desktop:** lista con filtros persistentes en columna izquierda y resultados en filas densas; orden definido explícitamente, no por IA.
- **Versión Mobile:** filtros en sheet/modal; lista de tarjetas compactas; no mapa obligatorio, pues no hay dirección/geo-coordenadas en el ERD.
- **Componentes UI y Elementos:** búsqueda texto solo si se acuerda, filtro especialidad, modalidad presencial/virtual, zona/comuna, reset, resultado vacío/cargando/error; badge “Verificado”.
- **Datos Reales de la Interfaz:** `USER.display_name`; `THERAPIST_PROFILE.specialty`, `modality`, `service_zone`, `verification_status=verified`, `verified_at`. No mostrar `license_number` completo al público si no se define política.
- **Navegación / Conexiones:** fila -> PAT-04; seleccionar horario -> PAT-05; filtros -> PAT-03.

### PAT-03 - Filtros del directorio (modal/sheet)

- **Objetivo / Caso de Uso:** acotar directorio sin perder resultados ya obtenidos.
- **Versión Desktop:** panel lateral/diálogo con grupos especialidad, modalidad y zona; botones Aplicar/Limpiar.
- **Versión Mobile:** bottom sheet a pantalla parcial/completa; controles seleccionables accesibles.
- **Componentes UI y Elementos:** dropdown/checkbox/chips, contador de filtros, aplicar, reset, cerrar.
- **Datos Reales de la Interfaz:** valores válidos deben proceder de catálogo aprobado; no inventar taxonomía oficial de especialidades ni zonas que no esté en backend.
- **Navegación / Conexiones:** Aplicar -> PAT-02 con query; cerrar -> PAT-02 sin cambios.

### PAT-04 - Perfil público de profesional

- **Objetivo / Caso de Uso:** revisar perfil verificado y modalidad antes de seleccionar cita.
- **Versión Desktop:** encabezado con nombre y badge, especialidad, modalidades, zona; disponibilidad resumida; CTA Seleccionar horario.
- **Versión Mobile:** encabezado compacto, contenido vertical, CTA fija inferior.
- **Componentes UI y Elementos:** campos públicos mínimos, estado de verificación, disponibilidad si endpoint la entrega; no rating, precio, foto, dirección exacta o biografía inventados.
- **Datos Reales de la Interfaz:** `USER.display_name`; `THERAPIST_PROFILE.specialty`, `modality`, `service_zone`, `verification_status`. `license_number` solo admin.
- **Navegación / Conexiones:** reservar -> PAT-05; volver -> PAT-02. Sin horarios -> estado vacío y regresar al directorio.

### PAT-05 - Selección de disponibilidad

- **Objetivo / Caso de Uso:** seleccionar horario profesional libre para una cita.
- **Versión Desktop:** calendario semanal con zona horaria Ibagué (`America/Bogota`) y lista de horas disponibles; controles de semana anterior/siguiente.
- **Versión Mobile:** agenda vertical día/lista de horas; evitar grilla horizontal estrecha; fecha/horario explícitos.
- **Componentes UI y Elementos:** selector fecha, modalidad si está disponible, slots libres, indisponible/loading/error, CTA Continuar.
- **Datos Reales de la Interfaz:** `AVAILABILITY_SLOT.id`, `therapist_id`, `starts_at`, `ends_at`, `status`, `created_at`; duración 45–60 minutos según entrevista, pero regla exacta debe ser configuración aprobada.
- **Navegación / Conexiones:** slot -> PAT-06; slot ocupado/respuesta 409 -> refrescar lista y mostrar alternativas; back -> PAT-04.

### PAT-06 - Confirmación de reserva

- **Objetivo / Caso de Uso:** revisar datos de cita y confirmar la reserva dentro de meta de 60 s.
- **Versión Desktop:** resumen profesional, fecha/hora y modalidad; consentimiento vigente; CTA confirmar y volver.
- **Versión Mobile:** resumen vertical y CTA inferior; el usuario ve zona horaria y hora local antes de aceptar.
- **Componentes UI y Elementos:** resumen de slot, aviso no urgencias, checkbox de políticas solo si existe texto aprobado, Confirmar reserva.
- **Datos Reales de la Interfaz:** `APPOINTMENT.patient_id`, `therapist_id`, `slot_id`, `starts_at`, `ends_at`, `status`, `created_at`; no precio/pago V1.
- **Navegación / Conexiones:** confirmar -> PAT-07; conflicto 409 -> PAT-05; sin consentimiento -> AUTH-05/PAT-14.

### PAT-07 - Reserva confirmada

- **Objetivo / Caso de Uso:** confirmar resultado solo tras acuse de API y mostrar identificación de cita.
- **Versión Desktop:** confirmación, resumen de appointment y siguientes acciones.
- **Versión Mobile:** confirmación accesible; no lanzar notificación push solicitando permiso sin explicar propósito.
- **Componentes UI y Elementos:** status `scheduled`, appointment ID, fecha, profesional, Añadir al calendario solo si privacidad se revisa, Ver cita, Inicio.
- **Datos Reales de la Interfaz:** `APPOINTMENT.id`, `starts_at`, `ends_at`, `status`; `NOTIFICATION.scheduled_at/channel/status` solo si backend confirmó programación. No decir “notificación enviada” antes de entrega.
- **Navegación / Conexiones:** detalle -> PAT-09; inicio -> PAT-01; citas -> PAT-08.

### PAT-08 - Citas próximas e historial

- **Objetivo / Caso de Uso:** ver citas futuras y pasadas propias.
- **Versión Desktop:** tabs Próximas/Historial y tabla/lista con fecha, profesional, modalidad, estado; filtros por rango solo si contrato los soporta.
- **Versión Mobile:** lista cronológica con secciones Próximas/Anteriores y estados textuales.
- **Componentes UI y Elementos:** tabs, filas, badge status no solo color, empty state, paginación si hay soporte, refresh.
- **Datos Reales de la Interfaz:** `APPOINTMENT.id`, `patient_id` (no exponer ID), `therapist_id`, `starts_at`, `ends_at`, `status`, `created_at`; nombre desde USER/profesional autorizado.
- **Navegación / Conexiones:** seleccionar -> PAT-09; reservar cita -> PAT-02.

### PAT-09 - Detalle de cita

- **Objetivo / Caso de Uso:** consultar datos propios y acciones permitidas de una cita.
- **Versión Desktop:** panel de detalle con profesional, horario, modalidad, estado, política de cancelación y notificaciones.
- **Versión Mobile:** vista nativa compacta; CTA cancelar/reprogramar solo cuando el servidor confirme elegibilidad.
- **Componentes UI y Elementos:** metadata, Cancelar, Reprogramar, botón crisis (si procede); no sección de nota/análisis clínico.
- **Datos Reales de la Interfaz:** Appointment fields; `NOTIFICATION` metadata. El link de videollamada queda ausente en V1.
- **Navegación / Conexiones:** Cancelar -> modal MOD-01; Reprogramar -> PAT-10; volver -> PAT-08.

### PAT-10 - Reprogramar cita

- **Objetivo / Caso de Uso:** reemplazar cita anterior por nuevo slot si cumple ventana mínima de 12 h.
- **Versión Desktop:** resumen cita actual + selector de slots disponibles para profesional; deshabilitar CTA si no elegible con razón recibida del backend.
- **Versión Mobile:** flujo paso a paso: cita actual, fecha/hora nuevas, confirmación.
- **Componentes UI y Elementos:** calendario, slot, modal de confirmación, conflicto, loading.
- **Datos Reales de la Interfaz:** appointment actual y `AVAILABILITY_SLOT`; cambio transaccional. No inferir hora de fin distinta a duración devuelta por API.
- **Navegación / Conexiones:** éxito -> PAT-07 (modo cambio) y PAT-09; conflicto -> refrescar slots; fuera de ventana -> PAT-09 con explicación.

### PAT-11 - Autorreporte de riesgo

- **Objetivo / Caso de Uso:** recoger autoidentificación explícita de riesgo. No es diagnóstico ni evaluación automática por LLM.
- **Versión Desktop:** formulario corto con preguntas aprobadas por profesional/legal; su contenido exacto no está definido en RF/ERD y Stitch debe usar placeholders ficticios claramente marcados.
- **Versión Mobile:** flujo de una pregunta por paso solo si cuestionario se aprueba; botón siempre accesible para salir y ver ayuda.
- **Componentes UI y Elementos:** radios/checkboxes según instrumentos aprobados, aviso límites de privacidad, enviar, error de red, no usar escala clínica inventada.
- **Datos Reales de la Interfaz:** `RISK_ASSESSMENT.patient_id`, `appointment_id?`, `source`, `self_report_level`, `status`, `created_at`, `acknowledged_at`. El esquema de niveles y preguntas falta definir.
- **Navegación / Conexiones:** enviar -> PAT-12; abandonar -> PAT-01 con confirmación si hay datos no enviados.

### PAT-12 - Ayuda en crisis y estado de alerta

- **Objetivo / Caso de Uso:** mostrar recursos locales verificados y el resultado real de notificación al profesional; nunca asegurar ayuda no confirmada.
- **Versión Desktop:** aviso destacado con llamadas/recursos oficiales, fecha de verificación de contenido si se provee, estado de alerta enviado/acuse/error.
- **Versión Mobile:** acciones de contacto grandes y accesibles; no depender solo de push ni de color.
- **Componentes UI y Elementos:** recursos oficiales como tokens de contenido `[TELÉFONO_VERIFICADO]` mientras no estén confirmados; texto no sustituye emergencias; estado de entrega.
- **Datos Reales de la Interfaz:** `RISK_ASSESSMENT.status/acknowledged_at`; datos de líneas de crisis no están modelados ni listados con números concretos en el repo. No fabricarlos.
- **Navegación / Conexiones:** volver a PAT-01/PAT-09; profesional recibe PRO-14/PRO-16. Fallo no debe mostrar “notificado”.

### PAT-13 - Centro de notificaciones

- **Objetivo / Caso de Uso:** consultar recordatorios/cambios de cita sin contenido clínico.
- **Versión Desktop:** lista cronológica, filtros Todos/Citas, marca leída solo si existe endpoint.
- **Versión Mobile:** lista nativa; previews en lockscreen sin datos sensibles.
- **Componentes UI y Elementos:** canal, estado, hora programada/enviada/acuse, vacíos, permiso push opcional.
- **Datos Reales de la Interfaz:** `NOTIFICATION.id`, `user_id`, `appointment_id?`, `channel`, `status`, `scheduled_at`, `sent_at`, `acknowledged_at`. No hay `title/body/read_at` en ERD: texto debe generarse del cliente o definirse en contrato sin PII.
- **Navegación / Conexiones:** cita -> PAT-09; evento de riesgo -> PAT-12.

### PAT-14 - Consentimiento y privacidad

- **Objetivo / Caso de Uso:** ver versión aceptada, fecha y solicitar retiro/gestión de derechos según política aprobada.
- **Versión Desktop:** estado activo/retirado, versión/hash no técnico para usuario, fecha y acción “Solicitar retiro” con advertencia de impacto.
- **Versión Mobile:** vista legible y CTA de retiro explícito; mantener acceso a recursos de urgencia aunque retire consentimiento.
- **Componentes UI y Elementos:** historial de versiones aceptadas, consulta de política, retiro con confirmación, solicitud de eliminación/portabilidad si flujo está aprobado.
- **Datos Reales de la Interfaz:** `CONSENT.user_id`, `policy_version`, `policy_hash`, `accepted_at`, `withdrawn_at`; solicitudes de eliminación/portabilidad no tienen entidad/endpoints especificados.
- **Navegación / Conexiones:** retirar -> confirmación y resultado; sin consentimiento -> se bloquea tratamiento clínico/reserva sensible conforme a política.

### PAT-15 - Perfil y ajustes de paciente

- **Objetivo / Caso de Uso:** ver datos de cuenta y opciones básicas de seguridad/notificaciones.
- **Versión Desktop:** perfil, correo, nombre, seguridad, consentimiento, cerrar sesión.
- **Versión Mobile:** secciones de perfil y seguridad, permisos push del sistema.
- **Componentes UI y Elementos:** nombre editable solo si endpoint existe, email, MFA, cerrar sesión, preferencias de canal no persistibles hasta aprobar schema.
- **Datos Reales de la Interfaz:** objetivo `USER.display_name`, `email`, `role`; `NOTIFICATION.channel/status` son eventos, no preferencias. No mostrar hash ni token.
- **Navegación / Conexiones:** consentimiento -> PAT-14; alertas -> PAT-13; logout -> AUTH-01.

## 👤 ROL 2: PROFESIONAL / TERAPEUTA

### PRO-01 - Inicio profesional

- **Objetivo / Caso de Uso:** resumen de agenda, tareas y alertas de pacientes asignados.
- **Versión Desktop:** sidebar fijo: Inicio, Agenda, Pacientes, Disponibilidad, Análisis; paneles para citas del día y alertas pendientes.
- **Versión Mobile:** tabs Inicio/Agenda/Pacientes/Perfil; acciones clínicas dentro de detalle; no exponer nota en preview.
- **Componentes UI y Elementos:** agenda próxima, estado de verificación, alertas con acuse, indicadores de análisis pendiente; no mostrar índice de “riesgo calculado por IA”.
- **Datos Reales de la Interfaz:** `THERAPIST_PROFILE.verification_status`, `APPOINTMENT` permitidas, `RISK_ASSESSMENT.status`, `ANALYSIS.status/needs_review`. Sin métricas agregadas no modeladas.
- **Navegación / Conexiones:** cita -> PRO-03; alerta -> PRO-16; analizar paciente -> PRO-05/08; disponibilidad -> PRO-13.

### PRO-02 - Agenda profesional

- **Objetivo / Caso de Uso:** ver citas, horarios y cambios de agenda.
- **Versión Desktop:** calendario semana/día y lista; filtros estado/modalidad si existen; bloqueos y citas visualmente distintos por icono+texto.
- **Versión Mobile:** agenda día/lista, navegación semana, botón Configurar disponibilidad.
- **Componentes UI y Elementos:** fecha/hora `America/Bogota`, estado, modalidad desde perfil/appointment contract, conflicto, filtros, vacío.
- **Datos Reales de la Interfaz:** `APPOINTMENT.id`, `patient_id`, `starts_at`, `ends_at`, `status`; `AVAILABILITY_SLOT` fields.
- **Navegación / Conexiones:** cita -> PRO-03; paciente -> PRO-05; configurar -> PRO-13.

### PRO-03 - Detalle de cita profesional

- **Objetivo / Caso de Uso:** consultar participantes y gestionar cita autorizada.
- **Versión Desktop:** fecha, estado, paciente identificable solo al profesional asignado, modalidad y acciones nota/cancelar/reprogramar.
- **Versión Mobile:** hoja de detalle con acciones; confirmar identidad según política antes de exponer nota.
- **Componentes UI y Elementos:** metadata de cita, editar estado si API lo permite, Cancelar/Reprogramar, crear nota.
- **Datos Reales de la Interfaz:** appointment IDs internos no deben exponerse innecesariamente; `starts_at`, `ends_at`, `status`, `created_at`; usuario patient authorized.
- **Navegación / Conexiones:** nota -> PRO-06; paciente -> PRO-05; cambios -> modal y vuelta a PRO-02.

### PRO-04 - Lista de pacientes asignados

- **Objetivo / Caso de Uso:** acceder exclusivamente a pacientes con relación tratante vigente.
- **Versión Desktop:** tabla con nombre/alias permitido, próxima cita y fecha última sesión solo si API lo define; búsqueda local no indexa notas.
- **Versión Mobile:** lista simple con búsqueda limitada a metadata.
- **Componentes UI y Elementos:** filas, filtros metadata, paginación, empty/error/403.
- **Datos Reales de la Interfaz:** relación patient/therapist no está incluida correctamente en modelos actuales ni en entidad `USER` del ERD junto con un campo explícito de asignación; requiere contrato/relación. No usar `patient_hash` como autorización.
- **Navegación / Conexiones:** seleccionar -> PRO-05; crear cita desde lista solo si endpoint autorizado.

### PRO-05 - Resumen del paciente asignado

- **Objetivo / Caso de Uso:** revisar contexto mínimo para la atención; no mostrar contenido a otros profesionales.
- **Versión Desktop:** perfil mínimo, timeline de citas, notas propias protegidas, consent status, análisis revisados. Ocultar widgets sin endpoint.
- **Versión Mobile:** secciones plegables y CTA Añadir nota/Ver análisis, con privacy screen al volver de background.
- **Componentes UI y Elementos:** tabs Citas/Notas/Análisis/Consentimiento; no “perfil psicológico” inferido.
- **Datos Reales de la Interfaz:** `APPOINTMENT`, `CLINICAL_NOTE` metadata, `ANALYSIS` statuses, consentimiento si autorización; nota plaintext solo en memoria de la vista protegida, nunca en log/cache.
- **Navegación / Conexiones:** nota -> PRO-06; análisis -> PRO-10; cita -> PRO-03.

### PRO-06 - Crear/editar nota clínica

- **Objetivo / Caso de Uso:** crear evolución estructurada después de la sesión.
- **Versión Desktop:** formulario con secciones Motivo de consulta, Observaciones y Plan; Antecedentes/evaluación de riesgo son de entrevista inicial pero no están formalizados como campos RF-06, por lo que no añadir al payload V1 sin aprobación.
- **Versión Mobile:** inputs multilinea con guardado explícito, advertencia de red, no autosave local de contenido clínico; no voz/micrófono en V1.
- **Componentes UI y Elementos:** inputs con límite proveniente del schema, contador sin enviar texto a analytics, cancelar, guardar, indicador “cifrado al guardar” solo si backend realiza el cifrado.
- **Datos Reales de la Interfaz:** ERD objetivo `CLINICAL_NOTE.id`, `appointment_id`, `patient_id`, `therapist_id`, `ciphertext`, `encryption_key_version`, `language`, `word_count`, timestamps. `motive/observations/plan` no existen como columnas; deben definirse en DTO/payload y formato cifrado. Modelo actual tiene `therapist_id`, `patient_hash`, `note_text`, `language`, `word_count`, `created_at`.
- **Navegación / Conexiones:** guardar -> PRO-07; cancelar -> confirmación si hay texto sin guardar; 403 -> no mostrar contenido.

### PRO-07 - Revisar y guardar nota

- **Objetivo / Caso de Uso:** confirmar contenido antes de persistir sin incluirlo en historial de navegación.
- **Versión Desktop:** preview en panel seguro, campos estructurados, botones Guardar/Editar/Cancelar.
- **Versión Mobile:** preview legible en una columna y confirmación de guardar; redactar contenido de la vista al logout.
- **Componentes UI y Elementos:** campos motivo/observaciones/plan, aviso de privacidad, estado del consentimiento, submit/loading/error.
- **Datos Reales de la Interfaz:** payload transitorio definido con el backend; persistencia objetivo cifrada en `CLINICAL_NOTE.ciphertext`, no retornar ciphertext al frontend.
- **Navegación / Conexiones:** éxito -> PRO-05 y opción Solicitar análisis PRO-08; error -> mantener formulario en memoria segura solamente y permitir reintento.

### PRO-08 - Solicitar análisis asistido

- **Objetivo / Caso de Uso:** el terapeuta autorizado inicia pipeline sobre nota que puede consultar.
- **Versión Desktop:** resumen de nota por referencia (no volver a copiar texto), aviso de anonimización y de análisis IA, checkbox/acción explícita si política lo requiere, botón Analizar.
- **Versión Mobile:** misma confirmación, mostrar nota solo en pantalla protegida; acción no se duplica por retry.
- **Componentes UI y Elementos:** note ID opaco, paciente authorized, estado consentimiento, aviso “Se anonimiza antes del LLM”, action disabled si nota no guardada/consent invalid.
- **Datos Reales de la Interfaz:** `ANALYSIS.clinical_note_id`, `status`, `provider_model`, `processing_time_seconds`, `needs_review`, `created_at`; `anonymized=true` es metadato interno, no toggle cliente.
- **Navegación / Conexiones:** enviar -> PRO-09; cancelar -> PRO-05/06; schema/permission failure -> mensaje sin revelar internals.

### PRO-09 - Análisis en proceso / error

- **Objetivo / Caso de Uso:** informar estados asincrónicos sin inventar velocidad ni mostrar carga infinita.
- **Versión Desktop:** status, timestamp, botón actualizar/volver; diagnóstico del proveedor no visible.
- **Versión Mobile:** estado compacto; al background no persistir contenido clínico; reingreso consulta estado servidor.
- **Componentes UI y Elementos:** pending/completed/error, retry con idempotencia, support request_id no clínico.
- **Datos Reales de la Interfaz:** `ANALYSIS.status`, `created_at`, `processing_time_seconds`; estados `pending|completed|error` en modelo actual.
- **Navegación / Conexiones:** completed -> PRO-10; error -> reintentar con confirmación; permiso perdido -> 403.

### PRO-10 - Resultado de análisis

- **Objetivo / Caso de Uso:** revisar señales emocionales/cognitivas y preguntas guía con obligación de criterio clínico humano.
- **Versión Desktop:** cabecera paciente/fecha/ID, aviso visible no diagnóstico, resumen de análisis, gráfico/lista de emociones, evidencia textual, distorsiones, preguntas guía, estado `needs_review`.
- **Versión Mobile:** tarjetas en lista vertical; chart alternativo accesible; no depender de color para significado, expanders de evidencia.
- **Componentes UI y Elementos:** `EmotionRadarChart` o alternativa, score numérico y label textual, `DistortionCard`, `GuidingQuestions`, `AnalysisStatus`, revisar/descartar notas internas si API lo permite.
- **Datos Reales de la Interfaz:** `EMOTION_SCORE.emotion_name`, `score_0_100`, `confidence_0_100`; `COGNITIVE_DISTORTION.distortion_type`, `confidence_0_100`, `evidence_excerpt`; `GUIDING_QUESTION.question_text`, `category`, `priority`; `ANALYSIS.needs_review`. **Desfase:** modelos reales tienen score 0–1; distortion `severity/description`; no hay `needs_review` actual. El contrato debe resolverse antes de binding.
- **Navegación / Conexiones:** historial -> PRO-11; exportar -> PRO-12; paciente -> PRO-05. No CTA de diagnosis, tratamiento ni especialista.

### PRO-11 - Historial de análisis/notas

- **Objetivo / Caso de Uso:** localizar notas y análisis del propio panel profesional.
- **Versión Desktop:** tabla cronológica con paciente autorizado, fecha, estado, emociones solo si API; filtros por fecha/estado, no usar emoción para priorizar clínicamente por sí sola.
- **Versión Mobile:** lista cronológica, filtro como sheet, paginación.
- **Componentes UI y Elementos:** search metadata, estado, fecha, empty/loading/error, export action.
- **Datos Reales de la Interfaz:** `CLINICAL_NOTE.created_at`, `ANALYSIS.status/created_at`, `analysis_id`; las relaciones y campos de filtro deben confirmarse. La historia antigua US-004 prometía offline/export CSV; eso se elimina de V1.
- **Navegación / Conexiones:** fila análisis -> PRO-10; nota -> PRO-05/06 según permisos.

### PRO-12 - Vista previa y exportación de reporte

- **Objetivo / Caso de Uso:** exportar manualmente el resultado estructurado para uso profesional.
- **Versión Desktop:** preview imprimible con ID opaco, fecha, scores/evidencia, preguntas guía y disclaimer. Botón Descargar PDF.
- **Versión Mobile:** preview vertical y compartir solo mediante acción explícita; el share sheet nativo puede filtrar datos, por eso no incluirlo hasta revisar amenaza/consentimiento.
- **Componentes UI y Elementos:** zoom, descarga, cancelación, loading/error, aviso no diagnóstico.
- **Datos Reales de la Interfaz:** `REPORT.id`, `analysis_id`, `format`, `generated_at`; target ERD usa ciphertext/key version. Modelo actual expone `generated_content` plaintext. UI solo recibe DTO autorizado, nunca ciphertext o raw `generated_content` sin sanitización.
- **Navegación / Conexiones:** export -> archivo local explícito; volver -> PRO-10. No envío automático a paciente.

### PRO-13 - Configurar disponibilidad

- **Objetivo / Caso de Uso:** abrir/cerrar franjas semanales y bloquear horarios particulares.
- **Versión Desktop:** calendario semana con zona `America/Bogota`, duración 45–60 como regla configurable, lista de slots.
- **Versión Mobile:** edición por día en lista; confirmación antes de eliminar slot.
- **Componentes UI y Elementos:** fecha inicio/fin, estado slot, crear/bloquear, conflicto con appointment, guardar.
- **Datos Reales de la Interfaz:** `AVAILABILITY_SLOT.therapist_id`, `starts_at`, `ends_at`, `status`; recurrencia semanal no existe como campo, así que UI debe editar slots explícitos o esperar contrato recurrence.
- **Navegación / Conexiones:** guardar -> PRO-02; slot reservado -> mensaje conflict no borrable.

### PRO-14 - Bandeja de alertas/notificaciones profesional

- **Objetivo / Caso de Uso:** consultar recordatorios y alertas de autorreporte o cambios.
- **Versión Desktop:** lista con tipo, paciente autorizado, estado/acuse y timestamp; al abrir, registrar acceso.
- **Versión Mobile:** bandeja sin contenido clínico en push preview; navegar al detalle solo tras autenticación.
- **Componentes UI y Elementos:** channel/status, filtros, acknowledge CTA para alertas, no borrar auditoría.
- **Datos Reales de la Interfaz:** `NOTIFICATION.user_id`, `appointment_id?`, `channel`, `status`, timestamps; `RISK_ASSESSMENT.status/acknowledged_at`; no hay campo title/body/type en ERD.
- **Navegación / Conexiones:** cita -> PRO-03; riesgo -> PRO-16.

### PRO-15 - Ajustes profesionales

- **Objetivo / Caso de Uso:** consultar/editar datos profesionales y seguridad.
- **Versión Desktop:** perfil, zona, especialidad, modalidad, estado de verificación, seguridad y logout.
- **Versión Mobile:** secciones compactas, mostrar estado de tarjeta sin exponer números completos.
- **Componentes UI y Elementos:** profile, auth/MFA, session/logout, solicitudes de actualización.
- **Datos Reales de la Interfaz:** `THERAPIST_PROFILE` fields; el flujo para cambiar `license_number` requiere revisión admin. No existe preferencias visuales/horario o push en modelo.
- **Navegación / Conexiones:** verificación -> ADM-02 para admin (no botón profesional); disponibilidad -> PRO-13.

### PRO-16 - Detalle/acuse de alerta de riesgo

- **Objetivo / Caso de Uso:** el profesional tratante revisa una alerta explícita y registra acuse según protocolo humano aprobado.
- **Versión Desktop:** panel de severidad tal como la seleccionó el paciente, timestamp, recurso verificado y botones Acusar/Marcar seguimiento solo si el backend define estados.
- **Versión Mobile:** contenido protegido; acción rápida sin detalle sensible en notificación; llamar al paciente no se inventa como función.
- **Componentes UI y Elementos:** source, self_report_level, status, acknowledge timestamp, líneas verificadas, escalamiento humano.
- **Datos Reales de la Interfaz:** `RISK_ASSESSMENT.source`, `self_report_level`, `status`, `created_at`, `acknowledged_at`; valores exactos y protocolo de escalamiento pendientes.
- **Navegación / Conexiones:** acuse -> PRO-14/PRO-01; si falla canal, estado visible no confirma recepción.

## 👤 ROL 3: ADMINISTRADOR

### ADM-01 - Cola de verificación profesional

- **Objetivo / Caso de Uso:** revisar solicitudes no verificadas y asegurar que solo profesionales aprobados aparecen en directorio.
- **Versión Desktop:** tabla densa con nombre/correo interno, specialty, license number parcialmente oculto, fecha solicitud y estado. Solo admins autorizados.
- **Versión Mobile:** no incluir en V1; administración web restringida.
- **Componentes UI y Elementos:** filtros `pending/verified/rejected`, sort, paginación, badge texto, búsqueda por metadata.
- **Datos Reales de la Interfaz:** `THERAPIST_PROFILE.verification_status`, `license_number`, `specialty`, `modality`, `service_zone`, `verified_at`; join a `USER.email/display_name`.
- **Navegación / Conexiones:** selección -> ADM-02; decisión masiva prohibida/no especificada.

### ADM-02 - Revisar tarjeta y perfil profesional

- **Objetivo / Caso de Uso:** evaluar verificación oficial antes de publicar profesional.
- **Versión Desktop:** panel de información declarada y campo/estado de validación en fuente oficial. El número de tarjeta no se muestra a paciente.
- **Versión Mobile:** fuera de V1.
- **Componentes UI y Elementos:** license number protegido, especialidad, modalidad, zona, resultado de verificación manual, comentarios internos si se aprueban.
- **Datos Reales de la Interfaz:** `THERAPIST_PROFILE.license_number`, `verification_status`, `verified_at`; `professional_verifications` estaba en una decisión de datos anterior, pero no aparece como entidad separada en el ERD V1. El flujo exacto debe resolverse.
- **Navegación / Conexiones:** Aprobar/Rechazar -> ADM-03; volver -> ADM-01.

### ADM-03 - Aprobar/rechazar profesional (modal)

- **Objetivo / Caso de Uso:** registrar decisión auditada de verificación.
- **Versión Desktop:** modal con nombre, decisión, confirmación; rechazo requiere motivo solo si se agrega a API.
- **Versión Mobile:** no aplica V1.
- **Componentes UI y Elementos:** buttons Approve/Reject, confirm, loading, errors.
- **Datos Reales de la Interfaz:** target cambia `verification_status`, `verified_at`; no existe motivo de rechazo en el ERD; no inventar columna.
- **Navegación / Conexiones:** aprobado -> ADM-01 y perfil visible en PAT-02; rechazado -> mantiene oculto.

### ADM-04 - Auditoría de accesos

- **Objetivo / Caso de Uso:** consulta restringida para revisión de accesos/modificaciones a historia clínica.
- **Versión Desktop:** filtros actor/action/resource type/period/request ID; nunca mostrar body clínico.
- **Versión Mobile:** fuera de V1.
- **Componentes UI y Elementos:** tabla append-only, metadata, paginación, permiso admin y evento de acceso a auditoría.
- **Datos Reales de la Interfaz:** `AUDIT_EVENT.actor_user_id`, `action`, `resource_type`, `resource_id`, `request_id`, `occurred_at`; usuario debe estar autorizado.
- **Navegación / Conexiones:** fila -> detalle metadata; no existe endpoint real ni alcance de acceso admin aprobado.

### ADM-05 - Consola interna del framework (no Stitch de producto)

- **Objetivo / Caso de Uso:** arquitectura.md menciona administración de manifests/configuración, pero es operación técnica del framework y no una función para paciente/profesional.
- **Versión Desktop:** no incluir en prototipo público. Si el docente la exige, crear una vista aparte con manifiestos, estado loader y auditoría técnica, siempre sin datos clínicos.
- **Versión Mobile:** no aplica.
- **Componentes UI y Elementos:** fuera del prototipo V1.
- **Datos Reales de la Interfaz:** `config/agents.yaml`, `config/skills.yaml` son archivos de desarrollo; no exponerlos como API ni modificables por admin de producto.
- **Navegación / Conexiones:** no se conecta a portales públicos; queda en consola local interna si se implementa.

## 3. PANTALLAS TRANSVERSALES Y COMPARTIDAS

### SYS-01 - Estados de error y permisos

| Estado | Presentación | Acción | Restricción de datos |
|---|---|---|---|
| 401 / sesión vencida | Pantalla de sesión expirada | Login/MFA | limpiar acceso y ocultar contenido clínico |
| 403 | “No tienes permiso para consultar este recurso” | Volver al panel | no revelar existencia/nombre del paciente |
| 404 | Recurso no disponible | volver/refrescar | no distinguir recurso ajeno de inexistente si RBAC así lo exige |
| 409 reserva | horario ya ocupado | volver a slots actuales | no confirmar cita hasta respuesta exitosa |
| 422 validación | errores por campo | corregir dato | no repetir nota/PII en toast ni logs |
| 429 | demasiados intentos | esperar/reintentar | no revelar límites de seguridad detallados |
| 5xx / provider error | error genérico con request_id | reintentar limitado/soporte | nunca mostrar stack trace, prompt o respuesta cruda LLM |
| Sin conexión | banner y estado local no sensible | reintentar | no persistir notas/resultados en offline |
| Mantenimiento | pantalla neutral | volver más tarde | no afirmar que datos se guardaron |

### Modales y componentes reutilizables

| ID | Modal/componente | Disparo | Acciones y datos | Reglas |
|---|---|---|---|---|
| MOD-01 | Confirmar cancelar cita | PAT-09/PRO-03 | cancelar/volver; appointment ID solo interno | validar ventana 12 h en server; mostrar resultado real |
| MOD-02 | Confirmar reprogramación | PAT-10 | slot actual/nuevo y confirmar | operación atómica; conflicto -> PAT-05 |
| MOD-03 | Conflicto de horario | 409 API | actualizar disponibilidad | nunca conservar confirmación falsa |
| MOD-04 | Consentimiento/retirada | AUTH-05/PAT-14 | versión, aceptar/rechazar/retirar | sin consentimiento no tratar datos sensibles |
| MOD-05 | Confirmar guardar nota | PRO-06/07 | guardar/editar | no copiar el texto clínico a telemetría/modal de error |
| MOD-06 | Confirmar iniciar análisis | PRO-08 | nota ID opaco, explicación de IA | no enviar texto duplicado; sólo usuario autorizado |
| MOD-07 | Alertar riesgo | PAT-11 | confirmar envío / salir | muestra recursos reales; status solo con acuse |
| MOD-08 | Acuse de alerta | PRO-16 | acknowledge si API permite | registro server-side auditado |
| MOD-09 | Aprobar/rechazar perfil | ADM-02 | acción y confirmación | no mostrar la licencia al paciente |
| MOD-10 | Cerrar sesión | ajustes | salir/cancelar | limpiar sesión/tokens según plataforma |
| MOD-11 | Permiso push | PAT-13/PRO-14 | permitir/no ahora | permiso del SO tras explicar; no incluir contenido clínico |
| MOD-12 | Toast/banner | éxito/error | dismiss | copy sin PII; accesible y no solo color |
| MOD-13 | Loader/skeleton | carga API | ninguno | no mostrar cifras/score falsos como datos reales |
| MOD-14 | Empty state | lista sin datos | siguiente acción | ej. “Aún no tienes citas”; CTA acorde a rol |
| MOD-15 | Confirmar salir con cambios | formulario nota/agenda | descartar/seguir | nunca autosave en storage no seguro |

### Elementos transversales comunes

- **Header:** nombre de producto, rol activo tras respuesta del servidor, menú perfil/notificaciones; no mostrar rol controlado por cliente.
- **Navegación:** sidebar desktop por rol y tab bar móvil limitada a 4–5 destinos principales; deep links deben autenticar y revalidar permisos.
- **Estados:** loading, skeleton, empty, offline, expired, validation, unauthorized, server failure y success real en cada formulario/tabla.
- **Toasts:** duración suficiente, accesibles, texto explícito; éxito solo después del acuse del API.
- **Confirmaciones:** ninguna acción destructiva/no reversible sin confirmar; borrado clínico no está especificado como auto-servicio.
- **Notificaciones:** sin nombre de paciente, nota, diagnóstico, nivel de riesgo o resultado del LLM en la pantalla bloqueada.

## 4. SISTEMA DE DISEÑO Y GUÍA DE ESTILOS PARA STITCH

### Dirección visual

- Interfaz profesional, tranquila y de alta legibilidad para datos sensibles; evitar estilo hospital genérico, marketing de landing o “AI dashboard” con gráficos decorativos.
- Desktop prioriza densidad de agenda/tablas; mobile prioriza una tarea por pantalla y acciones con alcance claro.
- No tarjetas anidadas. Secciones de página son layouts planos; tarjetas solo para cita, profesional o dato repetible. Bordes de 4–8 px.
- Tipografía recomendada: **Source Sans 3** o **Atkinson Hyperlegible** para UI; títulos moderados, sin escalado por ancho de viewport. Si Stitch no permite tipografía, seleccionar una sans humanista legible, no default Inter/Roboto.

### Paleta propuesta

| Token | Color | Uso |
|---|---|---|
| `canvas` | `#F5F8F6` | Fondo principal claro, no crema/beige |
| `surface` | `#FFFFFF` | Formularios, paneles y tabla |
| `ink` | `#172A26` | Texto principal |
| `muted` | `#52645F` | Texto secundario con contraste comprobado |
| `brand` | `#176B5B` | Acciones primarias/navigation selection |
| `brand-soft` | `#DCEFE9` | Fondo de selección, no estado clínico |
| `accent` | `#C6533D` | Acción crítica/error no diagnóstico |
| `warning` | `#8A5A00` | Atención pendiente |
| `border` | `#D5E0DC` | Divisores y límites |
| `focus` | `#145BC7` | Anillo de teclado claramente visible |

Colores de emociones son visualización categórica, no etiqueta de salud ni severidad clínica; siempre añadir nombre, score y evidencia. No codificar diagnóstico por color. Proveer patterns/íconos si chart color no basta. No usar gradientes morados ni fondos oscuros obligatorios.

### Layout, responsive y accesibilidad

- Grid desktop de 12 columnas; contenido legible a 1280 px; tablas para citas/admin, filas compactas y cabeceras persistentes donde ayuden.
- Tablet colapsa navegación a rail/menú; mobile 360 px mínimo como diseño, scroll vertical, tab bar estable y safe areas.
- Spacing base 4 px, escala 8/12/16/24/32; botones/targets táctiles de al menos 44×44 px; no usar tipografía según `vw`.
- WCAG 2.1 AA: contraste, focus, labels, mensajes de error enlazados al input, navegación teclado/lector pantalla, no depender del color, charts con alternativa tabular.
- Idioma español colombiano. Fecha/hora presenta `America/Bogota`; serialización API ISO-8601 con zona/UTC.
- Modo claro primero. Dark mode solo como opción posterior a aprobación; no duplicar visuales antes de que el flujo clínico esté validado.

## 5. CONTRATO DE DATOS PARA POBLAR EL PROTOTIPO

### Campos objetivo dibujados en ERD (no todos existen aún en código)

| Entidad | Campos de referencia para UI | Mostrar/no mostrar |
|---|---|---|
| `USER` | `id`, `email`, `display_name`, `role`, `is_active`, `created_at`, `last_login_at` | mostrar nombre/email según rol; nunca password/hash. `id` opaco en ruta, no como etiqueta. |
| `THERAPIST_PROFILE` | `user_id`, `license_number`, `specialty`, `modality`, `service_zone`, `verification_status`, `verified_at` | público: display_name, especialidad, modalidad, zona, badge verified. Licencia solo admin autorizado y parcialmente oculta. |
| `CONSENT` | `id`, `user_id`, `policy_version`, `policy_hash`, `accepted_at`, `withdrawn_at` | usuario ve versión/fecha/estado derivado; hash técnico no se muestra. |
| `AVAILABILITY_SLOT` | `id`, `therapist_id`, `starts_at`, `ends_at`, `status`, `created_at` | horas libres/ocupadas; IDs internos no visibles. |
| `APPOINTMENT` | `id`, `patient_id`, `therapist_id`, `slot_id`, `starts_at`, `ends_at`, `status`, `created_at` | la UI muestra fecha, hora, profesional/participante permitido y estado; no el ID de paciente. |
| `CLINICAL_NOTE` objetivo | `id`, `appointment_id`, `patient_id`, `therapist_id`, `ciphertext`, `encryption_key_version`, `language`, `word_count`, timestamps | usuario nunca ve ciphertext/clave; nota plaintext solo vista profesional autorizada y solo en memoria protegida. El ERD no incluye columnas `motive/observations/plan`: necesitan DTO aprobado. |
| `RISK_ASSESSMENT` | `id`, `patient_id`, `appointment_id?`, `source`, `self_report_level`, `status`, timestamps | paciente/profesional autorizado según protocolo; no inferir nivel por IA. |
| `NOTIFICATION` | `id`, `user_id`, `appointment_id?`, `channel`, `status`, `scheduled_at`, `sent_at`, `acknowledged_at` | texto genérico y metadata de entrega; no hay `title/body/read_at` en ERD. |
| `ANALYSIS` | `id`, `clinical_note_id`, `status`, `provider_model`, `processing_time_seconds`, `needs_review`, `created_at` | no exponer proveedor técnico si no es necesario; `needs_review=true` siempre en V1. |
| `EMOTION_SCORE` | `id`, `analysis_id`, `emotion_name`, `score_0_100`, `confidence_0_100`, `created_at` | score como señal 0–100, sin diagnóstico. |
| `COGNITIVE_DISTORTION` | `id`, `analysis_id`, `distortion_type`, `confidence_0_100`, `evidence_excerpt`, `created_at` | evidencias literales de texto anonimizado, revisión profesional. |
| `GUIDING_QUESTION` | `id`, `analysis_id`, `question_text`, `category`, `priority`, `created_at` | sugerencia para terapeuta, no instrucción al paciente. |
| `REPORT` | `id`, `analysis_id`, `format`, `ciphertext`, `encryption_key_version`, `generated_at` | mostrar metadata y exportación autorizada; no `generated_content` raw. |
| `AUDIT_EVENT` | `id`, `actor_user_id?`, `action`, `resource_type`, `resource_id`, `request_id`, `occurred_at` | solo admin autorizado, sin cuerpo clínico. |

### Discrepancias actuales que Stitch debe tratar como bloqueantes de integración

1. `models/users.py` y migración: rol solo `therapist/admin`, campo `name`, `hashed_password`, `is_therapist`, `last_login`; **no existe `patient` ni `THERAPIST_PROFILE`**.
2. `models/clinical_notes.py`: `therapist_id`, `patient_hash CHAR(32)`, `note_text TEXT` en claro; no `patient_id`, appointment, ciphertext/key version. Migración igual. No mostrar este modelo como seguro/target final.
3. `patient_hash CHAR(32)` está comentado SHA-256 aunque SHA-256 hexadecimal son 64 caracteres; no usarlo para ownership.
4. `EmotionScore.score` actual usa `FLOAT 0–1`; las historias/ERD objetivo usan 0–100.
5. `CognitiveDistortion` actual usa `severity` y `description`; ERD objetivo usa `confidence_0_100` y `evidence_excerpt`.
6. No existen en Python/migración `Consent`, `TherapistProfile`, `AvailabilitySlot`, `Appointment`, `RiskAssessment`, `Notification`, `AuditEvent`; el ERD los propone.
7. `Analysis` actual no tiene `needs_review`; `Report` actual contiene `generated_content` en claro; no coincide con ERD cifrado.
8. `interfaces/api/main.py` es solo un docstring stub; no hay endpoints/OpenAPI reales. Los prompts proponen `/api/v1` pero rutas finales aún requieren aprobación.
9. El agente clínico tiene manifest/prompt de especificación pero no clase `agent.py`, no está en `config/agents.yaml` y no está implementado. La IA no existe como servicio funcional todavía.

**Regla para prototipo:** usar fixture JSON local con campos “ERD objetivo”, poner banner de datos de demostración y no presentarlo como conexión backend. Los datos deben ser sintéticos. No usar datos de estudiantes/pacientes reales.

## 6. FLOWS PRINCIPALES Y CRITERIOS DE CIERRE

### Paciente: primera visita a reserva

PUB-01 -> AUTH-02 -> AUTH-04 -> AUTH-05 -> PAT-01 -> PAT-02 -> PAT-04 -> PAT-05 -> PAT-06 -> PAT-07 -> PAT-09. Si slot ya ocupado, PAT-05 actualizado; si consentimiento falta/retirado, volver a AUTH-05/PAT-14; no emitir success antes de API.

### Paciente: gestión de cita

PAT-01/PAT-08 -> PAT-09 -> MOD-01 o PAT-10 -> confirmación -> PAT-07. Ventana de 12 h la define el servidor; mostrar rechazo con regla devuelta, no calcular como único control en UI.

### Paciente: autorreporte de riesgo

PAT-01 -> PAT-11 -> PAT-12. Sólo mostrar recurso de crisis verificado; notificación al terapeuta pasa por backend y estado de acuse. Si no hay ack, indicar que no se confirmó y mostrar recurso humano de respaldo aprobado.

### Profesional: nota a revisión de análisis

PRO-01 -> PRO-02 -> PRO-03 -> PRO-06 -> PRO-07 -> PRO-08 -> PRO-09 -> PRO-10 -> PRO-12. Revalidar ownership en cada solicitud. No offline, no PII a logs, análisis no diagnóstico.

### Admin: verificación de tarjeta

ADM-01 -> ADM-02 -> ADM-03 -> ADM-01; sólo los aprobados entran a PAT-02. Toda decisión debe producir auditoría metadata.

### Definition of done para el prototipo Stitch

- Cada pantalla del inventario tiene frame desktop y mobile cuando el canal está incluido, sin asumir que son dos servicios/API.
- Todos los enlaces/botones del prototipo tienen destino, modal o estado explícito; errores y estados vacíos están conectados.
- Vistas clínicas sólo aparecen en rol terapeuta asignado; el paciente no recibe notas/análisis no autorizados.
- Datos semilla son sintéticos y respetan entidades objetivo; los conflictos con modelos actuales se etiquetan `ERD OBJETIVO / NO API IMPLEMENTADA`.
- No aparecen pagos, videollamadas, diagnóstico, recomendación de especialista, modo offline clínico ni SSO como funciones activas V1.
- Paleta y navegación usan accesibilidad, contrastes, nombres de estados, teclado y layout móvil descritos arriba.
- Entregar prototype map y una lista de `Pendientes de decisión`, no declarar UI conectada a API real.
