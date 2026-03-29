'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from '@/types'

const MAX_TURNS = 20

export default function Chatbot({ slug, onLeadDetected }: {
  slug: string
  onLeadDetected?: (historial: string) => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy el asistente virtual de este inmueble. ¿Qué te gustaría saber sobre el piso?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading || turnCount >= MAX_TURNS) return

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, slug }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error del servidor')
      }

      const updated: ChatMessage[] = [...newMessages, { role: 'assistant', content: data.reply }]
      setMessages(updated)
      setTurnCount(t => t + 1)

      // Detectar si el usuario mostró interés (palabras clave)
      const interesKeywords = ['visitar', 'visita', 'ver el piso', 'interesa', 'contactar', 'llamar', 'nombre', 'email']
      const hasInterest = interesKeywords.some(kw => text.toLowerCase().includes(kw))
      if (hasInterest && onLeadDetected) {
        const historial = updated
          .map(m => `${m.role === 'user' ? 'Comprador' : 'Asistente'}: ${m.content}`)
          .join('\n')
        onLeadDetected(historial)
      }

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Lo siento, ha ocurrido un error. Por favor inténtalo de nuevo.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const agotado = turnCount >= MAX_TURNS

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <span className="text-sm font-medium text-gray-700">Asistente virtual</span>
        <span className="ml-auto text-xs text-gray-400">{MAX_TURNS - turnCount} preguntas restantes</span>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {agotado && (
          <div className="text-center text-xs text-gray-400 py-2">
            Sesión finalizada. Usa el formulario para contactar con el agente.
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading || agotado}
          placeholder={agotado ? 'Sesión finalizada' : 'Pregunta sobre el piso...'}
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-50"
        />
        <button
          onClick={sendMessage}
          disabled={loading || agotado || !input.trim()}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
