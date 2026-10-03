# STITCH WEB — PROTOTYPE SPECIFICATION (DESKTOP 1440 PX)

**Companion documents:** `STITCH_MOBILE_PROTOTYPE_SPEC.md` defines mobile; `STITCH_FULL_PROTOTYPE_SPEC.md` is the shared domain, safety and data reference. This file defines only the web experience.
**Roles:** visitor, patient, therapist/professional, administrator (restricted).
**Target:** React + TypeScript web prototype, 1440 px primary frame; adapt down to 1024/768 without horizontal page scroll.
**Status:** visual specification only. The repository has no React page/component source or API controllers yet. All data must be synthetic; all API integrations below are unimplemented until a route contract exists.

## REQUIRED STITCH OUTPUT — DO NOT SKIP LOGIN

Create a clickable web prototype. **The first/opening frame must be `WEB-AUTH-01 — Iniciar sesión`**, not a dashboard, splash-only frame or landing-page hero. Include the MindFlow logo concept at the top, email and password inputs, show-password control, primary **Ingresar** button, **¿Olvidaste tu contraseña?**, **Crear cuenta de paciente** and **Soy profesional** links. Keep `BRAND-01` as a separate splash/brand asset; it does not replace the login frame.

Because no backend auth exists yet, add a clearly labeled **“Solo demo — entrar como”** preview control below the real-looking login form. Its three demo-only choices must navigate to the patient shell/home, professional shell/home and admin verification shell. Label them “Prototipo, no autenticación real”; never present this preview switcher as a production role selector, and do not imply it changes server permissions.

Minimum first-pass clickable flow: Login -> demo Patient Home -> Directory -> Therapist Profile -> Availability -> Booking Confirmation; Login -> demo Professional Home -> Agenda -> Patient -> Note -> Analysis -> Result; Login -> demo Admin -> Verification Queue -> Review -> Approve/Reject. Also make register, professional application and password-recovery links visibly present; recovery is a placeholder flow because its API is unspecified. Create each role's own shell/sidebar. Do not begin by rendering the patient home as the prototype's opening screen.

## 1. Shared Web Shells and Navigation

Stitch must produce three distinct authenticated shells; do not reuse one dashboard and only change the title.

| Shell | Left navigation | Header actions | Default route target after server-auth |
|---|---|---|---|
| Public/visitor | Inicio público, Acceso, Crear cuenta paciente, Solicitud profesional, Privacidad | Wordmark, Ingresar, Crear cuenta | Public entry |
| Patient | Inicio, Buscar profesionales, Mis citas, Notificaciones, Perfil | Breadcrumb, notification icon, profile/logout | PAT-01 |
| Therapist | Inicio, Agenda, Pacientes, Análisis/Historial, Disponibilidad, Notificaciones, Perfil | Breadcrumb, notification icon, verification badge, profile/logout | PRO-01 only if server role is therapist and verification permits clinical access |
| Administrator | Verificaciones, Auditoría (if authorized), Cuenta | Admin label, profile/logout | ADM-01 only when server grants admin |

Role is never selected as a security claim at login and is never trusted from browser state. Contextual login links may say “Acceso paciente/profesional/admin”, but the server determines the role. Unauthorized route -> SYS-01/403. A user with no verified professional status cannot reach PRO clinical screens.

### Desktop grid and brand

- Artboard: 1440×900 desktop; 12-column content grid, 260 px sidebar, 64 px top bar, 24 px gutters, content max-width about 1320 px.
- Use a compact, operational interface: dense appointment lists/tables, clear page title/actions, no nested cards or oversized hero.
- Deliver BRAND-01 variants as separate assets/frames: horizontal MindFlow wordmark, symbol/app mark, favicon, login lockup, monochrome/high-contrast, minimum clearspace and alt text. No logo asset exists in the repo; mark the created visual as **concept pending approval**.
- All pages need default/loading/empty/error/permission states. Never fill a screenshot with realistic-looking clinical information; use synthetic fixtures tagged DEMO.

