import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Link } from 'next-view-transitions'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { Locales, routing } from '@/i18n/routing'
import { getProject, getProjects } from '@/lib/content'
import { BrowserFrame } from '@/components/browser-frame'
import { Tags } from '@/components/project-card'
import { MarkdownContent } from '@/components/markdown'
import { Icons } from '@/components/icons'

type ProjectPageProps = {
  params: Promise<{ slug: string; locale: Locales }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjects(locale).map((project) => ({ locale, slug: project.slug }))
  )
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const project = getProject(locale, slug)
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

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, locale } = await params
  setRequestLocale(locale)
  const projects = getProjects(locale)
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1) notFound()

  const project = projects[index]
  const next = projects[(index + 1) % projects.length]
  const t = await getTranslations('Project')
  const tProjects = await getTranslations('Projects')

  const meta = [
    { label: t('type'), value: project.type },
    { label: t('role'), value: project.role },
    project.period && { label: t('period'), value: project.period },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <article className="pt-[clamp(112px,14vw,150px)] pb-[clamp(80px,10vw,140px)]">
      <div className="wrap">
        <Link
          href={`/${locale}#projects`}
          className="group inline-flex items-center gap-2 rounded-full border border-line py-2 pr-3.5 pl-2.5 text-[0.92rem] text-muted transition-colors hover:border-faint hover:text-fg"
        >
          <Icons.ArrowLeft className="size-4 transition-transform duration-300 ease-soft group-hover:-translate-x-[3px]" />
          {t('back')}
        </Link>

        <header className="mt-11 mb-12 grid gap-[22px]">
          <p className="eyebrow">
            {project.type}
            {project.org && ` · ${project.org}`}
          </p>
          <h1
            className="type-display w-fit max-w-full text-[clamp(2.8rem,8vw,6.6rem)]"
            style={{ viewTransitionName: `project-${project.slug}-title` }}
          >
            {project.title}
          </h1>
          <p className="lead">{project.description}</p>
        </header>

        <BrowserFrame
          url={project.url}
          fallback={project.title}
          ratio="aspect-[16/9]"
          style={{ viewTransitionName: `project-${project.slug}-cover` }}
        >
          <Image
            src={project.cover}
            alt={tProjects('screenshot', { title: project.title })}
            fill
            priority
            sizes="(min-width: 1280px) 1240px, 100vw"
            className="object-cover object-top"
          />
        </BrowserFrame>

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
            className="group mt-[clamp(72px,9vw,120px)] grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 border-t border-line pt-7"
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
    </article>
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
