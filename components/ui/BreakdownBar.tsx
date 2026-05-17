'use client'

import { useEffect, useRef, useState } from 'react'

interface BreakdownBarProps {
  label: string
  value: number
  max?: number
  animate?: boolean
}

export default function BreakdownBar({ label, value, max = 100, animate = true }: BreakdownBarProps) {
  const [width, setWidth] = useState(animate ? 0 : (value / max) * 100)
  const ref = useRef<HTMLDivElement>(null)
  const observed = useRef(false)

  const percentage = (value / max) * 100
  const color = value >= 70 ? '#10B981' : value >= 50 ? '#F59E0B' : '#EF4444'

  useEffect(() => {
    if (!animate) {
      setWidth(percentage)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !observed.current) {
          observed.current = true
          const start = performance.now()
          const duration = 800

          const frame = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setWidth(eased * percentage)
            if (progress < 1) requestAnimationFrame(frame)
          }

          requestAnimationFrame(frame)
        }
      },
      { threshold: 0.12 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animate, percentage])

  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-xs text-[#8B9DC3] w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, #3B82F6, ${color})`,
            transition: 'none',
          }}
        />
      </div>
      <span className="text-xs font-medium text-[#EEF2FF] w-8 text-right shrink-0">{value}</span>
    </div>
  )
}
