import { NextRequest, NextResponse } from 'next/server'
import { getPiso } from '@/lib/pisos'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const piso = getPiso(params.slug)

  if (!piso) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  // No exponemos el email del agente al cliente por seguridad
  const { agente, ...pisoPúblico } = piso
  return NextResponse.json({
    ...pisoPúblico,
    agente: {
      nombre: agente.nombre,
      telefono: agente.telefono,
      agencia: agente.agencia,
    },
  })
}
