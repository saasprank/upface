'use client'

import MobileHeroSection from '@/components/landing/mobile/MobileHeroSection'
import MobileStatsSection from '@/components/landing/mobile/MobileStatsSection'
import MobileUploadSection from '@/components/landing/mobile/MobileUploadSection'
import MobileAnalysisSection from '@/components/landing/mobile/MobileAnalysisSection'
import MobileScoreSection from '@/components/landing/mobile/MobileScoreSection'
import MobileRoutineSection from '@/components/landing/mobile/MobileRoutineSection'
import MobilePricingSection from '@/components/landing/mobile/MobilePricingSection'
import MobileDashboardSection from '@/components/landing/mobile/MobileDashboardSection'
import FaqSection from '@/components/sections/FaqSection'

export default function MobileLandingPage() {
  return (
    <>
      <MobileHeroSection />
      <MobileStatsSection />
      <MobileUploadSection />
      <MobileAnalysisSection />
      <MobileScoreSection />
      <MobileRoutineSection />
      <MobilePricingSection />
      <MobileDashboardSection />
      <FaqSection />
    </>
  )
}
