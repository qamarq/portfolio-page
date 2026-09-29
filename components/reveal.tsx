'use client'

import { createElement, useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

type RevealProps = {
  as?: 'div' | 'li' | 'header' | 'section'
  delay?: number
  className?: string
  id?: string
  children: ReactNode
}

export function Reveal({
  as = 'div',
  delay,
  className,
  id,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Content already on screen stays put; only what is below the fold animates in.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return

    element.dataset.reveal = ''
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        element.dataset.reveal = 'in'
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return createElement(
    as,
    {
      ref,
      id,
      className,
      style: delay ? ({ '--delay': `${delay}s` } as CSSProperties) : undefined,
    },
    children
  )
}
