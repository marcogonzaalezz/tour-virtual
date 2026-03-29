'use client'

import { useState } from 'react'
import { Piso } from '@/types'

export default function TourEmbed({ piso }: { piso: Piso }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-3 rounded-xl">
        <p className="text-gray-500 text-sm">El tour 360° no está disponible en este momento.</p>
        <p className="text-gray-400 text-xs">Mostrando galería de fotos</p>
      </div>
    )
  }

  return (
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
      <iframe
        src={piso.kuula_embed}
        className="absolute inset-0 w-full h-full rounded-xl"
        frameBorder="0"
        allow="xr-spatial-tracking; gyroscope; accelerometer"
        allowFullScreen
        onError={() => setError(true)}
        title={`Tour virtual 360° — ${piso.nombre}`}
      />
    </div>
  )
}
