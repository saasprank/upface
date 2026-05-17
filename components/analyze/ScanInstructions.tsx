'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { SCAN_POSE_STEP_ORDER, type PoseStepId } from '@/lib/face-pose-heuristics'
import type { AnalyzeState } from './FaceCadran'

const STEP_META: Record<PoseStepId, { text: string; sub: string; icon: ReactNode; last?: boolean }> = {
  center: {
    text: 'Regarde droit vers la caméra',
    sub: 'Yeux dans l\'axe, visage détendu',
    icon: <EyeIcon />,
  },
  left: {
    text: 'Tourne légèrement la tête à gauche',
    sub: 'Environ 20°, reste naturel',
    icon: <ArrowLeftIcon />,
  },
  center2: {
    text: 'Reviens face caméra',
    sub: 'Repositionne-toi bien au centre',
    icon: <CenterIcon />,
  },
  up: {
    text: 'Lève légèrement le menton',
    sub: 'Garde le regard vers l\'objectif',
    icon: <ArrowUpIcon />,
  },
  down: {
    text: 'Baisse légèrement le menton',
    sub: 'Juste quelques centimètres',
    icon: <ArrowDownIcon />,
  },
  done: {
    text: 'Parfait — ne bouge plus !',
    sub: 'On capture automatiquement l\'image',
    icon: <CheckIcon />,
    last: true,
  },
}

const STEPS = SCAN_POSE_STEP_ORDER.map(id => ({ id, ...STEP_META[id] }))

export interface ScanInstructionsProps {
  state: AnalyzeState
  submitting: boolean
  currentStepIndex: number
  faceDetected: boolean
  poseMatch: boolean
  holdProgress: number
}

export default function ScanInstructions({
  state,
  submitting,
  currentStepIndex,
  faceDetected,
  poseMatch,
  holdProgress,
}: ScanInstructionsProps) {
  const t = useTranslations('analyzeLive')
  const [visible, setVisible] = useState(true)

  const isScanning = state === 'scanning' || state === 'redirecting'
  const step = Math.min(currentStepIndex, STEPS.length - 1)
  const current = STEPS[step]

  useEffect(() => {
    if (!isScanning) return
    setVisible(false)
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [step, isScanning])

  if (!isScanning) return null

  return (
    <div className="w-full flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div className="flex items-center gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === step ? 18 : 6,
              height: 6,
              background:
                i < step ? '#10B981' : i === step ? '#06B6D4' : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>

      <div
        className="flex flex-col items-center gap-1.5 px-5 py-4 rounded-2xl text-center w-full max-w-xs"
        style={{
          background: 'rgba(13,19,33,0.9)',
          border: `1px solid ${current.last ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.18)'}`,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}
      >
        <span style={{ color: current.last ? '#10B981' : '#06B6D4' }}>
          {current.icon}
        </span>
        <p
          className="text-sm font-bold"
          style={{ color: current.last ? '#10B981' : '#EEF2FF', fontFamily: 'Satoshi, sans-serif' }}
        >
          {current.text}
        </p>
        <p className="text-xs" style={{ color: '#5C6B85' }}>
          {current.sub}
        </p>
      </div>

      <div
        className="w-full max-w-xs rounded-full px-4 py-2.5 text-xs font-semibold transition-colors"
        style={{
          fontFamily: 'Satoshi, sans-serif',
          background: 'rgba(13,19,33,0.75)',
          border: '1px solid rgba(59,130,246,0.12)',
          color: submitting ? '#8B9DC3'
            : !faceDetected ? '#FBBF24'
              : poseMatch ? '#06B6D4' : '#64748B',
        }}
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" opacity="0.25" />
              <path d="M12 2a10 10 0 0110 10" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Envoi en cours…
          </span>
        ) : !faceDetected ? (
          t('pose_no_face')
        ) : poseMatch ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              {holdProgress >= 0.98 ? (
                <>
                  <CheckMini />
                  {t('pose_validating')}
                </>
              ) : (
                t('pose_hold')
              )}
            </div>
            <div
              className="h-1.5 w-full rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <div
                className="h-full rounded-full transition-[width] duration-100 ease-linear"
                style={{
                  width: `${Math.round(holdProgress * 100)}%`,
                  background: 'linear-gradient(90deg, #3B82F6, #10B981)',
                }}
              />
            </div>
          </div>
        ) : (
          t('pose_hold')
        )}
      </div>
    </div>
  )
}

function CheckMini() {
  return (
    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}

function CenterIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
  )
}

function ArrowDownIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}
