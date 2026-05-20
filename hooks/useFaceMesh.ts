'use client'

import { useEffect, useRef } from 'react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

const MEDIAPIPE_VERSION = '0.10.35'
const WASM_CDN_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`
const MODEL_PATH = '/models/face_landmarker.task'

const FACE_MESH_CONNECTIONS = FaceLandmarker.FACE_LANDMARKS_TESSELATION

export function useFaceMesh(
  active: boolean,
  getVideo: () => HTMLVideoElement | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const landmarkerRef = useRef<FaceLandmarker | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    let cancelled = false

    async function boot() {
      try {
        const wasm = await FilesetResolver.forVisionTasks(WASM_CDN_BASE)
        const res = await fetch(MODEL_PATH)
        const buf = new Uint8Array(await res.arrayBuffer())
        const lm = await FaceLandmarker.createFromOptions(wasm, {
          baseOptions: { modelAssetBuffer: buf, delegate: 'CPU' },
          runningMode: 'VIDEO',
          numFaces: 1,
          minFacePresenceConfidence: 0.42,
          minTrackingConfidence: 0.42,
          outputFaceBlendshapes: false,
        })
        if (cancelled) { lm.close(); return }
        landmarkerRef.current = lm
      } catch (e) {
        console.error('[useFaceMesh] init failed:', e)
      }
    }

    void boot()

    const loop = () => {
      if (cancelled) return
      const landmarker = landmarkerRef.current
      const video = getVideo()
      const canvas = canvasRef.current
      if (!landmarker || !video || !canvas || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) { rafRef.current = requestAnimationFrame(loop); return }

      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let landmarks: NormalizedLandmark[] | undefined
      try {
        landmarks = landmarker.detectForVideo(video, performance.now()).faceLandmarks?.[0]
      } catch {
        rafRef.current = requestAnimationFrame(loop)
        return
      }

      if (landmarks && landmarks.length > 0) {
        const toX = (lm: NormalizedLandmark) => (1 - lm.x) * canvas.width
        const toY = (lm: NormalizedLandmark) => lm.y * canvas.height

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'
        ctx.lineWidth = 0.5

        for (const conn of FACE_MESH_CONNECTIONS) {
          const s = landmarks[conn.start]
          const e = landmarks[conn.end]
          if (!s || !e) continue
          ctx.beginPath()
          ctx.moveTo(toX(s), toY(s))
          ctx.lineTo(toX(e), toY(e))
          ctx.stroke()
        }

        const KEY = [33, 263, 1, 61, 291, 168, 10, 152]
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
        ctx.shadowBlur = 4
        for (const idx of KEY) {
          const pt = landmarks[idx]
          if (!pt) continue
          ctx.beginPath()
          ctx.arc(toX(pt), toY(pt), 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.shadowBlur = 0
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      landmarkerRef.current?.close()
      landmarkerRef.current = null
    }
  }, [active, getVideo, canvasRef])
}
