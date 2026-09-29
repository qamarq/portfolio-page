'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

type RevealProps = {
  as?: 'div' | 'li' | 'header' | 'section'
  delay?: number
  className?: string
  id?: string
  children: ReactNode
}

export function Reveal({
  as: Tag = 'div',
  delay,
  className,
  id,
  children,
}: RevealProps) {
  const [element, setElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!element || element.getAttribute('data-reveal') === 'in') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Content already on screen stays put; only what is below the fold animates in.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return

    element.setAttribute('data-reveal', '')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        element.setAttribute('data-reveal', 'in')
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])

  return (
    <Tag
      ref={setElement}
      id={id}
      className={className}
      style={delay ? ({ '--delay': `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
