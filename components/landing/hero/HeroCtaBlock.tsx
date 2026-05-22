'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

const LEFT_AVATARS = [
  'https://i.pravatar.cc/36?img=1',
  'https://i.pravatar.cc/36?img=2',
  'https://i.pravatar.cc/36?img=3',
  'https://i.pravatar.cc/36?img=4',
]

const RIGHT_AVATARS = [
  'https://i.pravatar.cc/36?img=5',
  'https://i.pravatar.cc/36?img=6',
  'https://i.pravatar.cc/36?img=7',
]

function AvatarStack({ urls, side }: { urls: string[]; side: 'left' | 'right' }) {
  return (
    <div className={`flex items-center ${side === 'right' ? 'flex-row-reverse' : ''}`}>
      {urls.map((url, i) => (
        <div
          key={url}
          className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-[#080C14] bg-[#1E2A3E]"
          style={{
            marginLeft: side === 'left' && i > 0 ? -10 : 0,
            marginRight: side === 'right' && i > 0 ? -10 : 0,
            zIndex: i,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="h-full w-full object-cover" />
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
    <div className="mx-auto flex w-full max-w-[480px] flex-col items-center">
      <button
        type="button"
        onClick={() => router.push(`${prefix}/analyze`)}
        className="h-14 w-full rounded-full font-[Outfit,sans-serif] text-[16px] font-bold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90"
        style={{
          background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
          boxShadow: '0 0 40px rgba(59,130,246,0.45), 0 0 80px rgba(6,182,212,0.2)',
        }}
      >
        {t('cta_primary')}
      </button>

      <p className="mt-3 text-center font-[Inter,sans-serif] text-[13px] text-[#8B9DC3]">
        {t('cta_no_card')}
      </p>

      <div className="mt-6 flex w-full items-center justify-center gap-4">
        <AvatarStack urls={LEFT_AVATARS} side="left" />
        <div className="text-center">
          <p className="font-[Inter,sans-serif] text-[14px] font-bold text-white">
            {t('social_proof_text')}
          </p>
          <p className="mt-1 font-[Inter,sans-serif] text-[13px]">
            <span className="text-[#F59E0B]" aria-hidden>
              ★★★★★
            </span>{' '}
            <span className="text-[#8B9DC3]">{t('social_proof_rating')}</span>
          </p>
        </div>
        <AvatarStack urls={RIGHT_AVATARS} side="right" />
      </div>
    </div>
  )
}
