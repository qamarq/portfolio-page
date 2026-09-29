import type { Metadata } from 'next'
import { Mona_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Nav } from '@/components/nav'
import Footer from '@/components/footer'
import { CommandMenu } from '@/components/command-menu'
import { SmoothScroll } from '@/components/smooth-scroll'
import { Toaster } from '@/components/ui/sonner'
import { ViewTransitions } from 'next-view-transitions'
import React from 'react'
import Script from 'next/script'
import { Locales, routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { getProjects, getSite } from '@/lib/content'

const monaSans = Mona_Sans({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--font-mona',
  display: 'swap',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: {
      template: t('titleTemplate'),
      default: t('titleDefault'),
    },
    description: t('description'),
    creator: 'Kamil Marczak',
    publisher: 'Kamil Marczak',
    authors: [{ name: 'Kamil Marczak' }],
    robots: 'index, follow',
    keywords: t('keywords').split(', '),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SERVER_URL || 'https://kamilmarczak.pl'
    ),
    openGraph: {
      title: t('titleDefault'),
      description: t('description'),
      url: `https://kamilmarczak.pl/${locale}`,
      images: [
        {
          url: '/assets/og-image.png',
          width: 2360,
          height: 1337,
          alt: t('titleDefault'),
        },
      ],
      locale,
      type: 'website',
    },
    alternates: {
      canonical: `https://kamilmarczak.pl/${locale}`,
      languages: {
        en: 'https://kamilmarczak.pl/en',
        pl: 'https://kamilmarczak.pl/pl',
        'x-default': 'https://kamilmarczak.pl/',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: t('titleDefault'),
      description: t('description'),
      site: '@kamilmarczak',
      creator: '@qamarq_',
      creatorId: '1403301074602270720',
      images: ['/assets/og-image.png'],
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: Locales }>
}>) {
  const { locale } = await params
  if (!routing.locales.includes(locale)) {
    notFound()
  }
  setRequestLocale(locale)
  const messages = await getMessages()
  const t = await getTranslations('Nav')
  const site = getSite(locale)
  const projects = getProjects(locale)

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    image: 'https://kamilmarczak.pl/assets/avatar.jpg',
    url: 'https://kamilmarczak.pl',
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Wrocław' },
    sameAs: site.socials.map((social) => social.url),
  }

  return (
    <ViewTransitions>
      <html lang={locale} suppressHydrationWarning>
        <body
          className={`${monaSans.variable} ${geistMono.variable} overflow-x-hidden`}
        >
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              themes={['dark', 'light']}
              disableTransitionOnChange
            >
              <a
                href="#main"
                className="fixed top-[-60px] left-3 z-[100] rounded-[10px] bg-fg px-3.5 py-2.5 text-bg focus:top-3"
              >
                {t('skip')}
              </a>
              <SmoothScroll />
              <Nav />
              <main id="main" className="min-h-screen">
                {children}
              </main>
              <Footer repo={site.github.repo} cv={site.cv} />
              <CommandMenu
                email={site.email}
                cv={site.cv}
                projects={projects.map((project) => ({
                  slug: project.slug,
                  title: project.title,
                  type: project.type,
                  cover: project.cover,
                  keywords: `${project.description} ${project.tags.join(' ')}`,
                }))}
                links={site.socials.flatMap((social) =>
                  social.icon === 'github' || social.icon === 'linkedin'
                    ? [{ ...social, icon: social.icon }]
                    : []
                )}
              />
              <Toaster />
            </ThemeProvider>
            <Script
              id="person-schema"
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(personJsonLd),
              }}
            />
          </NextIntlClientProvider>
        </body>
      </html>
    </ViewTransitions>
  )
}
