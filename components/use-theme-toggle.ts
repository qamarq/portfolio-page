'use client'

import { useTheme } from 'next-themes'

export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (origin?: Element) => {
    const next = resolvedTheme === 'light' ? 'dark' : 'light'
    const root = document.documentElement
    const apply = () => {
      root.classList.remove('light', 'dark')
      root.classList.add(next)
      root.style.colorScheme = next
      setTheme(next)
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!document.startViewTransition || reduced.matches) {
      apply()
      return
    }

    const rect = origin?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    root.toggleAttribute('data-theme-switch', true)
    const transition = document.startViewTransition(apply)
    transition.ready
      .then(() =>
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 650,
            easing: 'cubic-bezier(0.6, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        )
      )
      .catch(() => {})
    transition.finished.finally(() =>
      root.toggleAttribute('data-theme-switch', false)
    )
  }
}
