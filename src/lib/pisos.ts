import { Piso } from '@/types'
import fs from 'fs'
import path from 'path'

const PISOS_DIR = path.join(process.cwd(), 'data', 'pisos')

export function getPiso(slug: string): Piso | null {
  try {
    const filePath = path.join(PISOS_DIR, `${slug}.json`)
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as Piso
  } catch {
    return null
  }
}

export function getAllSlugs(): string[] {
  try {
    return fs
      .readdirSync(PISOS_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''))
  } catch {
    return []
  }
}

export function buildSystemPrompt(piso: Piso): string {
  return `Eres el asistente virtual del inmueble "${piso.nombre}", ubicado en ${piso.direccion}.
Tu único trabajo es responder preguntas sobre este piso de forma clara, honesta y concisa.
Detecta el idioma del usuario y responde siempre en ese mismo idioma.

DATOS COMPLETOS DEL INMUEBLE:
${JSON.stringify(piso, null, 2)}

REGLAS:
- Responde solo sobre este inmueble. Si preguntan por otros pisos, di que solo puedes informar sobre este.
- Si no sabes algo, di "Consultaré con el agente ${piso.agente.nombre} y te responderá a la mayor brevedad".
- Cuando el usuario muestre interés en visitar o comprar, pídele amablemente nombre, email y horario preferido.
- Nunca inventes datos. Usa únicamente los datos del JSON anterior.
- Respuestas cortas y directas. Máximo 3 frases por respuesta salvo que pidan detalles.
- No uses markdown en tus respuestas, solo texto plano.`
}
