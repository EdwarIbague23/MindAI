import React, { useState } from 'react';
import { NavigationPath, RiskAlert } from '../../types/clinical';
import { RISK_ALERTS, PATIENTS } from '../../data/mockClinicalData';

interface AlertasRiesgoViewProps {
  onNavigate: (path: NavigationPath) => void;
  onOpenQuickNote: () => void;
}

export const AlertasRiesgoView: React.FC<AlertasRiesgoViewProps> = ({
  onNavigate,
  onOpenQuickNote,
}) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'resolved'>('all');
  const [selectedAlertId, setSelectedAlertId] = useState<string>('alert-felipe');
  const [protocolActivated, setProtocolActivated] = useState<boolean>(false);

  const filteredAlerts = RISK_ALERTS.filter(alert => {
    if (filter === 'high') return alert.severity === 'Alta' || alert.severity === 'high';
    if (filter === 'medium') return alert.severity === 'Moderada' || alert.severity === 'medium';
    if (filter === 'resolved') return Boolean(alert.resolved);
    return true;
  });

  const activeAlert = RISK_ALERTS.find(a => a.id === selectedAlertId) || RISK_ALERTS[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                Triage Continuo Activo
              </span>
              <span className="text-xs text-ink-muted">Monitoreo 24/7 • Algoritmo de Detección Temprana</span>
            </div>
            <h1 className="text-2xl font-bold font-serif text-ink-primary mt-1">
              Centro de Monitoreo & Alertas de Riesgo
            </h1>
            <p className="text-xs text-ink-muted">
              Detección de patrones de descompensación emocional, reactividad psicosomática y riesgo autolítico.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                alert('Iniciando protocolo de emergencia con enlace a Línea 106 y contacto de apoyo.');
                setProtocolActivated(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all animate-pulse"
            >
              <span className="material-symbols-outlined text-[18px]">emergency</span>
              Protocolo de Crisis / Botón de Red
            </button>
          </div>
        </div>

        {/* Quick Triage Metric Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-border-light">
          <div className="p-3 rounded-xl bg-red-50/70 border border-red-200">
            <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">Riesgo Alto Activo</span>
            <span className="text-2xl font-bold font-serif text-red-900 mt-1 block">1 Paciente</span>
            <span className="text-[10px] text-red-700">Felipe Mendoza (Tamizaje 18/21)</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Riesgo Medio</span>
            <span className="text-2xl font-bold font-serif text-amber-900 mt-1 block">2 Pacientes</span>
            <span className="text-[10px] text-amber-700">Disnea reactiva y aislamiento</span>
          </div>

          <div className="p-3 rounded-xl bg-canvas border border-border-light">
            <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">Contenciones Resueltas</span>
            <span className="text-2xl font-bold font-serif text-ink-primary mt-1 block">14 Casos</span>
            <span className="text-[10px] text-emerald-700">Últimos 30 días sin incidentes</span>
          </div>

          <div className="p-3 rounded-xl bg-canvas border border-border-light">
            <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">Tiempo Respuesta Prom.</span>
            <span className="text-2xl font-bold font-serif text-ink-primary mt-1 block">18 min</span>
            <span className="text-[10px] text-ink-muted">Protocolo de contacto rápido</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-primary text-white font-semibold shadow-xs'
              : 'bg-surface-card border border-border-light text-ink-secondary hover:bg-canvas'
          }`}
        >
          Todas las Alertas ({RISK_ALERTS.length})
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
            filter === 'high'
              ? 'bg-red-600 text-white font-semibold shadow-xs'
              : 'bg-surface-card border border-border-light text-red-700 hover:bg-red-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          Riesgo Alto (1)
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
            filter === 'medium'
              ? 'bg-amber-600 text-white font-semibold shadow-xs'
              : 'bg-surface-card border border-border-light text-amber-700 hover:bg-amber-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Riesgo Moderado (2)
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            filter === 'resolved'
              ? 'bg-primary text-white font-semibold shadow-xs'
              : 'bg-surface-card border border-border-light text-ink-secondary hover:bg-canvas'
          }`}
        >
          Histórico Resueltas (14)
        </button>
      </div>

      {/* Main Grid: Left Alert Feed, Right Detailed Protocol Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Alerts Feed List */}
        <div className="lg:col-span-7 space-y-4">
          {filteredAlerts.map((alert) => {
            const isSelected = alert.id === selectedAlertId;
            return (
              <div
                key={alert.id}
                onClick={() => setSelectedAlertId(alert.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-surface-card shadow-sm'
                    : 'border-border-light bg-surface-card hover:bg-canvas/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`p-2.5 rounded-xl ${
                        alert.severity === 'Alta' || alert.severity === 'high'
                          ? 'bg-red-100 text-red-700'
                          : alert.severity === 'Moderada' || alert.severity === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {alert.severity === 'Alta' || alert.severity === 'high' ? 'warning' : 'notifications_active'}
                      </span>
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-ink-primary">{alert.patientName}</h3>
                        <span className="text-xs text-ink-muted">({alert.patientCode || alert.patientId})</span>
                      </div>
                      <p className="text-xs font-semibold text-ink-secondary mt-0.5">{alert.title}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        alert.severity === 'Alta' || alert.severity === 'high'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {alert.severity === 'Alta' || alert.severity === 'high' ? 'Riesgo Alto' : 'Riesgo Medio'}
                    </span>
                    <span className="block text-[11px] text-ink-muted mt-1">{alert.timestamp || alert.timeAgo}</span>
                  </div>
                </div>

                <p className="text-xs text-ink-secondary mt-3 leading-relaxed bg-canvas p-3 rounded-xl border border-border-light">
                  {alert.description}
                </p>

                <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-border-light text-xs">
                  <div className="flex items-center gap-2 text-ink-muted">
                    <span className="material-symbols-outlined text-[16px] text-primary">rule</span>
                    <span>Protocolo sugerido: <strong className="text-ink-primary font-semibold">{alert.suggestedAction || 'Evaluación en consulta'}</strong></span>
                  </div>
                  <span className="text-primary font-semibold hover:underline">
                    Ver Protocolo &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Emergency Protocol Details */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-surface-card border border-border-light rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">
                  Protocolo Asistencial Inmediato
                </span>
                <h2 className="text-lg font-bold font-serif text-ink-primary mt-0.5">
                  Ficha de Intervención: {activeAlert.patientName}
                </h2>
              </div>
              <span className="p-2 rounded-xl bg-red-50 text-red-700">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </span>
            </div>

            {/* Protocol checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Pasos de Contención Recomendados
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-canvas border border-border-light flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-ink-primary block">Verificación de Seguridad Inmediata</span>
                    <span className="text-ink-muted text-[11px] mt-0.5 block">
                      Llamada de reaseguramiento prioritaria o videollamada HD de 10 min para evaluar letalidad.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-canvas border border-border-light flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-ink-primary block">Activación de Red de Apoyo Familiar</span>
                    <span className="text-ink-muted text-[11px] mt-0.5 block">
                      Notificar a contacto registrado en consentimiento informado (María Mendoza - Madre: +57 310 445 9988).
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-canvas border border-border-light flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-ink-primary block">Canalización con Psiquiatría / Urgencias</span>
                    <span className="text-ink-muted text-[11px] mt-0.5 block">
                      Enlace de teleorientación hospitalaria Clínica Montserrat o EPS Sura.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="pt-2 border-t border-border-light space-y-2.5">
              <button
                onClick={() => {
                  alert(`Llamando al paciente ${activeAlert.patientName} al +57 301 555 0192 vía canal SIP encriptado...`);
                }}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[17px]">call</span>
                Llamar Directamente al Paciente (+57 301...)
              </button>

              <button
                onClick={onOpenQuickNote}
                className="w-full py-2.5 rounded-xl border border-border-light bg-canvas hover:bg-slate-100 text-ink-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[17px]">history_edu</span>
                Registrar Nota de Contención en HC
              </button>

              <button
                onClick={() => onNavigate('paciente-detalle')}
                className="w-full py-2 rounded-xl text-primary hover:bg-primary/5 text-xs font-medium transition-colors"
              >
                Ver Expediente Clínico Completo &rarr;
              </button>
            </div>

            {/* Legal Traceability Audit Box */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-ink-muted space-y-1">
              <p className="font-semibold text-ink-secondary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                Registro de Auditoría Médico-Legal
              </p>
              <p>
                Evento transmitido con estampa cronológica UTC. Ley 1090 de 2006 Código Deontológico de Psicología en Colombia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
