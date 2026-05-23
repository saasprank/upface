'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import MotionReveal from '@/components/landing/shared/MotionReveal'
import SectionHeader from '@/components/landing/shared/SectionHeader'

export default function MobileUploadSection() {
  const t = useTranslations('landing.upload')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const tips = [t('tip1'), t('tip2'), t('tip3'), t('tip4')] as const

  return (
    <section id="upload" className="px-4 py-16">
      <div className="max-w-[375px] mx-auto">
        <MotionReveal>
          <SectionHeader label={t('label')} title={t('title')} subtitle={t('subtitle')} />
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <div
            className="relative rounded-2xl p-8 text-center overflow-hidden cursor-pointer group"
            style={{
              background: 'rgba(13,19,33,0.8)',
              border: '1px dashed rgba(59,130,246,0.35)',
              boxShadow: 'inset 0 0 40px rgba(59,130,246,0.04)',
            }}
            onClick={() => router.push(`${prefix}/analyze`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push(`${prefix}/analyze`)}
          >
            <motion.div
              className="absolute inset-x-0 h-px top-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)',
              }}
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            <div
              className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.1))',
                border: '1px solid #1E2A3E',
              }}
            >
              <svg className="w-7 h-7 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>

            <p className="text-sm font-semibold text-[#EEF2FF] mb-1">{t('dropzone')}</p>
            <p className="text-xs text-[#3D4F6E]">{t('formats')}</p>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.2}>
          <div className="mt-6 space-y-2.5">
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#3D4F6E] mb-3">{t('tips_title')}</p>
            {tips.map((tip) => (
              <div key={tip} className="flex items-center gap-3 text-xs text-[#8B9DC3]">
                <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.25)]">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {tip}
              </div>
            ))}
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
