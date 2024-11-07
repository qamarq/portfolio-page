"use client"

import { Icons } from '@/components/icons'
import { serializeLexicalEditor } from '@/components/lexical-richtext-parser'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Project, User } from '@/payload-types'
import { useLivePreview } from '@payloadcms/live-preview-react'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import React, { useMemo } from 'react'
import { cleanString } from '@/lib/utils'

export default function ProjectTemplate({ project }: { project: Project }) {
    const { data } = useLivePreview({
        serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
        depth: 2,
        initialData: project,
    })

    const authors = useMemo(() => {
        if (data) {
            const authors = data.authors as unknown as User[]
            // const name = typeof data.author === 'object' ? data.author.name : ''
            // const avatar = typeof data.author === 'object' ? (typeof data.author.avatar === 'object' ? data.author.avatar?.url : '') : ''
            // return {
            //     name,
            //     avatar,
            //     intials: name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0],
            // }
            return authors.map((author) => {
                const name = typeof author === 'object' ? author.name : ''
                const avatar = typeof author === 'object' ? (typeof author.avatar === 'object' ? author.avatar?.url : '') : ''
                return {
                    name,
                    avatar,
                    intials: name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0],
                    link: author.socialLink || 'https://kamilmarczak.pl'
                }
            })
        } else {
            return []
        }
    }, [data])

    const html = useMemo(() => {
        return serializeLexicalEditor(data.content)
    }, [data])

    return (
        <div className='py-[76px] container mx-auto grid grid-cols-4 md:grid-cols-8 min-h-screen'>
            <div className='col-span-4 md:col-span-3 p-6 md:pr-12'>
                <Link href="/#projects"><Button size={"sm"} variant={"ghost"}><Icons.ArrowLeft className="w-4 h-4" />Back to Projects</Button></Link>

                <div className='mt-5 md:mt-10'>
                    <Image src={typeof data.heroImage === 'string' ? data.heroImage : data.heroImage.url || ''} width={1920} height={1080} alt={data.title} className='rounded-[0.5rem] border block md:hidden mb-5 w-full' />
                    <div className='flex flex-wrap gap-2'>
                        {/* {authors.map((author, index) => (
                            <div key={index} className='flex items-center mr-4'>
                                <div className='w-10 h-10 rounded-full overflow-hidden'>
                                    <Avatar>
                                        <AvatarImage src={author?.avatar || ''} />
                                        <AvatarFallback>{author?.intials}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className='ml-2'>
                                    <p className='text-sm font-inter font-medium'>{author.name}</p>
                                    <p className='text-xs font-inter text-gray-500'>Author</p>
                                </div>
                            </div>
                        ))} */}
                        {authors.map((author, index) => (
                            <Link key={index} href={author.link} target="_blank">
                                <Badge variant={"default"}>
                                    <Avatar className='w-4 h-4'>
                                        <AvatarImage src={author?.avatar || ''} />
                                        <AvatarFallback>{author?.intials}</AvatarFallback>
                                    </Avatar>
                                    <div className='ml-2'>
                                        <p className='text-sm font-medium font-cal translate-y-[1.5px]'>{author.name}</p>
                                    </div>
                                </Badge>
                            </Link>
                        ))}
                    </div>
                    <h1 style={{ viewTransitionName: `${cleanString(project.slug)}-title` }} className='text-5xl font-cal mt-7'>{data.title}</h1>
                    <p style={{ viewTransitionName: `${cleanString(project.slug)}-desc` }} className='mt-2 text-lg text-muted-foreground'>{data.shortDescription}</p>
                    <div className='mt-4 flex flex-wrap gap-2'>
                        {data.tags.map((tag, index) => (
                            <Badge key={index} variant={"outline"} style={{ viewTransitionName: `${cleanString(project.slug)}-badge-${cleanString(index)}` }}>{tag}</Badge>
                        ))}
                    </div>

                    <div className='flex items-center flex-wrap gap-2 border-t mt-7 py-7'>
                        {data.githubLink && (
                            <Link href={data.githubLink} target='_blank'>
                                <Button size={"sm"}>
                                    <Icons.Github className='w-5 h-5' />
                                    Github repository
                                </Button>
                            </Link>
                        )}
                        {!data.githubLink && (
                            <Button size={"sm"} disabled>
                                <Icons.Github className='w-5 h-5' />
                                Github repository
                            </Button>
                        )}

                        {data.previewUrl && (
                            <Link href={data.previewUrl} target='_blank'>
                                <Button size={"sm"}>
                                    <Icons.Globe className='w-5 h-5' />
                                    Live website
                                </Button>
                            </Link>
                        )}
                        {!data.previewUrl && (
                            <Button size={"sm"} disabled>
                                <Icons.Globe className='w-5 h-5' />
                                Live website
                            </Button>
                        )}
                    </div>
                    {(!data.githubLink || !data.previewUrl) && (
                        <p className='text-xs text-muted-foreground opacity-40'>If button is disabled it means that the link is not provided.</p>
                    )}
                </div>
            </div>
            <div className='col-span-4 md:col-span-5 px-6 md:p-6 md:pl-12 md:border-l'>
                <Image src={typeof data.heroImage === 'string' ? data.heroImage : data.heroImage.url || ''} width={1920} height={1080} alt={data.title} style={{ viewTransitionName: `${cleanString(project.slug)}-image` }} className='rounded-[0.5rem] border hidden md:block object-cover' />
                <div className='space-y-2 md:mt-10'>
                    {html}
                </div>
            </div>
        </div>
    )
}
