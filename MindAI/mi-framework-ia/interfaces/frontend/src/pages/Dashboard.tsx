import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { toast } from 'sonner'
import NoteDropzone from '../components/NoteDropzone'
import {
  analyzeNote,
  createSession,
  downloadReport,
  errorMessage,
  fetchAnalysis,
  fetchSessionAnalyses,
  fetchSessions,
  generateReport,
} from '../services/api'
import { useAuthStore } from '../store/auth'
import type { AnalysisResult, Report } from '../types'

const TRIAGE_STYLES: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
}

const TRIAGE_LABELS: Record<string, string> = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function Dashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [current, setCurrent] = useState<AnalysisResult | null>(null)
  const [report, setReport] = useState<Report | null>(null)
  const [downloading, setDownloading] = useState(false)

  const sessionsQuery = useQuery({ queryKey: ['sessions'], queryFn: fetchSessions })

  useEffect(() => {
    if (!selectedSessionId && sessionsQuery.data && sessionsQuery.data.length > 0) {
      setSelectedSessionId(sessionsQuery.data[0].id)
    }
  }, [selectedSessionId, sessionsQuery.data])

  const analysesQuery = useQuery({
    queryKey: ['analyses', selectedSessionId],
    queryFn: () => fetchSessionAnalyses(selectedSessionId as string),
    enabled: Boolean(selectedSessionId),
  })

  const analyzeMutation = useMutation({
    mutationFn: (text: string) => analyzeNote(text, selectedSessionId ?? undefined),
    onSuccess: (data) => {
      setCurrent(data)
      setReport(null)
      if (data.session_id) {
        setSelectedSessionId(data.session_id)
      }
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['analyses'] })
      toast.success('Análisis completado')
    },
    onError: (error) => toast.error(errorMessage(error)),
  })

  const createSessionMutation = useMutation({
    mutationFn: () => createSession(),
    onSuccess: (session) => {
      setSelectedSessionId(session.id)
      setCurrent(null)
      setReport(null)
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Sesión creada')
    },
    onError: (error) => toast.error(errorMessage(error)),
  })

  const reportMutation = useMutation({
    mutationFn: (analysisId: string) => generateReport(analysisId),
    onSuccess: (data) => {
      setReport(data)
      toast.success('Reporte generado')
    },
    onError: (error) => toast.error(errorMessage(error)),
  })

  const handleDownloadReport = async () => {
    const reportUrl = report?.report_url ?? current?.report_url
    if (!reportUrl) return
    setDownloading(true)
    try {
      const blob = await downloadReport(reportUrl)
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `analisis_${current?.analysis.analysis_id ?? report?.analysis_id ?? 'reporte'}.md`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (error) {
      toast.error(errorMessage(error, 'No fue posible descargar el reporte'))
    } finally {
      setDownloading(false)
    }
  }

  const loadAnalysis = async (analysisId: string) => {
    try {
      const analysis = await fetchAnalysis(analysisId)
      setCurrent({ analysis, pii_findings: {} })
      setReport(null)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  const handleLogout = () => {
    logout()
    queryClient.clear()
    navigate('/login', { replace: true })
  }

  const emotionData = useMemo(
    () =>
      (current?.analysis.emotions ?? []).map((emotion) => ({
        emotion: capitalize(emotion.name),
        value: emotion.score,
      })),
    [current],
  )

  const piiCount = Object.values(current?.pii_findings ?? {}).reduce((total, value) => total + value, 0)
  const disclaimer = current?.analysis.disclaimer

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">MindFlow AI</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.full_name ?? user?.email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="bg-white shadow rounded-lg p-4 h-fit">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium text-gray-900">Sesiones</h2>
              <button
                type="button"
                onClick={() => createSessionMutation.mutate()}
                disabled={createSessionMutation.isPending}
                className="text-sm px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Nueva
              </button>
            </div>
            {sessionsQuery.isLoading && <p className="text-sm text-gray-500">Cargando...</p>}
            {sessionsQuery.data?.length === 0 && (
              <p className="text-sm text-gray-500">Aún no hay sesiones.</p>
            )}
            <ul className="space-y-1">
              {sessionsQuery.data?.map((session) => (
                <li key={session.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSessionId(session.id)
                      setCurrent(null)
                      setReport(null)
                    }}
                    className={`w-full text-left px-2 py-2 rounded text-sm ${
                      selectedSessionId === session.id
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Sesión {session.id.slice(0, 8)}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Análisis en sesión</h3>
              {analysesQuery.isLoading && <p className="text-sm text-gray-500">Cargando...</p>}
              <ul className="space-y-1">
                {analysesQuery.data?.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => loadAnalysis(item.id)}
                      className="w-full text-left px-2 py-1 rounded text-xs text-gray-600 hover:bg-gray-50"
                    >
                      {new Date(item.created_at).toLocaleString()}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="lg:col-span-3 space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Nueva nota clínica anonimizada</h2>
              <NoteDropzone
                onSubmit={async (text) => {
                  await analyzeMutation.mutateAsync(text)
                }}
                loading={analyzeMutation.isPending}
              />
              {piiCount > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  Datos anonimizados detectados: {piiCount} entidades redactadas (sin mostrar valores).
                </p>
              )}
            </div>

            {current && (
              <div className="space-y-6">
                {disclaimer && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm px-4 py-3 rounded">
                    {disclaimer}
                  </div>
                )}
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Resumen del análisis</h2>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        TRIAGE_STYLES[current.analysis.triage_level] ?? 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      Triage: {TRIAGE_LABELS[current.analysis.triage_level] ?? current.analysis.triage_level}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{current.analysis.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Mapa emocional</h3>
                    {emotionData.length === 0 ? (
                      <p className="text-sm text-gray-500">Sin emociones con evidencia suficiente.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={emotionData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="emotion" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name="Intensidad" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Distorsiones cognitivas</h3>
                    {current.analysis.distortions.length === 0 ? (
                      <p className="text-sm text-gray-500">No se identificaron distorsiones con evidencia textual suficiente.</p>
                    ) : (
                      <ul className="space-y-3">
                        {current.analysis.distortions.map((distortion, index) => (
                          <li key={index} className="border border-gray-200 rounded-lg p-3">
                            <p className="font-medium text-gray-900">{distortion.type}</p>
                            <p className="text-sm text-gray-600 mt-1">{distortion.explanation}</p>
                            {distortion.evidence && (
                              <p className="text-xs text-gray-500 mt-2 italic">“{distortion.evidence}”</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preguntas guía</h3>
                  {current.analysis.guiding_questions.length === 0 ? (
                    <p className="text-sm text-gray-500">Sin preguntas sugeridas.</p>
                  ) : (
                    <ul className="space-y-2">
                      {current.analysis.guiding_questions.map((question, index) => (
                        <li key={index} className="text-gray-700">
                          <p className="font-medium">{index + 1}. {question.question}</p>
                          {question.rationale && <p className="text-sm text-gray-500 ml-4">{question.rationale}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Reporte de apoyo</h3>
                    <p className="text-sm text-gray-500">Generar reporte en Markdown sin PII.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => current.analysis.analysis_id && reportMutation.mutate(current.analysis.analysis_id)}
                    disabled={reportMutation.isPending || !current.analysis.analysis_id}
                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {reportMutation.isPending ? 'Generando...' : 'Generar reporte'}
                  </button>
                  {(report?.report_url ?? current?.report_url) && (
                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      disabled={downloading}
                      className="text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                    >
                      {downloading ? 'Descargando...' : 'Descargar reporte'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
