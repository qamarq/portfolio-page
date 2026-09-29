import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { getTranslations } from 'next-intl/server'
import type { Project } from '@/lib/content'
import { Icons } from './icons'
import { BrowserFrame } from './browser-frame'

export async function ProjectCard({
  project,
  locale,
}: {
  project: Project
  locale: string
}) {
  const t = await getTranslations('Projects')

  return (
    <Link
      href={`/${locale}/project/${project.slug}`}
      className="group flex min-w-0 flex-col gap-[22px]"
    >
      <BrowserFrame
        url={project.url}
        fallback={project.title}
        className="transition-[border-color,transform] duration-[600ms] ease-soft group-hover:-translate-y-1 group-hover:border-faint"
        style={{ viewTransitionName: `project-${project.slug}-cover` }}
      >
        <Image
          src={project.cover}
          alt={t('screenshot', { title: project.title })}
          fill
          sizes="(min-width: 900px) 600px, 100vw"
          className="object-cover object-top transition-transform duration-1000 ease-soft group-hover:scale-[1.04]"
        />
      </BrowserFrame>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-5 gap-y-2.5">
        <p className="col-span-full flex flex-wrap gap-x-4 gap-y-2 font-mono text-[0.74rem] tracking-[0.06em] text-faint uppercase">
          <span>{project.type}</span>
          {project.org && <span>{project.org}</span>}
          {project.stat && <span className="text-accent">{project.stat}</span>}
        </p>
        <h3
          className="type-h3 text-[clamp(1.7rem,2.6vw,2.2rem)] font-[700] [font-stretch:115%]"
          style={{ viewTransitionName: `project-${project.slug}-title` }}
        >
          {project.title}
        </h3>
        <span
          aria-hidden
          className="grid size-[46px] place-items-center rounded-full border border-line transition-[background-color,border-color,color] duration-300 ease-soft group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg"
        >
          <Icons.ArrowUpRight className="size-[18px] transition-transform duration-500 ease-soft group-hover:rotate-45" />
        </span>
        <p className="col-span-full max-w-[52ch] text-muted">
          {project.description}
        </p>
        <Tags tags={project.tags} className="col-span-full mt-1" />
      </div>
    </Link>
  )
}

export function Tags({
  tags,
  className,
}: {
  tags: string[]
  className?: string
}) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className ?? ''}`}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-[7px] border border-line px-[9px] py-1 font-mono text-[0.72rem] text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}
