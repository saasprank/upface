'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import BiometricFaceScanner from '@/components/landing/shared/BiometricFaceScanner'

export default function MobileHeroSection() {
  const t = useTranslations('landing.hero')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden px-4 pt-20 pb-8">
      {/* Immersive background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 120% 80% at 50% 20%, rgba(59,130,246,0.12) 0%, transparent 55%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 80%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(8,12,20,0.85) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col flex-1 max-w-[375px] mx-auto w-full">
        {/* Title */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="text-[2rem] leading-[1.05] font-black tracking-[0.06em] uppercase text-gradient"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            {t('title_line1')}
            <br />
            {t('title_line2')}
          </h1>
          <p className="mt-4 text-sm text-[#8B9DC3] leading-relaxed px-2">{t('subtitle')}</p>
        </motion.div>

        {/* Face scanner */}
        <motion.div
          className="flex-1 flex items-center justify-center -my-2"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <BiometricFaceScanner />
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="mt-auto space-y-3 pt-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            onClick={() => router.push(`${prefix}/analyze`)}
            className="w-full h-14 rounded-2xl font-bold text-[#EEF2FF] flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            style={{
              fontFamily: 'Satoshi, sans-serif',
              background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
              boxShadow: '0 0 40px rgba(59,130,246,0.3), 0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {t('cta_primary')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => document.getElementById('score-preview')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-12 rounded-2xl font-medium text-[#8B9DC3] flex items-center justify-center gap-2 border border-[rgba(59,130,246,0.2)] bg-[rgba(13,19,33,0.6)] backdrop-blur-sm"
          >
            <svg className="w-4 h-4 text-cyan" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            {t('cta_secondary')}
          </button>

          <p
            className="text-center text-[9px] tracking-[0.2em] uppercase text-[#3D4F6E] pt-1"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {t('tagline')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
