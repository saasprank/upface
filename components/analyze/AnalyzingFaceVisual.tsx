'use client'

import { useTranslations } from 'next-intl'
import ProtectImageArea from '@/components/ui/ProtectImageArea'

const LEFT_METRICS = [
  { key: 'metric_symmetry' as const, value: 91, top: '18%' },
  { key: 'metric_proportions' as const, value: 87, top: '44%' },
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

export default function AnalyzingFaceVisual() {
  const t = useTranslations('landing.hero')

  return (
    <ProtectImageArea className="relative mx-auto w-full max-w-[560px]">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 40%, rgba(59,130,246,0.18) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative z-[1] h-[min(360px,42vh)] w-full overflow-hidden sm:h-[420px]">
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
        style={{ bottom: '-48px' }}
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 280,
            height: 100,
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.2), transparent)',
          }}
        />
        {[
          { w: 480, h: 96, opacity: 1 },
          { w: 380, h: 72, opacity: 0.6 },
          { w: 280, h: 52, opacity: 0.3 },
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
          className="animate-fade-in-left absolute left-0 z-10 rounded-xl border border-[#1E2A3E] bg-[#0D1321] px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3"
          style={{ top: m.top, animationDelay: `${i * 0.5}s` }}
        >
          <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
            <MetricIcon index={i} />
            <span className="font-[Inter,sans-serif] text-[9px] uppercase tracking-[0.12em] text-[#8B9DC3] sm:text-[10px]">
              {t(m.key)}
            </span>
          </div>
          <p className="mb-1.5 font-[Outfit,sans-serif] text-[18px] font-bold leading-none text-white sm:mb-2 sm:text-[22px]">
            {m.value}%
          </p>
          <div className="h-[3px] overflow-hidden rounded-[2px] bg-[#1E2A3E]">
            <div className="h-full rounded-[2px] bg-[#3B82F6]" style={{ width: `${m.value}%` }} />
          </div>
        </div>
      ))}
    </ProtectImageArea>
  )
}
