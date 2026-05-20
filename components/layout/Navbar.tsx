'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import { isAuthUiHidden } from '@/lib/auth-ui'
import { UPFACE_LOGO_IMG_STYLE } from '@/lib/upface-logo-style'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)

  const prefix = locale === 'fr' ? '' : `/${locale}`
  const hideAuthUi = isAuthUiHidden()

  const navLinks = [
    { href: `${prefix}/#how-it-works`, label: t('features') },
    { href: `${prefix}/#faq`, label: t('faq') },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(8,12,20,0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(59,130,246,0.08)',
      }}
    >
      <div className="max-w-[375px] sm:max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        <Link href={`${prefix}/`} className="flex items-center gap-2 group">
          <Image src="/logo.png" alt="UPFACE" width={28} height={28} style={UPFACE_LOGO_IMG_STYLE} className="sm:w-9 sm:h-9" />
          <span
            className="font-bold text-base sm:text-lg tracking-tight text-[#EEF2FF]"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            UPFACE
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#8B9DC3] hover:text-[#EEF2FF] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {!hideAuthUi && (
            <Link
              href={`${prefix}/login`}
              className="text-sm text-[#8B9DC3] hover:text-[#EEF2FF] px-3 py-1.5 transition-colors"
            >
              {t('login')}
            </Link>
          )}
          <Link
            href={`${prefix}/analyze`}
            className="text-sm font-semibold px-4 py-2 rounded-xl text-[#EEF2FF] transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              boxShadow: '0 0 20px rgba(59,130,246,0.2)',
            }}
          >
            {t('cta')}
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Link
            href={`${prefix}/analyze`}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg text-[#EEF2FF]"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)' }}
          >
            {t('cta')}
          </Link>
          <button
            className="p-2 text-[#8B9DC3]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: 'rgba(8,12,20,0.95)', borderColor: 'rgba(59,130,246,0.08)' }}
        >
          <div className="max-w-[375px] mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#8B9DC3] py-3 border-b border-[rgba(255,255,255,0.04)]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!hideAuthUi && (
              <Link
                href={`${prefix}/login`}
                className="text-sm text-[#8B9DC3] py-3"
                onClick={() => setMenuOpen(false)}
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
