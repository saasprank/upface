import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

export function computeClientScores(landmarks: NormalizedLandmark[]) {
  // Symétrie : compare distances gauche/droite
  const leftEye = landmarks[33]
  const rightEye = landmarks[263]
  const nose = landmarks[1]
  const leftMouth = landmarks[61]
  const rightMouth = landmarks[291]

  const eyeSymmetry = 1 - Math.abs(
    Math.abs(nose.x - leftEye.x) - Math.abs(rightEye.x - nose.x)
  ) * 10

  const mouthSymmetry = 1 - Math.abs(
    Math.abs(nose.x - leftMouth.x) - Math.abs(rightMouth.x - nose.x)
  ) * 10

  const symetrie = Math.round(Math.min(100, Math.max(50, (eyeSymmetry + mouthSymmetry) / 2 * 100)))

  // Proportions : ratio doré (idéal = 1.618)
  const foreheadTop = landmarks[10]
  const chin = landmarks[152]
  const faceHeight = Math.abs(chin.y - foreheadTop.y)
  const faceWidth = Math.abs(rightEye.x - leftEye.x) * 2.5
  const ratio = faceHeight / (faceWidth || 0.001)
  const goldenDiff = Math.abs(ratio - 1.618)
  const proportions = Math.round(Math.min(100, Math.max(50, 100 - goldenDiff * 30)))

  // Structure : angle mandibulaire
  const jawLeft = landmarks[234]
  const jawRight = landmarks[454]
  const jawWidth = Math.abs(jawRight.x - jawLeft.x)
  const structure = Math.round(Math.min(100, Math.max(50, jawWidth * 180)))

  return { symetrie, proportions, structure }
}
