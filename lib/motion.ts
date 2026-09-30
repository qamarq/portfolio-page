export const SCROLLED_OFFSET = 24

export const REVEAL_SELECTOR =
  '.reveal, .reveal-lines, .reveal-draw, .reveal-cells, article .prose-case > *'

export function trackScrollState(offset: number) {
  const root = document.documentElement
  const sync = () =>
    root.toggleAttribute('data-scrolled', window.scrollY > offset)
  const settle = () => root.toggleAttribute('data-settled', true)
  const restoring = new ResizeObserver(sync)

  sync()
  restoring.observe(root)
  window.addEventListener('scroll', sync, { passive: true })
  window.addEventListener(
    'load',
    () => {
      restoring.disconnect()
      requestAnimationFrame(() => requestAnimationFrame(settle))
    },
    { once: true }
  )
  for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown'])
    window.addEventListener(type, settle, { once: true, passive: true })
}

function playEntrance(element: Element, delay: number) {
  const styles = getComputedStyle(document.documentElement)
  const soft = styles.getPropertyValue('--ease-soft').trim()
  const spring = styles.getPropertyValue('--ease-spring').trim()
  const run = (
    target: Element,
    keyframes: PropertyIndexedKeyframes,
    options: KeyframeAnimationOptions
  ) =>
    target.animate(keyframes, {
      easing: soft,
      fill: 'backwards',
      ...options,
      delay: delay + Number(options.delay ?? 0),
    })

  if (element.matches('.reveal-lines')) {
    element
      .querySelectorAll('.line > span')
      .forEach((line, index) =>
        run(
          line,
          { transform: ['translateY(105%) rotate(4deg)', 'none'] },
          { duration: 1000, delay: index * 90 }
        )
      )
  } else if (element.matches('.reveal-draw')) {
    run(
      element,
      { clipPath: ['inset(-6px 100% -6px -6px)', 'inset(-6px)'] },
      { duration: 1200 }
    )
  } else if (element.matches('.reveal-cells')) {
    for (const cell of element.children) {
      const { style } = cell as HTMLElement
      const step =
        Number(style.getPropertyValue('--col')) +
        Number(style.getPropertyValue('--row'))
      run(
        cell,
        { opacity: [0, 1], scale: [0.4, 1] },
        { duration: 600, easing: spring, delay: step * 12 }
      )
    }
  } else {
    run(
      element,
      { opacity: [0, 1], translate: ['0 28px', '0 0'] },
      { duration: 800 }
    )
    if (element.matches('.timeline-item')) {
      run(
        element,
        { scale: [0, 1] },
        { duration: 700, easing: spring, delay: 150, pseudoElement: '::before' }
      )
      run(
        element,
        { scale: ['1 0', '1 1'] },
        { duration: 900, delay: 300, pseudoElement: '::after' }
      )
    }
  }
}

export function revealOnEnter(selector: string) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const holds = new Map<Element, Animation>()
  const revealed = new WeakSet<Element>()
  const observer = new IntersectionObserver(
    (entries) => {
      let order = 0
      for (const entry of entries) {
        const above = entry.boundingClientRect.bottom < 0
        if (!entry.isIntersecting && !above) continue
        observer.unobserve(entry.target)
        holds.get(entry.target)?.cancel()
        holds.delete(entry.target)
        revealed.add(entry.target)
        playEntrance(entry.target, Math.min(order++, 5) * 80)
      }
    },
    { rootMargin: '0px 0px -10% 0px' }
  )
  const arm = (element: Element) => {
    if (revealed.has(element) || holds.has(element)) return
    const { top, height } = element.getBoundingClientRect()
    if (height > 0 && top < window.innerHeight * 0.9) {
      revealed.add(element)
      return
    }
    holds.set(
      element,
      element.animate({ opacity: [0, 0] }, { fill: 'forwards' })
    )
    observer.observe(element)
  }

  document.querySelectorAll(selector).forEach(arm)
  const mutations = new MutationObserver((records) => {
    for (const record of records)
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue
        if (node.matches(selector)) arm(node)
        node.querySelectorAll(selector).forEach(arm)
      }
  })
  mutations.observe(document.body, { childList: true, subtree: true })

  return () => {
    observer.disconnect()
    mutations.disconnect()
    holds.forEach((hold) => hold.cancel())
  }
}
