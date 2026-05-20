'use client'

import Link from 'next/link'
import ProtectImageArea from '@/components/ui/ProtectImageArea'
import { UPFACE_LOGO_SIZES, UPFACE_WORDMARK_SRC, type UpfaceLogoSize } from '@/lib/upface-logo-style'

type UpfaceLogoProps = {
  size?: UpfaceLogoSize
  href?: string
  className?: string
}

export default function UpfaceLogo({ size = 'md', href, className = '' }: UpfaceLogoProps) {
  const { width, height } = UPFACE_LOGO_SIZES[size]

  const logo = (
    <ProtectImageArea className={`inline-block shrink-0 ${className}`} style={{ width, height }}>
      <div
        role="img"
        aria-label="UPFACE"
        className="w-full h-full bg-contain bg-left bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${UPFACE_WORDMARK_SRC})` }}
      />
    </ProtectImageArea>
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
