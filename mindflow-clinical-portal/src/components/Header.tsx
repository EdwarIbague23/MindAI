import React, { useState } from 'react';
import { NavigationPath } from '../types/clinical';

interface HeaderProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  unreadCount?: number;
  onToggleSidebar: () => void;
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  unreadCount = 2,
  onToggleSidebar,
  isSidebarCollapsed = false,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [doctorStatus, setDoctorStatus] = useState<'disponible' | 'en_consulta' | 'receso'>('disponible');

  const getPathTitle = (path: NavigationPath) => {
    switch (path) {
      case 'inicio': return 'Resumen Asistencial';
      case 'agenda': return 'Agenda Terapéutica';
      case 'pacientes': return 'Directorio de Pacientes';
      case 'cita-detalle': return 'Sala Virtual CITA-9402';
      case 'paciente-detalle': return 'Expediente Clínico 360';
      case 'notas-clinicas': return 'Nota de Evolución SOAP';
      case 'analisis-copilot-ia': return 'Análisis Copilot IA';
      case 'disponibilidad': return 'Horarios y Disponibilidad';
      case 'alertas-de-riesgo': return 'Monitor de Riesgo & Triage';
      case 'informes': return 'Historial de Informes & Dictámenes';
      case 'perfil-y-credenciales':
      case 'perfil-y-seguridad':
        return 'Perfil Profesional & Credenciales';
      default: return 'Portal Terapeuta';
    }
  };

  return (
    <header className="sticky top-0 w-full h-16 bg-surface-card/95 backdrop-blur-md shadow-xs z-30 px-4 sm:px-6 flex items-center justify-between border-b border-border-hairline shrink-0">
      {/* Left: Hamburger Button, Breadcrumbs & Doctor Status */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Toggle Button */}
        <button
          onClick={onToggleSidebar}
          aria-label="Abrir o colapsar menú lateral"
          className="p-2 rounded-xl text-ink-secondary hover:text-primary hover:bg-canvas border border-border-light transition-all flex items-center justify-center cursor-pointer shadow-2xs"
          title={isSidebarCollapsed ? 'Expandir menú lateral' : 'Colapsar / Abrir menú lateral'}
        >
          <span className="material-symbols-outlined text-[22px]">
            {isSidebarCollapsed ? 'menu_open' : 'menu'}
          </span>
        </button>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <span 
            onClick={() => onNavigate('inicio')}
            className="text-primary font-semibold cursor-pointer hover:underline hidden sm:inline"
          >
            Portal Clínico
          </span>
          <span className="material-symbols-outlined text-[15px] text-ink-muted hidden sm:inline">chevron_right</span>
          <span className="font-semibold text-ink-primary truncate max-w-[160px] sm:max-w-none">
            {getPathTitle(currentPath)}
          </span>
        </div>

        <div className="h-4 w-px bg-border-light hidden md:block" />

        {/* Doctor Status Badge */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs font-bold text-ink-primary font-serif">Dr. Mateo Arboleda</span>
          <button 
            onClick={() => {
              setDoctorStatus(prev => prev === 'disponible' ? 'en_consulta' : prev === 'en_consulta' ? 'receso' : 'disponible');
            }}
            title="Cambiar estado de atención"
            className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {doctorStatus === 'disponible' && 'En consulta / Disponible'}
              {doctorStatus === 'en_consulta' && 'En Sesión Activa'}
              {doctorStatus === 'receso' && 'En Receso Clínico'}
            </span>
          </button>
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notificaciones clínicas"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-secondary hover:bg-canvas hover:text-ink-primary border border-border-light transition-colors relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-surface-card rounded-2xl shadow-xl border border-border-light p-3.5 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-border-light">
                <span className="text-xs font-bold text-ink-primary font-serif">Notificaciones Clínicas</span>
                <button 
                  className="text-[11px] text-primary font-semibold hover:underline" 
                  onClick={() => setShowNotifications(false)}
                >
                  Cerrar
                </button>
              </div>
              <div className="space-y-2 mt-2 max-h-72 overflow-y-auto">
                <div 
                  onClick={() => { setShowNotifications(false); onNavigate('alertas-de-riesgo'); }}
                  className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100/70 border border-red-200 cursor-pointer transition-colors"
                >
                  <p className="text-[12px] font-bold text-red-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-red-600">crisis_alert</span>
                    Alerta GAD-7: Camila Torres
                  </p>
                  <p className="text-[11px] text-ink-secondary mt-0.5">Puntaje 15/21. Requiere validación de protocolo asistencial.</p>
                </div>
                <div 
                  onClick={() => { setShowNotifications(false); onNavigate('cita-detalle'); }}
                  className="p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 cursor-pointer transition-colors"
                >
                  <p className="text-[12px] font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">videocam</span>
                    Sala de espera virtual abierta
                  </p>
                  <p className="text-[11px] text-ink-secondary mt-0.5">Camila Torres en sala desde las 09:56 AM.</p>
                </div>
                <div 
                  onClick={() => { setShowNotifications(false); onNavigate('notas-clinicas'); }}
                  className="p-2.5 rounded-xl bg-canvas hover:bg-slate-100 border border-border-light cursor-pointer transition-colors"
                >
                  <p className="text-[12px] font-bold text-ink-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">history_edu</span>
                    Firma SOAP pendiente
                  </p>
                  <p className="text-[11px] text-ink-muted mt-0.5">Borrador sesión #08 listo para validación criptográfica.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border-light" />

        {/* Doctor Identity Profile Link */}
        <div 
          onClick={() => onNavigate('perfil-y-seguridad')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity select-none p-1 rounded-xl"
          title="Ver perfil y credenciales"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-ink-primary leading-tight">Dr. Mateo Arboleda</p>
            <p className="text-[10px] text-ink-muted leading-tight">Psicólogo Clínico M.Sc.</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80"
            alt="Dr. Mateo Arboleda"
            className="w-8 h-8 rounded-xl object-cover border border-primary/20 shadow-2xs"
          />
        </div>
      </div>
    </header>
  );
};
