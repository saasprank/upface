'use client'

import { useTranslations } from 'next-intl'

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4'] as const

export default function FaqSection() {
  const t = useTranslations('faq')

  return (
    <section id="faq" className="px-4 py-16 sm:py-24" style={{ background: '#0D1321' }}>
      <h2
        className="text-2xl font-bold text-white text-center mb-8"
        style={{ fontFamily: 'Satoshi, sans-serif' }}
      >
        {t('title')}
      </h2>
      <div className="max-w-2xl mx-auto space-y-3">
        {FAQ_KEYS.map((key) => (
          <details
            key={key}
            className="rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            style={{ background: '#080C14', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
              <span className="text-sm font-semibold text-white pr-4">{t(`${key}_question`)}</span>
              <span className="text-blue-400 flex-shrink-0 text-lg">+</span>
            </summary>
            <div className="px-4 pb-4">
              <p className="text-sm leading-relaxed" style={{ color: '#8B9DC3' }}>{t(`${key}_answer`)}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
