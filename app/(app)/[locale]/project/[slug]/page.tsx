import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import React from 'react'
import { Project, User } from '@/payload-types'
import { notFound } from 'next/navigation'
import ProjectTemplate from './_components/project-template'

type ProjectPageProps = {
  params: Promise<{ slug: string; locale: string }>
}

export const dynamic = 'force-dynamic'
export const experimental_ppr = true

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug: paramsSlug, locale } = await params
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayload({ config })

  let project: Project | null = null

  try {
    project = (
      await payload.find({
        collection: 'projects',
        where: { slug: { equals: paramsSlug } },
        draft: isDraftMode,
      })
    ).docs[0]
  } catch (error) {
    console.error(error)
  }

  if (!project) return notFound()
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: {
      canonical: `https://kamilmarczak.pl/${locale}/project/${project.slug}`,
      languages: {
        en: 'https://kamilmarczak.pl/en/project/' + project.slug,
        pl: 'https://kamilmarczak.pl/pl/project/' + project.slug,
      },
    },
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      url: `https://kamilmarczak.pl/project/${project.slug}`,
      siteName: 'Kamil Marczak - Full-Stack Web Developer',
      images: [
        {
          url:
            typeof project.heroImage === 'string'
              ? project.heroImage
              : project.heroImage.url,
          width: 800,
          height: 600,
          alt: project.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      cardType: 'summary_large_image',
      title: project.title,
      description: project.shortDescription,
      site: '@kamilmarczak',
      creator: '@qamarq_',
      creatorId: '1403301074602270720',
      images: [
        typeof project.heroImage === 'string'
          ? project.heroImage
          : project.heroImage.url,
      ],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug: paramsSlug } = await params
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayload({ config })

  let project: Project | null = null

  try {
    project = (
      await payload.find({
        collection: 'projects',
        where: { slug: { equals: paramsSlug } },
        draft: isDraftMode,
      })
    ).docs[0]
  } catch (error) {
    console.error(error)
  }

  if (!project) return notFound()

  const authors = project.authors as unknown as User[]
  const preparedAuthors = authors.map((author) => {
    return {
      id: author.id,
      name: author.name,
      email: author.email,
      avatar: author.avatar,
      socialLink: author.socialLink || 'https://kamilmarczak.pl',
      updatedAt: author.updatedAt,
      createdAt: author.createdAt,
    }
  })
  project.authors = preparedAuthors

  return <ProjectTemplate project={project} />
}
