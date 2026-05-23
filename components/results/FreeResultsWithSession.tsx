'use client'

import { useEffect, useState } from 'react'
import ResultsPageView from '@/components/results/ResultsPageView'
import { loadAnalysisSession, type AnalysisSessionPayload } from '@/lib/analysis-session'

interface FreeResultsWithSessionProps {
  analysisId: string
  photoUrl: string
  serverScores: AnalysisSessionPayload['scores']
  serverObservations: Record<string, string>
  serverTier: string
  serverPercentile: number
  createdAt: string
  prefix: string
  routine?: {
    skincare: string[]
    grooming: string[]
    fitness: string[]
    style: string[]
    aura: string[]
  }
}

export default function FreeResultsWithSession({
  analysisId,
  serverScores,
  serverObservations,
  serverTier,
  serverPercentile,
  createdAt,
  prefix,
  routine,
}: FreeResultsWithSessionProps) {
  const [payload, setPayload] = useState<AnalysisSessionPayload | null>(null)

  useEffect(() => {
    setPayload(loadAnalysisSession(analysisId))
  }, [analysisId])

  const scores = payload?.scores ?? serverScores
  const tier = payload?.tier ?? serverTier

  useEffect(() => {
    try {
      localStorage.setItem('upface_scores', JSON.stringify({
        ...scores,
        percentile: payload?.percentile ?? serverPercentile,
      }))
      const observations =
        payload?.observations && Object.keys(payload.observations).length > 0
          ? payload.observations
          : serverObservations
      if (observations && Object.keys(observations).length > 0) {
        localStorage.setItem('upface_observations', JSON.stringify(observations))
      }
    } catch { /* ignore */ }
  }, [scores, payload, serverPercentile, serverObservations])

  return (
    <ResultsPageView
      analysisId={analysisId}
      scores={scores}
      tier={tier}
      createdAt={createdAt}
      prefix={prefix}
      isSubscribed={false}
      routine={routine}
    />
  )
}
