'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import FaceOvalGuide from '@/components/analyze/FaceOvalGuide'

export default function HeroSection() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-4 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 700px 500px at 50% 45%, rgba(59,130,246,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-lg mx-auto text-center gap-8 sm:gap-10">
        <h1 className="space-y-1">
          <span
            className="block text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.12em] text-[#EEF2FF] uppercase"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            {t('title_line1')}
          </span>
          <span
            className="block text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.1em] uppercase text-gradient-blue"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            {t('title_line2')}
          </span>
        </h1>

        <FaceOvalGuide alignLabel={t('align_face')} />

        <button
          type="button"
          onClick={() => router.push(`${prefix}/analyze`)}
          className="w-full max-w-md flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98]"
          style={{
            height: 56,
            borderRadius: 9999,
            background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
            color: '#EEF2FF',
            fontSize: 16,
            fontFamily: 'Satoshi, sans-serif',
            boxShadow: '0 0 40px rgba(59,130,246,0.35), 0 4px 24px rgba(59,130,246,0.25)',
          }}
        >
          {t('cta_primary')}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

        <p
          className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[#3D4F6E] uppercase"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {t('footer_tagline')}
        </p>
      </div>
    </section>
  )
}
