'use client'

import { useTranslations } from 'next-intl'
import PricingCardsGrid from '@/components/pricing/PricingCardsGrid'

export default function MobilePricingSection() {
  const t = useTranslations('landing.pricing')

  return (
    <section id="pricing" className="relative overflow-hidden px-4 py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(59,130,246,0.12) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <h2 className="font-[Outfit,sans-serif] text-[clamp(36px,6vw,48px)] font-black uppercase leading-[0.92] tracking-[-0.02em]">
            <span className="bg-gradient-to-r from-white via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-[Inter,sans-serif] text-[16px] leading-relaxed text-[#8B9DC3]">
            {t('subtitle')}
          </p>
        </header>

        <PricingCardsGrid />
      </div>
    </section>
  )
}
