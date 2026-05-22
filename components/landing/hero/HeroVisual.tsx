'use client'

import { useTranslations } from 'next-intl'
import ProtectImageArea from '@/components/ui/ProtectImageArea'

const LEFT_METRICS = [
  { key: 'metric_symmetry' as const, value: 91, top: '20%' },
  { key: 'metric_proportions' as const, value: 87, top: '45%' },
  { key: 'metric_jawline' as const, value: 82, top: '70%' },
] as const

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

export default function HeroVisual() {
  const t = useTranslations('landing.hero')

  return (
    <ProtectImageArea className="relative mx-auto mb-10 min-h-[520px] w-full max-w-[700px] pb-20">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 40%, rgba(59,130,246,0.18) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative z-[1] h-[520px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-face.png"
          alt={t('face_alt')}
          className="mx-auto h-[520px] w-full object-cover object-[center_15%]"
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
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-transparent to-[#080C14]/50"
          aria-hidden
        />
      </div>

      <div
        className="pointer-events-none absolute left-1/2 z-[1] -translate-x-1/2"
        style={{ bottom: '-60px' }}
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 340,
            height: 120,
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.2), transparent)',
          }}
        />
        {[
          { w: 600, h: 120, opacity: 1 },
          { w: 480, h: 90, opacity: 0.6 },
          { w: 340, h: 60, opacity: 0.3 },
        ].map((ring) => (
          <div
            key={ring.w}
            className="absolute left-1/2 -translate-x-1/2 rounded-[50%] border border-[rgba(59,130,246,0.4)] blur-[2px]"
            style={{
              bottom: 0,
              width: ring.w,
              height: ring.h,
              opacity: ring.opacity,
            }}
          />
        ))}
      </div>

      {LEFT_METRICS.map((m, i) => (
        <div
          key={m.key}
          className="absolute left-0 z-10 rounded-xl border border-[#1E2A3E] bg-[#0D1321] px-4 py-3 backdrop-blur-sm"
          style={{ top: m.top }}
        >
          <div className="mb-2 flex items-center gap-2">
            <MetricIcon index={i} />
            <span className="font-[Inter,sans-serif] text-[10px] uppercase tracking-[0.12em] text-[#8B9DC3]">
              {t(m.key)}
            </span>
          </div>
          <p className="mb-2 font-[Outfit,sans-serif] text-[22px] font-bold leading-none text-white">
            {m.value}%
          </p>
          <div className="h-[3px] overflow-hidden rounded-[2px] bg-[#1E2A3E]">
            <div className="h-full rounded-[2px] bg-[#3B82F6]" style={{ width: `${m.value}%` }} />
          </div>
        </div>
      ))}

      <div className="absolute right-0 top-[30%] z-10 min-w-[160px] rounded-2xl border border-[#1E2A3E] bg-[#0D1321] p-5 text-center">
        <p className="mb-4 font-[Inter,sans-serif] text-[10px] uppercase tracking-[0.12em] text-[#8B9DC3]">
          {t('score_global')}
        </p>

        <div className="relative mx-auto mb-3 flex h-[110px] w-[110px] items-center justify-center">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 110 110" aria-hidden>
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <circle cx="55" cy="55" r="45" fill="none" stroke="#1E2A3E" strokeWidth="6" />
            <circle
              cx="55"
              cy="55"
              r="45"
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset="74"
            />
          </svg>
          <div className="relative flex items-end justify-center gap-0.5">
            <span className="font-[Outfit,sans-serif] text-[48px] font-bold leading-none text-white">78</span>
            <span className="pb-1 font-[Inter,sans-serif] text-[14px] text-[#8B9DC3]">/100</span>
          </div>
        </div>

        <span className="mt-3 inline-flex items-center rounded-full bg-[#06B6D4] px-[14px] py-1 font-[Inter,sans-serif] text-[11px] font-bold text-white">
          ✦ {t('score_badge')}
        </span>
      </div>
    </ProtectImageArea>
  )
}
