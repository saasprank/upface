'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import UpfaceLogo from '@/components/ui/UpfaceLogo'

const STEPS = [
  { label: 'Analyse de tes priorités...', duration: 1400 },
  { label: 'Calibration selon ton score facial...', duration: 1600 },
  { label: 'Construction de ton plan 30 jours...', duration: 1800 },
  { label: 'Personnalisation Skincare & Grooming...', duration: 1400 },
  { label: 'Finalisation de ta routine Aura...', duration: 1200 },
]

const TOTAL = STEPS.reduce((a, s) => a + s.duration, 0)

function resolveAnalysisId(): string {
  try {
    const raw = localStorage.getItem('upface_onboarding')
    if (raw) {
      const parsed = JSON.parse(raw) as { analysisId?: string }
      if (parsed.analysisId?.trim()) return parsed.analysisId.trim()
    }
  } catch { /* ignore */ }

  try {
    const fromSession = sessionStorage.getItem('upface_analysis_id')
    if (fromSession?.trim()) return fromSession.trim()
  } catch { /* ignore */ }

  return `demo-${Date.now()}`
}

export default function GeneratingPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) ?? 'fr'
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    try {
      localStorage.removeItem('upface_routine')
    } catch { /* ignore */ }

    let elapsed = 0
    let stepIndex = 0
    let cancelled = false

    const intervalId = setInterval(() => {
      elapsed += 80
      const pct = Math.min((elapsed / TOTAL) * 100, 100)
      setProgress(pct)

      const cumulative = STEPS.slice(0, stepIndex + 1).reduce((a, s) => a + s.duration, 0)
      if (elapsed >= cumulative && stepIndex < STEPS.length - 1) {
        stepIndex += 1
        setCurrentStep(stepIndex)
      }

      if (elapsed >= TOTAL) {
        clearInterval(intervalId)
        if (cancelled) return

        setProgress(100)
        setCurrentStep(STEPS.length - 1)
        setDone(true)

        const analysisId = resolveAnalysisId()
        window.setTimeout(() => {
          if (!cancelled) {
            router.replace(`${prefix}/results/${analysisId}`)
          }
        }, 650)
      }
    }, 80)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [router, prefix])

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-10"
      style={{ background: '#F8FAFF' }}
    >
      <UpfaceLogo size="md" className="mb-12" />

      <div className="relative w-40 h-40 mb-10">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#E2E8F0" strokeWidth="8" />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.12s linear' }}
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
          <span className="text-xs mt-1" style={{ color: '#64748B' }}>
            {done ? 'Terminé' : 'en cours'}
          </span>
        </div>
      </div>

      <div className="mb-8 text-center min-h-[28px] px-4">
        <p className="text-white font-medium text-base">
          {done ? 'Ton bilan est prêt…' : STEPS[currentStep].label}
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3 mb-10">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                done || i < currentStep
                  ? 'bg-green-500'
                  : i === currentStep
                    ? 'border-2 border-blue-400'
                    : 'border border-gray-700'
              }`}
            >
              {(done || i < currentStep) && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {!done && i === currentStep && (
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              )}
            </div>
            <span
              className={`text-sm transition-colors duration-300 ${
                done || i <= currentStep ? 'text-white' : 'text-gray-600'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(15,23,42,0.08)' }}>
          <div
            className="h-full rounded-full transition-[width] duration-150 ease-linear"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
              boxShadow: '0 0 10px rgba(59,130,246,0.35)',
            }}
          />
        </div>
      </div>

      <p className="mt-8 text-xs text-center px-4" style={{ color: '#94A3B8' }}>
        Routine générée en fonction de ton score et tes objectifs
      </p>
    </div>
  )
}
