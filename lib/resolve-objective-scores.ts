import { analyzeFaceWithMediaPipe } from '@/lib/mediapipe-server'
import type { ObjectiveScores } from '@/lib/analyze'

export async function resolveObjectiveScoresFromImage(
  imageBuffer: Buffer | null,
  imageUrl: string,
  clientFallback: ObjectiveScores | null,
): Promise<{ scores: ObjectiveScores; faceDetected: boolean }> {
  let buffer = imageBuffer

  if (!buffer?.length && imageUrl.trim()) {
    try {
      const res = await fetch(imageUrl)
      if (res.ok) {
        buffer = Buffer.from(await res.arrayBuffer())
      }
    } catch {
      /* ignore */
    }
  }

  if (buffer?.length) {
    try {
      const mp = await analyzeFaceWithMediaPipe(buffer)
      if (mp.detected) {
        return {
          scores: {
            symetrie: mp.symetrie,
            proportions: mp.proportions,
            structure: mp.structure,
          },
          faceDetected: true,
        }
      }
    } catch (err) {
      console.error('[resolveObjectiveScores] MediaPipe failed:', err)
    }
  }

  if (clientFallback) {
    return { scores: clientFallback, faceDetected: true }
  }

  return {
    scores: { symetrie: 68, proportions: 66, structure: 64 },
    faceDetected: false,
  }
}
