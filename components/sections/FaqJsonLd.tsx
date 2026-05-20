import { getTranslations } from 'next-intl/server'
import { FAQ_KEYS } from '@/lib/faq'

export default async function FaqJsonLd() {
  const t = await getTranslations('faq')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map((key) => ({
      '@type': 'Question',
      name: t(`${key}_question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`${key}_answer`),
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
