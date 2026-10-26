import React, { useState } from 'react';

interface QuickNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: string, note: string) => void;
}

export const QuickNoteModal: React.FC<QuickNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedPatient, setSelectedPatient] = useState('Camila Torres - 10:00 AM');
  const [noteContent, setNoteContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!noteContent.trim()) return;
    setIsSaved(true);
    setTimeout(() => {
      onSave(selectedPatient, noteContent);
      setIsSaved(false);
      setNoteContent('');
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-4 border border-border-hairline animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">history_edu</span>
            </div>
            <h3 className="font-headline text-[18px] text-on-surface font-bold">Nueva Nota Clínica Rápida</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-ink-muted mb-1.5">Paciente y Consulta</label>
          <select 
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full bg-surface-subtle text-on-surface rounded-lg p-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary border border-border-hairline/60"
          >
            <option value="Camila Torres - 10:00 AM">Camila Torres - 10:00 AM (TAG / TCC)</option>
            <option value="Felipe Mendoza - 11:30 AM">Felipe Mendoza - 11:30 AM (Depresión Leve)</option>
            <option value="Sofia Valderrama - 03:00 PM">Sofia Valderrama - 03:00 PM (Fobia Social)</option>
            <option value="Carlos Restrepo - Interconsulta">Carlos Restrepo - Interconsulta</option>
          </select>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-ink-muted mb-1.5">Observación Inmediata / Intervención</label>
          <textarea 
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Escriba las notas clave post-sesión, hallazgos de examen mental o hipótesis de trabajo..."
            rows={4}
            className="w-full bg-surface-subtle text-on-surface rounded-lg p-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary border border-border-hairline/60 resize-y"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button 
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-lg bg-surface-subtle text-ink-muted text-[13px] font-medium hover:bg-surface-container transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={!noteContent.trim() || isSaved}
            type="button"
            className="px-5 py-2 rounded-lg bg-primary-container text-on-primary text-[13px] font-semibold hover:bg-border-focus transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSaved ? (
              <>
                <span className="material-symbols-outlined text-[16px] text-status-success">check_circle</span>
                <span>Guardado con éxito</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Guardar en Expediente</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
