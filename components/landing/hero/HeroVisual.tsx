'use client'

import { useTranslations } from 'next-intl'
import ProtectImageArea from '@/components/ui/ProtectImageArea'

const LEFT_METRICS = [
  { key: 'metric_symmetry' as const, value: 91, top: '30%' },
  { key: 'metric_proportions' as const, value: 87, top: '55%' },
  { key: 'metric_jawline' as const, value: 82, top: '75%' },
] as const

const SCORE_VALUE = 78
const SCORE_RING_R = 38
const SCORE_RING_C = 239
const SCORE_RING_OFFSET = 62

function MetricIcon({ index }: { index: number }) {
  const paths = [
    'M12 4c-4 2-6 6-6 10a6 6 0 0012 0c0-4-2-8-6-10z',
    'M6 18h12M9 6l3-3 3 3M9 18V9m6 9V9',
    'M5 14c2 4 12 4 14 0M8 10h8',
  ]
  return (
    <svg
      className="shrink-0 text-[#06B6D4]"
      width={13}
      height={13}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path strokeLinecap="round" d={paths[index]} />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width={10} height={10} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
}

export default function HeroVisual() {
  const t = useTranslations('landing.hero')

  return (
    <ProtectImageArea className="relative z-[1] mb-6 w-full overflow-visible pb-16 md:mb-10 md:pb-20">
      {/* ── Face visual container (edge-to-edge on mobile) ── */}
      <div
        className="relative z-[1] -ml-4 h-[580px] w-[100vw] overflow-visible md:mx-auto md:ml-0 md:h-[520px] md:w-full md:max-w-[700px]"
      >
        {/* Background glow behind face */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 30%, rgba(59,130,246,0.22) 0%, rgba(6,182,212,0.08) 50%, transparent 75%)',
          }}
          aria-hidden
        />

        {/* Face image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-face.png"
          alt={t('face_alt')}
          className="absolute left-0 top-0 z-[1] h-[580px] w-full object-cover object-top md:h-[520px]"
        />

        {/* Dot grid — right half */}
        <div
          className="pointer-events-none absolute right-0 top-0 z-[2] h-full w-1/2"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.55) 1.5px, transparent 1.5px)',
            backgroundSize: '22px 22px',
          }}
          aria-hidden
        />

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] h-[200px]"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, #080C14 100%)',
          }}
          aria-hidden
        />

        {/* Vertical split line */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-[4] w-[2px] -translate-x-1/2"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, #06B6D4 20%, #06B6D4 80%, transparent 100%)',
            boxShadow:
              '0 0 6px #06B6D4, 0 0 20px rgba(6,182,212,0.5), 0 0 40px rgba(6,182,212,0.25)',
          }}
          aria-hidden
        />

        {/* Holographic rings */}
        <div
          className="pointer-events-none absolute bottom-[-30px] left-1/2 z-[5] h-[120px] w-full -translate-x-1/2"
          aria-hidden
        >
          {/* Platform inner glow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[50%]"
            style={{
              width: '70vw',
              height: '30px',
              background: 'radial-gradient(ellipse, rgba(59,130,246,0.4) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />

          {/* Ring 3 — smallest */}
          <div
            className="absolute left-1/2 rounded-[50%] -translate-x-1/2"
            style={{
              bottom: '24px',
              width: '60vw',
              height: '46px',
              border: '1px solid rgba(59,130,246,0.25)',
            }}
          />

          {/* Ring 2 */}
          <div
            className="absolute left-1/2 rounded-[50%] -translate-x-1/2"
            style={{
              bottom: '18px',
              width: '85vw',
              height: '68px',
              border: '1px solid rgba(6,182,212,0.4)',
              boxShadow: '0 0 18px rgba(6,182,212,0.25)',
            }}
          />

          {/* Ring 1 — largest */}
          <div
            className="absolute left-1/2 rounded-[50%] -translate-x-1/2"
            style={{
              bottom: '10px',
              width: '110vw',
              height: '90px',
              border: '1px solid rgba(59,130,246,0.55)',
              boxShadow:
                '0 0 25px rgba(59,130,246,0.35), 0 0 60px rgba(59,130,246,0.15), inset 0 0 25px rgba(59,130,246,0.1)',
            }}
          />
        </div>

        {/* ── Metric cards (left) ── */}
        {LEFT_METRICS.map((m, i) => (
          <div
            key={m.key}
            className="absolute z-10 min-w-[130px] rounded-[14px] px-[14px] py-[10px]"
            style={{
              left: '12px',
              top: m.top,
              background: 'rgba(10,14,26,0.82)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(59,130,246,0.35)',
              boxShadow:
                '0 0 20px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div className="mb-1 flex items-center gap-1.5">
              <MetricIcon index={i} />
              <span
                className="font-[Inter,sans-serif] text-[9px] uppercase tracking-[0.14em] text-[#8B9DC3]"
              >
                {t(m.key)}
              </span>
            </div>
            <p
              className="my-0.5 font-[Outfit,sans-serif] text-[26px] font-bold leading-none text-white"
            >
              {m.value}%
            </p>
            <div
              className="mt-1.5 h-[3px] w-[70%] overflow-hidden rounded-[2px] bg-[#1E2A3E]"
            >
              <div
                className="h-full rounded-[2px]"
                style={{
                  width: `${m.value}%`,
                  background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
                  boxShadow: '0 0 8px rgba(59,130,246,0.7)',
                }}
              />
            </div>
          </div>
        ))}

        {/* ── Score card (right) ── */}
        <div
          className="absolute z-10 min-w-[145px] rounded-[18px] p-4 text-center"
          style={{
            right: '12px',
            top: '48%',
            transform: 'translateY(-50%)',
            background: 'rgba(10,14,26,0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(59,130,246,0.45)',
            boxShadow: '0 0 35px rgba(59,130,246,0.2), 0 0 80px rgba(59,130,246,0.08)',
          }}
        >
          <p className="mb-3 font-[Inter,sans-serif] text-[9px] uppercase tracking-[0.14em] text-[#8B9DC3]">
            {t('score_global')}
          </p>

          <div className="relative mx-auto mb-1 flex h-[90px] w-[90px] items-center justify-center">
            <svg
              className="absolute inset-0 h-[90px] w-[90px]"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <defs>
                <linearGradient id="heroScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r={SCORE_RING_R} fill="none" stroke="#1E2A3E" strokeWidth="6" />
              <circle
                cx="50"
                cy="50"
                r={SCORE_RING_R}
                fill="none"
                stroke="url(#heroScoreGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={SCORE_RING_C}
                strokeDashoffset={SCORE_RING_OFFSET}
                transform="rotate(-90 50 50)"
                style={{ filter: 'drop-shadow(0 0 6px #3B82F6)' }}
              />
            </svg>
            <div className="relative flex items-end justify-center gap-0.5">
              <span className="font-[Outfit,sans-serif] text-[24px] font-bold leading-none text-white">
                {SCORE_VALUE}
              </span>
              <span className="pb-0.5 font-[Inter,sans-serif] text-[10px] text-[#8B9DC3]">/100</span>
            </div>
          </div>

          <span
            className="mt-2.5 inline-flex items-center justify-center gap-1 rounded-full px-[14px] py-[5px] font-[Inter,sans-serif] text-[11px] font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
              boxShadow: '0 0 14px rgba(6,182,212,0.55)',
            }}
          >
            <StarIcon />
            {t('score_badge')}
          </span>
        </div>
      </div>
    </ProtectImageArea>
  )
}
