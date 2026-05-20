import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

/** Mêmes indices que mediapipe-server.ts / Face Landmarker. */
export function computeClientScores(landmarks: NormalizedLandmark[]) {
  const leftEye = landmarks[33]
  const rightEye = landmarks[263]
  const nose = landmarks[4]
  const top = landmarks[10]
  const chin = landmarks[152]
  const jawLeft = landmarks[172]
  const jawRight = landmarks[397]

  if (!leftEye || !rightEye || !nose || !top || !chin || !jawLeft || !jawRight) {
    return { symetrie: 65, proportions: 63, structure: 61 }
  }

  const eyeMidX = (leftEye.x + rightEye.x) / 2
  const noseOffset = Math.abs(nose.x - eyeMidX)
  const symetrie = Math.round(Math.max(0, Math.min(100, 100 - noseOffset * 2000)))

  const faceHeight = Math.abs(chin.y - top.y)
  const faceWidth = Math.abs(jawRight.x - jawLeft.x) || 0.001
  const ratio = faceHeight / faceWidth
  const PHI = 1.618
  const deviation = Math.abs(ratio - PHI) / PHI
  const proportions = Math.round(Math.max(0, Math.min(100, 100 - deviation * 200)))

  const vL = { x: jawLeft.x - chin.x, y: jawLeft.y - chin.y }
  const vR = { x: jawRight.x - chin.x, y: jawRight.y - chin.y }
  const magL = Math.sqrt(vL.x ** 2 + vL.y ** 2)
  const magR = Math.sqrt(vR.x ** 2 + vR.y ** 2)
  let structure = 65
  if (magL > 0 && magR > 0) {
    const cosAngle = (vL.x * vR.x + vL.y * vR.y) / (magL * magR)
    const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI)
    const deviationAngle = Math.abs(angle - 117.5)
    structure = Math.round(Math.max(0, Math.min(100, 100 - deviationAngle * 2)))
  }

  return { symetrie, proportions, structure }
}
