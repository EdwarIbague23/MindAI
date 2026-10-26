import React, { useState } from 'react';

interface ManualAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { type: string; title: string; date: string; time: string; notes: string }) => void;
  initialTime?: string;
}

export const ManualAppointmentModal: React.FC<ManualAppointmentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialTime = '16:00',
}) => {
  const [entryType, setEntryType] = useState<'cita' | 'bloqueo'>('cita');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2025-10-24');
  const [time, setTime] = useState(initialTime);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      type: entryType,
      title: title || (entryType === 'cita' ? 'Cita Manual Paciente' : 'Bloqueo Personal'),
      date,
      time,
      notes
    });
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-card rounded-2xl shadow-2xl max-w-[480px] w-full p-6 flex flex-col gap-4 border border-border-hairline animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[22px]">event_busy</span>
            <h3 className="font-headline text-[18px] text-on-surface font-bold">Bloquear Horario / Cita Manual</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-on-surface block mb-1.5">Tipo de Entrada</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEntryType('cita')}
                className={`p-2.5 rounded-lg text-[13px] font-semibold text-center transition-all cursor-pointer ${
                  entryType === 'cita'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'bg-surface-subtle text-ink-muted hover:text-on-surface'
                }`}
              >
                Cita Manual
              </button>
              <button
                type="button"
                onClick={() => setEntryType('bloqueo')}
                className={`p-2.5 rounded-lg text-[13px] font-semibold text-center transition-all cursor-pointer ${
                  entryType === 'bloqueo'
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'bg-surface-subtle text-ink-muted hover:text-on-surface'
                }`}
              >
                Bloqueo Personal
              </button>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-on-surface block mb-1" htmlFor="patientInput">
              {entryType === 'cita' ? 'Paciente o Motivo' : 'Motivo del Bloqueo'}
            </label>
            <input
              id="patientInput"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={entryType === 'cita' ? 'Ej: Camila Torres o Nuevo Ingreso' : 'Ej: Supervisión clínica, Almuerzo, Congreso'}
              className="w-full h-11 px-3.5 rounded-lg bg-surface-subtle text-on-surface text-[14px] focus:outline-none focus:ring-2 focus:ring-primary border border-border-hairline/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-semibold text-on-surface block mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-surface-subtle text-on-surface text-[13px] focus:outline-none focus:ring-2 focus:ring-primary border border-border-hairline/60"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-on-surface block mb-1">Hora Inicio</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-surface-subtle text-on-surface text-[13px] focus:outline-none focus:ring-2 focus:ring-primary border border-border-hairline/60"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-on-surface block mb-1">Nota Confidencial</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalles clínicos o preparativos de la sesión..."
              className="w-full p-3 rounded-lg bg-surface-subtle text-on-surface text-[13px] focus:outline-none focus:ring-2 focus:ring-primary border border-border-hairline/60 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-ink-muted hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary text-[13px] font-semibold hover:bg-border-focus transition-all shadow-sm cursor-pointer"
            >
              Confirmar y Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
