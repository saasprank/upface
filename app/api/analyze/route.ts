import { type NextRequest, NextResponse } from 'next/server'
import { analyzeImage } from '@/lib/analyze'
import {
  buildFreeObservations,
  deriveFullScoresFromObjective,
  derivePercentile,
  getTierFromGlobal,
} from '@/lib/derive-analysis-scores'
import { resolveObjectiveScoresFromImage } from '@/lib/resolve-objective-scores'

export const runtime = 'nodejs'

interface ClientScores {
  symetrie: number
  proportions: number
  structure: number
}

interface AnalyzeRequestBody {
  imageUrl?: string
  /** JPEG/PNG en data URL ou base64 pur — utilisé si l'upload Storage échoue (ex. visiteur non auth) */
  imageBase64?: string
  clientScores?: ClientScores | null
  demo?: boolean
}

function decodeBase64ImagePayload(raw: string): Buffer | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  try {
    const dataUrl = trimmed.match(/^data:image\/[\w+.-]+;base64,(.+)$/i)
    if (dataUrl?.[1]) return Buffer.from(dataUrl[1], 'base64')
    return Buffer.from(trimmed, 'base64')
  } catch {
    return null
  }
}

function isValidClientScores(v: unknown): v is ClientScores {
  if (!v || typeof v !== 'object') return false
  const s = v as Record<string, unknown>
  return (
    typeof s.symetrie === 'number' &&
    typeof s.proportions === 'number' &&
    typeof s.structure === 'number'
  )
}

async function checkUserSubscription(userId: string | null): Promise<boolean> {
  if (!userId) return false
  try {
    const { createClient } = await import('@/lib/supabase-server')
    const supabase = await createClient()
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single()
    return sub?.status === 'active' || sub?.status === 'trialing'
  } catch {
    return false
  }
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalyzeRequestBody
    const demo = Boolean(body.demo)
    const trimmedUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : ''
    const imageBase64Raw = typeof body.imageBase64 === 'string' ? body.imageBase64 : ''
    const clientScores = isValidClientScores(body.clientScores) ? body.clientScores : null

    // ── 1. Identify user & check subscription ────────────────────────────────
    let userId: string | null = null
    let isSubscribed = false

    try {
      const { createClient } = await import('@/lib/supabase-server')
      const supabase = await createClient()
      const { data: { session } } = await supabase.auth.getSession()
      userId = session?.user?.id ?? null
      isSubscribed = await checkUserSubscription(userId)
    } catch {
      isSubscribed = false
    }

    // Image → Buffer from base64 payload if provided
    let imageBuffer: Buffer | null = null
    if (imageBase64Raw) {
      imageBuffer = decodeBase64ImagePayload(imageBase64Raw)
      if (!imageBuffer?.length) imageBuffer = null
    }

    if (!demo && !trimmedUrl && !imageBuffer?.length) {
      return NextResponse.json({ error: 'IMAGE_REQUIRED' }, { status: 400 })
    }

    const { scores: objectiveScores, faceDetected } = await resolveObjectiveScoresFromImage(
      imageBuffer,
      trimmedUrl,
      clientScores,
    )

    if (!demo && !faceDetected) {
      return NextResponse.json({ error: 'NO_FACE_DETECTED' }, { status: 422 })
    }

    let analysisId = `demo-${Date.now()}`

    // ── 2. Freemium preview (no GPT-4o) ───────────────────────────────────────
    if (!isSubscribed) {
      const fullScores = deriveFullScoresFromObjective(objectiveScores)
      const previewTier = getTierFromGlobal(fullScores.global)
      const previewPercentile = derivePercentile(fullScores.global)
      const previewObservations = buildFreeObservations(fullScores)

      try {
        const { createClient } = await import('@/lib/supabase-server')
        const supabase = await createClient()
        const { data } = await supabase
          .from('analyses')
          .insert({
            user_id:           userId,
            photo_url:         trimmedUrl,
            score_global:      fullScores.global,
            score_symetrie:    fullScores.symetrie,
            score_proportions: fullScores.proportions,
            score_structure:   fullScores.structure,
            score_peau:        fullScores.peau,
            score_grooming:    fullScores.grooming,
            score_aura:        fullScores.aura,
            tier:              previewTier,
            percentile:        previewPercentile,
            observations:      previewObservations,
          })
          .select('id')
          .single()
        if (data) analysisId = data.id as string
      } catch { /* ignore */ }

      return NextResponse.json({
        analysisId,
        scores: fullScores,
        tier: previewTier,
        percentile: previewPercentile,
        freeAnalysis: true,
        observations: previewObservations,
        routine: null,
        routinePreview: null,
      })
    }

    // ── 3. GPT-4o Vision analysis (subscribers) ───────────────────────────────

    if (!imageBuffer && trimmedUrl) {
      try {
        const res = await fetch(trimmedUrl)
        if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`)
        imageBuffer = Buffer.from(await res.arrayBuffer())
      } catch (err) {
        console.error('[analyze] Image download error:', err)
      }
    }

    console.log('[analyze] Objective scores (MediaPipe):', objectiveScores)

    // GPT-4o Vision
    console.log('[analyze] Calling GPT-4o Vision…')
    const result = await analyzeImage(trimmedUrl, objectiveScores, imageBuffer)

    try {
      const { createClient } = await import('@/lib/supabase-server')
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('analyses')
        .insert({
          user_id:           userId,
          photo_url:         trimmedUrl,
          score_global:      result.scores.global,
          score_symetrie:    result.scores.symetrie,
          score_proportions: result.scores.proportions,
          score_structure:   result.scores.structure,
          score_peau:        result.scores.peau,
          score_grooming:    result.scores.grooming,
          score_aura:        result.scores.aura,
          tier:              result.tier,
          percentile:        result.percentile,
          observations:      result.observations,
          routine:           result.routine,
        })
        .select('id')
        .single()

      if (!error && data) analysisId = data.id as string
    } catch { /* DB not configured */ }

    return NextResponse.json({
      analysisId,
      scores:       result.scores,
      tier:         result.tier,
      percentile:   result.percentile,
      observations: result.observations,
      routine:      result.routine,
      freeAnalysis: false,
      routinePreview: {
        skincare: result.routine.skincare.slice(0, 2),
        grooming: result.routine.grooming.slice(0, 2),
      },
    })
  } catch (error) {
    console.error('[analyze] Unhandled error:', error)
    return NextResponse.json(
      { error: 'Analysis failed', analysisId: `demo-${Date.now()}` },
      { status: 500 }
    )
  }
}
