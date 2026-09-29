'use client'

import { useEffect, useRef, useState } from 'react'
import { useFormatter, useTranslations } from 'next-intl'

const DAY = 86_400_000

export function GithubHeatmap({
  start,
  counts,
  thresholds,
}: {
  start: string
  counts: number[]
  thresholds: [number, number, number]
}) {
  const t = useTranslations('Github')
  const format = useFormatter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(
    null
  )

  const startTime = new Date(`${start}T12:00:00Z`).getTime()
  const lead = new Date(startTime).getUTCDay()
  const weeks = Math.ceil((counts.length + lead) / 7)
  const [low, mid, high] = thresholds
  const level = (count: number) =>
    count === 0
      ? 0
      : count <= low
        ? 1
        : count <= mid
          ? 2
          : count <= high
            ? 3
            : 4
  const dateOf = (index: number) => new Date(startTime + index * DAY)
  const weekdays = [1, 3, 5].map((day) =>
    format
      .dateTime(new Date(Date.UTC(2024, 0, 7 + day)), {
        weekday: 'short',
        timeZone: 'UTC',
      })
      .replace('.', '')
  )

  const months = counts.flatMap((_, index) => {
    const date = dateOf(index)
    if (date.getUTCDate() !== 1) return []
    return [
      {
        column: Math.floor((index + lead) / 7) + 1,
        label: format
          .dateTime(date, { month: 'short', timeZone: 'UTC' })
          .replace('.', ''),
      },
    ]
  })

  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollLeft = element.scrollWidth
  }, [])

  useEffect(() => {
    if (!tip) return
    const hide = () => setTip(null)
    window.addEventListener('scroll', hide, { passive: true })
    return () => window.removeEventListener('scroll', hide)
  }, [tip])

  const show = (index: number, element: HTMLElement) => {
    const count = counts[index]
    const date = format.dateTime(dateOf(index), {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
    const rect = element.getBoundingClientRect()
    setTip({
      x: Math.min(
        Math.max(rect.left + rect.width / 2, 110),
        window.innerWidth - 110
      ),
      y: rect.top,
      text: count === 0 ? t('none', { date }) : t('cell', { count, date }),
    })
  }

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={() => setTip(null)}
        className="overflow-x-auto pb-1.5 [scrollbar-width:thin]"
      >
        <div className="grid min-w-[720px] grid-cols-[28px_minmax(0,1fr)] grid-rows-[auto_auto] gap-x-1.5 gap-y-2">
          <div
            aria-hidden
            className="col-start-2 grid gap-[3px] font-mono text-[0.68rem] text-faint"
            style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
          >
            {months.map((month) => (
              <span
                key={month.column}
                className="row-start-1 whitespace-nowrap"
                style={{ gridColumn: `${month.column} / span 4` }}
              >
                {month.label}
              </span>
            ))}
          </div>
          <div
            aria-hidden
            className="col-start-1 row-start-2 grid grid-rows-7 items-center gap-[3px] font-mono text-[0.64rem] text-faint"
          >
            <span />
            <span>{weekdays[0]}</span>
            <span />
            <span>{weekdays[1]}</span>
            <span />
            <span>{weekdays[2]}</span>
            <span />
          </div>
          <div
            role="img"
            aria-label={t('label', {
              total: counts.reduce((a, b) => a + b, 0),
            })}
            onPointerLeave={() => setTip(null)}
            className="col-start-2 row-start-2 grid grid-flow-col grid-rows-7 gap-[3px]"
            style={{ gridAutoColumns: 'minmax(0, 1fr)' }}
          >
            {Array.from({ length: lead }, (_, index) => (
              <i key={`lead-${index}`} className="invisible" />
            ))}
            {counts.map((count, index) => (
              <i
                key={index}
                onPointerEnter={(event) => show(index, event.currentTarget)}
                className={`heat-${level(count)} block aspect-square rounded-[3px] hover:outline-[1.5px] hover:outline-offset-1 hover:outline-fg ${index === counts.length - 1 ? 'shadow-[inset_0_0_0_1.5px_var(--fg)]' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
      {tip && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-[70] -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg bg-fg px-2.5 py-[7px] text-[0.8rem] font-[520] whitespace-nowrap text-bg shadow-soft after:absolute after:bottom-[-4px] after:left-1/2 after:size-2 after:-translate-x-1/2 after:rotate-45 after:bg-fg"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.text}
        </div>
      )}
    </>
  )
}
