import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co').trim()
const SUPABASE_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key').trim()

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server component — cookies can only be set in Server Actions
        }
      },
    },
  })
}
