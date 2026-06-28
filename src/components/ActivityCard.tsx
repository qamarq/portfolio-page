import Image from "next/image";
import { getContributions } from "@/lib/github";
import { SkeletonBar } from "./Skeleton";

export function ActivityCardSkeleton() {
  return (
    <div className="card">
      <p className="card-label">activity</p>
      <SkeletonBar className="mb-3 h-4 w-48" />
      <SkeletonBar className="h-[88px] w-full" />
      <div className="mt-2 flex justify-end">
        <SkeletonBar className="h-3 w-32" />
      </div>
    </div>
  );
}

const HEATMAP_COLORS: Record<number, string> = {
  0: "var(--heatmap-0)",
  1: "var(--heatmap-1)",
  2: "var(--heatmap-2)",
  3: "var(--heatmap-3)",
  4: "var(--heatmap-4)",
};

export async function ActivityCard() {
  const { weeks, monthLabels, totalContributions, organizations } =
    await getContributions();

  return (
    <div className="card">
      <p className="card-label">activity</p>
      <p className="mb-3 text-[13px] text-(--text-secondary)">
        <span className="font-mono text-foreground">{totalContributions}</span>{" "}
        contributions in the last year
      </p>

      <div className="relative mb-1 h-3 w-full">
        {monthLabels.map(({ label, week }) => (
          <span
            key={`${label}-${week}`}
            className="absolute font-mono text-[10px] text-(--text-muted)"
            style={{ left: `${(week / weeks.length) * 100}%` }}
          >
            {label}
          </span>
        ))}
      </div>

      <div
        className="grid w-full grid-flow-col gap-[2.5px]"
        style={{
          gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
          gridTemplateRows: "repeat(7, minmax(0, 1fr))",
          aspectRatio: `${weeks.length} / 7`,
        }}
      >
        {weeks.map((week, weekIdx) =>
          week.map((level, dayIdx) => (
            <span
              key={`${weekIdx}-${dayIdx}`}
              className="rounded-xs"
              style={{ background: HEATMAP_COLORS[level] }}
            />
          )),
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        {organizations.length > 0 ? (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-(--text-muted)">
              contributed to
            </span>
            <div className="flex items-center gap-1">
              {organizations.map((org) =>
                org.avatarUrl ? (
                  <Image
                    key={org.login}
                    src={org.avatarUrl}
                    alt={org.login}
                    width={16}
                    height={16}
                    title={org.login}
                    className="rounded-full"
                  />
                ) : (
                  <span
                    key={org.login}
                    title={org.login}
                    className="rounded-full border border-(--border) px-1.5 py-0.5 font-mono text-[10px] text-(--text-muted)"
                  >
                    {org.login}
                  </span>
                ),
              )}
            </div>
          </div>
        ) : (
          <span />
        )}

        <div className="flex gap-1 font-mono items-center text-[10px] text-(--text-muted)">
          <span className="mr-1">less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className="h-2.5 w-2.5 rounded-xs"
              style={{ background: HEATMAP_COLORS[level] }}
            />
          ))}
          <span className="ml-1">more</span>
        </div>
      </div>
    </div>
  );
}
