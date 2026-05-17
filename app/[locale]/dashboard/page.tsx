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

const TIPS = [
  { icon: '💧', tip: "Bois 2L d'eau aujourd'hui — l'hydratation améliore la texture de peau de 23%" },
  { icon: '😴', tip: '7-8h de sommeil cette nuit — le collagène se régénère principalement la nuit' },
  { icon: '☀️', tip: 'Applique ton SPF même par temps nuageux — 80% des UV passent les nuages' },
  { icon: '🧊', tip: "Glaçon sur le visage 30s après ton soin — réduit les pores et booste l'éclat" },
  { icon: '🥗', tip: 'Privilégie les oméga-3 aujourd\'hui — saumon, noix, huile de lin pour la peau' },
  { icon: '🏃', tip: '20 min de cardio booste la circulation et donne un éclat naturel au teint' },
]

export default function DashboardHome() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'fr'
  const router = useRouter()

  const [scores, setScores] = useState<Scores | null>(null)
  const [routine, setRoutine] = useState<GeneratedRoutine | null>(null)
  const [streak] = useState(3)
  const [userName, setUserName] = useState('')
  const [history, setHistory] = useState<{ date: string; score: number }[]>([])

  const dailyTip = TIPS[new Date().getDay() % TIPS.length]

  // ── Load scores : localStorage → Supabase fallback ──────────────────────────
  useEffect(() => {
    const loadScores = async () => {
      // Attempt 1: localStorage
      try {
        const raw = localStorage.getItem('upface_scores')
        if (raw) {
          const parsed = JSON.parse(raw) as Scores
          if (parsed?.global) setScores(parsed)
        }
      } catch { /* ignore */ }

      // Attempt 2: Supabase
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        if (user.email) setUserName(user.email.split('@')[0])

        // Last analysis for scores
        const { data: latest } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (latest) {
          const s: Scores = {
            global:       latest.score_global      ?? 74,
            potentiel:    (latest.score_global ?? 74) + 14,
            percentile:   latest.percentile         ?? 34,
            symetrie:     latest.score_symetrie     ?? 0,
            proportions:  latest.score_proportions  ?? 0,
            structure:    latest.score_structure     ?? 0,
            peau:         latest.score_peau          ?? 0,
            grooming:     latest.score_grooming      ?? 0,
            aura:         latest.score_aura          ?? 0,
          }
          setScores(prev => prev ?? s)
          try { localStorage.setItem('upface_scores', JSON.stringify(s)) } catch { /* ignore */ }
        }

        // History for chart
        const { data: histData } = await supabase
          .from('analyses')
          .select('score_global, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(6)

        if (histData && histData.length > 1) {
          setHistory(histData.map(a => ({
            date: new Date(a.created_at as string).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
            score: a.score_global as number,
          })))
        }
      } catch { /* ignore */ }
    }
    void loadScores()
  }, [])

  // ── Routine from localStorage ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const r = localStorage.getItem('upface_routine')
      if (r) setRoutine(JSON.parse(r) as GeneratedRoutine)
    } catch { /* ignore */ }
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
            {userName ? `Bonjour ${userName} 👋` : 'Bonjour 👋'}
          </p>
          <h1 className="text-xl font-bold text-white">Ton dashboard</h1>
        </div>
        <button
          onClick={() => router.push(`/${locale}/analyze`)}
          className="px-3 py-2 rounded-xl text-xs font-medium"
          style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          + Analyse
        </button>
      </div>

      {/* Score card */}
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
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: '#8B9DC3' }}>Progression vers {potentiel}/100</span>
            <span style={{ color: '#3B82F6' }}>{Math.round((score / potentiel) * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: '#1A2236' }}>
            <div
              className="h-full rounded-full"
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

      {/* Graphique de progression */}
      {history.length > 1 ? (
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-medium" style={{ color: '#8B9DC3' }}>PROGRESSION</p>
            <p className="text-xs font-bold" style={{ color: '#10B981' }}>
              {history[history.length - 1].score - history[0].score >= 0
                ? `+${history[history.length - 1].score - history[0].score} pts`
                : `${history[history.length - 1].score - history[0].score} pts`}
            </p>
          </div>
          <svg className="w-full" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="ag" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const w = 300, h = 80, pad = 20
              const minV = Math.min(...history.map(d => d.score)) - 5
              const maxV = Math.max(...history.map(d => d.score)) + 5
              const pts = history.map((d, i) => ({
                x: pad + (i / (history.length - 1)) * (w - pad * 2),
                y: h - pad - ((d.score - minV) / (maxV - minV)) * (h - pad * 2),
              }))
              const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
              const area = `${line} L ${pts[pts.length - 1].x},${h} L ${pts[0].x},${h} Z`
              return (
                <>
                  <path d={area} fill="url(#ag)" />
                  <path d={line} fill="none" stroke="url(#lg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#06B6D4" stroke="#080C14" strokeWidth="2" />)}
                </>
              )
            })()}
          </svg>
          <div className="flex justify-between mt-1">
            {history.map((h, i) => (
              <span key={i} style={{ color: '#3D4F6E', fontSize: '10px' }}>{h.date}</span>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl p-4 mb-4 text-center"
          style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <p className="text-sm font-medium text-white mb-1">📈 Suis ta progression</p>
          <p className="text-xs" style={{ color: '#8B9DC3' }}>Fais une 2e analyse pour voir ton graphique de progression</p>
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
              onClick={() => router.push(`/${locale}/dashboard/routine`)}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: 'linear-gradient(90deg, #3B82F6, #06B6D4)' }}
            >
              Voir ma routine →
            </button>
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#8B9DC3' }}>
            Lance ton analyse pour voir ton action du jour
          </p>
        )}
      </div>

      {/* Conseil du jour */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
      >
        <p className="text-xs font-medium mb-2" style={{ color: '#8B9DC3' }}>CONSEIL DU JOUR</p>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{dailyTip.icon}</span>
          <p className="text-sm text-white leading-relaxed">{dailyTip.tip}</p>
        </div>
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
