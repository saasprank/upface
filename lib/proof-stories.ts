export const PROOF_STORY_IDS = ['mehdi', 'lucas', 'theo'] as const

export type ProofStoryId = (typeof PROOF_STORY_IDS)[number]

export interface ProofStoryMetric {
  labelKey: string
  delta: number
  /** Largeur relative de la barre (0–100). */
  fill: number
}

export interface ProofStory {
  id: ProofStoryId
  before: number
  after: number
  delta: number
  percentile: number
  weeks: number
  metrics: ProofStoryMetric[]
}

export const PROOF_STORIES: ProofStory[] = [
  {
    id: 'mehdi',
    before: 58,
    after: 74,
    delta: 16,
    percentile: 28,
    weeks: 6,
    metrics: [
      { labelKey: 'metric_skin', delta: 24, fill: 100 },
      { labelKey: 'metric_grooming', delta: 22, fill: 92 },
      { labelKey: 'metric_aura', delta: 11, fill: 46 },
    ],
  },
  {
    id: 'lucas',
    before: 52,
    after: 71,
    delta: 19,
    percentile: 33,
    weeks: 8,
    metrics: [
      { labelKey: 'metric_structure', delta: 25, fill: 100 },
      { labelKey: 'metric_proportions', delta: 17, fill: 68 },
      { labelKey: 'metric_aura', delta: 14, fill: 56 },
    ],
  },
  {
    id: 'theo',
    before: 63,
    after: 78,
    delta: 15,
    percentile: 21,
    weeks: 4,
    metrics: [
      { labelKey: 'metric_aura', delta: 24, fill: 100 },
      { labelKey: 'metric_grooming', delta: 17, fill: 71 },
      { labelKey: 'metric_symmetry', delta: 9, fill: 38 },
    ],
  },
]

export const PROOF_AGGREGATE_KEYS = ['avg_progress', 'satisfaction', 'visible_results'] as const
