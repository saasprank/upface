import { SCAN_POSE_STEP_ORDER } from '@/lib/face-pose-heuristics'

/** Durée cible de l'API analyze (freemium, MediaPipe client). */
export const SCAN_ESTIMATED_API_MS = 8_000

/** Upload photo + latence réseau avant réponse JSON. */
export const SCAN_UPLOAD_BUFFER_MS = 1_500

export const SCAN_STEP_COUNT = SCAN_POSE_STEP_ORDER.length

/** Étapes 0..n-2 : validation de pose avant l'appel API. */
export const SCAN_PRE_API_STEPS = SCAN_STEP_COUNT - 1

export function getScanTiming() {
  const apiPhaseMs = SCAN_ESTIMATED_API_MS + SCAN_UPLOAD_BUFFER_MS
  const poseHoldMs = Math.max(
    900,
    Math.round((apiPhaseMs * 0.5) / SCAN_PRE_API_STEPS),
  )
  const maxStepMs = Math.round(poseHoldMs * 2.8)
  const totalMs = poseHoldMs * SCAN_PRE_API_STEPS + apiPhaseMs

  return {
    poseHoldMs,
    maxStepMs,
    apiPhaseMs,
    totalMs,
  }
}
