'use client'

import HeroBadgeTitle from '@/components/landing/hero/HeroBadgeTitle'
import HeroVisual from '@/components/landing/hero/HeroVisual'
import HeroStatsBar from '@/components/landing/hero/HeroStatsBar'
import HeroCtaBlock from '@/components/landing/hero/HeroCtaBlock'
import HeroTrustStrip from '@/components/landing/hero/HeroTrustStrip'

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-[#080C14]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_35%,rgba(59,130,246,0.12)_0%,transparent_60%)]"
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col w-full max-w-[480px] mx-auto px-4 pt-16 pb-0">
        <HeroBadgeTitle />
        <HeroVisual />
        <HeroStatsBar />
        <HeroCtaBlock />
      </div>

      <div className="relative z-10 w-full">
        <HeroTrustStrip />
      </div>
    </section>
  )
}
