'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PricingCardsGrid from '@/components/pricing/PricingCardsGrid'

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="animate-fade-in-up fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex max-w-sm items-center gap-3 rounded-xl border border-[#1E2A3E] bg-[#0D1321] px-5 py-3.5 shadow-xl">
        <svg className="h-4 w-4 shrink-0 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="flex-1 font-[Inter,sans-serif] text-sm text-[#EEF2FF]">{message}</p>
        <button type="button" onClick={onClose} className="text-[#3D4F6E] hover:text-[#8B9DC3]">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const t = useTranslations('checkout')
  const tPricing = useTranslations('landing.pricing')
  const router = useRouter()

  const [toast, setToast] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const showToast = () => {
    setToast(t('toast'))
    setTimeout(() => setToast(null), 4000)
  }

  const faqs = [
    { q: t('faq_1_q'), a: t('faq_1_a') },
    { q: t('faq_2_q'), a: t('faq_2_a') },
    { q: t('faq_3_q'), a: t('faq_3_a') },
  ]

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden bg-[#080C14] pt-16">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(59,130,246,0.12) 0%, transparent 70%)',
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <header className="mb-12 text-center">
            <h1 className="font-[Outfit,sans-serif] text-[clamp(36px,6vw,48px)] font-black uppercase leading-[0.92] tracking-[-0.02em]">
              <span className="bg-gradient-to-r from-white via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {tPricing('title')}
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg font-[Inter,sans-serif] text-[16px] leading-relaxed text-[#8B9DC3]">
              {tPricing('subtitle')}
            </p>
          </header>

          <PricingCardsGrid
            onPlanSelect={(planId) => {
              if (planId !== 'free') showToast()
            }}
            className="mb-14"
          />

          <div className="mb-10">
            <h2 className="mb-6 font-[Outfit,sans-serif] text-[20px] font-bold text-white">
              {t('faq_title')}
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-xl border border-[#1E2A3E] bg-[#0D1321]"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-[Inter,sans-serif] text-sm font-medium text-white">{faq.q}</span>
                    <svg
                      className={`h-4 w-4 shrink-0 text-[#3D4F6E] transition-transform duration-200 ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-[#1E2A3E] px-5 pb-4 pt-3">
                      <p className="font-[Inter,sans-serif] text-sm leading-relaxed text-[#8B9DC3]">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="mx-auto flex items-center gap-1.5 font-[Inter,sans-serif] text-sm text-[#3D4F6E] transition-colors hover:text-[#8B9DC3]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('back')}
            </button>
          </div>
        </div>
      </main>
      <Footer />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
