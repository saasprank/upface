'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { SCAN_POSE_STEP_ORDER, type PoseStepId } from '@/lib/face-pose-heuristics'
import type { AnalyzeState } from './FaceCadran'

const STEP_META: Record<PoseStepId, { text: string; sub: string; icon: ReactNode; last?: boolean }> = {
  right: {
    text: 'Tourne légèrement à droite',
    sub: 'Un petit mouvement suffit (~15°)',
    icon: <ArrowRightIcon />,
  },
  left: {
    text: 'Tourne légèrement à gauche',
    sub: 'Un petit mouvement suffit (~15°)',
    icon: <ArrowLeftIcon />,
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
  center: {
    text: 'Regarde face caméra',
    sub: 'Visage centré, ne bouge plus',
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
  poseHintKey: string | null
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
      className="absolute left-1/2 z-20 px-4 py-2.5 rounded-xl text-center w-[min(280px,calc(100vw-2rem))] pointer-events-none"
      style={{
        top: 'calc(env(safe-area-inset-top, 0px) + 52px)',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(-50%, 0)' : 'translate(-50%, -6px)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}
      role="status"
      aria-live="polite"
    >
      <p className="text-base mb-0.5 flex justify-center text-white [&_svg]:w-6 [&_svg]:h-6">{current.icon}</p>
      <p className="text-white font-bold text-sm leading-snug" style={{ fontFamily: 'Satoshi, sans-serif' }}>
        {current.text}
      </p>
      <p className="text-xs mt-0.5 leading-snug" style={{ color: '#8B9DC3' }}>
        {current.sub}
      </p>
    </div>
  )
}

export default function ScanInstructions({
  state,
  submitting,
  currentStepIndex,
  faceDetected,
  poseMatch,
  holdProgress,
  poseHintKey,
}: ScanInstructionsProps) {
  const t = useTranslations('analyzeLive')
  const currentStep = getScanPoseStep(currentStepIndex)

  const isScanning = state === 'scanning' || state === 'redirecting'

  if (!isScanning) return null

  const hintMessage = poseHintKey ? t(poseHintKey as 'pose_hint.center') : t('pose_hint.adjust')

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
            : poseMatch ? '#22D3EE' : '#3D4F6E',
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
          {t('submitting')}
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
              <>
                <HoldPulse />
                {t('pose_hold')}
              </>
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
                background: 'linear-gradient(90deg, #22D3EE, rgba(34,211,238,0.5))',
              }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5 text-center">
          <p className="text-[#EEF2FF] font-bold">{currentStep.text}</p>
          <p className="text-xs font-medium leading-snug" style={{ color: '#22D3EE' }}>
            → {hintMessage}
          </p>
        </div>
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

function HoldPulse() {
  return (
    <span
      className="w-2 h-2 rounded-full shrink-0 animate-pulse"
      style={{ background: '#22D3EE' }}
      aria-hidden
    />
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

function ArrowRightIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
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
