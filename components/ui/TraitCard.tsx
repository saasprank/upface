import Card from './Card'

interface TraitCardProps {
  icon: React.ReactNode
  label: string
  value: string
  score: number
  locked?: boolean
  observation?: string
}

export default function TraitCard({ icon, label, value, score, locked = false, observation }: TraitCardProps) {
  const scoreColor = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444'
  const scoreBg = score >= 75 ? 'rgba(16,185,129,0.1)' : score >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'

  return (
    <Card className="p-4 flex items-start gap-3 relative overflow-hidden">
      {locked && (
        <div className="absolute inset-0 backdrop-blur-sm bg-surface/75 flex items-center justify-center z-10 rounded-xl">
          <div className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs text-muted">Pro</span>
          </div>
        </div>
      )}

      <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-muted">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted font-medium">{label}</p>
        <p className="text-sm font-semibold text-theme mt-0.5 truncate">{value}</p>
        {observation && (
          <p className="text-xs text-faint mt-1 leading-relaxed line-clamp-2">{observation}</p>
        )}
      </div>

      <div
        className="text-xs font-bold px-2.5 py-1 rounded-lg shrink-0"
        style={{ background: scoreBg, color: scoreColor }}
      >
        {score}
      </div>

      {/* Score bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${score}%`, background: `linear-gradient(90deg, ${scoreColor}80, ${scoreColor})` }}
        />
      </div>
    </Card>
  )
}
