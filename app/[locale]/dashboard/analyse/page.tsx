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

interface Analysis {
  id: string
  score_global: number
  created_at: string
}

const CRITERIA = [
  { key: 'symetrie' as keyof Scores, label: 'Symétrie', icon: '⇅', color: '#3B82F6' },
  { key: 'proportions' as keyof Scores, label: 'Proportions', icon: '⚖', color: '#06B6D4' },
  { key: 'structure' as keyof Scores, label: 'Structure', icon: '◫', color: '#8B5CF6' },
  { key: 'peau' as keyof Scores, label: 'Peau', icon: '✦', color: '#F59E0B' },
  { key: 'grooming' as keyof Scores, label: 'Grooming', icon: '✂', color: '#10B981' },
  { key: 'aura' as keyof Scores, label: 'Aura', icon: '☀', color: '#EC4899' },
]

function getTier(s: number) {
  if (s >= 85) return { label: 'Elite', color: '#06B6D4' }
  if (s >= 70) return { label: 'Attractive', color: '#3B82F6' }
  if (s >= 55) return { label: 'Moyen', color: '#F59E0B' }
  return { label: 'Below Average', color: '#EF4444' }
}

export default function AnalysePage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) ?? 'fr'

  const [scores, setScores] = useState<Scores | null>(null)
  const [analyses, setAnalyses] = useState<Analysis[]>([])

  useEffect(() => {
    const load = async () => {
      // Attempt 1: localStorage
      let scoredFromLS = false
      try {
        const raw = localStorage.getItem('upface_scores')
        if (raw) {
          const parsed = JSON.parse(raw) as Scores
          if (parsed?.global) { setScores(parsed); scoredFromLS = true }
        }
      } catch { /* ignore */ }

      // Attempt 2: Supabase (last analysis + history)
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // If scores not in localStorage, fetch them from the latest analysis
        if (!scoredFromLS) {
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
            setScores(s)
            try { localStorage.setItem('upface_scores', JSON.stringify(s)) } catch { /* ignore */ }
          }
        }

        // Always fetch history
        const { data } = await supabase
          .from('analyses')
          .select('id, score_global, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6)
        if (data) setAnalyses(data as Analysis[])
      } catch { /* ignore */ }
    }
    void load()
  }, [])

  const score = scores?.global ?? 74
  const potentiel = scores?.potentiel ?? 88
  const percentile = scores?.percentile ?? 34
  const tier = getTier(score)

  return (
    <div className="px-4 pt-6 pb-4" style={{ background: '#080C14', minHeight: '100vh' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-medium mb-0.5" style={{ color: '#8B9DC3' }}>RÉSULTAT DE TON SCAN</p>
          <h1 className="text-xl font-bold text-white">Ton analyse faciale</h1>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: `${tier.color}20`, color: tier.color, border: `1px solid ${tier.color}40` }}
        >
          {tier.label}
        </span>
      </div>

      {/* Score principal */}
      <div
        className="rounded-2xl p-5 mb-4 flex items-center justify-between"
        style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
      >
        <div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-6xl font-black text-white">{score}</span>
            <span className="text-xl mb-2" style={{ color: '#8B9DC3' }}>/100</span>
          </div>
          <div className="flex gap-3">
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: '#06B6D4' }}>{potentiel}</p>
              <p className="text-xs" style={{ color: '#3D4F6E' }}>Potentiel</p>
            </div>
            <div className="w-px" style={{ background: 'rgba(59,130,246,0.2)' }} />
            <div className="text-center">
              <p className="text-lg font-bold text-white">Top {percentile}%</p>
              <p className="text-xs" style={{ color: '#3D4F6E' }}>Percentile</p>
            </div>
          </div>
        </div>
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#1A2236" strokeWidth="7" />
          <circle
            cx="48" cy="48" r="40" fill="none"
            stroke="url(#aGrad)" strokeWidth="7" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
          />
          <defs>
            <linearGradient id="aGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 6 critères */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
      >
        <p className="text-xs font-medium mb-3" style={{ color: '#8B9DC3' }}>ANALYSE DÉTAILLÉE</p>
        <div className="space-y-3">
          {CRITERIA.map((c) => {
            const val = scores ? (scores[c.key] as number) : 0
            const level = val >= 75 ? 'Fort' : val >= 50 ? 'Moyen' : 'Faible'
            const levelColor = val >= 75 ? '#10B981' : val >= 50 ? '#F59E0B' : '#EF4444'
            return (
              <div key={c.key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{c.icon}</span>
                    <span className="text-sm font-medium text-white">{c.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: levelColor }}>{level}</span>
                    <span className="text-sm font-bold text-white">{val || '--'}/100</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#1A2236' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${val}%`, background: c.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Historique analyses */}
      {analyses.length > 1 && (
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <p className="text-xs font-medium mb-3" style={{ color: '#8B9DC3' }}>HISTORIQUE</p>
          <div className="space-y-0">
            {analyses.map((a, i) => (
              <div
                key={a.id}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: i < analyses.length - 1 ? '1px solid rgba(59,130,246,0.08)' : 'none' }}
              >
                <div>
                  <p className="text-sm font-medium text-white">{a.score_global}/100</p>
                  <p className="text-xs" style={{ color: '#3D4F6E' }}>
                    {new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                {i < analyses.length - 1 && analyses[i + 1] && (
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: a.score_global >= analyses[i + 1].score_global ? '#10B981' : '#EF4444',
                    }}
                  >
                    {a.score_global >= analyses[i + 1].score_global ? '▲' : '▼'}
                    {Math.abs(a.score_global - analyses[i + 1].score_global)} pts
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA nouvelle analyse */}
      <button
        onClick={() => router.push(`/${locale}/analyze`)}
        className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 active:scale-95"
        style={{ background: 'linear-gradient(90deg, #3B82F6, #06B6D4)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Nouvelle analyse
      </button>
    </div>
  )
}
