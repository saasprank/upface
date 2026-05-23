export const UPFACE_LOGO_FONT = "'Outfit', sans-serif"
export const UPFACE_LOGO_UP_COLOR = '#EEF2FF'
export const UPFACE_LOGO_UP_COLOR_DARK = '#FFFFFF'
export const UPFACE_LOGO_FACE_COLOR = '#3B82F6'
export const UPFACE_LOGO_FACE_GRADIENT = 'linear-gradient(90deg, #60A5FA 0%, #3B82F6 48%, #06B6D4 100%)'
export const UPFACE_LOGO_WEIGHT = 800

export const UPFACE_LOGO_SIZES = {
  nav: { fontSize: '20px', tracking: '0.12em', height: 26 },
  xs: { fontSize: '14px', tracking: '0.12em', height: 18 },
  sm: { fontSize: '18px', tracking: '0.12em', height: 22 },
  md: { fontSize: '22px', tracking: '0.12em', height: 28 },
  lg: { fontSize: '26px', tracking: '0.12em', height: 32 },
  xl: { fontSize: '32px', tracking: '0.12em', height: 40 },
} as const

export type UpfaceLogoSize = keyof typeof UPFACE_LOGO_SIZES
