'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BeforeAfterSlider from './BeforeAfterSlider'

interface Scores {
  global: number; symetrie: number; proportions: number
  structure: number; peau: number; grooming: number; aura: number
}

interface Observations {
  symetrie?: string; proportions?: string; structure?: string
  peau?: string; grooming?: string; aura?: string
}

interface FreeResultsViewProps {
  analysisId: string
  photoUrl: string
  scores: Scores
  observations: Observations
  tier: string
  percentile: number
  prefix: string
}

const TRAIT_META: { key: keyof Scores & keyof Observations; label: string; icon: React.ReactNode }[] = [
  {
    key: 'symetrie', label: 'Symétrie',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>,
  },
  {
    key: 'proportions', label: 'Proportions',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 5.49z" /></svg>,
  },
  {
    key: 'structure', label: 'Structure',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  },
  {
    key: 'peau', label: 'Peau',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
  },
  {
    key: 'grooming', label: 'Grooming',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>,
  },
  {
    key: 'aura', label: 'Aura',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>,
  },
]

function scoreColor(s: number) {
  return s >= 70 ? '#10B981' : s >= 55 ? '#F59E0B' : '#EF4444'
}

function scoreLabel(s: number) {
  if (s >= 75) return 'Fort'
  if (s >= 60) return 'Moyen'
  return 'À améliorer'
}

const TIER_LABELS: Record<string, string> = {
  elite: 'Elite', attractive: 'Attractive', average: 'Average', below: 'Below Average',
}

export default function FreeResultsView({
  analysisId, photoUrl, scores, observations, tier, percentile, prefix
}: FreeResultsViewProps) {
  const potentiel = Math.min(95, scores.global + 14)
  const [displayPhoto, setDisplayPhoto] = useState(photoUrl)

  useEffect(() => {
    if (photoUrl?.trim()) {
      setDisplayPhoto(photoUrl)
      return
    }
    try {
      const fromSession = sessionStorage.getItem('upface_photo_url')
      if (fromSession) setDisplayPhoto(fromSession)
    } catch { /* ignore */ }
  }, [photoUrl])

  // Persist scores to localStorage so dashboard & routine generator can use them
  useEffect(() => {
    try {
      localStorage.setItem('upface_scores', JSON.stringify({
        ...scores,
        potentiel,
        percentile: percentile ?? 34,
      }))
      if (observations && Object.keys(observations).length > 0) {
        localStorage.setItem('upface_observations', JSON.stringify(observations))
      }
    } catch { /* ignore */ }
  }, [scores, percentile, potentiel, observations])

  const scoreAfter = potentiel

  const weak   = TRAIT_META.filter(t => scores[t.key as keyof Scores] < 60)
  const strong = TRAIT_META.filter(t => scores[t.key as keyof Scores] >= 60)

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-24">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-muted uppercase tracking-widest font-medium mb-0.5">Résultat de ton scan</p>
            <h1 className="text-xl font-black text-theme" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              Ton potentiel facial
            </h1>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid #1E2A3E', color: '#3B82F6' }}
          >
            {TIER_LABELS[tier] ?? 'Average'}
          </div>
        </div>

        {/* Before / After Slider */}
        <div className="mb-4">
          <BeforeAfterSlider
            photoUrl={displayPhoto}
            scoreBefore={scores.global}
            scoreAfter={scoreAfter}
          />
        </div>

        {/* Dream face tagline */}
        <div
          className="flex items-center gap-3 p-4 rounded-2xl mb-6"
          style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.18)' }}
        >
          <div style={{ color: '#06B6D4' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-[#06B6D4] uppercase tracking-wider mb-0.5">Ton visage de rêve</p>
            <p className="text-sm text-muted">
              En suivant ta routine personnalisée, tu peux atteindre <span className="font-bold text-theme">{scoreAfter}/100</span> en {scores.global < 55 ? '16' : '8'} semaines.
            </p>
          </div>
        </div>

        {/* What we'll fix */}
        <section className="mb-6">
          <h2 className="text-base font-black text-theme mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Ce qu&apos;on va corriger
          </h2>
          <div className="flex flex-wrap gap-2">
            {TRAIT_META.map(t => {
              const s = scores[t.key as keyof Scores]
              const c = scoreColor(s)
              return (
                <div
                  key={t.key}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: `${c}12`, border: `1px solid ${c}33`, color: c }}
                >
                  {t.icon}
                  {t.label} <span className="opacity-60">{s}/100</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Detailed observations */}
        <section className="mb-6 space-y-3">
          <h2 className="text-base font-black text-theme mb-3" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Analyse détaillée
          </h2>
          {TRAIT_META.map(t => {
            const s = scores[t.key as keyof Scores]
            const obs = observations[t.key as keyof Observations]
            const c = scoreColor(s)
            return (
              <div
                key={t.key}
                className="rounded-2xl p-4"
                style={{ background: '#0D1321', border: `1px solid ${c}22` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2" style={{ color: c }}>
                    {t.icon}
                    <span className="text-sm font-bold text-theme">{t.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: c }}>{scoreLabel(s)}</span>
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded-full"
                      style={{ background: `${c}18`, color: c }}
                    >
                      {s}/100
                    </span>
                  </div>
                </div>
                {/* Score bar */}
                <div className="h-1 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${s}%`, background: `linear-gradient(90deg, ${c}, ${c}99)` }}
                  />
                </div>
                {obs && (
                  <p className="text-xs leading-relaxed text-muted">{obs}</p>
                )}
              </div>
            )
          })}
        </section>

        {/* Social proof */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-6"
          style={{ background: '#0D1321', border: '1px solid #1E2A3E' }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          <p className="text-xs text-muted">
            <span className="font-semibold text-theme">127 utilisateurs</span> ont commencé leur routine UPFACE aujourd&apos;hui
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Ton score', value: `${scores.global}/100` },
            { label: 'Top', value: `${Math.max(5, 100 - percentile)}%` },
            { label: 'Potentiel', value: `${scoreAfter}/100` },
          ].map(s => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 py-3 rounded-2xl"
              style={{ background: '#0D1321', border: '1px solid #1E2A3E' }}
            >
              <span className="text-lg font-black text-theme" style={{ fontFamily: 'Satoshi, sans-serif' }}>{s.value}</span>
              <span className="text-[10px] text-muted uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4"
        style={{ background: 'linear-gradient(to top, #080C14 70%, transparent)', zIndex: 40 }}
      >
        <div className="max-w-lg mx-auto">
          <Link
            href={`${prefix}/onboarding?id=${analysisId}`}
            className="w-full flex items-center justify-center gap-2 font-black text-base rounded-2xl transition-all hover:brightness-110"
            style={{
              height: 58,
              background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
              color: '#fff',
              fontFamily: 'Satoshi, sans-serif',
              boxShadow: '0 4px 28px rgba(59,130,246,0.3)',
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
            Commencer ma routine
          </Link>
        </div>
      </div>
    </div>
  )
}
