# STITCH MOBILE — SYSTEM ARCHITECTURE & EXHAUSTIVE UI/UX PROTOTYPE SPECIFICATION

**Versión:** 1.0
**Alcance:** solo app móvil Android/iOS; no incluye layouts desktop.
**Companion:** `STITCH_WEB_PROTOTYPE_SPEC.md` (web) y `STITCH_FULL_PROTOTYPE_SPEC.md` (dominio y fuente de datos compartida).
**Stack objetivo:** React Native + TypeScript; misma API FastAPI/OpenAPI que web.
**Viewport de diseño:** 390×844 px (referencia base); validar también 360 px Android y safe areas reales.
**Estado:** especificación de prototipo, no app ejecutable ni contrato API aprobado.

## REQUIRED STITCH OUTPUT — DO NOT SKIP LOGIN

Create a clickable mobile prototype. **The first/opening frame must be `MOB-AUTH-01 — Iniciar sesión` at 390×844 px**, not a home screen or splash-only frame. Include provisional MindFlow logo, email/password, password visibility, primary **Ingresar**, **¿Olvidaste tu contraseña?**, **Crear cuenta de paciente** and **Soy profesional**. `BRAND-01` is a separate launch/asset frame and never replaces login.

Since the repository has no authentication API, add a visibly labeled **“Solo demo — previsualizar rol”** control after the login form. Demo choices navigate to Patient Home, Therapist Home and Admin Verification preview. The admin option is prototype-only and must show “Consola admin web; no existe app admin móvil en V1”; do not imply the patient/therapist mobile build includes admin access or real authorization. The demo switcher is not a production role selector.

Minimum clickable mobile flows: login -> patient tabs Inicio/Buscar/Citas/Perfil -> Directory -> Therapist -> Slots -> Booking confirmation; login -> therapist tabs Inicio/Agenda/Pacientes/Perfil -> Patient -> Note -> Analysis -> Result; demo admin -> restricted Admin Preview -> Verification Queue -> Review -> Approve/Reject preview. Include separate registration, professional application, consent, OTP and recovery placeholder screens; do not omit them because the backend route is not implemented.

> **Regla de fidelidad:** usar datos sintéticos y mostrar estados de demostración. La app móvil y la web comparten roles/entidades, no una única presentación responsive. El repo no tiene pantallas RN, controladores FastAPI, routes OpenAPI ni assets oficiales de marca. No inventar campos/endpoints como si existieran.

## 1. MOBILE SCREEN INVENTORY MATRIX

| Screen ID | Module | Role | Access scope | Mobile navigation trigger | 390 px layout | Main entity/schema | State |
|---|---|---|---|---|---|---|---|
| BRAND-01 | Launch | All | Public/session restore | Native cold start | Splash within safe area | Static brand | Prototype asset |
| PUB-01 | Public entry | Visitor | Public only | App entry | Vertical action stack | None | V1 visual |
| AUTH-01/08 | Authentication | All | Session server-side | Login link/context | Single-column secure form | USER target | API absent |
| AUTH-02/03 | Registration | Patient/professional applicant | Unauthenticated | Create account | Step forms | USER/THERAPIST_PROFILE target | API absent/pending process |
| AUTH-04/05 | MFA/consent | Patient/professional | Account/session | After credentials | OTP / consent reading | CONSENT target | API absent |
| AUTH-06/07 | Recovery/expired | All | Session lifecycle | Login/401 | Single-column recovery / full-screen expired | Session only | Recovery pending |
| ONB-PAT/PRO | Onboarding | Patient/pro applicant | Self | First authenticated entry | Short pager/status page | USER/CONSENT/profile | Derived/pending |
| PAT-01..15 | Patient app | Patient | Own data only | Patient tabs | Four-tab app shell | Appointment, Consent, Notification, Risk target | Mixed V1/derived |
| PRO-01..16 | Therapist app | Therapist | Assigned patients only | Therapist tabs | Four-tab app shell + detail tools | Appointment, Note, Analysis, Risk target | Mixed V1/derived |
| ADM-01..04 | Admin | Admin authorized | Restricted | Not in patient/pro app | Not shipped in V1 mobile | Profile verification/Audit target | Web only in V1 |
| SYS-01/02 | System | All | Per API response | Any screen | Full-screen error or inline state | HTTP/session metadata | V1 transversal |
| MOD-01..15 | Overlays | By role/action | Same authorization as parent | CTA from screen | Bottom sheet/dialog | Parent record | V1/conditional |

