'use client'

import { useTranslations } from 'next-intl'
import ProtectImageArea from '@/components/ui/ProtectImageArea'

const MESH_LANDMARKS: [number, number][] = [
  [120, 72], [148, 92], [168, 118], [158, 148], [142, 168],
  [128, 188], [138, 212], [132, 232], [152, 228], [162, 198],
  [175, 162], [178, 128], [155, 108], [132, 118], [148, 142],
]

const MESH_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
  [0, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14],
  [1, 13], [2, 11], [3, 9], [4, 8],
]

const LEFT_METRICS = [
  { key: 'metric_symmetry' as const, value: 91, top: '22%', lineY: 95 },
  { key: 'metric_proportions' as const, value: 87, top: '40%', lineY: 145 },
  { key: 'metric_jawline' as const, value: 82, top: '58%', lineY: 195 },
] as const

function MetricIcon({ index }: { index: number }) {
  const paths = [
    'M12 4c-4 2-6 6-6 10a6 6 0 0012 0c0-4-2-8-6-10z',
    'M6 18h12M9 6l3-3 3 3M9 18V9m6 9V9',
    'M5 14c2 4 12 4 14 0M8 10h8',
  ]
  return (
    <svg className="w-3.5 h-3.5 shrink-0 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" d={paths[index]} />
    </svg>
  )
}

export default function HeroVisual() {
  const t = useTranslations('landing.hero')

  return (
    <ProtectImageArea className="relative mx-auto w-full max-w-[360px] h-[430px] sm:h-[450px]">
      <div
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.2)_0%,rgba(59,130,246,0.06)_45%,transparent_72%)] pointer-events-none"
        aria-hidden
      />

      {[240, 290, 340].map((size, i) => (
        <div
          key={size}
          className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#3B82F6]/15 pointer-events-none"
          style={{ width: size, height: size * 0.88, opacity: 0.12 + i * 0.06 }}
          aria-hidden
        />
      ))}

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" aria-hidden>
        {LEFT_METRICS.map((m, i) => (
          <line
            key={m.key}
            x1="108"
            y1={m.lineY}
            x2="155"
            y2={120 + i * 28}
            stroke="rgba(59,130,246,0.25)"
            strokeWidth="1"
          />
        ))}
      </svg>

      <div className="absolute inset-x-0 top-[6%] bottom-[16%] flex items-center justify-center">
        <div
          className="relative w-[228px] sm:w-[248px] h-[300px] sm:h-[320px] overflow-hidden rounded-[999px]"
          style={{
            maskImage: 'radial-gradient(ellipse 48% 52% at 50% 42%, black 58%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 48% 52% at 50% 42%, black 58%, transparent 100%)',
          }}
        >
          <div
            role="img"
            aria-label={t('face_alt')}
            className="absolute inset-0 bg-cover bg-top scale-[1.08] pointer-events-none"
            style={{ backgroundImage: 'url(/hero-face.png)' }}
          />

          <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 z-[3] bg-[#06B6D4] shadow-[0_0_12px_rgba(6,182,212,0.9),0_0_28px_rgba(6,182,212,0.45)] pointer-events-none" />

          <svg viewBox="0 0 240 280" className="absolute inset-0 w-full h-full pointer-events-none z-[2]" fill="none" aria-hidden>
            <defs>
              <clipPath id="heroFaceRightHalf">
                <rect x="120" y="0" width="120" height="280" />
              </clipPath>
            </defs>
            <g clipPath="url(#heroFaceRightHalf)">
              {MESH_CONNECTIONS.map(([a, b], i) => (
                <line
                  key={`mesh-${i}`}
                  x1={MESH_LANDMARKS[a][0]}
                  y1={MESH_LANDMARKS[a][1]}
                  x2={MESH_LANDMARKS[b][0]}
                  y2={MESH_LANDMARKS[b][1]}
                  stroke="rgba(255,255,255,0.38)"
                  strokeWidth="0.55"
                />
              ))}
              {MESH_LANDMARKS.map(([cx, cy], i) => (
                <circle key={`dot-${i}`} cx={cx} cy={cy} r="1.6" fill="rgba(255,255,255,0.9)" />
              ))}
            </g>
          </svg>

          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#080C14]/20 via-transparent to-[#080C14]/35 pointer-events-none" />
        </div>
      </div>

      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-full pointer-events-none" aria-hidden>
        {[230, 175, 120].map((w, i) => (
          <div
            key={w}
            className="absolute left-1/2 -translate-x-1/2 rounded-[999px] border border-[#3B82F6]/40 blur-[0.5px]"
            style={{
              bottom: `${i * 7}px`,
              width: w,
              height: w * 0.13,
              opacity: 0.28 - i * 0.07,
            }}
          />
        ))}
      </div>

      {LEFT_METRICS.map((m, i) => (
        <div
          key={m.key}
          className="absolute left-0 w-[112px] rounded-lg border border-[#1E2A3E] bg-[#0D1321] px-2.5 py-2 pointer-events-none"
          style={{ top: m.top }}
        >
          <div className="flex items-center gap-1.5 mb-1 min-w-0">
            <MetricIcon index={i} />
            <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-[#8B9DC3] truncate">
              {t(m.key)}
            </span>
          </div>
          <p className="font-mono text-sm font-bold text-white leading-none mb-1.5">{m.value}%</p>
          <div className="h-[3px] rounded-full bg-[#1E2A3E] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]"
              style={{ width: `${m.value}%` }}
            />
          </div>
        </div>
      ))}

      <div className="absolute right-0 top-[24%] w-[124px] sm:w-[132px] rounded-xl border border-[#3B82F6]/35 bg-[#0D1321] p-6 text-center shadow-[0_0_30px_rgba(59,130,246,0.22)] pointer-events-none">
        <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#8B9DC3] mb-3">
          {t('score_global')}
        </p>
        <div className="relative inline-flex items-end justify-center gap-0.5 mb-4">
          <div
            className="absolute -inset-3 rounded-full border-2 border-[#3B82F6]/40 shadow-[0_0_24px_rgba(59,130,246,0.3)]"
            aria-hidden
          />
          <span className="font-[Outfit,sans-serif] text-[52px] sm:text-[64px] font-bold text-white leading-none">
            78
          </span>
          <span className="text-[16px] sm:text-[20px] text-[#8B9DC3] font-medium pb-1">/100</span>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#06B6D4] font-mono text-[9px] tracking-[0.14em] uppercase font-semibold text-[#080C14]">
          ✦ {t('score_badge')}
        </span>
      </div>
    </ProtectImageArea>
  )
}
