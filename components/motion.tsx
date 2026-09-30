'use client'

import { useEffect } from 'react'
import {
  REVEAL_SELECTOR,
  SCROLLED_OFFSET,
  revealOnEnter,
  trackScrollState,
} from '@/lib/motion'

export function Motion() {
  useEffect(() => revealOnEnter(REVEAL_SELECTOR), [])
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(${trackScrollState})(${SCROLLED_OFFSET})`,
      }}
    />
  )
}
