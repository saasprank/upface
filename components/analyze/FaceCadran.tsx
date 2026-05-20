'use client'

import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useTranslations } from 'next-intl'

export type AnalyzeState = 'idle' | 'loading_camera' | 'camera_ready' | 'scanning' | 'redirecting'

export interface FaceCadranHandle {
  captureFrame: () => Promise<File | null>
  /** Élément vidéo brute (sans miroir CSS) pour MediaPipe VIDEO */
  getVideo: () => HTMLVideoElement | null
}

export type CameraErrorCode = 'denied' | 'not_found' | 'generic'

interface FaceCadranProps {
  cameraActive: boolean
  state: AnalyzeState
  onCameraReady: () => void
  onCameraError: (code: CameraErrorCode) => void
}

const FaceCadran = forwardRef<FaceCadranHandle, FaceCadranProps>(
  function FaceCadran({ cameraActive, state, onCameraReady, onCameraError }, ref) {
    const t = useTranslations('analyzeLive')

    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    useEffect(() => {
      if (!cameraActive) {
        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
        const v = videoRef.current
        if (v) v.srcObject = null
        return
      }

      let cancelled = false

      async function startCamera() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          })
          if (cancelled) {
            stream.getTracks().forEach(t => t.stop())
            return
          }
          streamRef.current = stream
          const video = videoRef.current
          if (video) {
            video.srcObject = stream
            video.onloadedmetadata = () => {
              if (!cancelled) onCameraReady()
            }
          }
        } catch (err) {
          if (cancelled) return
          const name = (err as Error).name
          if (name === 'NotAllowedError') {
            onCameraError('denied')
          } else if (name === 'NotFoundError') {
            onCameraError('not_found')
          } else {
            onCameraError('generic')
          }
        }
      }

      startCamera()

      return () => {
        cancelled = true
        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
        const v = videoRef.current
        if (v) v.srcObject = null
      }
    }, [cameraActive, onCameraReady, onCameraError])

    useImperativeHandle(ref, () => ({
      getVideo: (): HTMLVideoElement | null => videoRef.current,
      async captureFrame(): Promise<File | null> {
        const video = videoRef.current
        if (!video || video.readyState < 2) return null
        const canvas = document.createElement('canvas')
        canvas.width  = video.videoWidth  || 640
        canvas.height = video.videoHeight || 480
        const ctx = canvas.getContext('2d')
        if (!ctx) return null
        ctx.drawImage(video, 0, 0)
        return new Promise(resolve => {
          canvas.toBlob(
            blob => resolve(blob ? new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' }) : null),
            'image/jpeg',
            0.92,
          )
        })
      },
    }))

    const isLoading = state === 'loading_camera'
    const showVideo = cameraActive && (state === 'camera_ready' || state === 'scanning' || state === 'redirecting')

    if (!cameraActive) return null

    return (
      <div
        className="fixed inset-0"
        style={{ background: '#000', zIndex: 0 }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            position: 'absolute',
            inset: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            transform: 'scaleX(-1)',
            opacity: showVideo ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {isLoading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              background: '#000',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.15)',
                borderTopColor: '#fff',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p style={{ fontSize: 14, color: '#8B9DC3', fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '0 24px' }}>
              {t('cameraStarting')}
            </p>
          </div>
        )}
      </div>
    )
  }
)

export default FaceCadran
