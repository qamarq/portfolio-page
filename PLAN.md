# Portfolio — kamilmarczak.pl

## Overview

Personal portfolio site styled as a live developer dashboard. Dark theme, real data from external APIs, single-page with no frameworks — just Next.js (App Router) for the shell and vanilla fetch for data.

The site should feel like looking at someone's actual dev environment, not a template. Every widget shows real or real-looking data. Nothing is decorative for its own sake.

---

## Tech stack

- **Next.js 14+ (App Router)** — `src/app/` structure
- **TypeScript** — strict mode
- **Tailwind CSS** — utility classes only, no component libraries
- **No UI library** (no shadcn, no radix) — everything hand-built
- Google Fonts: `Geist` (sans) + `Geist Mono` (mono) via `next/font`

---

## Color tokens

Define in `tailwind.config.ts` under `theme.extend.colors`:

```ts
dashboard: {
  bg:       '#0a0a0f',   // page background
  card:     '#0f1117',   // card background
  border:   '#1e2a3a',   // card border
  muted:    '#141a24',   // inner dividers
},
text: {
  primary:  '#e2e8f0',
  secondary:'#a0aec0',
  muted:    '#4a5568',
  accent:   '#64ffda',   // teal — primary accent
  blue:     '#63b3ed',
  purple:   '#b794f4',
  warning:  '#f6ad55',
},
tag: {
  teal:   { bg: '#0d2a25', text: '#64ffda', border: '#1a4a3f' },
  blue:   { bg: '#0d1a2e', text: '#63b3ed', border: '#1a3050' },
  purple: { bg: '#1a1228', text: '#b794f4', border: '#2d1f4a' },
},
heatmap: {
  0: '#161b22',
  1: '#0e4429',
  2: '#006d32',
  3: '#26a641',
  4: '#39d353',
},
status: {
  ok:   '#39d353',
  warn: '#f6ad55',
},
```

---

## File structure

```
src/
  app/
    layout.tsx          # root layout, fonts, metadata
    page.tsx            # main page — assembles all sections
    globals.css         # Tailwind base + custom scrollbar
  components/
    Topbar.tsx          # domain + live clock
    Hero.tsx            # avatar, name, title, bio, tags
    ActivityCard.tsx    # GitHub heatmap + recent commits
    ProjectsGrid.tsx    # 2-col project cards grid
    StravaCard.tsx      # weekly km + progress bar + last run
    HomelabCard.tsx     # service uptime list
    NowPlayingCard.tsx  # Last.fm / mock music widget
    LocationCard.tsx    # city, time, temp, contact links
    CVCard.tsx          # CV download card
  lib/
    github.ts           # GitHub API fetchers
    strava.ts           # Strava API fetchers (optional)
    lastfm.ts           # Last.fm API fetcher (optional)
    types.ts            # shared TypeScript types
  hooks/
    useClock.ts         # live clock, updates every second
```

---

## Layout

Two-column grid, 2fr left / 1fr right, gap 12px. On mobile: single column, right col stacks below.

```
┌─────────────────────────────┬──────────────┐
│ Topbar (full width)         │              │
├──────────────────────────────┴──────────────┤
│ Hero card (full width left col)  │ Strava   │
├──────────────────────────────────┤          │
│ Activity (heatmap + commits)     ├──────────┤
├──────────────────────────────────┤ Homelab  │
│ Projects grid (2×3)              ├──────────┤
│                                  │ Music    │
│                                  ├──────────┤
│                                  │ Location │
│                                  ├──────────┤
│                                  │ CV       │
└──────────────────────────────────┴──────────┘
```

Max width: `1200px`, centered, padding `20px`.

---

## Components — detailed spec

### `Topbar`
- Left: pulsing dot + `kamilmarczak.pl` in mono teal
- Right: live clock `HH:MM:SS CET` via `useClock` hook
- Bottom border: `1px solid #1e2a3a`
- Pulse animation: `opacity 1 → 0.25 → 1`, 2s infinite

