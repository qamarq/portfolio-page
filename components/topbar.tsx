import React from 'react'
import { Icons } from './icons'
import GithubStarBtn from './github-star'
import Link from 'next/link'
import { Button } from './ui/button'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { headers } from 'next/headers'

export default async function Topbar() {
  const payload = await getPayloadHMR({ config })
  const { user } = await payload.auth({ headers: await headers() })
  let stars = 0

  try {
    const response = await fetch(
      'https://api.github.com/repos/qamarq/portfolio-page',
      {
        headers: process.env.GITHUB_OAUTH_TOKEN
          ? {
              Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
              'Content-Type': 'application/json',
            }
          : {},
        next: {
          revalidate: 3600,
        },
      }
    )

    if (response.ok) {
      const data = await response.json()
      stars = data.stargazers_count || stars // Update stars if API response is valid
    }
  } catch (error) {
    console.log('Error fetching GitHub stars:', error)
  }

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-[12px] border-b z-50 bg-black/30">
      <div className="container mx-auto p-5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Icons.Logo className="w-7 h-7" />
          <h1 className="font-cal translate-y-[2px] text-2xl">
            Kamil{' '}
            <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
              Marczak
            </span>
          </h1>
        </Link>
        <div className="flex items-center justify-end gap-2">
          <Link href="#projects" className="hidden lg:flex">
            <Button size={'sm'} variant={'ghost'}>
              My projects
            </Button>
          </Link>
          <Link href="#contact" className="hidden lg:flex">
            <Button size={'sm'} variant={'ghost'}>
              Contact me
            </Button>
          </Link>
          {user && (
            <Link href="/admin">
              <Button size={'sm'} variant={'ghost'}>
                Dashboard
              </Button>
            </Link>
          )}
          <GithubStarBtn stars={stars} />
        </div>
      </div>
    </header>
  )
}
