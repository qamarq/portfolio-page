import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import "cal-sans";
import { ThemeProvider } from '@/components/theme-provider';
import Topbar from '@/components/topbar';
import Footer from '@/components/footer';
// import { Analytics } from "@vercel/analytics/react"
import { Toaster } from '@/components/ui/sonner';
import { ViewTransitions } from 'next-view-transitions'
// import { SpeedInsights } from '@vercel/speed-insights/next';
import Head from 'next/head';
import React, { Suspense } from 'react';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: {
        template: "%s | Kamil Marczak's Portfolio",
        default: "Kamil Marczak - Full-Stack Web Developer"
    },
    description: "Portfolio of Kamil Marczak, a web developer specializing in responsive design, front-end and back-end development, android development and cybersecurity. Explore projects and skills in creating modern, high-quality websites.",
    authors: {
        url: "https://kamilmarczak.pl",
        name: "Kamil Marczak"
    },
    creator: "Kamil Marczak",
    robots: "index, follow",
    keywords: [
        "mobile app development", 
        "web development", 
        "frameworks", 
        "database programming", 
        "cybersecurity expert", 
        "programming languages", 
        "Polish", 
        "English"
    ],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL!),
    alternates: {
        canonical: "./"
    },
    openGraph: {
        title: "Kamil Marczak - Full-Stack Web Developer",
        description: "Portfolio of Kamil Marczak, a web developer specializing in responsive design, front-end and back-end development, android development and cybersecurity. Explore projects and skills in creating modern, high-quality websites.",
        url: `https://kamilmarczak.pl/`,
        images: [{
            url: "/assets/og-image.png",
            width: 2360,
            height: 1337,
            alt: "Kamil Marczak - Full-Stack Web Developer",
        }],
        locale: 'en_US',
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: "Kamil Marczak - Full-Stack Web Developer",
        description: "Portfolio of Kamil Marczak, a web developer specializing in responsive design, front-end and back-end development, android development and cybersecurity. Explore projects and skills in creating modern, high-quality websites.",
        site: '@kamilmarczak',
        creator: '@qamarq_',
        creatorId: '1403301074602270720',
        images: ["/assets/og-image.png"]
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
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
        };
    }
    return (
        <ViewTransitions>
            <html lang="en" suppressHydrationWarning className='scroll-smooth'>
                <Head>
                    <link rel="icon" href="/favicon.ico" sizes="any" />
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={personJsonLd()}
                        key="product-jsonld"
                    />
                    <script defer data-domain="kamilmarczak.pl" src="https://analytics.kamilmarczak.pl/js/script.hash.outbound-links.tagged-events.js"></script>
                </Head>

                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                        disableTransitionOnChange>
                        <Suspense>
                            <Topbar />
                        </Suspense>
                        <main className='min-h-screen'>
                            {children}
                        </main>
                        <Footer />
                    </ThemeProvider>
                    {/* <Analytics/>
                    <SpeedInsights /> */}
                    <Toaster richColors />
                </body>
            </html>
        </ViewTransitions>
    );
}
