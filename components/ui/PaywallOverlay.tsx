'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import Button from './Button'

interface PaywallOverlayProps {
  message?: string
  showPlans?: boolean
}

export default function PaywallOverlay({
  message = 'Débloquez votre routine complète — 30 jours de protocole personnalisé',
  showPlans = true,
}: PaywallOverlayProps) {
  const router = useRouter()
  const locale = useLocale()

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl overflow-hidden">
      {/* Gradient fade */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(248,250,255,0.85) 30%, rgba(248,250,255,0.98) 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <p className="text-sm text-theme font-medium leading-relaxed">{message}</p>

        {showPlans && (
          <div className="flex flex-col gap-2 w-full">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => router.push(`/${locale}/checkout?plan=pro`)}
            >
              Pro — 9,99€/mois
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => router.push(`/${locale}/checkout?plan=report`)}
            >
              Report — 6,99€
            </Button>
          </div>
        )}

        <p className="text-xs text-faint flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Paiement sécurisé · Accès immédiat
        </p>
      </div>
    </div>
  )
}
