import Link from 'next/link'

interface BilanItem {
  key: string
  label: string
  score: number
  observation: string
}

interface BilanSectionProps {
  scores: Record<string, number>
  observations: Record<string, string>
  analysisId: string
  prefix: string
}

const DIMENSION_LABELS: Record<string, string> = {
  symetrie: 'Symétrie',
  proportions: 'Proportions',
  structure: 'Structure',
  peau: 'Qualité de peau',
  grooming: 'Grooming',
  aura: 'Aura',
}

const DIMENSION_ICONS: Record<string, React.ReactNode> = {
  symetrie: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
  ),
  proportions: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-12m-6-4.5h18" />
    </svg>
  ),
  structure: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
    </svg>
  ),
  peau: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1M21 12h1" />
    </svg>
  ),
  grooming: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  aura: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
}

export default function BilanSection({ scores, observations, analysisId, prefix }: BilanSectionProps) {
  const items: BilanItem[] = Object.entries(scores).map(([key, score]) => ({
    key,
    label: DIMENSION_LABELS[key] ?? key,
    score,
    observation: observations[key] ?? '',
  }))

  const strengths = items.filter(i => i.score >= 75).sort((a, b) => b.score - a.score)
  const improvements = items.filter(i => i.score < 60).sort((a, b) => a.score - b.score)

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-xl font-black text-theme" style={{ fontFamily: 'Satoshi, sans-serif' }}>
        Bilan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Points forts */}
        {strengths.length > 0 && (
          <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.2)' }}>
                <svg className="w-3.5 h-3.5" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold" style={{ color: '#10B981' }}>Points forts</span>
            </div>
            {strengths.map(item => (
              <div key={item.key} className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0" style={{ color: '#10B981' }}>
                  {DIMENSION_ICONS[item.key]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-theme">{item.label}</span>
                    <span className="text-sm font-bold shrink-0" style={{ color: '#10B981' }}>{item.score}</span>
                  </div>
                  {item.observation && (
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{item.observation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Points à travailler */}
        {improvements.length > 0 && (
          <div className="rounded-2xl p-5 space-y-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.2)' }}>
                <svg className="w-3.5 h-3.5" style={{ color: '#EF4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                </svg>
              </div>
              <span className="text-sm font-semibold" style={{ color: '#EF4444' }}>À améliorer</span>
            </div>
            {improvements.map(item => (
              <div key={item.key} className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0" style={{ color: '#F59E0B' }}>
                  {DIMENSION_ICONS[item.key]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-theme">{item.label}</span>
                    <span className="text-sm font-bold shrink-0" style={{ color: '#EF4444' }}>{item.score}</span>
                  </div>
                  {item.observation && (
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{item.observation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Focus */}
      <div className="pt-2">
        <Link
          href={`${prefix}/results/${analysisId}/focus`}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)', color: '#fff' }}
        >
          Choisir mon axe d&apos;amélioration
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
