import React, { useState } from 'react';
import { NavigationPath } from './types/clinical';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { AgendaView } from './components/views/AgendaView';
import { PacientesView } from './components/views/PacientesView';
import { CitaDetalleView } from './components/views/CitaDetalleView';
import { Paciente360View } from './components/views/Paciente360View';
import { NotasClinicasView } from './components/views/NotasClinicasView';
import { CopilotIAView } from './components/views/CopilotIAView';
import { DisponibilidadView } from './components/views/DisponibilidadView';
import { AlertasRiesgoView } from './components/views/AlertasRiesgoView';
import { InformesView } from './components/views/InformesView';
import { PerfilAjustesView } from './components/views/PerfilAjustesView';

// Modals
import { QuickNoteModal } from './components/modals/QuickNoteModal';
import { ManualAppointmentModal } from './components/modals/ManualAppointmentModal';
import { SignNoteModal } from './components/modals/SignNoteModal';
import { TeleconsultaModal } from './components/modals/TeleconsultaModal';

export default function App() {
  const [currentPath, setCurrentPath] = useState<NavigationPath>('inicio');

  // Sidebar responsive / collapse state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals state
  const [isQuickNoteOpen, setIsQuickNoteOpen] = useState(false);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [bookingInitialTime, setBookingInitialTime] = useState<string | undefined>(undefined);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isTeleconsultaOpen, setIsTeleconsultaOpen] = useState(false);

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenBookingModal = (initialTime?: string) => {
    setBookingInitialTime(initialTime);
    setIsManualBookingOpen(true);
  };

  const handleSaveQuickNote = (patient: string, note: string) => {
    showToast(`Nota rápida guardada y encriptada para ${patient}`);
  };

  const handleConfirmManualBooking = (data: { type: string; title: string; date: string; time: string; notes: string }) => {
    showToast(`Cita / Bloqueo reservado para el ${data.date} a las ${data.time}`);
  };

  const handleConfirmSignature = () => {
    showToast('Nota SOAP firmada con llave ED25519 y sellada en la Historia Clínica.');
    setCurrentPath('paciente-detalle');
  };

  // 11 screen presets for rapid reviewer navigation
  const screensList: { id: NavigationPath; label: string; icon: string }[] = [
    { id: 'inicio', label: '1. Inicio / Dashboard', icon: 'dashboard' },
    { id: 'agenda', label: '2. Agenda Terapéutica', icon: 'calendar_month' },
    { id: 'pacientes', label: '3. Directorio Pacientes', icon: 'group' },
    { id: 'cita-detalle', label: '4. Detalle CITA-9402', icon: 'videocam' },
    { id: 'paciente-detalle', label: '5. Expediente 360 Camila', icon: 'person' },
    { id: 'notas-clinicas', label: '6. Notas SOAP', icon: 'edit_note' },
    { id: 'analisis-copilot-ia', label: '7. Copilot IA Radar', icon: 'psychology' },
    { id: 'disponibilidad', label: '8. Disponibilidad', icon: 'schedule' },
    { id: 'alertas-de-riesgo', label: '9. Alertas de Riesgo', icon: 'notifications_active' },
    { id: 'informes', label: '10. Informes Clínicos', icon: 'description' },
    { id: 'perfil-y-seguridad', label: '11. Perfil & Seguridad', icon: 'verified_user' },
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-sans flex flex-col antialiased">
      {/* Visual Navigation Toolbar / Screen Selector */}
      <div className="bg-primary text-white text-xs px-4 py-2 border-b border-primary-container shadow-xs z-50 flex items-center justify-between overflow-x-auto gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-[18px] text-emerald-300">view_carousel</span>
          <span className="font-bold uppercase tracking-wider text-[11px] text-emerald-100">
            Navegación Rápida de Pantallas (11 Vistas):
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {screensList.map((screen) => (
            <button
              key={screen.id}
              onClick={() => setCurrentPath(screen.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                currentPath === screen.id
                  ? 'bg-white text-primary font-bold shadow-xs'
                  : 'bg-white/10 text-white/90 hover:bg-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">{screen.icon}</span>
              <span>{screen.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar (Collapsible & Responsive) */}
        <Sidebar
          currentPath={currentPath}
          onNavigate={(path) => setCurrentPath(path)}
          unreadAlertsCount={1}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header with Hamburger Menu */}
          <Header
            currentPath={currentPath}
            onNavigate={(path) => setCurrentPath(path)}
            unreadCount={1}
            onToggleSidebar={() => {
              if (window.innerWidth < 1024) {
                setIsSidebarOpen((prev) => !prev);
              } else {
                setIsSidebarCollapsed((prev) => !prev);
              }
            }}
            isSidebarCollapsed={isSidebarCollapsed}
          />

          {/* View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
            {currentPath === 'inicio' && (
              <DashboardView
                onNavigate={(path) => setCurrentPath(path)}
                onOpenQuickNote={() => setIsQuickNoteOpen(true)}
                onStartTeleconsulta={() => setIsTeleconsultaOpen(true)}
              />
            )}

            {currentPath === 'agenda' && (
              <AgendaView
                onNavigate={(path) => setCurrentPath(path)}
                onOpenBookingModal={handleOpenBookingModal}
              />
            )}

            {currentPath === 'pacientes' && (
              <PacientesView
                onNavigate={(path) => setCurrentPath(path)}
                onSelectPatient={() => setCurrentPath('paciente-detalle')}
              />
            )}

            {currentPath === 'cita-detalle' && (
              <CitaDetalleView
                onNavigate={(path) => setCurrentPath(path)}
                onStartTeleconsulta={() => setIsTeleconsultaOpen(true)}
              />
            )}

            {currentPath === 'paciente-detalle' && (
              <Paciente360View
                onNavigate={(path) => setCurrentPath(path)}
                onStartTeleconsulta={() => setIsTeleconsultaOpen(true)}
              />
            )}

            {currentPath === 'notas-clinicas' && (
              <NotasClinicasView
                onNavigate={(path) => setCurrentPath(path)}
                onOpenSignModal={() => setIsSignModalOpen(true)}
              />
            )}

            {currentPath === 'analisis-copilot-ia' && (
              <CopilotIAView onNavigate={(path) => setCurrentPath(path)} />
            )}

            {currentPath === 'disponibilidad' && <DisponibilidadView />}

            {currentPath === 'alertas-de-riesgo' && (
              <AlertasRiesgoView
                onNavigate={(path) => setCurrentPath(path)}
                onOpenQuickNote={() => setIsQuickNoteOpen(true)}
              />
            )}

            {currentPath === 'informes' && (
              <InformesView onNavigate={(path) => setCurrentPath(path)} />
            )}

            {currentPath === 'perfil-y-seguridad' && <PerfilAjustesView />}
          </main>
        </div>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-slideUp text-xs font-medium max-w-md">
          <span className="material-symbols-outlined text-[20px] text-emerald-400">check_circle</span>
          <span className="flex-1">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Interactive Modals */}
      <QuickNoteModal
        isOpen={isQuickNoteOpen}
        onClose={() => setIsQuickNoteOpen(false)}
        onSave={handleSaveQuickNote}
      />

      <ManualAppointmentModal
        isOpen={isManualBookingOpen}
        onClose={() => setIsManualBookingOpen(false)}
        onConfirm={handleConfirmManualBooking}
        initialTime={bookingInitialTime}
      />

      <SignNoteModal
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onConfirm={handleConfirmSignature}
        patientName="Camila Torres"
      />

      <TeleconsultaModal
        isOpen={isTeleconsultaOpen}
        onClose={() => setIsTeleconsultaOpen(false)}
        patientName="Camila Torres"
        patientAvatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
        onOpenSoapNotes={() => {
          setIsTeleconsultaOpen(false);
          setCurrentPath('notas-clinicas');
        }}
      />
    </div>
  );
}
