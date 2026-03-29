import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getPiso, buildSystemPrompt } from '@/lib/pisos'
import { ChatMessage } from '@/types'

const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null as any

const MAX_TURNS = 20

export async function POST(req: NextRequest) {
  try {
    const { messages, slug }: { messages: ChatMessage[]; slug: string } = await req.json()

    if (!slug) {
      return NextResponse.json({ error: 'slug requerido' }, { status: 400 })
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'messages requerido' }, { status: 400 })
    }

    if (messages.length > MAX_TURNS * 2) {
      return NextResponse.json(
        { error: 'Sesión finalizada. Contacta directamente con el agente.' },
        { status: 429 }
      )
    }

    const piso = getPiso(slug)
    if (!piso) {
      return NextResponse.json({ error: 'Inmueble no encontrado' }, { status: 404 })
    }

    const systemPrompt = buildSystemPrompt(piso)

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error en /api/chat:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
