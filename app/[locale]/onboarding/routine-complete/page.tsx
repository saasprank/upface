'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import UpfaceLogo from '@/components/ui/UpfaceLogo'
import { readRoutinePayloadFromLocalStorage } from '@/lib/routine-client'

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

function RoutineCard({ item }: { item: RoutineCategory }) {
  return (
    <div
      className="rounded-2xl p-4 mb-3"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(59,130,246,0.18)',
      }}
    >
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

function RoutineCompleteContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = (params?.locale as string) ?? 'fr'
  const prefix = locale === 'fr' ? '' : `/${locale}`
  const sessionId = searchParams.get('session_id')

  const [routine, setRoutine] = useState<GeneratedRoutine | null>(null)
  const [genError, setGenError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(true)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setGenerating(true)
      setGenError(null)
      try {
        const { improve, dream, time, scores, observations } = readRoutinePayloadFromLocalStorage()

        const body = JSON.stringify({
          improve,
          dream,
          time,
          scores,
          observations,
        })

        let res = await fetch('/api/generate-routine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body,
        })

        // Le webhook Stripe peut arriver après la redirection — quelques retries si abonnement pas encore actif.
        for (let attempt = 0; attempt < 5 && res.status === 403; attempt++) {
          await new Promise((r) => setTimeout(r, 1200 + attempt * 400))
          res = await fetch('/api/generate-routine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body,
          })
        }

        const payload = await res.json().catch(() => ({})) as { routine?: GeneratedRoutine; error?: string }

        if (!res.ok) {
          if (!cancelled) {
            const fallback =
              res.status === 403 ? 'Abonnement requis'
                : res.status === 401 ? 'Connexion requise'
                  : 'Génération impossible'
            setGenError(payload.error ?? fallback)
            setRoutine(null)
          }
          return
        }

        if (payload.routine && !cancelled) {
          localStorage.setItem('upface_routine', JSON.stringify(payload.routine))
          setRoutine(payload.routine)
        }
      } catch {
        if (!cancelled) setGenError('Génération impossible')
      } finally {
        if (!cancelled) setGenerating(false)
      }
    }

    void run()
    return () => { cancelled = true }
  }, [])

  const categories = routine?.categories ?? []
  const headline = routine?.headline ?? 'Ta routine complète est débloquée'

  return (
    <div className="min-h-screen pb-32" style={{ background: '#F8FAFF' }}>

      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between"
        style={{ background: '#F8FAFF', borderBottom: '1px solid rgba(59,130,246,0.08)' }}
      >
        <UpfaceLogo size="sm" />
        <div
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          Premium actif
        </div>
      </div>

      <div className="px-4 pt-8 max-w-lg mx-auto">

        {generating && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-sm" style={{ color: '#64748B' }}>Génération de ta routine personnalisée…</p>
          </div>
        )}

        {!generating && genError && (
          <div
            className="rounded-2xl p-4 mb-6 text-center"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            <p className="text-sm text-white font-medium mb-1">{genError}</p>
            <p className="text-xs" style={{ color: '#64748B' }}>
              Réessaie depuis le dashboard ou contacte le support si le problème persiste.
            </p>
          </div>
        )}

        {!generating && !genError && (
          <>
            {/* Succès banner */}
            <div
              className="rounded-2xl p-5 mb-6 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))',
                border: '1px solid rgba(16,185,129,0.25)',
              }}
            >
              <div className="text-3xl mb-2">
                <svg className="w-10 h-10 mx-auto" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="rgba(16,185,129,0.15)" />
                  <path d="M12 20l6 6 10-12" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white mb-1">Routine débloquée !</h2>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Ton accès Premium est actif.{sessionId ? ' Paiement confirmé.' : ''} Ta transformation commence maintenant.
              </p>
            </div>

            {/* Titre routine */}
            <div className="mb-4">
              <p className="text-xs font-medium mb-1" style={{ color: '#06B6D4' }}>ROUTINE COMPLÈTE — 30 JOURS</p>
              <h1 className="text-2xl font-bold text-white leading-tight">{headline}</h1>
            </div>

            {/* Stats row */}
            {categories.length > 0 && (
              <div className="flex gap-2 mb-6">
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
            )}

            {/* Toutes les cartes — sans blur, toutes débloquées */}
            {categories.length > 0 ? (
              categories.map((item, i) => (
                <RoutineCard key={item.id ?? i} item={{ ...item, unlocked: true }} />
              ))
            ) : (
              <div className="text-center py-12" style={{ color: '#64748B' }}>
                <p className="text-sm">Aucune donnée de routine reçue. Ouvre le dashboard pour réessayer.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA fixé en bas */}
      {!generating && (
        <div
          className="fixed bottom-0 left-0 right-0 px-4 pb-8 pt-4"
          style={{ background: 'linear-gradient(to top, #F8FAFF 80%, transparent)' }}
        >
          <button
            onClick={() => router.push(`${prefix}/dashboard`)}
            className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
              boxShadow: '0 0 24px rgba(59,130,246,0.35)',
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Voir mon dashboard
          </button>
        </div>
      )}
    </div>
  )
}

export default function RoutineCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    }>
      <RoutineCompleteContent />
    </Suspense>
  )
}
