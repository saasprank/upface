'use client'

import { useState, useEffect, Suspense } from 'react'
import { useLocale } from 'next-intl'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { FocusDimension } from '@/components/ui/FocusCard'

const ICON_SKINCARE = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1M21 12h1M4.22 19.778l.707-.707M18.364 5.636l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" /></svg>
const ICON_GROOMING = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
const ICON_FITNESS = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
const ICON_STYLE = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>
const ICON_AURA = <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>

const CATEGORIES = [
  {
    key: 'skincare' as FocusDimension,
    icon: ICON_SKINCARE,
    label: 'Skincare',
    color: '#3B82F6',
    actions: {
      week1: [
        { title: 'Nettoyage enzymatique', desc: 'Matin et soir, gel sans sulfates', duration: '3 min', level: 'Easy' },
        { title: 'Sérum vitamine C', desc: '2-3 gouttes sur peau sèche', duration: '1 min', level: 'Easy' },
        { title: 'SPF 50 quotidien', desc: 'Indispensable, même en intérieur', duration: '1 min', level: 'Easy' },
      ],
      week2: [
        { title: 'Exfoliation douce', desc: 'AHA 10% 2x/semaine le soir', duration: '5 min', level: 'Medium' },
        { title: 'Masque hydratant', desc: 'Acide hyaluronique 1x/semaine', duration: '20 min', level: 'Easy' },
        { title: 'Rétinol 0.025%', desc: 'Introduction progressive', duration: '2 min', level: 'Medium' },
      ],
      month2: [
        { title: 'Rétinol 0.05%', desc: 'Augmentation progressive de la concentration', duration: '2 min', level: 'Medium' },
        { title: 'Sérum niacinamide', desc: '10% pour réduire les pores', duration: '2 min', level: 'Easy' },
      ],
      month3: [
        { title: 'Protocole complet', desc: 'C + rétinol alternés, SPF systématique', duration: '10 min', level: 'Medium' },
        { title: 'Bilan cutané', desc: "Évaluer l'évolution et ajuster", duration: '30 min', level: 'Hard' },
      ],
    },
  },
  {
    key: 'grooming' as FocusDimension,
    icon: ICON_GROOMING,
    label: 'Grooming',
    color: '#06B6D4',
    actions: {
      week1: [
        { title: 'Contour de barbe précis', desc: 'Ligne nette sous le menton, joues nettes', duration: '10 min', level: 'Medium' },
        { title: 'Soin des sourcils', desc: 'Pince, gel fixant naturel', duration: '5 min', level: 'Easy' },
        { title: 'Gua sha facial', desc: 'Drainage lymphatique 10 min chaque soir', duration: '10 min', level: 'Easy' },
      ],
      week2: [
        { title: 'Exfoliation lèvres', desc: 'Sucre + huile 2x/semaine', duration: '3 min', level: 'Easy' },
        { title: 'Baume barbe', desc: 'Argan oil pour adoucir', duration: '2 min', level: 'Easy' },
      ],
      month2: [
        { title: 'Coupe chez le barbier', desc: 'Adapter à la morphologie du visage', duration: '45 min', level: 'Medium' },
        { title: 'Routine lèvres complète', desc: 'Exfoliation + baume + hydratation', duration: '5 min', level: 'Easy' },
      ],
      month3: [
        { title: 'Maîtrise totale du style', desc: 'Cohérence barbe / coupe / sourcils', duration: '15 min', level: 'Hard' },
      ],
    },
  },
  {
    key: 'fitness' as FocusDimension,
    icon: ICON_FITNESS,
    label: 'Fitness / Jawline',
    color: '#10B981',
    actions: {
      week1: [
        { title: 'Mewing continu', desc: 'Langue sur le palais, lèvres fermées, dents en contact léger', duration: 'Continu', level: 'Medium' },
        { title: 'Chewing-gum dure', desc: 'Mastic gum 20 min/jour pour la mâchoire', duration: '20 min', level: 'Easy' },
        { title: 'Gainage planche', desc: '3 séries × 45 secondes', duration: '10 min', level: 'Medium' },
      ],
      week2: [
        { title: 'Cardio HIIT', desc: '20 min 3x/semaine, brûle la graisse faciale', duration: '20 min', level: 'Hard' },
        { title: 'Exercices mâchoire', desc: 'Jaw clenching, chin tucks', duration: '10 min', level: 'Medium' },
      ],
      month2: [
        { title: 'Musculation nuque/trapèzes', desc: 'Améliore la posture, réduit le double menton', duration: '30 min', level: 'Hard' },
      ],
      month3: [
        { title: 'Programme complet jawline', desc: 'Mewing + mastic + cardio + renforcement nuque', duration: '40 min', level: 'Hard' },
      ],
    },
  },
  {
    key: 'style' as FocusDimension,
    icon: ICON_STYLE,
    label: 'Style',
    color: '#8B5CF6',
    actions: {
      week1: [
        { title: 'Audit vestimentaire', desc: 'Trier : garder / donner / améliorer', duration: '30 min', level: 'Easy' },
        { title: 'Palette de couleurs', desc: 'Identifier 3-4 couleurs neutres qui te correspondent', duration: '20 min', level: 'Easy' },
        { title: 'Posture consciente', desc: 'Épaules en arrière, menton légèrement relevé', duration: 'Continu', level: 'Medium' },
      ],
      week2: [
        { title: 'Coupe de cheveux adaptée', desc: 'Identifier la coupe selon morphologie visage', duration: '60 min', level: 'Easy' },
        { title: 'Vêtements bien ajustés', desc: 'Fit > marque, bannir le oversized par défaut', duration: '30 min', level: 'Medium' },
      ],
      month2: [
        { title: 'Accessoires minimalistes', desc: 'Montre, bracelet, une pièce signature', duration: '20 min', level: 'Easy' },
      ],
      month3: [
        { title: 'Style signature', desc: 'Identité visuelle cohérente et reconnaissable', duration: '60 min', level: 'Hard' },
      ],
    },
  },
  {
    key: 'aura' as FocusDimension,
    icon: ICON_AURA,
    label: 'Aura',
    color: '#F59E0B',
    actions: {
      week1: [
        { title: 'Méditation regard', desc: '10 min/jour, focus sur la stabilité du regard', duration: '10 min', level: 'Easy' },
        { title: 'Contact visuel direct', desc: 'Maintenir le regard 3-4 secondes dans les conversations', duration: 'Continu', level: 'Medium' },
        { title: 'Voix posée', desc: 'Parler lentement, articuler, pauses intentionnelles', duration: 'Continu', level: 'Medium' },
      ],
      week2: [
        { title: 'Journal de gratitude', desc: '3 points positifs chaque soir', duration: '5 min', level: 'Easy' },
        { title: 'Sourire contrôlé', desc: 'Sourire doux, pas forcé — pratiquer devant le miroir', duration: '5 min', level: 'Easy' },
      ],
      month2: [
        { title: 'Exposition sociale', desc: 'Une sortie sociale intentionnelle/semaine', duration: '2h', level: 'Hard' },
      ],
      month3: [
        { title: 'Présence magnétique', desc: 'Regard, voix, posture, sourire — synchronisés', duration: 'Continu', level: 'Hard' },
      ],
    },
  },
]