## 2. MOBILE NAVIGATION & ROLE SHELLS

### Patient shell

Bottom tabs at 390 px: **Inicio**, **Buscar**, **Citas**, **Perfil**. Active item has icon + label, not color alone. Notification center opens from an accessible bell in header/profile. Tab bar stays at least 72 px plus OS safe-area inset, has 44×44 px targets, and must not cover scroll content. Search filters use bottom sheets.

### Therapist shell

Bottom tabs: **Inicio**, **Agenda**, **Pacientes**, **Perfil/Más**. The patient detail owns subtabs **Resumen**, **Citas**, **Notas**, **Análisis**; keep analysis within the assigned patient context, not a global feed that could leak cross-patient data. Availability and notification center live under Perfil/Más. Persistent context must show which patient is selected before clinical actions.

### Administrator

No administrator mobile shell in V1. Verification and audit are restricted web console screens (ADM-01..04). Do not put an “Admin” tab in ordinary builds. If a demo-only admin entry is requested, identify it as a separate, non-production demo build and still enforce a server role.

### Role selection/authentication

The person never picks a trusted role in a dropdown. Optional contextual entry buttons may share the same AUTH form; successful authentication returns a server-authorized role and the app navigates accordingly. Patient -> PAT-01; verified therapist -> PRO-01; admin -> no mobile route in V1. Invalid role/scope -> SYS-01/403.

## 3. SHARED AUTHENTICATION, BRAND AND ONBOARDING

### BRAND-01 - Splash, app icon and launch

- **Purpose:** initialize app and restore session without flashing protected content.
- **390 px layout:** native splash inside safe areas with provisional symbol/wordmark and brief loader; hide screen snapshots containing clinical data.
- **Components/assets:** provisional MindFlow wordmark, square app icon, monochrome variant, login lockup, accessibility label, clearspace. No logo asset exists in repository; mark all output “concept pending approval”.
- **Data:** static bundle version/session restore only; no API entity.
- **Navigation:** valid session routes by server role; no session -> PUB-01.

### PUB-01 - Public welcome / app entry

- **Purpose:** choose sign-in or account-start without overstating available services.
- **390 px layout:** one-column vertical page, logo, short non-emergency notice, primary Ingresar, secondary Crear cuenta paciente, tertiary Soy profesional.
- **Components:** accessible buttons, privacy link, loading/error states; no fake profiles or AI metrics.
- **Data:** static copy only.
- **Navigation:** AUTH-01/08, AUTH-02 or AUTH-03. Crisis resource only if officially verified.

### AUTH-01 / AUTH-08 - Sign-in variants by context

- **Purpose:** shared credential form with contextual copy for patient/professional/admin; permissions still server-owned.
- **390 px layout:** email/password form, show-password control, keyboard-aware scroll, CTA above keyboard, generic error.
- **Components:** validation, loading, expired session, recovery link. No role dropdown or privilege toggle.
- **Data target:** USER `email`, `role`, `is_active`; actual User model lacks patient role and API login is absent.
- **Navigation:** credentials success -> AUTH-04; MFA success -> role home. Never place `role` from client in trusted request.

### AUTH-02 - Patient sign-up

- **Purpose:** create patient identity, not collect clinical history.
- **390 px layout:** short form, email/name/password/confirm, privacy and consent links, sticky submit.
- **Components:** field-level validation, password visibility, duplicate-account generic error.
- **Data target:** USER `email`, `display_name`, `role=patient`, `created_at`; role/persistence not supported by current model. Consent recorded separately in target CONSENT.
- **Navigation:** AUTH-04 then AUTH-05 if required; after acceptance -> ONB-PAT-01/PAT-01.

### AUTH-03 - Professional application

- **Purpose:** start professional verification request; do not grant access to patient records until verified.
- **390 px layout:** vertical inputs for email, display name, specialty, modality, service zone and license number. Do not offer license photo upload until secure upload API exists.
- **Components:** privacy notice, submit, pending status.
- **Data target:** USER + THERAPIST_PROFILE fields; self-signup vs invitation is unresolved.
- **Navigation:** submit -> ONB-PRO-01; MFA may precede or follow review according to approved flow.

### AUTH-04 - Multi-factor verification

- **Purpose:** verify second factor before clinical access.
- **390 px layout:** OTP segmented field with OS autofill if available, masked destination, resend timer, explicit back/logout.
- **Components:** invalid/expired/rate-limited/resent states; no code in logs/local storage.
- **Data:** no MFA entity/API contract in repo; email provider is provisional.
- **Navigation:** success -> AUTH-05 or role home; failure -> retry bounded.

