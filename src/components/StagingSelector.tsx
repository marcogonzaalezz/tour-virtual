'use client'

import { useState } from 'react'
import { EstiloStaging } from '@/types'

const ESTILOS: { id: EstiloStaging; label: string; emoji: string }[] = [
  { id: 'moderno', label: 'Moderno', emoji: '◻' },
  { id: 'escandinavo', label: 'Escandinavo', emoji: '◇' },
  { id: 'mediterraneo', label: 'Mediterráneo', emoji: '◎' },
  { id: 'industrial', label: 'Industrial', emoji: '▣' },
]

const HABITACIONES = [
  { id: 'salon', label: 'Salón' },
  { id: 'cocina', label: 'Cocina' },
  { id: 'dormitorio', label: 'Dormitorio' },
]

interface StagingSelectorProps {
  onEstiloElegido?: (estilo: string) => void
}

export default function StagingSelector({ onEstiloElegido }: StagingSelectorProps) {
  const [estiloSeleccionado, setEstiloSeleccionado] = useState<EstiloStaging | null>(null)
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState('salon')
  const [imagenGenerada, setImagenGenerada] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generaciones, setGeneraciones] = useState(0)

  const MAX_GENERACIONES = 2

  const generarStaging = async (estilo: EstiloStaging) => {
    if (generaciones >= MAX_GENERACIONES) {
      setError('Has usado tus 2 generaciones gratuitas. Contacta con el agente para ver más opciones.')
      return
    }

    setEstiloSeleccionado(estilo)
    setLoading(true)
    setError('')
    setImagenGenerada(null)

    try {
      // En producción, aquí se enviaría la imagen de la habitación en base64
      // Para el MVP usamos una imagen de ejemplo
      const res = await fetch('/api/staging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagen_base64: 'demo',
          habitacion: habitacionSeleccionada,
          estilo,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setImagenGenerada(data.imagen_url)
      setGeneraciones(g => g + 1)
      onEstiloElegido?.(estilo)
    } catch (err: any) {
      setError('Error generando la imagen. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-gray-600 mb-2">Habitación</p>
        <div className="flex gap-2">
          {HABITACIONES.map(h => (
            <button
              key={h.id}
              onClick={() => { setHabitacionSeleccionada(h.id); setImagenGenerada(null) }}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                habitacionSeleccionada === h.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-600 mb-2">
          Estilo de decoración
          <span className="ml-2 text-gray-400">({MAX_GENERACIONES - generaciones} generaciones disponibles)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ESTILOS.map(e => (
            <button
              key={e.id}
              onClick={() => generarStaging(e.id)}
              disabled={loading || generaciones >= MAX_GENERACIONES}
              className={`px-3 py-2.5 text-sm rounded-lg border flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                estiloSeleccionado === e.id
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
              }`}
            >
              <span>{e.emoji}</span>
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <div className="animate-pulse text-sm text-gray-500">Decorando con IA...</div>
          <div className="text-xs text-gray-400 mt-1">8-15 segundos</div>
        </div>
      )}

      {imagenGenerada && !loading && (
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <img src={imagenGenerada} alt={`Staging ${estiloSeleccionado}`} className="w-full h-auto" />
          <p className="text-xs text-gray-400 text-center py-2">
            Estilo {estiloSeleccionado} · {habitacionSeleccionada} — generado con IA
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">{error}</p>
      )}
    </div>
  )
}
