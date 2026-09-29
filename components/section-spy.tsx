'use client'

import { useEffect, useSyncExternalStore } from 'react'

let activeSection: string | null = null
const listeners = new Set<() => void>()

function setActiveSection(next: string | null) {
  if (next === activeSection) return
  activeSection = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useActiveSection() {
  return useSyncExternalStore(
    subscribe,
    () => activeSection,
    () => null
  )
}

export function SectionSpy() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActiveSection(entry.target.id === 'top' ? null : entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    for (const id of ['top', 'projects', 'experience', 'contact']) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => {
      observer.disconnect()
      setActiveSection(null)
    }
  }, [])

  return null
}
