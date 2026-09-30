'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import type { ComponentProps } from 'react'

type SectionLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  section: string
}

function findVisible(id: string) {
  const element = document.getElementById(id)
  return element?.checkVisibility() ? element : null
}

export function useScrollToSection() {
  return (section: string) => {
    const element = findVisible(section)
    if (!element) return false
    const top = section === 'top'
    if (top) window.scrollTo({ top: 0, behavior: 'smooth' })
    else element.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(
      null,
      '',
      top ? window.location.pathname : `#${section}`
    )
    return true
  }
}

export function SectionLink({ section, onClick, ...props }: SectionLinkProps) {
  const locale = useLocale()
  const scrollToSection = useScrollToSection()

  return (
    <Link
      href={section === 'top' ? `/${locale}` : `/${locale}#${section}`}
      transitionTypes={['nav-back']}
      onClick={(event) => {
        onClick?.(event)
        if (event.metaKey || event.ctrlKey) return
        if (scrollToSection(section)) event.preventDefault()
      }}
      {...props}
    />
  )
}
