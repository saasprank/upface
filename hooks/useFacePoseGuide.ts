'use client'

import { useEffect, useRef, useState } from 'react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import {
  computeRawPoseSignals,
  getPoseHintKey,
  landmarksUsable,
  poseMatchesStep,
  smoothPoseSignals,
  type PoseSmoothState,
  type PoseStepId,
} from '@/lib/face-pose-heuristics'

const MEDIAPIPE_VERSION = '0.10.35'
const WASM_CDN_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`
const MODEL_PATH = '/models/face_landmarker.task'

const STABLE_HOLD_MS = 520

interface UseFacePoseGuideOptions {
  active: boolean
  getVideo: () => HTMLVideoElement | null
  stepId: PoseStepId
  frozen: boolean
  onValidated: () => void
  onLandmarks?: (landmarks: NormalizedLandmark[]) => void
}

interface UseFacePoseGuideResult {
  faceDetected: boolean
  poseMatch: boolean
  holdProgress: number
  poseHintKey: string | null
}

export function useFacePoseGuide({
  active,
  getVideo,
  stepId,
  frozen,
  onValidated,
  onLandmarks,
}: UseFacePoseGuideOptions): UseFacePoseGuideResult {
  const [faceDetected, setFaceDetected] = useState(false)
  const [poseMatch, setPoseMatch] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [poseHintKey, setPoseHintKey] = useState<string | null>(null)

  const smoothRef = useRef<PoseSmoothState | null>(null)
  const prevPoseMatchRef = useRef(false)
  const stableStartedAtRef = useRef<number | null>(null)
  const emittedForStepRef = useRef<PoseStepId | null>(null)
  const landmarkerRef = useRef<FaceLandmarker | null>(null)
  const rafRef = useRef<number | null>(null)

  const stepIdRef = useRef(stepId)
  const frozenRef = useRef(frozen)
  const onValidatedRef = useRef(onValidated)
  const onLandmarksRef = useRef(onLandmarks)

  stepIdRef.current = stepId
  frozenRef.current = frozen
  onValidatedRef.current = onValidated
  onLandmarksRef.current = onLandmarks

  useEffect(() => {
    smoothRef.current = null
    prevPoseMatchRef.current = false
    stableStartedAtRef.current = null
    emittedForStepRef.current = null
    setHoldProgress(0)
    setPoseMatch(false)
    setPoseHintKey(null)
  }, [stepId])

  useEffect(() => {
    if (!active) {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      const lm = landmarkerRef.current
      landmarkerRef.current = null
      if (lm) {
        try {
          lm.close()
        } catch { /* noop */ }
      }
      setFaceDetected(false)
      setPoseMatch(false)
      setHoldProgress(0)
      stableStartedAtRef.current = null
      return
    }

    let cancelled = false

    async function boot() {
      try {
        const wasm = await FilesetResolver.forVisionTasks(WASM_CDN_BASE)
        const res = await fetch(MODEL_PATH)
        if (!res.ok) throw new Error(`Model fetch failed: ${res.status}`)
        const buf = new Uint8Array(await res.arrayBuffer())
        const lm = await FaceLandmarker.createFromOptions(wasm, {
          baseOptions: {
            modelAssetBuffer: buf,
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          minFacePresenceConfidence: 0.38,
          minTrackingConfidence: 0.38,
          outputFaceBlendshapes: false,
        })

        if (cancelled) {
          lm.close()
          return
        }
        landmarkerRef.current = lm
      } catch (e) {
        console.error('[useFacePoseGuide] init failed:', e)
      }
    }

    void boot()

    const loop = () => {
      if (cancelled) return

      const landmarker = landmarkerRef.current
      const video = getVideo()

      if (!landmarker || !video || video.readyState < 2 || video.videoWidth < 80) {
        setFaceDetected(false)
        stableStartedAtRef.current = null
        setHoldProgress(0)
        setPoseMatch(false)
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      let lmLm: NormalizedLandmark[] | undefined
      try {
        lmLm = landmarker.detectForVideo(video, performance.now()).faceLandmarks?.[0]
      } catch (e) {
        console.warn('[useFacePoseGuide] detect:', e)
        setFaceDetected(false)
        stableStartedAtRef.current = null
        setHoldProgress(0)
        setPoseMatch(false)
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      if (!landmarksUsable(lmLm)) {
        setFaceDetected(false)
        stableStartedAtRef.current = null
        setHoldProgress(0)
        setPoseMatch(false)
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      setFaceDetected(true)

      if (lmLm) onLandmarksRef.current?.(lmLm)

      const raw = computeRawPoseSignals(lmLm as NormalizedLandmark[])
      if (!raw) {
        stableStartedAtRef.current = null
        setHoldProgress(0)
        setPoseMatch(false)
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      const smooth = smoothPoseSignals(smoothRef.current, raw.yaw, raw.pitchT)
      smoothRef.current = smooth

      const sidEmit = stepIdRef.current
      const matchNow = poseMatchesStep(sidEmit, smooth, prevPoseMatchRef.current)
      prevPoseMatchRef.current = matchNow
      setPoseMatch(matchNow)
      setPoseHintKey(getPoseHintKey(sidEmit, smooth, matchNow))

      /** Évite un second appel avant que React applique `stepIdx` suivant */
      if (matchNow && emittedForStepRef.current === sidEmit) {
        setHoldProgress(1)
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      const isFrozen = frozenRef.current

      const now = performance.now()
      if (!matchNow || isFrozen) {
        stableStartedAtRef.current = null
        setHoldProgress(0)
      } else {
        if (stableStartedAtRef.current == null) stableStartedAtRef.current = now
        const elapsed = now - stableStartedAtRef.current
        const p = Math.min(1, elapsed / STABLE_HOLD_MS)
        setHoldProgress(p)
        if (elapsed >= STABLE_HOLD_MS) {
          emittedForStepRef.current = sidEmit
          stableStartedAtRef.current = null
          setHoldProgress(0)
          onValidatedRef.current()
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelled = true
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      const lm = landmarkerRef.current
      landmarkerRef.current = null
      if (lm) {
        try {
          lm.close()
        } catch { /* noop */ }
      }
      setFaceDetected(false)
      setPoseMatch(false)
      setHoldProgress(0)
    }
  }, [active, getVideo])

  return { faceDetected, poseMatch, holdProgress, poseHintKey }
}
