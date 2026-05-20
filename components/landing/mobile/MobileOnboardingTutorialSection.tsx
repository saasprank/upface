'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import ScoreRing from '@/components/ui/ScoreRing'
import MetricBar from '@/components/landing/shared/MetricBar'
import { FACE_OVAL_FRAME_CLASS } from '@/components/analyze/FaceOvalGuide'

const PHASES = ['capture', 'analysis', 'score'] as const
type Phase = (typeof PHASES)[number]

const ANALYSIS_STEPS = ['detection', 'symmetry', 'proportions', 'skin', 'report'] as const
const ANALYSIS_STEP_COUNT = ANALYSIS_STEPS.length
const PROGRESS_PER_ANALYSIS_STEP = 100 / ANALYSIS_STEP_COUNT

const CAPTURE_TIPS = ['tip1', 'tip2', 'tip3', 'tip4'] as const
const SCORE_METRICS = [
  { key: 'symmetry', value: 91 },
  { key: 'proportions', value: 87 },
  { key: 'structure', value: 82 },
] as const

const PHASE_MS: Record<Phase, number> = {
  capture: 5200,
  analysis: 8800,
  score: 5500,
}
const PAUSE_MS = 2400
const TICK_MS = 40

type AnalysisStepState = 'pending' | 'active' | 'done'

function analysisStepState(index: number, progress: number): AnalysisStepState {
  const start = index * PROGRESS_PER_ANALYSIS_STEP
  const end = (index + 1) * PROGRESS_PER_ANALYSIS_STEP
  if (progress >= end) return 'done'
  if (progress >= start) return 'active'
  return 'pending'
}

