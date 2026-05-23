'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

type PlanId = 'free' | 'report' | 'pro'

interface PlanFeature {
  label: string
  included: boolean
}

interface PricingCardsGridProps {
  onPlanSelect?: (planId: PlanId) => void
  className?: string
}

const PLAN_ORDER: PlanId[] = ['free', 'report', 'pro']

const PLAN_FEATURE_KEYS: Record<PlanId, { key: string; included: boolean }[]> = {
  free: [
    { key: 'feat_score', included: true },
    { key: 'feat_three', included: true },
    { key: 'feat_single', included: true },
    { key: 'feat_full_analysis', included: false },
    { key: 'feat_routine', included: false },
    { key: 'feat_unlimited', included: false },
  ],
  report: [
    { key: 'feat_score', included: true },
    { key: 'feat_full_analysis', included: true },
    { key: 'feat_routine', included: true },
    { key: 'feat_pdf', included: true },
    { key: 'feat_unlimited', included: false },
    { key: 'feat_coach', included: false },
  ],
  pro: [
    { key: 'feat_score', included: true },
    { key: 'feat_full_analysis', included: true },
    { key: 'feat_routine', included: true },
    { key: 'feat_unlimited', included: true },
    { key: 'feat_coach', included: true },
    { key: 'feat_tracking', included: true },
  ],
}

function FeatureRow({ label, included }: PlanFeature) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={`mt-0.5 shrink-0 font-[Inter,sans-serif] text-[13px] font-semibold ${
          included ? 'text-[#3B82F6]' : 'text-[#3D4F6E]'
        }`}
        aria-hidden
      >
        {included ? '✓' : '–'}
      </span>
      <span
        className={`font-[Inter,sans-serif] text-[13px] leading-snug ${
          included ? 'text-[#8B9DC3]' : 'text-[#3D4F6E]'
        }`}
      >
        {label}
      </span>
    </li>
  )
}

export default function PricingCardsGrid({ onPlanSelect, className = '' }: PricingCardsGridProps) {
  const t = useTranslations('landing.pricing')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const getFeatures = (planId: PlanId): PlanFeature[] =>
    PLAN_FEATURE_KEYS[planId].map(({ key, included }) => ({
      label: t(key as 'feat_score'),
      included,
    }))

  const handleCta = (planId: PlanId) => {
    if (onPlanSelect) {
      onPlanSelect(planId)
      return
    }
    if (planId === 'free') router.push(`${prefix}/analyze`)
    else router.push(`${prefix}/checkout?plan=${planId}`)
  }

  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-3 ${className}`}>
      {PLAN_ORDER.map((planId) => {
        const featured = planId === 'report'
        return (
          <div
            key={planId}
            className={`relative flex flex-col rounded-2xl bg-[#0D1321] p-7 ${
              featured ? 'border-2 border-[#3B82F6]' : 'border border-[#1E2A3E]'
            }`}
            style={
              featured
                ? { boxShadow: '0 0 40px rgba(59,130,246,0.2)' }
                : undefined
            }
          >
            {featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#3B82F6] px-3 py-1 font-[Outfit,sans-serif] text-[11px] font-bold uppercase tracking-[0.08em] text-white">
                {t('popular')}
              </span>
            )}

            <p className="mb-3 font-[Inter,sans-serif] text-[11px] uppercase tracking-[0.12em] text-[#3D4F6E]">
              {t(`${planId}_name`)}
            </p>

            <div className="mb-1 flex items-baseline gap-1">
              <span className="font-[Outfit,sans-serif] text-[52px] font-black leading-none text-white">
                {t(`${planId}_price`)}
              </span>
            </div>

            <p className="mb-4 font-[Inter,sans-serif] text-[13px] text-[#8B9DC3]">
              {planId === 'free' ? t('free_period') : t(`${planId}_period`)}
            </p>

            <div className="mb-5 h-px bg-[#1E2A3E]" />

            <ul className="mb-8 flex flex-1 flex-col gap-[10px]">
              {getFeatures(planId).map((feat) => (
                <FeatureRow key={feat.label} {...feat} />
              ))}
            </ul>

            <button
              type="button"
              onClick={() => handleCta(planId)}
              className={`h-12 w-full rounded-full font-[Outfit,sans-serif] text-[13px] font-bold uppercase tracking-[0.06em] transition-opacity hover:opacity-90 ${
                featured ? 'text-white' : 'border border-[#1E2A3E] bg-transparent text-[#8B9DC3] hover:border-[#3B82F6] hover:text-white'
              }`}
              style={
                featured
                  ? {
                      background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                      boxShadow: '0 0 40px rgba(59,130,246,0.45), 0 0 80px rgba(6,182,212,0.2)',
                    }
                  : undefined
              }
            >
              {t(`${planId}_cta`)}
            </button>
          </div>
        )
      })}
    </div>
  )
}