### `Hero`
- Avatar: 50×50 circle, teal border, `KM` initials in mono
- Name: 20px, weight 500, `text-primary`
- Title: 12px mono teal — `CTO @ Solvro · Fullstack Developer · Wrocław, PL`
- Bio: 13px, `text-muted`, line-height 1.65
  > "I build tools that actually matter. Leading ~50 engineers at Solvro, shipping stock analytics at AlerGeek Ventures, and running a self-hosted homelab on Proxmox for fun."
- Tags: teal = Next.js, Elixir, Ash Framework / blue = TypeScript, Prisma, Node.js / purple = Proxmox, Docker
- **Portfolio repo star button** — sits below the tags, left-aligned:
  - Renders as a small pill link: `★ 12  view source`
  - `★ 12` = live star count from `GET https://api.github.com/repos/qamarq/kamilmarczak.pl` → `stargazers_count`
  - Fetched server-side via `/api/github/stars?repos=qamarq/kamilmarczak.pl`, same route as other GitHub calls, uses `GITHUB_TOKEN`
  - Pill style: border `0.5px solid #1e2a3a`, border-radius 6px, padding `4px 10px`, font-size 12px mono
  - Star `★` in amber `#f6ad55`, count + "view source" text in `#4a5568`
  - On hover: border color → `#2a3a50`, star brightens slightly
  - `href="https://github.com/qamarq/kamilmarczak.pl"` — update repo slug to whatever you name it
  - Opens in new tab (`target="_blank" rel="noopener"`)
  - If fetch fails: hide the button entirely, don't show 0 or error

### `ActivityCard`

**Heatmap:**
- 52 columns × 7 rows = 364 cells
- Each cell: `10×10px`, `border-radius: 2px`, gap `2.5px`
- Color levels 0–4 mapped to `heatmap.*` tokens
- Month labels row above: Jan–Dec, positioned at correct column
- Legend below right: `less ■ ■ ■ ■ ■ more`
- **Data source:** GitHub API — `GET /users/qamarq/contributions` (use `octokit` or raw fetch with personal token in `.env.local`)
  - Token: `GITHUB_TOKEN` env var
  - Endpoint: `https://api.github.com/graphql` with `contributionsCollection` query
  - If no token, use randomized mock data (same structure)

**Commits list:**
- 4 most recent commit rows
- Each row: teal dot · message · repo (mono, muted) · time ago (mono, muted)
- **Data source:** `GET /users/qamarq/events` (public, no auth needed)
  - Filter for `PushEvent`, extract first commit message + repo name
  - Format time as `Xh ago` / `Xd ago`

### `ProjectsGrid`

2×3 grid of project cards. Each card:
- Name (13px, weight 500) + status badge (top right)
- Description (12px, muted, line-height 1.55)
- Tech tags (bottom)
- Hover: border lightens to `#2a3a50`

Status badge variants:
- `active` → green bg `#0e4429`, text `#39d353`, border `#006d32`
- `wip` → amber bg `#2a1f0a`, text `#f6ad55`, border `#5a3a0a`
- `shipped` → blue bg `#0d1a2e`, text `#63b3ed`, border `#1a3050`