### AUTH-05 - Consent informed

- **Purpose:** explain health data processing and collect explicit consent/version.
- **390 px layout:** readable scroll page, version/date, accept/reject controls, no prechecked box; legal text is scroll-friendly.
- **Components:** accept, decline, privacy link; withdrawal later from PAT-14.
- **Data target:** CONSENT `user_id`, `policy_version`, `policy_hash`, `accepted_at`, `withdrawn_at`; not implemented in DB/API.
- **Navigation:** accept -> onboarding/home; reject -> exit/block sensitive flows.

### AUTH-06 - Password/account recovery (pending)

- **Purpose:** recovery mechanism not specified by source docs.
- **390 px layout:** email input and generic confirmation only as a clearly marked prototype placeholder.
- **Components:** submit, resend/help states; no invented SMS, email token or recovery endpoint.
- **Data:** no recovery token/table.
- **Navigation:** back to AUTH-01. Do not present as connected.

### AUTH-07 - Expired session

- **Purpose:** reauthenticate without exposing saved clinical text.
- **390 px layout:** full-screen expired-session message; actions Volver a ingresar/Cerrar.
- **Components:** no sensitive text in snapshot, push, toast or logs.
- **Data:** token/session metadata only.
- **Navigation:** AUTH-01; do not replay non-idempotent appointment/analysis actions automatically.

### ONB-PAT-01 - Patient orientation

- **Purpose:** explain platform limits, privacy and how to book; onboarding is not consent.
- **390 px layout:** short paged walkthrough with progress and skip for informational pages only.
- **Components:** brand, appointment steps, privacy/non-emergency disclaimer, continue.
- **Data:** static copy; formal consent remains AUTH-05.
- **Navigation:** consent missing -> AUTH-05; otherwise PAT-01.

### ONB-PRO-01 / ONB-PRO-02 - Verification status

- **Purpose:** show pending/approved/rejected professional state.
- **390 px layout:** compact status screen, no clinical tabs while unverified; rejection copy only if policy supplies reason.
- **Components:** status text and logout/support.
- **Data target:** THERAPIST_PROFILE `verification_status`, `verified_at`; rejection reason absent.
- **Navigation:** pending/rejected remains restricted; verified + auth -> PRO-01.

## 4. ROLE 1 — PATIENT MOBILE APP

### PAT-01 - Patient home

- **Parent/tab:** Inicio.
- **390 px layout:** greeting, next-appointment block, primary Buscar profesional, compact appointment/history and help links. No clinical chart or therapist-only analysis.
- **Components/data:** USER `display_name`; APPOINTMENT `starts_at`, `ends_at`, `status`, authorized therapist display name.
- **States:** upcoming appointment, no appointments, loading, API error, expired session.
- **Navigation:** booking -> PAT-02; appointment -> PAT-09; alerts -> PAT-13; help -> PAT-12.

### PAT-02 / PAT-03 - Directory and filter sheet

- **Parent/tab:** Buscar.
- **390 px layout:** one-column result list; filter icon opens full-height/bottom sheet with specialty, modality, zone.
- **Components:** verified label + text, apply/reset, empty/error/loading. No map/rating/price unless later supported.
- **Target data:** USER `display_name`; THERAPIST_PROFILE `specialty`, `modality`, `service_zone`, `verification_status`.
- **Navigation:** result -> PAT-04; filter sheet dismiss preserves current results.

### PAT-04 - Professional profile

- **Parent:** PAT-02 result.
- **390 px layout:** compact name/status header, specialty/modalities/zone, availability preview; sticky Select time CTA.
- **Components/data:** only public verified profile fields. No full license number, photos, address or biography unless approved.
- **States:** profile unavailable, not verified, no slots.
- **Navigation:** CTA -> PAT-05; back -> PAT-02.

### PAT-05 / PAT-06 / PAT-07 - Select, confirm and book

- **Parent:** PAT-04.
- **390 px layout:** vertical date strip then time-slot list; confirmation summary before final submit; timezone `America/Bogota` explicit.
- **Components/data:** AVAILABILITY_SLOT `id`, `starts_at`, `ends_at`, `status`; APPOINTMENT target `patient_id`, `therapist_id`, `slot_id`, `status`.
- **States:** slot unavailable/409, no availability, network error, confirmed only after API acknowledgement.
- **Navigation:** slot -> confirm -> success -> PAT-09; missing consent -> AUTH-05; do not show price/checkout in V1.

