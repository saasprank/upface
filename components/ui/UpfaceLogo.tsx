'use client'

import Link from 'next/link'
import { UPFACE_LOGO_SIZES, type UpfaceLogoSize } from '@/lib/upface-logo-style'

type UpfaceLogoProps = {
  size?: UpfaceLogoSize
  href?: string
  className?: string
}

export default function UpfaceLogo({ size = 'md', href, className = '' }: UpfaceLogoProps) {
  const { fontSize, tracking } = UPFACE_LOGO_SIZES[size]

  const logo = (
    <span
      className={`inline-flex items-baseline font-black uppercase leading-none select-none ${className}`}
      style={{
        fontFamily: 'Satoshi, sans-serif',
        fontSize,
        letterSpacing: tracking,
      }}
      aria-label="UPFACE"
    >
      <span className="text-[#EEF2FF]">UP</span>
      <span className="text-cyan">FACE</span>
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex hover:opacity-90 transition-opacity">
        {logo}
      </Link>
    )
  }

  return logo
}
