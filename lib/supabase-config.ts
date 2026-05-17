/** True when real Supabase env is set (not build-time placeholders). */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  if (!url || !key) return false
  if (url.includes('placeholder.supabase.co')) return false
  if (key === 'placeholder-key') return false
  return true
}
