import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import FreeResultsWithSession from '@/components/results/FreeResultsWithSession'
import ResultsPageView from '@/components/results/ResultsPageView'
import { isSupabaseConfigured } from '@/lib/supabase-config'
import { isAuthUiHidden } from '@/lib/auth-ui'

interface AnalysisData {
  id: string
  photo_url: string
  created_at: string
  score_global: number
  score_symetrie: number
  score_proportions: number
  score_structure: number
  score_peau: number
  score_grooming: number
  score_aura: number
  focus_dimensions: string[]
  tier: 'elite' | 'attractive' | 'average' | 'below'
  percentile: number
  scores: {
    global: number; symetrie: number; proportions: number
    structure: number; peau: number; grooming: number; aura: number
  }
  observations: {
    symetrie?: string; proportions?: string; structure?: string
    peau?: string; grooming?: string; aura?: string
  }
  routine: {
    skincare: string[]; grooming: string[]
    fitness: string[]; style: string[]; aura: string[]
  }
}

async function getAnalysis(id: string): Promise<AnalysisData | null> {
  if (id.startsWith('demo-') || id.startsWith('session-')) return getMockAnalysis(id)
  try {
    const { createClient } = await import('@/lib/supabase-server')
    const supabase = await createClient()
    const { data, error } = await supabase.from('analyses').select('*').eq('id', id).single()
    if (error || !data) return getMockAnalysis(id)
    return data as AnalysisData
  } catch {
    return getMockAnalysis(id)
  }
}

async function checkSubscription(userId: string | undefined): Promise<boolean> {
  if (!userId) return false
  try {
    const { createClient } = await import('@/lib/supabase-server')
    const supabase = await createClient()
    const { data: sub } = await supabase
      .from('subscriptions').select('status').eq('user_id', userId).single()
    return sub?.status === 'active' || sub?.status === 'trialing'
  } catch {
    return false
  }
}

function getMockAnalysis(id: string): AnalysisData {
  return {
    id, photo_url: '', created_at: new Date().toISOString(),
    score_global: 74, score_symetrie: 82, score_proportions: 76,
    score_structure: 71, score_peau: 68, score_grooming: 74, score_aura: 77,
    focus_dimensions: [], tier: 'attractive', percentile: 66,
    scores: { global: 74, symetrie: 82, proportions: 76, structure: 71, peau: 68, grooming: 74, aura: 77 },
    observations: {
      symetrie: 'Bonne symétrie faciale globale avec un léger décalage au niveau des yeux.',
      proportions: 'Les proportions dorées sont bien respectées.',
      structure: 'Mâchoire bien définie avec des pommettes modérément saillantes.',
      peau: 'Teint uniforme avec quelques imperfections légères.',
      grooming: 'Style personnel cohérent. Quelques améliorations possibles.',
      aura: 'Présence naturelle et regard expressif.',
    },
    routine: {
      skincare: ['Nettoyage doux matin et soir', 'Sérum vitamine C', 'SPF 50 quotidien', 'Rétinol le soir'],
      grooming: ['Contour de barbe précis', 'Soin des sourcils', 'Exfoliation 2x/semaine', 'Gua sha 10 min/soir'],
      fitness: ['Mewing constant', 'Chewing-gum dur', 'Gainage 3x/semaine', 'Cardio 30 min 4x/semaine'],
      style: ['Coupe adaptée', 'Couleurs neutres', 'Accessoires minimalistes', 'Posture'],
      aura: ['Méditation 10 min/jour', 'Contact visuel direct', 'Voix posée', 'Sourire contrôlé'],
    },
  }
}

interface ResultsPageProps {
  params: Promise<{ id: string; locale: string }>
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id, locale } = await params
  await getTranslations('results')
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const analysis = await getAnalysis(id)
  if (!analysis) notFound()

  if (isSupabaseConfigured() && !isAuthUiHidden()) {
    try {
      const { createClient } = await import('@/lib/supabase-server')
      const supabase = await createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        redirect(`${prefix}/signup?next=${encodeURIComponent(`${prefix}/results/${id}`)}`)
      }
    } catch { /* ignore */ }
  }

  let isSubscribed = true
  try {
    const { createClient } = await import('@/lib/supabase-server')
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    isSubscribed = await checkSubscription(session?.user?.id)
  } catch {
    isSubscribed = true
  }

  const scores = {
    global: analysis.score_global ?? analysis.scores?.global ?? 58,
    symetrie: analysis.score_symetrie ?? analysis.scores?.symetrie ?? 55,
    proportions: analysis.score_proportions ?? analysis.scores?.proportions ?? 55,
    structure: analysis.score_structure ?? analysis.scores?.structure ?? 52,
    peau: analysis.score_peau ?? analysis.scores?.peau ?? 52,
    grooming: analysis.score_grooming ?? analysis.scores?.grooming ?? 56,
    aura: analysis.score_aura ?? analysis.scores?.aura ?? 58,
  }

  if (!isSubscribed) {
    return (
      <FreeResultsWithSession
        analysisId={id}
        photoUrl={analysis.photo_url ?? ''}
        serverScores={scores}
        serverObservations={analysis.observations ?? {}}
        serverTier={analysis.tier ?? 'average'}
        serverPercentile={analysis.percentile ?? 40}
        prefix={prefix}
      />
    )
  }

  return (
    <ResultsPageView
      analysisId={id}
      scores={scores}
      tier={analysis.tier ?? 'average'}
      createdAt={analysis.created_at}
      prefix={prefix}
      isSubscribed
      routine={analysis.routine}
    />
  )
}