### PAT-08 / PAT-09 / PAT-10 - Appointments, detail and reschedule

- **Parent/tab:** Citas.
- **390 px layout:** upcoming/past segmented tabs; appointment cards stack date, therapist, status; detail is a full page; reschedule is a step flow.
- **Components/data:** APPOINTMENT `starts_at`, `ends_at`, `status`, `created_at`; no clinical note fields visible.
- **States/actions:** cancellation confirmation sheet MOD-01; rescheduling selects new slot; backend enforces 12-hour rule and concurrency conflict.
- **Navigation:** card -> PAT-09; reschedule -> PAT-10 -> PAT-07; booking -> PAT-02.

### PAT-11 / PAT-12 - Self-report and crisis-help state

- **Parent:** Inicio or public help route.
- **390 px layout:** one prompt/question per screen only after questionnaire approved; crisis help page with high-visibility verified call/resource actions and explicit alert-delivery state.
- **Components/data:** target RISK_ASSESSMENT `source`, `self_report_level`, `status`, timestamps. Questions, severity scale, phone numbers and endpoints are not specified.
- **States:** not sent, pending, acknowledged, failed; never show “therapist notified” without acknowledgement.
- **Navigation:** report -> PAT-12; return to home/appointment. Placeholder values clearly marked DEMO.

### PAT-13 / PAT-14 / PAT-15 - Notifications, consent/privacy, profile

- **Parent/tabs:** bell, Perfil.
- **390 px layout:** notifications list; consent/history page; grouped account/security/settings list. Push previews must be generic.
- **Components/data:** NOTIFICATION `channel`, `status`, `scheduled_at`, `sent_at`, `acknowledged_at`; CONSENT `policy_version`, `accepted_at`, `withdrawn_at`; USER `display_name`, `email`.
- **States/actions:** open notification -> appointment/help; withdraw consent -> explicit confirmation; profile edit fields only if API supports them.
- **Navigation:** tabs remain four items; notification list is a pushed detail route, not a fifth crowded tab.

## 5. ROLE 2 — THERAPIST / PROFESSIONAL MOBILE APP

### PRO-01 / PRO-02 - Home and daily agenda

- **Parent/tabs:** Inicio, Agenda.
- **390 px layout:** agenda-first cards sorted by time, day navigation, pending alert indicator; no tiny week grid. Therapist shell tabs: Inicio, Agenda, Pacientes, Perfil/Más.
- **Components/data:** APPOINTMENT `starts_at`, `ends_at`, `status`; availability slots; THERAPIST_PROFILE verification state.
- **States:** no appointments, slow network, not verified, error.
- **Navigation:** appointment -> PRO-03; patient -> PRO-05; availability in Perfil/Más -> PRO-13.

### PRO-03 / PRO-04 / PRO-05 - Appointment, patient list and patient summary

- **Parent/tabs:** Agenda or Pacientes.
- **390 px layout:** appointment detail as page; searchable patient list limited to metadata; patient summary with nested sections Citas/Notas/Análisis/Consentimiento.
- **Components/data:** patient-therapist ownership is required but absent from current models. Do not use `patient_hash` as permission.
- **States/actions:** 403/404 hides resource; show patient identifiers only to assigned therapist; no local search indexing note content.
- **Navigation:** note -> PRO-06; analysis -> PRO-10; cita -> PRO-03.

### PRO-06 / PRO-07 - Clinical note editor and review

- **Parent:** patient/appointment detail.
- **390 px layout:** multiline structured form Motivo/Observaciones/Plan, keyboard-aware scrolling, explicit review page and save CTA. No voice capture/offline draft in V1.
- **Components/data:** target CLINICAL_NOTE ciphertext/key-version relationship plus transient DTO fields; actual model stores plaintext `note_text` and lacks patient_id. Treat all fixture notes as synthetic.
- **States/actions:** cancel-with-unsaved-changes sheet, field validation, network failure, save acknowledged; no autosave to AsyncStorage.
- **Navigation:** save -> patient summary; start analysis -> PRO-08.

### PRO-08 / PRO-09 / PRO-10 - Request, processing and result of AI analysis

