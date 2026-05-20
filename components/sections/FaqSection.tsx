'use client'

import { useTranslations } from 'next-intl'
import MotionReveal from '@/components/landing/shared/MotionReveal'
import SectionHeader from '@/components/landing/shared/SectionHeader'
import MobileProofCarouselSection from '@/components/landing/mobile/MobileProofCarouselSection'
import { FAQ_KEYS } from '@/lib/faq'

function FaqChevron() {
  return (
    <svg
      className="w-5 h-5 text-cyan flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function FaqSection() {
  const t = useTranslations('faq')

  return (
    <>
      <MobileProofCarouselSection />
    <section
      id="faq"
      className="px-4 py-16 pb-8"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="max-w-[375px] mx-auto">
        <MotionReveal>
          <SectionHeader title={t('title')} subtitle={t('subtitle')} />
        </MotionReveal>

        <div className="space-y-3">
          {FAQ_KEYS.map((key, i) => (
            <MotionReveal key={key} delay={i * 0.04}>
              <details
                className="rounded-2xl overflow-hidden group [&_summary::-webkit-details-marker]:hidden"
                style={{
                  background: '#0D1321',
                  border: '1px solid rgba(59,130,246,0.1)',
                }}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <summary className="flex items-center justify-between gap-4 p-4 cursor-pointer list-none">
                  <span
                    className="text-sm font-semibold text-[#EEF2FF] leading-snug text-left"
                    itemProp="name"
                  >
                    {t(`${key}_question`)}
                  </span>
                  <FaqChevron />
                </summary>
                <div
                  className="px-4 pb-4"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <p className="text-sm leading-relaxed text-[#8B9DC3] whitespace-pre-line" itemProp="text">
                    {t(`${key}_answer`)}
                  </p>
                </div>
              </details>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}
