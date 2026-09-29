import * as React from 'react'

import { cn } from '@/lib/utils'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'min-h-[140px] w-full resize-y rounded-xl border border-line bg-bg px-3.5 py-3 text-base text-fg transition-[border-color,box-shadow] placeholder:text-faint focus-visible:border-accent focus-visible:shadow-[0_0_0_4px_var(--accent-soft)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
