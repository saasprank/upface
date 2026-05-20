'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import MotionReveal from '@/components/landing/shared/MotionReveal'
import SectionHeader from '@/components/landing/shared/SectionHeader'

const STEPS = ['detection', 'symmetry', 'proportions', 'skin', 'report'] as const

export default function MobileAnalysisSection() {
  const t = useTranslations('landing.analysis')
  const [progress, setProgress] = useState(78)
  const [activeStep, setActiveStep] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 95 ? 78 : p + 1))
      setActiveStep((s) => (s >= STEPS.length - 1 ? 0 : s + 1))
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  const circumference = 2 * Math.PI * 54
  const offset = circumference - (progress / 100) * circumference

  return (
    <section id="how-it-works" className="px-4 py-16" style={{ background: '#0D1321' }}>
      <div className="max-w-[375px] mx-auto">
        <MotionReveal>
          <SectionHeader label={t('label')} title={t('title')} subtitle={t('subtitle')} />
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: '#080C14',
              border: '1px solid rgba(59,130,246,0.12)',
            }}
          >
            <div className="relative inline-flex items-center justify-center mb-6">
              <svg width={140} height={140} className="rotate-[-90deg]">
                <circle cx={70} cy={70} r={54} fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth={6} />
                <motion.circle
                  cx={70}
                  cy={70}
                  r={54}
                  fill="none"
                  stroke="url(#analysisGradient)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
                <defs>
                  <linearGradient id="analysisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#EEF2FF]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  {progress}%
                </span>
                <span className="text-[9px] tracking-[0.16em] uppercase text-cyan mt-0.5">{t('scanning')}</span>
              </div>
            </div>

            <div className="space-y-3 text-left">
              {STEPS.map((step, i) => {
                const done = i < activeStep
                const active = i === activeStep
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: done ? 'rgba(16,185,129,0.15)' : active ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${done ? 'rgba(16,185,129,0.4)' : active ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      {done ? (
                        <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : active ? (
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-cyan"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
                      ) : null}
                    </div>
                    <span className={`text-xs ${active ? 'text-[#EEF2FF] font-medium' : done ? 'text-[#8B9DC3]' : 'text-[#3D4F6E]'}`}>
                      {t(`step_${step}`)}
                    </span>
                  </div>
                )
              })}
            </div>

            <p className="mt-5 text-[10px] text-[#3D4F6E] leading-relaxed px-2">{t('note')}</p>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
