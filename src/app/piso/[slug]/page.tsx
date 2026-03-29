'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import TourEmbed from '@/components/TourEmbed'
import Chatbot from '@/components/Chatbot'
import LeadForm from '@/components/LeadForm'
import FichaTecnica from '@/components/FichaTecnica'
import StagingSelector from '@/components/StagingSelector'
import { Piso } from '@/types'

type Tab = 'tour' | 'staging' | 'contacto'

export default function PisoPage() {
  const params = useParams()
  const slug = params.slug as string

  const [piso, setPiso] = useState<Piso | null>(null)
  const [tab, setTab] = useState<Tab>('tour')
  const [chatHistorial, setChatHistorial] = useState<string>()
  const [stagingElegido, setStagingElegido] = useState<string>()
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/piso/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setPiso)
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Inmueble no encontrado</h1>
          <p className="text-gray-500">El enlace puede haber caducado o ser incorrecto.</p>
        </div>
      </div>
    )
  }

  if (!piso) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'tour', label: 'Tour 360°' },
    { id: 'staging', label: 'Decoración IA' },
    { id: 'contacto', label: 'Solicitar visita' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">{piso.nombre}</h1>
            <p className="text-xs text-gray-500">{piso.direccion}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">{piso.precio.toLocaleString('es-ES')} €</p>
            <p className="text-xs text-gray-400">{piso.superficie} m² · {piso.habitaciones} hab · {piso.banos} baños</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Columna izquierda: Tour + tabs */}
          <div className="lg:col-span-2 space-y-4">

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    tab === t.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Contenido del tab */}
            {tab === 'tour' && (
              <div className="space-y-4">
                <TourEmbed piso={piso} />
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h2 className="text-sm font-semibold text-gray-800 mb-2">Descripción</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{piso.descripcion}</p>
                </div>
              </div>
            )}

            {tab === 'staging' && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h2 className="text-sm font-semibold text-gray-800 mb-1">Decoración con IA</h2>
                <p className="text-xs text-gray-400 mb-4">Visualiza el piso con diferentes estilos de decoración.</p>
                <StagingSelector onEstiloElegido={setStagingElegido} />
              </div>
            )}

            {tab === 'contacto' && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h2 className="text-sm font-semibold text-gray-800 mb-1">Solicitar visita presencial</h2>
                <p className="text-xs text-gray-400 mb-4">
                  {piso.agente.nombre} de {piso.agente.agencia} se pondrá en contacto contigo.
                </p>
                <LeadForm
                  slug={slug}
                  chatHistorial={chatHistorial}
                  stagingElegido={stagingElegido}
                />
              </div>
            )}
          </div>

          {/* Columna derecha: Chatbot + Ficha */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: '420px' }}>
              <Chatbot
                slug={slug}
                onLeadDetected={historial => {
                  setChatHistorial(historial)
                  setTab('contacto')
                }}
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Ficha técnica</h2>
              <FichaTecnica piso={piso} />
            </div>

            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <p className="text-xs font-medium text-blue-800 mb-1">{piso.agente.nombre}</p>
              <p className="text-xs text-blue-600">{piso.agente.agencia}</p>
              <a href={`tel:${piso.agente.telefono}`} className="block mt-2 text-sm font-medium text-blue-700 hover:text-blue-900">
                {piso.agente.telefono}
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
