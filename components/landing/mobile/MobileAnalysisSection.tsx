'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import MotionReveal from '@/components/landing/shared/MotionReveal'
import SectionHeader from '@/components/landing/shared/SectionHeader'

const STEPS = ['detection', 'symmetry', 'proportions', 'skin', 'report'] as const
const STEP_COUNT = STEPS.length
const PROGRESS_PER_STEP = 100 / STEP_COUNT
const STEP_DURATION_MS = 1600
const TICK_MS = 40
const PAUSE_AT_END_MS = 2200

type StepState = 'pending' | 'active' | 'done'

function getStepState(index: number, progress: number): StepState {
  const stepStart = index * PROGRESS_PER_STEP
  const stepEnd = (index + 1) * PROGRESS_PER_STEP
  if (progress >= stepEnd) return 'done'
  if (progress >= stepStart) return 'active'
  return 'pending'
}

export default function MobileAnalysisSection() {
  const t = useTranslations('landing.analysis')
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [progress, setProgress] = useState(0)
  const [cycleKey, setCycleKey] = useState(0)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const restartCycle = useCallback(() => {
    setProgress(0)
    setCycleKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (!inView) return

    setProgress(0)
    let current = 0
    const increment = PROGRESS_PER_STEP / (STEP_DURATION_MS / TICK_MS)

    const interval = setInterval(() => {
      current = Math.min(current + increment, 100)
      setProgress(Math.round(current))

      if (current >= 100) {
        clearInterval(interval)
        window.setTimeout(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect()
            const visible = rect.top < window.innerHeight && rect.bottom > 0
            if (visible) restartCycle()
          }
        }, PAUSE_AT_END_MS)
      }
    }, TICK_MS)

    return () => clearInterval(interval)
  }, [inView, cycleKey, restartCycle])

  const circumference = 2 * Math.PI * 54
  const offset = circumference - (progress / 100) * circumference

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="px-4 py-16"
    >
      <div className="max-w-[375px] mx-auto">
        <MotionReveal>
          <SectionHeader label={t('label')} title={t('title')} subtitle={t('subtitle')} />
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: '#080C14',
              border: '1px solid #1E2A3E',
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
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
                <defs>
                  <linearGradient id="analysisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
                <motion.span
                  key={progress}
                  className="text-2xl font-black text-[#EEF2FF] leading-none"
                  style={{ fontFamily: 'Satoshi, sans-serif' }}
                  initial={{ opacity: 0.6, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {progress}%
                </motion.span>
                <div className="mt-1 flex flex-col items-center max-w-[4.25rem]">
                  {t('scanning')
                    .split('\n')
                    .map((line) => (
                      <span
                        key={line}
                        className="text-[7px] tracking-[0.05em] uppercase text-cyan leading-[1.2] text-center"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {line}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-left">
              {STEPS.map((step, i) => {
                const state = getStepState(i, progress)
                return (
                  <motion.div
                    key={step}
                    className="flex items-center gap-3"
                    animate={{ opacity: state === 'pending' ? 0.45 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background:
                          state === 'done'
                            ? 'rgba(16,185,129,0.15)'
                            : state === 'active'
                              ? 'rgba(59,130,246,0.15)'
                              : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${
                          state === 'done'
                            ? 'rgba(16,185,129,0.4)'
                            : state === 'active'
                              ? 'rgba(59,130,246,0.4)'
                              : 'rgba(255,255,255,0.08)'
                        }`,
                      }}
                    >
                      {state === 'done' ? (
                        <motion.svg
                          className="w-3 h-3 text-emerald-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                      ) : state === 'active' ? (
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-cyan"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
                      ) : null}
                    </div>
                    <span
                      className={`text-xs ${
                        state === 'active'
                          ? 'text-[#EEF2FF] font-semibold'
                          : state === 'done'
                            ? 'text-[#8B9DC3]'
                            : 'text-[#3D4F6E]'
                      }`}
                    >
                      {t(`step_${step}`)}
                    </span>
                  </motion.div>
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
