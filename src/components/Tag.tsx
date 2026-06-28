import type { Tag as TagType } from "@/lib/types";

const TAG_STYLES: Record<TagType["color"], string> = {
  teal: "bg-[var(--tag-teal-bg)] text-[var(--tag-teal-text)] border-[var(--tag-teal-border)]",
  blue: "bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)] border-[var(--tag-blue-border)]",
  purple:
    "bg-[var(--tag-purple-bg)] text-[var(--tag-purple-text)] border-[var(--tag-purple-border)]",
};

export function Tag({ label, color, icon }: TagType) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] ${TAG_STYLES[color]}`}
    >
      {icon}
      {label}
    </span>
  );
}
