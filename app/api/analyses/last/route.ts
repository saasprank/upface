import { type NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(_request: NextRequest) {
  try {
    const { createClient } = await import('@/lib/supabase-server')
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ id: null }, { status: 200 })
    }

    const { data } = await supabase
      .from('analyses')
      .select('id, focus_dimensions, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json(data ?? { id: null })
  } catch {
    return NextResponse.json({ id: null })
  }
}
