import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
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
    {
      url: 'https://kamilmarczak.pl/',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://kamilmarczak.pl/es/about',
          de: 'https://kamilmarczak.pl/de/about',
        },
      },
    },
    {
      url: 'https://kamilmarczak.pl/blog',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://kamilmarczak.pl/es/blog',
          de: 'https://kamilmarczak.pl/de/blog',
        },
      },
    },
  ]
}
