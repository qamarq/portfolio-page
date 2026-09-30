import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'

const token = process.env.GITHUB_TOKEN ?? process.env.GITHUB_OAUTH_TOKEN

export type Contributions = {
  start: string
  counts: number[]
  total: number
  commits: number
  pullRequests: number
  privateCount: number
  activeDays: number
  longestStreak: number
  currentStreak: number
  max: number
  maxDate: string
  since: string
  thresholds: [number, number, number]
}

type CalendarResponse = {
  data?: {
    user: {
      createdAt: string
      contributionsCollection: {
        totalCommitContributions: number
        totalPullRequestContributions: number
        restrictedContributionsCount: number
        contributionCalendar: {
          totalContributions: number
          weeks: {
            contributionDays: { date: string; contributionCount: number }[]
          }[]
        }
      }
    } | null
  }
}

const CALENDAR_QUERY = `query ($login: String!) {
  user(login: $login) {
    createdAt
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`

export async function getRepoStars(repo: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('github')

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!response.ok) return null
    const data = await response.json()
    return typeof data.stargazers_count === 'number'
      ? data.stargazers_count
      : null
  } catch (error) {
    console.error('Error fetching GitHub stars:', error)
    return null
  }
}

export async function getContributions(
  login: string
): Promise<Contributions | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('github')

  if (!token) return null

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: CALENDAR_QUERY, variables: { login } }),
    })
    if (!response.ok) return null

    const { data } = (await response.json()) as CalendarResponse
    if (!data?.user) return null

    const collection = data.user.contributionsCollection
    const days = collection.contributionCalendar.weeks.flatMap(
      (week) => week.contributionDays
    )
    const counts = days.map((day) => day.contributionCount)

    let longestStreak = 0
    let run = 0
    for (const count of counts) {
      run = count > 0 ? run + 1 : 0
      longestStreak = Math.max(longestStreak, run)
    }

    let index = counts.at(-1) === 0 ? counts.length - 2 : counts.length - 1
    let currentStreak = 0
    while (index >= 0 && counts[index] > 0) {
      currentStreak++
      index--
    }

    const max = Math.max(...counts)
    const active = counts.filter((count) => count > 0).sort((a, b) => a - b)
    const quantile = (q: number) =>
      active[Math.min(active.length - 1, Math.floor(q * active.length))] ?? 0

    return {
      start: days[0].date,
      counts,
      total: collection.contributionCalendar.totalContributions,
      commits: collection.totalCommitContributions,
      pullRequests: collection.totalPullRequestContributions,
      privateCount: collection.restrictedContributionsCount,
      activeDays: active.length,
      longestStreak,
      currentStreak,
      max,
      maxDate: days[counts.indexOf(max)].date,
      since: data.user.createdAt.slice(0, 4),
      thresholds: [quantile(0.25), quantile(0.5), quantile(0.75)],
    }
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error)
    return null
  }
}