```ts
export const projects = [
  {
    name: '10BPS',
    status: 'active',
    desc: 'Stock market intelligence platform — Reddit sentiment tracking, social analytics & screener UI for investors.',
    tags: [{ label: 'Next.js', color: 'blue' }, { label: 'Prisma', color: 'teal' }, { label: 'Reddit API', color: 'teal' }],
    url: null,
  },
  {
    name: 'Solvro Planer',
    status: 'active',
    desc: 'Course planner for PWr students. Leading ~50 devs as CTO — Coolify deploy, SEO, CI/CD pipelines.',
    tags: [{ label: 'Next.js', color: 'blue' }, { label: 'TypeScript', color: 'blue' }, { label: 'Coolify', color: 'purple' }],
    url: 'https://planer.solvro.pl',
  },
  {
    name: 'ProxOne',
    status: 'shipped',
    desc: 'Native macOS app for managing Proxmox — SwiftUI, network scanner, Keychain auth, DMG installer.',
    tags: [{ label: 'Swift', color: 'purple' }, { label: 'SwiftUI', color: 'purple' }, { label: 'Proxmox API', color: 'blue' }],
    url: null,
  },
  {
    name: 'JellyMusic Cast',
    status: 'wip',
    desc: 'Custom Chromecast receiver (CAF v3) for Jellyfin — music on TV with a proper UI instead of the default receiver.',
    tags: [{ label: 'Chromecast', color: 'teal' }, { label: 'CAF v3', color: 'blue' }, { label: 'Jellyfin', color: 'teal' }],
    url: 'https://files.kamilmarczak.pl/jelly-cast/',
  },
  {
    name: 'Homelab',
    status: 'active',
    desc: 'Proxmox + LXC stack: Jellyfin, Matrix Synapse, AdGuard HA, WireGuard, mautrix bridges, LiveKit SFU.',
    tags: [{ label: 'Proxmox', color: 'purple' }, { label: 'Docker', color: 'purple' }, { label: 'Matrix', color: 'teal' }],
    url: null,
  },
  {
    name: 'Marathon Scraper',
    status: 'shipped',
    desc: 'Python scraper for datasport.pl — ~12k photos, EasyOCR bib number detection, MPS GPU, multiprocessing.',
    tags: [{ label: 'Python', color: 'teal' }, { label: 'EasyOCR', color: 'teal' }, { label: 'MPS', color: 'blue' }],
    url: null,
  },
]
```

### `StravaCard`
- Weekly km stat: big mono number + muted unit
- Progress bar toward 50km/week goal (blue fill)
- Last run: distance · pace · duration
- **Data source:** Strava API (optional — needs OAuth refresh token)
  - Env vars: `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`
  - If not configured: show mock data
  - Fetcher in `lib/strava.ts`
  - Cache with `next/cache` revalidate 3600s

### `HomelabCard`
- List of services with colored dot + name + uptime %
- **Data source:** UptimeKuma public status page JSON (if available at `status.kamilmarczak.pl`) OR hardcoded mock
  - Fetch `https://status.kamilmarczak.pl/api/status-page/main` if it exists
  - Fallback to hardcoded list:

```ts
const services = [
  { name: 'Jellyfin',       status: 'ok',   uptime: '99.9%' },
  { name: 'Matrix Synapse', status: 'ok',   uptime: '99.7%' },
  { name: 'AdGuard Home',   status: 'ok',   uptime: '100%'  },
  { name: 'NPM Proxy',      status: 'ok',   uptime: '99.9%' },
  { name: 'JellyMusic Cast',status: 'warn', uptime: 'wip'   },
]
```

### `NowPlayingCard`
- Album art placeholder (purple square with music icon)
- Track name + artist
- Progress bar (42% static, or live if Last.fm connected)
- **Data source:** Last.fm API
  - Env: `LASTFM_API_KEY`, `LASTFM_USERNAME` (`qamarq` or whatever username)
  - Endpoint: `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=...&api_key=...&format=json&limit=1`
  - If `nowplaying` attr present → show live
  - Else → show last scrobbled track
  - Fallback: static mock (Burning Pile — Mother Mother)
  - Revalidate: 30s

### `LocationCard`
- City, timezone, temperature (OpenWeather API or wttr.in)
- Live local time via `useClock`
- Contact section below divider:
  ```
  github·  @qamarq
  email·   me@kamilmarczak.pl
  matrix·  @qamarq:matrix.kamilmarczak.pl
  ```
- **Weather source:** `https://wttr.in/Wroclaw?format=j1` — no API key needed
  - Revalidate: 1800s

### `CVCard`

Simple card at the bottom of the right column. No live data — static.

Layout:
```
┌──────────────────────────┐
│ RESUME                   │
│                          │
│  Kamil Marczak           │
│  Fullstack Developer      │
│  Last updated: Jun 2025  │
│                          │
│  [↓ Download PDF]        │
└──────────────────────────┘
```

