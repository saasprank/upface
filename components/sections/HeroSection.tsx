'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const stats = [
    { label: t('stat_points') },
    { label: t('stat_speed') },
    { label: t('stat_accuracy') },
    { label: t('stat_analyses') },
  ]

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 800px 600px at 50% 40%, rgba(59,130,246,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-28">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">

          {/* Hero logo */}
          <div
            className="relative mb-6 animate-fade-in-up"
            style={{ animationDelay: '0s' }}
          >
            {/* Halo de lueur SÉPARÉ — filter ici, pas sur le logo */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: '-30px',
                borderRadius: '50%',
                filter: 'blur(28px)',
                background: 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(59,130,246,0.35) 0%, rgba(6,182,212,0.12) 50%, transparent 70%)',
              }}
            />
            {/* Anneaux pulsants */}
            <div
              className="absolute rounded-full border border-blue-500/20 pointer-events-none"
              style={{ inset: '-16px', animation: 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite' }}
            />
            <div
              className="absolute rounded-full border border-blue-400/10 pointer-events-none"
              style={{ inset: '-32px', animation: 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite', animationDelay: '1.5s' }}
            />
            {/*
              RÈGLE CLÉ : mix-blend-mode et filter ne doivent PAS être sur le même élément.
              filter crée un contexte d'isolation qui empêche screen de fusionner avec la page.
              → mix-blend-mode sur le wrapper div, AUCUN filter sur l'img.
            */}
            <div style={{ mixBlendMode: 'screen', display: 'inline-block', lineHeight: 0 }}>
              <Image
                src="/logo.png"
                alt="UPFACE AI"
                width={200}
                height={200}
                priority
                style={{ display: 'block' }}
              />
            </div>
          </div>

          {/* Animated pill badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-8 animate-fade-in-up"
            style={{
              background: 'rgba(59,130,246,0.08)',
              borderColor: 'rgba(59,130,246,0.25)',
              color: '#8B9DC3',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-dot"
              style={{ animationDelay: '0s' }}
            />
            {t('badge')}
          </div>

          {/* H1 */}
          <h1
            className="text-gradient text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.1s', fontFamily: 'Satoshi, sans-serif' }}
          >
            {t('title')}
          </h1>

          {/* Subtitle */}
          <p
            className="text-[#8B9DC3] text-lg sm:text-xl leading-relaxed max-w-xl mb-10 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center gap-3 mb-14 animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Button
              size="lg"
              onClick={() => router.push(`${prefix}/analyze`)}
              className="w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('cta_primary')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('score-demo')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto"
            >
              {t('cta_secondary')}
            </Button>
          </div>

          {/* Stats row */}
          <div
            className="flex flex-wrap items-center justify-center gap-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center">
                <div className="px-5 py-2 text-center">
                  <p className="text-sm font-semibold text-[#EEF2FF]">{stat.label}</p>
                </div>
                {i < stats.length - 1 && (
                  <div className="w-px h-6 bg-[rgba(255,255,255,0.08)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
