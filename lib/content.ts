import 'server-only'

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { cache } from 'react'
import { z } from 'zod'
import { Locales, routing } from '@/i18n/routing'

const CONTENT_DIR = path.join(process.cwd(), 'content')

const siteSchema = z.object({
  name: z.string(),
  role: z.string(),
  location: z.string(),
  timezone: z.string(),
  status: z.string().optional(),
  now: z.string().optional(),
  email: z.string().email(),
  cv: z.string(),
  lead: z.string(),
  stats: z.array(
    z.object({
      value: z.coerce.string(),
      unit: z.string().optional(),
      label: z.string(),
    })
  ),
  stack: z.array(z.string()),
  skills: z.array(
    z.object({
      name: z.string(),
      level: z.enum(['expert', 'proficient']),
      detail: z.string(),
    })
  ),
  experience: z.array(
    z.object({
      org: z.string(),
      role: z.string(),
      period: z.coerce.string(),
      current: z.boolean().default(false),
      text: z.string(),
      url: z.string().url().optional(),
    })
  ),
  socials: z.array(
    z.object({
      name: z.string(),
      handle: z.string(),
      url: z.string().url(),
      icon: z.enum(['github', 'linkedin', 'discord', 'x', 'npm']),
    })
  ),
  github: z.object({
    username: z.string(),
    repo: z.string(),
  }),
})

const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  role: z.string(),
  org: z.coerce.string().optional(),
  period: z.coerce.string().optional(),
  stat: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number(),
  cover: z.string(),
  url: z.string().url().optional(),
  repo: z.string().url().optional(),
  tags: z.array(z.string()),
})

export type Site = z.infer<typeof siteSchema> & { bio: string }
export type Project = z.infer<typeof projectSchema> & {
  slug: string
  body: string
}

function readMarkdown(file: string) {
  if (!fs.existsSync(file)) return null
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  return { data, content: content.trim() }
}

function readLocalized(dir: string, locale: Locales) {
  const base = readMarkdown(path.join(dir, `${routing.defaultLocale}.md`))
  if (!base) throw new Error(`Missing ${routing.defaultLocale}.md in ${dir}`)
  const localized =
    locale === routing.defaultLocale
      ? null
      : readMarkdown(path.join(dir, `${locale}.md`))

  return {
    data: { ...base.data, ...localized?.data },
    content: localized?.content || base.content,
  }
}

function parse<T extends z.ZodTypeAny>(schema: T, data: unknown, dir: string) {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in ${path.relative(process.cwd(), dir)}: ${result.error.message}`
    )
  }
  return result.data as z.infer<T>
}

export const getSite = cache((locale: Locales): Site => {
  const dir = path.join(CONTENT_DIR, 'site')
  const { data, content } = readLocalized(dir, locale)
  return { ...parse(siteSchema, data, dir), bio: content }
})

export const getProjects = cache((locale: Locales): Project[] => {
  const root = path.join(CONTENT_DIR, 'projects')
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = path.join(root, entry.name)
      const { data, content } = readLocalized(dir, locale)
      return {
        ...parse(projectSchema, data, dir),
        slug: entry.name,
        body: content,
      }
    })
    .sort((a, b) => a.order - b.order)
})

export function getProject(locale: Locales, slug: string) {
  return getProjects(locale).find((project) => project.slug === slug)
}
