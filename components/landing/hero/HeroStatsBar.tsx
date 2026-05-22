'use client'

import { useTranslations } from 'next-intl'

const STAT_KEYS = ['points', 'speed', 'accuracy', 'analyses'] as const

function StatIcon({ type }: { type: (typeof STAT_KEYS)[number] }) {
  if (type === 'points') {
    return (
      <svg className="mx-auto mb-3 h-5 w-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <circle cx="12" cy="8" r="3.5" />
        <path strokeLinecap="round" d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    )
  }
  if (type === 'speed') {
    return (
      <svg className="mx-auto mb-3 h-5 w-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L4.5 13.5H11L10 22l8.5-11.5H13V2z" />
      </svg>
    )
  }
  if (type === 'accuracy') {
    return (
      <svg className="mx-auto mb-3 h-5 w-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  return (
    <svg className="mx-auto mb-3 h-5 w-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="10" r="2.5" />
      <path strokeLinecap="round" d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5" />
    </svg>
  )
}

export default function HeroStatsBar() {
  const t = useTranslations('landing.hero')

  return (
    <div className="mb-8 w-full rounded-2xl border border-[#1E2A3E] bg-[#0D1321] p-5">
      <div className="grid grid-cols-4">
        {STAT_KEYS.map((key, i) => (
          <div
            key={key}
            className={`flex flex-col items-center justify-center px-2 text-center ${
              i < STAT_KEYS.length - 1 ? 'border-r border-[#1E2A3E]' : ''
            }`}
          >
            <StatIcon type={key} />
            <p className="font-[Outfit,sans-serif] text-[28px] font-bold leading-none text-white">
              {t(`stat_row_${key}_value`)}
            </p>
            <p className="mt-2 font-[Inter,sans-serif] text-[12px] text-[#8B9DC3]">
              {t(`stat_row_${key}_label`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