- **Parent:** saved note under assigned patient.
- **390 px layout:** action sheet/confirmation with anonymization notice; processing page with status and bounded retry; result as vertical signal/evidence cards and accessible table alternative.
- **Components/data:** target ANALYSIS `status`, `needs_review`; EMOTION_SCORE values 0–100; COGNITIVE_DISTORTION evidence; GUIDING_QUESTION. Actual models differ (score 0–1, no needs_review).
- **States/actions:** `pending/completed/error`; no infinite spinner; idempotent retry; AI disclaimer persistent.
- **Navigation:** result -> PRO-11 or PRO-12; patient context remains visible; no diagnosis/treatment/specialist action.

### PRO-11 / PRO-12 - History and report preview/export

- **Parent/tab:** Análisis within patient; detail result -> report.
- **390 px layout:** chronological list with filters in sheet; report preview optimized for vertical reading; export is explicit.
- **Components/data:** note/analysis metadata; REPORT target encrypted storage fields; actual generated_content is plaintext. Client receives authorized DTO only.
- **States/actions:** no offline history, no auto-share; download success/error/cancel.
- **Navigation:** row -> PRO-10; export -> system file save only after tap.

### PRO-13 / PRO-14 / PRO-15 / PRO-16 - Availability, alerts, profile and risk acknowledgement

- **Parent/tab:** Perfil/Más, notification bell, alert deep link.
- **390 px layout:** availability edited by day/list; alert inbox without sensitive lockscreen preview; professional profile/security settings; risk detail in protected full screen.
- **Components/data:** AVAILABILITY_SLOT start/end/status; NOTIFICATION delivery metadata; THERAPIST_PROFILE; RISK_ASSESSMENT acknowledgement fields.
- **States/actions:** server conflict, verified/pending status, ack accepted only after server response. No admin verification screens in therapist shell.
- **Navigation:** slot save -> PRO-02; alert -> PRO-16; patient context -> PRO-05.

## 6. ROLE 3 — ADMINISTRATOR

V1 includes restricted web verification/audit only. **No administrator mobile app or tab bar is specified.** Do not add it to either ordinary role shell.

| Mobile screen ID | Handling | Reason |
|---|---|---|
| ADM-01 verification queue | No mobile frame in V1; link to desktop web console if opened by deep link | Admin UI restricted to web |
| ADM-02 review license | No mobile frame | Sensitive license detail |
| ADM-03 approve/reject | No mobile action | Audited privileged operation |
| ADM-04 audit access | No mobile frame | Sensitive operational metadata |
| ADM-05 framework console | Never include in product mobile prototype | Developer operation, not app role |

If instructor explicitly requires responsive admin, create a separately approved admin mobile spec; do not imply current API supports it.

## 7. GLOBAL, TRANSVERSAL & AUTHENTICATION FLOWS

- **Brand/auth lifecycle:** BRAND-01 -> PUB-01 -> AUTH-01/08 -> AUTH-04 -> AUTH-05 if missing -> role-specific shell. AUTH-02 patient signup; AUTH-03 professional application; ONB-PAT/PRO status; AUTH-06 reset is pending; AUTH-07 expiry clears protected state.
- **Error states:** 401 -> login; 403 -> unauthorized screen without revealing resource; 404 -> unavailable; 409 -> refresh appointment slots; 422 -> field errors; 429 -> wait; 5xx -> generic request ID; offline -> re-try. No clinically sensitive payload in error text.
- **Global overlays:** MOD-01 cancel appointment, MOD-02 reschedule, MOD-03 conflict, MOD-04 consent/withdrawal, MOD-05 unsaved note, MOD-06 analyze note, MOD-07 crisis submission, MOD-08 therapist acknowledgement, MOD-10 logout, MOD-11 push permission, MOD-12 toast/banner, MOD-13 loader, MOD-14 empty state, MOD-15 unsaved changes. MOD-09 admin verification is not in mobile app.
- **Push:** permission requested just in time. Lock-screen text must not contain patient name, note, risk value, emotion or analysis. Push delivery state is not success until acknowledged by provider/API.
- **No Global Search / Cmd+K:** not suitable to this mobile app and absent from requirements; do not add.
- **Offline:** low-data/retry behavior is required, but clinical notes/results are not cached. Never label a note “saved” without server acknowledgement.

## 8. MOBILE DATA BINDING DICTIONARY AND API TRACEABILITY

