import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import 'cal-sans'
import { ThemeProvider } from '@/components/theme-provider'
import Topbar from '@/components/topbar'
import Footer from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import { ViewTransitions } from 'next-view-transitions'
import React, { Suspense, use } from 'react'
import Script from 'next/script'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider, useTranslations } from 'next-intl'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
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
  const { locale } = use(params)
  setRequestLocale(locale)
  const t = useTranslations('Metadata')

  return {
    title: {
      template: t('titleTemplate'),
      default: t('titleDefault'),
    },
    description: t('description'),
    authors: {
      url: 'https://kamilmarczak.pl',
      name: 'Kamil Marczak',
    },
    creator: 'Kamil Marczak',
    robots: 'index, follow',
    keywords: t('keywords').split(', '),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL!),
    alternates: {
      canonical: './',
    },
    openGraph: {
      title: t('titleDefault'),
      description: t('description'),
      url: `https://kamilmarczak.pl/`,
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
  params: Promise<{ locale: string }>
}>) {
  function personJsonLd() {
    return {
      __html: `
      {
        "@context": "http://schema.org/",
        "@type": "Person",
        "name": "Kamil Marczak",
        "image": "https://kamilmarczak.pl/assets/me.jpeg",
        "url": "https://kamilmarczak.pl",
        "jobTitle": "Full-Stack Web Developer",
        "sameAs": ["https://www.linkedin.com/in/kamilmarczak/", "https://x.com/qamarq_"]
      }`,
    }
  }
  const { locale } = await params
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  setRequestLocale(locale)

  return (
    <ViewTransitions>
      <html lang={locale} suppressHydrationWarning className="scroll-smooth">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>

        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
        >
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              forcedTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <Suspense>
                <Topbar />
              </Suspense>
              <main className="min-h-screen">{children}</main>
              <Footer />
            </ThemeProvider>
            <Toaster richColors />
            <Script
              id="person-schema"
              type="application/ld+json"
              dangerouslySetInnerHTML={personJsonLd()}
              key="product-jsonld"
            />
          </NextIntlClientProvider>
        </body>
      </html>
    </ViewTransitions>
  )
}
