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
