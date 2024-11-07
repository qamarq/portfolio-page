import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import "cal-sans";
import { ThemeProvider } from '@/components/theme-provider';
import Topbar from '@/components/topbar';
import Footer from '@/components/footer';
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from '@/components/ui/sonner';
import { ViewTransitions } from 'next-view-transitions'

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
    description: "Explore Kamil Marczak's private portfolio showcasing expertise in mobile app development, web development using various frameworks, databases, and cybersecurity.",
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
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ViewTransitions>
            <html lang="en" suppressHydrationWarning className='scroll-smooth'>
                <head>
                    <link rel="icon" href="/favicon.ico" sizes="any" />
                </head>

                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                        disableTransitionOnChange>
                        <Topbar />
                        <main className='min-h-screen'>
                            {children}
                        </main>
                        <Footer />
                    </ThemeProvider>
                    <Analytics/>
                    <Toaster richColors />
                </body>
            </html>
        </ViewTransitions>
    );
}
