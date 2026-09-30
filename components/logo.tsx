import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="5 12 54 40"
      aria-hidden
      className={cn('overflow-visible', className)}
    >
      <path
        fill="currentColor"
        d="M7.04 14h10.5v36H7.04zM29.45 14h13.17L15.2 46H9.04v-8.18zM14.54 29h13.05l15.47 21H30.02z"
      />
      <circle
        cx="51.76"
        cy="44.8"
        r="5.2"
        className="fill-accent transition-transform duration-500 ease-spring group-hover:-translate-y-2"
      />
    </svg>
  )
}
