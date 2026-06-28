import type { AboutContent } from "@/lib/types";

export const about: AboutContent = {
  name: "Kamil Marczak",
  title: "CTO @ Solvro · Fullstack Developer · Wrocław, PL",
  // path to an image in /public, e.g. "/avatar.jpg" — leave null to show initials
  avatar: "/me.jpg",
  tags: [
    { label: "Next.js", color: "teal" },
    { label: "Elixir", color: "teal" },
    { label: "Ash Framework", color: "teal" },
    { label: "TypeScript", color: "blue" },
    { label: "Prisma", color: "blue" },
    { label: "Node.js", color: "blue" },
    { label: "Proxmox", color: "purple" },
    { label: "Docker", color: "purple" },
  ],
  bio: "I build tools that actually matter. Leading ~50 engineers at Solvro, shipping stock analytics at AlerGeek Ventures, and running a self-hosted homelab on Proxmox for fun.",
};
