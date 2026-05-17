'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'

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
  'Comment progresser plus vite ?',
  'Explique-moi mon score Aura',
  'Routine matinale optimale pour moi',
]

const FREE_MSG_LIMIT = 3

export default function CoachPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) ?? 'fr'

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
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem('upface_scores')
      if (s) setScores(JSON.parse(s) as Scores)
      const r = localStorage.getItem('upface_routine')
      if (r) setRoutine(JSON.parse(r) as Routine)
    } catch { /* ignore */ }

    // Check subscription
    const checkPlan = async () => {
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single()
        if (sub) setPlan('pro')
      } catch { /* ignore */ }
    }
    void checkPlan()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const userMessageCount = messages.filter(m => m.role === 'user').length

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    // Free plan: limit to 3 messages
    if (plan === 'free' && userMessageCount >= FREE_MSG_LIMIT) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '🔒 Tu as atteint la limite de 3 messages gratuits. Passe à Pro pour un accès illimité à ton coach IA.',
      }])
      return
    }

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

  const isLocked = plan === 'free' && userMessageCount >= FREE_MSG_LIMIT

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

      {/* Stats rapides */}
      <div
        className="grid grid-cols-3 gap-2 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(59,130,246,0.08)' }}
      >
        {[
          { label: 'Score', value: scores?.global ? `${scores.global}/100` : '--' },
          { label: 'Potentiel', value: scores?.potentiel ? `${scores.potentiel}/100` : '--' },
          { label: 'Objectif', value: '8 sem' },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl p-2 text-center"
            style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <p className="text-sm font-bold text-white">{s.value}</p>
            <p className="text-xs" style={{ color: '#3D4F6E' }}>{s.label}</p>
          </div>
        ))}
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
            <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Paywall banner pour free après 3 msgs */}
      {isLocked && (
        <div
          className="mx-4 mb-3 rounded-2xl p-4 flex-shrink-0 text-center"
          style={{ background: 'linear-gradient(135deg, #0D1321, #1A2236)', border: '1px solid rgba(59,130,246,0.25)' }}
        >
          <p className="text-white font-bold text-sm mb-1">🔒 Limite atteinte</p>
          <p className="text-xs mb-3" style={{ color: '#8B9DC3' }}>Passe à Pro pour un accès illimité à ton coach IA</p>
          <button
            onClick={() => router.push(`/${locale}/onboarding/routine-preview`)}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(90deg, #3B82F6, #06B6D4)' }}
          >
            Passer Pro →
          </button>
        </div>
      )}

      {/* Suggestions (premier message seulement) */}
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
      {!isLocked && (
        <div className="px-4 pb-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
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
          {plan === 'free' && (
            <p className="text-center text-xs mt-2" style={{ color: '#3D4F6E' }}>
              {FREE_MSG_LIMIT - userMessageCount} message{FREE_MSG_LIMIT - userMessageCount > 1 ? 's' : ''} gratuit{FREE_MSG_LIMIT - userMessageCount > 1 ? 's' : ''} restant{FREE_MSG_LIMIT - userMessageCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
