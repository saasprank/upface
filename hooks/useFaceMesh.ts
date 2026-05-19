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
        // Dessine le mesh triangulaire style FaceKit
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
        ctx.lineWidth = 0.5

        for (const conn of FACE_MESH_CONNECTIONS) {
          const start = landmarks[conn.start]
          const end = landmarks[conn.end]
          if (!start || !end) continue
          // Mirror X car la vidéo est en miroir CSS
          const x1 = (1 - start.x) * canvas.width
          const y1 = start.y * canvas.height
          const x2 = (1 - end.x) * canvas.width
          const y2 = end.y * canvas.height
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }

        // Points clés en cyan comme FaceKit
        ctx.fillStyle = 'rgba(6, 182, 212, 0.8)'
        const keyPoints = [33, 263, 1, 61, 291, 199, 94, 0, 24, 130, 359]
        for (const idx of keyPoints) {
          const pt = landmarks[idx]
          if (!pt) continue
          const x = (1 - pt.x) * canvas.width
          const y = pt.y * canvas.height
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
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
