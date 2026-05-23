'use client'

import { useState, useCallback, useRef, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import FaceCadran, { type AnalyzeState, type FaceCadranHandle, type CameraErrorCode } from '@/components/analyze/FaceCadran'
import AnalyzeUploadScreen from '@/components/analyze/AnalyzeUploadScreen'
import ScanProgressBar from '@/components/analyze/ScanProgressBar'
import { ScanPoseInstructionCard } from '@/components/analyze/ScanInstructions'
import { SCAN_POSE_STEP_ORDER, computeScanProgress } from '@/lib/face-pose-heuristics'
import { getScanTiming, SCAN_ESTIMATED_API_MS } from '@/lib/scan-timing'
import { saveAnalysisSession, type AnalysisSessionPayload } from '@/lib/analysis-session'
import { useFacePoseGuide } from '@/hooks/useFacePoseGuide'
import { createClient } from '@/lib/supabase'
import { requiresAccountForAnalyze, analyzeReturnPath } from '@/lib/auth-ui'
import Navbar from '@/components/layout/Navbar'
import { syncSubscriberRoutineFromAnalyze } from '@/lib/routine-client'
import { computeClientScores } from '@/lib/client-face-scores'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

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
  scores?: AnalysisSessionPayload['scores']
  tier?: string
  percentile?: number
  freeAnalysis?: boolean
}> {
  const text = await res.text()
  if (!text.trim()) return {}
  try {
    return JSON.parse(text) as {
      analysisId?: string
      error?: string
      observations?: Record<string, string>
      scores?: AnalysisSessionPayload['scores']
      tier?: string
      percentile?: number
      freeAnalysis?: boolean
    }
  } catch {
    return { error: 'INVALID_RESPONSE' }
  }
}

