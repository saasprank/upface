'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import AnalyzingFaceVisual from '@/components/analyze/AnalyzingFaceVisual'
import AnalyzingProgressSection from '@/components/analyze/AnalyzingProgressSection'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase'
import { isAuthUiHidden } from '@/lib/auth-ui'
import { syncSubscriberRoutineFromAnalyze } from '@/lib/routine-client'

const MESSAGES_KEYS = ['step_1', 'step_2', 'step_3', 'step_4'] as const
const PROGRESS_DURATION_MS = 8000

export default function AnalyzingPage() {
  const t = useTranslations('analyzing')
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const analysisIdRef = useRef<string | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const duration = PROGRESS_DURATION_MS
    const start = performance.now()

    const frame = (now: number) => {
      const elapsed = now - start
      const p = Math.min((elapsed / duration) * 100, 100)
      setProgress(p)
      if (p < 100) requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES_KEYS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

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

        if (res.status === 422 && data.error === 'NO_FACE_DETECTED') {
          router.push(`${prefix}/analyze?error=no_face`)
          return
        }

        if (!res.ok) throw new Error('Analysis failed')

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
        const demoId = `demo-${Date.now()}`
        analysisIdRef.current = demoId
        sessionStorage.setItem('upface_analysis_id', demoId)
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
      setProgress(100)

      await new Promise((resolve) => setTimeout(resolve, 600))

      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const id = analysisIdRef.current!

      if (session || isAuthUiHidden()) {
        router.push(`${prefix}/results/${id}`)
      } else {
        router.push(`${prefix}/signup?next=${encodeURIComponent(`${prefix}/results/${id}`)}`)
      }
    }

    setTimeout(run, 800)
  }, [router, prefix, searchParams])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080C14]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 25%, rgba(59,130,246,0.14) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <Navbar />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-[640px] flex-col items-center justify-center px-4 pb-10 pt-20">
        <div className="mb-2 w-full">
          <AnalyzingFaceVisual />
        </div>

        <div className="mt-10 w-full">
          <AnalyzingProgressSection
            progress={progress}
            message={t(MESSAGES_KEYS[messageIndex])}
          />
        </div>
      </main>
    </div>
  )
}
