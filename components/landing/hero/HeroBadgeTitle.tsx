'use client'

import { useTranslations } from 'next-intl'

export default function HeroBadgeTitle() {
  const t = useTranslations('landing.hero')

  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#1E2A3E] bg-[#0D1321]/80 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] shadow-[0_0_10px_rgba(6,182,212,0.75)] animate-pulse" aria-hidden />
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#8B9DC3]">
          {t('badge')}
        </span>
      </div>

      <h1 className="font-[Outfit,sans-serif] font-black uppercase leading-[0.92] tracking-[-0.02em] text-[clamp(48px,6vw,80px)] whitespace-nowrap">
        <span className="block text-white">{t('title_line1')}</span>
        <span className="block bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
          {t('title_line2')}
        </span>
      </h1>

      <p className="mt-5 mx-auto max-w-[500px] px-1 text-[15px] leading-relaxed text-[#8B9DC3] font-[Work_Sans,Inter,sans-serif]">
        {t('subtitle')}
      </p>
    </div>
  )
}
