import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cleanString = (str: string | null | undefined | number) => {
  if (!str) return ''
  // Replace all numbers in string with alphabet letters for example 0 -> a, 1 -> b, 2 -> c, 3 -> d, 4 -> e, 5 -> f, 6 -> g, 7 -> h, 8 -> i, 9 -> j
  return str
    .toString()
    .replace(/[0-9]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 49))
}