## 2. Common Web Entry, Authentication and Onboarding

### BRAND-01 / PUB-01 — Launch and public entry

- **Purpose:** establish MindFlow identity and let a visitor enter without implying that clinical functions are already live.
- **Layout:** wordmark + concise non-emergency disclaimer; primary “Ingresar”, secondary “Crear cuenta de paciente”, tertiary “Soy profesional”. Privacy/footer links. No invented testimonials or clinical results.
- **Controls:** action buttons, loading, public help link only when verified crisis resources exist.
- **Data:** static product copy; no database entity. Resource contacts are not yet configured; use neutral placeholder copy.
- **Navigation:** sign-in -> AUTH-01; patient registration -> AUTH-02; professional request -> AUTH-03; auth success -> role-specific landing screen.

### AUTH-01 / AUTH-08 — Contextual sign-in variants

- **Purpose:** authenticate patient/professional/admin via one shared credential flow with optional contextual framing.
- **Layout:** centered form at 1440 px; email/password, reveal toggle, submit, generic error, recovery link. AUTH-08 produces three Stitch frames with context-specific headings but same security form.
- **Data:** target USER `email`, `role`, `is_active`; actual model uses `name`, `hashed_password`, `last_login` and only `therapist/admin`. No login endpoint exists.
- **Navigation:** success -> MFA AUTH-04 -> redirect from server to PAT-01, PRO-01 or ADM-01. Never send role in request as authority. Wrong credentials stay on form with non-enumerating error.

### AUTH-02 — Patient registration

- **Purpose:** create a patient account without collecting clinical history during signup.
- **Layout/controls:** email, display name, password + confirmation, privacy/consent link, submit; inline validation and generic duplicate-account handling.
- **Target data:** USER `email`, `display_name`, `role=patient`, `is_active`, `created_at`; consent `policy_version`, `policy_hash`, `accepted_at`, `withdrawn_at`.
- **Navigation:** registration -> AUTH-04 -> AUTH-05 when consent absent -> PAT-01. No patient role exists in the current SQLAlchemy model.

### AUTH-03 / ONB-PRO-01 / ONB-PRO-02 — Professional application and verification state

- **Purpose:** receive an application and keep the professional hidden from directory until admin verification.
- **Layout/controls:** email, display name, specialty, modality, service zone, professional license number; status frames pending, verified, rejected. Uploading a license image is excluded until secure file storage exists.
- **Target data:** USER plus THERAPIST_PROFILE `license_number`, `specialty`, `modality`, `service_zone`, `verification_status`, `verified_at`.
- **Navigation:** submit -> pending frame; approved -> AUTH-04/MFA then PRO-01; rejected -> status/support. Self-signup vs invitation is undecided; show as prototype assumption.

### AUTH-04 / AUTH-05 / AUTH-06 / AUTH-07 — MFA, consent, recovery and expired session

- MFA: six-digit OTP, masked destination, resend timer, invalid/expired/rate-limited states; second-factor provider is not implemented.
- Consent: readable policy version, explicit accept/reject, no prechecked box; no clinical treatment/reservation until accepted. Withdrawal action in PAT-14.
- Password reset: pending flow only; channel/token/expiry are not defined, so label frames “pendiente de contrato”.
- Expired session: hide protected content, return to AUTH-01, do not replay non-idempotent reservation/analysis automatically.
- None of these flows has an implemented API route.

## 3. ROLE 1 — PATIENT WEB EXPERIENCE

### PAT-01 — Patient home

- **Parent/navigation:** patient shell > Inicio.
- **Layout:** title/greeting; next appointment row; actions Buscar profesional, Ver citas, Ayuda; concise consent status and notification count only if API supplies them.
- **Components/data:** USER `display_name`; APPOINTMENT `id`, `therapist_id`, `starts_at`, `ends_at`, `status`; do not display note, analysis or risk data on home.
- **Actions:** next appointment -> PAT-09; search -> PAT-02; history -> PAT-08; help -> PAT-12.

