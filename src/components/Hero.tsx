import { Star } from "lucide-react";
import Image from "next/image";
import { Tag } from "./Tag";
import { getRepoStars } from "@/lib/github";
import { getAboutContent } from "@/lib/content";

const PORTFOLIO_REPO = "qamarq/portfolio-page";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export async function Hero() {
  const about = getAboutContent();
  const stars = await getRepoStars(PORTFOLIO_REPO);

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

      {stars !== null && (
        <a
          href={`https://github.com/${PORTFOLIO_REPO}`}
          target="_blank"
          rel="noopener"
          className="group mt-3 inline-flex w-fit items-center gap-1.5 rounded-md border border-(--border) px-2.5 py-1 font-mono text-xs transition-colors hover:border-(--border-hover)"
        >
          <span className="flex items-center gap-1 text-(--warning) transition-[filter] group-hover:brightness-125">
            <Star className="h-3 w-3 fill-current" fill="#f98345" />
            {stars}
          </span>
          <span className="text-(--text-muted)">
            view source of this website
          </span>
        </a>
      )}
    </div>
  );
}
