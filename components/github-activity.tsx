import { getFormatter, getTranslations } from 'next-intl/server'
import { getContributions } from '@/lib/github'
import { buttonVariants } from './ui/button'
import { Icons } from './icons'
import { GithubHeatmap } from './github-heatmap'

export async function GithubActivity({ username }: { username: string }) {
  const data = await getContributions(username)
  if (!data) return null

  const t = await getTranslations('Github')
  const format = await getFormatter()
  const stats = [
    { value: format.number(data.commits), label: t('commits') },
    { value: format.number(data.pullRequests), label: t('pullRequests') },
    {
      value: format.number(data.activeDays),
      label: t('activeDays', { days: data.counts.length }),
    },
    {
      value: t('streak', { count: data.longestStreak }),
      label:
        data.currentStreak === data.longestStreak
          ? t('longestOngoing')
          : t('longest'),
    },
  ]

  return (
    <div className="mt-[clamp(64px,8vw,104px)] grid gap-7">
      <div className="rule reveal-draw" aria-hidden />
      <div className="reveal flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="grid min-w-0 gap-3.5">
          <p className="eyebrow">GitHub · @{username}</p>
          <h3 className="type-h3 text-[clamp(1.7rem,3.2vw,2.5rem)] font-[700] [font-stretch:115%]">
            {t.rich('title', {
              total: data.total,
              b: (chunks) => (
                <b className="font-[inherit] text-accent tabular-nums">
                  {chunks}
                </b>
              ),
            })}
          </h3>
          <p className="max-w-[60ch] text-muted">
            {t('sub', {
              private: format.number(data.privateCount),
              since: data.since,
            })}
          </p>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: 'outline' })}
        >
          {t('profile')}
          <Icons.ArrowUpRight />
        </a>
      </div>
      <dl className="grid grid-cols-2 border-t border-line min-[900px]:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={
              'reveal grid gap-1 py-[18px] pr-4 ' +
              (index > 0
                ? 'min-[900px]:border-l min-[900px]:border-line min-[900px]:pl-5'
                : '')
            }
          >
            <dt className="font-display text-[1.7rem] leading-none font-[700] tracking-[-0.03em] tabular-nums [font-stretch:110%]">
              {stat.value}
            </dt>
            <dd className="text-[0.88rem] text-muted">{stat.label}</dd>
          </div>
        ))}
      </dl>
      <GithubHeatmap
        start={data.start}
        counts={data.counts}
        thresholds={data.thresholds}
      />
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 font-mono text-[0.72rem] text-faint">
        <span>
          {t('record', {
            count: data.max,
            date: format.dateTime(new Date(`${data.maxDate}T12:00:00Z`), {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'UTC',
            }),
          })}{' '}
          · {t('source')}
        </span>
        <span aria-hidden className="inline-flex items-center gap-1">
          <span className="mr-1">{t('less')}</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <i
              key={level}
              className={`heat-${level} block size-[11px] rounded-[3px]`}
            />
          ))}
          <span className="ml-1">{t('more')}</span>
        </span>
      </div>
    </div>
  )
}
