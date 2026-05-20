'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const LANDMARKS: [number, number][] = [
  [120, 68], [88, 88], [152, 88], [72, 118], [168, 118],
  [98, 142], [142, 142], [120, 158], [84, 172], [156, 172],
  [108, 188], [132, 188], [120, 212], [102, 228], [138, 228],
]

const CONNECTIONS: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4], [1, 5], [2, 6], [5, 6],
  [5, 7], [6, 7], [7, 8], [7, 9], [8, 10], [9, 11], [10, 12],
  [11, 12], [12, 13], [12, 14],
]

interface LiveFaceScanFrameProps {
  alignLabel: string
  scanningLabel?: string
  className?: string
  compact?: boolean
}

/** Visage en mode analyse live — cadran ovale, mesh IA, scan line. */
export default function LiveFaceScanFrame({
  alignLabel,
  scanningLabel = 'AI SCANNING…',
  className = '',
  compact = false,
}: LiveFaceScanFrameProps) {
  const frameClass = compact ? 'w-full max-w-[210px] aspect-[3/4]' : 'w-full max-w-[260px] aspect-[3/4]'

  return (
    <div className={`relative mx-auto ${frameClass} ${className}`}>
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-black">
        <Image
          src="/hero-face.png"
          alt=""
          fill
          className="object-cover object-top"
          style={{ transform: 'scaleX(-1) scale(1.08)', transformOrigin: 'center top' }}
          sizes="220px"
        />

        <motion.div
          className="absolute left-[6%] right-[6%] h-px z-[2]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.95), transparent)',
            boxShadow: '0 0 14px rgba(6,182,212,0.65)',
          }}
          animate={{ top: ['6%', '94%', '6%'] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(8,12,20,0.35) 0%, transparent 28%, transparent 72%, rgba(8,12,20,0.45) 100%)',
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[82%] h-[88%]">
          <div
            className="absolute inset-0 rounded-[50%]"
            style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.74)' }}
            aria-hidden
          />

          <svg viewBox="0 0 240 320" className="absolute inset-0 w-full h-full" fill="none" aria-hidden>
            <ellipse cx="120" cy="160" rx="98" ry="138" stroke="rgba(238,242,255,0.8)" strokeWidth="2" />
            <line x1="28" y1="162" x2="212" y2="162" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.9" />
            {CONNECTIONS.map(([a, b], i) => (
              <motion.line
                key={`mesh-line-${i}`}
                x1={LANDMARKS[a][0]}
                y1={LANDMARKS[a][1]}
                x2={LANDMARKS[b][0]}
                y2={LANDMARKS[b][1]}
                stroke="rgba(6,182,212,0.4)"
                strokeWidth="0.7"
                animate={{ opacity: [0.15, 0.55, 0.15] }}
                transition={{ duration: 2.8, delay: i * 0.04, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
            {LANDMARKS.map(([cx, cy], i) => (
              <motion.circle
                key={`mesh-dot-${i}`}
                cx={cx}
                cy={cy}
                r="2.2"
                fill="#06B6D4"
                animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
                transition={{ duration: 2.2, delay: i * 0.06, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </svg>

          <p
            className="absolute left-0 right-0 top-[52%] text-[7px] sm:text-[8px] tracking-[0.16em] text-[#8B9DC3] uppercase text-center z-[2]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {alignLabel}
          </p>
        </div>
      </div>

      <motion.div
        className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full z-[3]"
        style={{
          background: 'rgba(8,12,20,0.8)',
          border: '1px solid rgba(239,68,68,0.35)',
          backdropFilter: 'blur(6px)',
        }}
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span className="text-[8px] tracking-[0.14em] uppercase text-[#EEF2FF]" style={{ fontFamily: 'var(--font-mono)' }}>
          LIVE
        </span>
      </motion.div>

      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full z-[3]"
        style={{
          fontFamily: 'var(--font-mono)',
          background: 'rgba(8,12,20,0.8)',
          border: '1px solid rgba(6,182,212,0.25)',
          color: '#06B6D4',
          backdropFilter: 'blur(6px)',
        }}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[8px] tracking-[0.14em] uppercase">{scanningLabel}</span>
      </motion.div>

      <motion.div
        className="absolute rounded-full border border-[rgba(59,130,246,0.2)] pointer-events-none"
        style={{ inset: '-10px' }}
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
