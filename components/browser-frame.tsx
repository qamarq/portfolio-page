import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function BrowserFrame({
  url,
  fallback,
  ratio = 'aspect-[16/10]',
  className,
  style,
  children,
}: {
  url?: string
  fallback: string
  ratio?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const label = url
    ? url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : fallback

  return (
    <div
      className={cn(
        'frame-timeline overflow-hidden rounded-[18px] border border-line bg-panel shadow-soft',
        className
      )}
      style={style}
    >
      <div className="flex items-center gap-1.5 border-b border-line px-3.5 py-2.5">
        <i className="frame-dot" />
        <i className="frame-dot" />
        <i className="frame-dot" />
        <span className="mx-auto max-w-[60%] -translate-x-4 truncate rounded-md bg-bg-2 px-2.5 py-[3px] font-mono text-[0.7rem] text-faint">
          {label}
        </span>
      </div>
      <div className={cn('relative overflow-hidden bg-bg-2', ratio)}>
        {children}
      </div>
    </div>
  )
}
