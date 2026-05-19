'use client'

import { useEffect, useRef } from 'react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

const MEDIAPIPE_VERSION = '0.10.35'
const WASM_CDN_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`
const MODEL_PATH = '/models/face_landmarker.task'

// Connexions du mesh facial MediaPipe (468 points)
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
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
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
      } catch { rafRef.current = requestAnimationFrame(loop); return }

      if (landmarks && landmarks.length > 0) {
        const W = canvas.width
        const H = canvas.height

        // Clip en forme de goutte directement dans le canvas
        ctx.save()
        ctx.beginPath()
        // Forme ovale centrée qui approxime le cadran goutte
        const cx = W * 0.5
        const cy = H * 0.46
        const rx = W * 0.42
        const ry = H * 0.44
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx.clip()

        // Mesh
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'
        ctx.lineWidth = 0.4
        for (const conn of FACE_MESH_CONNECTIONS) {
          const start = landmarks[conn.start]
          const end = landmarks[conn.end]
          if (!start || !end) continue
          ctx.beginPath()
          ctx.moveTo((1 - start.x) * W, start.y * H)
          ctx.lineTo((1 - end.x) * W, end.y * H)
          ctx.stroke()
        }

        // Points cyan
        ctx.fillStyle = 'rgba(6, 182, 212, 0.9)'
        for (const idx of [33, 263, 1, 61, 291, 199]) {
          const pt = landmarks[idx]
          if (!pt) continue
          ctx.beginPath()
          ctx.arc((1 - pt.x) * W, pt.y * H, 1.5, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
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
