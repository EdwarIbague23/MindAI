export type NavigationPath = 
  | 'inicio' 
  | 'agenda' 
  | 'pacientes' 
  | 'cita-detalle' 
  | 'paciente-detalle' 
  | 'notas-clinicas' 
  | 'analisis-copilot-ia' 
  | 'disponibilidad' 
  | 'alertas-de-riesgo' 
  | 'informes' 
  | 'perfil-y-credenciales'
  | 'perfil-y-seguridad';

export interface Patient {
  id: string;
  code: string;
  name: string;
  age: number;
  gender: string;
  birthDate: string;
  avatar: string;
  condition: string;
  diagnosis?: string;
  approach: string;
  nextSession: string;
  nextSessionTime?: string;
  nextSessionType?: 'virtual' | 'presencial';
  completedSessions: number;
  totalSessions: number;
  emotionalState: string;
  emotionalLevel: number; // 1 to 5
  riskAlert?: string;
  riskSeverity?: 'low' | 'moderate' | 'high';
  status: 'Activo' | 'En pausa' | 'Alta';
  gad7Score?: number;
  phq9Score?: number;
  adherenceRate: number;
  notesPending?: number;
  phone?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  sessionNumber: number;
  totalPlanned: number;
  condition: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  modality: 'Virtual E2E' | 'Consultorio 302' | 'Presencial' | 'Telemedicina';
  status: 'Confirmada' | 'En espera' | 'Completada' | 'Cancelada';
  minutesToStart?: number;
  notes?: string;
}

export interface RiskAlert {
  id: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  patientAvatar: string;
  severity: 'Alta' | 'Moderada' | 'Informativa' | 'high' | 'medium';
  title: string;
  timeAgo: string;
  timestamp?: string;
  description: string;
  gad7Score: number;
  maxGad7: number;
  status: 'Pendiente' | 'Atendida' | 'En proceso';
  resolved?: boolean;
  suggestedAction?: string;
  sensorDetails: string;
  trend: number[];
  medication?: string;
  hasSelfHarmHistory: boolean;
  supportNetwork: string;
}

export interface SoapNote {
  id: string;
  sessionNumber: number;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  approach: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  mentalStatus: {
    consciousness: string;
    orientation: string;
    affect: string;
    vitalRisk: string;
  };
  techniques: string[];
  wordCount: number;
  sha256Hash: string;
  isSigned: boolean;
  signedAt?: string;
}

export interface ClinicalReport {
  id: string;
  folio: string;
  patientId: string;
  patientName: string;
  patientInitials: string;
  patientAge: number;
  sessionTitle: string;
  date: string;
  time: string;
  riskLevel: 'Moderado' | 'Estable' | 'Estrés Agudo';
  copilotConfidence: number;
  isSigned: boolean;
  gad7: number;
  somatizationScore: number;
  adherenceRate: number;
  cie11Code: string;
  cie11Description: string;
}
