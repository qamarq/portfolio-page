import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Project, ProjectStatus, Tag } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface AboutContent {
  name: string;
  title: string;
  avatar: string | null;
  tags: Tag[];
  bio: string;
}

export function getAboutContent(): AboutContent {
  const file = fs.readFileSync(path.join(CONTENT_DIR, "about.md"), "utf-8");
  const { data, content } = matter(file);

  return {
    name: data.name,
    title: data.title,
    avatar: data.avatar || null,
    tags: data.tags ?? [],
    bio: content.trim(),
  };
}

export function getProjects(): Project[] {
  const dir = path.join(CONTENT_DIR, "projects");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const withOrder = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);

    const project: Project = {
      name: data.name as string,
      status: data.status as ProjectStatus,
      desc: content.trim(),
      tags: (data.tags ?? []) as Tag[],
      websiteUrl: (data.website || null) as string | null,
      githubUrl: (data.github || null) as string | null,
    };

    return {
      project,
      order: typeof data.order === "number" ? data.order : 999,
    };
  });

  return withOrder
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.project);
}
