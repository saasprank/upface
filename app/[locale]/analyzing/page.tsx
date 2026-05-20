'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import ScanAnimation from '@/components/ui/ScanAnimation'
import UpfaceLogo from '@/components/ui/UpfaceLogo'
import { createClient } from '@/lib/supabase'
import { isAuthUiHidden } from '@/lib/auth-ui'
import { syncSubscriberRoutineFromAnalyze } from '@/lib/routine-client'

const MESSAGES_KEYS = [
  'step_1', 'step_2', 'step_3', 'step_4', 'step_5', 'step_6',
] as const

export default function AnalyzingPage() {
  const t = useTranslations('analyzing')
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const analysisIdRef = useRef<string | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const url = sessionStorage.getItem('upface_photo_url')
    if (url) setPhotoUrl(url)
  }, [])

  // Progress bar animation (8s total)
  useEffect(() => {
    const duration = 8000
    const start = performance.now()

    const frame = (now: number) => {
      const elapsed = now - start
      const p = Math.min((elapsed / duration) * 100, 95)
      setProgress(p)
      if (p < 95) requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
  }, [])

  // Message cycling every 1.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, MESSAGES_KEYS.length - 1))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  // Start analysis API call
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const run = async () => {
      const url = sessionStorage.getItem('upface_photo_url')
      const isDemo = searchParams.get('demo') === '1'

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: url, demo: isDemo }),
        })

        const data = await res.json() as {
          analysisId?: string
          error?: string
          scores?: Record<string, number>
          observations?: Record<string, string>
          freeAnalysis?: boolean
        }

        // Aucun visage détecté → retour à /analyze avec message
        if (res.status === 422 && data.error === 'NO_FACE_DETECTED') {
          router.push(`${prefix}/analyze?error=no_face`)
          return
        }

        if (!res.ok) throw new Error('Analysis failed')

        // Sauvegarde les observations pour la génération de routine
        if (data.observations) {
          localStorage.setItem('upface_observations', JSON.stringify(data.observations))
        }

        await syncSubscriberRoutineFromAnalyze({
          freeAnalysis: data.freeAnalysis,
          scores: data.scores,
          observations: data.observations,
        })

        const id = data.analysisId ?? `demo-${Date.now()}`
        analysisIdRef.current = id
        sessionStorage.setItem('upface_analysis_id', id)
      } catch {
        // Fallback demo ID
        const demoId = `demo-${Date.now()}`
        analysisIdRef.current = demoId
        sessionStorage.setItem('upface_analysis_id', demoId)
      }

      // Ensure at least 8s total, then redirect
      await new Promise((resolve) => setTimeout(resolve, 500))
      setProgress(100)

      await new Promise((resolve) => setTimeout(resolve, 600))

      // Check auth
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const id = analysisIdRef.current!

      if (session || isAuthUiHidden()) {
        router.push(`${prefix}/results/${id}`)
      } else {
        router.push(`${prefix}/signup?next=${encodeURIComponent(`${prefix}/results/${id}`)}`)
      }
    }

    // Slight delay to let the animation start
    setTimeout(run, 800)
  }, [router, prefix, searchParams])

  return (
    <div
      className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center gap-10 px-4"
      style={{
        background: 'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(59,130,246,0.06) 0%, #080C14 70%)',
      }}
    >
      {/* Top branding */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <UpfaceLogo size="sm" />
      </div>

      {/* Photo with ring and scan */}
      <div className="relative flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Animated ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-blue-500/30"
            style={{
              animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
            }}
          />
          <div
            className="absolute -inset-1 rounded-full border border-blue-500/20"
            style={{
              animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
              animationDelay: '0.5s',
            }}
          />

          {/* Photo */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500/40 relative bg-[#0D1321]">
            {photoUrl ? (
              <Image src={photoUrl} alt="Analyzing" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center px-2">
                <UpfaceLogo size="xs" />
              </div>
            )}
          </div>
        </div>

        {/* Scan animation overlay */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <ScanAnimation height={128} />
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-[#EEF2FF] mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>
          {t('title')}
        </h1>

        {/* Cycling message */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-sm text-[#8B9DC3] animate-fade-in">
            {t(MESSAGES_KEYS[messageIndex])}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-[#3D4F6E] mb-2">
          <span>Analyse IA</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
              transition: 'width 0.3s linear',
              boxShadow: '0 0 8px rgba(59,130,246,0.5)',
            }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-1.5">
        {MESSAGES_KEYS.map((key, i) => (
          <div
            key={key}
            className={`flex items-center gap-2 text-xs transition-all duration-300 ${
              i < messageIndex
                ? 'text-emerald-400'
                : i === messageIndex
                  ? 'text-[#EEF2FF]'
                  : 'text-[#3D4F6E]'
            }`}
          >
            {i < messageIndex ? (
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : i === messageIndex ? (
              <svg className="w-3.5 h-3.5 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />
            )}
            {t(key)}
          </div>
        ))}
      </div>
    </div>
  )
}
