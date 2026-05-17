import { type NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const VALID_DIMENSIONS = ['skincare', 'grooming', 'fitness', 'style', 'aura'] as const
type Dimension = typeof VALID_DIMENSIONS[number]

interface FocusBody {
  focusDimensions: Dimension[]
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = (await request.json()) as FocusBody
    const { focusDimensions } = body

    // Validate
    if (!Array.isArray(focusDimensions) || focusDimensions.length === 0 || focusDimensions.length > 2) {
      return NextResponse.json(
        { error: 'focusDimensions must be an array of 1 to 2 items' },
        { status: 400 }
      )
    }

    for (const d of focusDimensions) {
      if (!VALID_DIMENSIONS.includes(d)) {
        return NextResponse.json(
          { error: `Invalid dimension: ${d}. Must be one of: ${VALID_DIMENSIONS.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Auth check + DB update
    try {
      const { createClient } = await import('@/lib/supabase-server')
      const supabase = await createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { data, error } = await supabase
        .from('analyses')
        .update({ focus_dimensions: focusDimensions })
        .eq('id', id)
        .eq('user_id', session.user.id)
        .select('id, focus_dimensions')
        .single()

      if (error) {
        console.error('[focus PATCH] Supabase error:', error)
        return NextResponse.json({ error: 'Update failed' }, { status: 500 })
      }

      return NextResponse.json({ success: true, focusDimensions: data?.focus_dimensions ?? focusDimensions })
    } catch {
      // Demo mode: return success without DB
      return NextResponse.json({ success: true, focusDimensions })
    }
  } catch (error) {
    console.error('[focus PATCH] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
