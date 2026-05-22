'use client'

import { useTranslations } from 'next-intl'

const STAT_KEYS = ['points', 'speed', 'accuracy', 'analyses'] as const

function StatIcon({ type }: { type: (typeof STAT_KEYS)[number] }) {
  if (type === 'points') {
    return (
      <svg className="w-4 h-4 mx-auto mb-1.5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="12" cy="8" r="4" />
        <path strokeLinecap="round" d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    )
  }
  if (type === 'speed') {
    return <span className="block text-base leading-none mb-1 text-[#3B82F6]" aria-hidden>⚡</span>
  }
  if (type === 'accuracy') {
    return <span className="block text-base leading-none mb-1 text-[#3B82F6]" aria-hidden>◎</span>
  }
  return <span className="block text-sm leading-none mb-1 text-[#3B82F6]" aria-hidden>👥</span>
}

export default function HeroStatsBar() {
  const t = useTranslations('landing.hero')

  return (
    <div className="w-full overflow-hidden rounded-lg border-y border-[#1E2A3E] bg-[#0D1321]">
      <div className="grid grid-cols-4 divide-x divide-[#1E2A3E]">
        {STAT_KEYS.map((key) => (
          <div key={key} className="flex flex-col items-center justify-center px-1 py-3.5 text-center">
            <StatIcon type={key} />
            <p className="font-[Outfit,sans-serif] text-sm font-bold text-white leading-none mb-1">
              {t(`stat_row_${key}_value`)}
            </p>
            <p className="text-[9px] leading-tight text-[#8B9DC3]">{t(`stat_row_${key}_label`)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
