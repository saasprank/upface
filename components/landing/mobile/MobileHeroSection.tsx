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
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden px-4 pt-24 pb-10">
      <div className="absolute inset-0 pointer-events-none hero-spotlight" />

      <div className="relative z-10 flex flex-col flex-1 max-w-[375px] mx-auto w-full">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="text-[2.15rem] leading-[1.02] font-black tracking-[0.04em] uppercase text-gradient"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            {t('title_line1')}
            <br />
            {t('title_line2')}
          </h1>
          <p className="mt-5 text-[15px] text-muted leading-relaxed px-1 max-w-[320px] mx-auto">{t('subtitle')}</p>
        </motion.div>

        <motion.div
          className="flex-1 flex items-center justify-center py-2"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <BiometricFaceScanner />
        </motion.div>

        <motion.div
          className="mt-auto space-y-3 pt-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            type="button"
            onClick={() => router.push(`${prefix}/analyze`)}
            className="w-full h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-2 btn-primary-premium"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            {t('cta_primary')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full h-12 rounded-2xl font-medium flex items-center justify-center gap-2 btn-glass"
          >
            <svg className="w-4 h-4 text-cyan" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            {t('cta_secondary')}
          </button>

          <p
            className="text-center text-[9px] tracking-[0.2em] uppercase text-faint pt-2"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {t('tagline')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
