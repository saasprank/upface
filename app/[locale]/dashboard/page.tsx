'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import DashboardKpiCard from '@/components/dashboard/DashboardKpiCard'
import DashboardProgressChart from '@/components/dashboard/DashboardProgressChart'
import DashboardRoutineDay from '@/components/dashboard/DashboardRoutineDay'
import DashboardRecentAnalyses, { type RecentAnalysis } from '@/components/dashboard/DashboardRecentAnalyses'
import { isSupabaseConfigured } from '@/lib/supabase-config'
import { isAuthUiHidden } from '@/lib/auth-ui'

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

interface GeneratedRoutine {
  headline: string
  categories: { title: string; tasks: string[] }[]
}

const NEW_ANALYSIS_PATH = '/analyze'

const DEFAULT_ROUTINE_TASKS = [
  { id: 'skincare', title: 'Nettoyage matin', category: 'Skincare' },
  { id: 'fitness', title: 'Exercices jawline', category: 'Fitness' },
  { id: 'nutrition', title: 'Hydratation 2L', category: 'Nutrition' },
  { id: 'aura', title: 'Posture & présence', category: 'Aura' },
]

export default function DashboardHome() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'fr'
  const prefix = locale === 'fr' ? '' : `/${locale}`
  const router = useRouter()
  const t = useTranslations('dashboard')

  const [scores, setScores] = useState<Scores | null>(null)
  const [routine, setRoutine] = useState<GeneratedRoutine | null>(null)
  const [streak] = useState(3)
  const [analysesTotal, setAnalysesTotal] = useState(0)
  const [history, setHistory] = useState<{ date: string; score: number }[]>([])
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([])

  useEffect(() => {
    const loadScores = async () => {
      try {
        const raw = localStorage.getItem('upface_scores')
        if (raw) {
          const parsed = JSON.parse(raw) as Scores
          if (parsed?.global) setScores(parsed)
        }
      } catch { /* ignore */ }

      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        const relaxPaywall = !isSupabaseConfigured() || isAuthUiHidden()

        if (!user) {
          if (relaxPaywall) {
            try {
              const r = localStorage.getItem('upface_routine')
              if (r) setRoutine(JSON.parse(r) as GeneratedRoutine)
            } catch { /* ignore */ }
          }
          return
        }

        let subscribed = relaxPaywall
        if (!relaxPaywall) {
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .in('status', ['active', 'trialing'])
            .maybeSingle()
          subscribed = !!sub
        }

        const { data: latest } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (latest) {
          const s: Scores = {
            global: latest.score_global ?? 74,
            potentiel: (latest.score_global ?? 74) + 14,
            percentile: latest.percentile ?? 34,
            symetrie: latest.score_symetrie ?? 0,
            proportions: latest.score_proportions ?? 0,
            structure: latest.score_structure ?? 0,
            peau: latest.score_peau ?? 0,
            grooming: latest.score_grooming ?? 0,
            aura: latest.score_aura ?? 0,
          }
          setScores((prev) => prev ?? s)
          try { localStorage.setItem('upface_scores', JSON.stringify(s)) } catch { /* ignore */ }
        }

        const { data: histData, count } = await supabase
          .from('analyses')
          .select('id, score_global, tier, created_at', { count: 'exact' })
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6)

        setAnalysesTotal(count ?? histData?.length ?? 0)

        if (histData && histData.length > 0) {
          setRecentAnalyses(
            histData.slice(0, 5).map((a) => ({
              id: a.id as string,
              score: a.score_global as number,
              tier: (a.tier as string) ?? 'average',
              date: new Date(a.created_at as string).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
            })),
          )
        }

        if (histData && histData.length > 1) {
          const chronological = [...histData].reverse()
          setHistory(
            chronological.map((a) => ({
              date: new Date(a.created_at as string).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
              }),
              score: a.score_global as number,
            })),
          )
        }

        if (subscribed) {
          try {
            const r = localStorage.getItem('upface_routine')
            if (r) setRoutine(JSON.parse(r) as GeneratedRoutine)
          } catch { /* ignore */ }
        }
      } catch { /* ignore */ }
    }
    void loadScores()
  }, [])

  const score = scores?.global ?? 74
  const potentiel = scores?.potentiel ?? 88
  const progression = Math.max(0, potentiel - score)

  const routineTasks = (() => {
    if (routine?.categories?.length) {
      const cats = ['Skincare', 'Grooming', 'Fitness', 'Aura']
      return routine.categories.slice(0, 4).map((cat, i) => ({
        id: `routine-${i}`,
        title: cat.tasks[0] ?? cat.title,
        category: cats[i] ?? cat.title,
      }))
    }
    return DEFAULT_ROUTINE_TASKS
  })()

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(59,130,246,0.1) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-[Outfit,sans-serif] text-[clamp(28px,4vw,36px)] font-black text-white">
              {t('title')}
            </h1>
            <p className="mt-1 font-[Inter,sans-serif] text-[13px] text-[#8B9DC3]">
              Suivez votre progression faciale
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push(`${prefix}${NEW_ANALYSIS_PATH}`)}
            className="inline-flex h-10 items-center justify-center rounded-full px-5 font-[Outfit,sans-serif] text-[12px] font-bold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              boxShadow: '0 0 24px rgba(59,130,246,0.35)',
            }}
          >
            + {t('new_analysis')}
          </button>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <DashboardKpiCard
            label={t('score_current')}
            value={score}
            unit="/100"
            highlighted
          />
          <DashboardKpiCard
            label={t('score_progress')}
            value={`+${progression}`}
            unit="pts potentiel"
          />
          <DashboardKpiCard
            label={t('analyses_total')}
            value={analysesTotal}
            unit="analyses"
          />
          <DashboardKpiCard
            label={t('streak')}
            value={`${streak}j`}
            unit="consécutifs"
          />
        </div>

        <div className="mb-8">
          <DashboardProgressChart
            title={t('chart_title')}
            data={history}
            emptyMessage={t('chart_empty')}
          />
        </div>

        <div className="mb-8">
          <DashboardRoutineDay title={t('routine_today')} tasks={routineTasks} />
        </div>

        <DashboardRecentAnalyses
          title={t('history_title')}
          analyses={recentAnalyses}
          prefix={prefix}
          emptyMessage={t('history_empty')}
        />
      </div>
    </div>
  )
}
