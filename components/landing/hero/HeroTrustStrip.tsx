'use client'

import { Fragment } from 'react'
import { useTranslations } from 'next-intl'

const TRUST_KEYS = ['trust_anonymous', 'trust_secure', 'trust_deleted'] as const

export default function HeroTrustStrip() {
  const t = useTranslations('landing.hero')

  return (
    <div className="mt-8 border-t border-[rgba(255,255,255,0.06)] py-4">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        {TRUST_KEYS.map((key, i) => (
          <Fragment key={key}>
            {i > 0 && (
              <span className="font-[Inter,sans-serif] text-[11px] uppercase tracking-[0.1em] text-[#3D4F6E]" aria-hidden>
                ·
              </span>
            )}
            <span className="font-[Inter,sans-serif] text-[11px] uppercase tracking-[0.1em] text-[#3D4F6E]">
              {t(key)}
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
