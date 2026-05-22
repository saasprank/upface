'use client'

import { useTranslations } from 'next-intl'

export default function HeroBadgeTitle() {
  const t = useTranslations('landing.hero')

  return (
    <div className="mb-8 text-center">
      <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] px-4 py-2">
        <span
          className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#10B981]"
          aria-hidden
        />
        <span className="font-[Inter,sans-serif] text-[12px] tracking-[0.1em] text-[#8B9DC3]">
          {t('badge')}
        </span>
      </div>

      <h1 className="font-[Outfit,sans-serif] text-[clamp(52px,8vw,96px)] font-black uppercase leading-[0.92] tracking-[-0.02em]">
        <span className="block whitespace-nowrap text-white">{t('title_line1')}</span>
        <span className="block whitespace-nowrap bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
          {t('title_line2')}
        </span>
      </h1>

      <p className="mx-auto mt-5 max-w-[480px] font-[Inter,sans-serif] text-[16px] leading-relaxed text-[#8B9DC3]">
        {t('subtitle')}
      </p>
    </div>
  )
}
