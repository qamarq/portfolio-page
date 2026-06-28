import { Star } from "lucide-react";
import { getRepoStars } from "@/lib/github";

export async function RepoStars({ repo }: { repo: string }) {
  const stars = await getRepoStars(repo);
  if (stars === null) return null;

  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener"
      className="group mt-3 inline-flex w-fit items-center gap-1.5 rounded-md border border-(--border) px-2.5 py-1 font-mono text-xs transition-colors hover:border-(--border-hover)"
    >
      <span className="flex items-center gap-1 text-(--warning) transition-[filter] group-hover:brightness-125">
        <Star className="h-3 w-3 fill-current" fill="#f98345" />
        {stars}
      </span>
      <span className="text-(--text-muted)">view source of this website</span>
    </a>
  );
}
