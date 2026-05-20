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

interface BiometricFaceScannerProps {
  compact?: boolean
  showHud?: boolean
}

export default function BiometricFaceScanner({ compact = false, showHud = true }: BiometricFaceScannerProps) {
  const height = compact ? 280 : 380
  const width = compact ? 240 : 320

  return (
    <div
      className="relative mx-auto select-none"
      style={{ width, height }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(6,182,212,0.18) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)',
          filter: 'blur(20px)',
        }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Outer HUD ring */}
      {showHud && (
        <>
          <motion.div
            className="absolute rounded-full border border-[rgba(59,130,246,0.15)] pointer-events-none"
            style={{ inset: compact ? '-12px' : '-18px' }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full border border-[rgba(6,182,212,0.12)] pointer-events-none"
            style={{ inset: compact ? '-28px' : '-36px' }}
            animate={{ opacity: [0.3, 0.6, 0.3], rotate: 360 }}
            transition={{
              opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
            }}
          />
        </>
      )}

      {/* Face container */}
      <div
        className="absolute inset-x-0 top-0 overflow-hidden rounded-[999px]"
        style={{
          height: compact ? '88%' : '90%',
          maskImage: 'radial-gradient(ellipse 48% 52% at 50% 42%, black 55%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 48% 52% at 50% 42%, black 55%, transparent 100%)',
        }}
      >
        <Image
          src="/hero-face.png"
          alt=""
          fill
          priority
          className="object-cover object-top scale-[1.08]"
          sizes="(max-width: 400px) 320px, 400px"
        />

        {/* Scan line */}
        <motion.div
          className="absolute left-[8%] right-[8%] h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.9), transparent)',
            boxShadow: '0 0 12px rgba(6,182,212,0.6)',
          }}
          animate={{ top: ['8%', '88%', '8%'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(8,12,20,0.3) 0%, transparent 30%, transparent 70%, rgba(8,12,20,0.5) 100%)',
          }}
        />
      </div>

      {/* Biometric mesh SVG */}
      <svg
        viewBox="0 0 240 280"
        className="absolute inset-0 w-full h-full pointer-events-none"
        fill="none"
        aria-hidden
      >
        {CONNECTIONS.map(([a, b], i) => (
          <motion.line
            key={`line-${i}`}
            x1={LANDMARKS[a][0]}
            y1={LANDMARKS[a][1]}
            x2={LANDMARKS[b][0]}
            y2={LANDMARKS[b][1]}
            stroke="rgba(6,182,212,0.35)"
            strokeWidth="0.6"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, delay: i * 0.05, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {LANDMARKS.map(([cx, cy], i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={cx}
            cy={cy}
            r="2"
            fill="#06B6D4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.5, delay: i * 0.08, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      {/* Floating HUD data */}
      {showHud && !compact && (
        <>
          <HudChip label="SYMMETRY" value="91%" className="left-0 top-[18%]" delay={0} />
          <HudChip label="PROPORTIONS" value="87%" className="right-0 top-[28%]" delay={0.15} />
          <HudChip label="JAWLINE" value="82%" className="left-1 top-[52%]" delay={0.3} />
          <motion.div
            className="absolute bottom-[12%] left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] tracking-[0.18em] uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'rgba(8,12,20,0.75)',
              border: '1px solid rgba(6,182,212,0.25)',
              color: '#06B6D4',
              backdropFilter: 'blur(8px)',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            AI SCANNING…
          </motion.div>
        </>
      )}

      {/* Holographic base */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-8 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(6,182,212,0.2) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

function HudChip({
  label,
  value,
  className,
  delay,
}: {
  label: string
  value: string
  className: string
  delay: number
}) {
  return (
    <motion.div
      className={`absolute ${className} px-2 py-1 rounded-md text-left pointer-events-none`}
      style={{
        background: 'rgba(8,12,20,0.7)',
        border: '1px solid rgba(59,130,246,0.15)',
        backdropFilter: 'blur(6px)',
      }}
      animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 3.5, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <p className="text-[8px] tracking-[0.14em] text-[#3D4F6E]" style={{ fontFamily: 'var(--font-mono)' }}>
        {label}
      </p>
      <p className="text-[11px] font-bold text-[#EEF2FF]" style={{ fontFamily: 'var(--font-mono)' }}>
        {value}
      </p>
    </motion.div>
  )
}
