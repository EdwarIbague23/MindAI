# Guía de preparación y generación asistida por IA — MindFlow AI

**Estado:** Especificación de trabajo; no significa que la aplicación ya esté implementada.
**Objetivo:** servir como punto de entrada único antes de generar código. Conservar la estructura del framework entregada por el docente. No pedir a una IA que ejecute todos los prompts de una vez.

## 1. Fuente de verdad y alcance acordado para generar

Cuando dos artefactos discrepen, aplicar este orden: (1) decisión aprobada por el equipo/docente y registrada en `decision_tecnologica.md`; (2) requisitos funcionales/no funcionales; (3) historias y criterios de aceptación; (4) arquitectura y diagramas; (5) prompts antiguos. No inferir funcionalidades desde un nombre de carpeta o un ejemplo de prompt.

- Producto: plataforma híbrida de salud mental con portal de paciente, portal profesional y copiloto de análisis para uso exclusivo del terapeuta.
- Cliente web: React + TypeScript en `interfaces/frontend/`.
- Cliente móvil: React Native para Android/iOS en `interfaces/mobile/`. Ambos clientes consumen la misma API FastAPI y los mismos contratos OpenAPI. Ningún cliente conecta directamente a PostgreSQL, Redis ni al proveedor LLM.
- Servidor: monolito modular FastAPI; mantener `core/`, `agents/`, `skills/`, `models/`, `config/`, `interfaces/` y `evaluations/` del framework docente. No recrear `backend/app` ni reemplazar el framework.
- Roles de producto: `patient`, `therapist`, `admin`. Los cargos del equipo en README no son roles de acceso.
- V1 objetivo: requisitos RF-01 a RF-10, RF-12 (consentimiento promovido a Must por la entrevista) y RF-18 (copiloto profesional); además RNF-11 a RNF-13 para integración híbrida, almacenamiento móvil y logging seguro.
- La IA puede devolver señales, evidencia textual y preguntas de reflexión para revisión profesional. No diagnostica, prescribe, recomienda especialistas ni toma decisiones clínicas. Mantener RF-17; las sugerencias de especialista de historias antiguas no se implementan en V1.
- Fuera de V1 hasta decisión explícita: videollamada integrada, pagos, cuestionarios longitudinales, calificación anónima, operación offline de historias/notas clínicas, y recomendaciones clínicas automatizadas.
- Usar únicamente datos sintéticos en desarrollo, demos y pruebas. Ninguna pantalla o prompt debe sugerir que el análisis es un diagnóstico.

Este baseline resuelve documentalmente las contradicciones actuales: RF-12 se elevó a `Must` con base en la entrevista y RF-18 hace explícito el análisis asistido existente en README/arquitectura. RF-17 sigue excluyendo diagnóstico, prescripción y recomendación clínica/especialista automática. RF-11 y RF-14 a RF-16 quedan en fases posteriores.

## 2. Estructura objetivo de interfaces

```text
interfaces/
  api/          FastAPI, autenticación, OpenAPI y endpoints de dominio
  frontend/     Aplicación web React + TypeScript
  mobile/       Aplicación React Native para Android/iOS
  shared/       Solo contratos/clientes TypeScript generados desde OpenAPI, si el equipo lo necesita
  cli/          CLI del framework docente
  chat_ui/      UI conversacional del framework; no habilita chat paciente-terapeuta
```

`shared/` no debe contener reglas de negocio duplicadas. El cliente web y móvil pueden tener navegación y presentación distintas, pero llaman a la misma API versionada. El almacenamiento seguro de tokens usa cookie segura/HttpOnly para web cuando el diseño de sesión lo permita y el almacén seguro del sistema operativo en móvil; nunca `localStorage` para secretos o notas. No persistir notas clínicas offline en V1.

## 3. Hallazgos bloqueantes antes de generar código

El repositorio contiene el esqueleto del framework y documentación, no una aplicación web/móvil funcional. `interfaces/api/main.py`, agentes y skills son stubs; no existe implementación de los portales ni suite de pruebas integral. La generación no es “un clic” y todavía no debe describirse como lista para producción.

