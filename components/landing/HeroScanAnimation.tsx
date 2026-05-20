'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import ProtectImageArea from '@/components/ui/ProtectImageArea'

type Phase = 'scan' | 'right' | 'left' | 'reveal'

const METRICS = [
  { label: 'SYMMETRY', value: '91%', pos: 'top-[18%] left-2 sm:left-4' },
  { label: 'PROPORTIONS', value: '87%', pos: 'top-[18%] right-2 sm:right-4' },
  { label: 'JAWLINE', value: '82%', pos: 'top-[52%] left-2 sm:left-4' },
  { label: 'SKIN', value: '79%', pos: 'top-[52%] right-2 sm:right-4' },
] as const

const LANDMARKS = [
  { top: '38%', left: '42%' },
  { top: '38%', left: '58%' },
  { top: '52%', left: '50%' },
  { top: '65%', left: '44%' },
  { top: '65%', left: '56%' },
] as const

export default function HeroScanAnimation() {
  const [phase, setPhase] = useState<Phase>('scan')
  const [visibleMetrics, setVisibleMetrics] = useState<number[]>([])
  const [scanKey, setScanKey] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    let cancelled = false

    const schedule = (fn: () => void, ms: number) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) fn()
        }, ms),
      )
    }

    const loop = () => {
      setPhase('scan')
      setVisibleMetrics([])
      setScanKey(k => k + 1)

      schedule(() => setPhase('right'), 1500)
      schedule(() => setPhase('left'), 2500)
      schedule(() => {
        setPhase('reveal')
        setVisibleMetrics([0])
      }, 3500)
      schedule(() => setVisibleMetrics([0, 1]), 4100)
      schedule(() => setVisibleMetrics([0, 1, 2]), 4700)
      schedule(() => setVisibleMetrics([0, 1, 2, 3]), 5300)
      schedule(loop, 7000)
    }

    schedule(loop, 100)

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  const rotateY =
    phase === 'right' ? 'rotateY(18deg)' : phase === 'left' ? 'rotateY(-18deg)' : 'rotateY(0deg)'

  return (
    <ProtectImageArea
      className="relative mx-auto w-full max-w-[380px]"
      style={{ aspectRatio: '380 / 460', perspective: '1000px' }}
    >
      <div
        className="absolute -inset-5 sm:-inset-6 rounded-full pointer-events-none border border-[rgba(59,130,246,0.15)]"
        aria-hidden
      />
      <div
        className="absolute -inset-10 sm:-inset-12 rounded-full pointer-events-none border border-[rgba(59,130,246,0.08)]"
        aria-hidden
      />

      <div
        className="relative w-full h-full rounded-3xl overflow-hidden"
        style={{
          transform: rotateY,
          transition: 'transform 0.6s ease-in-out',
          transformStyle: 'preserve-3d',
        }}
      >
        <Image
          src="/hero-face.png"
          alt="Analyse faciale IA"
          fill
          priority
          sizes="(max-width: 430px) 100vw, 380px"
          className="object-cover object-top scale-[1.04]"
          draggable={false}
        />

        <div className="absolute inset-0 bg-[rgba(8,12,20,0.28)] pointer-events-none" />

        {phase === 'scan' && (
          <div
            key={scanKey}
            className="absolute left-0 right-0 h-0.5 pointer-events-none hero-scan-line"
            style={{
              background: 'linear-gradient(90deg, transparent, #3B82F6, #06B6D4, transparent)',
              boxShadow: '0 0 12px #06B6D4, 0 0 28px rgba(59,130,246,0.35)',
            }}
            aria-hidden
          />
        )}

        {phase === 'reveal' &&
          LANDMARKS.map((pt, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full hero-scan-landmark"
              style={{
                top: pt.top,
                left: pt.left,
                background: '#06B6D4',
                boxShadow: '0 0 8px #06B6D4',
                animationDelay: `${i * 0.08}s`,
              }}
              aria-hidden
            />
          ))}
      </div>

      {METRICS.map((m, i) => (
        <div
          key={m.label}
          className={`absolute ${m.pos} z-10 rounded-lg px-3 py-1.5 pointer-events-none`}
          style={{
            opacity: visibleMetrics.includes(i) ? 1 : 0,
            transform: visibleMetrics.includes(i) ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            background: 'rgba(13,19,33,0.92)',
            border: '1px solid rgba(59,130,246,0.4)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="text-[9px] tracking-[0.14em] text-[#8B9DC3]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {m.label}
          </div>
          <div
            className="text-lg font-bold text-[#3B82F6] leading-tight"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {m.value}
          </div>
        </div>
      ))}

      {(phase === 'right' || phase === 'left') && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-full px-4 py-1 pointer-events-none"
          style={{
            background: 'rgba(13,19,33,0.92)',
            border: '1px solid rgba(59,130,246,0.3)',
            fontSize: 11,
            color: '#06B6D4',
            letterSpacing: '0.12em',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {phase === 'right' ? 'CHECKING RIGHT...' : 'CHECKING LEFT...'}
        </div>
      )}

      {phase === 'scan' && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-full px-4 py-1 pointer-events-none"
          style={{
            background: 'rgba(13,19,33,0.85)',
            border: '1px solid rgba(6,182,212,0.25)',
            fontSize: 10,
            color: '#06B6D4',
            letterSpacing: '0.14em',
            fontFamily: 'var(--font-mono)',
          }}
        >
          AI SCANNING…
        </div>
      )}
    </ProtectImageArea>
  )
}
