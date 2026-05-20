'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import FaceOvalGuide from '@/components/analyze/FaceOvalGuide'
import ScoreRing from '@/components/ui/ScoreRing'
import SectionHeader from '@/components/landing/shared/SectionHeader'
import MetricBar from '@/components/landing/shared/MetricBar'

const PHASES = ['upload', 'analysis', 'score'] as const
type Phase = (typeof PHASES)[number]

const ANALYSIS_STEPS = ['detection', 'symmetry', 'proportions', 'skin', 'report'] as const
const ANALYSIS_STEP_COUNT = ANALYSIS_STEPS.length
const PROGRESS_PER_ANALYSIS_STEP = 100 / ANALYSIS_STEP_COUNT

const METRICS = [
  { key: 'symmetry', value: 91 },
  { key: 'proportions', value: 87 },
  { key: 'structure', value: 82 },
  { key: 'skin', value: 76 },
  { key: 'grooming', value: 79 },
  { key: 'aura', value: 84 },
] as const

const PHASE_MS: Record<Phase, number> = {
  upload: 3200,
  analysis: 8800,
  score: 5500,
}
const PAUSE_MS = 2400
const TICK_MS = 40

type AnalysisStepState = 'pending' | 'active' | 'done'

function getAnalysisStepState(index: number, progress: number): AnalysisStepState {
  const start = index * PROGRESS_PER_ANALYSIS_STEP
  const end = (index + 1) * PROGRESS_PER_ANALYSIS_STEP
  if (progress >= end) return 'done'
  if (progress >= start) return 'active'
  return 'pending'
}

function UploadStepPanel() {
  const t = useTranslations('landing.upload')

  return (
    <FaceOvalGuide alignLabel={t('align_face')} className="max-w-[220px]" />
  )
}

function AnalysisStepPanel({ progress }: { progress: number }) {
  const t = useTranslations('landing.analysis')
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (progress / 100) * circumference

  return (
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
            stroke="url(#onboardingAnalysisGradient)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient id="onboardingAnalysisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
        {ANALYSIS_STEPS.map((step, i) => {
          const state = getAnalysisStepState(i, progress)
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
  )
}

function ScoreStepPanel() {
  const t = useTranslations('landing.score')

  return (
    <div>
      <div
        className="rounded-2xl p-6 mb-4"
        style={{
          background: '#0D1321',
          border: '1px solid rgba(59,130,246,0.12)',
        }}
      >
        <div className="flex justify-center mb-5">
          <ScoreRing score={78} size={160} animate />
        </div>

        <div
          className="text-center px-4 py-2 rounded-xl mb-6 mx-auto w-fit"
          style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
          }}
        >
          <span className="text-sm font-semibold text-emerald-400">{t('badge')}</span>
          <span className="text-xs text-[#3D4F6E] ml-2">{t('percentile')}</span>
        </div>

        <div className="space-y-4">
          {METRICS.map((m, i) => (
            <MetricBar key={m.key} label={t(`metric_${m.key}`)} value={m.value} delay={i * 0.08} />
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: '#111827',
          border: '1px solid rgba(59,130,246,0.1)',
        }}
      >
        <div className="blur-sm pointer-events-none select-none opacity-60 space-y-2">
          <p className="text-sm font-semibold text-[#EEF2FF]">{t('locked_title')}</p>
          <p className="text-xs text-[#8B9DC3]">{t('locked_desc')}</p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[rgba(8,12,20,0.5)] backdrop-blur-[2px]">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-[#8B9DC3]">{t('locked_cta')}</p>
        </div>
      </div>
    </div>
  )
}

export default function MobileOnboardingStepsSection() {
  const tUpload = useTranslations('landing.upload')
  const tAnalysis = useTranslations('landing.analysis')
  const tScore = useTranslations('landing.score')

  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [scoreAnimateKey, setScoreAnimateKey] = useState(0)
  const [cycleKey, setCycleKey] = useState(0)

  const phase = PHASES[phaseIndex]

  const header = phase === 'upload'
    ? { label: tUpload('label'), title: tUpload('title'), subtitle: tUpload('subtitle') }
    : phase === 'analysis'
      ? { label: tAnalysis('label'), title: tAnalysis('title'), subtitle: tAnalysis('subtitle') }
      : { label: tScore('label'), title: tScore('title'), subtitle: tScore('subtitle') }

  const restart = useCallback(() => {
    setPhaseIndex(0)
    setAnalysisProgress(0)
    setCycleKey((k) => k + 1)
  }, [])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return

    setPhaseIndex(0)
    setAnalysisProgress(0)

    const t1 = window.setTimeout(() => setPhaseIndex(1), PHASE_MS.upload)
    const t2 = window.setTimeout(() => {
      setPhaseIndex(2)
      setScoreAnimateKey((k) => k + 1)
    }, PHASE_MS.upload + PHASE_MS.analysis)
    const t3 = window.setTimeout(() => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) restart()
      }
    }, PHASE_MS.upload + PHASE_MS.analysis + PHASE_MS.score + PAUSE_MS)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [inView, cycleKey, restart])

  useEffect(() => {
    if (!inView || phaseIndex !== 1) return

    setAnalysisProgress(0)
    let current = 0
    const increment = 100 / (PHASE_MS.analysis / TICK_MS)

    const interval = window.setInterval(() => {
      current = Math.min(current + increment, 100)
      setAnalysisProgress(Math.round(current))
      if (current >= 100) window.clearInterval(interval)
    }, TICK_MS)

    return () => window.clearInterval(interval)
  }, [inView, phaseIndex, cycleKey])

  return (
    <section id="how-it-works" ref={sectionRef} className="px-4 py-16">
      <div className="max-w-[375px] mx-auto">
        <div className="text-center mb-6 min-h-[108px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <SectionHeader label={header.label} title={header.title} subtitle={header.subtitle} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative min-h-[560px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {phase === 'upload' && <UploadStepPanel />}
              {phase === 'analysis' && <AnalysisStepPanel progress={analysisProgress} />}
              {phase === 'score' && <ScoreStepPanel key={scoreAnimateKey} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          {PHASES.map((p, i) => (
            <motion.div
              key={p}
              className="h-1.5 rounded-full"
              animate={{
                width: i === phaseIndex ? 24 : 8,
                background: i === phaseIndex ? '#06B6D4' : i < phaseIndex ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.12)',
              }}
              transition={{ duration: 0.35 }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
