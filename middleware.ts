import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './lib/i18n'
import { isAuthUiHidden } from './lib/auth-ui'

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Dev / flag : pas d’écrans login & signup — renvoyer vers l’analyse
  if (isAuthUiHidden()) {
    if (pathname === '/login' || pathname === '/signup') {
      const url = request.nextUrl.clone()
      url.pathname = '/analyze'
      return NextResponse.redirect(url)
    }
    if (pathname === '/en/login' || pathname === '/en/signup') {
      const url = request.nextUrl.clone()
      url.pathname = '/en/analyze'
      return NextResponse.redirect(url)
    }
  }

  // Run next-intl middleware
  const response = intlMiddleware(request)

  // Only refresh Supabase session if credentials are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (supabaseUrl && supabaseKey) {
    try {
      const { createServerClient } = await import('@supabase/ssr')

      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setAll(cookiesToSet: any[]) {
            cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: unknown }) => {
              request.cookies.set(name, value)
              if (response) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                response.cookies.set(name, value, options as any)
              }
            })
          },
        },
      })

      await supabase.auth.getSession()
    } catch {
      // Supabase not configured — skip session refresh
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
