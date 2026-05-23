'use client'

import { useTranslations } from 'next-intl'
import ProtectImageArea from '@/components/ui/ProtectImageArea'

const LEFT_METRICS = [
  { key: 'metric_symmetry' as const, value: 91, top: '18%' },
  { key: 'metric_proportions' as const, value: 87, top: '44%' },
  { key: 'metric_jawline' as const, value: 82, top: '68%' },
] as const

function MetricIcon({ index }: { index: number }) {
  const paths = [
    'M12 4c-4 2-6 6-6 10a6 6 0 0012 0c0-4-2-8-6-10z',
    'M6 18h12M9 6l3-3 3 3M9 18V9m6 9V9',
    'M5 14c2 4 12 4 14 0M8 10h8',
  ]
  return (
    <svg className="h-[14px] w-[14px] shrink-0 text-[#06B6D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" d={paths[index]} />
    </svg>
  )
}

export default function HeroVisual() {
  const t = useTranslations('landing.hero')

  return (
    <ProtectImageArea className="relative mx-auto mb-10 w-full max-w-[700px] overflow-visible pb-28 md:min-h-[520px] md:pb-20">
      <div className="relative overflow-visible">
        {/* Radial glow behind face */}
        <div
          className="pointer-events-none absolute inset-0 z-0 min-h-[480px] md:min-h-[520px]"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,130,246,0.25) 0%, rgba(6,182,212,0.1) 40%, transparent 70%)',
          }}
          aria-hidden
        />

        {/* Face image */}
        <div className="relative z-[1] min-h-[480px] w-full overflow-hidden md:h-[520px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-face.png"
            alt={t('face_alt')}
            className="mx-auto min-h-[480px] h-full w-full object-cover object-[center_15%] md:h-[520px]"
          />

          {/* Vertical split line */}
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 z-[3] w-[2px] -translate-x-1/2"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, #06B6D4 30%, #06B6D4 70%, transparent 100%)',
              boxShadow:
                '0 0 8px #06B6D4, 0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.2)',
            }}
            aria-hidden
          />

          {/* Wireframe mesh overlay */}
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

          {/* Bottom vignette */}
          <div
            className="pointer-events-none absolute bottom-0 z-[2] h-[200px] w-full"
            style={{
              background: 'linear-gradient(to bottom, transparent 60%, #080C14 100%)',
            }}
            aria-hidden
          />
        </div>

        {/* Holographic rings */}
        <div className="pointer-events-none relative z-[1] h-[80px] overflow-visible md:hidden" aria-hidden>
          <div
            className="absolute bottom-[-5px] left-1/2 h-[40px] w-[80%] -translate-x-1/2"
            style={{
              background: 'radial-gradient(ellipse, rgba(59,130,246,0.3) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-[-20px] left-[-5%] h-[80px] w-[110%] rounded-[50%]"
            style={{
              border: '1px solid rgba(59,130,246,0.5)',
              boxShadow:
                '0 0 20px rgba(59,130,246,0.3), inset 0 0 20px rgba(59,130,246,0.1)',
            }}
          />
          <div
            className="absolute bottom-[-10px] left-[7.5%] h-[60px] w-[85%] rounded-[50%]"
            style={{
              border: '1px solid rgba(6,182,212,0.35)',
              boxShadow: '0 0 15px rgba(6,182,212,0.2)',
            }}
          />
          <div
            className="absolute bottom-0 left-[20%] h-[40px] w-[60%] rounded-[50%]"
            style={{
              border: '1px solid rgba(59,130,246,0.2)',
            }}
          />
        </div>

        {/* Desktop rings */}
        <div
          className="pointer-events-none absolute left-1/2 z-[1] hidden -translate-x-1/2 md:block"
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
      </div>

      {/* Metric cards */}
      {LEFT_METRICS.map((m, i) => (
        <div
          key={m.key}
          className="absolute left-0 z-10 max-w-[46%] rounded-[14px] px-4 py-3 backdrop-blur-[12px] sm:max-w-none md:px-4 md:py-3"
          style={{
            top: m.top,
            background: 'rgba(13,19,33,0.85)',
            border: '1px solid rgba(59,130,246,0.3)',
            boxShadow:
              '0 0 20px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="mb-1.5 flex items-center gap-2 md:mb-2">
            <MetricIcon index={i} />
            <span className="font-[Inter,sans-serif] text-[10px] uppercase tracking-[0.15em] text-[#8B9DC3]">
              {t(m.key)}
            </span>
          </div>
          <p className="mb-1.5 font-[Outfit,sans-serif] text-[28px] font-bold leading-none text-white md:mb-2">
            {m.value}%
          </p>
          <div className="h-[3px] overflow-hidden rounded-[2px] bg-[#1E2A3E]">
            <div
              className="h-full rounded-[2px]"
              style={{
                width: `${m.value}%`,
                background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
                boxShadow: '0 0 8px rgba(59,130,246,0.6)',
              }}
            />
          </div>
        </div>
      ))}

      {/* Score card */}
      <div
        className="absolute right-0 top-[28%] z-10 min-w-[130px] rounded-2xl p-4 text-center backdrop-blur-[16px] sm:min-w-[160px] md:top-[30%] md:p-5"
        style={{
          background: 'rgba(13,19,33,0.9)',
          border: '1px solid rgba(59,130,246,0.4)',
          boxShadow: '0 0 30px rgba(59,130,246,0.2)',
        }}
      >
        <p className="mb-3 font-[Inter,sans-serif] text-[10px] uppercase tracking-[0.12em] text-[#8B9DC3] md:mb-4">
          {t('score_global')}
        </p>

        <div className="relative mx-auto mb-3 flex h-[96px] w-[96px] items-center justify-center md:h-[110px] md:w-[110px]">
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 110 110"
            aria-hidden
            style={{ filter: 'drop-shadow(0 0 8px #3B82F6)' }}
          >
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
            <span className="font-[Outfit,sans-serif] text-[40px] font-bold leading-none text-white md:text-[48px]">78</span>
            <span className="pb-1 font-[Inter,sans-serif] text-[12px] text-[#8B9DC3] md:text-[14px]">/100</span>
          </div>
        </div>

        <span
          className="mt-2 inline-flex items-center rounded-full px-[14px] py-1 font-[Inter,sans-serif] text-[11px] font-bold text-white md:mt-3"
          style={{
            background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
            boxShadow: '0 0 16px rgba(6,182,212,0.5)',
          }}
        >
          ✦ {t('score_badge')}
        </span>
      </div>
    </ProtectImageArea>
  )
}