### PAT-02 / PAT-03 — Professional directory and filters

- **Parent/navigation:** patient shell > Buscar profesionales.
- **Layout:** results table/list with persistent left filter panel. Filters are specialty, modality (in-person/virtual), service zone; sort policy must be approved, never AI recommendation.
- **Components/data:** verified badge; `USER.display_name`; THERAPIST_PROFILE `specialty`, `modality`, `service_zone`, `verification_status=verified`. License number is not public. No map, price, ratings or profile photo fields are defined.
- **States/actions:** empty/loading/API error; filter apply/reset; row -> PAT-04.

### PAT-04 — Public therapist profile

- **Parent/navigation:** PAT-02 > selected professional.
- **Layout:** profile header, specialty, modality and service zone; verified status; available slots preview if a valid API response exists.
- **Components/data:** USER `display_name`; THERAPIST_PROFILE approved public fields. No invented biography, exact address, fee or reviews.
- **Actions:** Select time -> PAT-05; back -> PAT-02.

### PAT-05 / PAT-06 / PAT-07 — Select, confirm and complete booking

- **Parent/navigation:** PAT-04 > availability.
- **Layout:** weekly availability at `America/Bogota`; confirmation summary shows therapist, date/time, modality and consent status.
- **Components/data:** AVAILABILITY_SLOT `id`, `therapist_id`, `starts_at`, `ends_at`, `status`; APPOINTMENT `patient_id`, `therapist_id`, `slot_id`, `starts_at`, `ends_at`, `status`. Session duration 45–60 minutes is an unresolved configuration.
- **Actions/states:** select -> confirm -> success only after API acknowledgement; conflict 409 refreshes slots; consent missing -> AUTH-05; no price/payment CTA in V1.

### PAT-08 / PAT-09 / PAT-10 — Appointment list, detail and reschedule

- **Parent/navigation:** patient shell > Mis citas.
- **Layout:** tabs Próximas/Historial; detail panel; reschedule flow with current appointment and free slots.
- **Components/data:** APPOINTMENT `id`, `starts_at`, `ends_at`, `status`, `created_at`, therapist public name. No patient-visible clinical notes.
- **Actions/states:** detail -> cancel modal MOD-01/reschedule PAT-10; server enforces 12-hour rule and atomic slot move; conflict -> refresh; hidden API data never inferred by UI.

### PAT-11 / PAT-12 — Risk self-report and crisis help

- **Parent/navigation:** patient home or public safe-entry > Solicitar ayuda.
- **Layout:** approved questionnaire content only; crisis screen has prominent locally verified resources and true alert-delivery/acknowledgement state.
- **Target data:** RISK_ASSESSMENT `patient_id`, `appointment_id?`, `source`, `self_report_level`, `status`, `created_at`, `acknowledged_at`.
- **Important:** questionnaire, risk levels and crisis phone numbers are absent from the API/data; use visibly synthetic placeholders, do not invent medical scale or show “therapist notified” without acknowledgement.

### PAT-13 / PAT-14 / PAT-15 — Notifications, privacy and patient profile

- **Parent/navigation:** patient shell > notification icon / Perfil.
- **Layout:** chronological non-clinical reminders; consent version/history; account name/email, MFA/security and logout.
- **Target data:** NOTIFICATION `channel`, `status`, `scheduled_at`, `sent_at`, `acknowledged_at`; CONSENT `policy_version`, `accepted_at`, `withdrawn_at`; USER `display_name`, `email`.
- **States/actions:** notification click -> PAT-09/PAT-12; revoke consent -> confirmation and server response; preferences/edit profile unavailable until API fields exist. Never put clinical content in notification preview.

## 4. ROLE 2 — THERAPIST / PROFESSIONAL WEB EXPERIENCE

### PRO-01 / PRO-02 — Therapist home and calendar

