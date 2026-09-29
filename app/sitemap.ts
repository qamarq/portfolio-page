import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getProjects } from '@/lib/content'

const BASE_URL = 'https://kamilmarczak.pl'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const languages = (path: string) =>
    Object.fromEntries(
      routing.locales.map((locale) => [locale, `${BASE_URL}/${locale}${path}`])
    )

  const projects = await getProjects(routing.defaultLocale)
  const projectUrls = projects.map((project) => ({
    url: `${BASE_URL}/${routing.defaultLocale}/project/${project.slug}`,
    alternates: { languages: languages(`/project/${project.slug}`) },
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      alternates: { languages: languages('') },
      priority: 1,
    },
    ...projectUrls,
  ]
}
