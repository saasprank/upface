'use client'

/** Réponse `/api/analyze` — champs utiles pour régénérer la routine côté abonné. */
export type AnalyzeRoutinePayload = {
  scores?: Record<string, number> | null
  observations?: Record<string, string> | null
  /** `false` = utilisateur avec abonnement actif (voir `/api/analyze`). */
  freeAnalysis?: boolean
}

function readOnboardingPrefs(): { improve: string[]; dream: string; time: string } {
  try {
    const raw = localStorage.getItem('upface_onboarding')
    const o = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
    const improve = Array.isArray(o.improve) ? (o.improve as string[]) : []
    return {
      improve: improve.length > 0 ? improve : ['full'],
      dream: typeof o.dream === 'string' ? o.dream : 'same',
      time: typeof o.time === 'string' ? o.time : '10-15',
    }
  } catch {
    return { improve: ['full'], dream: 'same', time: '10-15' }
  }
}

/**
 * Après une analyse, régénère la routine IA uniquement pour les abonnés (`freeAnalysis === false`).
 * Met à jour `upface_routine` et `upface_scores` dans le localStorage.
 */
export async function syncSubscriberRoutineFromAnalyze(data: AnalyzeRoutinePayload): Promise<void> {
  if (data.freeAnalysis !== false) return
  const scores = data.scores
  if (!scores || typeof scores.global !== 'number') return

  const { improve, dream, time } = readOnboardingPrefs()
  const potentiel = Math.min(95, (scores.global ?? 70) + 14)
  const scoresPayload = { ...scores, potentiel: scores.potentiel ?? potentiel }

  try {
    const res = await fetch('/api/generate-routine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        improve,
        dream,
        time,
        scores: scoresPayload,
        observations: data.observations ?? null,
      }),
    })
    if (!res.ok) return
    const json = (await res.json()) as { routine?: unknown }
    if (json.routine) {
      localStorage.setItem('upface_routine', JSON.stringify(json.routine))
      localStorage.setItem('upface_scores', JSON.stringify(scoresPayload))
    }
  } catch {
    /* ignore */
  }
}

export function readRoutinePayloadFromLocalStorage(): {
  improve: string[]
  dream: string
  time: string
  scores: Record<string, number> | null
  observations: Record<string, string> | null
} {
  const { improve, dream, time } = readOnboardingPrefs()
  try {
    const scoresRaw = localStorage.getItem('upface_scores')
    const obsRaw = localStorage.getItem('upface_observations')
    return {
      improve,
      dream,
      time,
      scores: scoresRaw ? (JSON.parse(scoresRaw) as Record<string, number>) : null,
      observations: obsRaw ? (JSON.parse(obsRaw) as Record<string, string>) : null,
    }
  } catch {
    return { improve, dream, time, scores: null, observations: null }
  }
}
