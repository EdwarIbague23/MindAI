import React, { useState } from 'react';
import { NavigationPath } from '../../types/clinical';

interface DaySchedule {
  dayName: string;
  dayShort: string;
  enabled: boolean;
  slots: { id: string; start: string; end: string; modality: 'hibrido' | 'teleconsulta' | 'presencial' }[];
}

export const DisponibilidadView: React.FC = () => {
  const [bufferTime, setBufferTime] = useState<number>(15);
  const [maxAdvanceDays, setMaxAdvanceDays] = useState<number>(30);
  const [calendarSync, setCalendarSync] = useState<boolean>(true);
  const [autoBlockHolidays, setAutoBlockHolidays] = useState<boolean>(true);
  const [savedToast, setSavedToast] = useState(false);

  const [schedule, setSchedule] = useState<DaySchedule[]>([
    {
      dayName: 'Lunes',
      dayShort: 'LUN',
      enabled: true,
      slots: [
        { id: 'lun-1', start: '08:00', end: '12:00', modality: 'teleconsulta' },
        { id: 'lun-2', start: '14:00', end: '18:00', modality: 'hibrido' },
      ],
    },
    {
      dayName: 'Martes',
      dayShort: 'MAR',
      enabled: true,
      slots: [
        { id: 'mar-1', start: '08:00', end: '13:00', modality: 'presencial' },
        { id: 'mar-2', start: '15:00', end: '19:00', modality: 'teleconsulta' },
      ],
    },
    {
      dayName: 'Miércoles',
      dayShort: 'MIÉ',
      enabled: true,
      slots: [
        { id: 'mie-1', start: '08:00', end: '12:00', modality: 'teleconsulta' },
        { id: 'mie-2', start: '14:00', end: '18:00', modality: 'hibrido' },
      ],
    },
    {
      dayName: 'Jueves',
      dayShort: 'JUE',
      enabled: true,
      slots: [
        { id: 'jue-1', start: '08:00', end: '12:00', modality: 'teleconsulta' },
        { id: 'jue-2', start: '14:00', end: '18:00', modality: 'presencial' },
      ],
    },
    {
      dayName: 'Viernes',
      dayShort: 'VIE',
      enabled: true,
      slots: [
        { id: 'vie-1', start: '08:00', end: '13:00', modality: 'teleconsulta' },
        { id: 'vie-2', start: '14:00', end: '17:00', modality: 'hibrido' },
      ],
    },
    {
      dayName: 'Sábado',
      dayShort: 'SÁB',
      enabled: false,
      slots: [{ id: 'sab-1', start: '09:00', end: '13:00', modality: 'teleconsulta' }],
    },
    {
      dayName: 'Domingo',
      dayShort: 'DOM',
      enabled: false,
      slots: [],
    },
  ]);

  const toggleDay = (index: number) => {
    setSchedule(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], enabled: !copy[index].enabled };
      return copy;
    });
  };

  const addSlot = (dayIndex: number) => {
    setSchedule(prev => {
      const copy = [...prev];
      const newSlotId = `slot-${Date.now()}`;
      copy[dayIndex] = {
        ...copy[dayIndex],
        slots: [
          ...copy[dayIndex].slots,
          { id: newSlotId, start: '15:00', end: '18:00', modality: 'teleconsulta' },
        ],
      };
      return copy;
    });
  };

  const removeSlot = (dayIndex: number, slotId: string) => {
    setSchedule(prev => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        slots: copy[dayIndex].slots.filter(s => s.id !== slotId),
      };
      return copy;
    });
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Horarios Activos
              </span>
              <span className="text-xs text-ink-muted">Zona: America/Bogota (COT - UTC-5)</span>
            </div>
            <h1 className="text-2xl font-bold font-serif text-ink-primary mt-1">
              Disponibilidad y Bloqueos Clínicos
            </h1>
            <p className="text-xs text-ink-muted">
              Define los rangos semanales para asignación de citas presenciales y virtuales con pacientes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.01]"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Guardar Configuración
            </button>
          </div>
        </div>

        {savedToast && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
              <span>Disponibilidad asistencial actualizada correctamente en el portal y sincronizada con Google Calendar.</span>
            </div>
            <button onClick={() => setSavedToast(false)} className="text-emerald-700 hover:text-emerald-900">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}
      </div>

      {/* Top Setting Cards: Calendar Sync & Buffer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Google / Outlook Calendar Sync */}
        <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                <span className="material-symbols-outlined text-[20px]">sync</span>
              </span>
              <div>
                <h3 className="font-bold text-xs text-ink-primary">Sincronización Bidireccional</h3>
                <p className="text-[11px] text-ink-muted">Google Calendar & Outlook</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={calendarSync}
                onChange={() => setCalendarSync(!calendarSync)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Bloquea automáticamente los horarios en MindFlow si tienes reuniones o compromisos personales en tu cuenta vinculada.
          </p>
          <div className="pt-2 border-t border-border-light flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Sincronizado (mateo.arboleda@mindflow.co)
            </span>
            <span className="text-ink-muted">Hace 4 min</span>
          </div>
        </div>

        {/* Clinical Buffer Time between sessions */}
        <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </span>
            <div>
              <h3 className="font-bold text-xs text-ink-primary">Buffer Clínico Entre Citas</h3>
              <p className="text-[11px] text-ink-muted">Tiempo para Notas SOAP y descanso</p>
            </div>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Margen de transición obligatorio insertado de manera automática entre sesiones consecutivas.
          </p>
          <div className="flex items-center gap-2 pt-1">
            {[10, 15, 20].map((mins) => (
              <button
                key={mins}
                onClick={() => setBufferTime(mins)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  bufferTime === mins
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-canvas text-ink-secondary border-border-light hover:bg-slate-100'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>
        </div>

        {/* Advance Booking Limit */}
        <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
              <span className="material-symbols-outlined text-[20px]">event_available</span>
            </span>
            <div>
              <h3 className="font-bold text-xs text-ink-primary">Ventana de Anticipación</h3>
              <p className="text-[11px] text-ink-muted">Límite de autoprogramación</p>
            </div>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Rango máximo en el futuro para que los pacientes o la recepción agenden consultas terapéuticas.
          </p>
          <div className="flex items-center gap-2 pt-1">
            {[15, 30, 60].map((days) => (
              <button
                key={days}
                onClick={() => setMaxAdvanceDays(days)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  maxAdvanceDays === days
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-canvas text-ink-secondary border-border-light hover:bg-slate-100'
                }`}
              >
                {days} días
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Schedule Planner */}
      <div className="bg-surface-card border border-border-light rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold font-serif text-ink-primary">
              Horario Semanal Recurrente
            </h2>
            <p className="text-xs text-ink-muted">
              Activa los días de consulta y añade bloques de atención con su modalidad específica.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <span className="text-ink-muted">Teleconsulta E2E</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-ink-muted">Presencial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
              <span className="text-ink-muted">Híbrido</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {schedule.map((day, dayIndex) => (
            <div
              key={day.dayName}
              className={`p-4 rounded-xl border transition-all ${
                day.enabled
                  ? 'border-border-light bg-surface-card'
                  : 'border-border-light/60 bg-canvas/50 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-40">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={() => toggleDay(dayIndex)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <span className="font-bold text-xs text-ink-primary tracking-wide">
                    {day.dayName}
                  </span>
                </div>

                {/* Slots List */}
                <div className="flex-1">
                  {day.enabled ? (
                    day.slots.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {day.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-canvas border border-border-light text-xs"
                          >
                            <span className="font-mono font-medium text-ink-primary">
                              {slot.start} - {slot.end}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize ${
                                slot.modality === 'teleconsulta'
                                  ? 'bg-primary/10 text-primary'
                                  : slot.modality === 'presencial'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-teal-100 text-teal-800'
                              }`}
                            >
                              {slot.modality}
                            </span>
                            <button
                              onClick={() => removeSlot(dayIndex, slot.id)}
                              className="text-ink-muted hover:text-red-600 transition-colors p-0.5 rounded"
                              title="Eliminar bloque"
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addSlot(dayIndex)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed border-primary/40 hover:border-primary text-primary hover:bg-primary/5 text-xs font-semibold transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                          Añadir Bloque
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-ink-muted italic">Sin bloques definidos para este día.</p>
                    )
                  ) : (
                    <span className="text-xs text-ink-muted">Día no laborable / Consultorio cerrado</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Vacations & Clinical Exceptions */}
      <div className="bg-surface-card border border-border-light rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-serif text-ink-primary">
              Excepciones & Vacaciones Programadas
            </h2>
            <p className="text-xs text-ink-muted">
              Fechas específicas donde se suspende la asignación automática por congresos o recesos.
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-light hover:bg-canvas text-ink-secondary text-xs font-medium transition-colors">
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            Nueva Excepción
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-4 rounded-xl border border-border-light bg-canvas flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[18px]">school</span>
              </span>
              <div>
                <span className="font-bold text-ink-primary block">
                  Congreso Colombiano de Psicología Clínica 2025
                </span>
                <span className="text-ink-muted text-[11px] block mt-0.5">
                  14 Nov 2025 - 16 Nov 2025 (3 días completos)
                </span>
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Agenda Bloqueada
                </span>
              </div>
            </div>
            <button className="text-ink-muted hover:text-red-600 transition-colors p-1">
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-border-light bg-canvas flex items-start justify-between">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <span className="material-symbols-outlined text-[18px]">beach_access</span>
              </span>
              <div>
                <span className="font-bold text-ink-primary block">Receso Festivo de Fin de Año</span>
                <span className="text-ink-muted text-[11px] block mt-0.5">
                  24 Dic 2025 - 02 Ene 2026 (10 días)
                </span>
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  Bloqueo Preventivo
                </span>
              </div>
            </div>
            <button className="text-ink-muted hover:text-red-600 transition-colors p-1">
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
