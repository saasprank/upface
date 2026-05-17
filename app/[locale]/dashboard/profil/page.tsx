'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface SupabaseUser {
  id: string
  email?: string
  created_at?: string
}

interface Subscription {
  plan: string
  status: string
  price_id?: string
  current_period_end?: string
}

const WEEKLY_PRICE_ID = 'price_1TY1A8GblSMSnPvvdPTKjhWv'
const MONTHLY_PRICE_ID = 'price_1TY1AWGblSMSnPvvpi6xztHb'

function getPlanLabel(priceId: string | undefined): string {
  if (priceId === WEEKLY_PRICE_ID) return 'Pro Hebdomadaire — 4,99€/sem'
  if (priceId === MONTHLY_PRICE_ID) return 'Pro Mensuel — 14,99€/mois'
  return 'Pro'
}

export default function ProfilPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) ?? 'fr'

  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [sub, setSub] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data: { user: u } } = await supabase.auth.getUser()
        setUser(u as SupabaseUser | null)
        if (u) {
          const { data } = await supabase
            .from('subscriptions')
            .select('plan, status, price_id, current_period_end')
            .eq('user_id', u.id)
            .eq('status', 'active')
            .single()
          if (data) setSub(data as Subscription)
        }
      } catch { /* ignore */ }
      setLoading(false)
    }
    void load()
  }, [])

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      await supabase.auth.signOut()
      localStorage.clear()
    } catch { /* ignore */ }
    router.push(`/${locale}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#080C14' }}>
        <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-4 min-h-screen" style={{ background: '#080C14' }}>

      {/* Header */}
      <p className="text-xs font-medium mb-1" style={{ color: '#8B9DC3' }}>MON COMPTE</p>
      <h1 className="text-xl font-bold text-white mb-6">Profil</h1>

      {/* Avatar + email */}
      <div
        className="rounded-2xl p-4 mb-4 flex items-center gap-4"
        style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}
        >
          {user?.email?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <p className="text-white font-semibold">{user?.email ?? 'Utilisateur'}</p>
          <p className="text-xs mt-0.5" style={{ color: '#3D4F6E' }}>
            Membre depuis{' '}
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
              : '—'}
          </p>
        </div>
      </div>

      {/* Abonnement */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
      >
        <p className="text-xs font-medium mb-3" style={{ color: '#8B9DC3' }}>ABONNEMENT</p>
        {sub ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-semibold text-sm">{getPlanLabel(sub.price_id)}</p>
                <p className="text-xs mt-0.5" style={{ color: '#10B981' }}>✓ Actif</p>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
              >
                PRO
              </span>
            </div>
            {sub.current_period_end && (
              <p className="text-xs" style={{ color: '#3D4F6E' }}>
                Prochain renouvellement :{' '}
                {new Date(sub.current_period_end).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">Plan Free</p>
              <p className="text-xs mt-0.5" style={{ color: '#8B9DC3' }}>Accès limité</p>
            </div>
            <button
              onClick={() => router.push(`/${locale}/onboarding/routine-preview`)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(90deg, #3B82F6, #06B6D4)' }}
            >
              Passer Pro
            </button>
          </div>
        )}
      </div>

      {/* Déconnexion */}
      <button
        onClick={() => void handleLogout()}
        className="w-full py-4 rounded-2xl font-semibold text-sm transition-all active:scale-95"
        style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        Se déconnecter
      </button>

      {/* Version */}
      <p className="text-center text-xs mt-4" style={{ color: '#3D4F6E' }}>
        Upface v1.0 · Fait avec soin
      </p>
    </div>
  )
}
