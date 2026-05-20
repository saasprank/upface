export type AnalysisSessionPayload = {
  scores: {
    global: number
    symetrie: number
    proportions: number
    structure: number
    peau: number
    grooming: number
    aura: number
  }
  observations?: Record<string, string>
  tier?: string
  percentile?: number
  freeAnalysis?: boolean
}

export function analysisSessionKey(id: string): string {
  return `upface_analysis_${id}`
}

export function saveAnalysisSession(id: string, payload: AnalysisSessionPayload): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(analysisSessionKey(id), JSON.stringify(payload))
  } catch {
    /* ignore quota */
  }
}

export function loadAnalysisSession(id: string): AnalysisSessionPayload | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(analysisSessionKey(id))
    if (!raw) return null
    return JSON.parse(raw) as AnalysisSessionPayload
  } catch {
    return null
  }
}
