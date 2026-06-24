import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Tag } from "@/components/Tag";
import { getBlogPost, getBlogPosts } from "@/lib/blog";

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Kamil Marczak`,
    description: post.excerpt,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-300 px-5">
      <Topbar />
      <div className="py-6">
        <Link
          href="/blog"
          className="flex items-center gap-1.5 font-mono text-xs text-(--text-muted) transition-colors hover:text-(--accent)"
        >
          <ArrowLeft className="h-3 w-3" />
          all posts
        </Link>

        <article className="mt-6 card">
          <p className="font-mono text-[11px] text-(--text-muted)">
            {formatDate(post.date)}
          </p>
          <h1 className="mt-1.5 text-xl font-medium text-(--text-primary)">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Tag key={tag.label} {...tag} />
              ))}
            </div>
          )}

          <div
            className="blog-content mt-4 border-t border-(--muted-bg) pt-4"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      </div>
    </div>
  );
}

export const dynamicParams = false;
