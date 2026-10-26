import React, { useState } from 'react';
import { NavigationPath } from '../../types/clinical';
import { PATIENTS } from '../../data/mockClinicalData';

interface CopilotIAViewProps {
  onNavigate: (path: NavigationPath) => void;
}

export const CopilotIAView: React.FC<CopilotIAViewProps> = ({ onNavigate }) => {
  const patient = PATIENTS[0]; // Camila Torres
  const [selectedDistortion, setSelectedDistortion] = useState<string>('catastrofismo');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const distortions = [
    {
      id: 'catastrofismo',
      title: 'Catastrofismo / Magnificación Somática',
      confidence: '94%',
      impact: 'Severo',
      color: 'bg-red-50 text-red-700 border-red-200',
      description: 'Tendencia a sobredimensionar sensaciones corporales normales (taquicardia, opresión torácica) atribuyéndoles desenlaces fatales o incapacitantes ("me voy a desmayar y me despedirán").',
      recommendation: 'Reatribución sintomática mediante psicoeducación del sistema nervioso simpático y desensibilización interoceptiva.',
    },
    {
      id: 'lectura-mente',
      title: 'Lectura de Mente (Presunción de Juicio)',
      confidence: '88%',
      impact: 'Moderado a Alto',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Convicción no contrastada de que sus superiores y pares perciben su nerviosismo como incompetencia técnica o fragilidad profesional.',
      recommendation: 'Experimento conductual de verificación selectiva y técnica del abogado del diablo.',
    },
    {
      id: 'polarizado',
      title: 'Pensamiento Dicotómico / Todo o Nada',
      confidence: '82%',
      impact: 'Moderado',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Clasificación de su jornada laboral como "éxito absoluto sin ansiedad" o "fracaso humillante total", sin términos medios.',
      recommendation: 'Gradiente de grises y redefinición funcional de productividad.',
    },
  ];

  const handleCopyInsight = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner and Navigation */}
      <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('paciente-detalle')}
              className="p-2 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-canvas transition-colors border border-border-light"
              title="Volver"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-[14px]">psychology</span>
                  Copilot Clínico NLU v4.2
                </span>
                <span className="text-xs text-ink-muted">Sesión #8 • CITA-9402</span>
              </div>
              <h1 className="text-2xl font-bold font-serif text-ink-primary mt-1">
                Análisis Cognitivo-Emocional: Camila Torres
              </h1>
              <p className="text-xs text-ink-muted">
                HC: MP-4402-CT • 28 años • Sesión del 24 de Octubre de 2025
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('notas-clinicas')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-light bg-surface-card hover:bg-canvas text-ink-secondary text-xs font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              Abrir Nota SOAP
            </button>
            <button
              onClick={handleCopyInsight}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-medium shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">content_paste</span>
              {copiedNotification ? 'Copiado al Portapapeles' : 'Insertar en Nota Clínica'}
            </button>
          </div>
        </div>

        {/* Ethical disclaimer banner */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
          <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0 mt-0.5">policy</span>
          <div>
            <span className="font-semibold">Principio Bioético de Autonomía Profesional:</span> Los análisis e interpretaciones del Copilot IA constituyen una herramienta auxiliar de soporte empírico y no sustituyen el juicio, diagnóstico ni las decisiones terapéuticas exclusivas del psicólogo tratante matriculado (Ley 1090/2006).
          </div>
        </div>
      </div>

      {/* Main Grid: Radar on Left, Detailed Insights on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Emotional Radar & Acoustic telemetry */}
        <div className="lg:col-span-6 space-y-6">
          {/* Radar Chart Card */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-ink-primary font-serif">
                  Radar del Espectro Emocional
                </h2>
                <p className="text-xs text-ink-muted">Basado en corpus lingüístico y biomarcadores de sesión</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Alta Confiabilidad (r=0.91)
              </span>
            </div>

            {/* Radar Graphic SVG */}
            <div className="relative flex items-center justify-center py-4">
              <svg viewBox="0 0 400 400" className="w-full max-w-[340px] h-auto overflow-visible">
                {/* Background Concentric Polygons (Web) */}
                <polygon
                  points="200,40 338,120 338,280 200,360 62,280 62,120"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <polygon
                  points="200,80 304,140 304,260 200,320 96,260 96,140"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <polygon
                  points="200,120 270,160 270,240 200,280 130,240 130,160"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <polygon
                  points="200,160 235,180 235,220 200,240 165,220 165,180"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />

                {/* Axes */}
                <line x1="200" y1="200" x2="200" y2="40" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="200" y1="200" x2="338" y2="120" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="200" y1="200" x2="338" y2="280" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="200" y1="200" x2="200" y2="360" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="200" y1="200" x2="62" y2="280" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="200" y1="200" x2="62" y2="120" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />

                {/* Baseline Shape (Previous Session #7 - grey dashed) */}
                <polygon
                  points="200,55 315,130 290,250 200,310 110,255 85,135"
                  fill="rgba(148, 163, 184, 0.15)"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Current Session Shape (Active #8 - Primary teal filled) */}
                <polygon
                  points="200,60 320,135 280,265 200,330 115,260 90,140"
                  fill="rgba(0, 81, 68, 0.35)"
                  stroke="#005144"
                  strokeWidth="2.5"
                />

                {/* Vertex Dots */}
                <circle cx="200" cy="60" r="4.5" fill="#005144" />
                <circle cx="320" cy="135" r="4.5" fill="#005144" />
                <circle cx="280" cy="265" r="4.5" fill="#005144" />
                <circle cx="200" cy="330" r="4.5" fill="#005144" />
                <circle cx="115" cy="260" r="4.5" fill="#005144" />
                <circle cx="90" cy="140" r="4.5" fill="#005144" />

                {/* Dimension Labels */}
                <text x="200" y="25" textAnchor="middle" className="text-[11px] font-bold fill-slate-800">
                  Ansiedad Somática (88%)
                </text>
                <text x="350" y="120" textAnchor="start" className="text-[11px] font-bold fill-slate-800">
                  Rumiación (85%)
                </text>
                <text x="350" y="285" textAnchor="start" className="text-[11px] font-bold fill-slate-800">
                  Evitación Fóbica (72%)
                </text>
                <text x="200" y="385" textAnchor="middle" className="text-[11px] font-bold fill-slate-800">
                  Desesperanza (28%)
                </text>
                <text x="50" y="285" textAnchor="end" className="text-[11px] font-bold fill-slate-800">
                  Resiliencia (64%)
                </text>
                <text x="50" y="120" textAnchor="end" className="text-[11px] font-bold fill-slate-800">
                  Reactividad (79%)
                </text>
              </svg>
            </div>

            {/* Legend & Comparison */}
            <div className="flex items-center justify-center gap-6 pt-3 border-t border-border-light text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-sm bg-primary/40 border border-primary"></span>
                <span className="font-semibold text-ink-primary">Sesión #8 (Actual)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 border-b-2 border-dashed border-slate-400"></span>
                <span className="text-ink-muted">Sesión #7 (Hace 7 días)</span>
              </div>
            </div>
          </div>

          {/* Acoustic & Speech Telemetry (From E2E Session) */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">graphic_eq</span>
                Marcadores Acústicos del Discurso
              </h3>
              <span className="text-[11px] text-ink-muted font-mono">Stream Audio HD</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-canvas border border-border-light">
                <span className="text-ink-muted block text-[11px]">Cadencia del Habla</span>
                <span className="font-bold text-ink-primary text-sm">164 palabras/min</span>
                <span className="text-[10px] text-amber-600 block mt-0.5">Taquilalia moderada al inicio</span>
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-border-light">
                <span className="text-ink-muted block text-[11px]">Frecuencia Respiratoria</span>
                <span className="font-bold text-ink-primary text-sm">21 respiraciones/min</span>
                <span className="text-[10px] text-red-600 block mt-0.5">+5 rpm sobre línea basal</span>
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-border-light">
                <span className="text-ink-muted block text-[11px]">Pausas Silenciosas</span>
                <span className="font-bold text-ink-primary text-sm">14 micro-pausas</span>
                <span className="text-[10px] text-ink-muted block mt-0.5">Asociadas a reaseguramiento</span>
              </div>
              <div className="p-3 rounded-xl bg-canvas border border-border-light">
                <span className="text-ink-muted block text-[11px]">Prosodia & Entonación</span>
                <span className="font-bold text-ink-primary text-sm">Constreñida</span>
                <span className="text-[10px] text-ink-muted block mt-0.5">Tensión laríngea evidente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Cognitive Distortions & Therapeutic Toolbox */}
        <div className="lg:col-span-6 space-y-6">
          {/* Cognitive Distortions Mapping */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-ink-primary font-serif">
                Mapeo de Distorsiones Cognitivas
              </h2>
              <span className="text-xs text-ink-muted">3 esquemas detectados</span>
            </div>

            <div className="space-y-3">
              {distortions.map((dist) => (
                <div
                  key={dist.id}
                  onClick={() => setSelectedDistortion(dist.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedDistortion === dist.id
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-border-light bg-surface-card hover:bg-canvas/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-ink-primary">{dist.title}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${dist.color}`}>
                        {dist.impact}
                      </span>
                      <span className="text-[10px] font-mono text-ink-muted bg-canvas px-1.5 py-0.5 rounded">
                        {dist.confidence} conf.
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">{dist.description}</p>
                  <div className="mt-2.5 pt-2 border-t border-border-light/60 flex items-start gap-1.5 text-xs text-primary">
                    <span className="material-symbols-outlined text-[15px] shrink-0 mt-0.5">tips_and_updates</span>
                    <span className="text-[11px] leading-snug">
                      <strong className="font-semibold">Intervención Sugerida:</strong> {dist.recommendation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Therapeutic Toolbox (TCC / ACT) */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">build</span>
              Caja de Herramientas TCC Recomendadas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border-light bg-canvas hover:border-primary/50 transition-colors">
                <span className="font-bold text-ink-primary block">Desensibilización Interoceptiva</span>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  Protocolo Barlow: Provocación voluntaria de hiperventilación por 60 seg en consultorio.
                </p>
                <span className="text-[10px] text-primary font-semibold block mt-2">Evidencia Grado A</span>
              </div>

              <div className="p-3 rounded-xl border border-border-light bg-canvas hover:border-primary/50 transition-colors">
                <span className="font-bold text-ink-primary block">Técnica de Tres Columnas (Beck)</span>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  Registro: 1) Situación desencadenante 2) Pensamiento automático 3) Respuesta adaptativa.
                </p>
                <span className="text-[10px] text-primary font-semibold block mt-2">Tarea para la semana</span>
              </div>

              <div className="p-3 rounded-xl border border-border-light bg-canvas hover:border-primary/50 transition-colors">
                <span className="font-bold text-ink-primary block">Defusión Cognitiva (ACT)</span>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  Distanciamiento: "Estoy teniendo el pensamiento de que voy a fallar" vs "Voy a fallar".
                </p>
                <span className="text-[10px] text-primary font-semibold block mt-2">Aplicación clínica</span>
              </div>

              <div className="p-3 rounded-xl border border-border-light bg-canvas hover:border-primary/50 transition-colors">
                <span className="font-bold text-ink-primary block">Respiración 4-7-8 con Biofeedback</span>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  Activación del tono vagal para yugular hiperventilación prodrómica en oficina.
                </p>
                <span className="text-[10px] text-primary font-semibold block mt-2">Regulación autonómica</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('notas-clinicas')}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <span className="material-symbols-outlined text-[17px]">note_add</span>
                Incorporar Diagnóstico a Nota de Evolución
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
