'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Icons } from './icons'

export function useCopyEmail(email: string) {
  const t = useTranslations('Contact')

  return async (selectFallback?: () => void) => {
    try {
      await navigator.clipboard.writeText(email)
      toast.success(t('copied'))
      return true
    } catch {
      selectFallback?.()
      toast(t('selected'))
      return false
    }
  }
}

export function CopyEmail({ email }: { email: string }) {
  const t = useTranslations('Contact')
  const textRef = useRef<HTMLSpanElement>(null)
  const copy = useCopyEmail(email)
  const [copied, setCopied] = useState(0)

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(0), 1800)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copy(() => {
          if (!textRef.current) return
          const range = document.createRange()
          range.selectNodeContents(textRef.current)
          const selection = window.getSelection()
          selection?.removeAllRanges()
          selection?.addRange(range)
        })
        if (ok) setCopied(Date.now())
      }}
      className="group flex max-w-full cursor-pointer flex-col items-start gap-1.5 rounded-[18px] border border-line bg-panel px-[22px] py-5 text-left transition-[border-color,transform] duration-300 ease-soft hover:border-accent active:scale-[0.985]"
    >
      <span className="flex items-center gap-3 font-display text-[clamp(1.25rem,3.2vw,1.9rem)] leading-tight font-[650] tracking-[-0.03em] [font-stretch:110%] [overflow-wrap:anywhere]">
        <span ref={textRef}>{email}</span>
        <span aria-hidden className="relative grid size-5 shrink-0">
          <Icons.Copy
            className={cn(
              'size-5 text-faint transition-[color,opacity,scale] duration-300 ease-soft group-hover:text-accent',
              copied && 'scale-50 opacity-0'
            )}
          />
          <Icons.Check
            className={cn(
              'absolute inset-0 size-5 text-ok transition-[opacity,scale] duration-500 ease-spring',
              !copied && 'scale-50 opacity-0'
            )}
          />
        </span>
      </span>
      <span className="font-mono text-[0.72rem] tracking-[0.04em] text-faint">
        {t('copyHint')}
      </span>
    </button>
  )
}