function CloseIcon() {
  return (
    <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function AnalyzeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale() as string
  const prefix = locale === 'fr' ? '' : `/${locale}`
  const t = useTranslations('analyzeLive')
  const scanTiming = getScanTiming()

  const cadranRef = useRef<FaceCadranHandle>(null)
  const finalizeOnceRef = useRef(false)
  const autoStartAttemptedRef = useRef(false)
  const apiStartedRef = useRef(false)
  const apiStartedAtRef = useRef(0)
  const clientScoresRef = useRef<{
    symetrie: number
    proportions: number
    structure: number
  } | null>(null)

  const [state, setState] = useState<AnalyzeState>('idle')
  const [cameraActive, setCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [finalizing, setFinalizing] = useState(false)
  const [apiProgress, setApiProgress] = useState(0)
  const [poseStepIndex, setPoseStepIndex] = useState(0)
  const [instructionVisible, setInstructionVisible] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [clientScores, setClientScores] = useState<{
    symetrie: number
    proportions: number
    structure: number
  } | null>(null)

  const getScanVideo = useCallback(() => cadranRef.current?.getVideo() ?? null, [])

  const handleCameraReady = useCallback(() => {
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

  const startCameraSession = useCallback(() => {
    setError(null)
    setCameraActive(true)
    setState('loading_camera')
  }, [])

  const handleLaunchCamera = useCallback(async () => {
    if (requiresAccountForAnalyze()) {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push(`${prefix}/signup?next=${encodeURIComponent(analyzeReturnPath(prefix))}`)
        return
      }
    }
    startCameraSession()
  }, [prefix, router, startCameraSession])

  useEffect(() => {
    if (searchParams.get('start') !== '1') return
    if (state !== 'idle' || autoStartAttemptedRef.current) return
    autoStartAttemptedRef.current = true

    void (async () => {
      if (requiresAccountForAnalyze()) {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return
      }
      startCameraSession()
      router.replace(analyzeReturnPath(prefix, false))
    })()
  }, [searchParams, state, prefix, router, startCameraSession])

  const handleCancelScan = () => {
    setCameraActive(false)
    setState('idle')
    setError(null)
    setPoseStepIndex(0)
    setFinalizing(false)
    setApiProgress(0)
    setClientScores(null)
    clientScoresRef.current = null
    finalizeOnceRef.current = false
    autoStartAttemptedRef.current = false
    apiStartedRef.current = false
  }

  const applyAnalysisSuccess = useCallback(
    async (data: Awaited<ReturnType<typeof parseAnalyzeResponse>>) => {
      if (data.scores) {
        try {
          localStorage.setItem('upface_scores', JSON.stringify({
            ...data.scores,
            potentiel: Math.min(95, (data.scores.global ?? 70) + 14),
          }))
        } catch { /* ignore */ }
      }

      if (data.observations) {
        localStorage.setItem('upface_observations', JSON.stringify(data.observations))
      }

      const analysisId: string = data.analysisId ?? `demo-${Date.now()}`

      if (data.scores) {
        saveAnalysisSession(analysisId, {
          scores: data.scores,
          observations: data.observations,
          tier: data.tier,
          percentile: data.percentile,
          freeAnalysis: data.freeAnalysis,
        })
      }

      setApiProgress(1)
      setState('redirecting')
      router.replace(`${prefix}/results/${analysisId}`)

      void syncSubscriberRoutineFromAnalyze({
        freeAnalysis: data.freeAnalysis,
        scores: data.scores,
        observations: data.observations,
      })
    },
    [prefix, router],
  )

  const handleAnalysisFailure = useCallback(
    (err: unknown) => {
      finalizeOnceRef.current = false
      apiStartedRef.current = false
      const msg = err instanceof Error ? err.message : ''
      const aborted = err instanceof Error && err.name === 'AbortError'
      setFinalizing(false)
      setApiProgress(0)
      if (aborted) {
        setError(
          locale === 'fr'
            ? 'L\'analyse a pris trop de temps. Réessaie avec une bonne connexion.'
            : 'Analysis timed out. Try again with a stable connection.',
        )
      } else if (msg === 'no_face') {
        setError(
          locale === 'fr'
            ? 'Aucun visage détecté. Assure-toi que ton visage est bien éclairé et de face.'
            : 'No face detected. Make sure your face is well lit and facing the camera.',
        )
      } else if (msg === 'capture_failed') {
        setError(
          locale === 'fr'
            ? 'Impossible de capturer l\'image. Réessaie en gardant le visage dans le cadre.'
            : 'Could not capture the image. Try again keeping your face in the frame.',
        )
      } else if (msg === 'image_required') {
        setError(
          locale === 'fr'
            ? 'Photo non reçue par le serveur. Réessaie ou vérifie ta connexion.'
            : 'The server did not receive your photo. Try again or check your connection.',
        )
      } else {
        setError(locale === 'fr' ? 'Une erreur est survenue. Réessaie.' : 'Something went wrong. Please try again.')
      }
      setPoseStepIndex(0)
      setState('scanning')
    },
    [locale],
  )

  const runAnalysisFromFile = useCallback(
    async (file: File) => {
      if (uploading) return

      if (requiresAccountForAnalyze()) {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          router.push(`${prefix}/signup?next=${encodeURIComponent(analyzeReturnPath(prefix))}`)
          return
        }
      }

      setUploading(true)
      setError(null)

      const controller = new AbortController()
      const requestTimeout = window.setTimeout(() => controller.abort(), 55_000)

      try {
        const supabase = createClient()
        let imageUrl = ''

        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filename, file, { cacheControl: '3600', upsert: false })

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(uploadData.path)
          imageUrl = publicUrl
        }

        let imageBase64: string | undefined
        if (!imageUrl.trim()) {
          imageBase64 = await fileToDataUrl(file)
        }

        const photoForDisplay = imageUrl.trim() || imageBase64 || ''
        if (photoForDisplay) {
          try {
            sessionStorage.setItem('upface_photo_url', photoForDisplay)
          } catch { /* ignore */ }
        }

        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            imageUrl,
            ...(imageBase64 ? { imageBase64 } : {}),
          }),
        })

        const data = await parseAnalyzeResponse(res)

        if (!res.ok) {
          if (data.error === 'NO_FACE_DETECTED') throw new Error('no_face')
          if (data.error === 'IMAGE_REQUIRED') throw new Error('image_required')
          throw new Error(data.error ?? 'Analysis failed')
        }

        await applyAnalysisSuccess(data)
      } catch (err) {
        const msg = err instanceof Error ? err.message : ''
        const aborted = err instanceof Error && err.name === 'AbortError'
        if (aborted) {
          setError(
            locale === 'fr'
              ? 'L\'analyse a pris trop de temps. Réessaie avec une bonne connexion.'
              : 'Analysis timed out. Try again with a stable connection.',
          )
        } else if (msg === 'no_face') {
          setError(
            locale === 'fr'
              ? 'Aucun visage détecté. Assure-toi que ton visage est bien éclairé et de face.'
              : 'No face detected. Make sure your face is well lit and facing the camera.',
          )
        } else if (msg === 'image_required') {
          setError(
            locale === 'fr'
              ? 'Photo non reçue par le serveur. Réessaie ou vérifie ta connexion.'
              : 'The server did not receive your photo. Try again or check your connection.',
          )
        } else {
          setError(locale === 'fr' ? 'Une erreur est survenue. Réessaie.' : 'Something went wrong. Please try again.')
        }
        setUploading(false)
      } finally {
        window.clearTimeout(requestTimeout)
      }
    },
    [applyAnalysisSuccess, locale, prefix, router, uploading],
  )

  const runAnalysisApi = useCallback(async () => {
    const controller = new AbortController()
    const requestTimeout = window.setTimeout(() => controller.abort(), 55_000)

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

      const photoForDisplay = imageUrl.trim() || imageBase64 || ''
      if (photoForDisplay) {
        try {
          sessionStorage.setItem('upface_photo_url', photoForDisplay)
        } catch { /* ignore */ }
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          imageUrl,
          ...(imageBase64 ? { imageBase64 } : {}),
          ...(clientScoresRef.current ? { clientScores: clientScoresRef.current } : {}),
        }),
      })

      const data = await parseAnalyzeResponse(res)

      if (!res.ok) {
        if (data.error === 'NO_FACE_DETECTED') throw new Error('no_face')
        if (data.error === 'IMAGE_REQUIRED') throw new Error('image_required')
        throw new Error(data.error ?? 'Analysis failed')
      }

      await applyAnalysisSuccess(data)
    } catch (err) {
      handleAnalysisFailure(err)
    } finally {
      window.clearTimeout(requestTimeout)
    }
  }, [applyAnalysisSuccess, handleAnalysisFailure])

  const startAnalysisPhase = useCallback(() => {
    if (apiStartedRef.current || finalizeOnceRef.current) return
    finalizeOnceRef.current = true
    apiStartedRef.current = true
    apiStartedAtRef.current = performance.now()
    setFinalizing(true)
    setError(null)
    setApiProgress(0)
    void runAnalysisApi()
  }, [runAnalysisApi])

  const handlePoseValidated = useCallback(() => {
    setPoseStepIndex(prev => {
      const lastIx = SCAN_POSE_STEP_ORDER.length - 1
      if (prev >= lastIx) return prev
      const next = prev + 1
      if (next === lastIx) {
        queueMicrotask(() => startAnalysisPhase())
      }
      return next
    })
  }, [startAnalysisPhase])

  useEffect(() => {
    if (state !== 'scanning' || poseStepIndex !== SCAN_POSE_STEP_ORDER.length - 1) return
    if (!apiStartedRef.current) startAnalysisPhase()
  }, [poseStepIndex, state, startAnalysisPhase])

  useEffect(() => {
    if (!finalizing || state !== 'scanning') return

    const tick = () => {
      const elapsed = performance.now() - apiStartedAtRef.current
      setApiProgress(prev => {
        const next = Math.min(0.96, elapsed / SCAN_ESTIMATED_API_MS)
        return next > prev ? next : prev
      })
    }

    tick()
    const id = window.setInterval(tick, 80)
    return () => window.clearInterval(id)
  }, [finalizing, state])

  useEffect(() => {
    if (state === 'idle' || state === 'loading_camera' || state === 'camera_ready') {
      setPoseStepIndex(0)
    }
  }, [state])

  useEffect(() => {
    if (state !== 'scanning' && state !== 'redirecting') return
    setInstructionVisible(false)
    const id = requestAnimationFrame(() => setInstructionVisible(true))
    return () => cancelAnimationFrame(id)
  }, [poseStepIndex, state])

  const poseStepId = SCAN_POSE_STEP_ORDER[Math.min(poseStepIndex, SCAN_POSE_STEP_ORDER.length - 1)]

  const handleLandmarks = useCallback((lm: NormalizedLandmark[]) => {
    const scores = computeClientScores(lm)
    clientScoresRef.current = scores
    setClientScores(scores)
  }, [])

  const { poseMatch, holdProgress } = useFacePoseGuide({
    active: state === 'scanning',
    getVideo: getScanVideo,
    stepId: poseStepId,
    frozen: false,
    onValidated: handlePoseValidated,
    onLandmarks: handleLandmarks,
    holdMs: scanTiming.poseHoldMs,
    maxStepMs: scanTiming.maxStepMs,
  })

  const scanProgress = computeScanProgress(
    poseStepIndex,
    holdProgress,
    SCAN_POSE_STEP_ORDER.length,
    apiProgress,
  )

  const isScanning = state === 'scanning' || state === 'redirecting'
  const showLaunch = state === 'idle'

  if (showLaunch) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#080C14]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(59,130,246,0.14) 0%, transparent 70%)',
          }}
          aria-hidden
        />

        <Navbar />

        <main className="relative z-10 mx-auto flex min-h-screen max-w-[700px] flex-col items-center px-4 pb-12 pt-24">
          <div className="mb-10 text-center">
            <h1 className="font-[Outfit,sans-serif] text-[clamp(40px,7vw,64px)] font-black uppercase leading-[0.92] tracking-[-0.02em]">
              <span className="block whitespace-nowrap text-white">{t('upload_title_line1')}</span>
              <span className="block whitespace-nowrap bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {t('upload_title_line2')}
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-[480px] font-[Inter,sans-serif] text-[16px] leading-relaxed text-[#8B9DC3]">
              {t('upload_subtitle')}
            </p>
          </div>

          {error && (
            <div
              className="mb-6 w-full max-w-[480px] rounded-xl px-4 py-3 text-center text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}
            >
              {error}
            </div>
          )}

          <AnalyzeUploadScreen
            onFile={runAnalysisFromFile}
            loading={uploading}
            dropzoneLabel={t('upload_dropzone')}
            formatsLabel={t('upload_formats')}
            choosePhotoLabel={uploading ? t('upload_analyzing') : t('upload_choose')}
            footerLabel={t('upload_footer')}
            dragLabel={t('upload_drag')}
          />

          <button
            type="button"
            onClick={handleLaunchCamera}
            disabled={uploading}
            className="mt-8 font-[Inter,sans-serif] text-[13px] text-[#8B9DC3] underline-offset-4 transition-colors hover:text-white hover:underline disabled:opacity-50"
          >
            {t('camera_alt')}
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <FaceCadran
        ref={cadranRef}
        cameraActive={cameraActive}
        state={state}
        onCameraReady={handleCameraReady}
        onCameraError={handleCameraError}
        scanPoseMatch={poseMatch}
        scanHoldProgress={holdProgress}
      />

      <button
        type="button"
        onClick={handleCancelScan}
        className="absolute top-4 left-4 z-30 flex items-center justify-center rounded-full"
        style={{
          width: 40,
          height: 40,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#fff',
        }}
        aria-label={locale === 'fr' ? 'Annuler le scan' : 'Cancel scan'}
      >
        <CloseIcon />
      </button>

      {isScanning && !finalizing && (
        <ScanPoseInstructionCard stepIndex={poseStepIndex} visible={instructionVisible} />
      )}

      {error && (
        <div
          className="absolute top-24 left-4 right-4 z-30 mx-auto max-w-sm px-4 py-3 rounded-xl text-sm text-center"
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', backdropFilter: 'blur(8px)' }}
        >
          {error}
        </div>
      )}

      {(finalizing || state === 'redirecting') && (
        <div
          className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 px-6"
          style={{ background: 'rgba(8,12,20,0.72)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="w-10 h-10 rounded-full border-2 border-[rgba(6,182,212,0.35)] border-t-[#06B6D4] animate-spin"
            aria-hidden
          />
          <p className="text-sm font-semibold text-[#EEF2FF] text-center" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            {state === 'redirecting'
              ? (locale === 'fr' ? 'Ouverture des résultats…' : 'Opening results…')
              : (locale === 'fr' ? 'Analyse de ton visage…' : 'Analyzing your face…')}
          </p>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-8 pt-6 flex flex-col items-center"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)' }}
      >
        <ScanProgressBar active={isScanning} progress={scanProgress} />
        {finalizing && (
          <p className="text-xs text-center mt-2 text-[#8B9DC3]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {locale === 'fr' ? 'Analyse en cours…' : 'Analysis in progress…'}
          </p>
        )}
      </div>
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#080C14]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B82F6] border-t-transparent" />
      </div>
    }>
      <AnalyzeContent />
    </Suspense>
  )
}
