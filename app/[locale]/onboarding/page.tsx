'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import UpfaceLogo from '@/components/ui/UpfaceLogo'

// ─── Data ─────────────────────────────────────────────────────────────────────

const IMPROVE_OPTIONS = [
  {
    id: 'jaw',
    label: 'Mâchoire & menton',
    desc: 'Définition, angularité, jawline',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: 'eyes',
    label: 'Zone des yeux',
    desc: 'Regard, cernes, sourcils, lift',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'cheeks',
    label: 'Pommettes',
    desc: 'Saillance, définition zygomatique',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    id: 'skin',
    label: 'Qualité de peau',
    desc: 'Teint, texture, éclat, pores',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    id: 'full',
    label: 'Optimisation complète',
    desc: 'Tout améliorer en parallèle',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
]

const DREAM_OPTIONS = [
  { id: 'unstoppable', label: 'Inarrêtable', desc: 'Confiance totale, sans limite', icon: '🔥' },
  { id: 'confident',   label: 'Confiant en toute situation', desc: 'À l\'aise partout, avec tout le monde', icon: '💪' },
  { id: 'proud',       label: 'Fier de mon reflet', desc: 'Enfin satisfait de ce que je vois', icon: '🪞' },
  { id: 'myself',      label: 'Enfin moi-même', desc: 'Mon visage reflète qui je suis vraiment', icon: '✨' },
  { id: 'same',        label: 'Pareil qu\'avant', desc: 'Juste quelques améliorations légères', icon: '😐' },
]

const TIME_OPTIONS = [
  {
    id: '5-10',
    label: '5–10 min',
    desc: 'Routine express, résultats progressifs',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    color: '#F59E0B',
  },
  {
    id: '10-15',
    label: '10–15 min',
    desc: 'Equilibre efficacité / temps',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: '#3B82F6',
  },
  {
    id: '15-20',
    label: '15–20 min',
    desc: 'Résultats visibles en 4 semaines',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
      </svg>
    ),
    color: '#10B981',
  },
  {
    id: '20-30',
    label: '20–30 min',
    desc: 'Transformation maximale, engagement pro',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
    color: '#06B6D4',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

function OnboardingContent() {
  const router = useRouter()
  const locale = useLocale() as string
  const prefix = locale === 'fr' ? '' : `/${locale}`
  const searchParams = useSearchParams()
  const analysisId = searchParams.get('id') ?? ''

  const [step, setStep] = useState(1)
  const [improve, setImprove] = useState<string[]>([])
  const [dream, setDream] = useState<string>('')
  const [time, setTime] = useState<string>('')

  const toggleImprove = (id: string) => {
    if (id === 'full') { setImprove(['full']); return }
    setImprove(prev => {
      const without = prev.filter(x => x !== 'full')
      return without.includes(id) ? without.filter(x => x !== id) : [...without, id]
    })
  }

  const canContinue1 = improve.length > 0
  const canContinue2 = dream !== ''
  const canContinue3 = time !== ''

  const handleFinish = () => {
    try {
      localStorage.setItem('upface_onboarding', JSON.stringify({ improve, dream, time, analysisId }))
    } catch { /* ignore */ }
    // Flux : 3 questions → loader (/onboarding/generating + API) → paywall (/onboarding/routine-preview)
    router.push(`${prefix}/onboarding/generating`)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080C14' }}>

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4"
        style={{ height: 56, background: 'rgba(8,12,20,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(59,130,246,0.08)' }}
      >
        <UpfaceLogo size="sm" href={`${prefix}/`} />

        {/* Progress bar */}
        <div className="flex-1 mx-4 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(59,130,246,0.12)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: step === 1 ? '33%' : step === 2 ? '66%' : '100%',
              background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
            }}
          />
        </div>

        <span className="text-xs font-medium shrink-0" style={{ color: '#3D4F6E' }}>{step}/3</span>
      </header>

      <main className="flex-1 pt-14 pb-32 px-4">
        <div className="max-w-md mx-auto pt-8">

          {/* ── Step 1 ── */}
          {step === 1 && (
            <>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[#3B82F6] mb-2">Étape 1 sur 3</p>
                <h1 className="text-2xl font-black text-[#EEF2FF] leading-tight mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  Qu&apos;est-ce que tu veux améliorer en priorité ?
                </h1>
                <p className="text-sm text-[#8B9DC3]">Sélectionne tout ce qui s&apos;applique.</p>
              </div>

              <div className="space-y-3">
                {IMPROVE_OPTIONS.map(opt => {
                  const selected = improve.includes(opt.id)
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleImprove(opt.id)}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all"
                      style={{
                        background: selected ? 'rgba(59,130,246,0.12)' : 'rgba(13,19,33,0.8)',
                        border: selected ? '1.5px solid rgba(59,130,246,0.5)' : '1.5px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        className="shrink-0 flex items-center justify-center rounded-xl w-10 h-10"
                        style={{ background: selected ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)', color: selected ? '#3B82F6' : '#8B9DC3' }}
                      >
                        {opt.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{ color: selected ? '#EEF2FF' : '#C4D0E8' }}>{opt.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#5C6B85' }}>{opt.desc}</p>
                      </div>
                      <div
                        className="shrink-0 w-5 h-5 rounded flex items-center justify-center"
                        style={{
                          background: selected ? '#3B82F6' : 'transparent',
                          border: selected ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        {selected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[#3B82F6] mb-2">Étape 2 sur 3</p>
                <h1 className="text-2xl font-black text-[#EEF2FF] leading-tight mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  Comment ton visage de rêve te ferait-il te sentir ?
                </h1>
                <p className="text-sm text-[#8B9DC3]">Visualise ton ascension.</p>
              </div>

              <div className="space-y-3">
                {DREAM_OPTIONS.map(opt => {
                  const selected = dream === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDream(opt.id)}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all"
                      style={{
                        background: selected ? 'rgba(59,130,246,0.12)' : 'rgba(13,19,33,0.8)',
                        border: selected ? '1.5px solid rgba(59,130,246,0.5)' : '1.5px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <span className="text-xl shrink-0">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{ color: selected ? '#EEF2FF' : '#C4D0E8' }}>{opt.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#5C6B85' }}>{opt.desc}</p>
                      </div>
                      <div
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          background: selected ? '#3B82F6' : 'transparent',
                          border: selected ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[#3B82F6] mb-2">Étape 3 sur 3</p>
                <h1 className="text-2xl font-black text-[#EEF2FF] leading-tight mb-2" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                  Combien de temps peux-tu y consacrer chaque jour ?
                </h1>
                <p className="text-sm text-[#8B9DC3]">Ta routine sera calibrée en conséquence.</p>
              </div>

              <div className="space-y-3">
                {TIME_OPTIONS.map(opt => {
                  const selected = time === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTime(opt.id)}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all"
                      style={{
                        background: selected ? `${opt.color}14` : 'rgba(13,19,33,0.8)',
                        border: selected ? `1.5px solid ${opt.color}55` : '1.5px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        className="shrink-0 flex items-center justify-center rounded-xl w-10 h-10"
                        style={{ background: selected ? `${opt.color}22` : 'rgba(255,255,255,0.04)', color: selected ? opt.color : '#8B9DC3' }}
                      >
                        {opt.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base" style={{ color: selected ? '#EEF2FF' : '#C4D0E8' }}>{opt.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#5C6B85' }}>{opt.desc}</p>
                      </div>
                      <div
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          background: selected ? opt.color : 'transparent',
                          border: selected ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4"
        style={{ background: 'linear-gradient(to top, #080C14 70%, transparent)', zIndex: 40 }}
      >
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="flex items-center justify-center rounded-2xl transition-all"
              style={{
                height: 56, width: 56,
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
                color: '#3B82F6',
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (step < 3) setStep(s => s + 1)
              else handleFinish()
            }}
            disabled={
              (step === 1 && !canContinue1) ||
              (step === 2 && !canContinue2) ||
              (step === 3 && !canContinue3)
            }
            className="flex-1 flex items-center justify-center gap-2 font-black text-base rounded-2xl transition-all"
            style={{
              height: 56,
              background: (
                (step === 1 && !canContinue1) ||
                (step === 2 && !canContinue2) ||
                (step === 3 && !canContinue3)
              )
                ? 'rgba(59,130,246,0.2)'
                : 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              color: (
                (step === 1 && !canContinue1) ||
                (step === 2 && !canContinue2) ||
                (step === 3 && !canContinue3)
              )
                ? '#3D4F6E'
                : '#fff',
              fontFamily: 'Satoshi, sans-serif',
              cursor: (
                (step === 1 && !canContinue1) ||
                (step === 2 && !canContinue2) ||
                (step === 3 && !canContinue3)
              ) ? 'not-allowed' : 'pointer',
              boxShadow: (
                (step === 1 && !canContinue1) ||
                (step === 2 && !canContinue2) ||
                (step === 3 && !canContinue3)
              ) ? 'none' : '0 4px 20px rgba(59,130,246,0.25)',
            }}
          >
            {step < 3 ? 'Continuer' : 'Générer ma routine'}
            {step === 3 ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  )
}
