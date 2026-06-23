"use client";

import { useClock } from "@/hooks/useClock";

export function ClockDisplay({ timeZone }: { timeZone?: string }) {
  const time = useClock(timeZone);
  return (
    <p className="font-mono text-[13px] text-[var(--text-primary)]">
      {time ?? "—"}
    </p>
  );
}
