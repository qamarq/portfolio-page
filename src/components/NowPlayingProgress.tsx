"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Props {
  progressMs: number;
  durationMs: number;
  fetchedAt: number;
}

export function NowPlayingProgress({
  progressMs,
  durationMs,
  fetchedAt,
}: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const refreshScheduled = useRef(false);

  useEffect(() => {
    refreshScheduled.current = false;
    let rafId: number;

    function tick() {
      const elapsed = Date.now() - fetchedAt;
      const current = Math.min(progressMs + elapsed, durationMs);
      const pct = (current / durationMs) * 100;

      if (barRef.current) barRef.current.style.width = `${pct}%`;

      if (current >= durationMs) {
        if (!refreshScheduled.current) {
          refreshScheduled.current = true;
          setTimeout(() => router.refresh(), 3000);
        }
        return;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [progressMs, durationMs, fetchedAt, router]);

  return (
    <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-(--muted-bg)">
      <div
        ref={barRef}
        className="h-full rounded-full bg-(--accent)"
        style={{ width: "0%" }}
      />
    </div>
  );
}
