import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import portrait from '@/public/assets/portrait.jpg'
import { getProjects, getSite } from '@/lib/content'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { LocalTime } from '@/components/local-time'
import { SectionLink } from '@/components/section-link'
import { ProjectCard } from '@/components/project-card'
import { ProjectIndex } from '@/components/project-index'
import { GithubActivity } from '@/components/github-activity'
import { InlineMarkdown, MarkdownContent } from '@/components/markdown'
import { CopyEmail } from '@/components/copy-email'
import ContactForm from '@/components/contact-form'
import { PageTransition } from '@/components/page-transition'
import { SectionSpy } from '@/components/section-spy'
import { cn } from '@/lib/utils'

export default async function Home() {
  const locale = await getLocale()
  const [t, site, projects] = await Promise.all([
    getTranslations(),
    getSite(locale),
    getProjects(locale),
  ])
  const featured = projects.filter((project) => project.featured)
  const rest = projects.filter((project) => !project.featured)

  return (
    <PageTransition>
      <div>
        <SectionSpy />
        <section
          id="top"
          className="relative isolate pt-[clamp(120px,16vw,176px)]"
        >
          <div
            aria-hidden
            className="hero-glow pointer-events-none absolute inset-x-0 top-0 bottom-[20%] -z-10"
          />
          <div className="wrap grid gap-12 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,400px)] min-[900px]:items-end min-[900px]:gap-14">
            <div className="flex min-w-0 flex-col gap-7">
              <div className="intro-fade flex flex-wrap items-center gap-x-[18px] gap-y-2.5 font-mono text-[0.78rem] tracking-[0.02em] text-muted [--delay:0.05s]">
                {site.status && (
                  <span className="inline-flex items-center gap-[9px] rounded-full border border-line bg-panel/60 py-1.5 pr-3 pl-2.5 text-fg">
                    <i aria-hidden className="status-dot" />
                    {site.status}
                  </span>
                )}
                <span>{site.role}</span>
                <span
                  aria-hidden
                  className="size-[3px] rounded-full bg-faint"
                />
                <span>
                  {site.location} · <LocalTime timeZone={site.timezone} />
                </span>
              </div>
              <h1
                aria-label={site.name}
                className="hero-name type-display -ml-[0.04em] text-[min(19vw,9.4rem)] min-[900px]:text-[min(10.2vw,10.4rem)]"
              >
                <span className="line">
                  <span>{site.name.split(' ')[0]}</span>
                </span>
                <span className="line">
                  <span className="outline">
                    {site.name.split(' ').slice(1).join(' ')}
                    <em>.</em>
                  </span>
                </span>
              </h1>
              <div className="intro-fade flex flex-col gap-7 [--delay:0.32s]">
                <p className="lead">
                  <InlineMarkdown>{site.lead}</InlineMarkdown>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <SectionLink
                    section="projects"
                    className={cn(
                      buttonVariants(),
                      'grow hover:[&_svg]:translate-y-[3px] sm:grow-0'
                    )}
                  >
                    {t('Hero.seeWork')}
                    <Icons.ArrowDown />
                  </SectionLink>
                  <a
                    href={site.cv}
                    target="_blank"
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'grow hover:[&_svg]:translate-x-0.5 hover:[&_svg]:-translate-y-0.5 sm:grow-0'
                    )}
                  >
                    {t('Hero.downloadCv')}
                    <Icons.ArrowUpRight />
                  </a>
                </div>
              </div>
            </div>
            <figure className="group relative w-full self-end min-[900px]:max-w-[440px]">
              <div className="intro-unveil relative aspect-[5/4] overflow-hidden rounded-[18px] border border-line bg-panel min-[900px]:aspect-[4/5]">
                <Image
                  src={portrait}
                  alt={t('Hero.portraitAlt')}
                  fill
                  priority
                  placeholder="blur"
                  sizes="(min-width: 900px) 440px, 100vw"
                  className="object-cover object-[50%_18%] transition-transform duration-[1200ms] ease-soft group-hover:scale-[1.035] min-[900px]:object-center"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent to-40%" />
              </div>
              {site.now && (
                <figcaption className="intro-fade absolute inset-x-3.5 bottom-3.5 flex items-center gap-3 rounded-[14px] border border-line bg-panel/80 px-3.5 py-3 text-[0.9rem] leading-snug backdrop-blur-[14px] [--delay:0.75s]">
                  <span className="font-mono text-[0.68rem] tracking-[0.12em] text-accent uppercase">
                    {t('Hero.now')}
                  </span>
                  <strong className="font-[560]">{site.now}</strong>
                </figcaption>
              )}
            </figure>
          </div>

          <div className="wrap mt-[clamp(56px,8vw,96px)]">
            <div className="rule" aria-hidden />
            <dl className="grid grid-cols-2 min-[900px]:grid-cols-4">
              {site.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    'intro-fade flex flex-col gap-1.5 pt-6 pr-5 pb-7',
                    index > 0 &&
                      'min-[900px]:border-l min-[900px]:border-line min-[900px]:pl-6'
                  )}
                  style={
                    {
                      '--delay': `${0.55 + index * 0.07}s`,
                    } as React.CSSProperties
                  }
                >
                  <dt className="font-display text-[clamp(2rem,3.6vw,2.9rem)] leading-none font-[700] tracking-[-0.035em] tabular-nums [font-stretch:112%]">
                    {stat.value}
                    {stat.unit && (
                      <small className="ml-1 text-[0.5em] font-[600] tracking-[-0.01em] text-muted">
                        {stat.unit}
                      </small>
                    )}
                  </dt>
                  <dd className="max-w-[22ch] text-[0.92rem] text-muted">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            aria-label={t('Hero.stack')}
            className="mt-[clamp(32px,5vw,56px)] overflow-hidden border-y border-line py-7"
          >
            <div className="flex items-center gap-7">
              <span className="label hidden shrink-0 pl-[max(var(--gutter),calc((100vw-1240px)/2))] min-[900px]:inline">
                {t('Hero.stack')}
              </span>
              <div className="marquee min-w-0 flex-1 overflow-hidden">
                <div className="marquee-track flex w-max gap-11 pr-11">
                  {[...site.stack, ...site.stack].map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      aria-hidden={index >= site.stack.length || undefined}
                      className="marquee-item inline-flex items-center gap-11 font-display text-[clamp(1.15rem,2vw,1.55rem)] font-[600] tracking-[-0.02em] whitespace-nowrap text-muted transition-colors [font-stretch:112%] hover:text-fg"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="py-[clamp(56px,7vw,100px)]">
          <div className="wrap">
            <div className="rule scroll-draw" aria-hidden />
            <header className="scroll-in mt-10 mb-[clamp(40px,6vw,72px)] grid gap-6 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,420px)] min-[900px]:items-end">
              <div className="flex flex-col gap-[18px]">
                <p className="eyebrow">
                  {t('Projects.eyebrow')} ·{' '}
                  {String(projects.length).padStart(2, '0')}
                </p>
                <h2 className="type-h2">{t('Projects.title')}</h2>
              </div>
              <p className="lead">{t('Projects.lead')}</p>
            </header>

            <div className="grid gap-x-8 gap-y-14 min-[900px]:grid-cols-2">
              {featured.map((project, index) => (
                <div
                  key={project.slug}
                  className={cn(
                    'scroll-in',
                    index % 2 === 1 && 'min-[900px]:mt-24'
                  )}
                >
                  <ProjectCard project={project} locale={locale} />
                </div>
              ))}
            </div>

            {rest.length > 0 && (
              <div className="mt-[clamp(72px,9vw,120px)]">
                <div className="scroll-in mb-[18px] flex items-baseline justify-between gap-4">
                  <h3 className="type-h3 text-[1.4rem] font-[680] [font-stretch:112%]">
                    {t('Projects.more')}
                  </h3>
                  <span className="font-mono text-[0.75rem] text-faint">
                    {String(rest.length).padStart(2, '0')}
                  </span>
                </div>
                <ProjectIndex
                  locale={locale}
                  labels={{
                    project: t('Projects.project'),
                    type: t('Projects.type'),
                    stack: t('Projects.stack'),
                  }}
                  rows={rest.map((project) => ({
                    slug: project.slug,
                    title: project.title,
                    type: project.type,
                    tags: project.tags,
                    cover: project.cover,
                  }))}
                />
              </div>
            )}
          </div>
        </section>

        <section id="experience" className="py-[clamp(56px,7vw,100px)]">
          <div className="wrap">
            <div className="rule scroll-draw" aria-hidden />
            <div className="mt-10 grid gap-16 min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] min-[900px]:gap-[clamp(48px,7vw,112px)]">
              <div className="flex min-w-0 flex-col gap-6">
                <p className="eyebrow">{t('About.eyebrow')}</p>
                <h2 className="type-h2 scroll-in">{t('About.title')}</h2>
                <MarkdownContent className="scroll-in max-w-[52ch] [&_p]:mb-0 [&_p]:text-pretty">
                  {site.bio}
                </MarkdownContent>
                <h3 className="label mt-4">{t('About.skills')}</h3>
                <ul className="border-t border-line">
                  {site.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="scroll-in grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-0.5 border-b border-line py-3.5"
                    >
                      <span className="font-semibold">{skill.name}</span>
                      <span
                        className={cn(
                          'col-start-2 row-span-2 row-start-1 self-center rounded-full border px-[9px] py-1 font-mono text-[0.7rem] tracking-[0.06em]',
                          skill.level === 'expert'
                            ? 'border-transparent bg-accent-soft text-accent'
                            : 'border-line text-muted'
                        )}
                      >
                        {t(`About.${skill.level}`)}
                      </span>
                      <span className="text-[0.9rem] text-muted">
                        {skill.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="label">{t('About.experience')}</h3>
                <ol className="timeline-line relative mt-[18px] before:absolute before:top-2.5 before:bottom-2.5 before:left-[5px] before:w-px before:bg-line">
                  {site.experience.map((item) => (
                    <li
                      key={`${item.org}-${item.period}`}
                      className={cn(
                        'scroll-in relative grid gap-1.5 pb-11 pl-9 last:pb-0 before:absolute before:top-[7px] before:left-0 before:size-[11px] before:rounded-full before:border before:border-faint before:bg-bg',
                        item.current &&
                          'before:border-accent before:bg-accent before:shadow-[0_0_0_5px_var(--accent-soft)]'
                      )}
                    >
                      <span className="font-mono text-[0.75rem] tracking-[0.06em] text-faint tabular-nums">
                        {item.period}
                      </span>
                      <h4 className="type-h3 text-[1.5rem]">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="decoration-accent underline-offset-4 hover:underline"
                          >
                            {item.org}
                          </a>
                        ) : (
                          item.org
                        )}
                      </h4>
                      <p className="font-medium">{item.role}</p>
                      <p className="max-w-[54ch] text-muted">{item.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <GithubActivity username={site.github.username} />
          </div>
        </section>

        <section id="contact" className="py-[clamp(56px,7vw,100px)]">
          <div className="wrap">
            <div className="rule scroll-draw" aria-hidden />
            <div className="mt-10 grid gap-14 min-[900px]:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] min-[900px]:gap-[clamp(40px,6vw,96px)]">
              <div className="flex min-w-0 flex-col gap-7">
                <p className="eyebrow">{t('Contact.eyebrow')}</p>
                <h2 className="type-display scroll-in text-[clamp(2.5rem,5.4vw,4.6rem)] leading-[0.94] min-[900px]:text-[clamp(2.5rem,4.6vw,4.2rem)]">
                  {t('Contact.title')}
                  <br />
                  <span className="text-accent">
                    {t('Contact.titleAccent')}
                  </span>
                </h2>
                <p className="lead scroll-in">{t('Contact.lead')}</p>
                <CopyEmail email={site.email} />
                <ul className="grid gap-2 sm:grid-cols-2">
                  {site.socials.map((social) => {
                    const SocialIcon = Icons[social.icon]
                    return (
                      <li key={social.url} className="scroll-in">
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-w-0 items-center gap-3 rounded-[14px] border border-line px-4 py-3.5 transition-colors hover:border-faint hover:bg-line-soft"
                        >
                          <SocialIcon className="size-[18px] shrink-0 text-muted" />
                          <span className="flex min-w-0 flex-col leading-tight">
                            <span className="text-[0.95rem] font-[560]">
                              {social.name}
                            </span>
                            <span className="truncate font-mono text-[0.72rem] text-faint">
                              {social.handle}
                            </span>
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="scroll-in">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
