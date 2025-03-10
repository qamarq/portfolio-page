import Image from 'next/image'
import MeImage from '@/public/assets/me.jpeg'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { CSSProperties, Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import config from '@payload-config'
import NextSvg from '@/public/assets/next.svg'
import VercelSvg from '@/public/assets/vercel.svg'
import GithubSvg from '@/public/assets/github.svg'
import AndroidSvg from '@/public/assets/android.svg'
import PayloadSvg from '@/public/assets/payload.svg'
import Link from 'next/link'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import ContactForm from '@/components/contact-form'
import Socials from '@/components/socials'
import ProjectCard, { ProjectCardPlaceholder } from '@/components/project-card'

export const experimental_ppr = true

export default function Home() {
  return (
    <>
      <section
        style={
          {
            '--hero-width': '72rem',
            '--hero-width-phone': '100%',
          } as CSSProperties
        }
        className="min-h-screen flex items-center justify-center mx-auto w-full max-w-[var(--hero-width-phone)] lg:max-w-[var(--hero-width)]"
      >
        <div className="grid grid-cols-3 md:grid-cols-5 w-full relative bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,#f43f5e,#f43f5e,transparent_40%)] before:animate-image-glow">
          <div className="col-span-3 grid grid-rows-5 relative horizontal-line after:top-0 order-last md:order-[unset]">
            <div className="vertical-line z-10"></div>
            <div className="vertical-line !left-[33%]"></div>
            <div className="vertical-line !left-[66%]"></div>
            <div className="p-8 row-span-2 flex items-center justify-center relative horizontal-line bg-background/40 backdrop-blur-sm">
              <h1 className="w-full text-center md:text-left font-cal translate-y-[1px] text-5xl md:text-7xl bg-gradient-to-b from-slate-50 to-rose-500 bg-clip-text text-transparent">
                Hello there{' '}
                <Image
                  unoptimized
                  src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif"
                  width={55}
                  height={55}
                  alt="Wavy hand gif"
                  className="inline -translate-y-2"
                />
                <br /> I&apos;m Kamil Marczak
              </h1>
            </div>
            <div className="p-8 row-span-1 relative horizontal-line bg-background/40 backdrop-blur-sm">
              <p className="text-lg text-muted-foreground text-balance text-center md:text-left">
                Most of the time I&apos;m a student and{' '}
                <span className="font-semibold text-primary">
                  full-stack web developer
                </span>{' '}
                but in my free time I like to make an Android app or go for a
                run.
              </p>
            </div>
            <div className="p-8 row-span-2 flex items-center justify-center relative horizontal-line bg-background/40 backdrop-blur-sm">
              <div className="w-full flex flex-col gap-2 items-center md:items-start">
                <p className="text-sm text-center md:text-left text-muted-foreground">
                  You can ask me about anything or view my projects.
                </p>
                <div className="flex items-center gap-2">
                  <Link href="#contact">
                    <Button>
                      <Icons.Contact className="w-4 h-4" />
                      Contact me
                    </Button>
                  </Link>
                  <Link href="#projects">
                    <Button variant={'outline'}>View projects</Button>
                  </Link>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant={'default'}>
                    <Icons.Next className="w-3 h-3 mr-1.5" /> NextJS
                  </Badge>
                  <Badge variant={'secondary'}>
                    <Icons.Android className="w-3 h-3 mr-1.5" /> Android
                  </Badge>
                  <Badge variant={'outline'}>
                    <Icons.OpenAI className="w-3 h-3 mr-1.5" /> AI
                  </Badge>
                  <Badge variant={'outline'}>
                    <Icons.Fivem className="w-3 h-3 mr-1.5" /> FiveM
                  </Badge>
                </div>
              </div>
            </div>
            <div className="hidden md:block vertical-line !left-[unset] right-0"></div>
          </div>
          <div className="col-span-3 md:col-span-2 z-10">
            <Image
              quality={100}
              src={MeImage}
              alt="Kamil Marczak"
              width={512}
              height={512}
              className="w-auto h-full object-cover"
            />
          </div>
          <div className="hidden md:block vertical-line !left-[80%]"></div>
          <div className="vertical-line !left-[unset] right-0 z-10"></div>
        </div>
      </section>

      <div className="[--color:#f43f5e] pointer-events-none relative -z-[2] mx-auto h-[42rem] overflow-hidden [mask-image:radial-gradient(ellipse_at_center_center,#000,transparent_50%)] my-[-18.8rem] before:absolute before:inset-0 before:h-full before:w-full before:opacity-40 before:[background-image:radial-gradient(circle_at_bottom_center,var(--color),transparent_70%)] after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[50%] after:border-t after:border-[hsl(var(--border))] after:bg-background"></div>
      <section
        id="clients"
        className="text-center mx-auto max-w-[80rem] px-6 md:px-8"
      >
        <div className="py-14">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <h2 className="text-center text-sm font-cal text-muted-foreground">
              Some of languages and technologies I know well
            </h2>
            <div className="mt-6">
              <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16 [&amp;_path]:fill-white">
                <li>
                  <Image
                    alt="Next.JS"
                    src={NextSvg}
                    width={128}
                    height={128}
                    unoptimized
                    className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                  />
                </li>
                <li>
                  <Image
                    alt="Github"
                    src={GithubSvg}
                    width={128}
                    height={128}
                    unoptimized
                    className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                  />
                </li>
                <li>
                  <Image
                    alt="Android"
                    src={AndroidSvg}
                    width={128}
                    height={128}
                    unoptimized
                    className="h-8 w-28 scale-150 px-2 dark:brightness-0 dark:invert"
                  />
                </li>
                <li>
                  <Image
                    alt="Vercel"
                    src={VercelSvg}
                    width={128}
                    height={128}
                    unoptimized
                    className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                  />
                </li>
                <li>
                  <Image
                    alt="PayloadCMS"
                    src={PayloadSvg}
                    width={128}
                    height={128}
                    unoptimized
                    className="h-8 w-28 scale-125 px-2 dark:brightness-0 dark:invert"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-20 px-5 md:px-0" id="projects">
        <h1 className="w-full text-center font-cal translate-y-1 text-5xl">
          My{' '}
          <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
            projects
          </span>
        </h1>

        <Suspense fallback={<ProjectsSuspense />}>
          <ProjectsPage />
        </Suspense>
      </section>

      <section className="max-w-6xl mx-auto py-20 mb-36" id="contact">
        <h1 className="w-full text-center font-cal translate-y-1 text-5xl">
          <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
            Contact
          </span>{' '}
          me
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-32 px-5 md:px-0">
          <ContactForm />

          <Suspense fallback={null}>
            <ContactPage />
          </Suspense>
        </div>
      </section>
    </>
  )
}

async function ContactPage() {
  const payload = await getPayloadHMR({ config })

  const mainPageContent = await payload.findGlobal({
    slug: 'main-page',
  })

  return <Socials content={mainPageContent} />
}

async function ProjectsPage() {
  const payload = await getPayloadHMR({ config })
  const { docs: projects } = await payload.find({
    collection: 'projects',
    depth: 2,
  })

  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 gap-y-24">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

function ProjectsSuspense() {
  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 gap-y-24">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProjectCardPlaceholder key={index} />
      ))}
    </div>
  )
}
