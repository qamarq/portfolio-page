'use client'

import { useTheme } from 'next-themes'

export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return () => {
    const next = resolvedTheme === 'light' ? 'dark' : 'light'
    const apply = () => {
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(next)
      root.style.colorScheme = next
      setTheme(next)
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!document.startViewTransition || reduced.matches) apply()
    else document.startViewTransition(apply)
  }
}
