'use client'

import { motion } from 'framer-motion'
import ProtectImageArea from '@/components/ui/ProtectImageArea'

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
    <ProtectImageArea className="mx-auto scanner-glow rounded-[999px]" style={{ width, height }}>
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(6,182,212,0.14) 0%, rgba(59,130,246,0.06) 45%, transparent 72%)',
          filter: 'blur(24px)',
        }}
        animate={{ opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {showHud && (
        <>
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ inset: compact ? '-12px' : '-18px', border: '1px solid rgba(59,130,246,0.18)' }}
            animate={{ opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ inset: compact ? '-28px' : '-36px', border: '1px solid rgba(6,182,212,0.14)' }}
            animate={{ opacity: [0.25, 0.5, 0.25], rotate: 360 }}
            transition={{
              opacity: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 50, repeat: Infinity, ease: 'linear' },
            }}
          />
        </>
      )}

      <div
        className="absolute inset-x-0 top-0 overflow-hidden rounded-[999px]"
        style={{
          height: compact ? '88%' : '90%',
          maskImage: 'radial-gradient(ellipse 48% 52% at 50% 42%, black 55%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 48% 52% at 50% 42%, black 55%, transparent 100%)',
          boxShadow: 'inset 0 0 40px rgba(59,130,246,0.06)',
        }}
      >
        <div
          role="img"
          aria-hidden
          className="absolute inset-0 bg-cover bg-top scale-[1.08] pointer-events-none"
          style={{ backgroundImage: 'url(/hero-face.png)' }}
        />

        <motion.div
          className="absolute left-[8%] right-[8%] h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.85), transparent)',
            boxShadow: '0 0 16px rgba(6,182,212,0.35)',
          }}
          animate={{ top: ['8%', '88%', '8%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(248,250,255,0.15) 0%, transparent 28%, transparent 72%, rgba(248,250,255,0.25) 100%)',
          }}
        />
      </div>

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
            stroke="rgba(6,182,212,0.4)"
            strokeWidth="0.6"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 3.5, delay: i * 0.05, repeat: Infinity, ease: 'easeInOut' }}
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
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.85, 1.15, 0.85] }}
            transition={{ duration: 3, delay: i * 0.08, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      {showHud && !compact && (
        <>
          <HudChip label="SYMMETRY" value="91%" className="left-0 top-[18%]" delay={0} />
          <HudChip label="PROPORTIONS" value="87%" className="right-0 top-[28%]" delay={0.15} />
          <HudChip label="JAWLINE" value="82%" className="left-1 top-[52%]" delay={0.3} />
          <motion.div
            className="absolute bottom-[12%] left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] tracking-[0.18em] uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'rgba(255,255,255,0.82)',
              border: '1px solid rgba(6,182,212,0.22)',
              color: '#06B6D4',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(59,130,246,0.08)',
            }}
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            AI SCANNING…
          </motion.div>
        </>
      )}

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-8 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(6,182,212,0.15) 0%, transparent 70%)',
        }}
      />
    </ProtectImageArea>
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
      className={`absolute ${className} px-2.5 py-1.5 rounded-xl text-left pointer-events-none`}
      style={{
        background: 'rgba(255,255,255,0.78)',
        border: '1px solid rgba(59,130,246,0.14)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 16px rgba(59,130,246,0.08)',
      }}
      animate={{ y: [0, -3, 0], opacity: [0.75, 1, 0.75] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <p className="text-[8px] tracking-[0.14em] text-faint" style={{ fontFamily: 'var(--font-mono)' }}>
        {label}
      </p>
      <p className="text-[11px] font-bold text-theme" style={{ fontFamily: 'var(--font-mono)' }}>
        {value}
      </p>
    </motion.div>
  )
}
