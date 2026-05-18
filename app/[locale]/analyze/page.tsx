'use client'

import { useState, useCallback, useRef, useId, Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import FaceCadran, { type AnalyzeState, type FaceCadranHandle, type CameraErrorCode } from '@/components/analyze/FaceCadran'
import { faceClipUrl } from '@/components/analyze/faceSilhouette'
import ScanInstructions from '@/components/analyze/ScanInstructions'
import ScanProgressBar from '@/components/analyze/ScanProgressBar'
import { SCAN_POSE_STEP_ORDER } from '@/lib/face-pose-heuristics'
import { useFacePoseGuide } from '@/hooks/useFacePoseGuide'
import { createClient } from '@/lib/supabase'
import { isSupabaseConfigured } from '@/lib/supabase-config'
import { isAuthUiHidden } from '@/lib/auth-ui'
import { UPFACE_LOGO_IMG_STYLE } from '@/lib/upface-logo-style'
import { syncSubscriberRoutineFromAnalyze } from '@/lib/routine-client'

const FaceLandmarks = dynamic(() => import('@/components/analyze/FaceLandmarks'), { ssr: false })

async function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('read_failed'))
    reader.readAsDataURL(file)
  })
}

async function parseAnalyzeResponse(res: Response): Promise<{
  analysisId?: string
  error?: string
  observations?: Record<string, string>
  scores?: Record<string, number>
  freeAnalysis?: boolean
}> {
  const text = await res.text()
  if (!text.trim()) return {}
  try {
    return JSON.parse(text) as {
      analysisId?: string
      error?: string
      observations?: Record<string, string>
      scores?: Record<string, number>
      freeAnalysis?: boolean
    }
  } catch {
    return { error: 'INVALID_RESPONSE' }
  }
}

function CameraLaunchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  )
}

