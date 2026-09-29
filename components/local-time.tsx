'use client'

import { useEffect, useState } from 'react'

function format(timeZone: string) {
  return new Intl.DateTimeFormat('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(new Date())
}

// The clock only renders in the browser; the prerendered shell cannot know the current time.
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const update = () => setTime(format(timeZone))
    update()
    const interval = setInterval(update, 20000)
    return () => clearInterval(interval)
  }, [timeZone])

  return <time className="inline-block min-w-[5ch] tabular-nums">{time}</time>
}
