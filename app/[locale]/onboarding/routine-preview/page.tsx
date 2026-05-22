'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import UpfaceLogo from '@/components/ui/UpfaceLogo'

// ─── Types ───────────────────────────────────────────────
interface OnboardingData {
  improve: string[]
  dream: string
  time: string
  analysisId?: string
}

interface RoutineCategory {
  id: string
  category: string
  icon: string
  color: string
  day: string
  title: string
  tasks: string[]
  unlocked: boolean
}

interface GeneratedRoutine {
  headline: string
  categories: RoutineCategory[]
}

// ─── Fallback statique ───────────────────────────────────
const ROUTINE_FALLBACK: RoutineCategory[] = [
  {
    id: 'skincare', day: 'Jour 1–7', category: 'Skincare', icon: '✦', color: '#3B82F6',
    title: 'Nettoyage & Hydratation de base',
    tasks: [
      'Nettoyant doux matin et soir (CeraVe ou La Roche-Posay)',
      'Hydratant SPF 30+ le matin',
      'Eau micellaire si port de produits coiffants',
    ],
    unlocked: true,
  },
  {
    id: 'grooming', day: 'Jour 1–7', category: 'Grooming', icon: '✂', color: '#06B6D4',
    title: 'Définition & Entretien',
    tasks: [
      'Taille des sourcils : enlever les poils entre les deux',
      'Rasage ou entretien barbe selon ton style',
      'Hydratation lèvres quotidienne',
    ],
    unlocked: true,
  },
  {
    id: 'fitness', day: 'Jour 8–14', category: 'Fitness', icon: '◈', color: '#10B981',
    title: 'Jawline & Posture',
    tasks: [
      'Exercices mâchoire : 3×20 reps matin',
      'Correction posture : menton rentré, épaules ouvertes',
      'Cardio 20 min × 3/semaine (vasc. cutanée)',
    ],
    unlocked: true,
  },
  {
    id: 'style', day: 'Jour 8–21', category: 'Style', icon: '◇', color: '#8B5CF6',
    title: 'Silhouette & Présence',
    tasks: [
      'Audit garde-robe : coupes ajustées uniquement',
      'Couleurs neutres comme base (navy, blanc, gris)',
      'Une montre ou accessoire signature',
    ],
    unlocked: false,
  },
  {
    id: 'aura', day: 'Jour 14–30', category: 'Aura', icon: '⬡', color: '#F59E0B',
    title: 'Présence & Magnétisme',
    tasks: [
      'Contact visuel : exercice miroir 5 min/jour',
      'Routine sommeil 7–8h (récupération cutanée)',
      'Méditation 10 min pour réduire le cortisol',
    ],
    unlocked: false,
  },
]

const FEATURES = [
  { icon: '📋', title: 'Routine complète 30/60/90 jours', sub: 'Plan jour par jour adapté à ton score' },
  { icon: '🔬', title: '47 critères analysés en détail', sub: 'Chaque point de ton visage décrypté' },
  { icon: '🤖', title: 'Coach IA personnalisé', sub: 'Conseils adaptés chaque semaine' },
  { icon: '📈', title: 'Suivi de progression', sub: 'Vois ton score évoluer semaine après semaine' },
  { icon: '✨', title: 'Skincare & Grooming avancés', sub: 'Produits recommandés pour ton type de peau' },
  { icon: '🔗', title: 'Carte de score partageable', sub: 'Partage tes résultats sur TikTok & Instagram' },
]

