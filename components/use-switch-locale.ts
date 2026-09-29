'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { routing } from '@/i18n/routing'

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`)

export function useSwitchLocale() {
  const router = useRouter()

  return useCallback(
    (locale: string) => {
      const { pathname, hash } = window.location
      router.replace(`/${locale}${pathname.replace(LOCALE_PREFIX, '')}${hash}`)
    },
    [router]
  )
}
