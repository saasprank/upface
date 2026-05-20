'use client'

import { useEffect, useRef, useState } from 'react'

interface ScanAnimationProps {
  className?: string
  /** Hauteur fixe en px. Omis = remplit le conteneur parent (`fill`). */
  height?: number
  fill?: boolean
}

export default function ScanAnimation({ className = '', height, fill = false }: ScanAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const [measuredHeight, setMeasuredHeight] = useState(height ?? 200)

  useEffect(() => {
    if (!fill) {
      setMeasuredHeight(height ?? 200)
      return
    }

    const el = containerRef.current
    if (!el) return

    const update = () => setMeasuredHeight(el.clientHeight || 200)
    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [fill, height])

  useEffect(() => {
    const line = lineRef.current
    if (!line || measuredHeight <= 0) return

    let start: number | null = null
    const duration = 2800

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = (timestamp - start) % duration
      const progress = elapsed / duration
      const y = progress * measuredHeight

      line.style.transform = `translateY(${y}px)`
      line.style.opacity = progress < 0.06 || progress > 0.94
        ? String(progress < 0.06 ? progress / 0.06 : (1 - progress) / 0.06)
        : '1'

      requestAnimationFrame(animate)
    }

    const raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [measuredHeight])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden pointer-events-none ${fill ? 'absolute inset-0' : ''} ${className}`}
      style={fill ? undefined : { height: measuredHeight }}
    >
      <div
        ref={lineRef}
        className="absolute left-[6%] right-[6%] h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #3B82F6 18%, #06B6D4 50%, #3B82F6 82%, transparent 100%)',
          boxShadow: '0 0 14px 2px rgba(6,182,212,0.55), 0 0 32px 6px rgba(59,130,246,0.25)',
          transform: 'translateY(0)',
        }}
      />
    </div>
  )
}
