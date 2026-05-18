'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'

const STEPS = [
  { label: 'Analyse de tes priorités...', duration: 1400 },
  { label: 'Calibration selon ton score facial...', duration: 1600 },
  { label: 'Construction de ton plan 30 jours...', duration: 1800 },
  { label: 'Personnalisation Skincare & Grooming...', duration: 1400 },
  { label: 'Finalisation de ta routine Aura...', duration: 1200 },
]

const TOTAL = STEPS.reduce((a, s) => a + s.duration, 0)

export default function GeneratingPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) ?? 'fr'
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const goToPaywall = useCallback(() => {
    router.replace(`${prefix}/onboarding/routine-preview`)
  }, [router, prefix])

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let cancelled = false

    const clearTimers = () => {
      if (intervalId !== undefined) clearInterval(intervalId)
      if (timeoutId !== undefined) clearTimeout(timeoutId)
      intervalId = undefined
      timeoutId = undefined
    }

    // Pas d'appel IA avant paiement — la routine est générée après Stripe (`routine-complete`).
    const preparePaywallPreview = async () => {
      try {
        localStorage.removeItem('upface_routine')
      } catch { /* ignore */ }
      finally {
        if (!cancelled) {
          clearTimers()
          goToPaywall()
        }
      }
    }

    void preparePaywallPreview()

    // ── 2. Animation loader (purement visuelle jusqu’à redirection) ─────────────
    let elapsed = 0
    let stepIndex = 0

    intervalId = setInterval(() => {
      elapsed += 80
      setProgress(Math.min((elapsed / TOTAL) * 100, 98))

      const cumulative = STEPS.slice(0, stepIndex + 1).reduce((a, s) => a + s.duration, 0)
      if (elapsed >= cumulative && stepIndex < STEPS.length - 1) {
        stepIndex++
        setCurrentStep(stepIndex)
      }
    }, 80)

    timeoutId = setTimeout(() => {
      setProgress(100)
    }, TOTAL + 300)

    return () => {
      cancelled = true
      clearTimers()
    }
  }, [goToPaywall])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#080C14' }}
    >
      {/* Logo */}
      <div className="mb-12 flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: '#3B82F6' }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: '#06B6D4' }} />
        </div>
        <span className="font-bold text-white tracking-wide text-lg">UPFACE</span>
      </div>

      {/* Ring animé */}
      <div className="relative w-40 h-40 mb-10">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#1A2236" strokeWidth="8" />
          <circle
            cx="80" cy="80" r="70" fill="none"
            stroke="url(#grad)" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{Math.round(progress)}%</span>
          <span className="text-xs mt-1" style={{ color: '#8B9DC3' }}>en cours</span>
        </div>
      </div>

      {/* Step actuel */}
      <div className="mb-8 text-center min-h-[28px]">
        <p className="text-white font-medium text-base animate-pulse">
          {STEPS[currentStep].label}
        </p>
      </div>

      {/* Liste des steps */}
      <div className="w-full max-w-sm space-y-3">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                i < currentStep
                  ? 'bg-green-500'
                  : i === currentStep
                  ? 'border-2 border-blue-400'
                  : 'border border-gray-700'
              }`}
            >
              {i < currentStep && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {i === currentStep && (
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              )}
            </div>
            <span className={`text-sm transition-colors duration-300 ${
              i <= currentStep ? 'text-white' : 'text-gray-600'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-12 text-xs text-center" style={{ color: '#3D4F6E' }}>
        Routine générée en fonction de ton score et tes objectifs
      </p>
    </div>
  )
}
