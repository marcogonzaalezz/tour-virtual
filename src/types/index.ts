export interface HabitacionDetalle {
  nombre: string
  m2: number
}

export interface Agente {
  nombre: string
  email: string
  telefono: string
  agencia: string
}

export interface Piso {
  slug: string
  nombre: string
  kuula_embed: string
  precio: number
  superficie: number
  habitaciones: number
  banos: number
  orientacion: string
  planta: string
  ano_reforma: number
  certificado_energetico: string
  comunidad_mes: number
  ibi_anual: number
  direccion: string
  descripcion: string
  extras: string[]
  habitaciones_detalle: HabitacionDetalle[]
  agente: Agente
}

export interface Lead {
  nombre: string
  email: string
  telefono?: string
  mensaje?: string
  piso_slug: string
  chat_historial?: string
  staging_elegido?: string
  rgpd_aceptado: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export type EstiloStaging = 'moderno' | 'escandinavo' | 'mediterraneo' | 'industrial'

export interface StagingResult {
  estilo: EstiloStaging
  habitacion: string
  imagen_url: string
}
