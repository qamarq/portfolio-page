'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/button'
import { Icons } from './icons'
import NumberTicker from './ui/number-ticker'

export default function GithubStarBtn({
  stars,
  className,
}: {
  stars: number
  className?: string
}) {
  return (
    <Link
      className={cn(
        buttonVariants({
          variant: 'rainbow',
          size: 'sm',
        }),
        'inline-flex',
        className
      )}
      target="_blank"
      href={'https://github.com/qamarq/portfolio-page'}
    >
      <div className="flex items-center">
        <Icons.Github />
        <span className="ml-1 lg:hidden">Star</span>
        <span className="ml-1 hidden lg:inline">Star on GitHub</span>{' '}
      </div>
      <div className="ml-2 flex items-center gap-1 text-sm md:flex">
        <Icons.Star className="size-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300" />
        <NumberTicker
          value={stars}
          className="font-display font-medium text-white dark:text-black"
        />
      </div>
    </Link>
  )
}
