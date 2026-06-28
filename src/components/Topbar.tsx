"use client";

import { useClock } from "@/hooks/useClock";

export function Topbar() {
  const time = useClock("Europe/Warsaw");

  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] py-4">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full bg-[var(--accent)] pulse-dot"
          aria-hidden
        />
        <span className="font-mono text-sm text-[var(--accent)]">
          kamilmarczak.pl
        </span>
      </div>
      <span className="font-mono text-sm text-[var(--text-secondary)]">
        {time ? `${time} CET` : "—"}
      </span>
    </div>
  );
}
