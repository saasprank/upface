'use client'

export type FocusDimension = 'skincare' | 'grooming' | 'fitness' | 'style' | 'aura'

export interface FocusCardConfig {
  key: FocusDimension
  label: string
  labelEn: string
  description: string
  icon: React.ReactNode
  color: string
}

export const FOCUS_DIMENSIONS: FocusCardConfig[] = [
  {
    key: 'skincare',
    label: 'Skincare',
    labelEn: 'Skincare',
    description: 'Qualité de peau, teint, texture, soins quotidiens',
    color: '#3B82F6',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1M21 12h1M4.22 19.778l.707-.707M18.364 5.636l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
      </svg>
    ),
  },
  {
    key: 'grooming',
    label: 'Grooming',
    labelEn: 'Grooming',
    description: 'Coupe, barbe, sourcils, hygiène et style facial',
    color: '#06B6D4',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
  },
  {
    key: 'fitness',
    label: 'Fitness / Jawline',
    labelEn: 'Fitness / Jawline',
    description: 'Mewing, posture, exercices faciaux, définition',
    color: '#10B981',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    key: 'style',
    label: 'Style',
    labelEn: 'Style',
    description: 'Vestimentaire, accessoires, cohérence visuelle',
    color: '#8B5CF6',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    key: 'aura',
    label: 'Aura',
    labelEn: 'Aura',
    description: 'Regard, charisme, présence, confiance en soi',
    color: '#F59E0B',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
]

interface FocusCardProps {
  config: FocusCardConfig
  score: number
  selected: boolean
  onToggle: (key: FocusDimension) => void
}

function scoreColor(score: number) {
  if (score >= 75) return '#10B981'
  if (score >= 50) return '#F59E0B'
  return '#EF4444'
}

function scoreBg(score: number) {
  if (score >= 75) return 'rgba(16,185,129,0.12)'
  if (score >= 50) return 'rgba(245,158,11,0.12)'
  return 'rgba(239,68,68,0.12)'
}

export default function FocusCard({ config, score, selected, onToggle }: FocusCardProps) {
  const isPriority = score < 60

  return (
    <button
      type="button"
      onClick={() => onToggle(config.key)}
      className="w-full text-left transition-all duration-200 rounded-2xl relative"
      style={{
        background: selected
          ? `linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(6,182,212,0.04) 100%)`
          : '#FFFFFF',
        border: selected
          ? '1.5px solid #3B82F6'
          : '1.5px solid rgba(59,130,246,0.12)',
        boxShadow: selected
          ? '0 0 0 3px rgba(59,130,246,0.12), inset 0 0 20px rgba(59,130,246,0.04)'
          : 'none',
        padding: '16px',
      }}
    >
      {/* Selected checkmark */}
      {selected && (
        <div
          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: '#06B6D4' }}
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Priority badge */}
      {isPriority && (
        <div
          className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#EF4444',
            display: selected ? 'none' : 'block',
          }}
        >
          Prioritaire
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: selected ? `${config.color}20` : 'rgba(59,130,246,0.08)',
            border: `1px solid ${selected ? config.color + '40' : 'rgba(59,130,246,0.15)'}`,
            color: selected ? config.color : '#64748B',
          }}
        >
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-sm font-semibold"
              style={{ color: selected ? '#0F172A' : '#64748B' }}
            >
              {config.label}
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
            {config.description}
          </p>
        </div>

        {/* Score badge */}
        <div
          className="shrink-0 text-xs font-bold px-2.5 py-1.5 rounded-lg"
          style={{
            background: scoreBg(score),
            color: scoreColor(score),
          }}
        >
          {score}/100
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(15,23,42,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${score}%`,
            background: selected
              ? `linear-gradient(90deg, ${config.color}, ${config.color}99)`
              : `linear-gradient(90deg, ${scoreColor(score)}, ${scoreColor(score)}99)`,
          }}
        />
      </div>
    </button>
  )
}