function AnalyzeContent() {
  const router = useRouter()
  const locale = useLocale() as string
  const prefix = locale === 'fr' ? '' : `/${locale}`
  const t = useTranslations('analyzeLive')

  const cadranRef = useRef<FaceCadranHandle>(null)
  const finalizeOnceRef = useRef(false)
  const faceMaskUid = useId().replace(/:/g, '')

  const [state, setState] = useState<AnalyzeState>('idle')
  const [cameraActive, setCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [finalizing, setFinalizing] = useState(false)
  const [poseStepIndex, setPoseStepIndex] = useState(0)

  const getScanVideo = useCallback(() => cadranRef.current?.getVideo() ?? null, [])

  // --- Camera handlers ---
  const handleCameraReady = useCallback(() => {
    // Auto-start scanning immediately — no button needed
    setState('scanning')
  }, [])

  const handleCameraError = useCallback((code: CameraErrorCode) => {
    const msg =
      code === 'denied' ? t('errors.denied')
        : code === 'not_found' ? t('errors.not_found')
          : t('errors.generic')
    setError(msg)
    setCameraActive(false)
    setState('idle')
  }, [t])

  const handleLaunchCamera = () => {
    setError(null)
    setCameraActive(true)
    setState('loading_camera')
  }

  // --- Dernière pose validée (auto) puis envoi ---
  const handleInstructionsDone = useCallback(async () => {
    if (finalizeOnceRef.current) return
    finalizeOnceRef.current = true
    setFinalizing(true)

    try {
      const capturedFile = await cadranRef.current?.captureFrame()
      if (!capturedFile) throw new Error('capture_failed')

      const supabase = createClient()
      let imageUrl = ''

      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filename, capturedFile, { cacheControl: '3600', upsert: false })

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(uploadData.path)
        imageUrl = publicUrl
      }

      let imageBase64: string | undefined
      if (!imageUrl.trim()) {
        imageBase64 = await fileToDataUrl(capturedFile)
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, ...(imageBase64 ? { imageBase64 } : {}) }),
      })

      const data = await parseAnalyzeResponse(res)

      if (!res.ok) {
        if (data.error === 'NO_FACE_DETECTED') throw new Error('no_face')
        if (data.error === 'IMAGE_REQUIRED') throw new Error('image_required')
        throw new Error(data.error ?? 'Analysis failed')
      }

      // Sauvegarde les observations pour la génération de routine
      if (data.observations) {
        localStorage.setItem('upface_observations', JSON.stringify(data.observations))
      }

      await syncSubscriberRoutineFromAnalyze({
        freeAnalysis: data.freeAnalysis,
        scores: data.scores,
        observations: data.observations,
      })

      const analysisId: string = data.analysisId ?? `demo-${Date.now()}`
      setState('redirecting')

      const resultsPath = `${prefix}/results/${analysisId}`
      if (!isSupabaseConfigured() || isAuthUiHidden()) {
        router.push(resultsPath)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        router.push(resultsPath)
      } else {
        router.push(`${prefix}/signup?next=${encodeURIComponent(resultsPath)}`)
      }
    } catch (err) {
      finalizeOnceRef.current = false
      const msg = err instanceof Error ? err.message : ''
      setFinalizing(false)
      if (msg === 'no_face') {
        setError(
          locale === 'fr'
            ? 'Aucun visage détecté. Assure-toi que ton visage est bien éclairé et de face.'
            : 'No face detected. Make sure your face is well lit and facing the camera.'
        )
      } else if (msg === 'capture_failed') {
        setError(
          locale === 'fr'
            ? 'Impossible de capturer l\'image. Réessaie en gardant le visage dans le cadre.'
            : 'Could not capture the image. Try again keeping your face in the frame.'
        )
      } else if (msg === 'image_required') {
        setError(
          locale === 'fr'
            ? 'Photo non reçue par le serveur. Réessaie ou vérifie ta connexion.'
            : 'The server did not receive your photo. Try again or check your connection.'
        )
      } else {
        setError(locale === 'fr' ? 'Une erreur est survenue. Réessaie.' : 'Something went wrong. Please try again.')
      }
      setPoseStepIndex(0)
      setState('scanning')
    }
  }, [locale, prefix, router])

  const handlePoseValidated = useCallback(() => {
    setPoseStepIndex(prev => {
      const lastIx = SCAN_POSE_STEP_ORDER.length - 1
      if (prev >= lastIx) {
        queueMicrotask(() => void handleInstructionsDone())
        return prev
      }
      return prev + 1
    })
  }, [handleInstructionsDone])

  useEffect(() => {
    if (state === 'idle' || state === 'loading_camera' || state === 'camera_ready') {
      setPoseStepIndex(0)
    }
  }, [state])

  const poseStepId = SCAN_POSE_STEP_ORDER[Math.min(poseStepIndex, SCAN_POSE_STEP_ORDER.length - 1)]

  const { faceDetected, poseMatch, holdProgress } = useFacePoseGuide({
    active: state === 'scanning' && !finalizing,
    getVideo: getScanVideo,
    stepId: poseStepId,
    frozen: finalizing,
    onValidated: handlePoseValidated,
  })

  const isScanning = state === 'scanning' || state === 'redirecting'
  const showLaunch = state === 'idle'
  const faceClip = faceClipUrl(faceMaskUid)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080C14' }}>

      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6"
        style={{ height: 56, background: 'rgba(8,12,20,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(59,130,246,0.08)' }}
      >
        <Link href={`${prefix}/`} className="flex items-center gap-2">
          <Image src="/logo.png" alt="UPFACE" width={28} height={28} style={UPFACE_LOGO_IMG_STYLE} />
          <span className="font-bold text-sm text-[#EEF2FF]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            UPFACE
          </span>
        </Link>

        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: '#1E2A3E', border: '1px solid rgba(59,130,246,0.2)', color: '#8B9DC3' }}
        >
          Étape 1 / 3
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-14 pb-10" style={{ minHeight: '100dvh' }}>
        <div className="flex flex-col items-center gap-6 w-full max-w-md">

          {/* Marketing copy — visible only in idle state */}
          {showLaunch && (
            <section className="w-full text-center space-y-2 px-1 animate-fade-in">
              <h1
                className="text-lg sm:text-xl font-bold tracking-tight text-[#EEF2FF]"
                style={{ fontFamily: 'Satoshi, sans-serif' }}
              >
                {t('title')}
              </h1>
              <p className="text-xs sm:text-sm leading-snug text-[#8B9DC3]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('subtitle')}
              </p>
              <ul className="text-left text-xs sm:text-sm text-[#A8B8D4] space-y-1.5 pt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                <li className="flex gap-2 items-start">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#3B82F6]" aria-hidden />
                  <span>{t('step1')}</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#3B82F6]" aria-hidden />
                  <span>{t('step2')}</span>
                </li>
              </ul>
              <p className="text-[11px] sm:text-xs text-[#5C6B85]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('privacy')}
              </p>
            </section>
          )}

          {/* Cadran */}
          <div className="relative shrink-0">
            <FaceCadran
              ref={cadranRef}
              maskUid={faceMaskUid}
              cameraActive={cameraActive}
              state={state}
              onCameraReady={handleCameraReady}
              onCameraError={handleCameraError}
            />

            {isScanning && (
              <>
                <div
                  className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ clipPath: faceClip, WebkitClipPath: faceClip }}
                >
                  <FaceLandmarks W={250} H={320} visible={isScanning} />
                </div>
                <div
                  className="block sm:hidden absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ clipPath: faceClip, WebkitClipPath: faceClip }}
                >
                  <FaceLandmarks W={200} H={255} visible={isScanning} />
                </div>
              </>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="w-full flex items-start gap-2 px-4 py-3 rounded-xl text-sm text-center"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}
            >
              {error}
            </div>
          )}

          {/* Launch button — idle only */}
          {showLaunch && (
            <button
              type="button"
              onClick={handleLaunchCamera}
              className="w-full flex items-center justify-center gap-2.5 font-bold transition-all"
              style={{
                height: 56,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                color: '#EEF2FF',
                fontSize: 17,
                fontFamily: 'Satoshi, sans-serif',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(59,130,246,0.25)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.filter = 'brightness(1.08)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.35), 0 4px 24px rgba(59,130,246,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.filter = 'brightness(1)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(59,130,246,0.25)'
              }}
            >
              <CameraLaunchIcon />
              {t('launch')}
            </button>
          )}

          <ScanInstructions
            state={state}
            submitting={finalizing}
            currentStepIndex={poseStepIndex}
            faceDetected={faceDetected}
            poseMatch={poseMatch}
            holdProgress={holdProgress}
          />

          <ScanProgressBar active={isScanning && !finalizing} duration={SCAN_POSE_STEP_ORDER.length * 2200} />

          {/* Pendant l&apos;API */}
          {finalizing && state !== 'redirecting' && (
            <div className="flex items-center gap-2 text-xs text-[#8B9DC3]" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              Finalisation de l&apos;analyse…
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    }>
      <AnalyzeContent />
    </Suspense>
  )
}
