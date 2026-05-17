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

export default function PricingSection() {
  const t = useTranslations('pricing')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const plans = [
    {
      name: t('free_name'),
      price: t('free_price'),
      period: '',
      desc: t('free_desc'),
      cta: t('cta_free'),
      ctaVariant: 'outline' as const,
      featured: false,
      features: [
        { label: 'Score global', included: true },
        { label: '5 BreakdownBars', included: true },
        { label: '3 TraitCards', included: true },
        { label: 'Routine complète 30j', included: false },
        { label: 'Historique analyses', included: false },
        { label: 'Progression semaine/semaine', included: false },
      ],
    },
    {
      name: t('report_name'),
      price: t('report_price'),
      period: '',
      desc: t('report_desc'),
      cta: t('cta_report'),
      ctaVariant: 'outline' as const,
      featured: false,
      features: [
        { label: 'Score global', included: true },
        { label: '5 BreakdownBars', included: true },
        { label: '5 TraitCards débloquées', included: true },
        { label: 'Routine complète 30j', included: true },
        { label: 'Historique analyses', included: false },
        { label: 'Progression semaine/semaine', included: false },
      ],
    },
    {
      name: t('pro_name'),
      price: '9,99€',
      period: t('per_month'),
      desc: t('pro_desc'),
      cta: t('cta_pro'),
      ctaVariant: 'primary' as const,
      featured: true,
      badge: t('popular'),
      features: [
        { label: 'Score global', included: true },
        { label: '5 BreakdownBars', included: true },
        { label: '5 TraitCards débloquées', included: true },
        { label: 'Routine complète 30j', included: true },
        { label: 'Historique analyses illimité', included: true },
        { label: 'Progression semaine/semaine', included: true },
      ],
    },
  ]

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl font-black text-[#EEF2FF] mb-4"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            Tarifs simples et transparents
          </h2>
          <p className="text-[#8B9DC3] max-w-lg mx-auto text-sm">
            Commencez gratuitement. Débloquez votre rapport ou passez Pro pour un suivi illimité.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 flex flex-col gap-6 relative ${
                plan.featured
                  ? 'border-2 border-blue-500/40'
                  : 'border border-[rgba(59,130,246,0.12)]'
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
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-3xl font-black text-[#EEF2FF]"
                    style={{ fontFamily: 'Satoshi, sans-serif' }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && <span className="text-sm text-[#3D4F6E]">{plan.period}</span>}
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
                onClick={() => router.push(`${prefix}/checkout?plan=${plan.name.toLowerCase()}`)}
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
