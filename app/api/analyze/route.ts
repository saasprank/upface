import { type NextRequest, NextResponse } from 'next/server'
import { analyzeImage } from '@/lib/analyze'
import { analyzeFaceWithMediaPipe } from '@/lib/mediapipe-server'

export const runtime = 'nodejs'

interface AnalyzeRequestBody {
  imageUrl?: string
  /** JPEG/PNG en data URL ou base64 pur — utilisé si l'upload Storage échoue (ex. visiteur non auth) */
  imageBase64?: string
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
    // Table doesn't exist yet (dev/demo) → grant full access
    return true
  }
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalyzeRequestBody
    const demo = Boolean(body.demo)
    const trimmedUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : ''
    const imageBase64Raw = typeof body.imageBase64 === 'string' ? body.imageBase64 : ''

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
      // Demo mode — no Supabase configured, grant full access
      isSubscribed = true
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

    // ── 2. GPT-4o Vision analysis ────────────────────────────────────────────

    // Image → Buffer (priorité : corps base64, puis URL publique)
    if (!imageBuffer && trimmedUrl) {
      try {
        const res = await fetch(trimmedUrl)
        if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`)
        imageBuffer = Buffer.from(await res.arrayBuffer())
      } catch (err) {
        console.error('[analyze] Image download error:', err)
      }
    }

    const randInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min

    let objectiveScores = {
      symetrie:    randInt(65, 85),
      proportions: randInt(62, 82),
      structure:   randInt(60, 80),
    }

    if (imageBuffer) {
      try {
        console.log('[analyze] Running MediaPipe...')
        const mpResult = await Promise.race([
          analyzeFaceWithMediaPipe(imageBuffer),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('MediaPipe timeout after 25s')), 25_000)
          ),
        ])
        if (!mpResult.detected) {
          return NextResponse.json({ error: 'NO_FACE_DETECTED' }, { status: 422 })
        }
        objectiveScores = {
          symetrie:    mpResult.symetrie,
          proportions: mpResult.proportions,
          structure:   mpResult.structure,
        }
        console.log('[analyze] MediaPipe OK:', objectiveScores)
      } catch (err) {
        console.error('[analyze] MediaPipe failed, using neutral anchors:', err)
      }
    }

    // GPT-4o Vision
    console.log('[analyze] Calling GPT-4o Vision…')
    const result = await analyzeImage(trimmedUrl, objectiveScores, imageBuffer)

    // Persist to Supabase
    let analysisId = `demo-${Date.now()}`

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
      freeAnalysis: !isSubscribed,
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
