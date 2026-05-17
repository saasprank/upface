'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import ScoreRing from '@/components/ui/ScoreRing'
import BreakdownBar from '@/components/ui/BreakdownBar'
import TraitCard from '@/components/ui/TraitCard'
import Badge from '@/components/ui/Badge'

const demoScores = [
  { label: 'Symétrie', value: 82 },
  { label: 'Proportions', value: 76 },
  { label: 'Structure', value: 71 },
  { label: 'Qualité peau', value: 68 },
  { label: 'Grooming', value: 74 },
]

const demoTraits = [
  { icon: '⚖️', label: 'Symétrie faciale', value: 'Excellente', score: 82 },
  { icon: '📐', label: 'Ratio Doré', value: 'Équilibré', score: 76 },
  { icon: '🦷', label: 'Structure / Jawline', value: 'Définie', score: 71 },
  { icon: '✨', label: 'Qualité de peau', value: 'Bonne', score: 68 },
  { icon: '🌟', label: 'Aura & Présence', value: 'Solide', score: 74 },
]

export default function ScoreDemoSection() {
  const t = useTranslations('common')
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.12 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="score-demo" ref={sectionRef} className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <Badge variant="muted" className="mb-4">{t('example_badge')}</Badge>
          <h2
            className="text-3xl sm:text-4xl font-black text-[#EEF2FF] mb-4"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            Votre analyse en détail
          </h2>
          <p className="text-[#8B9DC3] max-w-lg mx-auto text-sm">
            Voici à quoi ressemble un rapport UPFACE. Score par catégorie, traits analysés, routine personnalisée.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
        >
          {/* Left: Score ring + bars */}
          <div className="bg-[#0D1321] border border-[rgba(59,130,246,0.12)] rounded-2xl p-8 flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <ScoreRing score={74} size={180} animate={visible} />
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-emerald-400">Attractive</span>
                <span className="text-xs text-[#3D4F6E]">· Top 34%</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              {demoScores.map((item) => (
                <BreakdownBar key={item.label} label={item.label} value={item.value} animate={visible} />
              ))}
            </div>
          </div>

          {/* Right: TraitCards */}
          <div className="flex flex-col gap-3">
            {demoTraits.map((trait, i) => (
              <div
                key={trait.label}
                className={`transition-all duration-500 ${
                  visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{
                  transitionDelay: `${i * 80 + 200}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <TraitCard
                  icon={trait.icon}
                  label={trait.label}
                  value={trait.value}
                  score={trait.score}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
