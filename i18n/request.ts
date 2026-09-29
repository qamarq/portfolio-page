import * as rootParams from 'next/root-params'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from './routing'

export default getRequestConfig(async () => {
  const locale = await rootParams.locale()
  if (!hasLocale(routing.locales, locale)) notFound()

  return {
    locale,
    timeZone: 'Europe/Warsaw',
    messages: (await import(`@/messages/${locale}.json`)).default,
  }
})
