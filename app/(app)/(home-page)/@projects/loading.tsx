import { ProjectCardPlaceholder } from '@/components/project-card'
import React from 'react'

export default function LoadingProjectsPage() {
  return (
    <section className="max-w-6xl mx-auto py-20 px-5 md:px-0" id="projects">
      <h1 className="w-full text-center font-cal translate-y-1 text-5xl">
        My{' '}
        <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
          projects
        </span>
      </h1>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 gap-y-24">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProjectCardPlaceholder key={index} />
        ))}
      </div>
    </section>
  )
}
