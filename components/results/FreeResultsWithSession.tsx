'use client'

import { useEffect, useState } from 'react'
import FreeResultsView from '@/components/results/FreeResultsView'
import { loadAnalysisSession, type AnalysisSessionPayload } from '@/lib/analysis-session'

interface FreeResultsWithSessionProps {
  analysisId: string
  photoUrl: string
  serverScores: AnalysisSessionPayload['scores']
  serverObservations: Record<string, string>
  serverTier: string
  serverPercentile: number
  prefix: string
}

export default function FreeResultsWithSession({
  analysisId,
  photoUrl,
  serverScores,
  serverObservations,
  serverTier,
  serverPercentile,
  prefix,
}: FreeResultsWithSessionProps) {
  const [payload, setPayload] = useState<AnalysisSessionPayload | null>(null)

  useEffect(() => {
    setPayload(loadAnalysisSession(analysisId))
  }, [analysisId])

  const scores = payload?.scores ?? serverScores
  const observations =
    payload?.observations && Object.keys(payload.observations).length > 0
      ? payload.observations
      : serverObservations
  const tier = payload?.tier ?? serverTier
  const percentile = payload?.percentile ?? serverPercentile

  return (
    <FreeResultsView
      analysisId={analysisId}
      photoUrl={photoUrl}
      scores={scores}
      observations={observations}
      tier={tier}
      percentile={percentile}
      prefix={prefix}
    />
  )
}
