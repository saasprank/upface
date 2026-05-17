import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { AUTH_NEXT_COOKIE, sanitizeInternalNext } from '@/lib/auth-redirect'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  const fromCookie = request.cookies.get(AUTH_NEXT_COOKIE)?.value
  const nextRaw = searchParams.get('next') ?? fromCookie ?? '/dashboard'
  const next = sanitizeInternalNext(nextRaw, '/dashboard')

  if (error) {
    const res = NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`)
    res.cookies.set(AUTH_NEXT_COOKIE, '', { path: '/', maxAge: 0 })
    return res
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      let res: NextResponse
      if (isLocalEnv) {
        res = NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        res = NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        res = NextResponse.redirect(`${origin}${next}`)
      }
      res.cookies.set(AUTH_NEXT_COOKIE, '', { path: '/', maxAge: 0 })
      return res
    }
  }

  const fail = NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
  fail.cookies.set(AUTH_NEXT_COOKIE, '', { path: '/', maxAge: 0 })
  return fail
}
