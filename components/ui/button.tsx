import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-[560] transition-[background-color,color,border-color,transform] duration-300 ease-soft active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300',
  {
    variants: {
      variant: {
        default: 'bg-fg text-bg hover:bg-accent hover:text-accent-fg',
        outline: 'border border-line hover:border-faint hover:bg-line-soft',
        ghost: 'text-muted hover:bg-line-soft hover:text-fg',
      },
      size: {
        default: 'h-[50px] px-[22px] text-[0.98rem]',
        sm: 'h-[38px] px-4 text-[0.9rem]',
        icon: 'size-[38px] [&_svg]:size-[18px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