- `models.User` y la migración solo contemplan `therapist/admin`, pero RF-01 requiere pacientes; `is_therapist` duplica el campo `role`.
- `ClinicalNote.note_text` se persiste como texto plano pese a RNF-01 y al prompt de cifrado. Debe definirse y probarse el cifrado antes de guardar; no basta con decir que la base de datos está cifrada.
- `patient_hash` es `CHAR(32)` pero se documenta como SHA-256 (hexadecimal SHA-256 requiere 64 caracteres); un hash simple tampoco debe usarse como sustituto de autorización/relación.
- `EmotionScore.score` usa una escala 0–1; requisitos e historias usan 0–100. Fijar una sola escala y sus restricciones en API, base de datos, UI, fixtures y reportes. Baseline de esta guía: 0–100.
- El ERD/modelo inicial no contiene consentimiento, perfil/verificación profesional, disponibilidad, citas, alertas/riesgo ni auditoría; son necesarios para RF-01 a RF-10.
- `config/agents.yaml` activa research/coding, no un agente de análisis clínico. Hay un manifest/prompt de análisis como especificación, pero no clase ejecutable ni activación; no conectarlo antes de implementarlo y evaluarlo.
- PII tiene ahora prompt canónico obligatorio en `core/security/`; el archivo heredado bajo `skills/` está marcado no ejecutable.
- PDF está separado entre la skill backend `skills/document_generator/` y la vista cliente `interfaces/frontend/`; el prompt heredado está marcado no ejecutable.
- Ya existen prompts para schemas, API de dominio, cliente web por rol, React Native, pruebas híbridas y DevOps. Los prompts 12–16 de la batería original continúan ausentes; no inventar que fueron entregados: usar los prompts nuevos por nombre y fase.
- No hay manifiestos de dependencias/build para Python, web ni móvil (por ejemplo, `pyproject.toml`, `package.json`/lockfile); la fase scaffold debe crearlos y fijar versiones/comandos antes de afirmar que algo se instala o ejecuta.
- `docs/manifest_schema.md` es contrato objetivo; el loader que valide permisos y schemas aún no existe y los stubs de agentes/skills siguen levantando `NotImplementedError`.
- RNF de 99.5% disponibilidad, alerta inmediata, cifrado, auditoría inmutable y cumplimiento legal requieren diseño operativo/legal comprobable; no deben prometerse como garantizados por un prototipo.

No iniciar una generación integral mientras no se hayan fijado en equipo/docente las políticas de retención/eliminación, fuente de verificación de tarjeta profesional, canal y responsable humano de alertas de riesgo, y proveedor/alcance de 2FA. Si no se resuelven, crear interfaces configurables y dejar explícito que no son producción.

## 4. Inventario de prompts y ubicación esperada

| Bloque | Artefacto actual | Acción necesaria antes de ejecutarlo |
|---|---|---|
| Arquitectura | `docs/prompt_01_arquitectura.md` + esta guía | Alineados al framework y dos clientes; usar antes del scaffold. |
| Schemas | `interfaces/api/prompts_schemas_openapi.md` | Prompt canónico de schemas/DTOs, score y contrato compartido. |
| Seguridad API | `interfaces/api/prompts_seguridad_api.md` | Sesión, segundo factor, RBAC/ownership y almacenamiento de token por plataforma. |
| API de dominio | `interfaces/api/prompts_api_dominio_v1.md` | Auth/RBAC, agenda, notas, riesgo, auditoría, notificaciones y OpenAPI. |
| Modelos/migraciones | `models/prompts_modelado_datos.md` | Prompt canónico; migraciones deben seguir ERD y política de cifrado. |
| PII/cifrado | `core/security/prompts_anonimizacion_pii.md`, `core/prompts_seguridad_cripto.md` | Middleware obligatorio, fail-closed, ciphertext y pruebas. |
| Agente IA | `agents/emotion_analysis_agent/manifest.yaml` + `prompts/analisis_emocional.md` | Solo especificación; crear clase y activar después de pruebas/suite de evaluación. |
| Web | `interfaces/frontend/prompts_ui_roles_react.md`, `prompts_ui_react.md`, `prompts_report_pdf.md` | Separar portales paciente/profesional de componentes heredados y exportación. |
| Móvil | `interfaces/mobile/prompts_mobile_react_native.md` | Flujos React Native, seguridad y API común. |
| Documento backend | `skills/document_generator/prompts_document_generator.md` | Consume únicamente resultados tipados sin nota cruda/PII. |
| QA | `evaluations/prompts_testing_unitario_mock.md`, `prompts_client_testing.md` | Backend, contratos, roles, web/móvil y E2E. |
| DevOps | `deployment/prompts_devops.md` | Compose API/web/DB/Redis; build nativo separado. |
| Históricos | `agents/emotion_analysis_agent/prompts/legacy_bateria_08_10.md`, `models/prompts_base_de_datos_origen.md`, `core/security/prompts_pii_anonymizer_origen.md`, `interfaces/frontend/prompts_export_pdf_origen.md`, `deployment/prompts_infraestructura_devops_origen.md` | Conservados junto a su dominio; son solo trazabilidad docente y llevan `NO EJECUTAR`. |

