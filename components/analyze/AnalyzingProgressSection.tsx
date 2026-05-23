'use client'

interface AnalyzingProgressSectionProps {
  progress: number
  message: string
}

const RING_SIZE = 120
const STROKE = 4
const RADIUS = (RING_SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function AnalyzingProgressSection({ progress, message }: AnalyzingProgressSectionProps) {
  const clamped = Math.min(Math.max(progress, 0), 100)

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col items-center">
      <div className="relative mb-5 flex h-[120px] w-[120px] items-center justify-center">
        <svg
          className="absolute inset-0 animate-[rotateBorder_2s_linear_infinite]"
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          aria-hidden
        >
          <defs>
            <linearGradient id="analyzingRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#1E2A3E"
            strokeWidth={STROKE}
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="url(#analyzingRingGrad)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE * 0.25} ${CIRCUMFERENCE * 0.75}`}
          />
        </svg>

        <span className="relative font-[Outfit,sans-serif] text-[36px] font-bold leading-none text-white">
          {Math.round(clamped)}%
        </span>
      </div>

      <div className="mb-6 flex h-5 items-center justify-center">
        <p key={message} className="animate-fade-in text-center font-[Inter,sans-serif] text-[14px] text-[#8B9DC3]">
          {message}
        </p>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-[2px] bg-[#1E2A3E]">
        <div
          className="h-full rounded-[2px]"
          style={{
            width: `${clamped}%`,
            background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
            transition: 'width 0.15s linear',
            boxShadow: '0 0 8px rgba(59,130,246,0.4)',
          }}
        />
      </div>
    </div>
  )
}
