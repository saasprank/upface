'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

const CheckIcon = () => (
  <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)
const CrossIcon = () => (
  <svg className="w-4 h-4 text-[#3D4F6E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
      <div className="bg-[#0D1321] border border-blue-500/30 rounded-xl px-5 py-3.5 flex items-center gap-3 shadow-xl shadow-blue-500/10 max-w-sm">
        <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-[#EEF2FF] flex-1">{message}</p>
        <button onClick={onClose} className="text-[#3D4F6E] hover:text-[#8B9DC3]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const faqs = [
  { q: 'Puis-je annuler ?', a: 'Oui, vous pouvez annuler à tout moment depuis vos paramètres. Aucun frais de résiliation.' },
  { q: 'Mes données sont-elles sécurisées ?', a: 'Vos photos sont chiffrées et ne sont jamais partagées. Conformité RGPD totale.' },
  { q: 'Remboursement ?', a: 'Remboursement intégral garanti sous 7 jours si vous n\'êtes pas satisfait.' },
]

const comparisonRows = [
  { feature: 'Score global', free: true, report: true, pro: true },
  { feature: '5 BreakdownBars', free: true, report: true, pro: true },
  { feature: '3 TraitCards débloquées', free: true, report: false, pro: false },
  { feature: '5 TraitCards débloquées', free: false, report: true, pro: true },
  { feature: 'Routine complète 30j', free: false, report: true, pro: true },
  { feature: 'Analyses illimitées', free: false, report: false, pro: true },
  { feature: 'Historique complet', free: false, report: false, pro: true },
  { feature: 'Progression semaine/semaine', free: false, report: false, pro: true },
]

export default function CheckoutPage() {
  const t = useTranslations('checkout')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const [toast, setToast] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const showToast = () => {
    setToast(t('toast'))
    setTimeout(() => setToast(null), 4000)
  }

  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      desc: 'Pour découvrir',
      cta: 'Plan actuel',
      variant: 'ghost' as const,
      featured: false,
    },
    {
      name: 'Report',
      price: '6,99€',
      desc: 'Rapport complet unique',
      cta: t('cta'),
      variant: 'outline' as const,
      featured: false,
    },
    {
      name: 'Pro',
      price: '9,99€',
      period: '/mois',
      desc: 'Suivi illimité',
      cta: t('cta'),
      variant: 'primary' as const,
      featured: true,
      badge: 'Le plus populaire',
    },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-3xl sm:text-4xl font-black text-[#EEF2FF] mb-3"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              {t('title')}
            </h1>
            <p className="text-[#8B9DC3] text-sm">{t('subtitle')}</p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 flex flex-col gap-6 relative ${
                  plan.featured
                    ? 'border-2 border-blue-500/40'
                    : 'border border-[rgba(59,130,246,0.12)]'
                }`}
                style={{
                  background: plan.featured
                    ? 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, #0D1321 100%)'
                    : '#0D1321',
                }}
              >
                {plan.featured && plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary">{plan.badge}</Badge>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-[#8B9DC3] mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-3xl font-black text-[#EEF2FF]"
                      style={{ fontFamily: 'Satoshi, sans-serif' }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && <span className="text-sm text-[#3D4F6E]">{plan.period}</span>}
                  </div>
                  <p className="text-xs text-[#3D4F6E] mt-1">{plan.desc}</p>
                </div>
                <Button
                  variant={plan.variant}
                  size="md"
                  className="w-full"
                  onClick={plan.name === 'Gratuit' ? undefined : showToast}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="mb-14">
            <h2
              className="text-xl font-bold text-[#EEF2FF] mb-6"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              Comparaison des fonctionnalités
            </h2>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(59,130,246,0.10)]">
                      <th className="text-left px-6 py-4 text-[#8B9DC3] font-medium">Fonctionnalité</th>
                      <th className="text-center px-4 py-4 text-[#8B9DC3] font-medium">Gratuit</th>
                      <th className="text-center px-4 py-4 text-[#8B9DC3] font-medium">Report</th>
                      <th className="text-center px-4 py-4 text-blue-400 font-medium">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr
                        key={row.feature}
                        className={`border-b border-[rgba(255,255,255,0.04)] ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                      >
                        <td className="px-6 py-3.5 text-[#8B9DC3]">{row.feature}</td>
                        <td className="px-4 py-3.5 text-center">
                          {row.free ? <CheckIcon /> : <CrossIcon />}
                          <span className="sr-only">{row.free ? 'Inclus' : 'Non inclus'}</span>
                        </td>
                        <td className="px-4 py-3.5 text-center flex justify-center">
                          {row.report ? <CheckIcon /> : <CrossIcon />}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex justify-center">
                            {row.pro ? <CheckIcon /> : <CrossIcon />}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* FAQ */}
          <div className="mb-10">
            <h2
              className="text-xl font-bold text-[#EEF2FF] mb-6"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            >
              {t('faq_title')}
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <Card key={i} hover className="overflow-hidden">
                  <button
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-sm font-medium text-[#EEF2FF]">{faq.q}</span>
                    <svg
                      className={`w-4 h-4 text-[#3D4F6E] shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4">
                      <p className="text-sm text-[#8B9DC3] leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Back link */}
          <div className="text-center">
            <button
              onClick={() => router.back()}
              className="text-sm text-[#3D4F6E] hover:text-[#8B9DC3] transition-colors flex items-center gap-1.5 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
