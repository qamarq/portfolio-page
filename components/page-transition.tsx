import { ViewTransition, type ReactNode } from 'react'

const directional = {
  'nav-forward': 'nav-forward',
  'nav-back': 'nav-back',
  locale: 'locale-fade',
  default: 'none',
}

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={directional} exit={directional} default="none">
      {children}
    </ViewTransition>
  )
}

export function Morph({
  name,
  children,
}: {
  name: string
  children: ReactNode
}) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  )
}
