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
  'up',
  'down',
  'done',
] as const

export type PoseStepId = (typeof SCAN_POSE_STEP_ORDER)[number]

/** État lissé (EMA) pour réduire le jitter entre frames vidéo */
export interface PoseSmoothState {
  yaw: number
  pitchT: number
}

const EMA_ALPHA = 0.38

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

  // Position verticale normalisée du nez dans le tiers visage (~0.45 neutre frontal)
  const pitchT = (nose.y - top.y) / spanY

  return { yaw, pitchT }
}

/**
 * Matching avec hysteresis douce : fenêtres légèrement différentes pour
 * "neutre" vs poses latérales pour limiter les oscillations.
 *
 * Convention du yaw :
 *   Le flux vidéo est affiché en miroir (scaleX(-1)) mais MediaPipe lit les
 *   pixels bruts non mirrorés. Quand l'utilisateur tourne sa tête vers SA
 *   gauche (côté gauche du miroir), le nez se déplace vers la DROITE dans la
 *   frame brute → yaw = nose.x - eyeMidX est POSITIF.
 */
export function poseMatchesStep(
  stepId: PoseStepId,
  s: PoseSmoothState,
  prevMatch: boolean,
): boolean {
  const yaw = s.yaw
  const pt = s.pitchT

  /** Fenêtres neutres horizontales */
  const yawNeutralLoose  = 0.038
  const yawNeutralCenter = prevMatch ? 0.030 : 0.022

  const pitchLow = prevMatch ? 0.390 : 0.380   // menton levé
  const pitchHi  = prevMatch ? 0.540 : 0.550   // menton baissé
  const pitchNeutralBand = pt >= pitchLow && pt <= pitchHi

  /**
   * Tête pivotée vers la gauche de l'utilisateur (miroir) :
   * dans la frame brute non mirrorée → yaw POSITIF.
   * Seuil bas pour être déclenchable facilement, max pour éviter faux positifs.
   */
  const yawLeftMin = prevMatch ? 0.022 : 0.028
  const yawLeftMax = 0.14

  switch (stepId) {
    case 'center':
    case 'center2':
      return Math.abs(yaw) < yawNeutralCenter && pitchNeutralBand
    case 'left':
      return yaw >= yawLeftMin && yaw <= yawLeftMax && pt <= pitchHi + 0.03
    case 'up':
      return Math.abs(yaw) < yawNeutralLoose && pt < pitchLow
    case 'down':
      return Math.abs(yaw) < yawNeutralLoose && pt > pitchHi
    case 'done':
      return Math.abs(yaw) < yawNeutralCenter && pitchNeutralBand
    default:
      return false
  }
}