The domain field dictionary from `STITCH_FULL_PROTOTYPE_SPEC.md` applies unchanged to mobile. Role views use these target entities: USER, THERAPIST_PROFILE, CONSENT, AVAILABILITY_SLOT, APPOINTMENT, CLINICAL_NOTE, RISK_ASSESSMENT, NOTIFICATION, ANALYSIS, EMOTION_SCORE, COGNITIVE_DISTORTION, GUIDING_QUESTION, REPORT, AUDIT_EVENT. For each entity, the master spec records fields and implementation gaps; do not fork field names between mobile and web.

**Current backend reality:** models/migration implement only seven tables and differ from the target ERD; API `main.py` is a stub and no route/controller/decorated FastAPI endpoint exists. Thus the current repository has **zero implemented CRUD endpoints to map**. Proposed intents below are not actual URL/method contracts:

| Mobile module | CRUD intent (proposal, not route) | Target roles | Current route |
|---|---|---|---|
| Auth/consent | create/read/update-or-withdraw consent/session | patient, therapist | None |
| Directory/profile | read verified professional profiles | visitor, patient | None |
| Availability/appointment | read slots; create/read/cancel/reschedule appointments | patient, therapist | None |
| Clinical note | create/read/update assigned note | therapist | None |
| Copilot | create/read analysis status/result | assigned therapist | None |
| Risk/notifications | create self-report; read/ack alert; read delivery state | patient, assigned therapist | None |
| Professional verification | read/update verification | admin | None |
| Audit | read append-only metadata | restricted admin | None |

No mock route should be labeled `/api/v1/...` as real. Any click-through fixture must say “Demo data — not connected to backend”.

## 9. FUTURE MOBILE FLOWS (HIDDEN / DISABLED IN V1)

- **Video:** FUT-01A device permission/precheck -> FUT-01B waiting -> FUT-01C active call -> FUT-01D reconnection -> FUT-01E summary. Requires selected WebRTC/TURN provider, privacy/legal approval and APIs; don't include active video CTA.
- **Payments:** FUT-02A quote -> FUT-02B processing -> FUT-02C receipt or FUT-02D rejection. Requires gateway, pricing/cancel policy and payment schema; no card or COP price invented.
- **Questionnaires:** FUT-03A choose approved instrument -> FUT-03B fill -> FUT-03C result -> FUT-03D trend. RF-15 is `Could`, instruments/model/access not specified.
- **Anonymous rating:** FUT-04 only when RF-16 approved; question/scale not specified.
- **Shared summary:** FUT-05A therapist selects/preview -> FUT-05B patient read-only; interview mentions consented summary but no schema or API. Keep disabled.
- **Offline clinical data:** not a future view in this prototype; RNF-12 explicitly prohibits local persistence in V1.

## 10. MOBILE DESIGN SYSTEM & ACCEPTANCE

### Viewport and navigation

- Primary frame 390×844 px; safe-area top/bottom; support 360 px width with vertical scroll and no horizontal page overflow.
- Bottom tab bar 72 px + OS inset; targets >=44×44 px. Patient: Inicio/Buscar/Citas/Perfil. Therapist: Inicio/Agenda/Pacientes/Perfil-Más. Admin: none in V1.
- Use system back safely; unsaved clinical note confirmation; deep links re-check session and role.

### Visual system

Apply shared master palette and typographic tokens. Do not create a second unrelated brand. Proposed colors are not diagnosis/severity: emotion display includes label+number+evidence and accessible non-color patterns. Spanish Colombia copy, `America/Bogota` times, accessible touch targets, WCAG 2.1 AA, loading/error/empty/permission states. Light mode first; dark mode only if approved.

### Mobile privacy and device behavior

- Use Keychain/Keystore via approved secure-store dependency; never AsyncStorage for secrets/notes/results/risk data.
- No clinical persistence in local storage, cache, crash logs, push previews, analytics or app switcher snapshot.
- Request camera/mic only for approved future video; request push only when reminders are introduced; permissions denied have recovery copy.
- Retry on slow/failed network with idempotency for appointment/analysis; never auto-submit after reconnect.

### Stitch delivery checklist

- Separate patient and therapist navigation shells; include visitor/auth context and administrator clearly marked web-only.
- Every mobile screen in the master inventory has a corresponding mobile frame or an explicit “not applicable / web-only / post-V1” annotation.
- All flows contain success, empty, loading, validation, unauthorized, conflict, session expired and network error states where applicable.
- Same screen IDs and target entity fields as web/master; no API endpoints presented as implemented.
- Demo data synthetic; no real contact/crisis number; no diagnosis, payments, active video, or offline note flow in V1.
- Produce a mobile click prototype and list decisions that block API binding/build; do not claim the current repo contains an installable app.