- **Parent/navigation:** therapist shell > Inicio/Agenda.
- **Layout:** schedule-first dashboard, appointment list/calendar, verification badge, pending alert count; calendar/list toggle and filters.
- **Target data:** THERAPIST_PROFILE `verification_status`; APPOINTMENT `starts_at`, `ends_at`, `status`; RISK_ASSESSMENT `status`; ANALYSIS `status`, `needs_review`.
- **Actions/states:** appointment -> PRO-03; alert -> PRO-16; patients -> PRO-04; availability -> PRO-13. Only server-authorized data appears.

### PRO-03 / PRO-04 / PRO-05 — Appointment, assigned-patient list and detail

- **Parent/navigation:** therapist shell > Agenda/Pacientes.
- **Layout:** patient table with metadata only; assigned patient profile with tabs Citas/Notas/Análisis/Consentimiento.
- **Target data:** APPOINTMENT plus explicit patient-therapist relationship; this relationship is missing from current models/ERD target and must be settled.
- **States/actions:** 403/404 for unassigned patients without leaking existence; selected patient -> PRO-05; appointment -> PRO-03; never use `patient_hash` as authorization.

### PRO-06 / PRO-07 — Compose, review and save clinical note

- **Parent/navigation:** PRO-03/PRO-05 > Crear nota.
- **Layout:** structured editor sections Motivo, Observaciones, Plan; review screen before save. Antecedents/risk fields are interview concepts but not formal RF-06 fields; don't add to payload until agreed.
- **Target entity:** CLINICAL_NOTE `appointment_id`, `patient_id`, `therapist_id`, `ciphertext`, `encryption_key_version`, `language`, `word_count`, timestamps; DTO field mapping still undecided.
- **Actions/security:** save -> success only after server acknowledgement; note encryption must happen server-side. No autosave into browser storage, analytics or logs. Current model stores plaintext `note_text`, so prototype must use synthetic data and must not claim secure persistence.

### PRO-08 / PRO-09 / PRO-10 — Request, process and review AI analysis

- **Parent/navigation:** authorized saved note > Analizar.
- **Layout:** explicit AI/anonymization disclosure; processing state; result page with textual disclaimer, emotion chart/table, evidence excerpts, cognitive signals and guiding questions.
- **Target entities:** ANALYSIS `clinical_note_id`, `status`, `provider_model`, `processing_time_seconds`, `needs_review`; EMOTION_SCORE 0–100; COGNITIVE_DISTORTION evidence/confidence; GUIDING_QUESTION content/category/priority.
- **Actions/states:** request -> pending -> complete/error; bounded retry/idempotency; only therapist assigned to patient; no diagnosis, prescription or specialist recommendation. Actual agent has no executable class or API route.

### PRO-11 / PRO-12 — History and report preview/export

- **Parent/navigation:** therapist shell > Análisis/Historial; PRO-10 > Exportar.
- **Layout:** chronological table with filters only if supported; report preview with ID/date/signals/evidence/questions/disclaimer.
- **Target data:** notes/analysis/report metadata; REPORT objective is encrypted ciphertext, but actual model has plaintext `generated_content`.
- **Actions:** export by explicit click only; do not send to patient or store in browser without approved policy; history is online-only in V1.

### PRO-13 / PRO-14 / PRO-15 / PRO-16 — Availability, alerts, profile and risk acknowledgement

- **Parent/navigation:** therapist shell > Disponibilidad/Notificaciones/Perfil.
- **Layout:** weekly slots editor; notification list without clinical data in push; professional settings and verification status; risk acknowledgement view.
- **Target data:** AVAILABILITY_SLOT `starts_at`, `ends_at`, `status`; NOTIFICATION delivery fields; THERAPIST_PROFILE public/admin fields; RISK_ASSESSMENT status/acknowledged_at.
- **Actions/states:** server prevents slot overlap; risk alert acknowledge only after server persistence; no false success; recurring week patterns and admin reject-reason field aren't defined.

