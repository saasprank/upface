'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

interface MotionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

export default function MotionReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
}: MotionRevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={fadeUp}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function MotionStagger({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function MotionStaggerItem({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div className={className} variants={fadeUp} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  )
}
