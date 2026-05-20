'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import MotionReveal from '@/components/landing/shared/MotionReveal'
import SectionHeader from '@/components/landing/shared/SectionHeader'

const CHART_POINTS = [62, 65, 68, 70, 72, 74, 76, 78]

export default function MobileDashboardSection() {
  const t = useTranslations('landing.dashboard')

  const stats = [
    { key: 'score', value: '78', suffix: '/100', color: '#3B82F6' },
    { key: 'progress', value: '+8', suffix: ' pts', color: '#10B981' },
    { key: 'streak', value: '12', suffix: ' j', color: '#06B6D4' },
    { key: 'analyses', value: '5', suffix: '', color: '#8B5CF6' },
  ] as const

  const routineItems = ['item1', 'item2', 'item3', 'item4'] as const

  const w = 280
  const h = 80
  const max = 100
  const min = 55
  const step = w / (CHART_POINTS.length - 1)
  const pathD = CHART_POINTS.map((v, i) => {
    const x = i * step
    const y = h - ((v - min) / (max - min)) * h
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  return (
    <section className="px-4 py-16">
      <div className="max-w-[375px] mx-auto">
        <MotionReveal>
          <SectionHeader label={t('label')} title={t('title')} subtitle={t('subtitle')} />
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#080C14',
              border: '1px solid rgba(59,130,246,0.12)',
            }}
          >
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-px bg-[rgba(59,130,246,0.08)]">
              {stats.map((s) => (
                <div key={s.key} className="bg-[#080C14] p-3 text-center">
                  <p className="text-[9px] text-[#3D4F6E] uppercase tracking-wider mb-1">{t(`stat_${s.key}`)}</p>
                  <p className="text-sm font-black" style={{ fontFamily: 'Satoshi, sans-serif', color: s.color }}>
                    {s.value}
                    <span className="text-[10px] font-normal text-[#3D4F6E]">{s.suffix}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="p-4 border-b border-[rgba(59,130,246,0.08)]">
              <p className="text-[10px] tracking-wider uppercase text-[#3D4F6E] mb-3">{t('chart_title')}</p>
              <svg viewBox={`0 0 ${w} ${h + 10}`} className="w-full h-20">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.25)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                  </linearGradient>
                </defs>
                <path
                  d={`${pathD} L ${w} ${h + 10} L 0 ${h + 10} Z`}
                  fill="url(#chartFill)"
                />
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
            </div>

            {/* Daily routine */}
            <div className="p-4">
              <p className="text-[10px] tracking-wider uppercase text-[#3D4F6E] mb-3">{t('routine_title')}</p>
              <div className="space-y-2">
                {routineItems.map((item, i) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-2.5 rounded-xl"
                    style={{ background: 'rgba(13,19,33,0.8)', border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <div
                      className="w-4 h-4 rounded border flex items-center justify-center shrink-0"
                      style={{
                        borderColor: i < 2 ? 'rgba(16,185,129,0.5)' : 'rgba(59,130,246,0.3)',
                        background: i < 2 ? 'rgba(16,185,129,0.1)' : 'transparent',
                      }}
                    >
                      {i < 2 && (
                        <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#EEF2FF] truncate">{t(`${item}_title`)}</p>
                      <p className="text-[10px] text-[#3D4F6E]">{t(`${item}_time`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom nav mock */}
            <div
              className="flex items-center justify-around py-3 border-t border-[rgba(59,130,246,0.08)]"
              style={{ background: 'rgba(8,12,20,0.9)' }}
            >
              {(['home', 'analyse', 'routine', 'coach', 'profil'] as const).map((tab, i) => (
                <div key={tab} className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-5 h-5 rounded-md"
                    style={{
                      background: i === 0 ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                      border: i === 0 ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                    }}
                  />
                  <span className={`text-[8px] ${i === 0 ? 'text-cyan' : 'text-[#3D4F6E]'}`}>{t(`nav_${tab}`)}</span>
                </div>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}