Los números de la batería original pueden conservarse en el encabezado para trazabilidad docente, pero no son un orden de ejecución ni justifican saltar etapas. Prompts incompletos o con bloques “Format” corruptos se corrigen antes de copiarlos a una IA.

## 5. Orden de ejecución y salida exigida por fase

1. **Congelar especificación y diagramas.** Revisar este documento, requisitos, historias, decisión tecnológica, arquitectura, componentes y ERD. Resolver los bloqueantes del apartado 3; no generar código aún.
2. **Inventario y scaffold.** Pedir a la IA que inspeccione el repo, respete la estructura docente, presente el árbol objetivo y enumere archivos que creará/modificará. Aprobar antes de ejecutar.
3. **Contrato y persistencia.** Definir schemas Pydantic/OpenAPI, modelo relacional completo, políticas de autorización y migraciones reversibles. Validar migración desde base limpia y downgrade.
4. **Seguridad y acceso.** Implementar usuarios/roles, 2FA según decisión, autorización por propietario/terapeuta tratante, consentimiento, cifrado autenticado, anonimización obligatoria, auditoría sin contenido clínico y secretos por entorno. Probar denegaciones además de accesos permitidos.
5. **Dominio/API.** Implementar perfiles verificados, disponibilidad, agenda sin doble reserva, cancelación/reprogramación, historial, notas, flujo de riesgo y notificaciones definidos en RF. Publicar OpenAPI; probar límites y concurrencia.
6. **Copiloto.** Crear/configurar el agente clínico real en `agents/` y `config/agents.yaml`; pipeline anonimización → LLM Gateway → parser/schema → persistencia cifrada → revisión del profesional. Usar proveedor falso en pruebas; sin diagnóstico ni recomendaciones autónomas.
7. **Web.** Generar primero shell/navegación y luego flujos por rol. Consumir solo el API; estados loading/empty/error/unauthorized; datos sintéticos; WCAG 2.1 AA.
8. **Móvil.** Generar la app React Native contra el mismo OpenAPI; almacenamiento seguro de credenciales, permisos just-in-time y manejo de red débil. No duplicar reglas ni guardar notas offline.
9. **Integración y entrega.** Ejecutar pruebas backend, migración, web, móvil y E2E de roles/flujos; revisar accesibilidad y seguridad; documentar ejecución local. Docker no contiene/empaqueta una app nativa como servicio de runtime.

Cada fase es una solicitud separada. La IA debe entregar resumen, lista de archivos, decisiones/assumptions, comandos ejecutados y resultados de pruebas; no debe afirmar que pasó un check que no ejecutó.

## 6. Plantilla breve para cada solicitud a la IA

> Trabaja únicamente en la fase **[número y nombre]** de `docs/AI_CODEGEN_PLAYBOOK.md`. Antes de editar, inspecciona el repo y señala cualquier conflicto con requisitos, historias, arquitectura, diagramas o código existente. Conserva el framework y los límites de seguridad. No inventes endpoints, campos, proveedores ni decisiones clínicas; registra lo que falte y detente si bloquea la fase. Cambia solo los archivos necesarios. Usa datos sintéticos y no muestres PII/secretos. Implementa pruebas del cambio, ejecútalas y reporta los comandos y resultados reales. No avances a otra fase ni generes todo el producto en una sola respuesta.

## 7. Criterio de “listo para pedir código”

- [ ] Equipo/docente aprueba stack, roles y alcance V1 descritos aquí.
- [ ] Requisitos e historias trazan cada función V1 a criterios verificables.
- [ ] Componentes y ERD reflejan ambos clientes, API común y entidades de V1.
- [ ] Prompts obsoletos reubicados/corregidos; prompts faltantes creados y enlazados.
- [ ] Roles, cifrado, consentimiento, PII y crisis tienen decisiones verificables.
- [ ] Build/test commands y dependencias están definidos para API, web y móvil.
- [ ] Datos de demo son sintéticos y el disclaimer clínico está en ambas interfaces.

Hasta completar esta lista, el prototipo puede servir para validar navegación/roles, pero no es evidencia de que la plataforma clínica esté implementada ni sea segura para datos reales.
