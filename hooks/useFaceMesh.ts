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
        // Calcule le bounding box réel du visage
        let minX = 1, maxX = 0, minY = 1, maxY = 0
        for (const lm of landmarks) {
          if (lm.x < minX) minX = lm.x
          if (lm.x > maxX) maxX = lm.x
          if (lm.y < minY) minY = lm.y
          if (lm.y > maxY) maxY = lm.y
        }

        // Padding léger autour du visage
        const pad = 0.02
        minX = Math.max(0, minX - pad)
        maxX = Math.min(1, maxX + pad)
        minY = Math.max(0, minY - pad)
        maxY = Math.min(1, maxY + pad)

        // Fonction de mapping landmark → canvas (miroir X + bounding box)
        const toCanvas = (lm: NormalizedLandmark) => ({
          x: (1 - lm.x - minX) / (maxX - minX) * canvas.width,
          y: (lm.y - minY) / (maxY - minY) * canvas.height,
        })

        // Clip ellipse sur le bounding box du visage
        ctx.save()
        ctx.beginPath()
        const cx = canvas.width / 2
        const cy = canvas.height / 2
        const rx = canvas.width / 2
        const ry = canvas.height / 2
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx.clip()

        // Mesh
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
        ctx.lineWidth = 0.5
        for (const conn of FACE_MESH_CONNECTIONS) {
          const start = landmarks[conn.start]
          const end = landmarks[conn.end]
          if (!start || !end) continue
          const p1 = toCanvas(start)
          const p2 = toCanvas(end)
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }

        // Points cyan clés
        ctx.fillStyle = 'rgba(6, 182, 212, 0.9)'
        const keyPoints = [33, 263, 1, 61, 291, 199]
        for (const idx of keyPoints) {
          const pt = landmarks[idx]
          if (!pt) continue
          const p = toCanvas(pt)
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
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
