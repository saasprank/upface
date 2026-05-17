import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  return (
    <footer className="border-t border-[rgba(59,130,246,0.10)] bg-[#080C14]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div style={{ mixBlendMode: 'screen', display: 'inline-block', lineHeight: 0 }}>
              <Image src="/logo.png" alt="UPFACE" width={30} height={30} style={{ display: 'block' }} />
            </div>
            <span className="font-bold text-[#EEF2FF]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
              UPFACE
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href={`${prefix}/privacy`} className="text-sm text-[#3D4F6E] hover:text-[#8B9DC3] transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`${prefix}/terms`} className="text-sm text-[#3D4F6E] hover:text-[#8B9DC3] transition-colors">
              {t('terms')}
            </Link>
            <Link href={`mailto:hello@upface.app`} className="text-sm text-[#3D4F6E] hover:text-[#8B9DC3] transition-colors">
              {t('contact')}
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.04)] text-center">
          <p className="text-xs text-[#3D4F6E]">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}

