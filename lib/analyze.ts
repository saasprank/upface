import { getOpenAIClient } from './openai'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnalysisScores {
  global: number
  symetrie: number
  proportions: number
  structure: number
  peau: number
  grooming: number
  aura: number
}

export interface AnalysisObservations {
  symetrie: string
  proportions: string
  structure: string
  peau: string
  grooming: string
  aura: string
}

export interface AnalysisRoutine {
  skincare: string[]
  grooming: string[]
  fitness: string[]
  style: string[]
  aura: string[]
}

export type AnalysisTier = 'elite' | 'attractive' | 'average' | 'below'

export interface AnalysisResult {
  scores: AnalysisScores
  tier: AnalysisTier
  observations: AnalysisObservations
  routine: AnalysisRoutine
  percentile: number
}

/** Scores déjà calculés par MediaPipe (passés au prompt GPT) */
export interface ObjectiveScores {
  symetrie: number
  proportions: number
  structure: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTier(globalScore: number): AnalysisTier {
  if (globalScore >= 85) return 'elite'
  if (globalScore >= 70) return 'attractive'
  if (globalScore >= 50) return 'average'
  return 'below'
}

/** Borne un score GPT autour de la référence MediaPipe (±delta). */
function clampScoreAroundRef(ref: number, value: number | undefined, delta = 8): number {
  const v = typeof value === 'number' && !Number.isNaN(value) ? value : ref
  const lo = Math.max(0, ref - delta)
  const hi = Math.min(100, ref + delta)
  return Math.round(Math.min(hi, Math.max(lo, v)))
}

// ─── Prompt GPT-4o ────────────────────────────────────────────────────────────

function buildPrompt(objectiveScores: ObjectiveScores, randomSeed: string): string {
  const { symetrie: refSym, proportions: refProp, structure: refStruct } = objectiveScores

  return `[Session: ${randomSeed}]
Tu es un expert en analyse faciale scientifique et en looksmaxxing.

Références algorithmiques (landmarks / MediaPipe) — point de départ, pas des valeurs figées :
- Symétrie (réf.)      : ${refSym}/100
- Proportions (réf.)   : ${refProp}/100 (ratio doré Phi ≈ 1.618)
- Structure (réf.)     : ${refStruct}/100 (angle mandibulaire, mâchoire)

Consignes obligatoires :
- Analyse objectivement la photo fournie.
- Les scores DOIVENT refléter ce que tu vois réellement sur CETTE photo spécifique.
- Ne jamais retourner les mêmes scores ni les mêmes formulations que pour une analyse précédente — chaque session est unique.
- Varie tes observations et formulations à chaque analyse (utilise le libellé Session comme repère d’unicité).
- Pour symétrie, proportions et structure : choisis un entier dans [référence−12, référence+12] (borné 0–100) selon l’angle, la lumière et l’expression visibles sur l’image.
- Pour peau, grooming et aura : entiers 0–100 uniquement à partir de ce que tu observes sur l’image (texture, pores, barbe, regard, etc.).
- score_global : moyenne pondérée (symétrie×0.2 + proportions×0.2 + structure×0.2 + peau×0.15 + grooming×0.15 + aura×0.10), arrondie à l’entier.
- percentile : rang estimé dans la population (0 = pire, 100 = meilleur), cohérent avec score_global.

Les observations doivent être SPÉCIFIQUES à ce visage (pas génériques). La routine doit être adaptée aux faiblesses visibles sur cette image.

Retourne UNIQUEMENT ce JSON valide, sans texte avant ou après :

{
  "scores": {
    "global": <entier 0-100>,
    "symetrie": <entier 0-100>,
    "proportions": <entier 0-100>,
    "structure": <entier 0-100>,
    "peau": <entier 0-100>,
    "grooming": <entier 0-100>,
    "aura": <entier 0-100>
  },
  "tier": "elite|attractive|average|below",
  "observations": {
    "symetrie": "observation factuelle et spécifique",
    "proportions": "observation factuelle et spécifique",
    "structure": "observation factuelle et spécifique",
    "peau": "observation sur ce qui est visible dans l'image",
    "grooming": "observation sur ce qui est visible dans l'image",
    "aura": "observation sur l'énergie et la présence perçues"
  },
  "routine": {
    "skincare":  ["action adaptée 1", "action adaptée 2", "action adaptée 3", "action adaptée 4"],
    "grooming":  ["action adaptée 1", "action adaptée 2", "action adaptée 3", "action adaptée 4"],
    "fitness":   ["action adaptée 1", "action adaptée 2", "action adaptée 3", "action adaptée 4"],
    "style":     ["action adaptée 1", "action adaptée 2", "action adaptée 3", "action adaptée 4"],
    "aura":      ["action adaptée 1", "action adaptée 2", "action adaptée 3", "action adaptée 4"]
  },
  "percentile": <entier 0-100>
}`
}

// ─── Mock (dev sans clé OpenAI) ───────────────────────────────────────────────

function getMockAnalysis(objectiveScores: ObjectiveScores): AnalysisResult {
  const peau     = Math.floor(Math.random() * 25) + 60
  const grooming = Math.floor(Math.random() * 20) + 65
  const aura     = Math.floor(Math.random() * 20) + 65
  const global   = Math.round(
    (objectiveScores.symetrie * 0.2 +
     objectiveScores.proportions * 0.2 +
     objectiveScores.structure * 0.2 +
     peau * 0.15 +
     grooming * 0.15 +
     aura * 0.10)
  )

  return {
    scores: {
      global,
      symetrie:    objectiveScores.symetrie,
      proportions: objectiveScores.proportions,
      structure:   objectiveScores.structure,
      peau,
      grooming,
      aura,
    },
    tier: getTier(global),
    observations: {
      symetrie:    'Bonne symétrie faciale globale avec un léger décalage au niveau des yeux.',
      proportions: 'Les proportions dorées sont bien respectées. Le ratio front/nez/menton est équilibré.',
      structure:   'Mâchoire bien définie avec des pommettes modérément saillantes.',
      peau:        'Teint uniforme avec quelques imperfections légères. Bonne texture générale.',
      grooming:    'Style personnel cohérent. Quelques améliorations possibles au niveau de la coupe.',
      aura:        'Présence naturelle et regard expressif. Confiance visible dans la posture.',
    },
    routine: {
      skincare: [
        'Nettoyage doux matin et soir avec un gel nettoyant adapté',
        'Application de sérum vitamine C chaque matin',
        'Hydratant SPF 50 le matin',
        'Acide hyaluronique + rétinol le soir',
      ],
      grooming: [
        'Contour de barbe précis tous les 3 jours',
        'Soin des sourcils : épilation légère des poils parasites',
        'Exfoliation du visage 2x/semaine',
        'Massage facial gua sha 10 min/soir',
      ],
      fitness: [
        'Mewing constant (bonne posture de langue)',
        'Exercices de mastication avec du chewing-gum dur',
        'Gainage 3x/semaine pour la posture',
        'Cardio 30 min 4x/semaine pour améliorer le teint',
      ],
      style: [
        'Coupe qui met en valeur la structure faciale',
        'Couleurs neutres et sobres pour le vestimentaire',
        'Accessoires minimalistes (montre, bracelet discret)',
        'Posture : épaules en arrière, menton légèrement levé',
      ],
      aura: [
        'Méditation 10 min par jour pour réduire le stress (impact cutané)',
        'Contact visuel direct en conversation',
        'Sourire contrôlé, légèrement asymétrique pour plus de charisme',
        'Voix grave et posée : exercices de diction',
      ],
    },
    percentile: Math.min(99, Math.round(global * 0.9 + 5)),
  }
}

// ─── Analyse principale ───────────────────────────────────────────────────────

/**
 * Appelle GPT-4o Vision avec les scores MediaPipe comme références (±12 une fois parsé).
 */
export async function analyzeImage(
  imageUrl: string,
  objectiveScores: ObjectiveScores,
  /** Image déjà en mémoire (upload Storage impossible côté client → fallback base64) */
  imageBuffer?: Buffer | null,
): Promise<AnalysisResult> {
  if (!process.env.OPENAI_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return getMockAnalysis(objectiveScores)
  }

  const randomSeed = Math.random().toString(36).substring(7)

  // Convertir l'image en base64 pour GPT-4o (évite les problèmes d'accès URL privées)
  let imagePayload: { type: 'image_url'; image_url: { url: string; detail: 'high' } }

  if (imageBuffer && imageBuffer.byteLength > 0) {
    const b64 = imageBuffer.toString('base64')
    imagePayload = {
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${b64}`, detail: 'high' },
    }
  } else if (imageUrl.trim()) {
    try {
      const imgRes = await fetch(imageUrl)
      const imgBuf = await imgRes.arrayBuffer()
      const contentType = imgRes.headers.get('content-type') ?? 'image/jpeg'
      const b64 = Buffer.from(imgBuf).toString('base64')
      imagePayload = {
        type: 'image_url',
        image_url: { url: `data:${contentType};base64,${b64}`, detail: 'high' },
      }
    } catch {
      // Fallback : passer l'URL directement
      imagePayload = {
        type: 'image_url',
        image_url: { url: imageUrl, detail: 'high' },
      }
    }
  } else {
    throw new Error('No image provided for vision analysis')
  }

  const openai = getOpenAIClient()

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: buildPrompt(objectiveScores, randomSeed) },
      {
        role: 'user',
        content: [
          imagePayload,
          {
            type: 'text',
            text: `Analyse cette photo pour la session [${randomSeed}]. Remplis le JSON en suivant toutes les consignes système (scores visuels, variété des formulations).`,
          },
        ],
      },
    ],
    max_tokens: 1800,
    temperature: 0.8,
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('No response from OpenAI')

  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found in OpenAI response')

  const parsed = JSON.parse(jsonMatch[0]) as AnalysisResult

  // Symétrie / proportions / structure : autoriser la variabilité GPT mais borner à ±12 autour MediaPipe
  parsed.scores.symetrie    = clampScoreAroundRef(objectiveScores.symetrie,    parsed.scores.symetrie)
  parsed.scores.proportions = clampScoreAroundRef(objectiveScores.proportions, parsed.scores.proportions)
  parsed.scores.structure   = clampScoreAroundRef(objectiveScores.structure,   parsed.scores.structure)

  const s = parsed.scores
  parsed.scores.global = Math.round(
    s.symetrie * 0.2 +
      s.proportions * 0.2 +
      s.structure * 0.2 +
      s.peau * 0.15 +
      s.grooming * 0.15 +
      s.aura * 0.10
  )
  parsed.scores.global = Math.min(100, Math.max(0, parsed.scores.global))

  parsed.tier = getTier(parsed.scores.global)

  return parsed
}
