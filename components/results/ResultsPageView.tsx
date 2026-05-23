'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Navbar from '@/components/layout/Navbar'
import ResultsHeroVisual from '@/components/results/ResultsHeroVisual'
import ResultsBreakdownGrid from '@/components/results/ResultsBreakdownGrid'
import ResultsRoutinePreview from '@/components/results/ResultsRoutinePreview'
import ShareButton from '@/components/results/ShareButton'

interface Scores {
  global: number
  symetrie: number
  proportions: number
  structure: number
  peau: number
  grooming: number
  aura: number
}

interface RoutineData {
  skincare: string[]
  grooming: string[]
  fitness: string[]
  style: string[]
  aura: string[]
}

export interface ResultsPageViewProps {
  analysisId: string
  scores: Scores
  tier: string
  createdAt: string
  prefix: string
  isSubscribed?: boolean
  routine?: RoutineData
}

const TRAIT_ICONS: Record<string, React.ReactNode> = {
  symetrie: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
  ),
  proportions: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 5.49z" />
    </svg>
  ),
  structure: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  peau: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  grooming: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  aura: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
}

const LOCKED_TRAITS = new Set(['grooming', 'aura'])

const ROUTINE_CATEGORIES: { key: keyof RoutineData; label: string }[] = [
  { key: 'skincare', label: 'Skincare' },
  { key: 'grooming', label: 'Grooming' },
  { key: 'fitness', label: 'Fitness' },
  { key: 'style', label: 'Style' },
  { key: 'aura', label: 'Aura' },
]

function buildRoutineItems(routine?: RoutineData) {
  const defaults = [
    'Nettoyage doux matin et soir',
    'Contour de barbe précis',
    'Mewing constant',
    'Coupe adaptée à ta morphologie',
    'Méditation 10 min/jour',
  ]
  const items: { category: string; label: string; blurred: boolean }[] = []

  ROUTINE_CATEGORIES.forEach((cat, i) => {
    const label = routine?.[cat.key]?.[0] ?? defaults[i]
    items.push({
      category: cat.label,
      label,
      blurred: i >= 3,
    })
  })

  return items
}

export default function ResultsPageView({
  analysisId,
  scores,
  tier,
  createdAt,
  prefix,
  isSubscribed = false,
  routine,
}: ResultsPageViewProps) {
  const t = useTranslations('results')

  useEffect(() => {
    try {
      localStorage.setItem('upface_scores', JSON.stringify(scores))
    } catch { /* ignore */ }
  }, [scores])

  const date = new Date(createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const traitKeys = ['symetrie', 'proportions', 'structure', 'peau', 'grooming', 'aura'] as const
  const traits = traitKeys.map((key) => ({
    key,
    label: t(`trait_${key}` as 'trait_symetrie'),
    score: scores[key],
    icon: TRAIT_ICONS[key],
    locked: !isSubscribed && LOCKED_TRAITS.has(key),
  }))

  const routineItems = buildRoutineItems(routine)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080C14]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 15%, rgba(59,130,246,0.14) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[720px] px-4 pb-32 pt-20">
        <header className="mb-8 text-center">
          <h1 className="font-[Outfit,sans-serif] text-[clamp(36px,6vw,48px)] font-black uppercase leading-[0.92] tracking-[-0.02em]">
            <span className="block text-white">VOTRE</span>
            <span className="block bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
              ANALYSE
            </span>
          </h1>
          <p className="mt-3 font-mono text-[12px] text-[#3D4F6E]">
            {date} · ID {analysisId.slice(0, 8).toUpperCase()}
          </p>
        </header>

        <ResultsHeroVisual
          globalScore={scores.global}
          symetrie={scores.symetrie}
          proportions={scores.proportions}
          structure={scores.structure}
          tier={tier}
        />

        <section className="mb-10">
          <h2 className="mb-4 font-[Outfit,sans-serif] text-[20px] font-bold text-white">
            Détail des scores
          </h2>
          <ResultsBreakdownGrid traits={traits} />
        </section>

        <div className="mb-10">
          <ResultsRoutinePreview items={routineItems} isSubscribed={isSubscribed} prefix={prefix} />
        </div>

        <section className="mb-8 rounded-xl border border-[#1E2A3E] bg-[#0D1321] p-5">
          <ShareButton analysisId={analysisId} score={scores.global} />
        </section>
      </main>

      {!isSubscribed && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 p-4"
          style={{ background: 'linear-gradient(to top, #080C14 75%, transparent)' }}
        >
          <div className="mx-auto max-w-[480px]">
            <Link
              href={`${prefix}/checkout?plan=pro`}
              className="flex h-[56px] w-full items-center justify-center gap-2 rounded-full font-[Outfit,sans-serif] text-[14px] font-bold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                boxShadow: '0 0 40px rgba(59,130,246,0.45), 0 0 80px rgba(6,182,212,0.2)',
              }}
            >
              {t('plan_pro')}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <p className="mt-2 text-center font-[Inter,sans-serif] text-[11px] text-[#3D4F6E]">{t('secure')}</p>
          </div>
        </div>
      )}
    </div>
  )
}
