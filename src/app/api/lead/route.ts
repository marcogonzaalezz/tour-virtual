import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { enviarLeadAlAgente, enviarConfirmacionAlComprador } from '@/lib/resend'
import { getPiso } from '@/lib/pisos'
import { Lead } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const lead: Lead = await req.json()

    if (!lead.nombre || !lead.email || !lead.piso_slug) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    if (!lead.rgpd_aceptado) {
      return NextResponse.json({ error: 'Debes aceptar la política de privacidad' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(lead.email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const piso = getPiso(lead.piso_slug)
    if (!piso) {
      return NextResponse.json({ error: 'Inmueble no encontrado' }, { status: 404 })
    }

    // Guardar lead en Supabase
    const { error: dbError } = await supabaseAdmin.from('leads').insert({
      nombre: lead.nombre,
      email: lead.email,
      telefono: lead.telefono || null,
      mensaje: lead.mensaje || null,
      piso_slug: lead.piso_slug,
      chat_historial: lead.chat_historial || null,
      staging_elegido: lead.staging_elegido || null,
      rgpd_aceptado: true,
      created_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error('Error Supabase:', dbError)
      // No bloqueamos: seguimos aunque falle la BD
    }

    // Enviar emails en paralelo
    await Promise.allSettled([
      enviarLeadAlAgente(lead, piso),
      enviarConfirmacionAlComprador(lead, piso),
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error en /api/lead:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
