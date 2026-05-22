'use client'

import { useEffect, useRef, useState } from 'react'

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  animate?: boolean
  label?: string
}

export default function ScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
  animate = true,
  label,
}: ScoreRingProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : score)
  const [offset, setOffset] = useState(502)
  const gradientId = useRef(`score-gradient-${Math.random().toString(36).slice(2)}`)

  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference - (score / 100) * circumference

  useEffect(() => {
    if (!animate) {
      setOffset(targetOffset)
      setDisplayed(score)
      return
    }

    const startTime = performance.now()
    const duration = 1400

    const frame = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setDisplayed(Math.round(eased * score))
      setOffset(circumference - eased * (score / 100) * circumference)

      if (progress < 1) requestAnimationFrame(frame)
    }

    const raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [score, animate, circumference, targetOffset])

  const cx = size / 2
  const cy = size / 2

  const scoreColor = score >= 70 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <defs>
          <linearGradient id={gradientId.current} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(59,130,246,0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId.current})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#glow)"
          style={{
            transition: animate ? 'none' : 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold leading-none"
          style={{
            fontFamily: 'Satoshi, sans-serif',
            fontSize: size * 0.22,
            color: scoreColor,
          }}
        >
          {displayed}
        </span>
        <span
          className="text-muted"
          style={{ fontSize: size * 0.07 }}
        >
          {label ?? '/100'}
        </span>
      </div>
    </div>
  )
}
