import React, { useState } from 'react';
import { NavigationPath } from '../../types/clinical';

interface AgendaViewProps {
  onNavigate: (path: NavigationPath) => void;
  onOpenBookingModal: (initialTime?: string) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  onNavigate,
  onOpenBookingModal,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(24); // Jueves 24
  const [viewMode, setViewMode] = useState<'dia' | 'semana' | 'mes'>('semana');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast('Calendarios sincronizados exitosamente con Google y Outlook.');
      setTimeout(() => setSyncToast(null), 3500);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-ink-muted">
            <span className="text-[12px] uppercase tracking-wider font-bold text-primary">Agenda Terapéutica</span>
            <span className="inline-block w-1 h-1 rounded-full bg-border-hairline" />
            <div className="flex items-center gap-1 text-[12px] text-ink-tertiary">
              <span className="material-symbols-outlined text-[15px]">public</span>
              <span>America/Bogota (COT - UTC-5)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <div className="flex items-center gap-1 bg-surface-card rounded-xl p-1 shadow-sm border border-border-hairline">
              <button 
                onClick={() => {
                  setSyncToast('Cargando semana anterior: 13 al 19 de Octubre');
                  setTimeout(() => setSyncToast(null), 2500);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button 
                onClick={() => {
                  setSyncToast('Visualizando semana en curso');
                  setTimeout(() => setSyncToast(null), 2500);
                }}
                className="px-3 h-8 rounded-lg text-[13px] font-semibold text-ink-muted hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              >
                Hoy
              </button>
              <button 
                onClick={() => {
                  setSyncToast('Cargando semana siguiente: 27 de Octubre al 02 de Noviembre');
                  setTimeout(() => setSyncToast(null), 2500);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            <h2 className="font-headline text-[20px] lg:text-[22px] text-on-surface font-bold tracking-tight">
              Semana del 20 al 26 de Octubre, 2025
            </h2>
          </div>
        </div>

        {/* View Switchers & Action Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-surface-card p-1 rounded-xl shadow-sm border border-border-hairline flex items-center">
            <button 
              onClick={() => setViewMode('dia')}
              className={`py-1.5 px-3 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
                viewMode === 'dia' ? 'bg-primary-container text-on-primary shadow-xs' : 'text-ink-muted hover:text-on-surface'
              }`}
            >
              Día
            </button>
            <button 
              onClick={() => setViewMode('semana')}
              className={`py-1.5 px-3 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
                viewMode === 'semana' ? 'bg-primary-container text-on-primary shadow-xs' : 'text-ink-muted hover:text-on-surface'
              }`}
            >
              Semana
            </button>
            <button 
              onClick={() => setViewMode('mes')}
              className={`py-1.5 px-3 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer ${
                viewMode === 'mes' ? 'bg-primary-container text-on-primary shadow-xs' : 'text-ink-muted hover:text-on-surface'
              }`}
            >
              Mes
            </button>
          </div>

          <button 
            onClick={() => onOpenBookingModal('16:00')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary text-[13px] font-bold hover:bg-border-focus transition-all shadow-[0_2px_8px_rgba(23,107,91,0.25)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>+ Bloquear Horario / Cita Manual</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Weekly Schedule + Day Detail Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Weekly Time Grid */}
        <div className="flex flex-col bg-surface-card rounded-2xl shadow-sm p-5 border border-border-hairline overflow-hidden">
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between pb-4 mb-3 border-b border-border-hairline gap-3">
            <div className="flex flex-wrap items-center gap-4 text-[12px] text-ink-muted">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-primary-container shadow-xs" />
                <span className="text-on-surface font-semibold">Cita Confirmada (Pacientes)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-secondary-container" />
                <span className="text-on-surface font-semibold">Disponible Portal Público</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-surface-container-high" />
                <span className="text-on-surface font-semibold">Revisión Clínica / Bloqueo</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-surface-subtle px-3 py-1 rounded-lg text-ink-muted text-[11px] font-semibold border border-border-hairline/60">
              <span className="material-symbols-outlined text-[15px] text-status-success">verified_user</span>
              <span>Cifrado HIPAA / End-to-End</span>
            </div>
          </div>

          {/* Time Slot Columns */}
          <div className="overflow-x-auto select-none">
            <div className="min-w-[760px]">
              {/* Day Headers */}
              <div className="grid grid-cols-[68px_repeat(5,1fr)] gap-2 pb-3">
                <div className="text-right pr-2">
                  <span className="text-[11px] font-bold text-ink-tertiary uppercase">Hora</span>
                </div>
                
                {[
                  { name: 'Lun', day: 20 },
                  { name: 'Mar', day: 21 },
                  { name: 'Mié', day: 22 },
                  { name: 'Jue', day: 24, active: true },
                  { name: 'Vie', day: 25 },
                ].map((item) => (
                  <div
                    key={item.day}
                    onClick={() => setSelectedDay(item.day)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
                      item.active
                        ? 'bg-mint-subtle shadow-xs border border-primary/20 ring-1 ring-primary/20'
                        : 'bg-surface-subtle/70 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className={`text-[11px] uppercase font-bold ${item.active ? 'text-primary' : 'text-ink-muted'}`}>
                        {item.name}
                      </span>
                      {item.active && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                    </div>
                    <span className={`font-headline text-[18px] font-bold ${item.active ? 'text-primary' : 'text-on-surface'}`}>
                      {item.day}
                    </span>
                    {item.active && (
                      <span className="text-[10px] text-primary-container font-bold uppercase mt-0.5">
                        Seleccionado
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Time Slot Rows */}
              <div className="relative grid grid-cols-[68px_repeat(5,1fr)] gap-2 mt-1">
                {/* Hours column */}
                <div className="flex flex-col justify-between py-1 text-right pr-2 text-[12px] font-mono text-ink-tertiary">
                  <div className="h-16 flex items-start justify-end">08:00 AM</div>
                  <div className="h-16 flex items-start justify-end">09:00 AM</div>
                  <div className="h-16 flex items-start justify-end">10:00 AM</div>
                  <div className="h-16 flex items-start justify-end">11:00 AM</div>
                  <div className="h-16 flex items-start justify-end">12:00 PM</div>
                  <div className="h-16 flex items-start justify-end">01:00 PM</div>
                  <div className="h-16 flex items-start justify-end">02:00 PM</div>
                  <div className="h-16 flex items-start justify-end">03:00 PM</div>
                  <div className="h-16 flex items-start justify-end">04:00 PM</div>
                  <div className="h-16 flex items-start justify-end">05:00 PM</div>
                </div>

                {/* Lunes Column */}
                <div className="space-y-2 flex flex-col">
                  <div className="h-16 p-2 rounded-xl bg-surface-container flex flex-col justify-between">
                    <span className="text-[10px] font-medium text-ink-muted">08:00 - 09:00</span>
                    <span className="text-[12px] font-semibold text-ink-muted truncate">Revisión Casos Matutina</span>
                  </div>
                  <div 
                    onClick={() => onOpenBookingModal('09:00')}
                    className="h-16 p-2 rounded-xl bg-secondary-container/60 hover:bg-secondary-container transition-colors cursor-pointer flex flex-col justify-between group"
                  >
                    <span className="text-[10px] font-bold text-on-secondary-container">09:00 - 09:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">add</span> Disponible
                    </span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-xs flex flex-col justify-between hover:bg-border-focus transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">10:00 - 10:50</span>
                      <span className="material-symbols-outlined text-[14px]">videocam</span>
                    </div>
                    <span className="text-[12px] font-bold truncate">David Gómez</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">11:00 - 11:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container/70 flex items-center justify-center text-ink-tertiary text-[11px] font-medium">
                    Almuerzo Clínico
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container flex flex-col justify-between">
                    <span className="text-[10px] font-medium text-ink-muted">01:00 - 02:00</span>
                    <span className="text-[12px] font-semibold text-ink-muted truncate">Supervisión Residentes</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-xs flex flex-col justify-between hover:bg-border-focus transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">02:00 - 02:50</span>
                      <span className="material-symbols-outlined text-[14px]">room</span>
                    </div>
                    <span className="text-[12px] font-bold truncate">Marcela Niño</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-xs flex flex-col justify-between hover:bg-border-focus transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">03:00 - 03:50</span>
                      <span className="material-symbols-outlined text-[14px]">videocam</span>
                    </div>
                    <span className="text-[12px] font-bold truncate">Javier Santos</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">04:00 - 04:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container-high flex flex-col justify-between">
                    <span className="text-[10px] font-medium text-ink-muted">05:00 - 06:00</span>
                    <span className="text-[12px] font-bold text-ink-muted truncate">Cierre Administrativo</span>
                  </div>
                </div>

                {/* Martes Column */}
                <div className="space-y-2 flex flex-col">
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">08:00 - 08:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-xs flex flex-col justify-between hover:bg-border-focus transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">09:00 - 09:50</span>
                      <span className="material-symbols-outlined text-[14px]">videocam</span>
                    </div>
                    <span className="text-[12px] font-bold truncate">Carolina Vélez</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container flex flex-col justify-between">
                    <span className="text-[10px] font-medium text-ink-muted">10:00 - 11:00</span>
                    <span className="text-[12px] font-semibold text-ink-muted truncate">Triage Emergencias</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">11:00 - 11:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container/70 flex items-center justify-center text-ink-tertiary text-[11px] font-medium">
                    Almuerzo Clínico
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-xs flex flex-col justify-between hover:bg-border-focus transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">01:00 - 01:50</span>
                      <span className="material-symbols-outlined text-[14px]">room</span>
                    </div>
                    <span className="text-[12px] font-bold truncate">Sofía Restrepo</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">02:00 - 02:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-xs flex flex-col justify-between hover:bg-border-focus transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">03:00 - 03:50</span>
                      <span className="material-symbols-outlined text-[14px]">videocam</span>
                    </div>
                    <span className="text-[12px] font-bold truncate">Nicolás Cárdenas</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">04:00 - 04:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container-high flex flex-col justify-between">
                    <span className="text-[10px] font-medium text-ink-muted">05:00 - 06:00</span>
                    <span className="text-[12px] font-bold text-ink-muted truncate">Análisis Copilot IA</span>
                  </div>
                </div>

                {/* Miércoles Column */}
                <div className="space-y-2 flex flex-col">
                  <div className="h-16 p-2 rounded-xl bg-surface-container flex flex-col justify-between">
                    <span className="text-[10px] font-medium text-ink-muted">08:00 - 09:00</span>
                    <span className="text-[12px] font-semibold text-ink-muted truncate">Ateneo Semanal</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">09:00 - 09:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">10:00 - 10:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-xs flex flex-col justify-between hover:bg-border-focus transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">11:00 - 11:50</span>
                      <span className="material-symbols-outlined text-[14px]">videocam</span>
                    </div>
                    <span className="text-[12px] font-bold truncate">Laura Pardo</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container/70 flex items-center justify-center text-ink-tertiary text-[11px] font-medium">
                    Almuerzo Clínico
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">01:00 - 01:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-xs flex flex-col justify-between hover:bg-border-focus transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">02:00 - 02:50</span>
                      <span className="material-symbols-outlined text-[14px]">room</span>
                    </div>
                    <span className="text-[12px] font-bold truncate">Martín Silva</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">03:00 - 03:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container-high flex flex-col justify-between">
                    <span className="text-[10px] font-medium text-ink-muted">04:00 - 05:00</span>
                    <span className="text-[12px] font-bold text-ink-muted truncate">Comité Ético Colpsic</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container flex flex-col justify-between">
                    <span className="text-[10px] font-medium text-ink-muted">05:00 - 06:00</span>
                    <span className="text-[12px] font-semibold text-ink-muted truncate">Revisión Fichas</span>
                  </div>
                </div>

                {/* Jueves 24 (Highlighted Active Day) */}
                <div className="space-y-2 flex flex-col bg-surface-container-lowest/50 rounded-xl p-1 shadow-[inset_0_0_12px_rgba(23,107,91,0.08)] border border-primary/20">
                  <div className="h-16 p-2 rounded-xl bg-surface-container flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-ink-muted">08:00 - 09:00</span>
                      <span className="material-symbols-outlined text-[14px] text-ink-muted">lock</span>
                    </div>
                    <span className="text-[12px] font-bold text-on-surface truncate">Revisión de Casos</span>
                  </div>

                  <div 
                    onClick={() => onOpenBookingModal('09:00')}
                    className="h-16 p-2 rounded-xl bg-secondary-container/70 flex flex-col justify-between hover:bg-secondary-container transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] font-bold text-on-secondary-container">09:00 - 09:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span> Disponible Portal
                    </span>
                  </div>

                  {/* 10:00 AM Camila Torres -> CLICK OPENS CITA DETALLE */}
                  <div 
                    onClick={() => onNavigate('cita-detalle')}
                    className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-md flex flex-col justify-between hover:bg-border-focus transition-all cursor-pointer transform hover:-translate-y-0.5 border border-white/10"
                    title="Click para entrar a la sala virtual"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">10:00 - 10:50 AM</span>
                      <span className="px-1.5 py-0.2 rounded bg-on-primary/20 text-on-primary text-[10px] font-bold">TCC</span>
                    </div>
                    <div>
                      <p className="font-headline text-[13px] font-bold leading-tight truncate">Camila Torres</p>
                      <p className="text-[10px] opacity-80 truncate">Sesión 05 · Ansiedad Generalizada</p>
                    </div>
                  </div>

                  {/* 11:30 AM Felipe M. */}
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-md flex flex-col justify-between hover:bg-border-focus transition-all cursor-pointer transform hover:-translate-y-0.5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">11:30 - 12:20 PM</span>
                      <span className="px-1.5 py-0.2 rounded bg-on-primary/20 text-on-primary text-[10px] font-bold">Telemedicina</span>
                    </div>
                    <div>
                      <p className="font-headline text-[13px] font-bold leading-tight truncate">Felipe M.</p>
                      <p className="text-[10px] opacity-80 truncate">Seguimiento Farmacológico</p>
                    </div>
                  </div>

                  <div className="h-16 p-2 rounded-xl bg-surface-container/70 flex items-center justify-center text-ink-tertiary text-[11px] font-medium">
                    <span className="material-symbols-outlined text-[15px] mr-1">restaurant</span> 12:30 - 01:30 PM
                  </div>

                  <div className="h-16 p-2 rounded-xl bg-surface-container flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-ink-muted">01:30 - 02:00 PM</span>
                      <span className="material-symbols-outlined text-[14px] text-ink-muted">psychology</span>
                    </div>
                    <span className="text-[12px] font-semibold text-ink-muted truncate">Supervisión Clínica</span>
                  </div>

                  {/* 02:00 PM Andrea R. */}
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-md flex flex-col justify-between hover:bg-border-focus transition-all cursor-pointer transform hover:-translate-y-0.5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">02:00 - 02:50 PM</span>
                      <span className="px-1.5 py-0.2 rounded bg-on-primary/20 text-on-primary text-[10px] font-bold">Presencial</span>
                    </div>
                    <div>
                      <p className="font-headline text-[13px] font-bold leading-tight truncate">Andrea R.</p>
                      <p className="text-[10px] opacity-80 truncate">Evaluación Diagnóstica</p>
                    </div>
                  </div>

                  {/* 03:00 PM Guillermo L. */}
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-md flex flex-col justify-between hover:bg-border-focus transition-all cursor-pointer transform hover:-translate-y-0.5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">03:00 - 03:50 PM</span>
                      <span className="px-1.5 py-0.2 rounded bg-on-primary/20 text-on-primary text-[10px] font-bold">Telemedicina</span>
                    </div>
                    <div>
                      <p className="font-headline text-[13px] font-bold leading-tight truncate">Guillermo L.</p>
                      <p className="text-[10px] opacity-80 truncate">TFE Sesión de Cierre</p>
                    </div>
                  </div>

                  {/* 04:00 PM Espacio Libre Reservable */}
                  <div 
                    onClick={() => onOpenBookingModal('16:00')}
                    className="h-16 p-2 rounded-xl bg-secondary-container/90 hover:bg-secondary-container transition-all cursor-pointer flex flex-col justify-between shadow-xs border border-secondary-fixed"
                    title="Click para asignar paciente"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-on-secondary-container">04:00 - 04:50 PM</span>
                      <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-on-secondary-container leading-tight">Espacio Libre</p>
                      <p className="text-[10px] text-on-secondary-container opacity-85">Abierto a reservas</p>
                    </div>
                  </div>

                  <div className="h-16 p-2 rounded-xl bg-surface-container-high flex flex-col justify-between">
                    <span className="text-[10px] font-medium text-ink-muted">05:00 - 06:00 PM</span>
                    <span className="text-[12px] font-bold text-ink-muted truncate">Cierre & Notas SOAP</span>
                  </div>
                </div>

                {/* Viernes Column */}
                <div className="space-y-2 flex flex-col">
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">08:00 - 08:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-xs flex flex-col justify-between hover:bg-border-focus transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">09:00 - 09:50</span>
                      <span className="material-symbols-outlined text-[14px]">videocam</span>
                    </div>
                    <span className="text-[12px] font-bold truncate">Esteban Morales</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-xs flex flex-col justify-between hover:bg-border-focus transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">10:00 - 10:50</span>
                      <span className="material-symbols-outlined text-[14px]">room</span>
                    </div>
                    <span className="text-[12px] font-bold truncate">Valentina Ruiz</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">11:00 - 11:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container/70 flex items-center justify-center text-ink-tertiary text-[11px] font-medium">
                    Almuerzo Clínico
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-secondary-container/60 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-on-secondary-container">01:00 - 01:50</span>
                    <span className="text-[12px] font-bold text-on-secondary-container truncate">Disponible</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-primary-container text-on-primary shadow-xs flex flex-col justify-between hover:bg-border-focus transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold opacity-90">02:00 - 02:50</span>
                      <span className="material-symbols-outlined text-[14px]">videocam</span>
                    </div>
                    <span className="text-[12px] font-bold truncate">Paula Domínguez</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container flex flex-col justify-between">
                    <span className="text-[10px] font-medium text-ink-muted">03:00 - 04:00</span>
                    <span className="text-[12px] font-semibold text-ink-muted truncate">Balance Semanal</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container-high flex flex-col justify-between">
                    <span className="text-[10px] font-medium text-ink-muted">04:00 - 05:00</span>
                    <span className="text-[12px] font-bold text-ink-muted truncate">Mesa Técnica Triage</span>
                  </div>
                  <div className="h-16 p-2 rounded-xl bg-surface-container flex items-center justify-center text-ink-tertiary text-[11px] font-medium">
                    Fin Jornada
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Detalle del Día & Sincronización */}
        <div className="w-full flex flex-col gap-4">
          {/* Detalle del Día */}
          <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-hairline">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-hairline">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-ink-tertiary font-bold">Detalle del Día</span>
                <h3 className="font-headline text-[18px] text-on-surface font-bold leading-tight">
                  Jueves, {selectedDay} de Octubre
                </h3>
              </div>
              <span className="w-9 h-9 rounded-full bg-status-success-surface flex items-center justify-center text-status-success">
                <span className="material-symbols-outlined text-[20px]">event_available</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="bg-surface-container p-3 rounded-xl flex flex-col">
                <span className="text-[11px] text-ink-muted">Sesiones Activas</span>
                <span className="font-headline text-[24px] font-bold text-primary">4</span>
                <span className="text-[10px] text-ink-tertiary mt-0.5">100% confirmadas</span>
              </div>
              <div className="bg-status-success-surface p-3 rounded-xl flex flex-col border border-status-success/20">
                <span className="text-[11px] text-status-success font-semibold">Espacios Libres</span>
                <span className="font-headline text-[24px] font-bold text-status-success">1</span>
                <span className="text-[10px] text-status-success font-medium mt-0.5">04:00 PM Disponible</span>
              </div>
            </div>

            {/* Daily Timeline */}
            <div className="space-y-2 mb-4">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block mb-1">
                Línea de Tiempo Clínica
              </span>

              <div 
                onClick={() => onNavigate('cita-detalle')}
                className="p-3 rounded-xl bg-mint-subtle hover:bg-mint-subtle/80 transition-colors flex items-start gap-2.5 cursor-pointer border border-primary/20"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-primary-container mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-primary">10:00 - 10:50 AM</span>
                    <span className="text-[10px] text-ink-muted font-medium">Telemedicina</span>
                  </div>
                  <p className="text-[13px] text-on-surface font-bold truncate">Camila Torres</p>
                  <p className="text-[11px] text-ink-tertiary truncate">Sesión 5 · Ansiedad Generalizada</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle hover:bg-surface-container transition-colors flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-container mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-primary">11:30 - 12:20 PM</span>
                    <span className="text-[10px] text-ink-muted">Presencial</span>
                  </div>
                  <p className="text-[13px] text-on-surface font-bold truncate">Felipe M.</p>
                  <p className="text-[11px] text-ink-tertiary truncate">Revisión de Tratamiento</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle hover:bg-surface-container transition-colors flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-container mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-primary">02:00 - 02:50 PM</span>
                    <span className="text-[10px] text-ink-muted">Presencial</span>
                  </div>
                  <p className="text-[13px] text-on-surface font-bold truncate">Andrea R.</p>
                  <p className="text-[11px] text-ink-tertiary truncate">Evaluación Diagnóstica</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle hover:bg-surface-container transition-colors flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-container mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-primary">03:00 - 03:50 PM</span>
                    <span className="text-[10px] text-ink-muted">Telemedicina</span>
                  </div>
                  <p className="text-[13px] text-on-surface font-bold truncate">Guillermo L.</p>
                  <p className="text-[11px] text-ink-tertiary truncate">TFE Sesión de Cierre</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-secondary-container/80 flex items-start gap-2.5 border border-secondary-fixed">
                <span className="material-symbols-outlined text-[18px] text-on-secondary-container shrink-0 mt-0.5">lock_open</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-on-secondary-container">04:00 - 04:50 PM</span>
                    <span className="px-1.5 py-0.2 bg-white/60 rounded text-[10px] text-on-secondary-container font-bold">Vacante</span>
                  </div>
                  <p className="text-[13px] text-on-secondary-container font-semibold truncate">Espacio Libre Reservable</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onOpenBookingModal('16:00')}
              className="w-full py-2.5 px-4 rounded-xl bg-surface-subtle text-primary text-[13px] font-bold hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-border-hairline"
            >
              <span className="material-symbols-outlined text-[18px]">add_box</span>
              <span>Asignar Paciente a las 04:00 PM</span>
            </button>
          </div>

          {/* Sincronización Calendarios */}
          <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-hairline">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">sync_alt</span>
                <h4 className="font-headline text-[15px] font-bold text-on-surface">Sincronización</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-status-success-surface text-status-success text-[11px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                En línea
              </span>
            </div>
            
            <p className="text-[12px] text-ink-muted mb-3 leading-relaxed">
              Sincronización bidireccional activa. Los eventos personales de tus calendarios bloquean turnos clínicos automáticamente.
            </p>

            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-status-info">calendar_today</span>
                  <span className="text-[12px] font-semibold text-on-surface">Google Calendar</span>
                </div>
                <span className="text-[11px] text-status-success font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">check</span> Hace 4m
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                  <span className="text-[12px] font-semibold text-on-surface">Outlook 365</span>
                </div>
                <span className="text-[11px] text-status-success font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">check</span> Hace 9m
                </span>
              </div>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="w-full py-2.5 px-4 rounded-xl bg-secondary-container text-on-secondary-container text-[13px] font-bold hover:bg-secondary-fixed transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Calendario'}</span>
            </button>
          </div>

          {/* Cancellation Policy Banner */}
          <div className="p-3.5 rounded-xl bg-status-warning-surface flex items-start gap-2.5 border border-status-warning/20">
            <span className="material-symbols-outlined text-status-warning text-[20px] shrink-0 mt-0.5">info</span>
            <div>
              <p className="text-[12px] text-status-warning font-bold">Política de Cancelación</p>
              <p className="text-[11px] text-ink-muted leading-tight mt-0.5">
                Aviso mínimo de 24h para pacientes. Modificaciones de urgencia alertan al equipo de guardia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-on-primary px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[20px] text-secondary-fixed">check_circle</span>
          <span className="text-[13px] font-semibold">{syncToast}</span>
        </div>
      )}
    </div>
  );
};
