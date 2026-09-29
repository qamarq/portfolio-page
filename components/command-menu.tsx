'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Icons } from './icons'
import { useCopyEmail } from './copy-email'
import { useScrollToSection } from './section-link'
import { useThemeToggle } from './use-theme-toggle'
import { useSwitchLocale } from './use-switch-locale'

export const OPEN_COMMAND_MENU = 'command-menu:open'

export type CommandProject = {
  slug: string
  title: string
  type: string
  keywords: string
  cover: string
}

type CommandMenuProps = {
  projects: CommandProject[]
  email: string
  cv: string
  links: {
    name: string
    handle: string
    url: string
    icon: 'github' | 'linkedin'
  }[]
}

type Item = {
  group: 'navigate' | 'projects' | 'actions'
  label: string
  hint?: string
  keywords?: string
  icon: ReactNode
  href?: string
  run?: () => void
}

const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l')

export function CommandMenu({ projects, email, cv, links }: CommandMenuProps) {
  const t = useTranslations('Command')
  const tNav = useTranslations('Nav')
  const locale = useLocale()
  const router = useRouter()
  const { switchLocale } = useSwitchLocale()
  const scrollToSection = useScrollToSection()
  const toggleTheme = useThemeToggle()
  const copyEmail = useCopyEmail(email)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const goToSection = useCallback(
    (section: string) => {
      if (scrollToSection(section)) return
      router.push(section === 'top' ? `/${locale}` : `/${locale}#${section}`, {
        transitionTypes: ['nav-back'],
      })
    },
    [scrollToSection, router, locale]
  )

  const items = useMemo<Item[]>(() => {
    const sectionIcon = <Icons.Hash />
    return [
      {
        group: 'navigate',
        label: t('home'),
        icon: sectionIcon,
        run: () => goToSection('top'),
      },
      {
        group: 'navigate',
        label: tNav('projects'),
        icon: sectionIcon,
        run: () => goToSection('projects'),
      },
      {
        group: 'navigate',
        label: tNav('experience'),
        icon: sectionIcon,
        run: () => goToSection('experience'),
      },
      {
        group: 'navigate',
        label: tNav('contact'),
        icon: sectionIcon,
        run: () => goToSection('contact'),
      },
      ...projects.map<Item>((project) => ({
        group: 'projects',
        label: project.title,
        hint: project.type,
        keywords: project.keywords,
        icon: (
          <Image
            src={project.cover}
            alt=""
            width={28}
            height={20}
            className="h-5 w-7 shrink-0 rounded-[4px] border border-line object-cover object-top"
          />
        ),
        run: () =>
          router.push(`/${locale}/project/${project.slug}`, {
            transitionTypes: ['nav-forward'],
          }),
      })),
      {
        group: 'actions',
        label: t('copyEmail'),
        hint: email,
        icon: <Icons.Copy />,
        run: () => copyEmail(),
      },
      { group: 'actions', label: t('cv'), icon: <Icons.FileDown />, href: cv },
      {
        group: 'actions',
        label: t('theme'),
        icon: <Icons.Moon />,
        run: toggleTheme,
      },
      {
        group: 'actions',
        label: t('language'),
        icon: <Icons.Globe />,
        run: () => switchLocale(locale === 'pl' ? 'en' : 'pl'),
      },
      ...links.map<Item>((link) => {
        const LinkIcon = Icons[link.icon]
        return {
          group: 'actions',
          label: link.name,
          hint: link.handle,
          icon: <LinkIcon />,
          href: link.url,
        }
      }),
    ]
  }, [
    t,
    tNav,
    projects,
    email,
    cv,
    links,
    locale,
    router,
    switchLocale,
    goToSection,
    copyEmail,
    toggleTheme,
  ])

  const shown = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return items
    const groups: Item['group'][] = ['navigate', 'projects', 'actions']
    return items
      .filter((item) =>
        normalize(
          `${item.label} ${item.hint ?? ''} ${item.keywords ?? ''}`
        ).includes(q)
      )
      .map((item) => ({ item, byLabel: normalize(item.label).includes(q) }))
      .sort(
        (a, b) =>
          groups.indexOf(a.item.group) - groups.indexOf(b.item.group) ||
          Number(b.byLabel) - Number(a.byLabel)
      )
      .map(({ item }) => item)
  }, [items, query])

  const open = useCallback(() => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    setQuery('')
    setActive(0)
    dialog.showModal()
  }, [])

  const close = useCallback(() => dialogRef.current?.close(), [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(
        (document.activeElement as HTMLElement | null)?.tagName ?? ''
      )
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (dialogRef.current?.open) close()
        else open()
      } else if (event.key === '/' && !typing && !dialogRef.current?.open) {
        event.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_COMMAND_MENU, open)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_COMMAND_MENU, open)
    }
  }, [open, close])

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const run = (index: number) => {
    const item = shown[index]
    if (!item) return
    if (item.href) {
      listRef.current
        ?.querySelector<HTMLAnchorElement>(`[data-index="${index}"]`)
        ?.click()
      return
    }
    close()
    setTimeout(() => item.run?.(), 60)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={t('label')}
      onClick={(event) => {
        if (event.target === dialogRef.current) close()
      }}
      className="m-auto mt-[12vh] max-h-[min(560px,calc(100dvh-120px))] w-[min(640px,calc(100%-24px))] flex-col overflow-hidden rounded-[20px] border border-line bg-panel p-0 text-fg shadow-[0_40px_120px_-20px_rgb(0_0_0/0.6)] backdrop:bg-[rgb(8_5_6/0.55)] backdrop:backdrop-blur-[6px] open:flex open:animate-[pop_0.28s_var(--ease-soft)]"
    >
      <div className="flex items-center gap-3 border-b border-line px-[18px] py-4">
        <Icons.Search className="size-[18px] shrink-0 text-faint" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setActive((index) => (index + 1) % Math.max(shown.length, 1))
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActive(
                (index) =>
                  (index - 1 + shown.length) % Math.max(shown.length, 1)
              )
            } else if (event.key === 'Enter') {
              event.preventDefault()
              run(active)
            }
          }}
          role="combobox"
          aria-expanded="true"
          aria-controls="command-list"
          aria-activedescendant={shown.length ? `command-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          placeholder={t('placeholder')}
          className="min-w-0 flex-1 bg-transparent text-[1.05rem] outline-none placeholder:text-faint"
        />
        <span className="key">esc</span>
      </div>

      <div
        ref={listRef}
        id="command-list"
        role="listbox"
        className="flex-1 overflow-y-auto p-2"
      >
        {shown.length === 0 && (
          <p className="p-7 text-center text-faint">{t('empty')}</p>
        )}
        {shown.map((item, index) => {
          const header =
            item.group !== shown[index - 1]?.group ? (
              <p
                role="presentation"
                className="label px-2.5 pt-2.5 pb-1.5 text-[0.68rem]"
              >
                {t(item.group)}
              </p>
            ) : null
          const className =
            'flex w-full cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[0.95rem] text-muted aria-selected:bg-line-soft aria-selected:text-fg [&>svg]:size-4 [&>svg]:shrink-0 aria-selected:[&>svg]:text-accent'
          const content = (
            <>
              {item.icon}
              <span>{item.label}</span>
              {item.hint && (
                <span className="ml-auto truncate pl-3 font-mono text-[0.72rem] text-faint">
                  {item.hint}
                </span>
              )}
            </>
          )
          const common = {
            id: `command-${index}`,
            role: 'option',
            'aria-selected': index === active,
            'data-index': index,
            onMouseMove: () => index !== active && setActive(index),
            className,
          }
          return (
            <div key={`${item.group}-${item.label}`}>
              {header}
              {item.href ? (
                <a
                  {...common}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setTimeout(close, 0)}
                >
                  {content}
                </a>
              ) : (
                <button {...common} type="button" onClick={() => run(index)}>
                  {content}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line px-4 py-2.5 font-mono text-[0.7rem] text-faint">
        <span className="inline-flex items-center gap-1.5">
          <span className="key">↑</span>
          <span className="key">↓</span>
          {t('move')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="key">↵</span>
          {t('open')}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="key">⌘</span>
          <span className="key">K</span>
          {t('toggle')}
        </span>
      </div>
    </dialog>
  )
}
