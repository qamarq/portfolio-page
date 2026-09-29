'use client'

import { useEffect, useState } from 'react'

function format(timeZone: string) {
  return new Intl.DateTimeFormat('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(new Date())
}

export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState(() => format(timeZone))

  useEffect(() => {
    setTime(format(timeZone))
    const interval = setInterval(() => setTime(format(timeZone)), 20000)
    return () => clearInterval(interval)
  }, [timeZone])

  return <time suppressHydrationWarning>{time}</time>
}
