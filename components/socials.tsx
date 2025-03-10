import Link from 'next/link'
import React from 'react'
import { Icons } from './icons'
import { MainPage } from '@/payload-types'

export default function Socials({ content }: { content: MainPage }) {
  const SOCIALS = [
    {
      icon: Icons.Github,
      name: 'Kamil Marczak',
      link: content.socials.githubLink,
    },
    {
      icon: Icons.LinkedIn,
      name: 'Kamil Marczak',
      link: content.socials.linkedInLink,
    },
    {
      icon: Icons.Discord,
      name: content.socials.discordName,
      link: `https://discord.com/users/${content.socials.discordId}`,
    },
    {
      icon: Icons.Gmail,
      name: content.socials.email,
      link: `mailto:${content.socials.email}`,
    },
  ]

  return (
    <div className="p-8">
      <h2 className="text-2xl font-cal">{content.socialsTitle}</h2>
      <p className="text-muted-foreground text-balance">
        {content.socialsDescription}
      </p>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {SOCIALS.map((social, index) => (
          <Link
            key={`${social.link}-${index}`}
            target="_blank"
            href={social.link}
            className="border p-4 flex items-center bg-background/30 hover:bg-rose-500/5 hover:text-rose-500 transition-all"
          >
            <social.icon className="w-4 h-4 mr-2" />
            <span className="font-cal translate-y-[2px]">{social.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
