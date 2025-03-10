import React from 'react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import ProjectCard from '@/components/project-card'

export default async function ProjectsPage() {
  const payload = await getPayloadHMR({ config })
  const { docs: projects } = await payload.find({
    collection: 'projects',
    depth: 2,
  })

  return (
    <section className="max-w-6xl mx-auto py-20 px-5 md:px-0" id="projects">
      <h1 className="w-full text-center font-cal translate-y-1 text-5xl">
        My{' '}
        <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
          projects
        </span>
      </h1>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 gap-y-24">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
