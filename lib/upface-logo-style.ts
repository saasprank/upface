export const UPFACE_WORDMARK_SRC = '/upface-wordmark.png'

export const UPFACE_LOGO_SIZES = {
  xs: { width: 68, height: 17 },
  sm: { width: 84, height: 21 },
  md: { width: 104, height: 26 },
  lg: { width: 128, height: 32 },
  xl: { width: 160, height: 40 },
} as const

export type UpfaceLogoSize = keyof typeof UPFACE_LOGO_SIZES
