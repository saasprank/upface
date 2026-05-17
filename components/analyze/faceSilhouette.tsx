/**
 * Silhouette visage type overlay IA — viewBox 0 0 100 × 127.
 * Front / temples larges, léger resserrement mi-visage, mâchoire qui descend puis menton arrondi étroit.
 */
export const FACE_SILHOUETTE_PATH_USER =
  'M 50 5.5 C 68 5.5 82 10 90 22 C 96 34 97 48 95 62 C 92 82 82 100 66 114 C 58 120 54 123 50 123.8 C 46 123 42 120 34 114 C 18 100 8 82 5 62 C 3 48 4 34 10 22 C 18 10 32 5.5 50 5.5 Z'

/** clipPathUnits="objectBoundingBox" — équivalent mathématique de PATH_USER */
export const FACE_SILHOUETTE_PATH_BB =
  'M 0.5 0.04330708661417323 C 0.68 0.04330708661417323 0.82 0.07874015748031496 0.9 0.1732283464566929 C 0.96 0.2677165354330709 0.97 0.3779527559055118 0.95 0.4881889763779528 C 0.92 0.6456692913385826 0.82 0.7874015748031495 0.66 0.8976377952755905 C 0.58 0.9448818897637795 0.54 0.968503937007874 0.5 0.9748031496062992 C 0.46 0.968503937007874 0.42 0.9448818897637795 0.34 0.8976377952755905 C 0.18 0.7874015748031495 0.08 0.6456692913385826 0.05 0.4881889763779528 C 0.03 0.3779527559055118 0.04 0.2677165354330709 0.1 0.1732283464566929 C 0.18 0.07874015748031496 0.32 0.04330708661417323 0.5 0.04330708661417323 Z'

export const FACE_SILHOUETTE_VIEWBOX = '0 0 100 127'

interface FaceSilhouetteDefsProps {
  uid: string
}

export function faceClipUrl(uid: string) {
  return `url(#${uid}-face-clip)`
}

export function FaceSilhouetteDefs({ uid }: FaceSilhouetteDefsProps) {
  const clipId = `${uid}-face-clip`
  const gradId = `${uid}-face-grad`
  const glowFilterId = `${uid}-face-glow`

  return (
    <svg width={0} height={0} aria-hidden style={{ position: 'absolute', overflow: 'hidden' }}>
      <defs>
        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
          <path d={FACE_SILHOUETTE_PATH_BB} />
        </clipPath>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}
