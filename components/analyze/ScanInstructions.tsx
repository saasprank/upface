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
    icon: <ArrowUpIcon />,
  },
  left: {
    text: 'Tourne la tête à gauche',
    sub: 'Environ 20°, reste naturel',
    icon: <ArrowLeftIcon />,
  },
  center2: {
    text: 'Reviens face caméra',
    sub: 'Repositionne-toi bien au centre',
    icon: <ArrowUpIcon />,
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

export const SCAN_POSE_STEPS = SCAN_POSE_STEP_ORDER.map(id => ({ id, ...STEP_META[id] }))

export function getScanPoseStep(stepIndex: number) {
  return SCAN_POSE_STEPS[Math.min(stepIndex, SCAN_POSE_STEPS.length - 1)]
}

export interface ScanInstructionsProps {
  state: AnalyzeState
  submitting: boolean
  currentStepIndex: number
  faceDetected: boolean
  poseMatch: boolean
  holdProgress: number
}

export function ScanPoseInstructionCard({
  stepIndex,
  visible,
}: {
  stepIndex: number
  visible: boolean
}) {
  const current = getScanPoseStep(stepIndex)

  return (
    <div
      className="absolute top-20 left-1/2 z-20 px-6 py-4 rounded-2xl text-center min-w-[260px] max-w-[90vw]"
      style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(-50%, 0)' : 'translate(-50%, -6px)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}
      role="status"
      aria-live="polite"
    >
      <p className="text-2xl mb-1 flex justify-center text-white">{current.icon}</p>
      <p className="text-white font-bold text-lg" style={{ fontFamily: 'Satoshi, sans-serif' }}>
        {current.text}
      </p>
      <p className="text-sm mt-1" style={{ color: '#8B9DC3' }}>
        {current.sub}
      </p>
    </div>
  )
}

export default function ScanInstructions({
  state,
  submitting,
  faceDetected,
  poseMatch,
  holdProgress,
}: ScanInstructionsProps) {
  const t = useTranslations('analyzeLive')

  const isScanning = state === 'scanning' || state === 'redirecting'

  if (!isScanning) return null

  return (
    <div
      className="w-full max-w-sm mx-auto rounded-2xl px-4 py-3 text-sm font-semibold transition-colors"
      style={{
        fontFamily: 'Satoshi, sans-serif',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: submitting ? '#8B9DC3'
          : !faceDetected ? '#FBBF24'
            : poseMatch ? '#22D3EE' : '#64748B',
      }}
      role="status"
      aria-live="polite"
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
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-100 ease-linear"
              style={{
                width: `${Math.round(holdProgress * 100)}%`,
                background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.6))',
              }}
            />
          </div>
        </div>
      ) : (
        t('pose_hold')
      )}
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

function ArrowLeftIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
  )
}

function ArrowDownIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}
