'use client'

import type { CSSProperties, MouseEvent, ReactNode } from 'react'

type ProtectImageAreaProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

function blockImageSave(e: MouseEvent) {
  e.preventDefault()
}

export default function ProtectImageArea({ children, className = '', style }: ProtectImageAreaProps) {
  return (
    <div
      className={`relative no-image-save select-none touch-pan-y ${className}`}
      style={style}
      onContextMenu={blockImageSave}
    >
      {children}
    </div>
  )
}
