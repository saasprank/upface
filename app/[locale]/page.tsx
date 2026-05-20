import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import PricingSection from '@/components/sections/PricingSection'
import FaqSection from '@/components/sections/FaqSection'

type Props = { params: Promise<{ locale: string }> }

export default async function LandingPage({ params }: Props) {
  await params

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
}
