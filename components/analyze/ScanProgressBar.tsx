'use client'

import { useEffect, useState } from 'react'

const MESSAGES = [
  'Analyse de ta structure faciale...',
  'Calcul des proportions dorées (ratio Φ 1.618)...',
  'Analyse de la symétrie gauche/droite...',
  'Évaluation jawline & structure osseuse...',
  'Analyse peau, grooming & aura...',
  'Génération de ta routine personnalisée...',
]

interface ScanProgressBarProps {
  active: boolean
  duration?: number
}

export default function ScanProgressBar({ active, duration = 8000 }: ScanProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [msgVisible, setMsgVisible] = useState(true)

  useEffect(() => {
    if (!active) {
      setProgress(0)
      setMsgIndex(0)
      return
    }

    const startTime = Date.now()
    let raf: number

    const tick = () => {
      const elapsed = Date.now() - startTime
      const pct = Math.min((elapsed / duration) * 100, 99)
      setProgress(pct)
      if (pct < 99) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Cycle messages every 1.5s with fade
    const msgInterval = setInterval(() => {
      setMsgVisible(false)
      setTimeout(() => {
        setMsgIndex(prev => (prev + 1) % MESSAGES.length)
        setMsgVisible(true)
      }, 300)
    }, 1500)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(msgInterval)
    }
  }, [active, duration])

  if (!active) return null

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
      {/* Message */}
      <p
        className="text-sm text-center"
        style={{
          color: '#8B9DC3',
          opacity: msgVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          minHeight: 20,
          fontFamily: 'Inter, sans-serif',
        }}
        role="status"
        aria-live="polite"
      >
        {MESSAGES[msgIndex]}
      </p>

      {/* Bar */}
      <div className="w-full">
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.85), rgba(255,255,255,0.45))',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
        <p className="text-xs text-center mt-2" style={{ color: '#8B9DC3' }}>
          Analyse en cours… <span style={{ color: '#EEF2FF' }}>{Math.round(progress)}%</span>
        </p>
      </div>
    </div>
  )
}
