# Historias de Usuario y Criterios de Aceptación – MindFlow AI Híbrido (Web + Móvil)

## US-001: Submisión de notas clínicas
**Como** terapeuta,  
**quiero** subir notas clínicas en formato texto para que el sistema pueda analizar emociones y distorsiones cognitivas.

**Criterios de aceptación (Híbrido):**
- **Web:** Formulario React con validación en tiempo real, POST `/api/notes` acepta texto, retorno de emociones y distorsiones en < 2s.
- **Móvil:** Capture de texto o voz (integration con LLM gateway).
- **Ambas plataformas:** Persistencia en PostgreSQL + Redis cache por sesión.
- **Validación:** Scores de emoción (alegría, tristeza, ira, miedo, asco, sorpresa) con indicadores visuales.

---

## US-002: Visualización de análisis emocional en tiempo real
**Como** terapeuta,  
**quiero** ver el análisis emocional en tiempo real en la interfaz para monitorear el estado psicológico del paciente.

**Criterios de aceptación (Híbrido):**
- **Web Dashboard:** Gráficos interactivos de scores de emoción, actualización automática cada 5s vía WebSocket.
- **Móvil:** Lista resumida con indicadores visuales de intensidad emocional.
- **Fuente de datos:** Redis cache (sesión actual) + PostgreSQL (histórico).
- **Disponible en:** Ambas plataformas Web y Móvil.

---

## US-003: Detección de distorsiones cognitivas
**Como** sistema IA,  
**quiero** detectar distorsiones cognitivas comunes para sugerir consultas especializadas.

**Criterios de aceptación (Híbrido):**
- **Motor IA:** Identifica mínimo 3 de las 10 distorsiones de Beck (catastrofización, filtrado, generalización excesiva).
- **Sugerencia de especialista:** Basándose en el perfil detectado, sugiere especialista apropiado.
- **Disponibilidad:** En ambas plataformas (Web/Móvil).
- **Flag de revisión:** `needs_review` para que el terapeuta valide la sugerencia.

---

## US-004: Historial de consultas desde la aplicación móvil
**Como** terapeuta,  
**quiero** acceder al historial de consultas desde la aplicación móvil.

**Criterios de aceptación (Híbrido):**
- **App móvil (React Native/Flutter):** Consume la API REST, muestra lista cronológica de notas.
- **Filtrado:** Por fecha, emoción dominante, distorsión detectada.
- **Offline-capable:** Última sesión sincronizada disponible offline.
- **Exportación:** PDF/CSV de reporte de consultas.

---

## US-005: Contexto de sesión con memoria a corto plazo
**Como** sistema IA,  
**quiero** mantener contexto de sesión usando memoria a corto plazo.

**Criterios de aceptación (Híbrido):**
- **Redis:** Almacena contexto por `session_id` con TTL de 30 minutos.
- **Propósito:** Mantiene últimas 3 interacciones sin reenviar todas las notas a cada petición.
- **Disponible:** Para ambos frontends (Web y Móvil).
- **Objetivo:** Reduce latencia en conversaciones continuadas.

---

## US-006: Perfil emocional longitudinal
**Como** terapeuta,  
**quiero** observar la evolución emocional del paciente a lo largo del tiempo.

**Criterios de aceptación (Híbrido):**
- **Emotion Profiles:** Tracking de tendencias (increasing/decreasing/stable) por paciente.
- **Visualización:** Gráficos de evolución en Web y listas resumidas en Móvil.
- **Fuente de datos:** Tabla `emotion_profiles` en PostgreSQL.
- **Insight clínico:** Identificación de patrones a largo plazo.

---

## US-007: Sugerencias de consulta automatizadas
**Como** sistema IA,  
**quiero** sugerir especialistas basados en el análisis de notas clínicas.

**Criterios de aceptación (Híbrido):**
- **Consultation Suggestions:** Especialista sugerido con `confidence_score` (0-100).
- **Rationale:** Razón fundamentada basada en distorsiones y emociones detectadas.
- **Flujo:** Terapeuta revisa y acepta/rechaza la sugerencia.
- **Disponibilidad:** Web y Móvil.

---

## US-008: Configuración de disponibilidad semanal
**Como** profesional,  
**quiero** configurar mi disponibilidad semanal y bloquear horarios.

**Criterios de aceptación (Híbrido):**
- **Configuración:** Disponibilidad semanal con horarios abiertos/bloqueados.
- **Sincronización:** Actualización en tiempo real en ambas plataformas Web y Móvil.
- **Prevención de conflictos:** Sistema bloquea horarios ya reservados.
- **Notificación:** Pacientes alertados cuando disponibilidad cambia.

---

*Historias de usuario diseñadas para arquitectura híbrida Web + Móvil, orientadas al copiloto de IA para terapeutas enfocado en análisis de notas clínicas, extracción de emociones, detección de distorsiones cognitivas y sugerencias de consulta.*