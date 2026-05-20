import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/i18n'
import FaqJsonLd from '@/components/sections/FaqJsonLd'
import '../globals.css'

export const metadata: Metadata = {
  title: {
    default: 'UPFACE — Analyse faciale IA',
    template: '%s | UPFACE',
  },
  description: 'Notre IA analyse 47 points de votre visage en 8 secondes. Score précis, routine personnalisée.',
  icons: {
    icon: '/upface-wordmark.png',
    apple: '/upface-wordmark.png',
  },
  openGraph: {
    siteName: 'UPFACE',
    type: 'website',
  },
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

function isLandingPath(pathname: string) {
  return pathname === '/' || pathname === '/en'
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound()
  }

  const messages = await getMessages()
  const pathname = (await headers()).get('x-url-path') ?? ''
  const showFaqJsonLd = isLandingPath(pathname)

  return (
    <html lang={locale} className="dark">
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@800&display=swap"
          rel="stylesheet"
        />
        {showFaqJsonLd && <FaqJsonLd />}
      </head>
      <body className="bg-[#080C14] text-[#EEF2FF] antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
