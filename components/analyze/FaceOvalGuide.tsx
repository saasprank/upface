'use client'

import ProtectImageArea from '@/components/ui/ProtectImageArea'

/** Même cadran ovale que la landing MVP — une seule source de vérité. */
export const FACE_OVAL_FRAME_CLASS = 'w-full max-w-[260px] sm:max-w-[300px] aspect-[3/4]'

const OVAL_STROKE = 'rgba(238,242,255,0.75)'
const GUIDE_LINE = '#06B6D4'

interface FaceOvalGuideProps {
  alignLabel: string
  className?: string
  exampleImageSrc?: string
}

function OvalSvg({ className = '', showGuideLine = true }: { className?: string; showGuideLine?: boolean }) {
  return (
    <svg viewBox="0 0 240 320" className={`w-full h-full ${className}`} fill="none" aria-hidden>
      <ellipse cx="120" cy="160" rx="98" ry="138" stroke={OVAL_STROKE} strokeWidth="2" />
      {showGuideLine && (
        <line
          x1="28"
          y1="162"
          x2="212"
          y2="162"
          stroke={GUIDE_LINE}
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />
      )}
    </svg>
  )
}

/** Cadran statique (landing, écran pré-scan). */
export default function FaceOvalGuide({
  alignLabel,
  className = '',
  exampleImageSrc,
}: FaceOvalGuideProps) {
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
      <OvalSvg className="relative z-[1]" showGuideLine={!exampleImageSrc} />
      <p
        className="absolute left-0 right-0 top-[52%] z-[2] text-[9px] sm:text-[10px] tracking-[0.18em] text-[#8B9DC3] uppercase text-center"
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

/** Overlay plein écran pendant le scan — vidéo visible dans l’ovale uniquement. */
export function FaceOvalScanOverlay({ alignLabel }: FaceOvalGuideProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center px-4"
      style={{ paddingBottom: 'clamp(96px, 22vh, 160px)' }}
    >
      <div className={`relative ${FACE_OVAL_FRAME_CLASS}`}>
        <div
          className="absolute inset-0 rounded-[50%]"
          style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.72)' }}
          aria-hidden
        />
        <OvalSvg className="relative z-[1]" />
        <p
          className="absolute left-0 right-0 top-[52%] z-[2] text-[9px] sm:text-[10px] tracking-[0.18em] text-[#8B9DC3] uppercase text-center"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {alignLabel}
        </p>
      </div>
    </div>
  )
}
