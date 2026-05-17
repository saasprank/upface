/**

 * Supabase valide strictement `redirectTo` / `emailRedirectTo` :

 * une URL avec ?next=... échoue souvent ("string did not match expected pattern")

 * si cette URL exacte n’est pas dans Redirect URLs.

 *

 * On utilise donc `/api/auth/callback` sans query et on passe la destination via cookie court.

 *

 * Si l’utilisateur arrive sur une URL de preview (`*-xxx.vercel.app`) alors que Supabase

 * n’autorise que l’alias (`upface-saas.vercel.app`), définir NEXT_PUBLIC_SITE_URL sur Vercel.

 */



export const AUTH_NEXT_COOKIE = 'upface_auth_next'



/**

 * Origine publique du site (sans slash final), utilisée pour les redirections auth.

 * Priorité : NEXT_PUBLIC_SITE_URL → window.location.origin

 */

export function getSiteOriginForAuth(): string {

  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  if (env && /^https?:\/\//i.test(env)) {

    return env.replace(/\/$/, '')

  }

  if (typeof window !== 'undefined') {

    return window.location.origin.replace(/\/$/, '')

  }

  return ''

}



/** Chemin interne uniquement (pas de schéma, pas //). */

export function sanitizeInternalNext(raw: string | null | undefined, fallback: string): string {

  if (!raw || typeof raw !== 'string') return fallback

  try {

    const path = decodeURIComponent(raw.trim())

    if (!path.startsWith('/') || path.startsWith('//')) return fallback

    return path

  } catch {

    return fallback

  }

}



export function setAuthNextCookieClient(nextPath: string): void {

  if (typeof document === 'undefined') return

  const safe = sanitizeInternalNext(nextPath, '')

  if (!safe) return

  const encoded = encodeURIComponent(safe)

  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:'

  document.cookie = `${AUTH_NEXT_COOKIE}=${encoded}; Path=/; Max-Age=600; SameSite=Lax${secure ? '; Secure' : ''}`

}



/**

 * URL absolue du callback — à ajouter telle quelle dans Supabase Redirect URLs.

 * Utilise NEXT_PUBLIC_SITE_URL si défini (recommandé sur Vercel).

 */

export function authCallbackUrl(overrideOrigin?: string): string {

  const base = (overrideOrigin ?? getSiteOriginForAuth()).replace(/\/$/, '')

  return `${base}/api/auth/callback`

}


