import { Project } from '@/payload-types'
import React from 'react'
import Image from 'next/image'
import { Badge } from './ui/badge'
import { Link } from 'next-view-transitions'
import { cleanString, cn } from '@/lib/utils'
import { Skeleton } from './ui/skeleton'

export default function ProjectCard({ project } : { project: Project }) {
    return (
        <Link href={`/project/${project.slug}`} style={{"--hero-width": "calc(100%)", "--project-id": project.id} as React.CSSProperties} className='relative horizontal-line after:top-0 group'>
            <div className='relative z-10 h-full flex flex-col'>
                <div className="vertical-line z-10"></div>
                <div className='relative horizontal-line overflow-hidden bg-white/10'>
                    <Image 
                        style={{ viewTransitionName: `${cleanString(project.slug)}-image` }}
                        src={typeof project.heroImage === 'string' ? project.heroImage : project.heroImage.url!} 
                        alt={project.title} 
                        width={512} 
                        height={512} 
                        className={cn(
                            'w-full h-60 object-cover group-hover:scale-90 transition-all object-left-top transition-item'
                        )}
                    />
                </div>
                <div className='p-6 relative horizontal-line bg-background/40 backdrop-blur-sm grow flex flex-col'>
                    <h1 style={{ viewTransitionName: `${cleanString(project.slug)}-title` }} className='font-cal text-2xl text-black dark:text-white group-hover:text-rose-500 transition-all'>{project.title}</h1>
                    <p style={{ viewTransitionName: `${cleanString(project.slug)}-desc` }} className='text-muted-foreground text-base text-balance'>{project.shortDescription}</p>
                    <div className='flex items-center flex-wrap mt-5 gap-2'>
                        {project.tags.map((tag, index) => (
                            <Badge key={tag} variant={'default'} style={{ viewTransitionName: `${cleanString(project.slug)}-badge-${cleanString(index)}` }}>{tag}</Badge>
                        ))}
                    </div>
                </div>
                <div className="vertical-line !left-[unset] right-0"></div>
            </div>
            <div className='absolute bottom-1/2 left-0 top-0 h-full w-full opacity-0 blur-[180px] [background-image:linear-gradient(to_bottom,#f43f5e,#f43f5e,transparent_40%)] animate-image-glow'></div>
        </Link>
    )
}

export const ProjectCardPlaceholder = () => {
    return (
        <div style={{"--hero-width": "calc(100%)"} as React.CSSProperties} className='relative horizontal-line after:top-0 group'>
            <div className='relative z-10 h-full flex flex-col'>
                <div className="vertical-line z-10"></div>
                <div className='relative horizontal-line overflow-hidden bg-white/10'>
                    <Skeleton className='w-full h-60 bg-background' />
                </div>
                <div className='p-6 relative horizontal-line bg-background/40 backdrop-blur-sm grow flex flex-col'>
                    <Skeleton className='h-7 w-36 rounded-[0.5rem] mb-3' />
                    <Skeleton className='h-4 w-full rounded-[0.5rem] mt-1' />
                    <Skeleton className='h-4 w-3/4 rounded-[0.5rem] mt-1' />
                    <div className='flex items-center flex-wrap mt-5 gap-2'>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Badge key={index} variant={'default'} className='animate-pulse'><Skeleton className='w-10 h-3 rounded-[1rem]' /></Badge>
                        ))}
                    </div>
                </div>
                <div className="vertical-line !left-[unset] right-0"></div>
            </div>
            <div className='absolute bottom-1/2 left-0 top-0 h-full w-full opacity-0 blur-[180px] [background-image:linear-gradient(to_bottom,#f43f5e,#f43f5e,transparent_40%)] animate-image-glow'></div>
        </div>
    )
}