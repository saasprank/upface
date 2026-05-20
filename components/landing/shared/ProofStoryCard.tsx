'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { ProofStory } from '@/lib/proof-stories'

const CARD_STYLE = {
  background: '#0D1321',
  border: '1px solid rgba(59,130,246,0.12)',
} as const

const SCORE_BOX_STYLE = {
  background: '#080C14',
  border: '1px solid rgba(59,130,246,0.08)',
} as const

interface ProofStoryCardProps {
  story: ProofStory
}

function ProofMetricRow({
  label,
  delta,
  fill,
}: {
  label: string
  delta: number
  fill: number
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#8B9DC3] w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-[#111827] overflow-hidden border border-[rgba(59,130,246,0.06)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #059669, #10B981)' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${fill}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span
        className="text-xs font-semibold w-8 text-right flex-shrink-0"
        style={{ color: '#10B981', fontFamily: 'var(--font-mono)' }}
      >
        +{delta}
      </span>
    </div>
  )
}

export default function ProofStoryCard({ story }: ProofStoryCardProps) {
  const t = useTranslations('landing.proof')
  const prefix = story.id

  return (
    <article
      className="flex-shrink-0 w-[min(100%,320px)] snap-center rounded-2xl p-4 flex flex-col gap-4"
      style={CARD_STYLE}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-base font-bold text-[#EEF2FF] truncate"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            {t(`${prefix}_name`)}
          </p>
          <p className="text-[11px] text-[#8B9DC3] mt-0.5 leading-snug">{t(`${prefix}_meta`)}</p>
        </div>
        <span
          className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full text-[#8B9DC3]"
          style={{
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.12)',
          }}
        >
          {t('weeks', { count: story.weeks })}
        </span>
      </header>

      <div className="flex items-center justify-center gap-2">
        <div className="flex-1 rounded-xl p-3 text-center" style={SCORE_BOX_STYLE}>
          <p className="text-[9px] tracking-wider uppercase text-[#3D4F6E] mb-1">{t('before')}</p>
          <p className="text-3xl font-black text-[#EEF2FF]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            {story.before}
          </p>
        </div>
        <span className="text-[#3D4F6E] text-lg" aria-hidden="true">
          →
        </span>
        <div className="flex-1 rounded-xl p-3 text-center" style={SCORE_BOX_STYLE}>
          <p className="text-[9px] tracking-wider uppercase text-[#3D4F6E] mb-1">{t('after')}</p>
          <p className="text-3xl font-black" style={{ fontFamily: 'Satoshi, sans-serif', color: '#10B981' }}>
            {story.after}
          </p>
        </div>
      </div>

      <p
        className="text-center text-[11px] font-semibold py-1.5 px-3 rounded-full mx-auto"
        style={{
          color: '#10B981',
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.25)',
        }}
      >
        {t('gain_badge', { delta: story.delta, percentile: story.percentile })}
      </p>

      <div className="space-y-2.5">
        {story.metrics.map((m) => (
          <ProofMetricRow
            key={m.labelKey}
            label={t(m.labelKey)}
            delta={m.delta}
            fill={m.fill}
          />
        ))}
      </div>

      <blockquote
        className="mt-auto pl-3 border-l-2 text-sm text-[#8B9DC3] leading-relaxed italic"
        style={{ borderColor: '#06B6D4' }}
      >
        {t(`${prefix}_quote`)}
      </blockquote>
    </article>
  )
}
