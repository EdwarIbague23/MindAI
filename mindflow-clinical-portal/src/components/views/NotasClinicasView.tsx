import React, { useState } from 'react';
import { NavigationPath } from '../../types/clinical';
import { PATIENTS } from '../../data/mockClinicalData';

interface NotasClinicasViewProps {
  onNavigate: (path: NavigationPath) => void;
  onOpenSignModal: () => void;
}

export const NotasClinicasView: React.FC<NotasClinicasViewProps> = ({
  onNavigate,
  onOpenSignModal,
}) => {
  const patient = PATIENTS[0]; // Camila Torres

  // SOAP State
  const [subjective, setSubjective] = useState(
    `Paciente de 28 años asiste a su sesión puntual, presentación adecuada y orientada en las tres esferas. Manifiesta: "He tenido dos episodios de disnea intensa y opresión retroesternal en la oficina esta semana, especialmente el martes antes de la junta directiva. Sentí que me desmayaría y que todos notarían mi debilidad." Reporta higiene del sueño deteriorada (despertares a las 3:30 AM con rumiaciones sobre su desempeño laboral). No refiere ideación tanática ni autolítica en la última semana, aunque expresa fatiga mental severa persistente.`
  );

  const [objective, setObjective] = useState(
    `Signos y Examen Mental:
- Afecto: Ansioso con labilidad emocional contenida.
- Psicomotricidad: Movimientos rápidos de extremidades inferiores (temblor distal leve en manos).
- Lenguaje: Taquipsíquico con modulación de volumen conservada.
- Pensamiento: Coherente, centrado en temáticas de perfeccionismo y temor a la evaluación negativa (catastrofismo selectivo).
- Biometría durante sesión remota: Frecuencia respiratoria estimada en 21 rpm al rememorar eventos laborales.
- Escala PHQ-9 aplicada: 9/27 (sintomatología depresiva leve/reactiva). GAD-7: 15/21 (ansiedad generalizada severa).`
  );

  const [assessment, setAssessment] = useState(
    `Impresión Diagnóstica y Formulación:
- F41.1 Trastorno de Ansiedad Generalizada / Episodios de Pánico comórbidos (F41.0).
- Evolución: Paciente responde favorablemente al encuadre psicoeducativo sobre el circuito fisiológico del pánico, sin embargo mantiene sesgo atencional hacia señales viscerales. 
- Distorsiones predominantes identificadas: Catastrofismo ("voy a perder el control en público") y Falacia de Control ("debo rendir al 110% siempre").
- Factores mantenedores: Conductas de reaseguramiento constantes en el entorno laboral.`
  );

  const [plan, setPlan] = useState(
    `Plan Terapéutico y Tareas:
1. Reestructuración Cognitiva: Registro diario de pensamientos automáticos ante sensaciones de despersonalización/opresión torácica.
2. Exposición Interoceptiva graduada: Respiración hiperventilatoria controlada en sesión 9.
3. Entrenamiento en Desaceleración y Técnica 5-4-3-2-1 para interrupción de rumiaciones nocturnas.
4. Mantener contacto con psiquiatría de enlace para titulación de ISRS si GAD-7 persiste > 14 en semana 10.
5. Próxima sesión: Jueves 31 de Octubre a las 09:00 AM (CITA-9488).`
  );

  const [activeTab, setActiveTab] = useState<'soap' | 'copilot' | 'historico' | 'psicometria'>('soap');
  const [isCopilotApplied, setIsCopilotApplied] = useState(false);
  const [lastSaved, setLastSaved] = useState('Hace 12 segundos (Autoguardado)');

  const totalWords = (subjective + ' ' + objective + ' ' + assessment + ' ' + plan)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const handleInsertCopilotInsight = () => {
    setIsCopilotApplied(true);
    setAssessment(prev =>
      prev +
      '\n\n[INCORPORACIÓN COPILOT IA - 24/OCT]: Se corrobora un patrón de distorsión de Pensamiento Polarizado (Confianza 89%) y sesgo de lectura de mente respecto a pares ejecutivos. Se sugiere vincular técnica de descentramiento cognitivo de Hayes.'
    );
    setLastSaved('Autoguardado con Copilot añadido');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={() => onNavigate('paciente-detalle')}
              className="mt-1 p-2 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-canvas transition-colors border border-border-light"
              title="Volver a Expediente"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Borrador Clínico Activo
                </span>
                <span className="text-xs text-ink-muted">Sesión #8 • CITA-9402</span>
                <span className="text-xs text-ink-muted">• 24 Octubre 2025</span>
              </div>
              <h1 className="text-2xl font-bold font-serif text-ink-primary mt-1">
                Nota de Evolución SOAP: Camila Torres
              </h1>
              <p className="text-xs text-ink-muted">
                HC: MP-4402-CT • Psicoterapia Individual Cognitivo-Conductual • F41.1 TAG
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-ink-primary flex items-center justify-end gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">cloud_done</span>
                {lastSaved}
              </p>
              <p className="text-[11px] text-ink-muted">Contador: <span className="font-semibold text-ink-primary">{totalWords}</span> palabras</p>
            </div>

            <button
              onClick={() => onNavigate('analisis-copilot-ia')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-semibold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[17px] text-primary">psychology</span>
              Copilot Clínico
            </button>

            <button
              onClick={onOpenSignModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.01]"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              Firmar Nota (ED25519)
            </button>
          </div>
        </div>

        {/* Tab Navigation in editor */}
        <div className="flex items-center gap-2 border-t border-border-light mt-4 pt-3 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('soap')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'soap'
                ? 'bg-primary text-white font-semibold'
                : 'text-ink-muted hover:text-ink-primary hover:bg-canvas'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            Formato SOAP Estándar
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'copilot'
                ? 'bg-primary text-white font-semibold'
                : 'text-ink-muted hover:text-ink-primary hover:bg-canvas'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            Asistente IA Integrado
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'historico'
                ? 'bg-primary text-white font-semibold'
                : 'text-ink-muted hover:text-ink-primary hover:bg-canvas'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            Comparativa Sesiones Previas
          </button>
          <button
            onClick={() => setActiveTab('psicometria')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'psicometria'
                ? 'bg-primary text-white font-semibold'
                : 'text-ink-muted hover:text-ink-primary hover:bg-canvas'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">query_stats</span>
            Escalas & Tests (GAD-7 / PHQ-9)
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SOAP Note Editor */}
        <div className="lg:col-span-8 space-y-5">
          {/* S - Subjetivo */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-200">
                  S
                </span>
                <h3 className="font-semibold text-sm text-ink-primary">
                  Subjetivo (Relato del Paciente & Motivo de Consulta)
                </h3>
              </div>
              <span className="text-[11px] text-ink-muted">Expresiones literales y vivencia subjetiva</span>
            </div>
            <textarea
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              rows={4}
              className="w-full text-xs text-ink-primary bg-canvas/60 rounded-xl p-3.5 border border-border-light focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white leading-relaxed resize-y font-sans transition-all"
              placeholder="Describa el motivo expresado por el paciente, sensaciones subjetivas, eventos detonantes..."
            />
          </div>

          {/* O - Objetivo */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-800 font-bold text-xs flex items-center justify-center border border-blue-200">
                  O
                </span>
                <h3 className="font-semibold text-sm text-ink-primary">
                  Objetivo (Examen Mental, Signos Clínicos & Observación Conductual)
                </h3>
              </div>
              <span className="text-[11px] text-ink-muted">Hallazgos observables y métricas</span>
            </div>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={5}
              className="w-full text-xs text-ink-primary bg-canvas/60 rounded-xl p-3.5 border border-border-light focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white leading-relaxed resize-y font-sans transition-all"
              placeholder="Examen del estado mental, apariencia psicomotriz, lenguaje, escalas psicométricas aplicadas..."
            />
          </div>

          {/* A - Análisis / Evaluación */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs transition-shadow hover:shadow-sm relative">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center border border-amber-200">
                  A
                </span>
                <h3 className="font-semibold text-sm text-ink-primary">
                  Análisis Clínico (Formulación, Hipótesis & Evolución Diagnóstica)
                </h3>
              </div>
              {!isCopilotApplied && (
                <button
                  onClick={handleInsertCopilotInsight}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-md transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  + Insertar Hallazgos Copilot
                </button>
              )}
            </div>
            <textarea
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              rows={5}
              className="w-full text-xs text-ink-primary bg-canvas/60 rounded-xl p-3.5 border border-border-light focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white leading-relaxed resize-y font-sans transition-all"
              placeholder="Integración clínica, distorsiones cognitivas dominantes, hipótesis mantenedora y diagnóstico DSM-5 / CIE-11..."
            />
          </div>

          {/* P - Plan */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                  P
                </span>
                <h3 className="font-semibold text-sm text-ink-primary">
                  Plan Terapéutico (Intervenciones, Tareas Entre Sesiones & Próxima Cita)
                </h3>
              </div>
              <span className="text-[11px] text-ink-muted">Contratos conductuales y seguimiento</span>
            </div>
            <textarea
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              rows={4}
              className="w-full text-xs text-ink-primary bg-canvas/60 rounded-xl p-3.5 border border-border-light focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white leading-relaxed resize-y font-sans transition-all"
              placeholder="Intervenciones realizadas, psicoeducación brindada, prescripciones de tareas y fecha acordada..."
            />
          </div>

          {/* Action Bar Footer */}
          <div className="bg-canvas border border-border-light rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-ink-muted">
              <span className="material-symbols-outlined text-[18px] text-ink-secondary">lock</span>
              <span>Cifrado militar en reposo (AES-256-GCM). Cumplimiento Ley 1581/2012 y Res. 1995.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setLastSaved('Guardado manual completado');
                }}
                className="px-3 py-1.5 rounded-lg border border-border-light bg-surface-card hover:bg-canvas text-ink-secondary font-medium transition-colors"
              >
                Guardar Borrador
              </button>
              <button
                onClick={onOpenSignModal}
                className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-white font-medium transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">history_edu</span>
                Firmar y Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Clinical Copilot Drawer & Reference Panel */}
        <div className="lg:col-span-4 space-y-5">
          {/* Quick Copilot Insights Card */}
          <div className="bg-gradient-to-br from-emerald-900 via-primary to-teal-950 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-white/10 text-emerald-300">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                </span>
                <div>
                  <h4 className="font-semibold text-xs tracking-wide">Copilot Clínico Activo</h4>
                  <p className="text-[10px] text-emerald-200/80">Procesamiento NLU en Tiempo Real</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/10 font-mono">
                Model: BioMed-Llama
              </span>
            </div>

            <div className="space-y-3 relative z-10 text-xs mt-3">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <p className="text-[11px] font-semibold text-emerald-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  Distorsión Prevalente Detectada
                </p>
                <p className="text-white text-xs mt-1 leading-snug">
                  Catastrofismo anticipatorio con rumiación somática. 3 menciones a "pérdida de control".
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <p className="text-[11px] font-semibold text-emerald-200 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                  Sugerencia Técnica TCC
                </p>
                <p className="text-white text-xs mt-1 leading-snug">
                  Aplicar reatribución de sensaciones cardiorrespiratorias benignas y prescripción de parada de pensamiento.
                </p>
              </div>

              <button
                onClick={() => onNavigate('analisis-copilot-ia')}
                className="w-full mt-2 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                <span>Abrir Radar de Espectro Emocional</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Psychometric Scores Card */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted flex items-center justify-between">
              <span>Baremos Psicométricos Recientes</span>
              <span className="text-primary cursor-pointer hover:underline text-[11px] font-medium">Ver Histórico</span>
            </h4>

            {/* GAD-7 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-ink-primary">GAD-7 (Ansiedad)</span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                  15 / 21 • Severa
                </span>
              </div>
              <div className="w-full bg-canvas rounded-full h-2 overflow-hidden border border-border-light">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '71%' }}></div>
              </div>
              <p className="text-[10px] text-ink-muted mt-1">Evolución: -3 pts respecto a la semana de crisis basal (18/21).</p>
            </div>

            {/* PHQ-9 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-ink-primary">PHQ-9 (Depresión)</span>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                  9 / 27 • Leve
                </span>
              </div>
              <div className="w-full bg-canvas rounded-full h-2 overflow-hidden border border-border-light">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '33%' }}></div>
              </div>
              <p className="text-[10px] text-ink-muted mt-1">Sintomatología anhedónica reactiva a fatiga laboral.</p>
            </div>
          </div>

          {/* Quick Reference Notes */}
          <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Recordatorio Clínico del Caso
            </h4>
            <ul className="text-xs space-y-2 text-ink-secondary">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">verified</span>
                <span>Consentimiento Informado Ley 1090/2006 firmado digitalmente el 10/Sep/2025.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">contact_phone</span>
                <span>Contacto de emergencia: Carlos Torres (Hermano) - +57 312 908 1122.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">medication</span>
                <span>Tratamiento farmacológico: Sertralina 50mg/día formulada por Psiquiatría Externa.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
