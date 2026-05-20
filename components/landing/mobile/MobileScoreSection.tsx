'use client'

import { useTranslations } from 'next-intl'
import ScoreRing from '@/components/ui/ScoreRing'
import MotionReveal from '@/components/landing/shared/MotionReveal'
import SectionHeader from '@/components/landing/shared/SectionHeader'
import MetricBar from '@/components/landing/shared/MetricBar'

const METRICS = [
  { key: 'symmetry', value: 91 },
  { key: 'proportions', value: 87 },
  { key: 'structure', value: 82 },
  { key: 'skin', value: 76 },
  { key: 'grooming', value: 79 },
  { key: 'aura', value: 84 },
] as const

export default function MobileScoreSection() {
  const t = useTranslations('landing.score')

  return (
    <section id="score-preview" className="px-4 py-16">
      <div className="max-w-[375px] mx-auto">
        <MotionReveal>
          <SectionHeader label={t('label')} title={t('title')} subtitle={t('subtitle')} />
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <div
            className="rounded-2xl p-6 mb-4"
            style={{
              background: '#0D1321',
              border: '1px solid rgba(59,130,246,0.12)',
            }}
          >
            <div className="flex justify-center mb-5">
              <ScoreRing score={78} size={160} animate />
            </div>

            <div
              className="text-center px-4 py-2 rounded-xl mb-6 mx-auto w-fit"
              style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
              }}
            >
              <span className="text-sm font-semibold text-emerald-400">{t('badge')}</span>
              <span className="text-xs text-[#3D4F6E] ml-2">{t('percentile')}</span>
            </div>

            <div className="space-y-4">
              {METRICS.map((m, i) => (
                <MetricBar key={m.key} label={t(`metric_${m.key}`)} value={m.value} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.2}>
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: '#111827',
              border: '1px solid rgba(59,130,246,0.1)',
            }}
          >
            <div className="blur-sm pointer-events-none select-none opacity-60 space-y-2">
              <p className="text-sm font-semibold text-[#EEF2FF]">{t('locked_title')}</p>
              <p className="text-xs text-[#8B9DC3]">{t('locked_desc')}</p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[rgba(8,12,20,0.5)] backdrop-blur-[2px]">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-[#8B9DC3]">{t('locked_cta')}</p>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
