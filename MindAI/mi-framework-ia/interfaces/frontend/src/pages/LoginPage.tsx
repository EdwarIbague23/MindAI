import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { errorMessage, fetchMe, login, register } from '../services/api'
import { useAuthStore } from '../store/auth'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const setAuth = useAuthStore((state) => state.setAuth)

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'register') {
        await register(email, password, fullName)
      }
      const tokens = await login(email, password)
      useAuthStore.setState({ token: tokens.access_token })
      const user = await fetchMe()
      setAuth(tokens.access_token, user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(errorMessage(err, mode === 'register' ? 'No fue posible registrarse' : 'Credenciales inválidas'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">MindFlow AI</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Copiloto de triaje y análisis emocional para terapeutas
          </p>
        </div>

        <div className="flex rounded-md bg-gray-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-md py-2 ${mode === 'login' ? 'bg-white shadow font-medium' : 'text-gray-600'}`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-md py-2 ${mode === 'register' ? 'bg-white shadow font-medium' : 'text-gray-600'}`}
          >
            Crear cuenta
          </button>
        </div>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input
              required
              minLength={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nombre completo"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          )}
          <input
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Correo electrónico"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            required
            minLength={mode === 'register' ? 8 : 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Contraseña (mínimo 8 caracteres y un número)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : mode === 'register' ? 'Registrarme' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
