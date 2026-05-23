'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { ProofStory } from '@/lib/proof-stories'

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
      <span className="text-xs text-muted w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-surface-2 overflow-hidden border border-[rgba(59,130,246,0.08)]">
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
    <article className="flex-shrink-0 w-[min(100%,320px)] snap-center rounded-2xl p-4 flex flex-col gap-4 glass-card">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-base font-bold text-theme truncate"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            {t(`${prefix}_name`)}
          </p>
          <p className="text-[11px] text-muted mt-0.5 leading-snug">{t(`${prefix}_meta`)}</p>
        </div>
        <span className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full text-muted bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.12)]">
          {t('weeks', { count: story.weeks })}
        </span>
      </header>

      <div className="flex items-center justify-center gap-2">
        <div className="flex-1 rounded-xl p-3 text-center bg-[rgba(8,12,20,0.8)] border border-[rgba(59,130,246,0.1)]">
          <p className="text-[9px] tracking-wider uppercase text-faint mb-1">{t('before')}</p>
          <p className="text-3xl font-black text-theme" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            {story.before}
          </p>
        </div>
        <span className="text-faint text-lg" aria-hidden="true">→</span>
        <div className="flex-1 rounded-xl p-3 text-center bg-[rgba(8,12,20,0.8)] border border-[rgba(16,185,129,0.15)]">
          <p className="text-[9px] tracking-wider uppercase text-faint mb-1">{t('after')}</p>
          <p className="text-3xl font-black" style={{ fontFamily: 'Satoshi, sans-serif', color: '#10B981' }}>
            {story.after}
          </p>
        </div>
      </div>

      <p
        className="text-center text-[11px] font-semibold py-1.5 px-3 rounded-full mx-auto"
        style={{
          color: '#10B981',
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
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

      <blockquote className="mt-auto pl-3 border-l-2 border-[#06B6D4] text-sm text-muted leading-relaxed italic">
        {t(`${prefix}_quote`)}
      </blockquote>
    </article>
  )
}
