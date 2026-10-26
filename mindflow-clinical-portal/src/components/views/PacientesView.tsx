import React, { useState } from 'react';
import { NavigationPath, Patient } from '../../types/clinical';
import { PATIENTS } from '../../data/mockClinicalData';

interface PacientesViewProps {
  onNavigate: (path: NavigationPath) => void;
  onSelectPatient: (patientId: string) => void;
}

export const PacientesView: React.FC<PacientesViewProps> = ({
  onNavigate,
  onSelectPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('activo');
  const [diagnosisFilter, setDiagnosisFilter] = useState('todos');
  const [alertFilter, setAlertFilter] = useState('cualquiera');
  const [quickFilter, setQuickFilter] = useState<'todos' | 'hoy' | 'pendientes' | 'tcc'>('todos');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPatients = PATIENTS.filter(patient => {
    // Search
    if (searchTerm) {
      const match = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    // Quick filter
    if (quickFilter === 'hoy' && !patient.nextSession.includes('Hoy')) return false;
    if (quickFilter === 'pendientes' && (patient.notesPending ?? 0) <= 0) return false;
    if (quickFilter === 'tcc' && !patient.approach.includes('TCC')) return false;

    // Dropdowns
    if (alertFilter === 'alerta_activa' && !patient.riskAlert) return false;
    if (alertFilter === 'estable' && patient.riskAlert) return false;

    return true;
  });

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Operational Summary & Metrics Banner */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        {/* Main Stats Card */}
        <div className="col-span-12 lg:col-span-8 flex flex-col justify-between p-6 bg-surface-card rounded-2xl shadow-sm border border-border-hairline relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary-fixed/20 blur-2xl pointer-events-none" />
          
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-primary font-bold px-2.5 py-0.5 bg-mint-subtle rounded-md border border-primary/20">
                Directorio Asistencial
              </span>
              <span className="text-[12px] text-ink-muted">Corte Clínico: Semana en curso</span>
            </div>
            <h1 className="font-headline text-[28px] text-on-surface font-bold tracking-tight">
              Pacientes Asignados
            </h1>
            <p className="text-[14px] text-ink-muted max-w-2xl leading-relaxed">
              Gestión integral de expedientes activos, sincronización de historial psicoterapéutico, monitoreo de riesgo y evolución de escalas psicométricas.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-5 mt-4 bg-surface-subtle/70 rounded-xl p-3.5 border border-border-hairline/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-status-success-surface flex items-center justify-center text-status-success">
                <span className="material-symbols-outlined text-[22px]">person_check</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-[22px] font-bold text-on-surface leading-none">28</span>
                <span className="text-[11px] text-ink-muted mt-1 font-medium">Activos en tratamiento</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-status-info-surface flex items-center justify-center text-status-info">
                <span className="material-symbols-outlined text-[22px]">update</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-[22px] font-bold text-on-surface leading-none">3</span>
                <span className="text-[11px] text-ink-muted mt-1 font-medium">Seguimiento quincenal</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-[22px] font-bold text-on-surface leading-none">6</span>
                <span className="text-[11px] text-ink-muted mt-1 font-medium">Altas terapéuticas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick AI Triage / Risk Card */}
        <div className="col-span-12 lg:col-span-4 p-6 bg-surface-card rounded-2xl shadow-sm border border-border-hairline flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wide text-status-danger font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-danger animate-ping" />
                Alerta de Triage Automático
              </span>
              <span className="font-headline text-[16px] font-bold text-on-surface mt-1">1 Paciente en Observación</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-status-danger-surface flex items-center justify-center text-status-danger">
              <span className="material-symbols-outlined text-[22px]">crisis_alert</span>
            </div>
          </div>

          <div className="my-3 p-3.5 bg-status-danger-surface rounded-xl border border-status-danger/20">
            <div className="flex items-center justify-between text-status-danger text-[12px] font-bold">
              <span>Camila Torres (MP-4402-CT)</span>
              <span className="font-mono">Escala GAD-7: 15/21</span>
            </div>
            <p className="text-[12px] text-ink-muted mt-1 leading-snug">
              Incremento de sintomatología ansiosa nocturna en check-in remoto. Consulta programada hoy 10:00 AM.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-ink-muted">Protocolo de escalamiento activo</span>
            <button 
              onClick={() => onNavigate('alertas-de-riesgo')}
              className="px-3.5 py-1.5 rounded-lg bg-status-danger text-on-primary text-[12px] font-bold hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">visibility</span>
              <span>Revisar Protocolo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Control Console */}
      <div className="p-4 bg-surface-card rounded-2xl shadow-sm border border-border-hairline flex flex-col gap-3 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary text-[20px]">search</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, documento o motivo de consulta..."
              className="w-full h-11 pl-10 pr-4 bg-surface-container-low rounded-xl text-[14px] text-on-surface placeholder:text-ink-tertiary focus:outline-none focus:bg-surface-card border border-border-hairline/60 transition-all"
            />
          </div>

          {/* Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Estado */}
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none h-11 pl-3.5 pr-8 bg-surface-container-low rounded-xl text-[13px] font-semibold text-on-surface hover:bg-surface-subtle focus:outline-none cursor-pointer border border-border-hairline/60"
              >
                <option value="todos">Estado: Todos (37)</option>
                <option value="activo">Estado: Activo (28)</option>
                <option value="pausa">Estado: En pausa (3)</option>
                <option value="alta">Estado: Alta (6)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none text-[18px]">expand_more</span>
            </div>

            {/* Diagnóstico */}
            <div className="relative">
              <select 
                value={diagnosisFilter}
                onChange={(e) => setDiagnosisFilter(e.target.value)}
                className="appearance-none h-11 pl-3.5 pr-8 bg-surface-container-low rounded-xl text-[13px] font-semibold text-on-surface hover:bg-surface-subtle focus:outline-none cursor-pointer border border-border-hairline/60"
              >
                <option value="todos">Diagnóstico: Todos</option>
                <option value="tag">TAG (Ansiedad Generalizada)</option>
                <option value="depresion">Depresión</option>
                <option value="duelo">Duelo Complicado</option>
                <option value="fobia">Fobia Social</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none text-[18px]">expand_more</span>
            </div>

            {/* Alerta */}
            <div className="relative">
              <select 
                value={alertFilter}
                onChange={(e) => setAlertFilter(e.target.value)}
                className="appearance-none h-11 pl-3.5 pr-8 bg-surface-container-low rounded-xl text-[13px] font-semibold text-on-surface hover:bg-surface-subtle focus:outline-none cursor-pointer border border-border-hairline/60"
              >
                <option value="cualquiera">Alerta: Cualquiera</option>
                <option value="alerta_activa">Alerta Activa (1)</option>
                <option value="estable">Estable (27)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none text-[18px]">expand_more</span>
            </div>

            {/* Add Patient CTA */}
            <button 
              onClick={() => onNavigate('paciente-detalle')}
              className="h-11 px-4 rounded-xl bg-primary text-on-primary text-[13px] font-bold flex items-center gap-1.5 shadow-sm hover:bg-primary-container transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">person_add</span>
              <span>+ Asignar / Registrar Paciente</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-2 pt-1 text-[12px] flex-wrap">
          <span className="font-bold text-on-surface mr-1">Filtros rápidos:</span>
          
          <button 
            onClick={() => setQuickFilter('todos')}
            className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors cursor-pointer ${
              quickFilter === 'todos' 
                ? 'bg-primary-container text-on-primary' 
                : 'bg-surface-container-low text-ink-muted hover:text-on-surface'
            }`}
          >
            Todos los asignados (28)
          </button>

          <button 
            onClick={() => setQuickFilter('hoy')}
            className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors cursor-pointer ${
              quickFilter === 'hoy' 
                ? 'bg-primary-container text-on-primary' 
                : 'bg-surface-container-low text-ink-muted hover:text-on-surface'
            }`}
          >
            Sesión hoy (3)
          </button>

          <button 
            onClick={() => setQuickFilter('pendientes')}
            className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors cursor-pointer ${
              quickFilter === 'pendientes' 
                ? 'bg-primary-container text-on-primary' 
                : 'bg-surface-container-low text-ink-muted hover:text-on-surface'
            }`}
          >
            Notas pendientes (2)
          </button>

          <button 
            onClick={() => setQuickFilter('tcc')}
            className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors cursor-pointer ${
              quickFilter === 'tcc' 
                ? 'bg-primary-container text-on-primary' 
                : 'bg-surface-container-low text-ink-muted hover:text-on-surface'
            }`}
          >
            TCC Activo (14)
          </button>
        </div>
      </div>

      {/* Clinical Data Table */}
      <div className="bg-surface-card rounded-2xl shadow-sm border border-border-hairline overflow-hidden flex flex-col mb-6">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-subtle/80 text-ink-muted text-[11px] font-bold uppercase tracking-wider border-b border-border-hairline">
                <th className="py-3.5 px-4">Paciente & ID Clínico</th>
                <th className="py-3.5 px-4">Diagnóstico / Enfoque</th>
                <th className="py-3.5 px-4">Próxima Sesión</th>
                <th className="py-3.5 px-4">Sesiones Realizadas</th>
                <th className="py-3.5 px-4">Último Estado Emocional</th>
                <th className="py-3.5 px-4">Alertas de Riesgo</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline/60 text-[13px] text-on-surface">
              {filteredPatients.map((patient) => {
                const isUrgent = patient.riskSeverity === 'moderate';
                const progressPercent = Math.round((patient.completedSessions / patient.totalSessions) * 100);

                return (
                  <tr 
                    key={patient.id}
                    className={`hover:bg-surface-subtle/70 transition-colors group ${
                      isUrgent ? 'bg-status-danger-surface/20' : ''
                    }`}
                  >
                    {/* Patient identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          {patient.avatar ? (
                            <img 
                              src={patient.avatar} 
                              alt={patient.name}
                              className={`w-10 h-10 rounded-full object-cover shadow-xs ring-2 ${
                                isUrgent ? 'ring-status-danger/50' : 'ring-primary/10'
                              }`}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-headline font-bold text-[14px]">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-surface-card ${
                            isUrgent ? 'bg-status-danger' : 'bg-status-success'
                          }`} />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span 
                            onClick={() => {
                              onSelectPatient(patient.id);
                              onNavigate('paciente-detalle');
                            }}
                            className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors cursor-pointer truncate"
                          >
                            {patient.name}
                          </span>
                          <span className="font-mono text-[11px] text-ink-muted">
                            {patient.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Condition */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">{patient.condition}</span>
                        <span className="text-[11px] text-ink-muted">Enfoque: {patient.approach}</span>
                      </div>
                    </td>

                    {/* Next Session */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 w-fit ${
                        patient.nextSession.includes('10:00')
                          ? 'bg-status-warning-surface text-status-warning'
                          : 'bg-status-info-surface text-status-info'
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {patient.nextSessionType === 'virtual' ? 'videocam' : 'calendar_today'}
                        </span>
                        {patient.nextSession}
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 w-28">
                        <div className="flex justify-between text-[11px] text-ink-muted font-medium">
                          <span className="text-on-surface font-bold">{patient.completedSessions} / {patient.totalSessions}</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${progressPercent}%` }} 
                          />
                        </div>
                      </div>
                    </td>

                    {/* Emotional Level */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <span 
                              key={lvl}
                              className={`w-2.5 h-2.5 rounded-full ${
                                lvl <= patient.emotionalLevel 
                                  ? (patient.emotionalLevel >= 3 ? 'bg-status-warning' : 'bg-status-success')
                                  : 'bg-surface-container'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className={`text-[12px] font-bold ${
                          patient.emotionalLevel >= 3 ? 'text-status-warning' : 'text-status-success'
                        }`}>
                          {patient.emotionalState} ({patient.emotionalLevel}/5)
                        </span>
                      </div>
                    </td>

                    {/* Risk Tag */}
                    <td className="py-3.5 px-4">
                      {patient.riskAlert ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-status-danger-surface text-status-danger text-[11px] font-bold border border-status-danger/20">
                          <span className="material-symbols-outlined text-[13px]">warning</span>
                          {patient.riskAlert}
                        </span>
                      ) : (
                        <span className="text-[12px] text-ink-tertiary">Ninguna</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onNavigate('notas-clinicas')}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container text-primary text-[12px] font-bold hover:bg-mint-subtle transition-all cursor-pointer"
                        >
                          Nueva Nota
                        </button>
                        <button 
                          onClick={() => {
                            onSelectPatient(patient.id);
                            onNavigate('paciente-detalle');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-[12px] font-bold hover:bg-primary-container shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Ver Expediente 360</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-4 bg-surface-subtle/50 border-t border-border-hairline flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-ink-muted text-[12px]">
            <span className="material-symbols-outlined text-[17px] text-primary">lock</span>
            <span>Acceso restringido por Secreto Profesional Médico (Ley 1090 de 2006). Registros encriptados AES-256.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[12px] text-ink-muted">
              Mostrando <strong className="text-on-surface">1 - 5</strong> de <strong className="text-on-surface">28</strong> pacientes
            </span>

            <div className="flex items-center gap-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="w-8 h-8 rounded-lg bg-surface-card flex items-center justify-center text-ink-tertiary hover:text-on-surface disabled:opacity-40 transition-colors cursor-pointer border border-border-hairline/60"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-[12px] font-bold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-card text-ink-muted hover:bg-surface-container'
                  }`}
                >
                  {page}
                </button>
              ))}

              <span className="text-ink-tertiary px-1 text-[11px]">...</span>

              <button
                onClick={() => setCurrentPage(6)}
                className={`w-8 h-8 rounded-lg text-[12px] font-bold flex items-center justify-center transition-colors cursor-pointer ${
                  currentPage === 6
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-card text-ink-muted hover:bg-surface-container'
                }`}
              >
                6
              </button>

              <button 
                disabled={currentPage === 6}
                onClick={() => setCurrentPage(p => p + 1)}
                className="w-8 h-8 rounded-lg bg-surface-card flex items-center justify-center text-ink-muted hover:text-on-surface disabled:opacity-40 transition-colors cursor-pointer border border-border-hairline/60"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Insights Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface-card shadow-sm border border-border-hairline flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[22px]">psychology</span>
          </div>
          <div>
            <h2 className="font-headline text-[14px] font-bold text-on-surface">Tasa de Adherencia Clínica</h2>
            <p className="text-[12px] text-ink-muted mt-0.5">89.4% de asistencia cumplida en las últimas 4 semanas.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-card shadow-sm border border-border-hairline flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-status-warning-surface flex items-center justify-center text-status-warning shrink-0">
            <span className="material-symbols-outlined text-[22px]">history_edu</span>
          </div>
          <div>
            <h2 className="font-headline text-[14px] font-bold text-on-surface">Notas SOAP Pendientes</h2>
            <p className="text-[12px] text-ink-muted mt-0.5">2 notas de evolución requieren firma digital antes de las 18:00.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-card shadow-sm border border-border-hairline flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-status-success-surface flex items-center justify-center text-status-success shrink-0">
            <span className="material-symbols-outlined text-[22px]">auto_graph</span>
          </div>
          <div>
            <h2 className="font-headline text-[14px] font-bold text-on-surface">Próxima Evaluación PHQ-9</h2>
            <p className="text-[12px] text-ink-muted mt-0.5">Felipe Mendoza y Carlos Restrepo programados para re-test.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
