import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  FileDown,
  Globe,
  Hash,
  Loader2,
  Moon,
  Search,
  Sun,
} from 'lucide-react'
import { SiDiscord, SiGithub, SiLinkedin, SiNpm, SiX } from 'react-icons/si'
import { cn } from '@/lib/utils'

export const Icons = {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  FileDown,
  Globe,
  Hash,
  Moon,
  Search,
  Sun,
  github: SiGithub,
  linkedin: SiLinkedin,
  discord: SiDiscord,
  x: SiX,
  npm: SiNpm,
  Loading: ({ className }: React.HTMLAttributes<HTMLDivElement>) => (
    <Loader2 className={cn('animate-spin w-4 h-4', className)} />
  ),
}
