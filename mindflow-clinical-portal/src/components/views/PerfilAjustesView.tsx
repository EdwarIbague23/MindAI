import React, { useState } from 'react';
import { NavigationPath } from '../../types/clinical';

export const PerfilAjustesView: React.FC = () => {
  const [twoFactor, setTwoFactor] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [patientReminders, setPatientReminders] = useState(true);
  const [morningSummary, setMorningSummary] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                Profesional Colegiado Colpsic
              </span>
              <span className="text-xs text-ink-muted">Matrícula: 109284-CO • REPS 1100129841-01</span>
            </div>
            <h1 className="text-2xl font-bold font-serif text-ink-primary mt-1">
              Perfil Profesional & Seguridad de la Práctica
            </h1>
            <p className="text-xs text-ink-muted">
              Administración de credenciales deontológicas, llaves de firma criptográfica y protocolos de seguridad.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.01]"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              Guardar Cambios
            </button>
          </div>
        </div>

        {savedToast && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
              <span>Preferencias y parámetros de seguridad actualizados con éxito.</span>
            </div>
            <button onClick={() => setSavedToast(false)} className="text-emerald-700 hover:text-emerald-900">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Doctor Profile Card */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-surface-card border border-border-light rounded-2xl p-6 shadow-xs text-center space-y-4">
            <div className="relative inline-block mx-auto">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=240&auto=format&fit=crop&q=80"
                alt="Dr. Mateo Arboleda"
                className="w-28 h-28 rounded-2xl object-cover border-2 border-primary/20 mx-auto shadow-sm"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="En Línea">
                <span className="material-symbols-outlined text-[12px]">check</span>
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold font-serif text-ink-primary">Dr. Mateo Arboleda Restrepo</h2>
              <p className="text-xs font-medium text-primary">Psicólogo Clínico & Especialista en TCC</p>
              <p className="text-[11px] text-ink-muted mt-0.5">Mg. en Neuropsicología y Conducta • Univ. de los Andes</p>
            </div>

            <div className="p-3 rounded-xl bg-canvas border border-border-light text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Colegio de Psicólogos:</span>
                <span className="font-semibold text-ink-primary">Colpsic #109284</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Estado Deontológico:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Vigente / Habilitado
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">REPS MinSalud:</span>
                <span className="font-mono text-ink-primary">1100129841-01</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Sede Principal:</span>
                <span className="text-ink-primary font-medium">Torre Médica Chico, Of. 604</span>
              </div>
            </div>

            <div className="pt-2">
              <button className="w-full py-2 rounded-xl border border-border-light hover:bg-canvas text-ink-secondary text-xs font-medium transition-colors">
                Actualizar Foto y Biografía
              </button>
            </div>
          </div>

          {/* Quick Support & Legal */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Soporte Asistencial MindFlow
            </h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Mesa de ayuda prioritaria y asesoría jurídico-legal en historias clínicas con respuesta en menos de 15 minutos.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs">
              <button className="flex-1 py-1.5 rounded-lg bg-canvas border border-border-light hover:bg-slate-100 font-medium text-ink-primary">
                Línea PBX Colpsic
              </button>
              <button className="flex-1 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20">
                Chat Soporte 24/7
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Cryptographic Security & Communication Preferences */}
        <div className="lg:col-span-8 space-y-6">
          {/* Security & Cryptography Card */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif text-ink-primary">
                  Criptografía y Firma Electrónica Cualificada
                </h3>
                <p className="text-xs text-ink-muted">
                  Llaves asimétricas para el sellado inmutable de notas SOAP (Resolución 1995/1999).
                </p>
              </div>
              <span className="p-2 rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[22px]">security</span>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-canvas border border-border-light space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-ink-primary block">
                    Par de Llaves ED25519 Activo
                  </span>
                  <span className="text-[11px] font-mono text-ink-muted block mt-0.5">
                    Huella SHA-256: d8:4a:91:fc:22:bb:71:09:aa:19:9f:3b:04:e8:11:cc
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                  Válido hasta Oct 2026
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-light">
                <button
                  onClick={() => alert('Descargando certificado de llave pública (X.509 PEM)...')}
                  className="px-3 py-1.5 rounded-lg bg-surface-card border border-border-light hover:bg-slate-100 text-ink-primary text-xs font-medium flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">download</span>
                  Descargar Certificado Público (.crt)
                </button>
                <button
                  onClick={() => alert('Generando nuevo par de claves ED25519 con verificación en hardware...')}
                  className="px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">refresh</span>
                  Rotar Claves Criptográficas
                </button>
              </div>
            </div>

            {/* 2FA Section */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <h4 className="text-xs font-bold text-ink-primary">
                  Autenticación de Dos Factores (2FA - TOTP)
                </h4>
                <p className="text-xs text-ink-muted">
                  Requiere código de 6 dígitos mediante Google Authenticator o Authy al firmar notas.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={() => setTwoFactor(!twoFactor)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Practice & Notification Settings */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-serif text-ink-primary">
              Notificaciones & Automatización de la Práctica
            </h3>

            <div className="space-y-4 divide-y divide-border-light text-xs">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="font-semibold text-ink-primary block">
                    Alertas Críticas de Triage por SMS / WhatsApp
                  </span>
                  <span className="text-ink-muted text-[11px] block mt-0.5">
                    Notificación instantánea en tu móvil si un paciente registra riesgo alto en cuestionarios.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={() => setSmsAlerts(!smsAlerts)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <span className="font-semibold text-ink-primary block">
                    Recordatorios Automatizados a Pacientes
                  </span>
                  <span className="text-ink-muted text-[11px] block mt-0.5">
                    Envío de enlaces seguros de teleconsulta 24 horas y 2 horas antes de cada sesión.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={patientReminders}
                    onChange={() => setPatientReminders(!patientReminders)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <span className="font-semibold text-ink-primary block">
                    Resumen Matutino de Agenda Clínica
                  </span>
                  <span className="text-ink-muted text-[11px] block mt-0.5">
                    Envío diario a las 07:00 AM con desglose de pacientes del día y pendientes SOAP.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={morningSummary}
                    onChange={() => setMorningSummary(!morningSummary)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
