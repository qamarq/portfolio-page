'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme = 'dark' } = useTheme()

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps['theme']}
      position="bottom-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:rounded-full group-[.toaster]:border-line group-[.toaster]:bg-fg group-[.toaster]:text-bg group-[.toaster]:shadow-soft group-[.toaster]:font-[520]',
          description: 'group-[.toast]:text-faint',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
