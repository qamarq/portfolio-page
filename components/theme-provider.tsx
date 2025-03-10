'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from 'next-themes'
import { GoogleAnalytics } from 'nextjs-google-analytics'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <GoogleAnalytics />
    </NextThemesProvider>
  )
}
