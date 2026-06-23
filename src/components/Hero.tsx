import { Suspense } from "react";
import Image from "next/image";
import { Tag } from "./Tag";
import { RepoStars } from "./RepoStars";
import { SkeletonBar } from "./Skeleton";
import { getAboutContent } from "@/lib/content";

const PORTFOLIO_REPO = "qamarq/portfolio-page";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Hero() {
  const about = getAboutContent();

  return (
    <div className="card">
      <div className="flex flex-col gap-4 sm:flex-row">
        {about.avatar ? (
          <Image
            src={about.avatar}
            alt={about.name}
            width={112}
            height={112}
            className="h-28 w-28 shrink-0 rounded-2xl border border-(--accent) object-cover"
          />
        ) : (
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-(--accent) font-mono text-2xl text-(--accent)">
            {getInitials(about.name)}
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-[20px] font-medium text-foreground">
            {about.name}
          </p>
          <p className="font-mono text-xs text-(--accent)">{about.title}</p>

          <p className="mt-3 text-[13px] leading-[1.65] text-(--text-muted)">
            {about.bio}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {about.tags.map((tag) => (
          <Tag key={tag.label} {...tag} />
        ))}
      </div>

      <Suspense fallback={<SkeletonBar className="mt-3 h-7 w-48" />}>
        <RepoStars repo={PORTFOLIO_REPO} />
      </Suspense>
    </div>
  );
}
