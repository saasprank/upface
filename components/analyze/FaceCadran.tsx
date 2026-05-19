'use client'

import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import type { CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import {
  FaceSilhouetteDefs,
  faceClipUrl,
  FACE_SILHOUETTE_PATH_USER,
  FACE_SILHOUETTE_VIEWBOX,
} from '@/components/analyze/faceSilhouette'

export type AnalyzeState = 'idle' | 'loading_camera' | 'camera_ready' | 'scanning' | 'redirecting'

export interface FaceCadranHandle {
  captureFrame: () => Promise<File | null>
  /** Élément vidéo brute (sans miroir CSS) pour MediaPipe VIDEO */
  getVideo: () => HTMLVideoElement | null
  getVideoBounds: () => DOMRect | null
}

export type CameraErrorCode = 'denied' | 'not_found' | 'generic'

interface FaceCadranProps {
  /** Stable id for SVG clipPath defs (shared with FaceLandmarks overlay on the page). */
  maskUid: string
  cameraActive: boolean
  state: AnalyzeState
  onCameraReady: () => void
  onCameraError: (code: CameraErrorCode) => void
}

const FaceCadran = forwardRef<FaceCadranHandle, FaceCadranProps>(
  function FaceCadran({ maskUid, cameraActive, state, onCameraReady, onCameraError }, ref) {
    const t = useTranslations('analyzeLive')

    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    const clip = faceClipUrl(maskUid)
    const gradRef = `url(#${maskUid}-face-grad)`
    const glowRef = `url(#${maskUid}-face-glow)`

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
      getVideoBounds: () => videoRef.current?.getBoundingClientRect() ?? null,
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

    const isLoading   = state === 'loading_camera'
    const isScanning  = state === 'scanning' || state === 'redirecting'
    // Camera feed stays visible through the whole active session (camera_ready, scanning, redirecting)
    const showVideo   = cameraActive && (state === 'camera_ready' || state === 'scanning' || state === 'redirecting')
    const showGuides  = cameraActive && state === 'camera_ready'

    const outerGlow = isScanning
      ? 'drop-shadow(0 0 22px rgba(6,182,212,0.55)) drop-shadow(0 0 44px rgba(59,130,246,0.2))'
      : 'drop-shadow(0 0 18px rgba(59,130,246,0.35)) drop-shadow(0 0 36px rgba(6,182,212,0.12))'

    const clipStyle: CSSProperties = {
      clipPath: clip,
      WebkitClipPath: clip,
    }

    return (
      <div
        className="w-[200px] h-[255px] sm:w-[250px] sm:h-[320px]"
        style={{ position: 'relative', filter: outerGlow, transition: 'filter 0.5s ease' }}
      >
        <FaceSilhouetteDefs uid={maskUid} />

        {/* Vidéo & états — découpés silhouette */}
        <div
          style={{
            ...clipStyle,
            position: 'absolute',
            inset: 0,
            background: '#080C14',
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)',
              opacity: showVideo ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          />

          {!cameraActive && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 14,
              padding: '0 20px',
            }}>
              <PlaceholderCameraIcon />
              <p style={{
                fontSize: 12,
                color: '#6B7C99',
                fontFamily: 'Inter, sans-serif',
                textAlign: 'center',
                lineHeight: 1.45,
              }}>
                {t('placeholder')}
              </p>
            </div>
          )}

          {cameraActive && isLoading && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '2px solid rgba(59,130,246,0.15)',
                borderTopColor: '#3B82F6',
                animation: 'spin 1s linear infinite',
              }} />
              <p style={{ fontSize: 13, color: '#8B9DC3', fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '0 20px' }}>
                {t('cameraStarting')}
              </p>
            </div>
          )}

          {showGuides && (
            <div style={{
              position: 'absolute',
              insetInline: 0, height: 1,
              top: '38%',
              background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.22), transparent)',
              animation: 'faceScanLine 2.5s linear infinite',
              pointerEvents: 'none',
            }} />
          )}

          {isScanning && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,12,20,0.25)', pointerEvents: 'none' }} />
          )}
        </div>

        {/* Contour néon + halo (SVG) */}
        <svg
          className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
          style={{ zIndex: 10 }}
          viewBox={FACE_SILHOUETTE_VIEWBOX}
          preserveAspectRatio="none"
          aria-hidden
        >
          {/* Halos empilés (effet néon multi-trait) */}
          <path
            d={FACE_SILHOUETTE_PATH_USER}
            fill="none"
            stroke="#38BDF8"
            strokeOpacity={isScanning ? 0.22 : 0.16}
            strokeWidth={isScanning ? 6 : 5}
            vectorEffect="non-scaling-stroke"
            filter={glowRef}
          />
          <path
            d={FACE_SILHOUETTE_PATH_USER}
            fill="none"
            stroke="#22D3EE"
            strokeOpacity={isScanning ? 0.5 : 0.38}
            strokeWidth={isScanning ? 4 : 3.2}
            vectorEffect="non-scaling-stroke"
            filter={glowRef}
          />
          <path
            d={FACE_SILHOUETTE_PATH_USER}
            fill="none"
            stroke={gradRef}
            strokeWidth={1.65}
            vectorEffect="non-scaling-stroke"
          />
          {/* Guide intérieur léger */}
          {showGuides && (
            <g transform="translate(50 62.8) scale(0.87) translate(-50 -62.8)">
              <path
                d={FACE_SILHOUETTE_PATH_USER}
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth={0.55}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          )}
        </svg>

        {/* Textes — au-dessus du trait, toujours découpés */}
        {showGuides && (
          <div
            style={{
              ...clipStyle,
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0 12px 18px',
              background: 'linear-gradient(to top, rgba(8,12,20,0.82) 0%, rgba(8,12,20,0.35) 38%, transparent 62%)',
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: '#EEF2FF', fontFamily: 'Satoshi, sans-serif', textAlign: 'center' }}>
              {t('face_hint_1')}
            </p>
            <p style={{ fontSize: 11, color: '#8B9DC3', fontFamily: 'Inter, sans-serif', marginTop: 4, textAlign: 'center' }}>
              {t('face_hint_2')}
            </p>
          </div>
        )}
      </div>
    )
  }
)

function PlaceholderCameraIcon() {
  return (
    <div style={{
      width: 56, height: 56, borderRadius: 16,
      background: 'rgba(59,130,246,0.08)',
      border: '1px solid rgba(59,130,246,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    </div>
  )
}

export default FaceCadran
