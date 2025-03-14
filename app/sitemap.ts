import config from '@payload-config'
import { getPayload } from 'payload'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log('Payload secret:', process.env)
  const payload = await getPayload({ config })
  const { docs: projects } = await payload.find({
    collection: 'projects',
    depth: 2,
    locale: 'en',
  })

  const generateProjectUrls = projects.map((project) => ({
    url: `https://kamilmarczak.pl/projects/${project.slug}`,
    lastModified: project.updatedAt,
    alternates: {
      languages: {
        en: `https://kamilmarczak.pl/en/projects/${project.slug}`,
        pl: `https://kamilmarczak.pl/pl/projects/${project.slug}`,
      },
    },
  }))
  return [
    {
      url: 'https://kamilmarczak.pl',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://kamilmarczak.pl/en',
          pl: 'https://kamilmarczak.pl/pl',
        },
      },
    },
    ...generateProjectUrls,
  ]
}
