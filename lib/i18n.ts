import { defineRouting } from 'next-intl/routing'
import { getRequestConfig } from 'next-intl/server'

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
})

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale
  const resolvedLocale = (locale && routing.locales.includes(locale as 'fr' | 'en'))
    ? locale
    : routing.defaultLocale

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  }
})