type TabKey = 'week1' | 'week2' | 'month2' | 'month3'

const ALL_TABS: { key: TabKey; label: string }[] = [
  { key: 'week1', label: 'Semaine 1' },
  { key: 'week2', label: 'Semaine 2' },
  { key: 'month2', label: 'Mois 2' },
  { key: 'month3', label: 'Mois 3' },
]

const WEEKLY_TABS: { key: TabKey; label: string }[] = [
  { key: 'week1', label: 'Sem 1' },
  { key: 'week2', label: 'Sem 2' },
  { key: 'month2', label: 'Sem 3' },
  { key: 'month3', label: 'Sem 4' },
]

const FREE_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_WEEKLY

const LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
  Easy: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  Medium: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  Hard: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
}

function RoutineContent() {
  const locale = useLocale()
  const prefix = locale === 'fr' ? '' : `/${locale}`
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>('week1')
  const [lastAnalysisId, setLastAnalysisId] = useState<string | null>(null)
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [isWeekly, setIsWeekly] = useState(false)
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const focusParam = searchParams.get('focus') ?? ''
  const focusDimensions: FocusDimension[] = focusParam
    ? (focusParam.split(',').filter(Boolean) as FocusDimension[])
    : []

  useEffect(() => {
    try {
      const raw = localStorage.getItem('upface_completed_tasks')
      if (raw) setCompleted(new Set(JSON.parse(raw) as string[]))
    } catch { /* ignore */ }
  }, [])

  const toggleTask = (taskId: string) => {
    setCompleted(prev => {
      const next = new Set(prev)
      next.has(taskId) ? next.delete(taskId) : next.add(taskId)
      try { localStorage.setItem('upface_completed_tasks', JSON.stringify([...next])) } catch { /* ignore */ }
      return next
    })
  }

  useEffect(() => {
    // Fetch last analysis id for "Changer de focus" link
    fetch('/api/analyses/last')
      .then(r => r.json())
      .then(d => { if (d?.id) setLastAnalysisId(d.id) })
      .catch(() => {})

    // Récupère le plan Supabase
    const loadPlan = async () => {
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('plan, status, price_id')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single()
          if (sub?.plan === 'pro') {
            setPlan('pro')
            setIsWeekly(sub.price_id === FREE_PRICE_ID)
          }
        }
      } catch { /* ignore */ }
    }
    void loadPlan()
  }, [])

  // Onglets selon le plan
  const TABS = plan === 'free'
    ? [{ key: 'week1' as TabKey, label: 'Semaine 1' }]
    : isWeekly
    ? WEEKLY_TABS
    : ALL_TABS

  const hasFilter = focusDimensions.length > 0
  const filteredCats = hasFilter
    ? CATEGORIES.filter(c => focusDimensions.includes(c.key))
    : CATEGORIES

  const allCats = CATEGORIES

  // Progress calculation for current tab
  const currentCats = hasFilter ? filteredCats : allCats
  const totalTasks = currentCats.reduce((acc, cat) => acc + (cat.actions[activeTab]?.length ?? 0), 0)
  const relevantIds = currentCats.flatMap(cat =>
    (cat.actions[activeTab] ?? []).map((_, i) => `${cat.key}-${activeTab}-${i}`)
  )
  const completedCount = relevantIds.filter(id => completed.has(id)).length
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-2xl font-black text-[#EEF2FF] mb-2"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            {hasFilter ? 'Ta routine · Focus' : 'Ma Routine 30/90 jours'}
          </h1>
          {hasFilter && (
            <div className="flex flex-wrap gap-2 mt-1">
              {focusDimensions.map(dim => {
                const cat = CATEGORIES.find(c => c.key === dim)
                if (!cat) return null
                return (
                  <span
                    key={dim}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}35`, color: cat.color }}
                  >
                    {cat.icon} {cat.label}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Changer de focus */}
        <Link
          href={lastAnalysisId ? `${prefix}/results/${lastAnalysisId}/focus` : `${prefix}/analyze`}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors"
          style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#3B82F6' }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Changer de focus
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-8 w-fit" style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.1)' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150"
            style={{
              background: activeTab === tab.key ? '#3B82F6' : 'transparent',
              color: activeTab === tab.key ? '#fff' : '#8B9DC3',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Progression journalière */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.15)' }}
      >
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-medium" style={{ color: '#8B9DC3' }}>{"AUJOURD'HUI"}</p>
          <p className="text-xs font-bold" style={{ color: '#06B6D4' }}>{completedCount}/{totalTasks} tâches</p>
        </div>
        <div className="h-2 rounded-full" style={{ background: '#1A2236' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #3B82F6, #06B6D4)' }}
          />
        </div>
        {progressPct === 100 && totalTasks > 0 && (
          <p className="text-xs mt-2 text-center" style={{ color: '#10B981' }}>🔥 Routine du jour complète !</p>
        )}
      </div>

      {/* Focus categories — highlighted */}
      {hasFilter && (
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCats.map(cat => {
              const actions = cat.actions[activeTab] ?? []
              return (
                <div
                  key={cat.key}
                  className="rounded-2xl p-5"
                  style={{
                    background: `${cat.color}08`,
                    border: `1px solid ${cat.color}25`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#EEF2FF]">{cat.label}</span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: `${cat.color}20`, color: cat.color, border: `1px solid ${cat.color}35` }}
                        >
                          Focus prioritaire
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {actions.map((action, i) => {
                      const taskId = `${cat.key}-${activeTab}-${i}`
                      return (
                        <ActionItem
                          key={i}
                          action={action}
                          accentColor={cat.color}
                          taskId={taskId}
                          isCompleted={completed.has(taskId)}
                          onToggle={toggleTask}
                        />
                      )
                    })}
                    {actions.length === 0 && (
                      <p className="text-xs text-[#3D4F6E] italic">Aucune action pour cette période.</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All other categories */}
      {hasFilter && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-[#3D4F6E] uppercase tracking-wider mb-4">
            Autres dimensions
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(hasFilter ? allCats.filter(c => !focusDimensions.includes(c.key)) : allCats).map(cat => {
          const actions = cat.actions[activeTab] ?? []
          return (
            <div
              key={cat.key}
              className="rounded-2xl p-5"
              style={{ background: '#0D1321', border: '1px solid rgba(59,130,246,0.08)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                  style={{ background: `${cat.color}12`, border: `1px solid ${cat.color}20` }}
                >
                  {cat.icon}
                </div>
                <span className="text-sm font-semibold text-[#8B9DC3]">{cat.label}</span>
              </div>
              <div className="space-y-2.5">
                {actions.map((action, i) => {
                  const taskId = `${cat.key}-${activeTab}-${i}`
                  return (
                    <ActionItem
                      key={i}
                      action={action}
                      accentColor={cat.color}
                      muted
                      taskId={taskId}
                      isCompleted={completed.has(taskId)}
                      onToggle={toggleTask}
                    />
                  )
                })}
                {actions.length === 0 && (
                  <p className="text-xs text-[#3D4F6E] italic">Aucune action pour cette période.</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Paywall inline pour les utilisateurs free */}
      {plan === 'free' && (
        <div
          className="mt-6 rounded-2xl p-5 text-center"
          style={{
            background: 'linear-gradient(135deg, #0D1321, #1A2236)',
            border: '1px solid rgba(59,130,246,0.2)',
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}
          >
            <svg className="w-5 h-5" style={{ color: '#3B82F6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-white font-bold mb-1">Semaines 2, 3 et 4 verrouillées</p>
          <p className="text-xs mb-4" style={{ color: '#8B9DC3' }}>
            Passe à Pro pour débloquer ton plan complet 30/90 jours
          </p>
          <button
            onClick={() => router.push(`${prefix}/onboarding/routine-preview`)}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-bold"
            style={{ background: 'linear-gradient(90deg, #3B82F6, #06B6D4)' }}
          >
            Débloquer ma routine complète
          </button>
        </div>
      )}
    </div>
  )
}

interface ActionItemProps {
  action: { title: string; desc: string; duration: string; level: string }
  accentColor: string
  muted?: boolean
  taskId: string
  isCompleted: boolean
  onToggle: (id: string) => void
}

function ActionItem({ action, accentColor, muted = false, taskId, isCompleted, onToggle }: ActionItemProps) {
  const levelStyle = LEVEL_COLORS[action.level] ?? LEVEL_COLORS.Easy

  return (
    <div
      className="flex items-start gap-3 cursor-pointer select-none"
      onClick={() => onToggle(taskId)}
    >
      {/* Checkbox circulaire */}
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
          isCompleted ? 'border-green-400 bg-green-400' : 'border-gray-600'
        }`}
      >
        {isCompleted && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className="text-xs font-semibold transition-all"
            style={{ color: isCompleted ? '#3D4F6E' : (muted ? '#8B9DC3' : '#EEF2FF'),
              textDecoration: isCompleted ? 'line-through' : 'none' }}
          >
            {action.title}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-[#3D4F6E]">{action.duration}</span>
            <span
              className="px-1.5 py-0.5 rounded text-xs font-medium"
              style={{ background: levelStyle.bg, color: levelStyle.color }}
            >
              {action.level}
            </span>
          </div>
        </div>
        <p className="text-xs text-[#3D4F6E] mt-0.5 leading-relaxed">{action.desc}</p>
      </div>
    </div>
  )
}

export default function RoutinePage() {
  return (
    <Suspense fallback={
      <div className="px-4 py-8 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    }>
      <RoutineContent />
    </Suspense>
  )
}
