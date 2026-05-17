'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import PaywallOverlay from '@/components/ui/PaywallOverlay'

const routineCards = [
  {
    icon: '🧴',
    title: 'Skincare',
    subtitle: 'Protocole peau',
    preview: ['Nettoyage doux matin & soir', 'Sérum vitamine C', 'SPF 50 quotidien'],
    color: '#3B82F6',
  },
  {
    icon: '🦷',
    title: 'Jawline',
    subtitle: 'Structure faciale',
    preview: ['Mewing : 30 min/jour', 'Chewing-gum dur', 'Massage gua sha'],
    color: '#06B6D4',
  },
  {
    icon: '✨',
    title: 'Style & Aura',
    subtitle: 'Présence & charisme',
    preview: ['Coupe adaptée', 'Contact visuel', 'Posture : 30 min/jour'],
    color: '#8B5CF6',
  },
]

const lockedCards = [
  { icon: '💪', title: 'Fitness', subtitle: 'Corps & posture', color: '#10B981' },
  { icon: '🥗', title: 'Nutrition', subtitle: 'Alimentation optimisée', color: '#F59E0B' },
]

export default function RoutinePreviewSection() {
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  return (
    <section id="routine" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl font-black text-[#EEF2FF] mb-4"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            Votre routine <span className="text-gradient-blue">30 jours</span>
          </h2>
          <p className="text-[#8B9DC3] max-w-lg mx-auto text-sm">
            Un protocole complet adapté à votre analyse : skincare, jawline, style, fitness, nutrition.
          </p>
        </div>

        {/* First row — visible */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {routineCards.map((card) => (
            <Card key={card.title} className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${card.color}15`, border: `1px solid ${card.color}25` }}
                >
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#EEF2FF]">{card.title}</p>
                  <p className="text-xs text-[#3D4F6E]">{card.subtitle}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {card.preview.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#8B9DC3]">
                    <span className="mt-0.5 w-4 h-4 rounded-full border border-[rgba(59,130,246,0.3)] flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Second row — blurred with paywall */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 blur-sm pointer-events-none select-none">
            {lockedCards.map((card) => (
              <Card key={card.title} className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: `${card.color}15`, border: `1px solid ${card.color}25` }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#EEF2FF]">{card.title}</p>
                    <p className="text-xs text-[#3D4F6E]">{card.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-3 rounded-full bg-white/5 w-full" />
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 rounded-xl overflow-hidden"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(8,12,20,0.9) 40%)' }}
          >
            <div className="text-center px-4 pt-8">
              <p className="text-sm text-[#EEF2FF] font-medium mb-4">
                Débloquer la routine complète
              </p>
              <Button size="sm" onClick={() => router.push(`${prefix}/analyze`)}>
                Analyser gratuitement →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
