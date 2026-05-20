import type { AnalysisScores } from '@/lib/analyze'
import type { ObjectiveScores } from '@/lib/analyze'

function clamp(n: number, min = 0, max = 100): number {
  return Math.round(Math.max(min, Math.min(max, n)))
}

/** Dérive peau / grooming / aura / global à partir des scores géométriques (par visage). */
export function deriveFullScoresFromObjective(objective: ObjectiveScores): AnalysisScores {
  const { symetrie, proportions, structure } = objective

  const peau = clamp(42 + proportions * 0.38 + symetrie * 0.22)
  const grooming = clamp(40 + structure * 0.45 + symetrie * 0.12)
  const aura = clamp(44 + (symetrie + structure) * 0.28 - proportions * 0.06)

  const global = clamp(
    symetrie * 0.2 +
      proportions * 0.2 +
      structure * 0.2 +
      peau * 0.15 +
      grooming * 0.15 +
      aura * 0.1,
  )

  return {
    global,
    symetrie,
    proportions,
    structure,
    peau,
    grooming,
    aura,
  }
}

export function getTierFromGlobal(global: number): 'elite' | 'attractive' | 'average' | 'below' {
  if (global >= 85) return 'elite'
  if (global >= 70) return 'attractive'
  if (global >= 50) return 'average'
  return 'below'
}

export function derivePercentile(global: number): number {
  return clamp(global * 0.85 + 8, 12, 92)
}

export function buildFreeObservations(scores: AnalysisScores) {
  return {
    symetrie:
      scores.symetrie >= 68
        ? `Bonne symétrie globale (${scores.symetrie}/100), légers écarts possibles au niveau des yeux.`
        : `Asymétries visibles (${scores.symetrie}/100) — travail de posture et d'angle recommandé.`,
    proportions:
      scores.proportions >= 65
        ? `Proportions harmonieuses (${scores.proportions}/100), ratio vertical cohérent.`
        : `Proportions à rééquilibrer (${scores.proportions}/100) — tiers facial perfectible.`,
    structure:
      scores.structure >= 65
        ? `Structure solide (${scores.structure}/100), mâchoire et pommettes bien marquées.`
        : `Structure modérée (${scores.structure}/100), définition mandibulaire à renforcer.`,
    peau:
      scores.peau >= 62
        ? `Teint globalement uniforme (${scores.peau}/100), texture améliorable.`
        : `Peau avec imperfections notables (${scores.peau}/100), routine ciblée conseillée.`,
    grooming:
      scores.grooming >= 62
        ? `Grooming correct (${scores.grooming}/100), finitions à optimiser.`
        : `Grooming perfectible (${scores.grooming}/100), barbe/coupe à structurer.`,
    aura:
      scores.aura >= 62
        ? `Présence correcte (${scores.aura}/100), confiance à renforcer.`
        : `Aura discrète (${scores.aura}/100), posture et regard à travailler.`,
  }
}
