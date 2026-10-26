import React, { useState } from 'react';
import { NavigationPath } from '../../types/clinical';
import { PATIENTS } from '../../data/mockClinicalData';

interface Paciente360ViewProps {
  onNavigate: (path: NavigationPath) => void;
  onStartTeleconsulta: () => void;
}

export const Paciente360View: React.FC<Paciente360ViewProps> = ({
  onNavigate,
  onStartTeleconsulta,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskAddedToast, setTaskAddedToast] = useState(false);

  const patient = PATIENTS[0]; // Camila Torres

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setNewTaskModalOpen(false);
    setNewTaskTitle('');
    setTaskAddedToast(true);
    setTimeout(() => setTaskAddedToast(false), 3000);
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Patient Context Banner */}
      <section className="w-full bg-surface-card rounded-2xl shadow-sm p-6 lg:p-7 border border-border-hairline relative overflow-hidden flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-6">
        <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        {/* Patient Identity */}
        <div className="flex items-start sm:items-center gap-5 min-w-0 z-10">
          <div className="relative shrink-0">
            <img 
              src={patient.avatar}
              alt={patient.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-sm ring-2 ring-primary/20"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-status-success ring-4 ring-surface-card" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-headline text-[24px] lg:text-[26px] font-bold text-on-surface truncate">
                {patient.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-status-success-surface text-status-success text-[11px] font-bold flex items-center gap-1 border border-status-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                Activa
              </span>
              <span className="px-2 py-0.5 rounded-md bg-surface-container text-ink-muted font-mono text-[11px] font-medium">
                ID: {patient.code}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-ink-muted text-[13px]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-ink-tertiary">cake</span>
                28 años (04/06/1996)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
                Contacto cifrado (AES-256)
              </span>
              <span className="flex items-center gap-1.5 text-status-success font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Consentimiento v1.2 Firmado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-ink-tertiary">location_on</span>
                Bogotá, Colombia (UTC-5)
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center flex-wrap gap-3 z-10 shrink-0">
          <button 
            onClick={() => onNavigate('notas-clinicas')}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-mint-subtle text-primary text-[13px] font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
            <span>+ Redactar Nueva Nota Clínica</span>
          </button>
          
          <button 
            onClick={onStartTeleconsulta}
            className="px-5 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary text-[13px] font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] animate-pulse">videocam</span>
            <span>Iniciar Sesión Inmediata</span>
          </button>
        </div>
      </section>

      {/* Nested Tab Navigation */}
      <div className="w-full bg-surface-card rounded-2xl p-1.5 shadow-sm border border-border-hairline overflow-x-auto flex items-center gap-1 mb-6">
        {[
          { id: 1, label: '1. Resumen Clínico', icon: 'clinical_notes', dot: true },
          { id: 2, label: '2. Citas e Historial', icon: 'calendar_today', badge: '4' },
          { id: 3, label: '3. Notas de Evolución', icon: 'history_edu', badge: '4' },
          { id: 4, label: '4. Análisis Copilot IA', icon: 'neurology', badge: '3', badgeColor: 'bg-secondary-container text-on-secondary-container' },
          { id: 5, label: '5. Consentimientos y Privacidad', icon: 'security' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-ink-muted hover:bg-surface-subtle hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.dot && <span className="w-2 h-2 rounded-full bg-on-primary" />}
            {tab.badge && (
              <span className={`px-2 py-0.2 rounded-full text-[11px] font-bold ${
                tab.badgeColor ? tab.badgeColor : (activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-surface-container text-ink-muted')
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          {/* Left Column (8 cols): Diagnostic & Evolution */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Diagnostic Card */}
            <div className="w-full bg-surface-card rounded-2xl p-6 shadow-sm border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-surface-container-low text-primary">
                    <span className="material-symbols-outlined text-[22px]">psychology</span>
                  </span>
                  <h2 className="font-headline text-[17px] font-bold text-on-surface">Motivo de Consulta e Historia</h2>
                </div>
                <span className="px-3 py-1 rounded-lg bg-status-info-surface text-status-info text-[12px] font-bold border border-status-info/20">
                  CIE-10: F41.1 / DSM-5: 300.02
                </span>
              </div>

              <div className="bg-surface-subtle rounded-xl p-4 flex flex-col gap-1.5 border border-border-hairline/60">
                <p className="text-[11px] font-bold text-ink-tertiary uppercase tracking-wider">Diagnóstico Orientativo Principal</p>
                <p className="font-headline text-[18px] text-primary font-bold">Trastorno de Ansiedad Generalizada (TAG)</p>
                <p className="text-[13px] text-on-surface leading-relaxed mt-0.5">
                  Consulta por cuadro de 8 meses caracterizado por aprensión constante, rumiación cognitiva nocturna con dificultades de conciliación del sueño, hipertonía muscular cervical y episodios de hiperventilación ante picos de exigencia laboral.
                </p>
              </div>

              {/* Symptom Tags */}
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-bold text-ink-muted">Sintomatología focal activa en monitoreo:</span>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-danger-surface text-status-danger text-[12px] font-semibold border border-status-danger/20">
                    <span className="material-symbols-outlined text-[16px]">bedtime</span>
                    <span>Rumiación cognitiva nocturna</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-warning-surface text-status-warning text-[12px] font-semibold border border-status-warning/20">
                    <span className="material-symbols-outlined text-[16px]">fitness_center</span>
                    <span>Tensión muscular cefálica/cervical</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-warning-surface text-status-warning text-[12px] font-semibold border border-status-warning/20">
                    <span className="material-symbols-outlined text-[16px]">air</span>
                    <span>Hiperventilación situacional</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Evolution Note */}
            <div className="w-full bg-surface-card rounded-2xl p-6 shadow-sm border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-status-success-surface text-status-success">
                    <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
                  </span>
                  <div>
                    <h3 className="font-headline text-[17px] font-bold text-on-surface leading-tight">Última Evolución Registrada</h3>
                    <p className="text-[12px] text-ink-muted">Sesión 04 — Jueves, 10 de Octubre de 2024 (50 min)</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-status-success-surface text-status-success text-[11px] font-bold border border-status-success/20">
                  Revisión Aprobada
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5 border border-primary/10">
                <div className="flex items-center gap-2 text-primary text-[13px] font-bold">
                  <span className="material-symbols-outlined text-[18px]">format_quote</span>
                  <span>Hallazgos e Impresión Clínica:</span>
                </div>
                <p className="text-[13px] text-on-surface italic leading-relaxed">
                  “Paciente refiere mejoría clínica sostenida en técnica de respiración diafragmática 4-7-8 al inicio de episodios ansiosos. Constata disminución perceptible de rumiación de 7/10 a 4/10 en escala analógica subjetiva. Logró conciliar el sueño en un promedio de 25 minutos durante los últimos 4 días hábiles.”
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                  <span className="text-[11px] text-ink-muted">Técnica aplicada: TCC (Restructuración Cognitiva + Exposición Interoceptiva leve)</span>
                  <button 
                    onClick={() => onNavigate('notas-clinicas')}
                    className="text-primary hover:text-border-focus text-[12px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver nota SOAP completa</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Symptom Evolution Trend (SVG Chart) */}
            <div className="w-full bg-surface-card rounded-2xl p-6 shadow-sm border border-border-hairline flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-headline text-[17px] font-bold text-on-surface">Evolución y Descenso Sintomático</h3>
                  <p className="text-[12px] text-ink-muted">Línea de autorreporte clínico validado (GAD-7 & Escala Subjetiva de Tensión)</p>
                </div>
                <div className="flex items-center gap-4 text-[12px]">
                  <div className="flex items-center gap-1.5 text-ink-muted font-medium">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    <span>Rumiación (1-10)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-ink-muted font-medium">
                    <span className="w-3 h-3 rounded-full bg-secondary-fixed-dim" />
                    <span>Tensión Somática</span>
                  </div>
                </div>
              </div>

              {/* SVG Curve */}
              <div className="w-full bg-surface-subtle rounded-xl p-4 flex flex-col border border-border-hairline/60">
                <div className="w-full h-52 relative">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 180">
                    <defs>
                      <linearGradient id="ruminationGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#176b5b" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#176b5b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line stroke="#d7ede6" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="600" y1="30" y2="30" />
                    <line stroke="#d7ede6" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="600" y1="75" y2="75" />
                    <line stroke="#d7ede6" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="600" y1="120" y2="120" />
                    <line stroke="#d7ede6" strokeWidth="1" x1="0" x2="600" y1="165" y2="165" />
                    
                    {/* Baseline Area Gradient */}
                    <polygon fill="url(#ruminationGradient)" points="50,40 150,55 250,70 350,95 450,115 550,140 550,170 50,170" />
                    
                    {/* Somatic Curve */}
                    <polyline fill="none" points="50,60 150,65 250,90 350,105 450,125 550,145" stroke="#a1d1ba" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                    
                    {/* Rumination Curve */}
                    <polyline fill="none" points="50,40 150,55 250,70 350,95 450,115 550,140" stroke="#176b5b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
                    
                    {/* Nodes */}
                    <circle cx="50" cy="40" fill="#176b5b" r="5" />
                    <text fill="#176b5b" fontSize="11" fontWeight="bold" textAnchor="middle" x="50" y="30">8.5</text>
                    <circle cx="150" cy="55" fill="#176b5b" r="5" />
                    <text fill="#176b5b" fontSize="11" fontWeight="bold" textAnchor="middle" x="150" y="47">7.8</text>
                    <circle cx="250" cy="70" fill="#176b5b" r="5" />
                    <text fill="#176b5b" fontSize="11" fontWeight="bold" textAnchor="middle" x="250" y="62">7.0</text>
                    <circle cx="350" cy="95" fill="#176b5b" r="5" />
                    <text fill="#176b5b" fontSize="11" fontWeight="bold" textAnchor="middle" x="350" y="87">5.8</text>
                    <circle cx="450" cy="115" fill="#176b5b" r="5" />
                    <text fill="#176b5b" fontSize="11" fontWeight="bold" textAnchor="middle" x="450" y="107">4.9</text>
                    <circle cx="550" cy="140" fill="#1e7e52" r="6" className="animate-pulse" />
                    <text fill="#1e7e52" fontSize="12" fontWeight="bold" textAnchor="middle" x="550" y="132">4.0</text>
                  </svg>
                </div>

                <div className="flex justify-between items-center px-4 pt-3 text-[11px] text-ink-muted border-t border-border-hairline/60">
                  <span className="text-center">Sem 36<br /><span className="text-[10px] text-ink-tertiary">05 Sep</span></span>
                  <span className="text-center">Sem 37<br /><span className="text-[10px] text-ink-tertiary">12 Sep</span></span>
                  <span className="text-center">Sem 38<br /><span className="text-[10px] text-ink-tertiary">19 Sep</span></span>
                  <span className="text-center">Sem 39<br /><span className="text-[10px] text-ink-tertiary">26 Sep</span></span>
                  <span className="text-center">Sem 40<br /><span className="text-[10px] text-ink-tertiary">03 Oct</span></span>
                  <span className="text-center font-bold text-primary">Sem 41 (Actual)<br /><span className="text-[10px] text-status-success font-semibold">10 Oct</span></span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-status-success-surface border border-status-success/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-status-success text-[20px]">trending_down</span>
                  <span className="text-[12px] text-status-success font-bold">
                    Reducción favorable de severidad sintomática: -53% en 6 semanas continuas.
                  </span>
                </div>
                <span className="text-[11px] text-ink-muted">Próxima evaluación GAD-7: Sesión 06</span>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Adherence, Tasks & Emergency Network */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Adherence Metrics */}
            <div className="w-full bg-surface-card rounded-2xl p-6 shadow-sm border border-border-hairline flex flex-col gap-4">
              <h3 className="font-headline text-[17px] font-bold text-on-surface">Métricas de Adherencia</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between">
                  <div className="flex items-center justify-between text-ink-muted">
                    <span className="text-[11px] font-medium">Sesiones Totales</span>
                    <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-headline text-[32px] text-primary font-bold leading-none">04</span>
                    <span className="text-[11px] text-ink-muted block mt-1">Concluidas 100%</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-subtle flex flex-col justify-between">
                  <div className="flex items-center justify-between text-ink-muted">
                    <span className="text-[11px] font-medium">Ausencias / Cancel.</span>
                    <span className="material-symbols-outlined text-[18px] text-status-success">event_available</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-headline text-[32px] text-on-surface font-bold leading-none">0</span>
                    <span className="text-[11px] text-status-success font-bold block mt-1">Puntualidad 100%</span>
                  </div>
                </div>
              </div>

              {/* Progress bar card */}
              <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-on-surface font-bold">Tasa de Adherencia Terapéutica</span>
                  <span className="font-headline text-[16px] text-primary font-bold">94%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-surface-subtle overflow-hidden">
                  <div className="h-full rounded-full bg-primary-container" style={{ width: '94%' }} />
                </div>
                <p className="text-[11px] text-ink-muted">
                  Muy alta adherencia a registros diarios y asistencia en sala virtual.
                </p>
              </div>
            </div>

            {/* Active Intersession Tasks */}
            <div className="w-full bg-surface-card rounded-2xl p-6 shadow-sm border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-secondary-container text-on-secondary-container">
                    <span className="material-symbols-outlined text-[18px]">task_alt</span>
                  </span>
                  <h3 className="font-headline text-[16px] font-bold text-on-surface">Tareas Intersesión</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-status-warning-surface text-status-warning text-[11px] font-bold border border-status-warning/20">
                  Activa
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-subtle flex flex-col gap-2 border border-border-hairline/60">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-on-surface">
                      Registro de pensamientos catastróficos
                    </span>
                    <span className="text-[12px] text-ink-muted mt-0.5">
                      Identificar distorsión cognitiva, evaluar evidencia a favor/en contra.
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-primary text-[11px] font-bold shrink-0">
                    2 / 3
                  </span>
                </div>

                <div className="w-full bg-surface-card rounded-lg p-2.5 flex flex-col gap-1.5 mt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-ink-muted">Progreso semanal:</span>
                    <span className="font-bold text-primary">66% completado</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full rounded-full bg-status-success" style={{ width: '66%' }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-ink-muted">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-ink-tertiary">schedule</span>
                    Límite: Sesión 05 (17 Oct)
                  </span>
                  <span 
                    onClick={() => onNavigate('analisis-copilot-ia')}
                    className="text-primary font-bold cursor-pointer hover:underline"
                  >
                    Ver entradas (2)
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setNewTaskModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-mint-subtle text-primary text-[12px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Asignar Nueva Tarea o Registro</span>
              </button>
            </div>

            {/* Support Network & Emergency Triage */}
            <div className="w-full bg-surface-card rounded-2xl p-6 shadow-sm border border-border-hairline flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-status-danger-surface text-status-danger">
                    <span className="material-symbols-outlined text-[18px]">emergency</span>
                  </span>
                  <h3 className="font-headline text-[16px] font-bold text-on-surface">Red de Apoyo & Triage</h3>
                </div>
                <span className="text-[11px] text-ink-tertiary">Cifrado Médico</span>
              </div>

              <div className="flex flex-col gap-3">
                {/* Mother */}
                <div className="p-3 rounded-xl bg-surface-subtle flex items-center justify-between border border-border-hairline/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-mint-subtle flex items-center justify-center text-primary font-bold text-[13px]">
                      MT
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-on-surface">Martha Torres</span>
                        <span className="material-symbols-outlined text-[15px] text-status-success" title="Verificada">verified</span>
                      </div>
                      <span className="text-[11px] text-ink-muted">Madre • Contacto Primario</span>
                    </div>
                  </div>
                  <a 
                    href="tel:+573004567890" 
                    className="w-8 h-8 rounded-lg bg-surface-card hover:bg-status-success-surface text-status-success flex items-center justify-center transition-colors shadow-xs" 
                    title="Llamada segura"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </a>
                </div>

                {/* External Psychiatrist */}
                <div className="p-3 rounded-xl bg-surface-subtle flex items-center justify-between border border-border-hairline/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary font-bold text-[13px]">
                      <span className="material-symbols-outlined text-[18px]">medical_services</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-on-surface">Dra. Piedad Casas</span>
                      </div>
                      <span className="text-[11px] text-ink-muted">Psiquiatra Tratante (Externa)</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Canal de interconsulta externa con Dra. Piedad Casas abierto.')}
                    className="w-8 h-8 rounded-lg bg-surface-card hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer" 
                    title="Mensaje interconsulta"
                  >
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </button>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-ink-muted text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-status-success" />
                  Protocolo crisis: Verde (Bajo)
                </span>
                <button 
                  onClick={() => onNavigate('alertas-de-riesgo')}
                  className="text-status-danger font-bold hover:underline cursor-pointer"
                >
                  Modificar triage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Citas e Historial */}
      {activeTab === 2 && (
        <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
          <h3 className="font-headline text-[18px] font-bold text-on-surface">Historial de Citas Clínicas</h3>
          <div className="space-y-3">
            {[
              { num: 5, date: '24 Oct 2025 (Hoy)', time: '10:00 AM', status: 'Confirmada', mode: 'Virtual E2E', focus: 'TCC - Reestructuración y Defusión' },
              { num: 4, date: '10 Oct 2025', time: '10:00 AM', status: 'Completada', mode: 'Virtual E2E', focus: 'Regulación Emocional y Trazado de Gatillos' },
              { num: 3, date: '26 Sep 2025', time: '10:00 AM', status: 'Completada', mode: 'Consultorio 302', focus: 'Reestructuración Cognitiva e Identificación de Esquemas' },
              { num: 2, date: '12 Sep 2025', time: '10:00 AM', status: 'Completada', mode: 'Virtual E2E', focus: 'Psicoeducación de la Ansiedad y Modelo ABC' },
              { num: 1, date: '29 Ago 2025', time: '10:00 AM', status: 'Completada', mode: 'Consultorio 302', focus: 'Entrevista Inicial, Evaluación GAD-7 y Encuadre' },
            ].map(item => (
              <div key={item.num} className="p-4 rounded-xl bg-surface-subtle flex items-center justify-between border border-border-hairline/60">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold text-[14px]">
                    #{item.num}
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-on-surface">{item.focus}</p>
                    <p className="text-[12px] text-ink-muted">{item.date} • {item.time} ({item.mode})</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                  item.status === 'Confirmada' ? 'bg-status-warning-surface text-status-warning' : 'bg-status-success-surface text-status-success'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Notas de Evolución */}
      {activeTab === 3 && (
        <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-[18px] font-bold text-on-surface">Notas de Evolución SOAP Registradas</h3>
            <button 
              onClick={() => onNavigate('notas-clinicas')}
              className="px-4 py-2 rounded-xl bg-primary-container text-on-primary text-[12px] font-bold hover:bg-border-focus transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
              <span>Redactar Nueva Nota</span>
            </button>
          </div>
          <div className="space-y-3">
            {[
              { id: 'S-04', date: '10 Octubre 2025', therapist: 'Dr. Alejandro Morales', summary: 'Mejoría sostenida en técnica diafragmática. Disminución de rumiación de 7/10 a 4/10.', hash: 'SHA256: 7f3b...98a2', signed: true },
              { id: 'S-03', date: '26 Septiembre 2025', therapist: 'Dr. Alejandro Morales', summary: 'Identificación de esquemas cognitivos de aprobación externa. Ensayo socrático.', hash: 'SHA256: 12de...45bc', signed: true },
              { id: 'S-02', date: '12 Septiembre 2025', therapist: 'Dr. Alejandro Morales', summary: 'Asignación de lectura psicoeducativa sobre falacia de control. Buena receptividad.', hash: 'SHA256: 90aa...88fe', signed: true },
              { id: 'S-01', date: '29 Agosto 2025', therapist: 'Dr. Alejandro Morales', summary: 'Apertura de historia clínica. Aplicación de GAD-7 inicial (15 pts). Formulación TCC.', hash: 'SHA256: e3b0...4429', signed: true },
            ].map(note => (
              <div key={note.id} className="p-4 rounded-xl bg-surface-subtle flex flex-col gap-2 border border-border-hairline/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[14px] text-on-surface">Nota SOAP #{note.id}</span>
                    <span className="text-[12px] text-ink-muted">• {note.date}</span>
                  </div>
                  <span className="text-[11px] text-status-success font-semibold flex items-center gap-1 bg-status-success-surface px-2.5 py-0.5 rounded-full border border-status-success/20">
                    <span className="material-symbols-outlined text-[13px]">verified</span> Firmada
                  </span>
                </div>
                <p className="text-[13px] text-ink-muted leading-relaxed">{note.summary}</p>
                <div className="flex items-center justify-between text-[11px] text-ink-tertiary pt-2 border-t border-border-hairline/60 font-mono">
                  <span>{note.therapist}</span>
                  <span>{note.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Análisis Copilot IA */}
      {activeTab === 4 && (
        <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-[18px] font-bold text-on-surface">Análisis Copilot IA Disponibles</h3>
            <button 
              onClick={() => onNavigate('analisis-copilot-ia')}
              className="px-4 py-2 rounded-xl bg-primary-container text-on-primary text-[12px] font-bold hover:bg-border-focus transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[17px]">auto_stories</span>
              <span>Abrir Visor Completo Copilot</span>
            </button>
          </div>
          <p className="text-[13px] text-ink-muted">
            Procesamiento de transcriptomática y biomarcadores prosódicos asistidos para Camila Torres.
          </p>
          <div className="p-4 rounded-xl bg-status-info-surface border border-status-info/20 flex items-start gap-3">
            <span className="material-symbols-outlined text-status-info text-[24px]">psychology</span>
            <div>
              <p className="font-bold text-[14px] text-status-info">Sesión #05 — 3 Patrones Críticos Identificados</p>
              <p className="text-[12px] text-on-surface mt-1 leading-relaxed">
                Catastrofización (94%), Pensamiento Polarizado (88%), Filtro Mental Negativo (76%). Preguntas socráticas listas para revisión en consulta.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Consentimientos y Privacidad */}
      {activeTab === 5 && (
        <div className="bg-surface-card rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
          <h3 className="font-headline text-[18px] font-bold text-on-surface">Documentación Legal & Consentimientos</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-surface-subtle flex items-center justify-between border border-border-hairline/60">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[24px] text-status-success">verified_user</span>
                <div>
                  <p className="font-bold text-[14px] text-on-surface">Consentimiento Informado para Psicoterapia Virtual</p>
                  <p className="text-[11px] text-ink-muted">Versión 1.2 • Verificado mediante OTP SMS + Firma biométrica (29/08/2025)</p>
                </div>
              </div>
              <span className="text-[12px] text-primary font-bold hover:underline cursor-pointer">Descargar PDF</span>
            </div>
            <div className="p-4 rounded-xl bg-surface-subtle flex items-center justify-between border border-border-hairline/60">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[24px] text-status-success">lock</span>
                <div>
                  <p className="font-bold text-[14px] text-on-surface">Autorización Habeas Data y Tratamiento de Datos Sensibles</p>
                  <p className="text-[11px] text-ink-muted">Cumplimiento estricto Ley 1581 de 2012 y Secreto Profesional Médico Ley 1090</p>
                </div>
              </div>
              <span className="text-[12px] text-primary font-bold hover:underline cursor-pointer">Ver Registro</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Tarea */}
      {newTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-4 border border-border-hairline animate-in zoom-in-95">
            <h3 className="font-headline text-[18px] font-bold text-on-surface">Asignar Tarea TCC a Camila</h3>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="text-[12px] font-semibold text-ink-muted block mb-1">Descripción de la Tarea</label>
                <input 
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ej: Registro diario de respiración 4-7-8"
                  className="w-full h-11 px-3 rounded-xl bg-surface-subtle text-[13px] border border-border-hairline focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-ink-muted text-[13px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary-container text-on-primary text-[13px] font-bold shadow-sm"
                >
                  Asignar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {taskAddedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-on-primary px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[20px] text-secondary-fixed">check_circle</span>
          <span className="text-[13px] font-semibold">Tarea asignada y notificada a la app de la paciente.</span>
        </div>
      )}
    </div>
  );
};
