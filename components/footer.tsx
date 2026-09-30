import { cacheLife } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { getRepoStars } from '@/lib/github'
import { Icons } from './icons'
import { Logo } from './logo'
import { SectionLink } from './section-link'

async function getYear() {
  'use cache'
  cacheLife('days')
  return new Date().getFullYear()
}

export default async function Footer({
  repo,
  cv,
}: {
  repo: string
  cv: string
}) {
  const [t, tNav, stars, year] = await Promise.all([
    getTranslations('Footer'),
    getTranslations('Nav'),
    getRepoStars(repo),
    getYear(),
  ])

  return (
    <footer className="border-t border-line pt-10 pb-[calc(40px+env(safe-area-inset-bottom))]">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <SectionLink
          section="top"
          aria-label={tNav('home')}
          className="group flex items-center gap-2.5 font-display text-[1.02rem] font-[680] tracking-[-0.02em] [font-stretch:112%]"
        >
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-[9px] border border-b-2 border-line bg-bg-2"
          >
            <Logo className="w-5" />
          </span>
          Kamil Marczak
        </SectionLink>
        <nav className="flex flex-wrap gap-x-5 gap-y-1 text-[0.92rem] text-muted">
          <SectionLink section="projects" className="hover:text-fg">
            {tNav('projects')}
          </SectionLink>
          <SectionLink section="experience" className="hover:text-fg">
            {tNav('experience')}
          </SectionLink>
          <SectionLink section="contact" className="hover:text-fg">
            {tNav('contact')}
          </SectionLink>
          <a href={cv} target="_blank" className="hover:text-fg">
            CV
          </a>
        </nav>
        <a
          href={`https://github.com/${repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-[7px] text-[0.88rem] text-muted transition-colors hover:border-faint hover:text-fg"
        >
          <Icons.github className="size-4" />
          {t('source')}
          {stars !== null && (
            <b className="font-mono font-medium text-fg">★ {stars}</b>
          )}
        </a>
        <span className="group/made font-mono text-[0.74rem] text-faint">
          © {year} ·{' '}
          {t.rich('made', {
            heart: () => (
              <span className="inline-block text-accent group-hover/made:motion-safe:animate-[heartbeat_1.1s_ease-in-out_infinite]">
                ♥
              </span>
            ),
          })}
        </span>
      </div>
    </footer>
  )
}
