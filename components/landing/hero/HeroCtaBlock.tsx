'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

const LEFT_AVATARS = ['Alex', 'Marie', 'Lucas', 'Emma']
const RIGHT_AVATARS = ['Noah', 'Lina', 'Tom']

function AvatarStack({ names, side }: { names: string[]; side: 'left' | 'right' }) {
  return (
    <div className={`flex items-center ${side === 'right' ? 'flex-row-reverse' : ''}`}>
      {names.map((name, i) => (
        <div
          key={name}
          className="relative w-8 h-8 shrink-0 overflow-hidden rounded-full border-2 border-[#080C14] bg-[#1E2A3E]"
          style={{
            marginLeft: side === 'left' && i > 0 ? -8 : 0,
            marginRight: side === 'right' && i > 0 ? -8 : 0,
            zIndex: i,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E2A3E&color=8B9DC3&size=64&bold=true`}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

export default function HeroCtaBlock() {
  const t = useTranslations('landing.hero')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col items-center pt-4">
      <button
        type="button"
        onClick={() => router.push(`${prefix}/analyze`)}
        className="w-full h-[60px] rounded-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-[Outfit,sans-serif] font-bold uppercase tracking-[0.05em] text-[13px] sm:text-sm shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-opacity hover:opacity-90"
      >
        {t('cta_primary')}
      </button>

      <p className="mt-3 font-mono text-[11px] text-[#8B9DC3] text-center">
        {t('cta_no_card')}
      </p>

      <div className="mt-5 w-full rounded-xl border border-[#1E2A3E] bg-[#0D1321]/90 py-3 px-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <AvatarStack names={LEFT_AVATARS} side="left" />
        <div className="text-center px-1 min-w-[140px]">
          <p className="text-[11px] sm:text-xs text-[#8B9DC3] leading-snug">{t('social_proof_text')}</p>
          <p className="mt-1 text-[11px] sm:text-xs leading-none">
            <span className="text-[#FBBF24] tracking-wider" aria-hidden>★★★★★</span>{' '}
            <span className="text-[#8B9DC3]">{t('social_proof_rating')}</span>
          </p>
        </div>
        <AvatarStack names={RIGHT_AVATARS} side="right" />
      </div>
    </div>
  )
}
