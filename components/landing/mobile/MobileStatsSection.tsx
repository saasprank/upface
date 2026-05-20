'use client'

import { useTranslations } from 'next-intl'
import { MotionStagger, MotionStaggerItem } from '@/components/landing/shared/MotionReveal'

const STAT_ICONS = ['◈', '⏱', '◎', '▲'] as const

export default function MobileStatsSection() {
  const t = useTranslations('landing.stats')
  const keys = ['points', 'speed', 'accuracy', 'analyses'] as const

  return (
    <section className="px-4 py-10 border-y border-[rgba(59,130,246,0.08)]">
      <MotionStagger className="grid grid-cols-2 gap-3 max-w-[375px] mx-auto">
        {keys.map((key, i) => (
          <MotionStaggerItem key={key}>
            <div
              className="rounded-2xl p-4 text-center relative overflow-hidden"
              style={{
                background: '#0D1321',
                border: '1px solid rgba(59,130,246,0.12)',
              }}
            >
              <div
                className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-30"
                style={{
                  background: 'radial-gradient(circle at 100% 0%, rgba(59,130,246,0.3), transparent 70%)',
                }}
              />
              <span className="text-lg text-cyan mb-2 block">{STAT_ICONS[i]}</span>
              <p
                className="text-xl font-black text-[#EEF2FF] mb-0.5"
                style={{ fontFamily: 'Satoshi, sans-serif' }}
              >
                {t(`${key}_value`)}
              </p>
              <p className="text-[10px] text-[#3D4F6E] uppercase tracking-wider">{t(`${key}_label`)}</p>
            </div>
          </MotionStaggerItem>
        ))}
      </MotionStagger>
    </section>
  )
}
