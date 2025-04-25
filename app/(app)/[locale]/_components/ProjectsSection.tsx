import config from '@payload-config'
import { getPayload } from 'payload'
import ProjectCard, { ProjectCardPlaceholder } from '@/components/project-card'
import { Locales } from '@/i18n/routing'

export async function ProjectsSection({ locale }: { locale: Locales }) {
  const payload = await getPayload({ config })
  const { docs: projects } = await payload.find({
    collection: 'projects',
    depth: 2,
    locale,
  })

  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 gap-y-24">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

export function ProjectsSuspense() {
  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 gap-y-24">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProjectCardPlaceholder key={index} />
      ))}
    </div>
  )
}
