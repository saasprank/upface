'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import MotionReveal, { MotionStagger, MotionStaggerItem } from '@/components/landing/shared/MotionReveal'
import SectionHeader from '@/components/landing/shared/SectionHeader'

type PlanId = 'free' | 'report' | 'pro'

export default function MobilePricingSection() {
  const t = useTranslations('landing.pricing')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`
  const [yearly, setYearly] = useState(false)

  const plans: { id: PlanId; featured?: boolean }[] = [
    { id: 'free' },
    { id: 'report', featured: true },
    { id: 'pro' },
  ]

  const handleCta = (id: PlanId) => {
    if (id === 'free') router.push(`${prefix}/analyze`)
    else router.push(`${prefix}/onboarding/routine-preview`)
  }

  return (
    <section id="pricing" className="px-4 py-16">
      <div className="max-w-[375px] mx-auto">
        <MotionReveal>
          <SectionHeader label={t('label')} title={t('title')} subtitle={t('subtitle')} />
        </MotionReveal>

        <MotionReveal delay={0.05}>
          <div
            className="flex items-center justify-center gap-1 p-1 rounded-xl mb-6 mx-auto w-fit"
            style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.12)' }}
          >
            {(['monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setYearly(period === 'yearly')}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: (yearly && period === 'yearly') || (!yearly && period === 'monthly') ? 'rgba(59,130,246,0.2)' : 'transparent',
                  color: (yearly && period === 'yearly') || (!yearly && period === 'monthly') ? '#EEF2FF' : '#3D4F6E',
                }}
              >
                {t(period)}
              </button>
            ))}
          </div>
        </MotionReveal>

        <MotionStagger className="space-y-4">
          {plans.map((plan) => (
            <MotionStaggerItem key={plan.id}>
              <div
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: plan.featured
                    ? 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, #0D1321 60%)'
                    : '#0D1321',
                  border: plan.featured ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(59,130,246,0.12)',
                  boxShadow: plan.featured ? '0 0 40px rgba(59,130,246,0.08)' : 'none',
                }}
              >
                {plan.featured && (
                  <span
                    className="absolute top-3 right-3 text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full text-cyan"
                    style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}
                  >
                    {t('popular')}
                  </span>
                )}

                <p className="text-xs text-[#8B9DC3] mb-1">{t(`${plan.id}_name`)}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-black text-[#EEF2FF]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    {t(`${plan.id}_price`)}
                  </span>
                  {plan.id !== 'free' && (
                    <span className="text-xs text-[#3D4F6E]">{t(`${plan.id}_period`)}</span>
                  )}
                </div>
                <p className="text-[11px] text-[#3D4F6E] mb-4">{t(`${plan.id}_desc`)}</p>

                <ul className="space-y-2 mb-5">
                  {(t.raw(`${plan.id}_features`) as string[]).map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-[#8B9DC3]">
                      <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleCta(plan.id)}
                  className="w-full h-11 rounded-xl text-sm font-semibold transition-transform active:scale-[0.98]"
                  style={
                    plan.featured
                      ? {
                          background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                          color: '#EEF2FF',
                          boxShadow: '0 0 24px rgba(59,130,246,0.25)',
                        }
                      : {
                          background: 'transparent',
                          color: '#8B9DC3',
                          border: '1px solid rgba(59,130,246,0.2)',
                        }
                  }
                >
                  {t(`${plan.id}_cta`)}
                </button>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  )
}
