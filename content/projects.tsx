import type { Project } from "@/lib/types";

// Order in this array is display order. Each tag (and the project itself)
// accepts an optional `icon` ReactNode, e.g. icon: <SiNextdotjs className="h-3 w-3" />
export const projects: Project[] = [
  {
    name: "10BPS",
    status: "active",
    desc: "Stock market intelligence platform — Reddit sentiment tracking, social analytics & screener UI for investors.",
    websiteUrl: null,
    githubUrl: null,
    tags: [
      { label: "Next.js", color: "blue" },
      { label: "Prisma", color: "teal" },
      { label: "Reddit API", color: "teal" },
    ],
  },
  {
    name: "Solvro Planer",
    status: "active",
    desc: "Course planner for PWr students. Leading ~50 devs as CTO — Coolify deploy, SEO, CI/CD pipelines.",
    websiteUrl: "https://planer.solvro.pl",
    githubUrl: "https://github.com/solvro/web-planer",
    tags: [
      { label: "Next.js", color: "blue" },
      { label: "TypeScript", color: "blue" },
      { label: "Coolify", color: "purple" },
    ],
  },
  {
    name: "ProxOne",
    status: "shipped",
    desc: "Native macOS app for managing Proxmox — SwiftUI, network scanner, Keychain auth, DMG installer.",
    websiteUrl: null,
    githubUrl: null,
    tags: [
      { label: "Swift", color: "purple" },
      { label: "SwiftUI", color: "purple" },
      { label: "Proxmox API", color: "blue" },
    ],
  },
  {
    name: "JellyMusic Cast",
    status: "wip",
    desc: "Custom Chromecast receiver (CAF v3) for Jellyfin — music on TV with a proper UI instead of the default receiver.",
    websiteUrl: "https://files.kamilmarczak.pl/jelly-cast/",
    githubUrl: null,
    tags: [
      { label: "Chromecast", color: "teal" },
      { label: "CAF v3", color: "blue" },
      { label: "Jellyfin", color: "teal" },
    ],
  },
  {
    name: "Homelab",
    status: "active",
    desc: "Proxmox + LXC stack: Jellyfin, Matrix Synapse, AdGuard HA, WireGuard, mautrix bridges, LiveKit SFU.",
    websiteUrl: null,
    githubUrl: null,
    tags: [
      { label: "Proxmox", color: "purple" },
      { label: "Docker", color: "purple" },
      { label: "Matrix", color: "teal" },
    ],
  },
  {
    name: "Marathon Scraper",
    status: "shipped",
    desc: "Python scraper for datasport.pl — ~12k photos, EasyOCR bib number detection, MPS GPU, multiprocessing.",
    websiteUrl: null,
    githubUrl: null,
    tags: [
      { label: "Python", color: "teal" },
      { label: "EasyOCR", color: "teal" },
      { label: "MPS", color: "blue" },
    ],
  },
];
