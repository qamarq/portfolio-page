import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import 'cal-sans'
import { ThemeProvider } from '@/components/theme-provider'
import Topbar from '@/components/topbar'
import Footer from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import { ViewTransitions } from 'next-view-transitions'
import React, { Suspense } from 'react'
import Script from 'next/script'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

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

export const metadata: Metadata = {
  title: {
    template: "%s | Kamil Marczak's Portfolio",
    default: 'Kamil Marczak - Full-Stack Web Developer',
  },
  description:
    'Portfolio of Kamil Marczak, a web developer specializing in responsive design, front-end and back-end development, android development and cybersecurity. Explore projects and skills in creating modern, high-quality websites.',
  authors: {
    url: 'https://kamilmarczak.pl',
    name: 'Kamil Marczak',
  },
  creator: 'Kamil Marczak',
  robots: 'index, follow',
  keywords: [
    'mobile app development',
    'web development',
    'frameworks',
    'database programming',
    'cybersecurity expert',
    'programming languages',
    'Polish',
    'English',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL!),
  alternates: {
    canonical: './',
  },
  openGraph: {
    title: 'Kamil Marczak - Full-Stack Web Developer',
    description:
      'Portfolio of Kamil Marczak, a web developer specializing in responsive design, front-end and back-end development, android development and cybersecurity. Explore projects and skills in creating modern, high-quality websites.',
    url: `https://kamilmarczak.pl/`,
    images: [
      {
        url: '/assets/og-image.png',
        width: 2360,
        height: 1337,
        alt: 'Kamil Marczak - Full-Stack Web Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kamil Marczak - Full-Stack Web Developer',
    description:
      'Portfolio of Kamil Marczak, a web developer specializing in responsive design, front-end and back-end development, android development and cybersecurity. Explore projects and skills in creating modern, high-quality websites.',
    site: '@kamilmarczak',
    creator: '@qamarq_',
    creatorId: '1403301074602270720',
    images: ['/assets/og-image.png'],
  },
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
      __html: `{
                "@context": "http://schema.org/",
                "@type": "Person",
                "name": "Kamil Marczak",
                "image": "https://kamilmarczak.pl/assets/me.jpeg",
                "url": "https://kamilmarczak.pl",
                "jobTitle": "Full-Stack Web Developer",
                "sameAs": ["https://www.linkedin.com/in/kamilmarczak/", "https://x.com/qamarq_"]
            }
            `,
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
      <html lang="en" suppressHydrationWarning className="scroll-smooth">
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
