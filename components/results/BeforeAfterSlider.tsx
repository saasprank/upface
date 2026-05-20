'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

interface BeforeAfterSliderProps {
  photoUrl: string
  scoreBefore: number
  scoreAfter: number
}

function isDisplayablePhoto(url: string): boolean {
  const u = url?.trim() ?? ''
  if (!u) return false
  return (
    u.startsWith('http://') ||
    u.startsWith('https://') ||
    u.startsWith('data:image/')
  )
}

/** Masques pour suggérer un visage « amélioré » sous le flou. */
const AFTER_FACE_MASK =
  'radial-gradient(ellipse 38% 48% at 50% 38%, #000 52%, transparent 82%)'

const AFTER_JAW_MASK =
  'radial-gradient(ellipse 54% 34% at 50% 82%, #000 40%, transparent 78%)'

/** Flou progressif : fond plus doux, visage/mâchoire plus lisibles pour suggérer le potentiel. */
const AFTER_BASE_BLUR = 'blur(14px)'
const AFTER_DETAIL_BLUR = 'blur(9px)'
const AFTER_FACE_BLUR = 'blur(6px)'

function AfterPhotoLayers({ photoUrl }: { photoUrl: string }) {
  return (
    <>
      {/* Fond légèrement flouté */}
      <img
        src={photoUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: `${AFTER_BASE_BLUR} brightness(0.92) saturate(0.95)`,
          transform: 'scale(1.1)',
        }}
        draggable={false}
      />

      {/* Mâchoire légèrement affinée / redessinée */}
      <img
        src={photoUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          WebkitMaskImage: AFTER_JAW_MASK,
          maskImage: AFTER_JAW_MASK,
          transform: 'scale(1.07) scaleX(0.9)',
          transformOrigin: '50% 88%',
          filter: `${AFTER_DETAIL_BLUR} brightness(1.08) contrast(1.16) saturate(1.1)`,
        }}
        draggable={false}
      />

      {/* Visage harmonisé — zone la plus nette pour lire le potentiel */}
      <img
        src={photoUrl}
        alt="Après — potentiel"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          WebkitMaskImage: AFTER_FACE_MASK,
          maskImage: AFTER_FACE_MASK,
          transform: 'scale(1.045)',
          transformOrigin: '50% 36%',
          filter: `${AFTER_FACE_BLUR} brightness(1.14) contrast(1.1) saturate(1.2)`,
        }}
        draggable={false}
      />

      {/* Lueur cyan « potentiel » */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 42% 50% at 50% 38%, rgba(6,182,212,0.16) 0%, transparent 70%)',
        }}
      />
    </>
  )
}

export default function BeforeAfterSlider({ photoUrl, scoreBefore, scoreAfter }: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)
  const dragging = useRef(false)

  const hasPhoto = isDisplayablePhoto(photoUrl)

  const getFraction = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return position
    const raw = ((clientX - rect.left) / rect.width) * 100
    return Math.max(5, Math.min(95, raw))
  }, [position])

  const onMouseDown = () => { dragging.current = true }
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragging.current) setPosition(getFraction(e.clientX))
  }, [getFraction])
  const onMouseUp = useCallback(() => { dragging.current = false }, [])
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (dragging.current) setPosition(getFraction(e.touches[0].clientX))
  }, [getFraction])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onMouseUp)
    }
  }, [onMouseMove, onMouseUp, onTouchMove])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
      style={{ aspectRatio: '4/3', borderRadius: 16, background: '#0D1321', cursor: 'ew-resize' }}
      onMouseDown={onMouseDown}
      onTouchStart={() => { dragging.current = true }}
    >
      {/* APRÈS (droite) — photo floutée + silhouette visage/mâchoire « améliorée » */}
      <div className="absolute inset-0">
        {hasPhoto ? (
          <AfterPhotoLayers photoUrl={photoUrl} />
        ) : (
          <PlaceholderFace enhanced />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(6,182,212,0.08))' }}
        />
        <ScoreBadge score={scoreAfter} label="APRÈS" position="top-right" color="#06B6D4" />
      </div>

      {/* AVANT (gauche) — photo réelle, nette */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {hasPhoto ? (
          <img
            src={photoUrl}
            alt="Avant — ton scan"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <PlaceholderFace enhanced={false} />
        )}
        <ScoreBadge score={scoreBefore} label="AVANT" position="top-left" color="#3B82F6" />
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 pointer-events-none"
        style={{
          left: `${position}%`,
          background: 'rgba(255,255,255,0.85)',
          boxShadow: '0 0 8px rgba(255,255,255,0.4)',
        }}
      />

      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center rounded-full"
        style={{
          left: `${position}%`,
          width: 36,
          height: 36,
          background: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
          pointerEvents: 'none',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 6l-6 6 6 6M16 6l6 6-6 6"
            stroke="#3B82F6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div
        className="absolute bottom-3 right-3 text-xs font-semibold px-2 py-1 rounded-full pointer-events-none"
        style={{
          background: 'rgba(6,182,212,0.18)',
          color: '#06B6D4',
          border: '1px solid rgba(6,182,212,0.3)',
        }}
      >
        +{scoreAfter - scoreBefore} pts potentiels
      </div>
    </div>
  )
}

function ScoreBadge({
  score,
  label,
  position,
  color,
}: {
  score: number
  label: string
  position: 'top-left' | 'top-right'
  color: string
}) {
  const isLeft = position === 'top-left'
  return (
    <div
      className="absolute top-3 flex items-baseline gap-1 px-2.5 py-1.5 rounded-xl text-white pointer-events-none z-10"
      style={{
        [isLeft ? 'left' : 'right']: 12,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        border: `1px solid ${color}44`,
      }}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{label}</span>
      <span className="text-base font-black" style={{ color }}>{score}</span>
      <span className="text-[10px] text-white/50">/100</span>
    </div>
  )
}

function PlaceholderFace({ enhanced }: { enhanced: boolean }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: enhanced
          ? 'linear-gradient(160deg, #0f1729 0%, #0a1628 50%, #061018 100%)'
          : '#0D1321',
        filter: enhanced ? 'blur(12px) brightness(1.08)' : 'none',
      }}
    >
      <svg width="80" height="100" viewBox="0 0 100 127" fill="none">
        <path
          d="M 50 6 C 77 6 97 29 96.5 54 C 96 79 83 107 63 119 C 56 124 44 124 37 119 C 17 107 4 79 3.5 54 C 3 29 23 6 50 6 Z"
          fill={enhanced ? 'rgba(6,182,212,0.12)' : 'rgba(59,130,246,0.08)'}
          stroke={enhanced ? 'rgba(6,182,212,0.35)' : 'rgba(59,130,246,0.25)'}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )
}
