'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { isAuthUiHidden } from '@/lib/auth-ui'
import { UPFACE_LOGO_IMG_STYLE } from '@/lib/upface-logo-style'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)

  const prefix = locale === 'fr' ? '' : `/${locale}`
  const hideAuthUi = isAuthUiHidden()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: 'rgba(8,12,20,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(59,130,246,0.10)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`${prefix}/`} className="flex items-center gap-2 group">
          <Image src="/logo.png" alt="UPFACE" width={36} height={36} style={UPFACE_LOGO_IMG_STYLE} />
          <span
            className="font-bold text-lg tracking-tight text-[#EEF2FF] group-hover:text-blue-400 transition-colors"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          >
            UPFACE
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href={`${prefix}/#how-it-works`} className="text-sm text-[#8B9DC3] hover:text-[#EEF2FF] transition-colors">{t('howItWorks')}</Link>
          <Link href={`${prefix}/analyze`} className="text-sm text-[#8B9DC3] hover:text-[#EEF2FF] transition-colors">{t('analyze')}</Link>
          <Link href={`${prefix}/#routine`} className="text-sm text-[#8B9DC3] hover:text-[#EEF2FF] transition-colors">{t('routine')}</Link>
          <Link href={`${prefix}/#pricing`} className="text-sm text-[#8B9DC3] hover:text-[#EEF2FF] transition-colors">{t('pricing')}</Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {!hideAuthUi && (
            <Button variant="ghost" size="sm" onClick={() => { window.location.href = `${prefix}/login` }}>
              {t('login')}
            </Button>
          )}
          <Button size="sm" onClick={() => { window.location.href = `${prefix}/analyze` }}>
            {t('cta')}
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[#8B9DC3] hover:text-[#EEF2FF] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[rgba(59,130,246,0.10)] bg-[#080C14]">
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link href={`${prefix}/#how-it-works`} className="text-sm text-[#8B9DC3] py-2" onClick={() => setMenuOpen(false)}>{t('howItWorks')}</Link>
            <Link href={`${prefix}/analyze`} className="text-sm text-[#8B9DC3] py-2" onClick={() => setMenuOpen(false)}>{t('analyze')}</Link>
            <Link href={`${prefix}/#pricing`} className="text-sm text-[#8B9DC3] py-2" onClick={() => setMenuOpen(false)}>{t('pricing')}</Link>
            <hr className="border-[rgba(255,255,255,0.06)]" />
            {!hideAuthUi && (
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setMenuOpen(false); window.location.href = `${prefix}/login` }}>
                {t('login')}
              </Button>
            )}
            <Button size="sm" onClick={() => { setMenuOpen(false); window.location.href = `${prefix}/analyze` }}>
              {t('cta')}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

