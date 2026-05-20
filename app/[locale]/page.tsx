import Navbar from '@/components/layout/Navbar'
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
    </>
  )
}
