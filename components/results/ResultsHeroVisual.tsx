'use client'

import { useEffect, useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import ProtectImageArea from '@/components/ui/ProtectImageArea'

interface ResultsHeroVisualProps {
  globalScore: number
  symetrie: number
  proportions: number
  structure: number
  tier: string
}

const LEFT_METRICS = [
  { key: 'metric_symmetry' as const, scoreKey: 'symetrie' as const, top: '18%' },
  { key: 'metric_proportions' as const, scoreKey: 'proportions' as const, top: '44%' },
  { key: 'metric_jawline' as const, scoreKey: 'structure' as const, top: '70%' },
] as const

const TIER_LABELS: Record<string, string> = {
  elite: 'ELITE',
  attractive: 'ATTRACTIF',
  average: 'MOYEN',
  below: 'BAS',
}

function MetricIcon({ index }: { index: number }) {
  const paths = [
    'M12 4c-4 2-6 6-6 10a6 6 0 0012 0c0-4-2-8-6-10z',
    'M6 18h12M9 6l3-3 3 3M9 18V9m6 9V9',
    'M5 14c2 4 12 4 14 0M8 10h8',
  ]
  return (
    <svg className="h-[14px] w-[14px] shrink-0 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" d={paths[index]} />
    </svg>
  )
}

export default function ResultsHeroVisual({
  globalScore,
  symetrie,
  proportions,
  structure,
  tier,
}: ResultsHeroVisualProps) {
  const t = useTranslations('landing.hero')
  const gradId = useId().replace(/:/g, '')
  const [displayScore, setDisplayScore] = useState(0)

  const scores: Record<string, number> = { symetrie, proportions, structure }
  const ringR = 70
  const ringSize = 160
  const cx = ringSize / 2
  const circumference = 2 * Math.PI * ringR
  const dashOffset = circumference - (displayScore / 100) * circumference

  useEffect(() => {
    const start = performance.now()
    const duration = 1400
    const frame = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplayScore(Math.round(eased * globalScore))
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [globalScore])

  return (
    <ProtectImageArea className="relative mx-auto mb-4 w-full max-w-[700px] min-h-[480px] pb-16 sm:min-h-[520px] sm:pb-20">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 40%, rgba(59,130,246,0.18) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative z-[1] h-[min(360px,42vh)] w-full overflow-hidden sm:h-[480px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-face.png"
          alt={t('face_alt')}
          className="mx-auto h-full w-full object-cover object-[center_15%]"
        />

        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 z-[3] w-[2px] -translate-x-1/2"
          style={{
            background: 'linear-gradient(to bottom, transparent, #06B6D4, transparent)',
            boxShadow: '0 0 12px #06B6D4, 0 0 24px rgba(6,182,212,0.5)',
          }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.6) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
            clipPath: 'inset(0 0 0 50%)',
            WebkitClipPath: 'inset(0 0 0 50%)',
          }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-transparent to-[#080C14]/60"
          aria-hidden
        />
      </div>

      <div
        className="pointer-events-none absolute left-1/2 z-[1] -translate-x-1/2"
        style={{ bottom: '-40px' }}
        aria-hidden
      >
        {[
          { w: 520, h: 104, opacity: 1 },
          { w: 400, h: 78, opacity: 0.6 },
          { w: 280, h: 54, opacity: 0.3 },
        ].map((ring) => (
          <div
            key={ring.w}
            className="absolute left-1/2 -translate-x-1/2 rounded-[50%] border border-[rgba(59,130,246,0.4)] blur-[2px]"
            style={{ bottom: 0, width: ring.w, height: ring.h, opacity: ring.opacity }}
          />
        ))}
      </div>

      {LEFT_METRICS.map((m, i) => (
        <div
          key={m.key}
          className="absolute left-0 z-10 rounded-xl border border-[#1E2A3E] bg-[#0D1321] px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3"
          style={{ top: m.top }}
        >
          <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
            <MetricIcon index={i} />
            <span className="font-[Inter,sans-serif] text-[9px] uppercase tracking-[0.12em] text-[#8B9DC3] sm:text-[10px]">
              {t(m.key)}
            </span>
          </div>
          <p className="mb-1.5 font-[Outfit,sans-serif] text-[18px] font-bold leading-none text-white sm:mb-2 sm:text-[22px]">
            {scores[m.scoreKey]}%
          </p>
          <div className="h-[3px] overflow-hidden rounded-[2px] bg-[#1E2A3E]">
            <div className="h-full rounded-[2px] bg-[#3B82F6]" style={{ width: `${scores[m.scoreKey]}%` }} />
          </div>
        </div>
      ))}

      <div className="absolute right-0 top-[24%] z-10 w-[200px] rounded-2xl border border-[#1E2A3E] bg-[#0D1321] p-5 text-center">
        <p className="mb-3 font-[Inter,sans-serif] text-[10px] uppercase tracking-[0.12em] text-[#8B9DC3]">
          {t('score_global')}
        </p>

        <div className="relative mx-auto mb-3 flex h-[160px] w-[160px] items-center justify-center">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox={`0 0 ${ringSize} ${ringSize}`} aria-hidden>
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <circle cx={cx} cy={cx} r={ringR} fill="none" stroke="#1E2A3E" strokeWidth="4" />
            <circle
              cx={cx}
              cy={cx}
              r={ringR}
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="relative flex items-end justify-center gap-0.5">
            <span className="font-[Outfit,sans-serif] text-[72px] font-black leading-none text-white">
              {displayScore}
            </span>
            <span className="pb-2 font-[Inter,sans-serif] text-[14px] text-[#8B9DC3]">/100</span>
          </div>
        </div>

        <span className="inline-flex items-center rounded-full bg-[#06B6D4] px-[14px] py-1 font-[Inter,sans-serif] text-[11px] font-bold text-white">
          ✦ {TIER_LABELS[tier] ?? 'MOYEN'}
        </span>
      </div>
    </ProtectImageArea>
  )
}
