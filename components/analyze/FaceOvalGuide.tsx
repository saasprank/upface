'use client'

import ScanAnimation from '@/components/ui/ScanAnimation'
import ProtectImageArea from '@/components/ui/ProtectImageArea'

/** Même cadran ovale que la landing MVP — une seule source de vérité. */
export const FACE_OVAL_FRAME_CLASS = 'w-full max-w-[260px] sm:max-w-[300px] aspect-[3/4]'

const OVAL_STROKE_IDLE_DARK = 'rgba(238,242,255,0.75)'
const OVAL_STROKE_IDLE_LIGHT = 'rgba(59,130,246,0.35)'
/** Cyan SaaS — même teinte que la ligne de scan et le dégradé produit. */
const SCAN_BRAND_ACCENT = '#06B6D4'

function mixHex(from: string, to: string, t: number): string {
  const clamp = Math.max(0, Math.min(1, t))
  const parse = (hex: string) => {
    const h = hex.replace('#', '')
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ] as const
  }
  const [r1, g1, b1] = parse(from)
  const [r2, g2, b2] = parse(to)
  const r = Math.round(r1 + (r2 - r1) * clamp)
  const g = Math.round(g1 + (g2 - g1) * clamp)
  const b = Math.round(b1 + (b2 - b1) * clamp)
  return `rgb(${r}, ${g}, ${b})`
}

function getOvalValidationStyle(poseMatch: boolean, holdProgress: number, idleStroke: string) {
  const strokeColor = poseMatch
    ? mixHex(idleStroke.startsWith('rgba') ? '#64748B' : idleStroke, SCAN_BRAND_ACCENT, 0.25 + holdProgress * 0.75)
    : idleStroke

  const glowAlpha = poseMatch ? 0.15 + holdProgress * 0.55 : 0
  const glowSpread = poseMatch ? 6 + holdProgress * 22 : 0

  return {
    strokeColor,
    strokeWidth: poseMatch ? 2 + holdProgress * 1.5 : 2,
    ringGlow: poseMatch
      ? `0 0 ${glowSpread}px ${SCAN_BRAND_ACCENT}${Math.round(glowAlpha * 255).toString(16).padStart(2, '0')}`
      : 'none',
    ringOpacity: poseMatch ? 0.35 + holdProgress * 0.65 : 0,
  }
}

function OvalSvg({
  className = '',
  stroke = OVAL_STROKE_IDLE_DARK,
  strokeWidth = 2,
  glow = 'none',
}: {
  className?: string
  stroke?: string
  strokeWidth?: number
  glow?: string
}) {
  return (
    <svg
      viewBox="0 0 240 320"
      className={`w-full h-full ${className}`}
      fill="none"
      aria-hidden
      style={{ filter: glow !== 'none' ? `drop-shadow(${glow})` : undefined }}
    >
      <ellipse cx="120" cy="160" rx="98" ry="138" stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  )
}

/** Fenêtre ovale alignée sur OvalSvg (viewBox 240×320, ellipse rx=98 ry=138). */
const OVAL_WINDOW_INSET = '6.875% 9.17%'

/** Ombre portée assez large pour recouvrir tout l'écran autour du cadran. */
const SCAN_VIGNETTE_SHADOW = '0 0 0 100vmax rgba(0,0,0,0.92)'

interface FaceOvalGuideProps {
  alignLabel: string
  className?: string
  exampleImageSrc?: string
  variant?: 'light' | 'dark'
}

export interface FaceOvalScanOverlayProps extends FaceOvalGuideProps {
  poseMatch?: boolean
  holdProgress?: number
}

/** Cadran statique (landing, écran pré-scan). */
export default function FaceOvalGuide({
  alignLabel,
  className = '',
  exampleImageSrc,
  variant = 'dark',
}: FaceOvalGuideProps) {
  const isLight = variant === 'light'
  const idleStroke = isLight ? OVAL_STROKE_IDLE_LIGHT : OVAL_STROKE_IDLE_DARK
  const content = (
    <>
      {exampleImageSrc && (
        <div
          className="absolute overflow-hidden pointer-events-none"
          style={{ inset: '6% 11%', borderRadius: '50%' }}
        >
          <div
            role="img"
            aria-hidden
            className="absolute inset-0 bg-cover bg-top scale-[1.06] pointer-events-none"
            style={{ backgroundImage: `url(${exampleImageSrc})` }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(8,12,20,0.25) 0%, transparent 28%, transparent 72%, rgba(8,12,20,0.35) 100%)',
            }}
          />
        </div>
      )}
      <OvalSvg className="relative z-[1]" stroke={idleStroke} />
      <p
        className={`absolute left-0 right-0 top-[52%] z-[2] text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-center ${isLight ? 'text-muted' : 'text-[#8B9DC3]'}`}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {alignLabel}
      </p>
    </>
  )

  if (exampleImageSrc) {
    return (
      <ProtectImageArea className={`mx-auto ${FACE_OVAL_FRAME_CLASS} ${className}`}>
        {content}
      </ProtectImageArea>
    )
  }

  return <div className={`relative mx-auto ${FACE_OVAL_FRAME_CLASS} ${className}`}>{content}</div>
}

/** Overlay plein écran pendant le scan — vignette sombre + ligne d'analyse animée. */
export function FaceOvalScanOverlay({
  alignLabel,
  poseMatch = false,
  holdProgress = 0,
}: FaceOvalScanOverlayProps) {
  const validation = getOvalValidationStyle(poseMatch, holdProgress, OVAL_STROKE_IDLE_DARK)

  return (
    <div className="pointer-events-none fixed inset-0 z-[5]">
      <div
        className="absolute inset-0 flex items-center justify-center px-4"
        style={{
          paddingTop: 'clamp(132px, 18vh, 168px)',
          paddingBottom: 'clamp(96px, 22vh, 160px)',
        }}
      >
        <div className={`relative ${FACE_OVAL_FRAME_CLASS}`}>
          <div
            className="absolute z-[1] pointer-events-none"
            style={{
              inset: OVAL_WINDOW_INSET,
              borderRadius: '50%',
              boxShadow: SCAN_VIGNETTE_SHADOW,
            }}
            aria-hidden
          />
          <div
            className="absolute z-[2] overflow-hidden pointer-events-none"
            style={{ inset: OVAL_WINDOW_INSET, borderRadius: '50%' }}
          >
            <ScanAnimation fill />
          </div>
          <div
            className="absolute z-[3] pointer-events-none"
            style={{
              inset: OVAL_WINDOW_INSET,
              borderRadius: '50%',
              border: `2px solid ${SCAN_BRAND_ACCENT}`,
              opacity: validation.ringOpacity,
              boxShadow: validation.ringGlow,
              transition: 'opacity 0.15s linear, box-shadow 0.15s linear',
            }}
            aria-hidden
          />
          <OvalSvg
            className="relative z-[4]"
            stroke={validation.strokeColor}
            strokeWidth={validation.strokeWidth}
            glow={validation.ringGlow !== 'none' ? validation.ringGlow : 'none'}
          />
          <p
            className="absolute left-0 right-0 top-[52%] z-[5] text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-center transition-colors duration-200"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: poseMatch ? SCAN_BRAND_ACCENT : '#8B9DC3',
            }}
          >
            {alignLabel}
          </p>
        </div>
      </div>
    </div>
  )
}
