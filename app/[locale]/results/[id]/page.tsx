import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScoreRing from '@/components/ui/ScoreRing'
import TraitCard from '@/components/ui/TraitCard'
import BilanSection from '@/components/ui/BilanSection'
import ShareButton from '@/components/results/ShareButton'
import FreeResultsWithSession from '@/components/results/FreeResultsWithSession'
import { isSupabaseConfigured } from '@/lib/supabase-config'
import { isAuthUiHidden } from '@/lib/auth-ui'

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconSymetrie = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
  </svg>
)

const IconProportions = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 5.49z" />
  </svg>
)

const IconStructure = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
)

const IconPeau = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
)

const IconGrooming = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
  </svg>
)

const IconAura = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
)

// ─── Types ────────────────────────────────────────────────────────────────────

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

const TIER_CONFIG = {
  elite:      { label: 'Elite',         color: '#06B6D4', bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)'  },
  attractive: { label: 'Attractive',    color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
  average:    { label: 'Average',       color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  below:      { label: 'Below Average', color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)'  },
}

interface ResultsPageProps {
  params: Promise<{ id: string; locale: string }>
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id, locale } = await params
  const t = await getTranslations('results')
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const analysis = await getAnalysis(id)
  if (!analysis) notFound()

  // Sans compte : inscription obligatoire pour voir les résultats (sauf mode demo sans Supabase)
  if (isSupabaseConfigured() && !isAuthUiHidden()) {
    try {
      const { createClient } = await import('@/lib/supabase-server')
      const supabase = await createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        redirect(`${prefix}/signup?next=${encodeURIComponent(`${prefix}/results/${id}`)}`)
      }
    } catch {
      // ignore — laisse passer si erreur serveur
    }
  }

  // Check subscription to know if full results are unlocked
  let isSubscribed = true
  try {
    const { createClient } = await import('@/lib/supabase-server')
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    isSubscribed = await checkSubscription(session?.user?.id)
  } catch {
    isSubscribed = true // demo mode
  }

  // Free users → immersive onboarding-style results page
  if (!isSubscribed) {
    const scores = {
      global:      analysis.score_global      ?? analysis.scores?.global      ?? 58,
      symetrie:    analysis.score_symetrie    ?? analysis.scores?.symetrie    ?? 55,
      proportions: analysis.score_proportions ?? analysis.scores?.proportions ?? 55,
      structure:   analysis.score_structure   ?? analysis.scores?.structure   ?? 52,
      peau:        analysis.score_peau        ?? analysis.scores?.peau        ?? 52,
      grooming:    analysis.score_grooming    ?? analysis.scores?.grooming    ?? 56,
      aura:        analysis.score_aura        ?? analysis.scores?.aura        ?? 58,
    }
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

  const tier = TIER_CONFIG[analysis.tier] ?? TIER_CONFIG.average
  const scoreGlobal = analysis.score_global ?? analysis.scores.global
  const date = new Date(analysis.created_at).toLocaleDateString(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )

  const traitCards = [
    { key: 'symetrie',    icon: IconSymetrie,    label: t('trait_symetrie'),    score: analysis.score_symetrie ?? analysis.scores.symetrie,       observation: analysis.observations?.symetrie },
    { key: 'proportions', icon: IconProportions, label: t('trait_proportions'), score: analysis.score_proportions ?? analysis.scores.proportions, observation: analysis.observations?.proportions },
    { key: 'structure',   icon: IconStructure,   label: t('trait_structure'),   score: analysis.score_structure ?? analysis.scores.structure,     observation: analysis.observations?.structure },
    { key: 'peau',        icon: IconPeau,        label: t('trait_peau'),        score: analysis.score_peau ?? analysis.scores.peau,               observation: analysis.observations?.peau },
    { key: 'grooming',    icon: IconGrooming,    label: t('trait_grooming'),    score: analysis.score_grooming ?? analysis.scores.grooming,       observation: analysis.observations?.grooming },
    { key: 'aura',        icon: IconAura,        label: t('trait_aura'),        score: analysis.score_aura ?? analysis.scores.aura,               observation: analysis.observations?.aura },
  ]

  const bilanScores: Record<string, number> = {
    symetrie: analysis.score_symetrie ?? analysis.scores.symetrie,
    proportions: analysis.score_proportions ?? analysis.scores.proportions,
    structure: analysis.score_structure ?? analysis.scores.structure,
    peau: analysis.score_peau ?? analysis.scores.peau,
    grooming: analysis.score_grooming ?? analysis.scores.grooming,
    aura: analysis.score_aura ?? analysis.scores.aura,
  }

  const bilanObservations: Record<string, string> = {
    symetrie: analysis.observations?.symetrie ?? '',
    proportions: analysis.observations?.proportions ?? '',
    structure: analysis.observations?.structure ?? '',
    peau: analysis.observations?.peau ?? '',
    grooming: analysis.observations?.grooming ?? '',
    aura: analysis.observations?.aura ?? '',
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-faint mb-8">
            <Link href={`${prefix}/dashboard`} className="hover:text-muted transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-muted">Analyse du {date}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-theme mb-8" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            {t('title')}
          </h1>

          {/* Free user banner */}
          {!isSubscribed && (
            <div
              className="mb-6 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-theme">Aperçu de votre analyse</p>
                  <p className="text-xs text-muted mt-0.5">Ces scores sont indicatifs. Abonnez-vous pour votre analyse complète et personnalisée.</p>
                </div>
              </div>
              <Link
                href={`${prefix}/checkout?plan=pro`}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: '#fff' }}
              >
                Débloquer l&apos;analyse complète
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          )}

          {/* Main 2-col layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Left: Score ring + bars */}
            <div
              className="rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-6"
              style={{ background: '#FFFFFF', border: '1px solid rgba(59,130,246,0.1)' }}
            >
              <div className="flex flex-col items-center gap-3 w-full">
                <p className="text-xs text-muted font-medium uppercase tracking-wider">{t('score_label')}</p>
                <ScoreRing score={scoreGlobal} size={180} />
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
                  style={{ background: tier.bg, border: `1px solid ${tier.border}`, color: tier.color }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: tier.color }} />
                  {tier.label}
                </div>
                <p className="text-xs text-faint">
                  Top <span className="font-semibold text-muted">{100 - (analysis.percentile ?? 66)}%</span> des utilisateurs
                </p>
              </div>

              {/* Breakdown bars */}
              <div className="w-full space-y-3">
                {traitCards.map(trait => {
                  const barColor = trait.score >= 75 ? '#10B981' : trait.score >= 50 ? '#F59E0B' : '#EF4444'
                  return (
                    <div key={trait.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted">{trait.label}</span>
                        <span className="text-xs font-semibold" style={{ color: barColor }}>{trait.score}</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(15,23,42,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${trait.score}%`, background: `linear-gradient(90deg, ${barColor}, ${barColor}99)` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Trait cards */}
            <div className="flex flex-col gap-3">
              {traitCards.map(trait => (
                <TraitCard
                  key={trait.key}
                  icon={trait.icon}
                  label={trait.label}
                  value={getTraitLabel(trait.score)}
                  score={trait.score}
                  locked={false}
                  observation={trait.observation}
                />
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="rounded-2xl p-6 mb-8" style={{ background: '#FFFFFF', border: '1px solid rgba(59,130,246,0.1)' }}>
            <ShareButton analysisId={id} score={scoreGlobal} />
          </div>

          {/* Bilan + focus CTA — subscribers only */}
          {isSubscribed ? (
            <BilanSection
              scores={bilanScores}
              observations={bilanObservations}
              analysisId={id}
              prefix={prefix}
            />
          ) : (
            /* Paywall for routine & bilan */
            <div className="rounded-2xl overflow-hidden relative" style={{ background: '#FFFFFF', border: '1px solid rgba(59,130,246,0.1)' }}>
              <div className="p-6 blur-sm pointer-events-none select-none">
                <h2 className="text-xl font-black text-theme mb-4" style={{ fontFamily: 'Satoshi, sans-serif' }}>Bilan & Routine personnalisée</h2>
                <div className="grid grid-cols-2 gap-4">
                  {['Points forts', 'À améliorer'].map(l => (
                    <div key={l} className="rounded-xl p-4" style={{ background: 'rgba(15,23,42,0.04)' }}>
                      <div className="h-3 w-20 rounded mb-3" style={{ background: 'rgba(15,23,42,0.08)' }} />
                      {[1, 2, 3].map(i => <div key={i} className="h-2 rounded mb-2" style={{ background: 'rgba(15,23,42,0.06)', width: `${60 + i * 10}%` }} />)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6" style={{ background: 'rgba(248,250,255,0.85)' }}>
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className="text-base font-semibold text-theme text-center">Débloquez votre bilan complet et votre routine personnalisée</p>
                <p className="text-sm text-muted text-center max-w-sm">Obtenez votre plan d&apos;amélioration sur 90 jours, filtré sur vos axes prioritaires.</p>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  <Link
                    href={`${prefix}/checkout?plan=pro`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: '#fff' }}
                  >
                    Pro — 9,99€/mois
                  </Link>
                  <Link
                    href={`${prefix}/checkout?plan=report`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3B82F6' }}
                  >
                    Report — 6,99€
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}

function getTraitLabel(score: number): string {
  if (score >= 85) return 'Exceptionnel'
  if (score >= 75) return 'Excellent'
  if (score >= 65) return 'Bon'
  if (score >= 50) return 'Moyen'
  return 'À améliorer'
}
