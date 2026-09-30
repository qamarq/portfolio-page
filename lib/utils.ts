import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cleanString = (str: string | null | undefined | number) => {
  if (!str) return ''
  return str
    .toString()
    .replace(/[0-9]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 49))
}
