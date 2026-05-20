'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const CheckIcon = () => (
  <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const CrossIcon = () => (
  <svg className="w-4 h-4 text-[#3D4F6E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

type PlanId = 'free' | 'monthly' | 'yearly'

export default function PricingSection() {
  const t = useTranslations('pricing')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const plans: {
    id: PlanId
    name: string
    price: string
    period: string
    desc: string
    cta: string
    ctaVariant: 'outline' | 'primary'
    featured: boolean
    badge?: string
    features: { label: string; included: boolean }[]
  }[] = [
    {
      id: 'free',
      name: t('free_name'),
      price: t('free_price'),
      period: '',
      desc: t('free_desc'),
      cta: t('cta_free'),
      ctaVariant: 'outline',
      featured: false,
      features: [
        { label: t('feat_global_score'), included: true },
        { label: t('feat_three_criteria'), included: true },
        { label: t('feat_full_routine'), included: false },
        { label: t('feat_unlimited_analysis'), included: false },
        { label: t('feat_ai_coach'), included: false },
      ],
    },
    {
      id: 'monthly',
      name: t('monthly_name'),
      price: t('monthly_price'),
      period: t('monthly_period'),
      desc: t('monthly_desc'),
      cta: t('cta_monthly'),
      ctaVariant: 'outline',
      featured: false,
      features: [
        { label: t('feat_unlock_all'), included: true },
        { label: t('feat_unlimited_analysis'), included: true },
        { label: t('feat_full_routine'), included: true },
        { label: t('feat_ai_coach'), included: true },
        { label: t('feat_history'), included: true },
      ],
    },
    {
      id: 'yearly',
      name: t('yearly_name'),
      price: t('yearly_price'),
      period: t('yearly_period'),
      desc: t('yearly_desc'),
      cta: t('cta_yearly'),
      ctaVariant: 'primary',
      featured: true,
      badge: t('save_badge'),
      features: [
        { label: t('feat_unlock_all'), included: true },
        { label: t('feat_unlimited_analysis'), included: true },
        { label: t('feat_full_routine'), included: true },
        { label: t('feat_ai_coach'), included: true },
        { label: t('feat_history'), included: true },
      ],
    },
  ]

  const handleCta = (id: PlanId) => {
    if (id === 'free') router.push(`${prefix}/analyze`)
    else router.push(`${prefix}/onboarding/routine-preview`)
  }

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl font-black text-[#EEF2FF] mb-4"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            {t('section_title')}
          </h2>
          <p className="text-[#8B9DC3] max-w-lg mx-auto text-sm">{t('section_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col gap-6 relative ${
                plan.featured ? 'border-2 border-blue-500/40' : 'border border-[rgba(59,130,246,0.12)]'
              }`}
              style={{
                background: plan.featured
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, #0D1321 100%)'
                  : '#0D1321',
              }}
            >
              {plan.featured && plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="primary">{plan.badge}</Badge>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-[#8B9DC3] mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span
                    className="text-3xl font-black text-[#EEF2FF]"
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                  >
                    {plan.price}
                  </span>
                  {plan.period ? <span className="text-sm text-[#3D4F6E]">{plan.period}</span> : null}
                </div>
                <p className="text-xs text-[#3D4F6E] mt-1">{plan.desc}</p>
              </div>

              <ul className="flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5">
                    {f.included ? <CheckIcon /> : <CrossIcon />}
                    <span className={`text-xs ${f.included ? 'text-[#8B9DC3]' : 'text-[#3D4F6E]'}`}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.ctaVariant}
                size="md"
                className="w-full"
                onClick={() => handleCta(plan.id)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
