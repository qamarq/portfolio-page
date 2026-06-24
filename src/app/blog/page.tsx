import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Tag } from "@/components/Tag";
import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Kamil Marczak",
  description: "Case studies and write-ups on things I've built and broken.",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getBlogPosts();

  return (
    <div className="mx-auto max-w-300 px-5">
      <Topbar />
      <div className="py-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-mono text-xs text-(--text-muted) transition-colors hover:text-(--accent)"
        >
          <ArrowLeft className="h-3 w-3" />
          back home
        </Link>

        <h1 className="mt-6 text-xl font-medium text-(--text-primary)">
          Blog
        </h1>
        <p className="mt-1 text-sm text-(--text-muted)">
          Case studies and write-ups on things I&apos;ve built and broken.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {posts.length === 0 && (
            <p className="font-mono text-xs text-(--text-muted)">
              no posts yet
            </p>
          )}
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group card"
            >
              <p className="font-mono text-[11px] text-(--text-muted)">
                {formatDate(post.date)}
              </p>
              <p className="mt-1.5 text-[15px] font-medium text-(--text-primary) transition-colors group-hover:text-(--accent)">
                {post.title}
              </p>
              <p className="mt-1.5 text-[13px] leading-[1.55] text-(--text-muted)">
                {post.excerpt}
              </p>
              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Tag key={tag.label} {...tag} />
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
