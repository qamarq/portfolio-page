import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import * as rootParams from 'next/root-params'
import { Suspense, ViewTransition } from 'react'
import { hasLocale } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { getProject, getProjects } from '@/lib/content'
import { BrowserFrame } from '@/components/browser-frame'
import { Tags } from '@/components/project-card'
import { MarkdownContent } from '@/components/markdown'
import { Icons } from '@/components/icons'
import { Morph, PageTransition } from '@/components/page-transition'

export async function generateStaticParams() {
  const locale = await rootParams.locale()
  if (!hasLocale(routing.locales, locale)) return []
  const projects = await getProjects(locale)
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/project/[slug]'>): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()])
  const project = await getProject(locale, slug)
  if (!project) return {}

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `https://kamilmarczak.pl/${locale}/project/${slug}`,
      languages: {
        en: `https://kamilmarczak.pl/en/project/${slug}`,
        pl: `https://kamilmarczak.pl/pl/project/${slug}`,
      },
    },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `https://kamilmarczak.pl/${locale}/project/${slug}`,
      siteName: 'Kamil Marczak - Full-Stack Web Developer',
      images: [{ url: project.cover, alt: project.title }],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      site: '@kamilmarczak',
      creator: '@qamarq_',
      creatorId: '1403301074602270720',
      images: [project.cover],
    },
  }
}

export default async function ProjectPage({
  params,
}: PageProps<'/[locale]/project/[slug]'>) {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations('Project'),
  ])

  return (
    <PageTransition>
      <article className="pt-[clamp(112px,14vw,150px)] pb-[clamp(80px,10vw,140px)]">
        <div className="wrap">
          <Link
            href={`/${locale}#projects`}
            transitionTypes={['nav-back']}
            className="group inline-flex items-center gap-2 rounded-full border border-line py-2 pr-3.5 pl-2.5 text-[0.92rem] text-muted transition-colors hover:border-faint hover:text-fg"
          >
            <Icons.ArrowLeft className="size-4 transition-transform duration-300 ease-soft group-hover:-translate-x-[3px]" />
            {t('back')}
          </Link>
          <Suspense
            fallback={
              <ViewTransition exit="slide-down" default="none">
                <ProjectSkeleton />
              </ViewTransition>
            }
          >
            <ViewTransition enter="slide-up" default="none">
              <ProjectDetails params={params} />
            </ViewTransition>
          </Suspense>
        </div>
      </article>
    </PageTransition>
  )
}

async function ProjectDetails({
  params,
}: Pick<PageProps<'/[locale]/project/[slug]'>, 'params'>) {
  const [{ slug }, locale, t, tProjects] = await Promise.all([
    params,
    getLocale(),
    getTranslations('Project'),
    getTranslations('Projects'),
  ])
  const projects = await getProjects(locale)
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1) notFound()

  const project = projects[index]
  const next = projects[(index + 1) % projects.length]
  const meta = [
    { label: t('type'), value: project.type },
    { label: t('role'), value: project.role },
    project.period && { label: t('period'), value: project.period },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div>
      <header className="mt-11 mb-12 grid gap-[22px]">
        <p className="eyebrow">
          {project.type}
          {project.org && ` · ${project.org}`}
        </p>
        <Morph name={`project-${project.slug}-title`}>
          <h1 className="type-display w-fit max-w-full text-[clamp(2.8rem,8vw,6.6rem)]">
            {project.title}
          </h1>
        </Morph>
        <p className="lead">{project.description}</p>
      </header>

      <Morph name={`project-${project.slug}-cover`}>
        <BrowserFrame
          url={project.url}
          fallback={project.title}
          ratio="aspect-[16/9]"
        >
          <div className="scroll-parallax absolute inset-x-0 -inset-y-[6%]">
            <Image
              src={project.cover}
              alt={tProjects('screenshot', { title: project.title })}
              fill
              priority
              sizes="(min-width: 1280px) 1240px, 100vw"
              className="object-cover object-top"
            />
          </div>
        </BrowserFrame>
      </Morph>

      <div className="mt-14 grid gap-12 min-[900px]:grid-cols-[minmax(0,280px)_minmax(0,1fr)] min-[900px]:gap-[clamp(40px,6vw,96px)]">
        <dl className="self-start border-t border-line min-[900px]:sticky min-[900px]:top-[110px]">
          {meta.map((item) => (
            <div
              key={item.label}
              className="grid gap-2 border-b border-line py-4"
            >
              <dt className="label">{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
          <div className="grid gap-2 border-b border-line py-4">
            <dt className="label">{t('stack')}</dt>
            <dd>
              <Tags tags={project.tags} />
            </dd>
          </div>
          {(project.url || project.repo) && (
            <div className="grid gap-2 border-b border-line py-4">
              <dt className="label">{t('links')}</dt>
              <dd className="flex flex-col gap-2">
                {project.url && (
                  <ExternalButton href={project.url} label={t('live')}>
                    <Icons.ArrowUpRight />
                  </ExternalButton>
                )}
                {project.repo && (
                  <ExternalButton href={project.repo} label={t('repo')}>
                    <Icons.github />
                  </ExternalButton>
                )}
              </dd>
            </div>
          )}
        </dl>
        <MarkdownContent>{project.body}</MarkdownContent>
      </div>

      {next.slug !== project.slug && (
        <Link
          href={`/${locale}/project/${next.slug}`}
          prefetch={true}
          transitionTypes={['nav-forward']}
          className="group scroll-in mt-[clamp(72px,9vw,120px)] grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 border-t border-line pt-7"
        >
          <div>
            <p className="eyebrow mb-2.5">{t('next')}</p>
            <strong className="type-display block text-[clamp(2rem,5vw,3.6rem)] leading-none transition-colors duration-300 group-hover:text-accent [font-stretch:120%]">
              {next.title}
            </strong>
          </div>
          <Image
            src={next.cover}
            alt=""
            width={520}
            height={325}
            className="hidden aspect-[16/10] w-[clamp(120px,22vw,260px)] rounded-xl border border-line object-cover object-top transition-transform duration-[600ms] ease-soft group-hover:scale-[1.03] group-hover:-rotate-2 sm:block"
          />
        </Link>
      )}
    </div>
  )
}

function ProjectSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="mt-11 mb-12 grid gap-[22px]">
        <div className="h-3 w-40 rounded bg-line-soft" />
        <div className="h-[clamp(2.8rem,8vw,6.6rem)] w-3/4 max-w-[640px] rounded-xl bg-line-soft" />
        <div className="h-5 w-full max-w-[46ch] rounded bg-line-soft" />
      </div>
      <div className="aspect-[16/9] rounded-[18px] border border-line bg-panel" />
    </div>
  )
}

function ExternalButton({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-2.5 rounded-xl border border-line px-3.5 py-[11px] text-[0.92rem] font-[520] transition-colors hover:border-faint hover:bg-line-soft [&_svg]:size-4 [&_svg]:text-faint"
    >
      {label}
      {children}
    </a>
  )
}