## 5. ROLE 3 — ADMINISTRATOR (WEB ONLY IN V1)

### ADM-01 / ADM-02 / ADM-03 — Verification queue, review and decision

- **Parent/navigation:** administrator shell > Verificaciones.
- **Layout:** dense table of pending professional profiles, protected license detail panel, approve/reject modal. License number is never public.
- **Target data:** THERAPIST_PROFILE `license_number`, `specialty`, `modality`, `service_zone`, `verification_status`, `verified_at`; USER `email`, `display_name`.
- **Actions/states:** approval makes profile directory-visible; rejection stays hidden. Reject reason, attachment upload and verification provider are not modeled; don't invent as persisted.

### ADM-04 — Audit access log (restricted target screen)

- **Parent/navigation:** admin shell > Auditoría, only if policy grants it.
- **Layout:** filterable append-only table actor/action/resource/request ID/time; detail contains metadata only.
- **Target data:** AUDIT_EVENT `actor_user_id`, `action`, `resource_type`, `resource_id`, `request_id`, `occurred_at`; audit model and endpoint aren't implemented.
- **Actions:** no edit/delete; access to this screen is itself audited. Do not show note bodies.

ADM-05 framework configuration is an internal developer tool, **not a product screen** and excluded from Stitch unless the instructor explicitly requests a separate operations console.

## 6. GLOBAL, TRANSVERSAL & AUTHENTICATION FLOWS

Move/reuse from master: BRAND-01, PUB-01, AUTH-01..08, ONB-PAT-01, ONB-PRO-01/02; shared error screens SYS-01, SYS-02; modals MOD-01..15. Access/login context does not grant role; server session governs route visibility. Cover 401, 403, 404, 409, 422, 429, 5xx, maintenance, offline/loading/empty, consent rejected/withdrawn, unverified professional and role mismatch. No `Cmd+K` global search because it is absent from requirements; do not add it as a real feature.

### Implemented API/CRUD route audit (critical Stitch constraint)

Repository scan found no FastAPI app/router decorators, controllers, route definitions or frontend components/state management. `interfaces/api/main.py` is only a docstring stub. Therefore:

| Module/screens | Target entity/CRUD intent | Implemented endpoint in repo | Prototype behavior |
|---|---|---|---|
| AUTH/PAT-15 | User create/read/update/login/MFA | None | Synthetic/local-only frames; never claim integrated auth |
| PAT-02..10 / PRO-02..03 | Professional directory, availability, appointment CRUD | None | Mock slots with fake fixture labels; mark all mock |
| PAT-14/AUTH-05 | Consent create/read/withdraw | None | Clickable visual flow only, no persisted consent |
| PRO-04..07 | Assigned patients and clinical note create/read/update | None | Synthetic note; no real note text or database calls |
| PRO-08..10 | Analysis create/read/status | None | Synthetic `pending/completed/error` variants; no LLM calls |
| PRO-12 | Report generation/download | None | Visual export affordance marked demonstrative only |
| PAT-11/12, PRO-14/16 | Risk self-report, alert, acknowledgement | None | Placeholder resources/status; don't display real crisis numbers or sent status |
| ADM-01..04 | Verify therapist, audit read | None | Design-only; no real admin access boundary exists in code |

These are target CRUD intents inferred from RF/stories, **not APIs present in the repository**. Do not invent exact HTTP paths/methods as implemented. Proposed UI transitions use screen IDs only. Before binding data, create an approved OpenAPI contract and backend tests.

## 7. UI/UX DESIGN SYSTEM SPECIFICATION FOR STITCH

### Desktop Web Viewport: 1440 px

- Artboard exactly 1440×900. 12-column grid, content max-width 1320 px, desktop sidebar 260 px, top bar 64 px, 24 px gutters.
- Separate shell and side-nav active/expanded state for Patient, Therapist and Admin. Shared components must not collapse different task flows into one role dashboard.
- Table density appropriate for daily repeated operations; primary CTA per screen; responsive down to 1024/768 without horizontal page scroll.