// ─── Composant carte routine ──────────────────────────────
function RoutineCard({ item }: { item: RoutineCategory }) {
  const isLocked = !item.unlocked
  return (
    <div
      className="relative rounded-2xl p-4 mb-3 overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: `1px solid ${isLocked ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.18)'}`,
      }}
    >
      {isLocked && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl"
          style={{ backdropFilter: 'blur(6px)', background: 'rgba(248,250,255,0.55)' }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}
          >
            <svg className="w-5 h-5" style={{ color: '#3B82F6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-sm font-medium" style={{ color: '#64748B' }}>Débloque avec Premium</span>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
          style={{ background: `${item.color}18`, color: item.color }}
        >
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium" style={{ color: item.color }}>{item.category}</span>
            <span className="text-xs" style={{ color: '#94A3B8' }}>{item.day}</span>
          </div>
          <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
          <ul className="space-y-1">
            {item.tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.color }} />
                <span className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────
export default function RoutinePreviewPage() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'fr'

  const [routine, setRoutine] = useState<GeneratedRoutine | null>(null)
  const [, setOnboarding] = useState<OnboardingData | null>(null)
  const [loadingPlan, setLoadingPlan] = useState<'monthly' | 'yearly' | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly')
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => {
    try {
      localStorage.removeItem('upface_routine')
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('upface_onboarding')
      if (raw) setOnboarding(JSON.parse(raw) as OnboardingData)
      const routineRaw = localStorage.getItem('upface_routine')
      if (routineRaw) setRoutine(JSON.parse(routineRaw) as GeneratedRoutine)
    } catch { /* ignore */ }
  }, [])

  const categories = routine?.categories ?? ROUTINE_FALLBACK
  const headline = routine?.headline ?? 'Ton plan personnalisé sur 30 jours'

  const handleSelectPlan = async (plan: 'monthly' | 'yearly') => {
    setLoadingPlan(plan)
    try {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const priceId = plan === 'monthly'
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY!

      if (!priceId) {
        console.error('Missing Stripe price ID for plan:', plan)
        return
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user?.id ?? '',
          email: user?.email ?? '',
          locale,
        }),
      })

      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Checkout error:', data.error)
      }
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setLoadingPlan(null)
    }
  }

  // ── État 2 : Paywall pleine page ──────────────────────
  if (showPaywall) {
    return (
      <div
        className="min-h-screen flex flex-col justify-between overflow-hidden"
        style={{ background: '#F8FAFF' }}
      >
        {/* Flèche retour */}
        <button
          onClick={() => setShowPaywall(false)}
          className="absolute top-4 left-4 z-10 w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <svg className="w-5 h-5" style={{ color: '#64748B' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* SECTION HAUT — Hero */}
        <div className="pt-8 px-6 text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}
          >
            <span className="text-2xl">✦</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Débloque ton potentiel</h1>
          <p className="text-sm" style={{ color: '#64748B' }}>
            Ta routine personnalisée est prête.<br />Passe à Pro pour y accéder.
          </p>
        </div>

        {/* SECTION MILIEU — Features */}
        <div className="px-6 py-4 flex-1 flex flex-col justify-center gap-0">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2.5"
              style={{ borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(59,130,246,0.08)' : 'none' }}
            >
              <span className="text-lg w-7 text-center flex-shrink-0">{f.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">{f.title}</p>
                <p className="text-xs" style={{ color: '#64748B' }}>{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION BAS — Plans + CTA */}
        <div className="px-4 pb-8">
          {/* Badge */}
          <div className="flex justify-center mb-3">
            <div
              className="px-4 py-1 rounded-full text-xs font-bold"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#06B6D4', border: '1px solid rgba(6,182,212,0.3)' }}
            >
              PLUS POPULAIRE · ÉCONOMISE 50%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <button
              type="button"
              onClick={() => setSelectedPlan('monthly')}
              className="rounded-2xl px-3 py-3 text-left transition-all active:scale-[0.98]"
              style={{
                background: '#FFFFFF',
                border: selectedPlan === 'monthly' ? '2px solid #3B82F6' : '1px solid rgba(59,130,246,0.15)',
              }}
            >
              <p className="text-[11px] font-medium mb-1" style={{ color: '#64748B' }}>Mensuel</p>
              <p className="text-xl font-bold text-white leading-none">6,99€</p>
              <p className="text-[10px] mt-1" style={{ color: '#94A3B8' }}>/ mois</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan('yearly')}
              className="relative rounded-2xl px-3 py-3 text-left transition-all active:scale-[0.98]"
              style={{
                background: '#FFFFFF',
                border: selectedPlan === 'yearly' ? '2px solid #06B6D4' : '1px solid rgba(6,182,212,0.35)',
                boxShadow: selectedPlan === 'yearly' ? '0 0 20px rgba(6,182,212,0.12)' : 'none',
              }}
            >
              <span
                className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: 'rgba(6,182,212,0.18)', color: '#06B6D4' }}
              >
                -50%
              </span>
              <p className="text-[11px] font-medium mb-1" style={{ color: '#06B6D4' }}>Annuel</p>
              <p className="text-xl font-bold text-white leading-none">42€</p>
              <p className="text-[10px] mt-1 leading-snug" style={{ color: '#94A3B8' }}>/ an · soit 3,50€/mois</p>
            </button>
          </div>

          {/* CTA gradient */}
          <button
            onClick={() => void handleSelectPlan(selectedPlan)}
            disabled={loadingPlan !== null}
            className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg, #3B82F6, #06B6D4)', boxShadow: '0 0 24px rgba(59,130,246,0.4)' }}
          >
            {loadingPlan !== null ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : 'Commencer maintenant ▷'}
          </button>

          {/* Légal */}
          <div className="flex justify-center gap-6 mt-3">
            {['CGU', 'Confidentialité', 'Restaurer'].map(l => (
              <span key={l} className="text-xs" style={{ color: '#94A3B8' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── État 1 : Routine preview ──────────────────────────
  return (
    <div className="min-h-screen pb-[280px]" style={{ background: '#F8FAFF' }}>

      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between"
        style={{ background: '#F8FAFF', borderBottom: '1px solid rgba(59,130,246,0.08)' }}
      >
        <UpfaceLogo size="sm" />
        <div
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}
        >
          Ta routine 30j
        </div>
      </div>

      <div className="px-4 pt-6">

        {/* Titre */}
        <div className="mb-2">
          <p className="text-xs font-medium mb-1" style={{ color: '#06B6D4' }}>ROUTINE PERSONNALISÉE</p>
          <h1 className="text-2xl font-bold text-white leading-tight">{headline}</h1>
        </div>

        {/* Stats row */}
        <div className="flex gap-2 mt-4 mb-6">
          {[
            { label: 'Actions', value: String(categories.reduce((acc, c) => acc + c.tasks.length, 0)) },
            { label: 'Catégories', value: String(categories.length) },
            { label: 'Durée', value: '30j' },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-xl py-2 px-3 text-center"
              style={{ background: '#FFFFFF', border: '1px solid rgba(59,130,246,0.12)' }}
            >
              <div className="text-lg font-bold text-white">{s.value}</div>
              <div className="text-xs" style={{ color: '#94A3B8' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Cartes routine */}
        <div className="mb-4">
          {categories.map((item, i) => (
            <RoutineCard key={item.id ?? i} item={item} />
          ))}
        </div>

        {/* Gradient fade */}
        <div
          className="relative -mt-20 pt-20 pb-4 text-center"
          style={{ background: 'linear-gradient(to bottom, transparent, #F8FAFF 60%)' }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>
            +32 actions supplémentaires dans ta routine complète
          </p>
          <p className="text-xs" style={{ color: '#94A3B8' }}>
            Skincare avancé · Fitness · Style · Aura · Suivi 30/60/90j
          </p>
        </div>
      </div>

      {/* Pricing + CTA fixe bas */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 pb-8 pt-4"
        style={{ background: 'linear-gradient(to top, #F8FAFF 88%, transparent)' }}
      >
        <div className="flex justify-center mb-3">
          <div
            className="px-3 py-1 rounded-full text-[11px] font-medium"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' }}
          >
            • 127 utilisateurs ont débloqué leur routine aujourd&apos;hui
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <button
            type="button"
            onClick={() => setSelectedPlan('monthly')}
            className="rounded-2xl px-3 py-3 text-left transition-all active:scale-[0.98]"
            style={{
              background: '#FFFFFF',
              border: selectedPlan === 'monthly' ? '2px solid #3B82F6' : '1px solid rgba(59,130,246,0.15)',
            }}
          >
            <p className="text-[11px] font-medium mb-1" style={{ color: '#64748B' }}>Mensuel</p>
            <p className="text-xl font-bold text-white leading-none">6,99€</p>
            <p className="text-[10px] mt-1" style={{ color: '#94A3B8' }}>/ mois</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPlan('yearly')}
            className="relative rounded-2xl px-3 py-3 text-left transition-all active:scale-[0.98]"
            style={{
              background: '#FFFFFF',
              border: selectedPlan === 'yearly' ? '2px solid #06B6D4' : '1px solid rgba(6,182,212,0.35)',
              boxShadow: selectedPlan === 'yearly' ? '0 0 20px rgba(6,182,212,0.12)' : 'none',
            }}
          >
            <span
              className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: 'rgba(6,182,212,0.18)', color: '#06B6D4' }}
            >
              -50%
            </span>
            <p className="text-[11px] font-medium mb-1" style={{ color: '#06B6D4' }}>Annuel</p>
            <p className="text-xl font-bold text-white leading-none">42€</p>
            <p className="text-[10px] mt-1 leading-snug" style={{ color: '#94A3B8' }}>/ an · soit 3,50€/mois</p>
          </button>
        </div>

        <button
          type="button"
          onClick={() => void handleSelectPlan(selectedPlan)}
          disabled={loadingPlan !== null}
          className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-60"
          style={{
            background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
            boxShadow: '0 0 24px rgba(59,130,246,0.35)',
          }}
        >
          {loadingPlan !== null ? (
            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Commencer ma routine complète
            </>
          )}
        </button>

        <p className="text-center text-[10px] mt-2.5" style={{ color: '#94A3B8' }}>
          Annulable à tout moment · Paiement sécurisé Stripe
        </p>
      </div>
    </div>
  )
}
