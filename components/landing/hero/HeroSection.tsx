'use client'

import HeroBadgeTitle from '@/components/landing/hero/HeroBadgeTitle'
import HeroVisual from '@/components/landing/hero/HeroVisual'
import HeroStatsBar from '@/components/landing/hero/HeroStatsBar'
import HeroCtaBlock from '@/components/landing/hero/HeroCtaBlock'
import HeroTrustStrip from '@/components/landing/hero/HeroTrustStrip'

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-x-hidden bg-[#080C14]">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 60%)',
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto w-full max-w-[700px] px-4 pb-8 pt-16">
        <HeroBadgeTitle />
        <HeroVisual />
        <HeroStatsBar />
        <HeroCtaBlock />
        <HeroTrustStrip />
      </div>
    </section>
  )
}