### Data Binding Dictionary

Keep the target ERD dictionary currently present in the master under “Campos objetivo dibujados en ERD”. Entity bindings listed here are target-only; actual models differ as recorded below. Keys remain snake_case.

### Current source-of-truth data vs target schema

| Table/model actual in Python + migration | Exact current fields relevant to UI | Target ERD difference |
|---|---|---|
| `users` / `User` | `id`, `email`, `name`, `role` (`therapist/admin`), `hashed_password`, `is_therapist`, `created_at`, `last_login` | target expects `display_name`, role `patient/therapist/admin`, no redundant `is_therapist`, `is_active`, `last_login_at`; Patient role is missing |
| `clinical_notes` / `ClinicalNote` | `id`, `therapist_id`, `patient_hash CHAR(32)`, `note_text TEXT`, `language`, `word_count`, `created_at` | target patient/appointment FKs, ciphertext/key version; current plaintext column conflicts with encryption requirement |
| `analyses` / `Analysis` | `id`, `clinical_note_id`, `status`, `ia_model`, `processing_time`, `created_at` | target `provider_model`, `processing_time_seconds`, `needs_review` |
| `emotion_scores` / `EmotionScore` | `id`, `analysis_id`, `emotion_name`, `score FLOAT 0..1`, `confidence FLOAT 0..1`, `timestamp` | target score/confidence 0..100 and `created_at` |
| `cognitive_distortions` / `CognitiveDistortion` | `id`, `analysis_id`, `distortion_type`, `severity`, `description`, `detected_at` | target confidence 0..100 and literal `evidence_excerpt` |
| `guiding_questions` / `GuidingQuestion` | `id`, `analysis_id`, `question_text`, `category`, `priority`, `created_at` | close to target ERD |
| `reports` / `Report` | `id`, `analysis_id`, `format`, `generated_content`, `generated_at`, `word_count` | target encrypted ciphertext/key version; current plaintext is a security gap |

No entity/model/migration exists for `THERAPIST_PROFILE`, `CONSENT`, `AVAILABILITY_SLOT`, `APPOINTMENT`, `RISK_ASSESSMENT`, `NOTIFICATION`, `AUDIT_EVENT`. All page fixtures for these are target schema demo-only.

### Mobile Viewport: 390 px

- Mobile details and role-specific bottom tabs live in `STITCH_MOBILE_PROTOTYPE_SPEC.md`; do not reuse desktop frames scaled down. At 390 px use 16 px safe margins, safe-area insets and a 72 px bottom tab bar plus OS inset.

### Interaction, styling and accessibility

Use the palette, typography, density and WCAG criteria currently present in the master under “SYSTEMA DE DISEÑO”. No color-only statuses; chart has table/text alternate. English screen IDs may remain internal, but all user-facing copy is Colombian Spanish. Design logo as provisional asset, not official brand. Every loading/error/empty/permission state must be navigable and linked.

## 8. FLOWS AND COMPLETION GATE

Keep the core routes from the master: patient registration/consent -> directory -> booking; cancellation/reschedule; risk report -> truthful delivery status; therapist note -> analysis state -> reviewed result -> optional report; admin verification. Add these protocol gates:

- Desktop proof: patient/professional/admin shell distinct at 1440 px with role-appropriate navigation and links.
- No API/controller/component exists; prototype must label mock data and omit real integration claims.
- All screens in master inventory keep their IDs and role permissions; selected web frames in this file do not hide roles or states.
- Every entity/CRUD intent has a row in the route audit marked None until OpenAPI is implemented.
- No diagnosis, treatment recommendation, specialist recommendation, video, payment, offline clinical data, or unverified crisis-resource content in V1.
- Validate desktop click path using only synthetic fixtures; report unresolved decisions rather than guessing.
