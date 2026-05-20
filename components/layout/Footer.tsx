'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import UpfaceLogo from '@/components/ui/UpfaceLogo'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  return (
    <footer
      className="border-t"
      style={{
        borderColor: 'rgba(59,130,246,0.08)',
      }}
    >
      <div className="max-w-[375px] sm:max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center gap-6">
          <UpfaceLogo size="md" href={`${prefix}/`} />

          <p className="text-xs text-[#3D4F6E] leading-relaxed max-w-xs">
            {locale === 'fr'
              ? 'Analyse faciale IA · Score d\'attractivité · Routine personnalisée'
              : 'AI facial analysis · Attractiveness score · Personalized routine'}
          </p>

          <div className="flex items-center gap-6">
            <Link href={`${prefix}/privacy`} className="text-xs text-[#3D4F6E] hover:text-[#8B9DC3] transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`${prefix}/terms`} className="text-xs text-[#3D4F6E] hover:text-[#8B9DC3] transition-colors">
              {t('terms')}
            </Link>
            <Link href="mailto:hello@upface.app" className="text-xs text-[#3D4F6E] hover:text-[#8B9DC3] transition-colors">
              {t('contact')}
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.04)] text-center">
          <p className="text-[10px] text-[#3D4F6E] tracking-wide">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
