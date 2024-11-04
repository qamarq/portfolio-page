import Link from 'next/link'
import React from 'react'
import { Icons } from './icons'

export default function Socials() {
    const SOCIALS = [
        {
            icon: Icons.Github,
            name: 'Kamil Marczak',
            link: 'https://github.com/qamarq'
        },
        {
            icon: Icons.LinkedIn,
            name: 'Kamil Marczak',
            link: 'https://www.linkedin.com/in/%F0%9F%94%A5-kamil-marczak-095b331a2/'
        },
        {
            icon: Icons.Discord,
            name: 'qamarq',
            link: 'https://discord.com/users/699587760729882641'
        },
        {
            icon: Icons.Gmail,
            name: 'km.wpwp.pl@gmail.com',
            link: 'mailto:km.wpwp.pl@gmail.com',
        }
    ]

    return (
        <div className="p-8">
            <h2 className="text-2xl font-cal">Socials & Accounts</h2>
            <p className="text-muted-foreground text-balance">Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.</p>

            <div className="mt-16 grid grid-cols-2 gap-6">
                {SOCIALS.map(social => (
                    <Link key={social.link} target="_blank" href={social.link} className="border p-4 flex items-center bg-background/30 hover:bg-rose-500/5 hover:text-rose-500 transition-all">
                        <social.icon className="w-4 h-4 mr-2" />
                        <span className="font-cal translate-y-[2px]">{social.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
