/**
 * Masque login/signup et les gates « compte obligatoire » pendant le développement.
 *
 * Logique :
 * - `NEXT_PUBLIC_HIDE_AUTH_UI=false`  → auth activée (mode production avec comptes)
 * - Tout le reste (variable absente, `true`, ou autre valeur) → auth masquée
 *
 * Pour activer l'auth en production Vercel :
 *   Ajouter NEXT_PUBLIC_HIDE_AUTH_UI=false dans les variables d'environnement Vercel + redéployer.
 */
export function isAuthUiHidden(): boolean {
  return process.env.NEXT_PUBLIC_HIDE_AUTH_UI !== 'false'
}

/** Compte requis pour lancer le scan (prod Supabase + auth visible). */
export function requiresAccountForAnalyze(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  if (!url || !key || url.includes('placeholder.supabase.co') || key === 'placeholder-key') {
    return false
  }
  return !isAuthUiHidden()
}

export function analyzeReturnPath(prefix: string, autoStart = true): string {
  return autoStart ? `${prefix}/analyze?start=1` : `${prefix}/analyze`
}
