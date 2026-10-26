import React, { useState } from 'react';
import { NavigationPath } from '../../types/clinical';

interface CitaDetalleViewProps {
  onNavigate: (path: NavigationPath) => void;
  onStartTeleconsulta: () => void;
}

export const CitaDetalleView: React.FC<CitaDetalleViewProps> = ({
  onNavigate,
  onStartTeleconsulta,
}) => {
  const [copied, setCopied] = useState(false);
  const [quickNote, setQuickNote] = useState(
    '1. Repasar ejercicio de reestructuración del pensamiento #3 (reunión con jefatura).\n2. Preguntar por calidad del sueño: Camila anotó insomnio de conciliación el miércoles.\n3. Evaluar asignación del módulo de exposición graduada.'
  );
  const [noteSavedTime, setNoteSavedTime] = useState('Auto-guardado');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://telemed.mindflow.clinic/room/9402-camila-torres');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNotifyDelay = () => {
    setToastMessage('Notificación enviada por WhatsApp y SMS a Camila Torres indicando 5 min de espera.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveNote = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNoteSavedTime(`Guardado a las ${time}`);
    setToastMessage('Nota preliminar guardada en la ficha de la cita.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Breadcrumb & Live Session Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-[13px] text-ink-muted">
          <span onClick={() => onNavigate('agenda')} className="hover:text-primary cursor-pointer transition-colors">
            Agenda
          </span>
          <span className="material-symbols-outlined text-[15px] text-ink-tertiary">chevron_right</span>
          <span onClick={() => onNavigate('agenda')} className="hover:text-primary cursor-pointer transition-colors">
            Citas
          </span>
          <span className="material-symbols-outlined text-[15px] text-ink-tertiary">chevron_right</span>
          <span className="text-on-surface font-bold">CITA-9402</span>
        </div>

        <div className="flex items-center gap-2 bg-status-info-surface px-3 py-1 rounded-full text-status-info text-[11px] font-bold border border-status-info/20 w-fit">
          <span className="material-symbols-outlined text-[15px]">lock</span>
          <span>Túnel Seguro E2EE • Cumplimiento Ley 1090/2006</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-surface-card rounded-2xl shadow-sm p-6 lg:p-7 mb-6 border border-border-hairline flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full pointer-events-none blur-2xl" />
        
        <div className="space-y-1.5 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-headline text-[24px] lg:text-[26px] font-bold text-on-surface">
              Sesión Clínica Programada — CITA-9402
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-status-success-surface text-status-success text-[12px] font-bold flex items-center gap-1.5 border border-status-success/20">
              <span className="w-2 h-2 rounded-full bg-status-success animate-ping" />
              Confirmada para Hoy • 10:00 AM COT (En 12 minutos)
            </span>
          </div>
          <p className="text-[13px] text-ink-muted">
            Terapia Cognitivo-Conductual • Protocolo de Desensibilización y Regulación de Ansiedad
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button 
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl bg-surface-container text-primary text-[13px] font-bold hover:bg-mint-subtle transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? 'check' : 'share'}
            </span>
            <span>{copied ? '¡Enlace Copiado!' : 'Compartir Enlace'}</span>
          </button>
          
          <button 
            onClick={() => onNavigate('paciente-detalle')}
            className="px-4 py-2.5 rounded-xl bg-surface-container text-ink-muted hover:text-on-surface text-[13px] font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-border-hairline"
          >
            <span className="material-symbols-outlined text-[18px]">history_edu</span>
            <span>Expediente Completo</span>
          </button>
        </div>
      </div>

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 8 Columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Patient Summary Card */}
          <div className="bg-surface-card rounded-2xl shadow-sm p-6 border border-border-hairline relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDYcRj_u5eJ4dqNZZ7r777SLqCRPNn4DKoSvYMEJxZS401LEPHngIQ8e3Ho-tv7GWY9b-LcU2EnhgzyUZ9PqKE8chASi_ADJcFRdflp45N3t5YBuzHs0GWwaPyO0yeisJSN9MKYz-6tXkhluTlbXJJQOh1uimVmth_mFdEcImvzD7HlO-G2ZDb6kw7bBwkDErRhv000r32w8StfJbwap-jtLoMYyB1fQtOUesIJDH3w0RuxU7s6U6DvA"
                    alt="Camila Torres"
                    className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-primary/20"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-status-success rounded-full ring-2 ring-surface-card animate-pulse" title="Conectada en sala de espera" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 
                      onClick={() => onNavigate('paciente-detalle')}
                      className="font-headline text-[20px] font-bold text-on-surface hover:text-primary transition-colors cursor-pointer"
                    >
                      Camila Torres V.
                    </h2>
                    <span className="text-[12px] text-ink-muted">(28 años)</span>
                  </div>
                  <p className="text-[13px] text-ink-muted mt-0.5">
                    Plan Activo: <strong className="text-on-surface font-semibold">Psicoterapia Individual TCC</strong>
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-surface-container text-[11px] font-bold text-on-secondary-container">
                      Sesión #05 de 12 previstas
                    </span>
                    <span className="text-ink-tertiary text-[11px]">• Última hace 7 días</span>
                  </div>
                </div>
              </div>

              {/* Progress Ring Gauge */}
              <div className="flex items-center gap-3 bg-surface-subtle p-3 rounded-xl sm:self-center border border-border-hairline/60">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-border-hairline"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="text-primary"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="42, 100"
                      strokeLinecap="round"
                      strokeWidth="3.2"
                    />
                  </svg>
                  <span className="absolute text-[12px] font-bold text-primary">42%</span>
                </div>
                <div className="flex flex-col pr-1">
                  <span className="text-[12px] font-bold text-on-surface">Avance del Plan</span>
                  <span className="text-[11px] text-ink-muted">Fase de Consolidación</span>
                </div>
              </div>
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-border-hairline text-center">
              <div className="p-2.5 rounded-xl bg-surface-subtle">
                <span className="text-[11px] text-ink-muted block font-medium">Adherencia a Tareas</span>
                <span className="font-headline text-[17px] text-status-success font-bold">92%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-subtle">
                <span className="text-[11px] text-ink-muted block font-medium">Ansiedad Basal (GAD-7)</span>
                <span className="font-headline text-[17px] text-status-warning font-bold">11 / 21</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-subtle">
                <span className="text-[11px] text-ink-muted block font-medium">Puntualidad Global</span>
                <span className="font-headline text-[17px] text-primary font-bold">100%</span>
              </div>
            </div>
          </div>

          {/* Master Teleconsulta Launcher */}
          <div className="bg-gradient-to-br from-primary via-primary-container to-inverse-surface rounded-2xl shadow-md p-6 lg:p-7 text-on-primary relative overflow-hidden">
            {/* Wave decoration */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-end pr-4">
              <svg className="h-44 w-auto" fill="none" stroke="currentColor" viewBox="0 0 120 100">
                <path d="M10 50 Q 20 20, 30 50 T 50 50 T 70 50 T 90 50 T 110 50" strokeLinecap="round" strokeWidth="4" />
                <path d="M10 50 Q 20 5, 30 50 T 50 50 T 70 50 T 90 50 T 110 50" opacity="0.6" strokeLinecap="round" strokeWidth="2" />
                <path d="M10 50 Q 20 35, 30 50 T 50 50 T 70 50 T 90 50 T 110 50" opacity="0.4" strokeLinecap="round" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 bg-primary-fixed/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-primary-fixed/30">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed animate-ping" />
                  <span className="text-[11px] text-primary-fixed uppercase tracking-wider font-bold">
                    Sala cifrada de teleconsulta lista
                  </span>
                </div>
                <div className="flex items-center gap-2 text-primary-fixed text-[11px] font-mono">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>WebRTC E2E • Audio Opus 48kHz</span>
                </div>
              </div>

              <div className="max-w-xl mb-6">
                <h3 className="font-headline text-[24px] font-bold text-on-primary mb-2">Sala Virtual de Consulta 01</h3>
                <p className="text-[14px] text-on-primary-container leading-relaxed">
                  La paciente Camila Torres ya se encuentra en la sala de espera virtual (esperando desde las 09:56 AM). Ambos dispositivos han aprobado el handshake criptográfico.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button 
                  onClick={onStartTeleconsulta}
                  className="px-6 py-3.5 rounded-xl bg-surface-card text-primary font-headline text-[15px] font-bold hover:bg-mint-subtle hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[24px] animate-pulse">videocam</span>
                  <span>Iniciar Videoconsulta HD Segura</span>
                </button>
                
                <button 
                  onClick={() => {
                    setToastMessage('Audio y video probados: Micrófono OK, Altavoces OK, Cámara 1080p OK.');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="px-4 py-3.5 rounded-xl bg-on-primary/10 hover:bg-on-primary/20 backdrop-blur text-on-primary text-[13px] font-semibold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[19px]">tune</span>
                  <span>Test de audio/video</span>
                </button>
              </div>
            </div>

            {/* Telemetry Footer */}
            <div className="mt-6 pt-3 border-t border-on-primary/15 flex flex-wrap items-center justify-between text-on-primary/70 text-[11px]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success" /> Latencia: 18ms
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">videocam</span> 1080p 60fps
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">mic</span> Supresión IA activada
                </span>
              </div>
              <span className="font-mono">Servidor Bogotá DC (AWS sa-east-1)</span>
            </div>
          </div>

          {/* Historial de Sesiones Previas */}
          <div className="bg-surface-card rounded-2xl shadow-sm p-6 border border-border-hairline">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">history</span>
                <h3 className="font-headline text-[17px] font-bold text-on-surface">Historial de Sesiones Previas (Extracto)</h3>
              </div>
              <button 
                onClick={() => onNavigate('notas-clinicas')}
                className="text-[12px] text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Ver 4 notas clínicas</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>

            <div className="space-y-3">
              {/* Sesión 04 */}
              <div className="p-4 rounded-xl bg-surface-subtle hover:bg-surface-container transition-all border border-border-hairline/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px] text-on-surface">Sesión #04 — Regulación Emocional y Trazado de Gatillos</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-ink-muted text-[11px] font-semibold">
                      Evolución Favorable
                    </span>
                  </div>
                  <span className="text-[11px] text-ink-muted">10 Oct 2024 • 52 min</span>
                </div>
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  Paciente reportó reducción en ataques de pánico nocturnos tras aplicación de técnica de anclaje sensory 5-4-3-2-1. Se pactó iniciar autorregistro de distorsiones catastróficas en entorno laboral.
                </p>
              </div>

              {/* Sesión 03 */}
              <div className="p-4 rounded-xl bg-surface-subtle hover:bg-surface-container transition-all border border-border-hairline/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px] text-on-surface">Sesión #03 — Reestructuración Cognitiva e Identificación de Esquemas</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-ink-muted text-[11px] font-semibold">
                      Completada
                    </span>
                  </div>
                  <span className="text-[11px] text-ink-muted">26 Sep 2024 • 49 min</span>
                </div>
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  Identificación del pensamiento automático predominante: "Si cometo un error, perderé la aprobación del equipo". Cuestionamiento socrático y asignación de lectura psicoeducativa sobre falacia de control.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Agenda Management */}
          <div className="bg-surface-card rounded-2xl shadow-sm p-5 border border-border-hairline">
            <h4 className="text-[11px] uppercase tracking-wider text-ink-muted mb-3 font-bold">
              Gestión Inmediata de Agenda
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button 
                onClick={() => onNavigate('agenda')}
                className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-status-warning">edit_calendar</span>
                <span>Reprogramar cita médica</span>
              </button>
              
              <button 
                onClick={handleNotifyDelay}
                className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-status-info">hourglass_top</span>
                <span>Notificar retraso de 5 min</span>
              </button>
              
              <button 
                onClick={() => {
                  setToastMessage('Apertura de diálogo para cancelación bajo política sanitaria.');
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-4 py-2.5 rounded-xl bg-status-danger-surface hover:bg-status-danger/15 text-status-danger text-[12px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-status-danger/20"
              >
                <span className="material-symbols-outlined text-[18px]">event_busy</span>
                <span>Cancelar cita</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Columns (Checklist & Notes) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Checklist Previo */}
          <div className="bg-surface-card rounded-2xl shadow-sm p-6 border border-border-hairline">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">fact_check</span>
                <h3 className="font-headline text-[16px] font-bold text-on-surface">Checklist Previo a Sesión</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-status-success-surface text-status-success text-[11px] font-bold border border-status-success/20">
                3/3 Listo
              </span>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="p-3 rounded-xl bg-surface-subtle flex items-start gap-3 border border-border-hairline/60">
                <div className="w-6 h-6 rounded-full bg-status-success-surface text-status-success flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-on-surface">Consentimiento Informado</span>
                  <span className="text-[12px] text-ink-muted">Versión 1.2 digital firmada y verificada OTP</span>
                  <span className="text-[11px] text-ink-tertiary mt-0.5">Vigente hasta Dic 2025</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-3 rounded-xl bg-surface-subtle flex items-start gap-3 border border-border-hairline/60">
                <div className="w-6 h-6 rounded-full bg-status-warning-surface text-status-warning flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">mood_bad</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-on-surface">Autorreporte Emocional</span>
                    <span className="px-1.5 py-0.2 rounded bg-status-warning-surface text-status-warning text-[10px] font-bold">
                      Ansiedad 3/5
                    </span>
                  </div>
                  <span className="text-[12px] text-ink-muted">Completado hoy hace 1h (9:00 AM)</span>
                  <div className="w-full bg-border-hairline h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-status-warning h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-3 rounded-xl bg-surface-subtle flex items-start gap-3 border border-border-hairline/60">
                <div className="w-6 h-6 rounded-full bg-status-success-surface text-status-success flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[13px] font-bold text-on-surface">Tarea Intersesión Enviada</span>
                  <span className="text-[12px] text-ink-muted">Registro de 4 pensamientos disfuncionales cargado anoche.</span>
                  <button 
                    onClick={() => onNavigate('analisis-copilot-ia')}
                    className="mt-1.5 text-[11px] text-primary font-bold hover:underline text-left flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    <span>Previsualizar plantilla de Camila</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notas Rápidas Preliminares */}
          <div className="bg-surface-card rounded-2xl shadow-sm p-6 border border-border-hairline flex flex-col flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">draw</span>
                <h3 className="font-headline text-[16px] font-bold text-on-surface">Notas Rápidas Preliminares</h3>
              </div>
              <span className="text-[11px] text-ink-muted">{noteSavedTime}</span>
            </div>
            
            <p className="text-[12px] text-ink-muted mb-3 leading-relaxed">
              Espacio privado confidencial para registrar hipótesis diagnósticas o focos de intervención antes de la llamada.
            </p>

            <div className="flex-1 flex flex-col">
              <textarea 
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                rows={6}
                className="w-full flex-1 p-3 rounded-xl bg-surface-subtle text-on-surface text-[13px] focus:outline-none focus:ring-2 focus:ring-primary border border-border-hairline resize-y leading-relaxed font-sans"
              />
              
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-hairline">
                <span className="text-[11px] text-ink-tertiary">Privado: Sólo Dr. Morales</span>
                <button 
                  onClick={handleSaveNote}
                  className="px-3.5 py-1.5 rounded-lg bg-surface-container text-primary text-[12px] font-bold hover:bg-mint-subtle transition-all cursor-pointer shadow-xs"
                >
                  Guardar Nota
                </button>
              </div>
            </div>
          </div>

          {/* Copilot Clínico Sugiere */}
          <div className="bg-status-info-surface rounded-2xl p-4 border border-status-info/20 flex items-start gap-3">
            <span className="material-symbols-outlined text-status-info text-[22px] shrink-0 mt-0.5">neurology</span>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-status-info">Copilot Clínico Sugiere</span>
                <span className="text-[11px] text-ink-muted">Basado en GAD-7</span>
              </div>
              <p className="text-[12px] text-on-surface leading-relaxed">
                La paciente mantuvo estabilidad emocional en las últimas 72 horas. Se recomienda priorizar la fase de debate socrático antes de introducir el role-playing planificado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-on-primary px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[20px] text-secondary-fixed">info</span>
          <span className="text-[13px] font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
