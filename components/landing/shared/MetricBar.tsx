'use client'

import { motion } from 'framer-motion'

interface MetricBarProps {
  label: string
  value: number
  delay?: number
}

export default function MetricBar({ label, value, delay = 0 }: MetricBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#8B9DC3]">{label}</span>
        <span className="font-semibold text-[#EEF2FF]" style={{ fontFamily: 'var(--font-mono)' }}>
          {value}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[#111827] overflow-hidden border border-[rgba(59,130,246,0.08)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #3B82F6, #06B6D4)' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}
