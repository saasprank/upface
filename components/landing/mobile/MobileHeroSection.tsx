'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import BiometricFaceScanner from '@/components/landing/shared/BiometricFaceScanner'

const VALUE_KEYS = ['value_1', 'value_2', 'value_3'] as const

export default function MobileHeroSection() {
  const t = useTranslations('landing.hero')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden px-4 pt-[5.5rem] pb-10">
      <div className="absolute inset-0 pointer-events-none hero-spotlight" />
      <div
        className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[min(420px,95vw)] h-[420px] pointer-events-none rounded-full opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(6,182,212,0.04) 42%, transparent 72%)',
        }}
      />

      <div className="relative z-10 flex flex-col flex-1 max-w-[375px] mx-auto w-full">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-badge mb-5">
            <span className="hero-badge-dot" aria-hidden />
            {t('badge')}
          </div>

          <h1 className="hero-title text-[2.35rem] sm:text-[2.6rem]">
            {t('title_line1')}
            <br />
            <span className="hero-title-accent">{t('title_line2')}</span>
          </h1>

          <p className="mt-5 text-[15px] sm:text-base text-muted leading-relaxed px-1 max-w-[340px] mx-auto">
            {t('subtitle')}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {VALUE_KEYS.map((key, i) => (
              <motion.span
                key={key}
                className="hero-value-chip"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-cyan text-[10px]">◆</span>
                {t(key)}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative flex-1 flex items-center justify-center py-1 min-h-[300px]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-scanner-ring" aria-hidden />
          <BiometricFaceScanner />
        </motion.div>

        <motion.div
          className="mt-auto space-y-3 pt-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            onClick={() => router.push(`${prefix}/analyze`)}
            className="w-full h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-2 btn-primary-premium text-[15px]"
            style={{ fontFamily: 'Outfit, Satoshi, sans-serif' }}
          >
            {t('cta_primary')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-12 rounded-2xl font-medium flex items-center justify-center gap-2 btn-glass text-[14px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <svg className="w-4 h-4 text-cyan" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            {t('cta_secondary')}
          </button>

          <p
            className="text-center text-[9px] tracking-[0.18em] uppercase text-faint pt-2"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {t('tagline')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
