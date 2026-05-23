'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import UpfaceLogo from '@/components/ui/UpfaceLogo'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  return (
    <footer className="border-t border-[#1E2A3E] bg-[#080C14]">
      <div className="mx-auto max-w-[375px] px-4 py-12 sm:max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <UpfaceLogo size="md" href={`${prefix}/`} variant="dark" />

          <p className="text-xs text-faint leading-relaxed max-w-xs">
            {locale === 'fr'
              ? 'Analyse faciale IA · Score d\'attractivité · Routine personnalisée'
              : 'AI facial analysis · Attractiveness score · Personalized routine'}
          </p>

          <div className="flex items-center gap-6">
            <Link href={`${prefix}/privacy`} className="text-xs text-faint hover:text-muted transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`${prefix}/terms`} className="text-xs text-faint hover:text-muted transition-colors">
              {t('terms')}
            </Link>
            <Link href="mailto:hello@upface.app" className="text-xs text-faint hover:text-muted transition-colors">
              {t('contact')}
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-[#1E2A3E] pt-6 text-center">
          <p className="text-[10px] text-faint tracking-wide">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
