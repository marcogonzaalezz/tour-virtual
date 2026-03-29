import { NextRequest, NextResponse } from 'next/server'

const REIMAGINE_API = 'https://api.reimaginehome.ai/v1/generate'

const HABITACION_MAP: Record<string, string> = {
  salon: 'living_room',
  cocina: 'kitchen',
  dormitorio: 'bedroom',
}

const ESTILO_MAP: Record<string, string> = {
  moderno: 'modern',
  escandinavo: 'scandinavian',
  mediterraneo: 'mediterranean',
  industrial: 'industrial',
}

export async function POST(req: NextRequest) {
  try {
    const { imagen_base64, habitacion, estilo } = await req.json()

    if (!imagen_base64 || !habitacion || !estilo) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    const roomType = HABITACION_MAP[habitacion]
    const designStyle = ESTILO_MAP[estilo]

    if (!roomType || !designStyle) {
      return NextResponse.json({ error: 'Habitación o estilo inválido' }, { status: 400 })
    }

    const response = await fetch(REIMAGINE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REIMAGINE_API_KEY}`,
      },
      body: JSON.stringify({
        image: imagen_base64,
        room_type: roomType,
        design_style: designStyle,
        num_images: 1,
      }),
    })

    if (!response.ok) {
      throw new Error(`REimagineHome error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({ imagen_url: data.images?.[0] || null })
  } catch (error) {
    console.error('Error en /api/staging:', error)
    return NextResponse.json({ error: 'Error generando imagen' }, { status: 500 })
  }
}
