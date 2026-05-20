'use client'

import MobileHeroSection from '@/components/landing/mobile/MobileHeroSection'
import MobileStatsSection from '@/components/landing/mobile/MobileStatsSection'
import MobileOnboardingTutorialSection from '@/components/landing/mobile/MobileOnboardingTutorialSection'
import MobileRoutineSection from '@/components/landing/mobile/MobileRoutineSection'
import MobilePricingSection from '@/components/landing/mobile/MobilePricingSection'
import MobileDashboardSection from '@/components/landing/mobile/MobileDashboardSection'
import FaqSection from '@/components/sections/FaqSection'
import Footer from '@/components/layout/Footer'

export default function MobileLandingPage() {
  return (
    <div className="landing-page-bg min-h-screen">
      <MobileHeroSection />
      <MobileStatsSection />
      <MobileOnboardingTutorialSection />
      <MobileRoutineSection />
      <MobilePricingSection />
      <MobileDashboardSection />
      <FaqSection />
      <Footer />
    </div>
  )
}
