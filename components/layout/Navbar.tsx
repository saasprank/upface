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
    { href: `${prefix}/#pricing`, label: t('pricing') },
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
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[rgba(255,255,255,0.08)] bg-[#080C14]">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4">
          <UpfaceLogo size="nav" href={`${prefix}/`} variant="dark" />

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-[Inter,sans-serif] text-[15px] font-normal text-white transition-colors hover:text-white/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            {!hideAuthUi && (
              <Link
                href={`${prefix}/login`}
                className="px-3 py-1.5 font-[Inter,sans-serif] text-[15px] font-normal text-white/70 transition-colors hover:text-white"
              >
                {t('login')}
              </Link>
            )}
            <Link
              href={`${prefix}/analyze`}
              className="rounded-full bg-[#3B82F6] px-5 py-2 font-[Inter,sans-serif] text-[15px] font-medium text-white transition-opacity hover:opacity-90"
            >
              {t('cta')}
            </Link>
          </div>

          <button
            type="button"
            className="ml-auto p-2 text-white/80 transition-colors hover:text-white md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ background: 'rgba(4,8,16,0.72)', backdropFilter: 'blur(4px)' }}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-[100dvh] w-[min(300px,88vw)] flex-col transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: '#080C14',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.45)',
        }}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-5">
          <UpfaceLogo size="sm" variant="dark" />
          <button
            type="button"
            onClick={closeMenu}
            className="rounded-full p-2 text-white/70 transition-colors hover:text-white"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-3.5 font-[Inter,sans-serif] text-[15px] font-normal text-white transition-colors hover:bg-[rgba(255,255,255,0.06)]"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          {!hideAuthUi && (
            <Link
              href={`${prefix}/login`}
              className="rounded-xl px-4 py-3.5 font-[Inter,sans-serif] text-[15px] text-white/70 transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
              onClick={closeMenu}
            >
              {t('login')}
            </Link>
          )}
        </nav>

        <div className="shrink-0 border-t border-[rgba(255,255,255,0.08)] p-4">
          <Link
            href={`${prefix}/analyze`}
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#3B82F6] font-[Inter,sans-serif] text-[15px] font-medium text-white transition-opacity hover:opacity-90"
            onClick={closeMenu}
          >
            {t('cta')}
          </Link>
        </div>
      </aside>
    </>
  )
}
