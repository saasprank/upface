'use client'

import { useEffect, useRef } from 'react'

interface ScanAnimationProps {
  className?: string
  height?: number
}

export default function ScanAnimation({ className = '', height = 200 }: ScanAnimationProps) {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const line = lineRef.current
    if (!line) return

    let start: number | null = null
    const duration = 2200

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = (timestamp - start) % duration
      const progress = elapsed / duration
      const y = progress * height

      line.style.transform = `translateY(${y}px)`
      line.style.opacity = progress < 0.05 || progress > 0.95
        ? String(progress < 0.05 ? progress / 0.05 : (1 - progress) / 0.05)
        : '1'

      requestAnimationFrame(animate)
    }

    const raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [height])

  return (
    <div
      className={`relative overflow-hidden pointer-events-none ${className}`}
      style={{ height }}
    >
      <div
        ref={lineRef}
        className="absolute left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #3B82F6 20%, #06B6D4 50%, #3B82F6 80%, transparent 100%)',
          boxShadow: '0 0 12px 2px rgba(59,130,246,0.6), 0 0 40px 8px rgba(59,130,246,0.2)',
          transform: 'translateY(0)',
        }}
      />
    </div>
  )
}