function CaptureFace({ activeTipIndex }: { activeTipIndex: number }) {
  const t = useTranslations('landing.upload')

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative ${FACE_OVAL_FRAME_CLASS} max-w-[200px]`}>
        <div className="absolute inset-[6%] overflow-hidden rounded-[50%] z-0">
          <Image
            src="/hero-face.png"
            alt=""
            fill
            className="object-cover object-top scale-[1.12]"
            sizes="200px"
          />
          <motion.div
            className="absolute left-[10%] right-[10%] h-px z-10"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.85), transparent)',
              boxShadow: '0 0 10px rgba(6,182,212,0.5)',
            }}
            animate={{ top: ['12%', '88%', '12%'] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(8,12,20,0.25) 0%, transparent 35%, transparent 65%, rgba(8,12,20,0.35) 100%)',
            }}
          />
        </div>
        <svg viewBox="0 0 240 320" className="relative z-[1] w-full h-full" fill="none" aria-hidden>
          <ellipse cx="120" cy="160" rx="98" ry="138" stroke="rgba(238,242,255,0.75)" strokeWidth="2" />
          <line x1="28" y1="162" x2="212" y2="162" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.85" />
        </svg>
        <p
          className="absolute left-0 right-0 top-[52%] z-[2] text-[8px] tracking-[0.16em] text-[#8B9DC3] uppercase text-center"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {t('align_face')}
        </p>
      </div>

      <motion.p
        key={activeTipIndex}
        className="text-sm font-semibold text-[#EEF2FF] text-center px-4"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35 }}
      >
        {t(CAPTURE_TIPS[activeTipIndex])}
      </motion.p>

      <div className="w-full space-y-2 mt-1">
        {CAPTURE_TIPS.map((tipKey, i) => {
          const done = i < activeTipIndex
          const active = i === activeTipIndex
          return (
            <div
              key={tipKey}
              className="flex items-center gap-3 text-xs transition-opacity duration-300"
              style={{ opacity: done || active ? 1 : 0.4 }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: done ? 'rgba(16,185,129,0.12)' : active ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${done ? 'rgba(16,185,129,0.35)' : active ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.08)'}`,
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
              </span>
              <span className={active ? 'text-[#EEF2FF] font-medium' : 'text-[#8B9DC3]'}>{t(tipKey)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AnalysisPanel({ progress }: { progress: number }) {
  const t = useTranslations('landing.analysis')
  const circumference = 2 * Math.PI * 48
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 w-full">
        <div className="relative w-[72px] h-[96px] shrink-0 overflow-hidden rounded-2xl border border-[rgba(59,130,246,0.2)]">
          <Image src="/hero-face.png" alt="" fill className="object-cover object-top scale-110" sizes="72px" />
          <motion.div
            className="absolute inset-x-1 h-px"
            style={{ background: 'rgba(6,182,212,0.8)', boxShadow: '0 0 6px rgba(6,182,212,0.6)' }}
            animate={{ top: ['8%', '92%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="relative flex-1 flex justify-center">
          <svg width={120} height={120} className="rotate-[-90deg]">
            <circle cx={60} cy={60} r={48} fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth={5} />
            <motion.circle
              cx={60}
              cy={60}
              r={48}
              fill="none"
              stroke="url(#tutorialAnalysisGradient)"
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
            <defs>
              <linearGradient id="tutorialAnalysisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-[#EEF2FF]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              {progress}%
            </span>
            <span className="text-[8px] tracking-[0.14em] uppercase text-cyan">{t('scanning')}</span>
          </div>
        </div>
      </div>

      <div className="w-full space-y-2.5">
        {ANALYSIS_STEPS.map((step, i) => {
          const state = analysisStepState(i, progress)
          return (
            <div key={step} className="flex items-center gap-3" style={{ opacity: state === 'pending' ? 0.45 : 1 }}>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background:
                    state === 'done' ? 'rgba(16,185,129,0.15)' : state === 'active' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${
                    state === 'done' ? 'rgba(16,185,129,0.4)' : state === 'active' ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'
                  }`,
                }}
              >
                {state === 'done' ? (
                  <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : state === 'active' ? (
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-cyan" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity }} />
                ) : null}
              </div>
              <span className={`text-xs ${state === 'active' ? 'text-[#EEF2FF] font-semibold' : state === 'done' ? 'text-[#8B9DC3]' : 'text-[#3D4F6E]'}`}>
                {t(`step_${step}`)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ScorePanel() {
  const t = useTranslations('landing.score')

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 w-full">
        <div className="relative w-[56px] h-[72px] shrink-0 overflow-hidden rounded-xl border border-[rgba(59,130,246,0.15)] opacity-80">
          <Image src="/hero-face.png" alt="" fill className="object-cover object-top" sizes="56px" />
        </div>
        <div className="flex-1 flex flex-col items-center">
          <ScoreRing score={78} size={120} animate />
          <div
            className="mt-2 text-center px-3 py-1 rounded-lg"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <span className="text-xs font-semibold text-emerald-400">{t('badge')}</span>
            <span className="text-[10px] text-[#3D4F6E] ml-1.5">{t('percentile')}</span>
          </div>
        </div>
      </div>

      <div className="w-full space-y-3">
        {SCORE_METRICS.map((m, i) => (
          <MetricBar key={m.key} label={t(`metric_${m.key}`)} value={m.value} delay={i * 0.06} />
        ))}
      </div>
    </div>
  )
}

export default function MobileOnboardingTutorialSection() {
  const t = useTranslations('landing.tutorial')
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [activeTipIndex, setActiveTipIndex] = useState(0)
  const [cycleKey, setCycleKey] = useState(0)

  const phase = PHASES[phaseIndex]

  const restart = useCallback(() => {
    setPhaseIndex(0)
    setAnalysisProgress(0)
    setActiveTipIndex(0)
    setCycleKey((k) => k + 1)
  }, [])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return

    setPhaseIndex(0)
    setAnalysisProgress(0)
    setActiveTipIndex(0)

    let tipTimer: ReturnType<typeof setInterval> | null = null
    let analysisTimer: ReturnType<typeof setInterval> | null = null
    let phaseTimer: ReturnType<typeof setTimeout> | null = null
    let pauseTimer: ReturnType<typeof setTimeout> | null = null

    const clearAll = () => {
      if (tipTimer) clearInterval(tipTimer)
      if (analysisTimer) clearInterval(analysisTimer)
      if (phaseTimer) clearTimeout(phaseTimer)
      if (pauseTimer) clearTimeout(pauseTimer)
    }

    const runCapture = () => {
      setPhaseIndex(0)
      setActiveTipIndex(0)
      let tip = 0
      tipTimer = setInterval(() => {
        tip = Math.min(tip + 1, CAPTURE_TIPS.length - 1)
        setActiveTipIndex(tip)
      }, PHASE_MS.capture / CAPTURE_TIPS.length)
      phaseTimer = setTimeout(() => {
        if (tipTimer) clearInterval(tipTimer)
        runAnalysis()
      }, PHASE_MS.capture)
    }

    const runAnalysis = () => {
      setPhaseIndex(1)
      setAnalysisProgress(0)
      let current = 0
      const increment = 100 / (PHASE_MS.analysis / TICK_MS)
      analysisTimer = setInterval(() => {
        current = Math.min(current + increment, 100)
        setAnalysisProgress(Math.round(current))
        if (current >= 100 && analysisTimer) clearInterval(analysisTimer)
      }, TICK_MS)
      phaseTimer = setTimeout(() => {
        if (analysisTimer) clearInterval(analysisTimer)
        runScore()
      }, PHASE_MS.analysis)
    }

    const runScore = () => {
      setPhaseIndex(2)
      phaseTimer = setTimeout(() => {
        pauseTimer = setTimeout(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect()
            if (rect.top < window.innerHeight && rect.bottom > 0) restart()
          }
        }, PAUSE_MS)
      }, PHASE_MS.score)
    }

    runCapture()
    return clearAll
  }, [inView, cycleKey, restart])

  const phaseLabel = phase === 'capture' ? t('phase_capture_label') : phase === 'analysis' ? t('phase_analysis_label') : t('phase_score_label')
  const phaseTitle = phase === 'capture' ? t('phase_capture_title') : phase === 'analysis' ? t('phase_analysis_title') : t('phase_score_title')
  const phaseSubtitle = phase === 'capture' ? t('phase_capture_subtitle') : phase === 'analysis' ? t('phase_analysis_subtitle') : t('phase_score_subtitle')

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
              <p className="text-[10px] tracking-[0.22em] uppercase text-cyan mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                {phaseLabel}
              </p>
              <h2 className="text-2xl font-black text-[#EEF2FF] leading-tight" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                {phaseTitle}
              </h2>
              <p className="mt-2 text-sm text-[#8B9DC3] leading-relaxed">{phaseSubtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="relative rounded-2xl p-5 overflow-hidden"
          style={{
            height: 420,
            background: 'rgba(8,12,20,0.75)',
            border: '1px solid rgba(59,130,246,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              className="absolute inset-0 p-5 flex flex-col justify-center"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {phase === 'capture' && <CaptureFace activeTipIndex={activeTipIndex} />}
              {phase === 'analysis' && <AnalysisPanel progress={analysisProgress} />}
              {phase === 'score' && <ScorePanel />}
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
