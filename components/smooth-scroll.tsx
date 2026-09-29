'use client'

import { ReactLenis } from 'lenis/react'
import { useEffect, useState } from 'react'

export function SmoothScroll() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(!query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  if (!enabled) return null
  return <ReactLenis root options={{ lerp: 0.11 }} />
}
