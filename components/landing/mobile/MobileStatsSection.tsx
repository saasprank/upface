'use client'

import { useTranslations } from 'next-intl'
import { MotionStagger, MotionStaggerItem } from '@/components/landing/shared/MotionReveal'

const STAT_ICONS = ['◈', '⏱', '◎', '▲'] as const

export default function MobileStatsSection() {
  const t = useTranslations('landing.stats')
  const keys = ['points', 'speed', 'accuracy', 'analyses'] as const

  return (
    <section className="px-4 py-10">
      <MotionStagger className="grid grid-cols-2 gap-3 max-w-[375px] mx-auto">
        {keys.map((key, i) => (
          <MotionStaggerItem key={key}>
            <div className="rounded-2xl p-4 text-center relative overflow-hidden glass-card">
              <div
                className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-40"
                style={{
                  background: 'radial-gradient(circle at 100% 0%, rgba(59,130,246,0.15), transparent 70%)',
                }}
              />
              <span className="text-lg text-cyan mb-2 block">{STAT_ICONS[i]}</span>
              <p
                className="text-xl font-black text-theme mb-0.5"
                style={{ fontFamily: 'Satoshi, sans-serif' }}
              >
                {t(`${key}_value`)}
              </p>
              <p className="text-[10px] text-faint uppercase tracking-wider">{t(`${key}_label`)}</p>
            </div>
          </MotionStaggerItem>
        ))}
      </MotionStagger>
    </section>
  )
}
