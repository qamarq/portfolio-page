'use client'

import { useLayoutEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { SCROLLED_OFFSET } from '@/lib/motion'
import { Icons } from './icons'
import { Logo } from './logo'
import { SectionLink } from './section-link'
import { useThemeToggle } from './use-theme-toggle'
import { OPEN_COMMAND_MENU } from './command-menu'
import { useActiveSection } from './section-spy'
import { useSwitchLocale } from './use-switch-locale'
import { buttonVariants } from './ui/button'

const SECTIONS = ['projects', 'experience', 'contact'] as const

export function Nav() {
  const t = useTranslations('Nav')
  const locale = useLocale()
  const { switchLocale, prefetchLocale } = useSwitchLocale()
  const toggleTheme = useThemeToggle()
  const active = useActiveSection()
  const sectionsRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const root = document.documentElement
    root.toggleAttribute('data-scrolled', window.scrollY > SCROLLED_OFFSET)
    if (document.readyState !== 'complete') return
    const frame = requestAnimationFrame(() =>
      root.toggleAttribute('data-settled', true)
    )
    return () => cancelAnimationFrame(frame)
  }, [])

  useLayoutEffect(() => {
    const nav = sectionsRef.current
    const indicator = indicatorRef.current
    if (!nav || !indicator) return
    const link = nav.querySelector<HTMLElement>('[aria-current="true"]')
    if (!link) {
      indicator.dataset.visible = 'false'
      return
    }
    const place = () => {
      indicator.style.setProperty('--x', `${link.offsetLeft}px`)
      indicator.style.setProperty('--w', `${link.offsetWidth}px`)
    }
    place()
    if (indicator.dataset.visible !== 'true') {
      indicator.getBoundingClientRect()
      indicator.dataset.visible = 'true'
    }
    const observer = new ResizeObserver(place)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [active])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div className="site-header pointer-events-auto mx-auto mt-3 flex w-[calc(100%-24px)] max-w-[1264px] items-center gap-1.5 rounded-full border border-transparent py-2 pr-2 pl-3 settled:transition-[max-width,background-color,border-color,box-shadow,backdrop-filter] settled:duration-[600ms] settled:ease-soft scrolled:max-w-[860px] scrolled:border-line scrolled:bg-panel/70 scrolled:shadow-soft scrolled:backdrop-blur-xl scrolled:backdrop-saturate-150">
        <SectionLink
          section="top"
          aria-label={t('home')}
          className="group mr-auto flex items-center gap-2.5 font-display text-[1.02rem] font-[680] tracking-[-0.02em] whitespace-nowrap [font-stretch:112%]"
        >
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-[9px] border border-b-2 border-line bg-bg-2 transition-[transform,border-color] duration-500 ease-soft group-hover:-rotate-8 group-hover:border-accent"
          >
            <Logo className="w-5" />
          </span>
          <span>Kamil Marczak</span>
        </SectionLink>

        <nav
          ref={sectionsRef}
          aria-label={t('sections')}
          className="relative isolate hidden gap-0.5 min-[900px]:flex"
        >
          <span
            ref={indicatorRef}
            aria-hidden
            data-visible="false"
            className="absolute inset-y-0 left-0 -z-10 w-(--w) translate-x-(--x) rounded-full bg-line-soft transition-[opacity,scale] duration-300 ease-soft data-[visible=false]:scale-90 data-[visible=false]:opacity-0 data-[visible=true]:transition-[opacity,scale,translate,width] data-[visible=true]:duration-500"
          />
          {SECTIONS.map((section) => (
            <SectionLink
              key={section}
              section={section}
              aria-current={active === section ? 'true' : undefined}
              className="rounded-full px-3.5 py-2 text-[0.92rem] font-medium text-muted transition-colors duration-300 hover:text-fg aria-[current=true]:text-fg"
            >
              {t(section)}
            </SectionLink>
          ))}
        </nav>

        <div className="ml-2 flex items-center gap-1.5">
          <div
            role="group"
            aria-label={t('language')}
            className="hidden rounded-full border border-line p-[3px] font-mono text-[0.72rem] min-[900px]:flex"
          >
            {routing.locales.map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={code === locale}
                onClick={() => switchLocale(code)}
                onPointerEnter={() => prefetchLocale(code)}
                onFocus={() => prefetchLocale(code)}
                className="cursor-pointer rounded-full px-2 py-1 tracking-[0.06em] text-faint uppercase aria-pressed:bg-fg aria-pressed:text-bg"
              >
                {code}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={(event) => toggleTheme(event.currentTarget)}
            aria-label={t('theme')}
            className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          >
            <Icons.Moon className="dark:block hidden" />
            <Icons.Sun className="dark:hidden" />
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU))}
            aria-haspopup="dialog"
            className="flex h-[38px] cursor-pointer items-center gap-2 rounded-full border border-line px-3.5 text-[0.88rem] text-muted transition-colors hover:border-faint hover:text-fg min-[900px]:pr-2"
          >
            {t('search')}
            <span aria-hidden className="hidden gap-[3px] min-[900px]:flex">
              <span className="key">⌘</span>
              <span className="key">K</span>
            </span>
          </button>

          <SectionLink
            section="contact"
            className={cn(
              buttonVariants({ size: 'sm' }),
              'hidden min-[900px]:inline-flex'
            )}
          >
            {t('cta')}
          </SectionLink>
        </div>
      </div>
    </header>
  )
}
