export interface User {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface Session {
  id: string
  title: string
  created_at: string
}

export interface Emotion {
  name: string
  score: number
  evidence?: string | null
}

export interface Distortion {
  type: string
  evidence: string
  explanation: string
}

export interface GuidingQuestion {
  question: string
  rationale?: string | null
}

export interface Analysis {
  analysis_id: string
  emotions: Emotion[]
  distortions: Distortion[]
  guiding_questions: GuidingQuestion[]
  triage_level: 'low' | 'medium' | 'high'
  summary: string
  risk_detected: boolean
  disclaimer: string
}

export interface AnalysisResult {
  analysis: Analysis
  session_id?: string | null
  report_path?: string | null
  report_url?: string | null
  report_format?: string | null
  pii_findings: Record<string, number>
}

export interface AnalysisSummary {
  id: string
  session_id: string
  triage_level: 'low' | 'medium' | 'high'
  risk_detected: boolean
  summary: string
  created_at: string
}

export interface Report {
  id: string
  analysis_id: string
  format: string
  file_path: string
  report_url: string
  created_at: string
}
