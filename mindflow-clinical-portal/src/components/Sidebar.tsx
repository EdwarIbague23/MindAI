import React from 'react';
import { NavigationPath } from '../types/clinical';

interface SidebarProps {
  currentPath: NavigationPath;
  onNavigate: (path: NavigationPath) => void;
  unreadAlertsCount?: number;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  unreadAlertsCount = 2,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems: {
    path: NavigationPath;
    label: string;
    icon: string;
    badge?: string;
    badgeColor?: string;
    alert?: boolean;
  }[] = [
    { path: 'inicio', label: 'Inicio', icon: 'space_dashboard' },
    { path: 'agenda', label: 'Agenda', icon: 'calendar_month' },
    { path: 'pacientes', label: 'Pacientes', icon: 'group' },
    { path: 'notas-clinicas', label: 'Notas Clínicas', icon: 'clinical_notes' },
    {
      path: 'analisis-copilot-ia',
      label: 'Copilot IA',
      icon: 'neurology',
      badge: 'PRO',
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    },
    { path: 'disponibilidad', label: 'Disponibilidad', icon: 'schedule' },
    { path: 'alertas-de-riesgo', label: 'Alertas de Riesgo', icon: 'crisis_alert', alert: true },
    { path: 'informes', label: 'Dictámenes e Informes', icon: 'description' },
    { path: 'perfil-y-credenciales', label: 'Credenciales & Perfil', icon: 'badge' },
  ];

  const handleItemClick = (path: NavigationPath) => {
    onNavigate(path);
    // On mobile, close sidebar after clicking
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Element */}
      <aside
        className={`
          bg-surface-card border-r border-border-hairline z-50 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0
          /* Mobile Drawer style */
          fixed lg:static inset-y-0 left-0 h-full lg:h-[calc(100vh-41px)]
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          /* Desktop width: collapsed vs expanded */
          ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'}
          w-[270px]
        `}
      >
        <div className="flex flex-col min-h-0 flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-border-light/60">
            <div
              onClick={() => handleItemClick('inicio')}
              className={`flex items-center gap-3 cursor-pointer select-none overflow-hidden ${
                isCollapsed ? 'lg:justify-center lg:w-full' : ''
              }`}
              title="MindFlow Clinical Portal"
            >
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0">
                <span className="material-symbols-outlined text-[22px]">psychology</span>
              </div>
              {(!isCollapsed || isOpen) && (
                <div className="flex flex-col min-w-0 transition-opacity duration-200">
                  <span className="font-serif text-[17px] font-bold text-primary leading-tight truncate">
                    MindFlow
                  </span>
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider truncate">
                    Clinical Portal
                  </span>
                </div>
              )}
            </div>

            {/* Close button for Mobile / Collapse button for Desktop */}
            <div className="flex items-center">
              {/* Mobile close */}
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-canvas transition-colors"
                title="Cerrar menú"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              {/* Desktop toggle collapse */}
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-canvas transition-colors"
                title={isCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isCollapsed ? 'menu_open' : 'dock_to_right'}
                </span>
              </button>
            </div>
          </div>

          {/* Verification Status Card (Hidden when collapsed on desktop) */}
          {(!isCollapsed || isOpen) && (
            <div className="px-3.5 py-2.5">
              <div className="bg-surface-subtle border border-border-light rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-ink-primary font-semibold">Colpsic Verificado</span>
                </div>
                <span className="text-[10px] text-ink-muted font-mono font-semibold">#CO-4921</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-2.5 mt-2">
            {navItems.map((item) => {
              const isActive =
                currentPath === item.path ||
                (currentPath === 'cita-detalle' && item.path === 'agenda') ||
                (currentPath === 'paciente-detalle' && item.path === 'pacientes') ||
                (currentPath === 'perfil-y-seguridad' && item.path === 'perfil-y-credenciales');

              return (
                <button
                  key={item.path}
                  onClick={() => handleItemClick(item.path)}
                  title={item.label}
                  className={`flex items-center rounded-xl text-left transition-all cursor-pointer relative group ${
                    isCollapsed ? 'lg:justify-center lg:px-2 py-3' : 'justify-between px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-primary text-white font-semibold shadow-xs'
                      : 'text-ink-secondary hover:bg-canvas hover:text-ink-primary'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`material-symbols-outlined text-[20px] shrink-0 ${
                        item.alert && !isActive ? 'text-red-500' : ''
                      }`}
                    >
                      {item.icon}
                    </span>
                    {(!isCollapsed || isOpen) && (
                      <span className="text-[13px] leading-tight truncate">{item.label}</span>
                    )}
                  </div>

                  {/* Badges / Alerts when expanded */}
                  {(!isCollapsed || isOpen) && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.alert && (
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">
                          {unreadAlertsCount}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Dot notification indicator when collapsed */}
                  {isCollapsed && item.alert && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
                  )}

                  {/* Tooltip on hover when collapsed */}
                  {isCollapsed && (
                    <div className="hidden lg:group-hover:flex absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-md z-50 whitespace-nowrap pointer-events-none items-center gap-1.5">
                      <span>{item.label}</span>
                      {item.alert && (
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {unreadAlertsCount}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Triage & Support Widget */}
        <div className="p-3 border-t border-border-light/60">
          {(!isCollapsed || isOpen) ? (
            <div
              onClick={() => handleItemClick('alertas-de-riesgo')}
              className="p-3 bg-amber-50 hover:bg-amber-100/80 rounded-xl flex items-start gap-2.5 cursor-pointer transition-colors border border-amber-200/80 shadow-xs"
            >
              <span className="material-symbols-outlined text-amber-700 text-[20px] mt-0.5 shrink-0">
                support_agent
              </span>
              <div className="min-w-0">
                <p className="text-[12px] text-amber-900 font-bold leading-tight">Soporte Triage 24/7</p>
                <p className="text-[10px] text-amber-700/80 leading-tight mt-0.5">Línea directa clínica activa</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleItemClick('alertas-de-riesgo')}
              className="w-full py-2.5 flex items-center justify-center text-amber-700 hover:bg-amber-50 rounded-xl transition-colors relative group"
              title="Soporte Triage 24/7"
            >
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
              <div className="hidden lg:group-hover:block absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-md z-50 whitespace-nowrap pointer-events-none">
                Soporte Triage 24/7
              </div>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
