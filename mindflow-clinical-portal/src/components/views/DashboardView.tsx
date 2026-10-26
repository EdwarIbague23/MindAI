import React, { useState } from 'react';
import { NavigationPath } from '../../types/clinical';
import { PATIENTS } from '../../data/mockClinicalData';

interface DashboardViewProps {
  onNavigate: (path: NavigationPath) => void;
  onOpenQuickNote: () => void;
  onStartTeleconsulta: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenQuickNote,
  onStartTeleconsulta,
}) => {
  const [isValidated, setIsValidated] = useState(false);

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Welcome Banner */}
      <div className="relative bg-surface-card rounded-2xl p-6 lg:p-8 shadow-sm overflow-hidden mb-6 border border-border-hairline">
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-gradient-to-br from-primary-fixed/30 via-secondary-container/20 to-transparent blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Sesión Activa</span>
              <span className="w-1 h-1 rounded-full bg-ink-tertiary" />
              <span className="text-[12px] font-medium text-ink-muted">Jueves, 24 Octubre 2025</span>
              <span className="px-2.5 py-0.5 rounded-full bg-status-success-surface text-status-success text-[11px] flex items-center gap-1 font-bold border border-status-success/20">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Colpsic Matrícula #104829
              </span>
            </div>

            <h1 className="font-headline text-[28px] lg:text-[32px] font-bold text-on-surface tracking-tight">
              Bienvenido, Dr. Alejandro Morales
            </h1>

            <div className="flex items-center gap-3 text-ink-muted text-[13px] flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-on-surface">
                <span className="material-symbols-outlined text-[17px] text-primary">psychology</span>
                Especialidad: Psicología Clínica / TCC (Cognitivo-Conductual)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-status-success font-semibold">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                Canal Teleconsulta Seguro Listo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              onClick={onOpenQuickNote}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container text-primary text-[13px] font-bold hover:bg-mint-subtle transition-all cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              <span>Nota Rápida</span>
            </button>
            <button
              onClick={onStartTeleconsulta}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary text-[13px] font-bold shadow-md hover:bg-border-focus transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] animate-pulse">videocam</span>
              <span>Sala de Espera (1)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Metric Mosaic */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* Citas de Hoy */}
        <div 
          onClick={() => onNavigate('agenda')}
          className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-hairline flex flex-col justify-between hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">Citas de Hoy</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline text-[36px] font-bold text-on-surface">4</span>
                <span className="text-[13px] text-ink-muted">consultas</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">calendar_today</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-hairline/60 flex flex-col gap-1.5">
            <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden flex">
              <div className="bg-status-success h-full" style={{ width: '50%' }} />
              <div className="bg-status-warning h-full" style={{ width: '25%' }} />
              <div className="bg-ink-tertiary/40 h-full" style={{ width: '25%' }} />
            </div>
            <div className="flex items-center justify-between text-[11px] text-ink-muted">
              <span>2 completadas</span>
              <span className="text-status-warning font-bold">1 en 12m</span>
              <span>1 tarde</span>
            </div>
          </div>
        </div>

        {/* Pacientes Activos */}
        <div 
          onClick={() => onNavigate('pacientes')}
          className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-hairline flex flex-col justify-between hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">Pacientes Activos</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline text-[36px] font-bold text-on-surface">28</span>
                <span className="text-[12px] text-status-success font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[15px]">trending_up</span> +3 este mes
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[22px]">groups</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-border-hairline/60">
            <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
              <span className="material-symbols-outlined text-[16px] text-primary">task_alt</span>
              <span>89% adherencia terapéutica</span>
            </div>
            <span className="text-[12px] text-primary font-bold hover:underline">Ver panel</span>
          </div>
        </div>

        {/* Alertas de Riesgo */}
        <div 
          onClick={() => onNavigate('alertas-de-riesgo')}
          className="bg-status-danger-surface rounded-2xl p-5 shadow-sm border border-status-danger/20 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-danger animate-ping" />
                <span className="text-[11px] font-bold text-status-danger uppercase tracking-wider">Alertas de Riesgo</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline text-[36px] font-bold text-status-danger">1</span>
                <span className="text-[12px] text-status-danger font-medium">Requiere revisión</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center text-status-danger">
              <span className="material-symbols-outlined text-[22px]">crisis_alert</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-status-danger/20">
            <span className="text-[12px] text-status-danger font-bold truncate">Camila Torres (Moderado)</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-card text-status-danger text-[11px] font-bold shadow-xs">Nivel 3/5</span>
          </div>
        </div>

        {/* Horas Clínicas */}
        <div 
          onClick={() => onNavigate('disponibilidad')}
          className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-hairline flex flex-col justify-between hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">Horas Clínicas / Semana</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-headline text-[36px] font-bold text-on-surface">22<span className="text-[20px] text-ink-muted font-normal">/30h</span></span>
                <span className="text-[12px] text-ink-muted">73% cupo</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[22px]">timelapse</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-border-hairline/60">
            <div className="w-full flex items-center gap-2">
              <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full rounded-full" style={{ width: '73.3%' }} />
              </div>
              <span className="text-[11px] font-bold text-primary whitespace-nowrap">8h libres</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Columns: 4 cols Agenda / 5 cols Tareas / 3 cols Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Agenda Inmediata (4 cols) */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-hairline">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-primary" />
                <h2 className="font-headline text-[17px] font-bold text-on-surface">Agenda Inmediata</h2>
              </div>
              <span className="text-[11px] font-bold text-ink-muted bg-surface-container px-2.5 py-0.5 rounded-full">Hoy</span>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-hairline">
              {/* Camila Torres */}
              <div className="relative">
                <span className="absolute -left-[27px] top-2 w-3.5 h-3.5 rounded-full bg-status-warning ring-4 ring-status-warning-surface" />
                <div className="bg-status-warning-surface rounded-xl p-3.5 border border-status-warning/25 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-primary-container ring-1 ring-primary/20 shrink-0">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDYcRj_u5eJ4dqNZZ7r777SLqCRPNn4DKoSvYMEJxZS401LEPHngIQ8e3Ho-tv7GWY9b-LcU2EnhgzyUZ9PqKE8chASi_ADJcFRdflp45N3t5YBuzHs0GWwaPyO0yeisJSN9MKYz-6tXkhluTlbXJJQOh1uimVmth_mFdEcImvzD7HlO-G2ZDb6kw7bBwkDErRhv000r32w8StfJbwap-jtLoMYyB1fQtOUesIJDH3w0RuxU7s6U6DvA"
                          alt="Camila Torres"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-headline text-[14px] font-bold text-on-surface leading-tight">Camila Torres</h3>
                        <p className="text-[11px] text-ink-muted">Sesión #5 • TCC Ansiedad Generalizada</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-status-warning text-on-primary text-[11px] font-bold">10:00 AM</span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-status-warning">
                    <span className="flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[15px] animate-pulse">timer</span> En 12 minutos
                    </span>
                    <span className="text-ink-muted">Modalidad: Virtual E2E</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onNavigate('cita-detalle')}
                      className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-primary-container text-on-primary text-[12px] font-bold hover:bg-border-focus transition-all shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">video_call</span>
                      <span>Ingresar E2E</span>
                    </button>
                    <button 
                      onClick={() => onNavigate('notas-clinicas')}
                      className="w-full flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-surface-card text-on-surface text-[12px] font-bold hover:bg-surface-subtle transition-all border border-border-hairline cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-ink-muted">menu_book</span>
                      <span>Abrir Notas</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Felipe Mendoza */}
              <div className="relative">
                <span className="absolute -left-[27px] top-2 w-3.5 h-3.5 rounded-full bg-ink-tertiary" />
                <div 
                  onClick={() => onNavigate('agenda')}
                  className="bg-surface-subtle hover:bg-surface-container rounded-xl p-3.5 border border-border-hairline/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary shrink-0">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt6BxmnJaJO0NSGicwucIvXpNkOC3E4_RsVVz3BwbL07u9PPi2-pT3EpQv05hxaEBhQtkyJ4N0mZQ-XastC4CItxgPhq_RYfUTSgV6V4VEsziKkUSamFpvlZKyqs2J2y7YaSzxmeIAU3ygbcznULB8myuVffccz0giHa0J0BGiPlmiuUWZCvk3x0K3Fsv4lPNdg2PHmpxno6QmzmHL-YzoSxfvZ4glrVeR34mj7qh7kKlzQOXQrRCdqw"
                          alt="Felipe Mendoza"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-headline text-[14px] font-bold text-on-surface leading-tight">Felipe Mendoza</h3>
                        <p className="text-[11px] text-ink-muted">Sesión #3 • Manejo de Duelo</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-card text-ink-muted text-[11px] font-semibold">11:30 AM</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted">
                    <span>Modalidad: Consultorio 302</span>
                    <span className="text-status-success font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">check</span> Confirmado
                    </span>
                  </div>
                </div>
              </div>

              {/* Sofia Valderrama */}
              <div className="relative">
                <span className="absolute -left-[27px] top-2 w-3.5 h-3.5 rounded-full bg-ink-tertiary" />
                <div 
                  onClick={() => onNavigate('agenda')}
                  className="bg-surface-subtle hover:bg-surface-container rounded-xl p-3.5 border border-border-hairline/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-primary shrink-0">
                        <img 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnsoO7hOFxz6cN8c4kylep71AQcrcBJrHedWHnNWRV4PrcOL81D2V9elsrsSi4Xgo7f2wbbhoiQzpUd5EEDsJv5w0kShokjCM_WMJMHN478pLOPvZ_e808KgY_y8Iiy0TF2jSOHQDb0R-kIVCdvvJ02MIE9AH08prNRMfuYp6VY2y48qbL78gZvlsCeNdOSvpSK7we3S0iHCueB75zkO2xIvIdDUBh6WHUwQbSIjl3Q_wSR6ynz965ew"
                          alt="Sofia Valderrama"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-headline text-[14px] font-bold text-on-surface leading-tight">Sofia Valderrama</h3>
                        <p className="text-[11px] text-ink-muted">Sesión #12 • Evaluación Cierre TCC</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-card text-ink-muted text-[11px] font-semibold">03:00 PM</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted">
                    <span>Modalidad: Virtual E2E</span>
                    <span className="text-status-info font-semibold">Enlace Enviado</span>
                  </div>
                </div>
              </div>

              {/* Julian Restrepo (Completada) */}
              <div className="relative opacity-60">
                <span className="absolute -left-[27px] top-2 w-3.5 h-3.5 rounded-full bg-status-success" />
                <div className="p-2 flex items-center justify-between text-[12px]">
                  <span className="text-ink-muted line-through">08:30 AM • Julian Restrepo</span>
                  <span className="text-status-success font-semibold text-[11px]">Completada</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('agenda')}
              className="mt-4 w-full py-2.5 rounded-xl bg-surface-container text-primary text-[13px] font-bold hover:bg-mint-subtle transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ver Toda la Agenda Semanal</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Teleconsulta Segura E2E Card */}
          <div 
            onClick={() => onNavigate('cita-detalle')}
            className="bg-gradient-to-br from-primary-container to-secondary p-4 rounded-2xl text-on-primary shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-card/15 flex items-center justify-center backdrop-blur-md">
                <span className="material-symbols-outlined text-[22px]">lock</span>
              </div>
              <div>
                <p className="font-headline text-[14px] font-bold leading-tight">Teleconsulta Segura E2E</p>
                <p className="text-[11px] opacity-80 mt-0.5">Cifrado WebRTC de grado médico</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] opacity-75">shield</span>
          </div>
        </section>

        {/* Center Column: Seguimiento de Tareas & Ánimo Semanal (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-hairline">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-secondary" />
                <h2 className="font-headline text-[17px] font-bold text-on-surface">Seguimiento de Tareas Clínicas</h2>
              </div>
              <div className="flex items-center gap-1 text-[12px]">
                <span className="text-ink-muted">Adherencia Semanal:</span>
                <span className="font-bold text-status-success">84%</span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Camila Torres */}
              <div 
                onClick={() => onNavigate('paciente-detalle')}
                className="bg-surface-subtle hover:bg-surface-container rounded-xl p-3.5 transition-colors cursor-pointer border border-border-hairline/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-[13px]">
                      CT
                    </div>
                    <div>
                      <h3 className="font-headline text-[14px] font-bold text-on-surface leading-tight">Camila Torres (29a)</h3>
                      <p className="text-[11px] text-ink-muted">Impresión: Trastorno Ansiedad Generalizada (F41.1)</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-status-danger-surface text-status-danger text-[11px] font-bold">Atención</span>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] bg-surface-card/70 p-2.5 rounded-lg">
                  <div>
                    <span className="block text-ink-tertiary">Mood Tracker:</span>
                    <span className="font-bold text-status-warning">Completado 5/7 días</span>
                  </div>
                  <div>
                    <span className="block text-ink-tertiary">Registro Pensamientos:</span>
                    <span className="font-bold text-on-surface">3 registros nuevos</span>
                  </div>
                </div>
              </div>

              {/* Felipe Mendoza */}
              <div 
                onClick={() => onNavigate('pacientes')}
                className="bg-surface-subtle hover:bg-surface-container rounded-xl p-3.5 transition-colors cursor-pointer border border-border-hairline/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container text-[13px]">
                      FM
                    </div>
                    <div>
                      <h3 className="font-headline text-[14px] font-bold text-on-surface leading-tight">Felipe Mendoza (34a)</h3>
                      <p className="text-[11px] text-ink-muted">Impresión: Reacción de Adaptación Depresiva (F43.2)</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-status-success-surface text-status-success text-[11px] font-bold">Estable</span>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] bg-surface-card/70 p-2.5 rounded-lg">
                  <div>
                    <span className="block text-ink-tertiary">Mood Tracker:</span>
                    <span className="font-bold text-status-success">Completado 7/7 días</span>
                  </div>
                  <div>
                    <span className="block text-ink-tertiary">Activación Conductual:</span>
                    <span className="font-bold text-on-surface">Caminatas 4/4 cumplidas</span>
                  </div>
                </div>
              </div>

              {/* Sofia Valderrama */}
              <div 
                onClick={() => onNavigate('pacientes')}
                className="bg-surface-subtle hover:bg-surface-container rounded-xl p-3.5 transition-colors cursor-pointer border border-border-hairline/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-mint-subtle flex items-center justify-center font-bold text-primary text-[13px]">
                      SV
                    </div>
                    <div>
                      <h3 className="font-headline text-[14px] font-bold text-on-surface leading-tight">Sofia Valderrama (24a)</h3>
                      <p className="text-[11px] text-ink-muted">Impresión: Fobia Social en remisión (F40.1)</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-status-info-surface text-status-info text-[11px] font-bold">Fase Cierre</span>
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] bg-surface-card/70 p-2.5 rounded-lg">
                  <div>
                    <span className="block text-ink-tertiary">Mood Tracker:</span>
                    <span className="font-bold text-status-success">6/7 días estables</span>
                  </div>
                  <div>
                    <span className="block text-ink-tertiary">Exposición Gradual:</span>
                    <span className="font-bold text-on-surface">Nivel 4 superado</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 flex items-center justify-between gap-3">
              <button 
                onClick={() => onNavigate('paciente-detalle')}
                className="flex-1 py-2 px-3 rounded-lg bg-surface-container text-primary text-[12px] font-bold hover:bg-mint-subtle transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">add_task</span>
                <span>Asignar Tarea TCC</span>
              </button>
              <button 
                onClick={() => onNavigate('disponibilidad')}
                className="flex-1 py-2 px-3 rounded-lg bg-surface-subtle text-ink-muted text-[12px] font-bold hover:bg-surface-container hover:text-on-surface transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">tune</span>
                <span>Ajustar Disponibilidad</span>
              </button>
            </div>
          </div>

          {/* Evolución Semanal de Estado de Ánimo */}
          <div className="bg-surface-card rounded-2xl p-5 shadow-sm border border-border-hairline">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
                <span className="font-headline text-[15px] font-bold text-on-surface">Evolución de Estado de Ánimo (Semanal)</span>
              </div>
              <span className="text-[11px] text-ink-muted">Muestra 28 pacientes</span>
            </div>
            <div className="w-full h-24 flex items-end gap-2 pt-2 px-2">
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-secondary-container rounded-t h-12" title="Lunes" />
                <span className="text-[11px] text-ink-muted">Lun</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-secondary-container rounded-t h-14" title="Martes" />
                <span className="text-[11px] text-ink-muted">Mar</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary-container rounded-t h-16" title="Miércoles" />
                <span className="text-[11px] text-primary font-bold">Mié</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-secondary-container rounded-t h-11" title="Jueves" />
                <span className="text-[11px] text-ink-muted">Jue</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-secondary-container rounded-t h-15" title="Viernes" />
                <span className="text-[11px] text-ink-muted">Vie</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-secondary-fixed rounded-t h-10" title="Sábado" />
                <span className="text-[11px] text-ink-muted">Sáb</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-secondary-fixed rounded-t h-8" title="Domingo" />
                <span className="text-[11px] text-ink-muted">Dom</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Monitor de Alertas & Copilot IA (3 cols) */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          {/* Monitor de Alertas */}
          <div className="bg-surface-card rounded-2xl p-4 shadow-sm border border-border-hairline border-l-4 border-l-status-warning">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-status-warning text-[20px]">notification_important</span>
                <h2 className="font-headline text-[15px] font-bold text-on-surface">Monitor de Alertas</h2>
              </div>
              <span className="w-2 h-2 rounded-full bg-status-warning animate-ping" />
            </div>

            <div className="bg-status-warning-surface rounded-xl p-3 border border-status-warning/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-status-warning uppercase tracking-wider">Alerta Triage Activa</span>
                <span className="text-[11px] text-ink-muted">Hace 42 min</span>
              </div>
              <p className="font-headline text-[14px] font-bold text-on-surface mt-1">Camila Torres (Sesión 10:00 AM)</p>
              
              <div className="mt-2 text-[12px] text-ink-muted bg-surface-card/85 p-2.5 rounded-lg space-y-1">
                <p><strong className="text-on-surface">Motivo:</strong> Elevación en autorreporte GAD-7 (Puntaje 16 / Nivel 3 de 5).</p>
                <p><strong className="text-on-surface">Sensor:</strong> Reporte de insomnio de 3 noches consecutivas y rumiación recurrente.</p>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={() => setIsValidated(!isValidated)}
                  className={`w-full py-2 px-3 rounded-lg text-on-primary text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                    isValidated ? 'bg-status-success' : 'bg-status-warning hover:bg-status-warning/90'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isValidated ? 'verified' : 'verified_user'}
                  </span>
                  <span>{isValidated ? 'Validado por Terapeuta ✓' : 'Revisar y Validar Protocolo'}</span>
                </button>
                <button 
                  onClick={() => onNavigate('paciente-detalle')}
                  className="w-full py-1.5 px-3 rounded-lg bg-surface-card text-ink-muted text-[11px] font-semibold hover:text-on-surface hover:bg-surface-subtle transition-all cursor-pointer border border-border-hairline/60"
                >
                  Ver Historial de Escalas Previas
                </button>
              </div>
            </div>

            <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-ink-muted border-t border-border-hairline/60">
              <span>Otras alertas 24h:</span>
              <span className="font-bold text-status-success">0 Críticas • 0 Altas</span>
            </div>
          </div>

          {/* Copilot Clínico IA */}
          <div className="bg-surface-card rounded-2xl p-4 shadow-sm border border-border-hairline">
            <h3 className="font-headline text-[15px] font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">smart_toy</span>
              <span>Copilot Clínico IA</span>
            </h3>
            <p className="text-[12px] text-ink-muted leading-relaxed">
              Resumen para la sesión con Camila Torres listo: Se recomienda explorar técnicas de defusión cognitiva y revisar registros de catastrofización laboral.
            </p>
            <button 
              onClick={() => onNavigate('analisis-copilot-ia')}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-mint-subtle text-primary text-[12px] font-bold hover:bg-secondary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">auto_stories</span>
              <span>Abrir Plan Sugerido</span>
            </button>
          </div>

          {/* Protocolo Crisis Rápido */}
          <div className="bg-surface-card rounded-2xl p-4 shadow-sm border border-border-hairline">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Protocolo Crisis Rápido</span>
              <span className="material-symbols-outlined text-[18px] text-ink-muted">call</span>
            </div>
            <div className="flex flex-col gap-1.5 text-[12px]">
              <div className="p-2.5 rounded-lg bg-surface-subtle flex items-center justify-between text-on-surface">
                <span>Línea 106 Bogotá (Salud Mental)</span>
                <span className="font-bold text-primary">Marcación 106</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-subtle flex items-center justify-between text-on-surface">
                <span>Ambulancia Médica / Triage</span>
                <span className="font-bold text-primary">123</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Legal Banner */}
      <footer className="mt-8 pt-4 border-t border-border-hairline/60 flex flex-col md:flex-row items-center justify-between text-[11px] text-ink-tertiary gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-primary">security</span>
          <span>Entorno Clínico Cifrado AES-256 • Conforme a HIPAA y Ley 1581 (Colombia)</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Sesión protegida por Colpsic Hub ID</span>
          <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
          <span>Soporte MindFlow Activo</span>
        </div>
      </footer>
    </div>
  );
};
