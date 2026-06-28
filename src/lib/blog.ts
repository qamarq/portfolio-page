import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { BlogPost, BlogPostMeta } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function slugFromFile(file: string): string {
  return file.replace(/\.md$/, "");
}

function readPostFile(file: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
  return matter(raw);
}

function toMeta(file: string): BlogPostMeta {
  const { data, content } = readPostFile(file);

  return {
    slug: slugFromFile(file),
    title: data.title as string,
    date: data.date as string,
    excerpt: (data.excerpt as string) ?? content.trim().slice(0, 160),
    tags: (data.tags ?? []) as BlogPostMeta["tags"],
  };
}

// Files prefixed with `_` (e.g. `_template.md`) are scaffolding, not posts.
function isPostFile(file: string): boolean {
  return file.endsWith(".md") && !file.startsWith("_");
}

export function getBlogPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter(isPostFile);
  return files
    .map(toMeta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | null {
  const file = `${slug}.md`;
  if (!isPostFile(file) || !fs.existsSync(path.join(BLOG_DIR, file))) {
    return null;
  }

  const { data, content } = readPostFile(file);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    excerpt: (data.excerpt as string) ?? content.trim().slice(0, 160),
    tags: (data.tags ?? []) as BlogPostMeta["tags"],
    html: marked.parse(content, { async: false }),
  };
}
