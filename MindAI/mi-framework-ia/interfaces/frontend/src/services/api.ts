import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../store/auth'
import type {
  Analysis,
  AnalysisResult,
  AnalysisSummary,
  Report,
  Session,
  TokenResponse,
  User,
} from '../types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export function errorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string; detail?: string } | undefined
    return data?.message ?? data?.detail ?? fallback
  }
  return fallback
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>('/auth/login', { email, password })
  return data
}

export async function register(email: string, password: string, fullName: string): Promise<User> {
  const { data } = await api.post<User>('/auth/register', {
    email,
    password,
    full_name: fullName,
  })
  return data
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me')
  return data
}

export async function fetchSessions(): Promise<Session[]> {
  const { data } = await api.get<Session[]>('/sessions')
  return data
}

export async function createSession(title = 'Nueva sesión'): Promise<Session> {
  const { data } = await api.post<Session>('/sessions', { title })
  return data
}

export async function fetchSessionAnalyses(sessionId: string): Promise<AnalysisSummary[]> {
  const { data } = await api.get<AnalysisSummary[]>(`/sessions/${sessionId}/analyses`)
  return data
}

export async function analyzeNote(note: string, sessionId?: string): Promise<AnalysisResult> {
  const { data } = await api.post<AnalysisResult>('/analysis/analyze', {
    note,
    session_id: sessionId,
  })
  return data
}

export async function fetchAnalysis(analysisId: string): Promise<Analysis> {
  const { data } = await api.get<AnalysisResult>(`/analysis/${analysisId}`)
  return data.analysis
}

export async function generateReport(analysisId: string): Promise<Report> {
  const { data } = await api.post<Report>(`/analysis/${analysisId}/report`)
  return data
}

export async function downloadReport(reportUrl: string): Promise<Blob> {
  const { data } = await api.get<Blob>(reportUrl, { responseType: 'blob' })
  return data
}
