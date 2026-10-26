import React, { useState } from 'react';
import { NavigationPath } from '../../types/clinical';
import { PATIENTS } from '../../data/mockClinicalData';

interface InformesViewProps {
  onNavigate: (path: NavigationPath) => void;
}

export const InformesView: React.FC<InformesViewProps> = ({ onNavigate }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p-camila');
  const [reportType, setReportType] = useState<string>('evolucion');
  const [includePsychometrics, setIncludePsychometrics] = useState<boolean>(true);
  const [includeCopilotSummary, setIncludeCopilotSummary] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const currentPatient = PATIENTS.find(p => p.id === selectedPatientId) || PATIENTS[0];

  const handleDownloadPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }, 1200);
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
                Estándar MinSalud & Colpsic
              </span>
              <span className="text-xs text-ink-muted">Resolución 1995/1999 • Firma Digital ED25519</span>
            </div>
            <h1 className="text-2xl font-bold font-serif text-ink-primary mt-1">
              Generador de Informes Clínicos & Periciales
            </h1>
            <p className="text-xs text-ink-muted">
              Emisión de certificaciones asistenciales, reportes de remisión y evolución psicoterapéutica.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isExporting ? 'hourglass_top' : 'download'}
              </span>
              {isExporting ? 'Generando PDF Seguro...' : 'Descargar PDF Certificado'}
            </button>
          </div>
        </div>

        {exportSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">task_alt</span>
              <span>
                Informe Clínico generado exitosamente con firma electrónica y sellado criptográfico SHA-256.
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700">HASH: 8f9b...a12c</span>
          </div>
        )}

        {/* Global Clinic Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-4 border-t border-border-light">
          <div className="p-3 rounded-xl bg-canvas border border-border-light">
            <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">Adherencia Terapéutica</span>
            <span className="text-2xl font-bold font-serif text-primary mt-1 block">92.4%</span>
            <span className="text-[10px] text-emerald-700 flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">trending_up</span>
              +4.1% vs mes anterior
            </span>
          </div>

          <div className="p-3 rounded-xl bg-canvas border border-border-light">
            <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">Reducción Media GAD-7</span>
            <span className="text-2xl font-bold font-serif text-primary mt-1 block">-38%</span>
            <span className="text-[10px] text-emerald-700">Mejoría en 14 de 16 pacientes</span>
          </div>

          <div className="p-3 rounded-xl bg-canvas border border-border-light">
            <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">Consultas del Mes</span>
            <span className="text-2xl font-bold font-serif text-ink-primary mt-1 block">54 Sesiones</span>
            <span className="text-[10px] text-ink-muted">38 remotas • 16 presenciales</span>
          </div>

          <div className="p-3 rounded-xl bg-canvas border border-border-light">
            <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">Informes Validados</span>
            <span className="text-2xl font-bold font-serif text-ink-primary mt-1 block">12 Emitidos</span>
            <span className="text-[10px] text-ink-muted">Sin observaciones de auditoría</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Config on left, Preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Report Options */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted">
              Parámetros de Emisión
            </h2>

            {/* Select Patient */}
            <div>
              <label className="text-xs font-semibold text-ink-primary block mb-1.5">
                Paciente Destinatario
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full text-xs font-medium bg-canvas border border-border-light rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-ink-primary"
              >
                {PATIENTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code}) - {p.diagnosis || p.condition}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Report Type */}
            <div>
              <label className="text-xs font-semibold text-ink-primary block mb-1.5">
                Tipo de Certificación o Informe
              </label>
              <div className="space-y-2">
                {[
                  { id: 'evolucion', label: 'Informe de Evolución y Cierre de Fase', desc: 'Resumen TCC, objetivos cumplidos y baremos psicométricos.' },
                  { id: 'remision', label: 'Remisión Interdisciplinaria a Psiquiatría', desc: 'Sintomatología refractaria para valoración psicofarmacológica.' },
                  { id: 'constancia', label: 'Constancia de Asistencia Asistencial', desc: 'Certificado oficial para entidades laborales o académicas.' },
                  { id: 'pericial', label: 'Concepto Clínico Forense / Pericial', desc: 'Evaluación de daño psíquico según marco legal vigente.' },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setReportType(item.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      reportType === item.id
                        ? 'border-primary bg-primary/5 text-ink-primary'
                        : 'border-border-light bg-canvas hover:bg-slate-100 text-ink-secondary'
                    }`}
                  >
                    <span className="font-bold block">{item.label}</span>
                    <span className="text-[11px] text-ink-muted block mt-0.5">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-border-light">
              <label className="flex items-center gap-2 text-xs text-ink-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePsychometrics}
                  onChange={(e) => setIncludePsychometrics(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Incluir Curvas de Evolución Psicométrica (GAD-7 / PHQ-9)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-ink-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCopilotSummary}
                  onChange={(e) => setIncludeCopilotSummary(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Incluir Mapeo de Distorsiones Cognitivas (Copilot NLU)</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                onClick={handleDownloadPDF}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[17px]">print</span>
                Exportar Documento Oficial Firmado
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: High Fidelity Document Preview */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-border-light rounded-2xl p-8 shadow-sm space-y-6 text-ink-primary font-sans relative">
            {/* Watermark / Seal */}
            <div className="absolute top-6 right-6 opacity-80 flex flex-col items-center pointer-events-none">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center p-1 text-center">
                <span className="text-[8px] font-bold text-primary uppercase tracking-tighter leading-none">
                  COLPSIC VERIFICADO 2025
                </span>
              </div>
            </div>

            {/* Document Header */}
            <div className="border-b-2 border-primary/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[24px]">psychology</span>
                </div>
                <div>
                  <h3 className="font-bold text-base font-serif text-primary tracking-wide">
                    MINDFLOW CLINICAL NETWORK
                  </h3>
                  <p className="text-[11px] text-ink-muted">
                    Centro Especializado de Atención Psicológica & Psicoterapia Cognitivo-Conductual
                  </p>
                  <p className="text-[10px] text-ink-muted">
                    Registro Prestador de Servicios de Salud REPS No. 1100129841-01 • Bogotá D.C.
                  </p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center py-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-primary">
                {reportType === 'evolucion' && 'INFORME DE EVOLUCIÓN CLÍNICA Y CIERRE TERAPÉUTICO'}
                {reportType === 'remision' && 'REMISIÓN CLÍNICA INTERDISCIPLINARIA A PSIQUIATRÍA'}
                {reportType === 'constancia' && 'CONSTANCIA ASISTENCIAL DE TRATAMIENTO PSICOLÓGICO'}
                {reportType === 'pericial' && 'DICTAMEN PSICOLÓGICO CLÍNICO PERICIAL'}
              </h2>
              <span className="text-[11px] text-ink-muted font-mono block mt-0.5">
                Código Documental: INF-2025-0842 • Fecha de Emisión: 24 de Octubre de 2025
              </span>
            </div>

            {/* Patient Data Grid */}
            <div className="bg-canvas rounded-xl p-3.5 border border-border-light text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-ink-muted block uppercase">Paciente</span>
                <span className="font-bold text-ink-primary">{currentPatient.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-muted block uppercase">Documento / HC</span>
                <span className="font-mono font-medium text-ink-primary">{currentPatient.code}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-muted block uppercase">Edad / Sexo</span>
                <span className="font-medium text-ink-primary">{currentPatient.age} años • {currentPatient.gender}</span>
              </div>
              <div>
                <span className="text-[10px] text-ink-muted block uppercase">Diagnóstico CIE-11</span>
                <span className="font-medium text-ink-primary">{currentPatient.diagnosis || currentPatient.condition}</span>
              </div>
            </div>

            {/* Clinical Content Paragraphs */}
            <div className="text-xs space-y-3 leading-relaxed text-ink-secondary">
              <p>
                <strong className="text-ink-primary">1. Motivo de Consulta y Antecedentes:</strong> Paciente que acudió voluntariamente remitida por cuadro de tres meses de evolución consistente en crisis recurrentes de angustia, hiperventilación, rumiaciones obsesivas en torno al ámbito profesional y evitación fóbica de reuniones ejecutivas.
              </p>

              <p>
                <strong className="text-ink-primary">2. Metodología Terapéutica:</strong> Se implementó un programa estructurado de Psicoterapia Cognitivo-Conductual (TCC) de 8 sesiones de 50 minutos con periodicidad semanal. Se abordaron módulos de reestructuración de pensamientos automáticos catastrofistas, entrenamiento en regulación autonómica (respiración diafragmática) y exposición interoceptiva graduada.
              </p>

              {includePsychometrics && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <strong className="text-ink-primary block mb-1">3. Evaluación Psicométrica Comparativa:</strong>
                  <div className="grid grid-cols-2 gap-4 mt-1 text-[11px]">
                    <div>
                      <span className="text-ink-muted block">Escala de Ansiedad GAD-7:</span>
                      <span className="font-mono font-bold text-emerald-800">
                        Basal: 18/21 (Severa) &rarr; Actual: 15/21 (-16.6%)
                      </span>
                    </div>
                    <div>
                      <span className="text-ink-muted block">Cuestionario Depresión PHQ-9:</span>
                      <span className="font-mono font-bold text-emerald-800">
                        Basal: 12/27 (Moderada) &rarr; Actual: 9/27 (Leve)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <p>
                <strong className="text-ink-primary">4. Concepto Clínico y Recomendaciones:</strong> Se evidencia remisión parcial significativa de la reactividad psicosomática. La paciente ha integrado recursos de afrontamiento eficaces. Se sugiere mantener sesiones de consolidación quincenal y continuar seguimiento multidisciplinar.
              </p>
            </div>

            {/* Signature & Security Footer */}
            <div className="pt-6 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <div className="w-36 h-10 border-b border-ink-primary/60 flex items-center justify-center">
                  <span className="font-serif italic text-primary text-sm">Dr. Mateo Arboleda</span>
                </div>
                <p className="font-bold text-ink-primary">Dr. Mateo Arboleda R.</p>
                <p className="text-[10px] text-ink-muted">Psicólogo Clínico • Mg. Neuropsicología</p>
                <p className="text-[10px] text-ink-muted">Tarjeta Profesional Colpsic No. 109284-CO</p>
              </div>

              <div className="text-right flex items-center gap-3">
                <div className="text-[10px] text-ink-muted text-right">
                  <p className="font-mono font-semibold text-emerald-700">FIRMA ELECTRÓNICA VÁLIDA</p>
                  <p>Certificado PKI: ED25519-SHA512</p>
                  <p>Timestamp: 2025-10-24 09:14:02 COT</p>
                </div>
                <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded p-1 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px] text-slate-700">qr_code_2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