Details:
- Label: `resume` (uppercase mono muted, same style as other card labels)
- Name + role in sans-serif, text-primary / text-muted
- "Last updated" line in mono muted — hardcode the date, update manually
- Download button: full-width, teal border, teal text, transparent bg, mono font
  - On click: triggers browser download of `/cv.pdf`
  - Button text: `↓ download pdf`
  - Hover: teal bg at 10% opacity (`#64ffda1a`)
- CV file: place `cv.pdf` in `public/cv.pdf` — Next.js serves it statically at `/cv.pdf`
- The `<a>` tag should have `href="/cv.pdf"` + `download="Kamil_Marczak_CV.pdf"` — no JS needed
- No view/preview button — download only, keeps it clean

```tsx
export function CVCard() {
  return (
    <div className="card">
      <p className="card-label">resume</p>
      <div className="mb-4">
        <p className="text-sm font-medium text-primary">Kamil Marczak</p>
        <p className="text-xs text-muted mt-0.5">Fullstack Developer</p>
        <p className="text-xs text-muted font-mono mt-3">last updated: Jun 2025</p>
      </div>
      <a
        href="/cv.pdf"
        download="Kamil_Marczak_CV.pdf"
        className="cv-download-btn"
      >
        ↓ download pdf
      </a>
    </div>
  )
}
```

CSS for `.cv-download-btn`:
```css
.cv-download-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 0.5px solid #64ffda;
  border-radius: 8px;
  color: #64ffda;
  font-family: var(--font-mono);
  font-size: 12px;
  text-align: center;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: background 150ms ease;
}
.cv-download-btn:hover {
  background: #64ffda1a;
}
```

---

## Data fetching strategy

All external API calls are **server-side** in Next.js Route Handlers or `async` Server Components.

```
src/app/api/
  github/route.ts        # returns { heatmap: number[][], commits: Commit[], portfolioStars: number }
  strava/route.ts        # returns { weeklyKm: number, lastRun: Run }
  lastfm/route.ts        # returns { track: string, artist: string, isLive: boolean }
  weather/route.ts       # returns { temp: number, condition: string }
```

Each route:
- Tries real API first
- Falls back to mock data if env vars missing or request fails
- Returns JSON, consumed by client components via `useSWR` or simple `fetch` in `useEffect`

---

## Environment variables (`.env.local`)

```env
GITHUB_TOKEN=ghp_...

STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
STRAVA_REFRESH_TOKEN=

LASTFM_API_KEY=
LASTFM_USERNAME=qamarq

# optional
UPTIME_KUMA_URL=https://status.kamilmarczak.pl
```

---

## Animations

- **Pulse dot** (topbar): CSS keyframe, opacity 1→0.25→1, 2s infinite
- **Card hover**: `transition: border-color 150ms ease` — no scale, no shadow
- **Heatmap cells**: no animation, just static colors
- **Progress bars**: CSS width set via inline style, no JS animation
- No scroll-triggered animations (keep it fast and clean)

---

## Responsive

- Desktop: 2-column grid as described above
- Tablet (< 900px): 2-column collapses to 1-column, right col stacks below left
- Mobile (< 640px): single column, project grid goes 1-col, font sizes slightly reduced

Use Tailwind breakpoints: `sm:`, `md:`, `lg:`

---

## Performance requirements

- Lighthouse score ≥ 95 on all categories
- No CLS — all cards have fixed min-heights or skeleton placeholders while data loads
- Images: none (avatar is CSS initials, no photos)
- Fonts: `next/font` with `display: swap`
- API routes cached at edge where possible

---



## What NOT to do

- No animations that feel AI-generated (no floating particles, no morphing blobs)
- No drop shadows
- No emoji in the UI
- No color outside the defined token set
- Don't add "About Me" section — the bio in Hero is enough
- Don't add a navbar — single page, no scrolling nav needed
- Don't use any component library (shadcn, radix, headless UI)
- Don't forget to place `cv.pdf` in `public/cv.pdf` before deploying — the CV card will render fine without it but the download will 404