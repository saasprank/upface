'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import FocusCard, { FOCUS_DIMENSIONS, type FocusDimension } from '@/components/ui/FocusCard'

interface AnalysisScores {
  skincare?: number
  grooming?: number
  fitness?: number
  style?: number
  aura?: number
  peau?: number
  symetrie?: number
  proportions?: number
  structure?: number
  [key: string]: number | undefined
}

interface FocusPageProps {
  params: Promise<{ id: string; locale: string }>
}

const DIMENSION_SCORE_MAP: Record<FocusDimension, (scores: AnalysisScores) => number> = {
  skincare: (s) => s.skincare ?? s.peau ?? 70,
  grooming: (s) => s.grooming ?? 70,
  fitness: (s) => s.fitness ?? s.structure ?? 70,
  style: (s) => s.style ?? 70,
  aura: (s) => s.aura ?? 70,
}

async function fetchAnalysis(id: string): Promise<{ scores: AnalysisScores; focusDimensions: FocusDimension[] }> {
  if (id.startsWith('demo-') || id.startsWith('session-')) {
    return {
      scores: { skincare: 68, grooming: 74, fitness: 71, style: 70, aura: 77, symetrie: 82, proportions: 76, structure: 71, peau: 68 },
      focusDimensions: [],
    }
  }
  try {
    const res = await fetch(`/api/analyses/${id}`)
    if (!res.ok) throw new Error('fetch failed')
    const data = await res.json()
    return {
      scores: data.scores ?? {},
      focusDimensions: data.focus_dimensions ?? [],
    }
  } catch {
    return {
      scores: { skincare: 68, grooming: 74, fitness: 71, style: 70, aura: 77 },
      focusDimensions: [],
    }
  }
}

export default function FocusPage({ params }: FocusPageProps) {
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const [analysisId, setAnalysisId] = useState<string>('')
  const [scores, setScores] = useState<AnalysisScores>({})
  const [selected, setSelected] = useState<FocusDimension[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      setAnalysisId(id)
      fetchAnalysis(id).then(({ scores: s, focusDimensions }) => {
        setScores(s)
        // Auto-select dimensions with score < 60 (up to 2)
        if (focusDimensions.length > 0) {
          setSelected(focusDimensions)
        } else {
          const autoSelect = FOCUS_DIMENSIONS
            .filter(d => DIMENSION_SCORE_MAP[d.key](s) < 60)
            .slice(0, 2)
            .map(d => d.key)
          setSelected(autoSelect)
        }
        setLoading(false)
      })
    })
  }, [params])

  function handleToggle(key: FocusDimension) {
    setSelected(prev => {
      if (prev.includes(key)) return prev.filter(k => k !== key)
      if (prev.length >= 2) {
        setToast('Maximum 2 axes sélectionnables')
        setTimeout(() => setToast(null), 3000)
        return prev
      }
      return [...prev, key]
    })
  }

  async function handleSubmit() {
    if (selected.length === 0) return
    setSubmitting(true)
    try {
      await fetch(`/api/analyses/${analysisId}/focus`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusDimensions: selected }),
      })
      router.push(`${prefix}/dashboard/routine?focus=${selected.join(',')}`)
    } catch {
      setToast('Une erreur est survenue')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-sm text-muted">Chargement...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg transition-all"
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}
        >
          {toast}
        </div>
      )}

      <main className="pt-16 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

          {/* Back link */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-faint hover:text-muted transition-colors mb-8"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour aux résultats
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid #1E2A3E', color: '#3B82F6' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              Personnalisation de ta routine
            </div>

            <h1
              className="text-2xl sm:text-3xl font-black text-theme mb-3"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              Sur quoi veux-tu te concentrer ?
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              Sélectionne <strong className="text-theme">1 ou 2 axes</strong>. Ta routine sera adaptée pour maximiser tes progrès sur ces dimensions.
            </p>
          </div>

          {/* Dimension cards */}
          <div className="space-y-3 mb-8">
            {FOCUS_DIMENSIONS.map(config => (
              <FocusCard
                key={config.key}
                config={config}
                score={DIMENSION_SCORE_MAP[config.key](scores)}
                selected={selected.includes(config.key)}
                onToggle={handleToggle}
              />
            ))}
          </div>

          {/* Selection indicator */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              {selected.map(key => {
                const config = FOCUS_DIMENSIONS.find(d => d.key === key)!
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#3B82F6' }}
                  >
                    {config.label}
                  </span>
                )
              })}
              {selected.length === 0 && (
                <span className="text-xs text-faint">Aucun axe sélectionné</span>
              )}
            </div>
            <span className="text-xs text-faint">{selected.length}/2</span>
          </div>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            disabled={selected.length === 0 || submitting}
            className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: selected.length > 0
                ? 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'
                : 'rgba(255,255,255,0.06)',
              color: selected.length > 0 ? '#fff' : '#3D4F6E',
              cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                Générer ma routine ciblée
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>

          <p className="text-center text-xs text-faint mt-4">
            Tu pourras modifier ton focus à tout moment depuis ton tableau de bord.
          </p>
        </div>
      </main>
    </>
  )
}
