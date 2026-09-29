'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useLenis } from 'lenis/react'
import { usePathname } from '@/i18n/navigation'
import type { ComponentProps } from 'react'

type SectionLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  section: string
}

export const SCROLL_OFFSET = -88

export function useScrollToSection() {
  const lenis = useLenis()

  return (section: string) => {
    const target = section === 'top' ? 0 : document.getElementById(section)
    if (target === null) return false
    if (lenis) {
      lenis.scrollTo(target, { offset: section === 'top' ? 0 : SCROLL_OFFSET })
    } else if (typeof target === 'number') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    history.replaceState(
      null,
      '',
      section === 'top' ? window.location.pathname : `#${section}`
    )
    return true
  }
}

export function SectionLink({ section, onClick, ...props }: SectionLinkProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const scrollToSection = useScrollToSection()
  const isHome = pathname === '/'

  return (
    <Link
      href={section === 'top' ? `/${locale}` : `/${locale}#${section}`}
      onClick={(event) => {
        onClick?.(event)
        if (!isHome || event.metaKey || event.ctrlKey) return
        if (scrollToSection(section)) event.preventDefault()
      }}
      {...props}
    />
  )
}
