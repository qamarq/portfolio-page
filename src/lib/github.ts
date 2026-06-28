import { withCache } from "./cache";
import type { Commit, HeatmapData, Organization } from "./types";

const GITHUB_USERNAME = "qamarq";
const ONE_HOUR_MS = 60 * 60 * 1000;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

function weekStartDates(count: number): Date[] {
  const end = startOfWeek(new Date());
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(end);
    d.setDate(d.getDate() - (count - 1 - i) * 7);
    return d;
  });
}

function monthLabelsFromDates(
  dates: Date[],
): { label: string; week: number }[] {
  const labels: { label: string; week: number }[] = [];
  let lastMonth = -1;
  dates.forEach((date, week) => {
    const month = date.getMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month], week });
      lastMonth = month;
    }
  });
  return labels;
}

const MOCK_ORGANIZATIONS: Organization[] = [
  { login: "Solvro", avatarUrl: null },
  { login: "Alergeek-Ventures", avatarUrl: null },
];

function mockHeatmap(): HeatmapData {
  const weeks: number[][] = Array.from({ length: 52 }, () =>
    Array.from({ length: 7 }, () => Math.floor(Math.random() ** 2 * 5)),
  );
  const totalContributions = weeks.flat().reduce((sum, level) => {
    if (level === 0) return sum;
    return sum + level * 3;
  }, 0);

  return {
    weeks,
    monthLabels: monthLabelsFromDates(weekStartDates(52)),
    totalContributions,
    organizations: MOCK_ORGANIZATIONS,
  };
}

async function getContributionsImpl(): Promise<HeatmapData> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return mockHeatmap();

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
          commitContributionsByRepository(maxRepositories: 100) {
            repository {
              owner {
                login
                avatarUrl
                __typename
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return mockHeatmap();

    const json = await res.json();
    const collection = json?.data?.user?.contributionsCollection;
    const rawWeeks = collection?.contributionCalendar?.weeks;
    if (!Array.isArray(rawWeeks)) return mockHeatmap();

    type Day = { contributionCount: number; date: string };
    const allWeeks: Day[][] = rawWeeks.map(
      (w: { contributionDays: Day[] }) => w.contributionDays,
    );

    const last52 = allWeeks.slice(-52);
    const counts = last52.map((week) => week.map((d) => d.contributionCount));
    const max = Math.max(1, ...counts.flat());
    const weeks = counts.map((week) =>
      week.map((count) => {
        if (count === 0) return 0;
        const ratio = count / max;
        if (ratio > 0.75) return 4;
        if (ratio > 0.5) return 3;
        if (ratio > 0.25) return 2;
        return 1;
      }),
    );

    const weekDates = last52.map((week) => new Date(week[0].date));
    const totalContributions: number =
      collection?.contributionCalendar?.totalContributions ?? 0;

    const repos = collection?.commitContributionsByRepository ?? [];
    const seen = new Set<string>();
    const organizations: Organization[] = [];
    for (const { repository } of repos) {
      const owner = repository?.owner;
      if (!owner || owner.__typename !== "Organization") continue;
      if (seen.has(owner.login)) continue;
      seen.add(owner.login);
      organizations.push({ login: owner.login, avatarUrl: owner.avatarUrl });
      if (organizations.length === 6) break;
    }

    return {
      weeks,
      monthLabels: monthLabelsFromDates(weekDates),
      totalContributions,
      organizations,
    };
  } catch {
    return mockHeatmap();
  }
}

export const getContributions = withCache(getContributionsImpl, {
  ttlMs: ONE_HOUR_MS,
  maxSize: 1,
});

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const hours = Math.floor(seconds / 3600);
  if (hours < 1) return `${Math.max(1, Math.floor(seconds / 60))}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

async function fetchCommitMessage(
  repo: string,
  sha: string,
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/commits/${sha}`,
      { headers: authHeaders(), next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.commit?.message?.split("\n")[0] ?? null;
  } catch {
    return null;
  }
}

async function getRecentCommitsImpl(): Promise<Commit[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) throw new Error("github events failed");

    const events = await res.json();
    const pushEvents = events.filter(
      (event: { type: string }) => event.type === "PushEvent",
    );

    const commits: Commit[] = [];
    for (const event of pushEvents) {
      if (commits.length === 4) break;
      const sha = event.payload?.head;
      if (!sha) continue;

      const message = await fetchCommitMessage(event.repo.name, sha);
      if (!message) continue;

      commits.push({
        message,
        author: event.actor.login,
        repo: event.repo.name.split("/")[1],
        timeAgo: timeAgo(new Date(event.created_at)),
      });
    }

    return commits.length > 0 ? commits : mockCommits();
  } catch {
    return mockCommits();
  }
}

export const getRecentCommits = withCache(getRecentCommitsImpl, {
  ttlMs: ONE_HOUR_MS,
  maxSize: 1,
});

function mockCommits(): Commit[] {
  return [
    {
      message: "feat: add reddit mention volume tracking for ~350 stocks",
      author: "av-x",
      repo: "10bps/stock-analytics",
      timeAgo: "2h ago",
    },
    {
      message: "fix: adguard home keepalived VRRP failover on LXC 124",
      author: "homelab",
      repo: "proxmox-configs",
      timeAgo: "7h ago",
    },
    {
      message:
        "chore: migrate planer.solvro.pl → Coolify, fix ESM/CJS conflict",
      author: "Solvro",
      repo: "web-planer",
      timeAgo: "1d ago",
    },
    {
      message:
        "study: Ash Framework — resources & changesets vs Prisma patterns",
      author: "personal",
      repo: "elixir-learning",
      timeAgo: "2d ago",
    },
  ];
}

async function getRepoStarsImpl(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: authHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return typeof json.stargazers_count === "number"
      ? json.stargazers_count
      : null;
  } catch {
    return null;
  }
}

export const getRepoStars = withCache(getRepoStarsImpl, {
  ttlMs: ONE_HOUR_MS,
  keyFn: (repo) => repo,
});
