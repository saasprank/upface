'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { isAuthUiHidden } from '@/lib/auth-ui'
import UpfaceLogo from '@/components/ui/UpfaceLogo'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)

  const prefix = locale === 'fr' ? '' : `/${locale}`
  const hideAuthUi = isAuthUiHidden()

  const navLinks = [
    { href: `${prefix}/#how-it-works`, label: t('features') },
    { href: `${prefix}/#proof`, label: t('results') },
    { href: `${prefix}/#faq`, label: t('faq') },
  ]

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="w-full max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <UpfaceLogo size="nav" href={`${prefix}/`} />

          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-theme transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 ml-auto">
            {!hideAuthUi && (
              <Link
                href={`${prefix}/login`}
                className="text-sm text-muted hover:text-theme px-3 py-1.5 transition-colors"
              >
                {t('login')}
              </Link>
            )}
            <Link
              href={`${prefix}/analyze`}
              className="text-sm font-semibold px-4 py-2 rounded-xl text-white btn-primary-premium"
            >
              {t('cta')}
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden ml-auto p-2 text-muted hover:text-theme transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(15,23,42,0.25)', backdropFilter: 'blur(4px)' }}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />

      <aside
        className={`fixed top-0 right-0 z-[70] h-[100dvh] w-[min(300px,88vw)] md:hidden flex flex-col transition-transform duration-300 ease-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'rgba(255,255,255,0.95)',
          borderLeft: '1px solid rgba(59,130,246,0.12)',
          boxShadow: '-8px 0 40px rgba(59,130,246,0.1)',
          backdropFilter: 'blur(24px)',
        }}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between px-5 h-14 shrink-0 border-b border-[rgba(59,130,246,0.08)]">
          <span
            className="text-[10px] tracking-[0.22em] uppercase text-cyan"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Menu
          </span>
          <button
            type="button"
            onClick={closeMenu}
            className="p-2 rounded-xl text-muted hover:text-theme transition-colors bg-surface-2"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-theme px-4 py-3.5 rounded-xl transition-colors hover:bg-[rgba(59,130,246,0.06)]"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          {!hideAuthUi && (
            <Link
              href={`${prefix}/login`}
              className="text-sm text-muted px-4 py-3.5 rounded-xl transition-colors hover:text-theme hover:bg-[rgba(15,23,42,0.04)]"
              onClick={closeMenu}
            >
              {t('login')}
            </Link>
          )}
        </nav>

        <div className="p-4 shrink-0 border-t border-[rgba(59,130,246,0.08)] bg-[rgba(248,250,255,0.8)]">
          <Link
            href={`${prefix}/analyze`}
            className="flex items-center justify-center w-full h-12 rounded-xl text-sm font-semibold text-white btn-primary-premium"
            onClick={closeMenu}
          >
            {t('cta')}
          </Link>
        </div>
      </aside>
    </>
  )
}
