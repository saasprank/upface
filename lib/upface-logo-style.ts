export const UPFACE_WORDMARK_SRC = '/upface-wordmark.png'

export const UPFACE_LOGO_SIZES = {
  xs: { fontSize: '0.875rem', tracking: '0.1em' },
  sm: { fontSize: '1.125rem', tracking: '0.1em' },
  md: { fontSize: '1.5rem', tracking: '0.1em' },
  lg: { fontSize: '1.875rem', tracking: '0.1em' },
  xl: { fontSize: '2.25rem', tracking: '0.1em' },
} as const

export type UpfaceLogoSize = keyof typeof UPFACE_LOGO_SIZES
