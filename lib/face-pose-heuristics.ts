/**
 * Heuristiques de pose à partir des landmarks Face Landmarker normalisés
 * (indices alignées sur mediapipe-server.ts : nez ~4, yeux ~33/~263,
 * front ~10, menton ~152, mâchoires ~172/~397).
 */
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

export const SCAN_POSE_STEP_ORDER = [
  'center',
  'left',
  'center2',
  'done',
] as const

export type PoseStepId = (typeof SCAN_POSE_STEP_ORDER)[number]

/** État lissé (EMA) pour réduire le jitter entre frames vidéo */
export interface PoseSmoothState {
  yaw: number
  pitchT: number
}

const EMA_ALPHA = 0.32

export function smoothPoseSignals(
  prev: PoseSmoothState | null,
  rawYaw: number,
  rawPitchT: number,
): PoseSmoothState {
  if (!prev) return { yaw: rawYaw, pitchT: rawPitchT }
  return {
    yaw: prev.yaw * (1 - EMA_ALPHA) + rawYaw * EMA_ALPHA,
    pitchT: prev.pitchT * (1 - EMA_ALPHA) + rawPitchT * EMA_ALPHA,
  }
}

export function landmarksUsable(lm: NormalizedLandmark[] | undefined): boolean {
  if (!lm?.length) return false
  const idx = [4, 33, 263, 10, 152, 172, 397]
  return idx.every(i => lm[i] != null && Number.isFinite(lm[i]?.x))
}

/** Signaux géométriques bruts (non lissés) */
export function computeRawPoseSignals(lm: NormalizedLandmark[]): { yaw: number; pitchT: number } | null {
  const nose = lm[4]
  const le = lm[33]
  const re = lm[263]
  const top = lm[10]
  const chin = lm[152]

  const eyeMidX = (le.x + re.x) / 2
  const yaw = nose.x - eyeMidX

  const spanY = chin.y - top.y
  if (!(spanY > 1e-4)) return null

  const pitchT = (nose.y - top.y) / spanY

  return { yaw, pitchT }
}

/**
 * Matching avec hysteresis douce : fenêtres élargies pour faciliter la validation mobile.
 */
export function poseMatchesStep(
  stepId: PoseStepId,
  s: PoseSmoothState,
  prevMatch: boolean,
): boolean {
  const yaw = s.yaw
  const pt = s.pitchT

  const yawNeutralLoose = 0.055
  const yawNeutralCenter = prevMatch ? 0.048 : 0.038

  const pitchLow = prevMatch ? 0.400 : 0.392
  const pitchHi = prevMatch ? 0.520 : 0.528
  const pitchNeutralBand = pt >= pitchLow && pt <= pitchHi

  const yawLeftMin = prevMatch ? 0.012 : 0.016
  const yawLeftMax = 0.20

  switch (stepId) {
    case 'center':
    case 'center2':
      return Math.abs(yaw) < yawNeutralCenter && pitchNeutralBand
    case 'left':
      return yaw >= yawLeftMin && yaw <= yawLeftMax && pt <= pitchHi + 0.05
    case 'done':
      return Math.abs(yaw) < yawNeutralLoose && pitchNeutralBand
    default:
      return false
  }
}

/** Clé i18n pour guider l'utilisateur quand la pose n'est pas encore reconnue. */
export function getPoseHintKey(
  stepId: PoseStepId,
  s: PoseSmoothState,
  match: boolean,
): string | null {
  if (match) return null

  const yaw = s.yaw
  const pt = s.pitchT

  switch (stepId) {
    case 'center':
    case 'center2':
    case 'done':
      if (Math.abs(yaw) > 0.032) return 'pose_hint.center'
      if (pt < 0.388) return 'pose_hint.chin_up'
      if (pt > 0.542) return 'pose_hint.chin_down'
      return 'pose_hint.center'
    case 'left':
      if (yaw < 0.012) return 'pose_hint.turn_left'
      if (yaw > 0.19) return 'pose_hint.turn_left_less'
      return 'pose_hint.turn_left'
    default:
      return 'pose_hint.adjust'
  }
}
