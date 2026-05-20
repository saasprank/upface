import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MobileLandingPage from '@/components/landing/MobileLandingPage'

type Props = { params: Promise<{ locale: string }> }

export default async function LandingPage({ params }: Props) {
  await params

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <MobileLandingPage />
      </main>
      <Footer />
    </>
  )
}
