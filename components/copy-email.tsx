'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Icons } from './icons'

export function useCopyEmail(email: string) {
  const t = useTranslations('Contact')

  return async (selectFallback?: () => void) => {
    try {
      await navigator.clipboard.writeText(email)
      toast.success(t('copied'))
    } catch {
      selectFallback?.()
      toast(t('selected'))
    }
  }
}

export function CopyEmail({ email }: { email: string }) {
  const t = useTranslations('Contact')
  const textRef = useRef<HTMLSpanElement>(null)
  const copy = useCopyEmail(email)

  return (
    <button
      type="button"
      onClick={() =>
        copy(() => {
          if (!textRef.current) return
          const range = document.createRange()
          range.selectNodeContents(textRef.current)
          const selection = window.getSelection()
          selection?.removeAllRanges()
          selection?.addRange(range)
        })
      }
      className="group flex max-w-full cursor-pointer flex-col items-start gap-1.5 rounded-[18px] border border-line bg-panel px-[22px] py-5 text-left transition-[border-color,transform] duration-300 ease-soft hover:border-accent active:scale-[0.985]"
    >
      <span className="flex items-center gap-3 font-display text-[clamp(1.25rem,3.2vw,1.9rem)] leading-tight font-[650] tracking-[-0.03em] [font-stretch:110%] [overflow-wrap:anywhere]">
        <span ref={textRef}>{email}</span>
        <Icons.Copy className="size-5 shrink-0 text-faint transition-colors group-hover:text-accent" />
      </span>
      <span className="font-mono text-[0.72rem] tracking-[0.04em] text-faint">
        {t('copyHint')}
      </span>
    </button>
  )
}
