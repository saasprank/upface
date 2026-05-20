'use client'

interface ScanProgressBarProps {
  progress: number
  active?: boolean
}

export default function ScanProgressBar({ progress, active = true }: ScanProgressBarProps) {
  if (!active) return null

  const pct = Math.max(0, Math.min(99, Math.round(progress)))

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="h-1 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.85), rgba(255,255,255,0.45))',
            transition: 'width 0.15s linear',
          }}
        />
      </div>
      <p
        className="text-xs text-center mt-2"
        style={{ color: '#8B9DC3', fontFamily: 'Inter, sans-serif' }}
        role="status"
        aria-live="polite"
      >
        Analyse en cours… <span style={{ color: '#EEF2FF' }}>{pct}%</span>
      </p>
    </div>
  )
}
