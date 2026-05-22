'use client'

import { useTranslations } from 'next-intl'
import MotionReveal, { MotionStagger, MotionStaggerItem } from '@/components/landing/shared/MotionReveal'
import SectionHeader from '@/components/landing/shared/SectionHeader'

const ROUTINE_KEYS = ['skincare', 'grooming', 'fitness', 'aura'] as const
const ROUTINE_COLORS = ['#3B82F6', '#06B6D4', '#10B981', '#8B5CF6']

export default function MobileRoutineSection() {
  const t = useTranslations('landing.routine')

  return (
    <section id="routine" className="px-4 py-16">
      <div className="max-w-[375px] mx-auto">
        <MotionReveal>
          <SectionHeader label={t('label')} title={t('title')} subtitle={t('subtitle')} />
        </MotionReveal>

        <MotionStagger className="grid grid-cols-2 gap-3">
          {ROUTINE_KEYS.map((key, i) => (
            <MotionStaggerItem key={key}>
              <div className="rounded-2xl p-4 h-full glass-card">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base mb-3"
                  style={{
                    background: `${ROUTINE_COLORS[i]}12`,
                    border: `1px solid ${ROUTINE_COLORS[i]}25`,
                  }}
                >
                  {t(`icon_${key}`)}
                </div>
                <p className="text-sm font-semibold text-theme mb-0.5">{t(`card_${key}_title`)}</p>
                <p className="text-[10px] leading-relaxed text-muted">{t(`card_${key}_desc`)}</p>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  )
}
