import { Piso } from '@/types'

const CERT_COLORS: Record<string, string> = {
  A: 'bg-green-600', B: 'bg-green-500', C: 'bg-lime-500',
  D: 'bg-yellow-400', E: 'bg-orange-400', F: 'bg-red-500', G: 'bg-red-700',
}

export default function FichaTecnica({ piso }: { piso: Piso }) {
  const datos = [
    { label: 'Superficie', valor: `${piso.superficie} m²` },
    { label: 'Habitaciones', valor: piso.habitaciones },
    { label: 'Baños', valor: piso.banos },
    { label: 'Planta', valor: piso.planta },
    { label: 'Orientación', valor: piso.orientacion },
    { label: 'Año reforma', valor: piso.ano_reforma },
    { label: 'Comunidad', valor: `${piso.comunidad_mes} €/mes` },
    { label: 'IBI', valor: `${piso.ibi_anual} €/año` },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {datos.map(({ label, valor }) => (
          <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800">{valor}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Certificado energético:</span>
        <span className={`text-white text-xs font-bold px-2 py-0.5 rounded ${CERT_COLORS[piso.certificado_energetico] || 'bg-gray-400'}`}>
          {piso.certificado_energetico}
        </span>
      </div>

      {piso.extras.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">Extras</p>
          <ul className="space-y-1">
            {piso.extras.map(extra => (
              <li key={extra} className="text-xs text-gray-600 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                {extra}
              </li>
            ))}
          </ul>
        </div>
      )}

      {piso.habitaciones_detalle.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">Distribución</p>
          <div className="space-y-1">
            {piso.habitaciones_detalle.map(h => (
              <div key={h.nombre} className="flex justify-between text-xs text-gray-600">
                <span>{h.nombre}</span>
                <span className="text-gray-400">{h.m2} m²</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
