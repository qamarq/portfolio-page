import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tag } from "./Tag";
import { getBlogPosts } from "@/lib/blog";

const RECENT_COUNT = 3;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogCard() {
  const posts = getBlogPosts().slice(0, RECENT_COUNT);

  if (posts.length === 0) return null;

  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between">
        <p className="card-label !mb-0">blog</p>
        <Link
          href="/blog"
          className="flex items-center gap-1 font-mono text-xs text-(--text-muted) transition-colors hover:text-(--accent)"
        >
          all posts <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-lg border border-(--border) p-3 transition-colors hover:border-(--border-hover)"
          >
            <p className="font-mono text-[10px] text-(--text-muted)">
              {formatDate(post.date)}
            </p>
            <p className="mt-1.5 text-[13px] font-medium text-(--text-primary) transition-colors group-hover:text-(--accent)">
              {post.title}
            </p>
            <p className="mt-1.5 line-clamp-3 text-[12px] leading-[1.55] text-(--text-muted)">
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
  );
}
