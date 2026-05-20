'use client'

import { useTranslations } from 'next-intl'
import MotionReveal from '@/components/landing/shared/MotionReveal'
import SectionHeader from '@/components/landing/shared/SectionHeader'

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4'] as const

export default function FaqSection() {
  const t = useTranslations('faq')

  return (
    <section id="faq" className="px-4 py-16 pb-8">
      <div className="max-w-[375px] mx-auto">
        <MotionReveal>
          <SectionHeader title={t('title')} />
        </MotionReveal>

        <div className="space-y-3">
          {FAQ_KEYS.map((key, i) => (
            <MotionReveal key={key} delay={i * 0.05}>
              <details
                className="rounded-2xl overflow-hidden group [&_summary::-webkit-details-marker]:hidden"
                style={{
                  background: '#0D1321',
                  border: '1px solid rgba(59,130,246,0.1)',
                }}
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <span className="text-sm font-semibold text-[#EEF2FF] pr-4 leading-snug">
                    {t(`${key}_question`)}
                  </span>
                  <span className="text-cyan flex-shrink-0 text-lg transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-sm leading-relaxed text-[#8B9DC3]">{t(`${key}_answer`)}</p>
                </div>
              </details>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
