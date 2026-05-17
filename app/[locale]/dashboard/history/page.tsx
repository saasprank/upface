import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase-server'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import ScoreRing from '@/components/ui/ScoreRing'
import Button from '@/components/ui/Button'

const TIER_BADGE: Record<string, { label: string; variant: 'primary' | 'success' | 'warning' | 'danger' }> = {
  elite: { label: 'Elite', variant: 'primary' },
  attractive: { label: 'Attractive', variant: 'success' },
  average: { label: 'Average', variant: 'warning' },
  below: { label: 'Below Average', variant: 'danger' },
}

export default async function HistoryPage() {
  const t = await getTranslations('dashboard')
  const locale = await getLocale()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  let analyses: Array<{id: string; score_global: number; tier: string; created_at: string}> = []

  if (session) {
    try {
      const { data } = await supabase
        .from('analyses')
        .select('id, score_global, tier, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      analyses = data ?? []
    } catch {
      analyses = []
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-black text-[#EEF2FF]"
          style={{ fontFamily: 'Satoshi, sans-serif' }}
        >
          {t('history_title')}
        </h1>
      </div>

      {analyses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#EEF2FF] mb-2">{t('history_empty')}</h2>
          <p className="text-sm text-[#3D4F6E] mb-6">Faites votre première analyse pour commencer votre progression.</p>
          <Link href={`${prefix}/analyze`}>
            <Button>{t('history_empty_cta')}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis) => {
            const tier = TIER_BADGE[analysis.tier] ?? { label: analysis.tier, variant: 'muted' as const }
            const date = new Date(analysis.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
              day: 'numeric', month: 'long', year: 'numeric',
            })
            return (
              <Card key={analysis.id} hover className="p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  <ScoreRing score={analysis.score_global} size={60} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={tier.variant}>{tier.label}</Badge>
                    </div>
                    <p className="text-sm font-medium text-[#EEF2FF]">{analysis.score_global}/100</p>
                    <p className="text-xs text-[#3D4F6E]">{date}</p>
                  </div>
                  <Link
                    href={`${prefix}/results/${analysis.id}`}
                    className="shrink-0 text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                  >
                    Voir
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
