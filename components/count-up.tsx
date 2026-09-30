'use client'

import { useEffect, useRef, useState } from 'react'

const DURATION = 1400

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const target = Number(value)
    const intro = ref.current?.closest('.intro-fade')?.getAnimations()[0]
    if (!intro || !Number.isFinite(target)) return
    const wait =
      Number(intro.effect?.getTiming().delay ?? 0) -
      Number(intro.currentTime ?? 0)
    if (wait <= 0) return

    const decimals = value.split('.')[1]?.length ?? 0
    const start = performance.now() + wait
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(Math.max((now - start) / DURATION, 0), 1)
      const eased = 1 - Math.pow(2, -10 * progress)
      setShown(progress === 1 ? value : (target * eased).toFixed(decimals))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      setShown(value)
    }
  }, [value])

  return <span ref={ref}>{shown}</span>
}
