import { getRecentCommits } from "@/lib/github";

export async function CommitsCard() {
  const commits = await getRecentCommits();

  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2 text-[var(--text-secondary)]">
        <p className="font-mono text-[13px] font-medium tracking-[0.05em]">
          RECENT COMMITS
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {commits.map((commit, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-[1.4] text-[var(--text-primary)]">
                {commit.message}
              </p>
              <p className="mt-1 font-mono text-[12px] text-(--text-muted)">
                {commit.author} · {commit.repo}
              </p>
            </div>
            <span className="mt-0.5 shrink-0 font-mono text-[12px] text-(--text-muted)">
              {commit.timeAgo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
