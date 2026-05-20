import { analyzeFaceWithMediaPipe } from '@/lib/mediapipe-server'
import type { ObjectiveScores } from '@/lib/analyze'

const MEDIAPIPE_TIMEOUT_MS = 8_000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise.then(v => v).catch(() => null),
    new Promise<null>(resolve => setTimeout(() => resolve(null), ms)),
  ])
}

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
    const mp = await withTimeout(analyzeFaceWithMediaPipe(buffer), MEDIAPIPE_TIMEOUT_MS)
    if (mp?.detected) {
      return {
        scores: {
          symetrie: mp.symetrie,
          proportions: mp.proportions,
          structure: mp.structure,
        },
        faceDetected: true,
      }
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
