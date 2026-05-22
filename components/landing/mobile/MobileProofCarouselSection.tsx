'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import SectionHeader from '@/components/landing/shared/SectionHeader'
import ProofStoryCard from '@/components/landing/shared/ProofStoryCard'
import { PROOF_STORIES, PROOF_AGGREGATE_KEYS } from '@/lib/proof-stories'

export default function MobileProofCarouselSection() {
  const t = useTranslations('landing.proof')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.firstElementChild?.clientWidth ?? 320
    const gap = 12
    const index = Math.round(el.scrollLeft / (cardWidth + gap))
    setActiveIndex(Math.min(Math.max(0, index), PROOF_STORIES.length - 1))
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateActiveIndex, { passive: true })
    return () => el.removeEventListener('scroll', updateActiveIndex)
  }, [updateActiveIndex])

  return (
    <section id="proof" className="px-4 py-16 pb-4 scroll-mt-24">
      <div className="max-w-[375px] mx-auto">
        <SectionHeader label={t('label')} title={t('title')} subtitle={t('subtitle')} />

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
          aria-label={t('carousel_label')}
        >
          {PROOF_STORIES.map((story) => (
            <ProofStoryCard key={story.id} story={story} />
          ))}
        </div>

        <div className="flex justify-center gap-1.5 mt-4" role="tablist" aria-label={t('carousel_dots')}>
          {PROOF_STORIES.map((story, i) => (
            <button
              key={story.id}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={t(`${story.id}_name`)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 20 : 6,
                background: i === activeIndex ? '#06B6D4' : 'rgba(59,130,246,0.25)',
              }}
              onClick={() => {
                const el = scrollRef.current
                if (!el) return
                const card = el.children[i] as HTMLElement | undefined
                card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
              }}
            />
          ))}
        </div>

        <div
          className="mt-6 rounded-2xl overflow-hidden divide-y divide-[rgba(59,130,246,0.08)] glass-card"
        >
          {PROOF_AGGREGATE_KEYS.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 px-4 py-3.5"
            >
                <span className="text-xs text-muted">{t(`aggregate_${key}_label`)}</span>
                <span
                  className="text-xs font-bold text-theme text-right"
                style={{ fontFamily: 'Satoshi, sans-serif' }}
              >
                {t(`aggregate_${key}_value`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
