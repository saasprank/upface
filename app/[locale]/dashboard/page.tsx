'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface Scores {
  global: number
  potentiel: number
  percentile?: number
  symetrie: number
  proportions: number
  structure: number
  peau: number
  grooming: number
  aura: number
}

interface RoutineCategory {
  title: string
  tasks: string[]
}

interface GeneratedRoutine {
  headline: string
  categories: RoutineCategory[]
}

const SCORE_BARS = [
  { label: 'Symétrie', key: 'symetrie' as keyof Scores, color: '#3B82F6' },
  { label: 'Peau', key: 'peau' as keyof Scores, color: '#10B981' },
  { label: 'Grooming', key: 'grooming' as keyof Scores, color: '#06B6D4' },
  { label: 'Aura', key: 'aura' as keyof Scores, color: '#F59E0B' },
]

export default function DashboardHome() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'fr'
  const router = useRouter()

  const [scores, setScores] = useState<Scores | null>(null)
  const [routine, setRoutine] = useState<GeneratedRoutine | null>(null)
  const [streak] = useState(3)
  const [userEmail, setUserEmail] = useState('')
  const [history, setHistory] = useState<{ date: string; score: number }[]>([])

  // ── Load scores : localStorage → Supabase fallback ──────────────────────────
  useEffect(() => {
    const loadScores = async () => {
      // Attempt 1: localStorage
      try {
        const raw = localStorage.getItem('upface_scores')
        if (raw) {
          const parsed = JSON.parse(raw) as Scores
          if (parsed?.global) { setScores(parsed); return }
        }
      } catch { /* ignore */ }

      // Attempt 2: Supabase (last analysis)
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        if (data) {
          const s: Scores = {
            global:       data.score_global       ?? 74,
            potentiel:    (data.score_global ?? 74) + 14,
            percentile:   data.percentile          ?? 34,
            symetrie:     data.score_symetrie      ?? 0,
            proportions:  data.score_proportions   ?? 0,
            structure:    data.score_structure      ?? 0,
            peau:         data.score_peau           ?? 0,
            grooming:     data.score_grooming       ?? 0,
            aura:         data.score_aura           ?? 0,
          }
          setScores(s)
          try { localStorage.setItem('upface_scores', JSON.stringify(s)) } catch { /* ignore */ }
        }
      } catch { /* ignore */ }
    }
    void loadScores()
  }, [])

  // ── Load routine from localStorage ──────────────────────────────────────────
  useEffect(() => {
    try {
      const r = localStorage.getItem('upface_routine')
      if (r) setRoutine(JSON.parse(r) as GeneratedRoutine)
    } catch { /* ignore */ }
  }, [])

  // ── Load user email ──────────────────────────────────────────────────────────
  useEffect(() => {
    const getUser = async () => {
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) setUserEmail(user.email.split('@')[0])
      } catch { /* ignore */ }
    }
    void getUser()
  }, [])

  // ── Load analysis history for chart ─────────────────────────────────────────
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
          .from('analyses')
          .select('score_global, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(8)
        if (data) {
          setHistory(data.map(a => ({
            date: new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
            score: a.score_global as number,
          })))
        }
      } catch { /* ignore */ }
    }
    void loadHistory()
  }, [])

  const score = scores?.global ?? 74
  const potentiel = scores?.potentiel ?? 88
  const progression = potentiel - score

  return (
    <div className="px-4 pt-6 pb-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-medium mb-0.5" style={{ color: '#8B9DC3' }}>
            {userEmail ? `Bonjour ${userEmail}` : 'Bonjour'}
          </p>
          <h1 className="text-xl font-bold text-white">Ton dashboard</h1>
        </div>
        <button
          onClick={() => router.push(`/${locale}/analyze`)}
          className="px-3 py-2 rounded-xl text-xs font-medium"
          style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          + Nouvelle analyse
        </button>
      </div>

      {/* Score card principal */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs mb-1" style={{ color: '#8B9DC3' }}>TON SCORE ACTUEL</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black text-white">{score}</span>
              <span className="text-lg mb-1" style={{ color: '#8B9DC3' }}>/100</span>
            </div>
            <p className="text-xs font-medium mt-1" style={{ color: '#10B981' }}>
              ▲ Potentiel +{progression} pts
            </p>
          </div>
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#1A2236" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke="url(#scoreGrad)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - score / 100)}`}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Barre progression */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: '#8B9DC3' }}>Progression vers {potentiel}/100</span>
            <span style={{ color: '#3B82F6' }}>{Math.round((score / potentiel) * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: '#1A2236' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(score / potentiel) * 100}%`, background: 'linear-gradient(90deg, #3B82F6, #06B6D4)' }}
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Streak', value: `${streak}j`, icon: '🔥' },
          { label: 'Top', value: `${scores?.percentile ?? 34}%`, icon: '📊' },
          { label: 'Semaine', value: '+2pts', icon: '📈' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-3 text-center"
            style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <div className="text-lg mb-0.5">{s.icon}</div>
            <div className="text-base font-bold text-white">{s.value}</div>
            <div className="text-xs" style={{ color: '#3D4F6E' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Graphique progression */}
      {history.length > 1 && (
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <p className="text-xs font-medium mb-3" style={{ color: '#8B9DC3' }}>PROGRESSION</p>
          <div className="relative h-24">
            <svg className="w-full h-full" viewBox={`0 0 ${history.length * 50} 80`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M ${history.map((h, i) => `${i * 50 + 25},${80 - (h.score / 100) * 70}`).join(' L ')} L ${(history.length - 1) * 50 + 25},80 L 25,80 Z`}
                fill="url(#areaGrad)"
              />
              <polyline
                points={history.map((h, i) => `${i * 50 + 25},${80 - (h.score / 100) * 70}`).join(' ')}
                fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              />
              {history.map((h, i) => (
                <circle key={i}
                  cx={i * 50 + 25} cy={80 - (h.score / 100) * 70}
                  r="4" fill="#06B6D4" stroke="#080C14" strokeWidth="2"
                />
              ))}
            </svg>
          </div>
          <div className="flex justify-between mt-1">
            {history.map((h, i) => (
              <span key={i} className="text-xs" style={{ color: '#3D4F6E', fontSize: '10px' }}>{h.date}</span>
            ))}
          </div>
        </div>
      )}

      {/* Action du jour */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
      >
        <p className="text-xs font-medium mb-3" style={{ color: '#06B6D4' }}>ACTION DU JOUR</p>
        {routine?.categories?.[0] ? (
          <div>
            <p className="text-white font-semibold text-sm mb-1">{routine.categories[0].title}</p>
            <p className="text-xs mb-3" style={{ color: '#8B9DC3' }}>{routine.categories[0].tasks[0]}</p>
            <button
              className="w-full py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: 'linear-gradient(90deg, #3B82F6, #06B6D4)' }}
            >
              Marquer comme fait ✓
            </button>
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#8B9DC3' }}>
            Lance ton analyse pour voir ton action du jour
          </p>
        )}
      </div>

      {/* Scores rapides */}
      <div
        className="rounded-2xl p-4"
        style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
      >
        <p className="text-xs font-medium mb-3" style={{ color: '#8B9DC3' }}>TES SCORES</p>
        <div className="space-y-2.5">
          {SCORE_BARS.map((item) => (
            <div key={item.key}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: '#8B9DC3' }}>{item.label}</span>
                <span className="text-white font-medium">
                  {scores ? scores[item.key] : '--'}/100
                </span>
              </div>
              <div className="h-1 rounded-full" style={{ background: '#1A2236' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${scores ? scores[item.key] : 0}%`, background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
