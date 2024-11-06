import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config'
import { draftMode } from 'next/headers';
import React from 'react';
import { Project, User } from '@/payload-types';
import { notFound } from 'next/navigation';
import ProjectTemplate from './_components/project-template';

type ProjectPageProps = {
    params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug: paramsSlug } = await params;
    const { isEnabled: isDraftMode } = await draftMode()
    const payload = await getPayloadHMR({ config })

    let project: Project | null = null;

    try {
        project = (await payload.find({
            collection: 'projects',
            where: { slug: { equals: paramsSlug } },
            draft: isDraftMode,
        })).docs[0];
    } catch (error) {
        console.error(error);
    }

    if (!project) return notFound()

    const authors = (project.authors as unknown as User[])
    const preparedAuthors = authors.map((author) => {
        return {
            id: author.id,
            name: author.name,
            email: author.email,
            avatar: author.avatar,
            socialLink: author.socialLink || 'https://kamilmarczak.pl',
            updatedAt: author.updatedAt,
            createdAt: author.createdAt,
        };
    })
    project.authors = preparedAuthors;
    
    return (
        <ProjectTemplate project={project} />
    );
}
