'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

const steps = [
  {
    number: '01',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    keyTitle: 'step_1_title' as const,
    keyDesc: 'step_1_desc' as const,
  },
  {
    number: '02',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    keyTitle: 'step_2_title' as const,
    keyDesc: 'step_2_desc' as const,
  },
  {
    number: '03',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    keyTitle: 'step_3_title' as const,
    keyDesc: 'step_3_desc' as const,
  },
]

export default function HowItWorksSection() {
  const t = useTranslations('howItWorks')
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
    <section id="how-it-works" ref={sectionRef} className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl font-black text-[#EEF2FF] mb-4"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            {t('title')}
          </h2>
          <div className="w-12 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #3B82F6, transparent)' }} />
        </div>

        <div className="relative">
          {/* Dotted connector line (desktop only) */}
          <div
            className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, rgba(59,130,246,0.3) 0, rgba(59,130,246,0.3) 6px, transparent 6px, transparent 12px)',
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex flex-col items-center text-center transition-all duration-600 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{
                  transitionDelay: `${i * 150}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {/* Icon square */}
                <div className="relative mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center border text-blue-400"
                    style={{
                      background: 'rgba(59,130,246,0.08)',
                      borderColor: 'rgba(59,130,246,0.20)',
                    }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{ background: '#3B82F6', color: '#080C14' }}
                  >
                    {i + 1}
                  </span>
                </div>

                <h3 className="font-bold text-[#EEF2FF] text-base mb-2">{t(step.keyTitle)}</h3>
                <p className="text-sm text-[#8B9DC3] leading-relaxed max-w-xs">{t(step.keyDesc)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
