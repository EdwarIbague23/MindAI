import { useState } from 'react'
import { errorMessage } from '../services/api'

interface NoteDropzoneProps {
  onSubmit: (text: string) => Promise<void>
  loading?: boolean
  disabled?: boolean
}

export default function NoteDropzone({ onSubmit, loading = false, disabled = false }: NoteDropzoneProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const maxChars = 10000

  const handleSubmit = async () => {
    if (text.trim().length < 10) return
    setError('')
    try {
      await onSubmit(text)
      setText('')
    } catch (err) {
      setError(errorMessage(err, 'No fue posible analizar la nota'))
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Cargar nota clínica</h3>
      <p className="text-sm text-gray-600 mb-2">
        La información se anonimiza antes de enviarse al modelo. Use notas anonimizadas siempre que sea posible.
      </p>
      <textarea
        className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Pegue aquí la transcripción o nota clínica anonimizada..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={maxChars}
        disabled={disabled}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">
          {text.length}/{maxChars} caracteres
        </span>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => setText('')}
            disabled={loading}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || disabled || text.trim().length < 10}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Analizando...' : 'Analizar'}
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
