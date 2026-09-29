'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { routing } from '@/i18n/routing'

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)

function localizedPath(locale: string) {
  return `/${locale}${window.location.pathname.replace(LOCALE_PREFIX, '')}`
}

export function useSwitchLocale() {
  const router = useRouter()

  const switchLocale = useCallback(
    (locale: string) => {
      router.replace(localizedPath(locale), {
        scroll: false,
        transitionTypes: ['locale'],
      })
    },
    [router]
  )

  const prefetchLocale = useCallback(
    (locale: string) => router.prefetch(localizedPath(locale)),
    [router]
  )

  return { switchLocale, prefetchLocale }
}
