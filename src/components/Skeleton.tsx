export function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-(--muted-bg) ${className ?? ""}`}
    />
  );
}
