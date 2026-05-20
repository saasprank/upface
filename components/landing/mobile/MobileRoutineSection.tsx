'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import MotionReveal, { MotionStagger, MotionStaggerItem } from '@/components/landing/shared/MotionReveal'
import SectionHeader from '@/components/landing/shared/SectionHeader'

const ROUTINE_KEYS = ['skincare', 'grooming', 'fitness', 'aura'] as const
const ROUTINE_COLORS = ['#3B82F6', '#06B6D4', '#10B981', '#8B5CF6']

export default function MobileRoutineSection() {
  const t = useTranslations('landing.routine')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  return (
    <section id="routine" className="px-4 py-16" style={{ background: '#0D1321' }}>
      <div className="max-w-[375px] mx-auto">
        <MotionReveal>
          <SectionHeader label={t('label')} title={t('title')} subtitle={t('subtitle')} />
        </MotionReveal>

        <MotionStagger className="grid grid-cols-2 gap-3 mb-6">
          {ROUTINE_KEYS.map((key, i) => {
            const locked = i >= 2
            return (
              <MotionStaggerItem key={key}>
                <div
                  className="rounded-2xl p-4 h-full relative overflow-hidden"
                  style={{
                    background: 'rgba(8,12,20,0.8)',
                    border: '1px solid rgba(59,130,246,0.12)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base mb-3"
                    style={{
                      background: `${ROUTINE_COLORS[i]}15`,
                      border: `1px solid ${ROUTINE_COLORS[i]}30`,
                    }}
                  >
                    {t(`icon_${key}`)}
                  </div>
                  <p className="text-sm font-semibold text-[#EEF2FF] mb-0.5">{t(`card_${key}_title`)}</p>
                  <p className={`text-[10px] leading-relaxed ${locked ? 'blur-[3px] select-none' : 'text-[#8B9DC3]'}`}>
                    {t(`card_${key}_desc`)}
                  </p>
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(8,12,20,0.45)] backdrop-blur-[1px]">
                      <svg className="w-4 h-4 text-[#3D4F6E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                </div>
              </MotionStaggerItem>
            )
          })}
        </MotionStagger>

        <MotionReveal delay={0.15}>
          <button
            type="button"
            onClick={() => router.push(`${prefix}/onboarding/routine-preview`)}
            className="w-full h-12 rounded-2xl font-semibold text-sm text-[#EEF2FF]"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.15))',
              border: '1px solid rgba(59,130,246,0.25)',
            }}
          >
            {t('unlock_cta')}
          </button>
        </MotionReveal>
      </div>
    </section>
  )
}
