'use client'

import Link from 'next/link'
import {
  UPFACE_LOGO_FACE_COLOR,
  UPFACE_LOGO_FACE_GRADIENT,
  UPFACE_LOGO_FONT,
  UPFACE_LOGO_SIZES,
  UPFACE_LOGO_UP_COLOR,
  UPFACE_LOGO_UP_COLOR_DARK,
  UPFACE_LOGO_WEIGHT,
  type UpfaceLogoSize,
} from '@/lib/upface-logo-style'

type UpfaceLogoProps = {
  size?: UpfaceLogoSize
  href?: string
  className?: string
  variant?: 'light' | 'dark'
}

export default function UpfaceLogo({
  size = 'md',
  href,
  className = '',
  variant = 'dark',
}: UpfaceLogoProps) {
  const { fontSize, tracking, height } = UPFACE_LOGO_SIZES[size]
  const isDark = variant === 'dark'

  const spanStyle = {
    fontWeight: UPFACE_LOGO_WEIGHT,
    letterSpacing: tracking,
  } as const

  const logo = (
    <span
      className={`inline-flex items-center uppercase leading-none select-none ${className}`}
      style={{
        fontFamily: UPFACE_LOGO_FONT,
        fontSize,
        height,
      }}
      aria-label="UPFACE"
    >
      <span
        style={{
          ...spanStyle,
          color: isDark ? UPFACE_LOGO_UP_COLOR_DARK : UPFACE_LOGO_UP_COLOR,
        }}
      >
        UP
      </span>
      <span
        style={
          isDark
            ? { ...spanStyle, color: UPFACE_LOGO_FACE_COLOR }
            : {
                ...spanStyle,
                background: UPFACE_LOGO_FACE_GRADIENT,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
              }
        }
      >
        FACE
      </span>
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
        {logo}
      </Link>
    )
  }

  return logo
}
