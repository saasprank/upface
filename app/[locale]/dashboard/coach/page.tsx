'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Scores {
  global: number
  potentiel: number
  symetrie: number
  peau: number
  grooming: number
  aura: number
}

interface Routine {
  headline: string
}

const SUGGESTIONS = [
  'Comment améliorer ma jawline rapidement ?',
  'Quel skincare pour mon type de peau ?',
  'Comment progresser plus vite vers 88/100 ?',
  'Explique-moi mon score Aura',
  'Routine matinale optimale pour moi',
]

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Bonjour ! Je suis ton coach Upface. Je connais ton score et ta routine personnalisée. Pose-moi n'importe quelle question sur ton amélioration.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [scores, setScores] = useState<Scores | null>(null)
  const [routine, setRoutine] = useState<Routine | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem('upface_scores')
      if (s) setScores(JSON.parse(s) as Scores)
      const r = localStorage.getItem('upface_routine')
      if (r) setRoutine(JSON.parse(r) as Routine)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const systemPrompt = `Tu es le coach personnel Upface de cet utilisateur.
Voici son profil :
- Score global : ${scores?.global ?? '?'}/100
- Potentiel : ${scores?.potentiel ?? '?'}/100
- Symétrie : ${scores?.symetrie ?? '?'}/100
- Peau : ${scores?.peau ?? '?'}/100
- Grooming : ${scores?.grooming ?? '?'}/100
- Aura : ${scores?.aura ?? '?'}/100
- Routine actuelle : ${routine?.headline ?? 'non définie'}

Réponds de manière concise, bienveillante et actionnable en français. Maximum 3 paragraphes courts. Utilise des emojis avec modération.`

      const allMessages = [...messages, userMsg]

      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt,
        }),
      })
      const data = await res.json() as { reply?: string; error?: string }
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply ?? 'Désolé, une erreur est survenue. Réessaie.',
      }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Désolé, une erreur est survenue. Réessaie.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col pb-20" style={{ background: '#080C14', height: '100dvh' }}>

      {/* Header */}
      <div
        className="px-4 pt-6 pb-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(59,130,246,0.08)' }}
      >
        <p className="text-xs font-medium mb-0.5" style={{ color: '#06B6D4' }}>UPFACE AI</p>
        <h1 className="text-xl font-bold text-white">Ton Coach Personnel</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
              }`}
              style={{
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #3B82F6, #06B6D4)'
                  : '#0D1321',
                border: msg.role === 'assistant' ? '1px solid rgba(59,130,246,0.15)' : 'none',
                color: 'white',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl rounded-bl-sm px-4 py-3"
              style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions (seulement si 1 seul message) */}
      {messages.length === 1 && (
        <div className="px-4 pb-3 flex-shrink-0">
          <p className="text-xs mb-2" style={{ color: '#3D4F6E' }}>Questions fréquentes</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => void sendMessage(s)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
                style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className="px-4 pb-4 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}
      >
        <div className="flex gap-2 pt-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') void sendMessage(input) }}
            placeholder="Pose ta question..."
            className="flex-1 px-4 py-3 rounded-2xl text-sm text-white outline-none"
            style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.2)', fontSize: '16px' }}
          />
          <button
            onClick={() => void sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
