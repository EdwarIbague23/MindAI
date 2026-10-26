import React, { useState, useEffect } from 'react';

interface TeleconsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientAvatar?: string;
  onOpenSoapNotes?: () => void;
}

export const TeleconsultaModal: React.FC<TeleconsultaModalProps> = ({
  isOpen,
  onClose,
  patientName = 'Camila Torres',
  patientAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDYcRj_u5eJ4dqNZZ7r777SLqCRPNn4DKoSvYMEJxZS401LEPHngIQ8e3Ho-tv7GWY9b-LcU2EnhgzyUZ9PqKE8chASi_ADJcFRdflp45N3t5YBuzHs0GWwaPyO0yeisJSN9MKYz-6tXkhluTlbXJJQOh1uimVmth_mFdEcImvzD7HlO-G2ZDb6kw7bBwkDErRhv000r32w8StfJbwap-jtLoMYyB1fQtOUesIJDH3w0RuxU7s6U6DvA',
  onOpenSoapNotes,
}) => {
  const [seconds, setSeconds] = useState(145); // Start at 2:25
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(true);
  const [liveNote, setLiveNote] = useState('Paciente relata que la técnica 4-7-8 le permitió disminuir la taquicardia al inicio de la jornada.');
  const [breathPhase, setBreathPhase] = useState<'Inhala' | 'Retén' | 'Exhala'>('Inhala');

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const phases: ('Inhala' | 'Retén' | 'Exhala')[] = ['Inhala', 'Retén', 'Exhala'];
    let idx = 0;
    const breathTimer = setInterval(() => {
      idx = (idx + 1) % 3;
      setBreathPhase(phases[idx]);
    }, 4000);
    return () => clearInterval(breathTimer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c1f1b]/90 backdrop-blur-md flex flex-col p-4 sm:p-6 text-on-primary animate-in fade-in">
      {/* Top Header Bar */}
      <div className="h-14 bg-surface-card/10 backdrop-blur-lg rounded-2xl px-5 flex items-center justify-between border border-white/10 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping" />
            <span className="text-[13px] font-semibold text-primary-fixed uppercase tracking-wider">
              Teleconsulta Encriptada WebRTC
            </span>
          </div>
          <span className="text-white/40">•</span>
          <span className="text-[14px] font-bold text-white">{patientName} — Sesión #05 (TCC)</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 font-mono text-[13px] text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-danger animate-pulse" />
            <span>{formatTime(seconds)} / 50:00</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/70 font-mono">
            <span>Latencia: 16ms</span>
            <span>•</span>
            <span>1080p 60fps</span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* Main Video & Drawer Area */}
      <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Patient Video Stream Viewport */}
        <div className="flex-1 relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
          <img 
            src={patientAvatar} 
            alt={patientName} 
            className="w-full h-full object-cover opacity-95 scale-[1.02]"
          />

          {/* Overlay badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <span className="w-2 h-2 rounded-full bg-status-success" />
            <span className="text-[12px] font-medium text-white">{patientName} (Audio Opus OK)</span>
          </div>

          <div className="absolute top-4 right-4 bg-status-success-surface/90 text-status-success text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            E2E AES-256 Activo
          </div>

          {/* Doctor Self Picture-in-Picture */}
          <div className="absolute bottom-5 right-5 w-44 h-32 rounded-xl overflow-hidden shadow-2xl border-2 border-primary-container bg-surface-card flex flex-col justify-end">
            <div className="w-full h-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center relative">
              <span className="material-symbols-outlined text-[48px] text-white/80">person</span>
              {isVideoOff && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-[11px] text-white">
                  Cámara Desactivada
                </div>
              )}
            </div>
            <div className="absolute bottom-1 left-2 text-[10px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded">
              Tú (Dr. Morales)
            </div>
          </div>

          {/* Therapist Guidance Overlay (Breathing Pacer) */}
          <div className="absolute bottom-5 left-5 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary-fixed flex items-center justify-center text-primary-fixed font-bold text-[11px] animate-pulse">
              4s
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Guía Respiración 4-7-8</p>
              <p className="text-[13px] font-bold text-primary-fixed">{breathPhase} profundamente...</p>
            </div>
          </div>
        </div>

        {/* Live Clinical Notes & Copilot Side Drawer */}
        {showNotesDrawer && (
          <aside className="w-80 lg:w-96 bg-surface-card rounded-2xl p-4 flex flex-col gap-3 text-on-surface border border-border-hairline shadow-2xl animate-in slide-in-from-right-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">edit_note</span>
                <span className="font-headline text-[14px] font-bold text-on-surface">Apuntes en Sesión</span>
              </div>
              <span className="text-[11px] text-status-success font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success" /> Auto-guardado
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Registro en Directo
              </label>
              <textarea
                value={liveNote}
                onChange={(e) => setLiveNote(e.target.value)}
                placeholder="Anotaciones fenomenológicas, distorsiones verbalizadas..."
                className="w-full flex-1 p-3 rounded-xl bg-surface-subtle text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary border border-border-hairline resize-none"
              />
            </div>

            {/* Live Copilot Insight Box */}
            <div className="p-3 rounded-xl bg-status-info-surface border border-status-info/20 text-[12px]">
              <div className="flex items-center gap-1.5 text-status-info font-bold mb-1">
                <span className="material-symbols-outlined text-[16px]">neurology</span>
                <span>Copilot Clínico Activo</span>
              </div>
              <p className="text-ink-muted leading-relaxed">
                Sugiere explorar la regla inflexible sobre "desempeño perfecto" antes de cerrar los últimos 15 min.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {onOpenSoapNotes && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenSoapNotes();
                  }}
                  className="w-full py-2.5 rounded-xl bg-primary-container text-on-primary text-[13px] font-semibold hover:bg-border-focus transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">note_add</span>
                  <span>Pasar a Nota SOAP Final</span>
                </button>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="h-16 flex items-center justify-center gap-3 mt-3">
        <div className="bg-surface-card/15 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isMuted ? 'bg-status-danger text-on-primary' : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isMuted ? 'Activar Micrófono' : 'Silenciar Micrófono'}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isMuted ? 'mic_off' : 'mic'}
            </span>
          </button>

          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isVideoOff ? 'bg-status-danger text-on-primary' : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isVideoOff ? 'Encender Cámara' : 'Apagar Cámara'}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isVideoOff ? 'videocam_off' : 'videocam'}
            </span>
          </button>

          <button 
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              showNotesDrawer ? 'bg-primary-container text-on-primary' : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title="Panel de notas"
          >
            <span className="material-symbols-outlined text-[22px]">edit_note</span>
          </button>

          <button 
            onClick={onClose}
            className="px-5 h-11 rounded-xl bg-status-danger hover:bg-status-danger/90 text-on-error text-[13px] font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ml-2"
          >
            <span className="material-symbols-outlined text-[20px]">call_end</span>
            <span>Finalizar Consulta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
