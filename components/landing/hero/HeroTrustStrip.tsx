'use client'

import { Fragment } from 'react'
import { useTranslations } from 'next-intl'

const TRUST_KEYS = ['trust_anonymous', 'trust_secure', 'trust_deleted'] as const

export default function HeroTrustStrip() {
  const t = useTranslations('landing.hero')

  return (
    <div className="w-full border-t border-[#1E2A3E] bg-[#080C14] py-4 mt-6">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 font-mono text-[10px] tracking-[0.1em] uppercase text-[#8B9DC3]">
        {TRUST_KEYS.map((key, i) => (
          <Fragment key={key}>
            {i > 0 && <span className="opacity-60" aria-hidden>·</span>}
            <span>{t(key)}</span>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
