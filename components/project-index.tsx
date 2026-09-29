'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Icons } from './icons'
import { Morph } from './page-transition'

type Row = {
  slug: string
  title: string
  type: string
  tags: string[]
  cover: string
}

export function ProjectIndex({
  rows,
  locale,
  labels,
}: {
  rows: Row[]
  locale: string
  labels: { project: string; type: string; stack: string }
}) {
  const peekRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const [active, setActive] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (min-width: 900px)'
    )
    const update = () => setEnabled(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled || !active) return
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    let frame = 0
    const loop = () => {
      const ease = reduced ? 1 : 0.16
      current.current.x += (target.current.x - current.current.x) * ease
      current.current.y += (target.current.y - current.current.y) * ease
      const tilt = Math.max(
        -6,
        Math.min(6, (target.current.x - current.current.x) * 0.06)
      )
      if (peekRef.current) {
        peekRef.current.style.transform = `translate3d(${current.current.x + 28}px, ${current.current.y - 110}px, 0) rotate(${tilt}deg)`
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [enabled, active])

  return (
    <>
      <div
        aria-hidden
        className="hidden grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_28px] gap-6 pb-3 label text-[0.7rem] min-[900px]:grid"
      >
        <span>{labels.project}</span>
        <span>{labels.type}</span>
        <span>{labels.stack}</span>
        <span />
      </div>
      <ul className="border-t border-line">
        {rows.map((row) => (
          <li key={row.slug} className="scroll-in relative isolate">
            <Link
              href={`/${locale}/project/${row.slug}`}
              prefetch={true}
              transitionTypes={['nav-forward']}
              onMouseEnter={(event) => {
                if (!enabled) return
                target.current = { x: event.clientX, y: event.clientY }
                if (!active) current.current = { ...target.current }
                setActive(row.slug)
              }}
              onMouseMove={(event) => {
                target.current = { x: event.clientX, y: event.clientY }
              }}
              onMouseLeave={() => setActive(null)}
              className="group relative grid grid-cols-[72px_minmax(0,1fr)_28px] items-center gap-x-4 gap-y-1 border-b border-line py-4 before:absolute before:inset-y-0 before:-inset-x-4 before:-z-10 before:scale-y-[0.6] before:rounded-xl before:bg-line-soft before:opacity-0 before:transition-[opacity,transform] before:duration-300 before:ease-soft hover:before:scale-y-100 hover:before:opacity-100 min-[900px]:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)_minmax(0,1.2fr)_28px] min-[900px]:gap-6 min-[900px]:py-[26px]"
            >
              <Image
                src={row.cover}
                alt=""
                width={144}
                height={108}
                className="row-span-2 aspect-[4/3] w-[72px] rounded-lg border border-line object-cover object-top min-[900px]:hidden"
              />
              <Morph name={`project-${row.slug}-title`}>
                <span className="type-h3 w-fit text-[1.3rem] font-[680] transition-transform duration-500 ease-soft group-hover:translate-x-2 min-[900px]:text-[clamp(1.4rem,2.2vw,1.9rem)]">
                  {row.title}
                </span>
              </Morph>
              <span className="col-start-2 text-[0.88rem] text-muted min-[900px]:col-start-auto min-[900px]:text-[0.95rem]">
                {row.type}
              </span>
              <span className="hidden font-mono text-[0.78rem] text-faint min-[900px]:block">
                {row.tags.slice(0, 3).join(' · ')}
              </span>
              <Icons.ArrowRight className="col-start-3 row-span-2 row-start-1 size-[18px] text-faint transition-[transform,color] duration-500 ease-soft group-hover:translate-x-1 group-hover:text-accent min-[900px]:col-start-auto min-[900px]:row-span-1 min-[900px]:row-start-auto min-[900px]:justify-self-end" />
            </Link>
          </li>
        ))}
      </ul>
      {enabled && (
        <div
          ref={peekRef}
          aria-hidden
          className={cn(
            'pointer-events-none fixed top-0 left-0 z-40 aspect-[16/10] w-[340px] overflow-hidden rounded-[14px] border border-line bg-panel shadow-soft transition-[opacity,scale] duration-300 ease-soft will-change-transform',
            active ? 'scale-100 opacity-100' : 'scale-[0.85] opacity-0'
          )}
        >
          {rows.map((row) => (
            <Image
              key={row.slug}
              src={row.cover}
              alt=""
              fill
              sizes="340px"
              className={cn(
                'object-cover object-top transition-opacity duration-300',
                active === row.slug ? 'opacity-100' : 'opacity-0'
              )}
            />
          ))}
        </div>
      )}
    </>
  )
}
