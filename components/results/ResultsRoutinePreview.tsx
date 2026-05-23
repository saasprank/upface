'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface RoutineItem {
  category: string
  label: string
  blurred?: boolean
}

interface ResultsRoutinePreviewProps {
  items: RoutineItem[]
  isSubscribed: boolean
  prefix: string
}

export default function ResultsRoutinePreview({ items, isSubscribed, prefix }: ResultsRoutinePreviewProps) {
  const t = useTranslations('results')

  return (
    <section className="relative">
      <h2 className="mb-4 font-[Outfit,sans-serif] text-[20px] font-bold text-white">
        {t('routine_title')}
      </h2>

      <div className="relative">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={`${item.category}-${i}`}
              className={`rounded-xl border border-[#1E2A3E] bg-[#0D1321] p-5 ${item.blurred && !isSubscribed ? 'blur-[5px] select-none' : ''}`}
            >
              <span className="mb-2 block font-[Inter,sans-serif] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#3B82F6]">
                {item.category}
              </span>
              <p className="font-[Inter,sans-serif] text-[14px] leading-relaxed text-[#EEF2FF]">{item.label}</p>
            </div>
          ))}
        </div>

        {!isSubscribed && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl px-4"
            style={{
              background: 'linear-gradient(to bottom, rgba(8,12,20,0.2) 0%, rgba(8,12,20,0.92) 55%, rgba(8,12,20,0.98) 100%)',
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#1E2A3E] bg-[#0D1321]">
              <svg className="h-6 w-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <p className="max-w-sm text-center font-[Inter,sans-serif] text-[14px] text-[#8B9DC3]">
              {t('paywall_message')}
            </p>
            <Link
              href={`${prefix}/checkout?plan=pro`}
              className="inline-flex h-12 items-center justify-center rounded-full px-8 font-[Outfit,sans-serif] text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                boxShadow: '0 0 40px rgba(59,130,246,0.45), 0 0 80px rgba(6,182,212,0.2)',
              }}
            >
              {t('plan_pro')}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
