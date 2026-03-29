'use client'

import { useState } from 'react'
import { Lead } from '@/types'

interface LeadFormProps {
  slug: string
  chatHistorial?: string
  stagingElegido?: string
}

export default function LeadForm({ slug, chatHistorial, stagingElegido }: LeadFormProps) {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })
  const [rgpd, setRgpd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rgpd) { setError('Debes aceptar la política de privacidad'); return }
    if (!form.nombre || !form.email) { setError('Nombre y email son obligatorios'); return }

    setLoading(true)
    setError('')

    const lead: Lead = {
      ...form,
      piso_slug: slug,
      chat_historial: chatHistorial,
      staging_elegido: stagingElegido,
      rgpd_aceptado: true,
    }

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setEnviado(true)
    } catch (err: any) {
      setError(err.message || 'Error al enviar. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (enviado) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-3xl mb-3">✓</div>
        <h3 className="font-semibold text-green-800 mb-1">¡Solicitud enviada!</h3>
        <p className="text-green-700 text-sm">El agente se pondrá en contacto contigo en breve. Revisa tu email.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Nombre completo *</label>
        <input
          type="text"
          value={form.nombre}
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
          required
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          required
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono (opcional)</label>
        <input
          type="tel"
          value={form.telefono}
          onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+34 600 000 000"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">¿Cuándo puedes visitar?</label>
        <textarea
          value={form.mensaje}
          onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Mañanas, tardes, fines de semana..."
        />
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={rgpd}
          onChange={e => setRgpd(e.target.checked)}
          className="mt-0.5 flex-shrink-0"
        />
        <span className="text-xs text-gray-500 leading-relaxed">
          Acepto el tratamiento de mis datos personales para gestionar mi solicitud de visita,
          conforme a la política de privacidad. Los datos se conservarán máximo 12 meses.
        </span>
      </label>

      {error && (
        <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !rgpd}
        className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Enviando...' : 'Solicitar visita'}
      </button>
    </form>
  )
}
