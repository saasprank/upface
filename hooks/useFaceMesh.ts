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
  getVideoBounds: () => DOMRect | null,
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
        const canvasBounds = canvas.getBoundingClientRect()
        const videoBounds = getVideoBounds()
        if (!videoBounds) { rafRef.current = requestAnimationFrame(loop); return }

        // Offset du video dans le canvas
        const offsetX = videoBounds.left - canvasBounds.left
        const offsetY = videoBounds.top - canvasBounds.top
        const vW = videoBounds.width
        const vH = videoBounds.height

        // Coordonnées landmark → canvas (miroir X car vidéo CSS mirrored)
        const toX = (lm: NormalizedLandmark) => offsetX + (1 - lm.x) * vW
        const toY = (lm: NormalizedLandmark) => offsetY + lm.y * vH

        // Mesh
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
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

        // Points cyan avec glow
        const KEY = [33, 263, 1, 61, 291, 168, 10, 152, 234, 454]
        ctx.fillStyle = 'rgba(6, 182, 212, 1)'
        ctx.shadowColor = '#06B6D4'
        ctx.shadowBlur = 8
        for (const idx of KEY) {
          const pt = landmarks[idx]
          if (!pt) continue
          ctx.beginPath()
          ctx.arc(toX(pt), toY(pt), 2.5, 0, Math.PI * 2)
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
  }, [active, getVideo, canvasRef, getVideoBounds])
}
