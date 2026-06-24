import { Code2, Globe } from "lucide-react";
import { Tag } from "./Tag";
import { getProjects } from "@/lib/content";
import type { ProjectStatus } from "@/lib/types";

const BADGE_STYLES: Record<ProjectStatus, string> = {
  active:
    "bg-[var(--badge-active-bg)] text-[var(--badge-active-text)] border-[var(--badge-active-border)]",
  wip: "bg-[var(--badge-wip-bg)] text-[var(--badge-wip-text)] border-[var(--badge-wip-border)]",
  shipped:
    "bg-[var(--badge-shipped-bg)] text-[var(--badge-shipped-text)] border-[var(--badge-shipped-border)]",
};

export function ProjectsGrid({ children }: { children?: React.ReactNode }) {
  const projects = getProjects();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {children}
      {projects.map((project) => (
        <div key={project.name} className="card">
          <div className="flex items-start justify-between gap-2">
            <p className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-primary)]">
              {project.icon}
              {project.name}
            </p>
            <span
              className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] ${BADGE_STYLES[project.status]}`}
            >
              {project.status}
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-[1.55] text-(--text-muted)">
            {project.desc}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Tag key={tag.label} {...tag} />
            ))}
          </div>

          {(project.websiteUrl || project.githubUrl) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-(--text-muted) transition-colors hover:border-[var(--border-hover)]"
                >
                  <Globe className="h-3 w-3" />
                  website
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-(--text-muted) transition-colors hover:border-[var(--border-hover)]"
                >
                  <Code2 className="h-3 w-3" />
                  github
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
