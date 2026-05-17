import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import ScoreDemoSection from '@/components/sections/ScoreDemoSection'
import RoutinePreviewSection from '@/components/sections/RoutinePreviewSection'
import LandingMidSections from '@/components/sections/LandingMidSections'
import PricingSection from '@/components/sections/PricingSection'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ScoreDemoSection />
        <RoutinePreviewSection />
        <LandingMidSections />
        <PricingSection />
      </main>
      <Footer />
    </>
  )
}
