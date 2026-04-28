import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

interface ScrambleTextProps {
  children: string
  delayMs?: number
  className?: string
  // When provided, replaces the viewport trigger.
  // Scramble re-plays each time this flips to true.
  trigger?: boolean
}

export function ScrambleText({ children, delayMs = 0, className, trigger }: ScrambleTextProps) {
  // useRef typed as Element so it satisfies framer-motion's RefObject<Element | null>
  const ref        = useRef<Element>(null)
  const isInView   = useInView(ref as React.RefObject<Element>, { once: true, margin: '-20px' })
  const rafRef     = useRef<number | undefined>(undefined)
  const shouldStart = trigger !== undefined ? trigger : isInView

  const [chars, setChars] = useState<{ c: string; s: boolean }[]>(
    () => children.split('').map(c => ({ c, s: false }))
  )

  useEffect(() => {
    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    if (!shouldStart) return

    const letters  = children.split('')
    const STAGGER  = 32
    const DURATION = 260
    const t0 = performance.now() + delayMs

    const tick = (now: number) => {
      const elapsed = now - t0
      if (elapsed < 0) { rafRef.current = requestAnimationFrame(tick); return }
      let done = true
      const next = letters.map((ch, i) => {
        const t = elapsed - i * STAGGER
        if (t < 0) { done = false; return { c: ch, s: false } }
        if (t >= DURATION) return { c: ch, s: false }
        done = false
        if (/[A-Za-z]/.test(ch)) return { c: CHARS[Math.floor(Math.random() * 26)], s: true }
        if (/[0-9]/.test(ch))    return { c: String(Math.floor(Math.random() * 10)), s: true }
        return { c: ch, s: false }
      })
      setChars(next)
      if (!done) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current) }
  }, [shouldStart, children, delayMs])

  return (
    // ref cast needed: HTMLSpanElement → Element for framer-motion's RefObject<Element | null>
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className} aria-label={children}>
      {chars.map((ch, i) => (
        <span key={i} style={ch.s ? { color: 'var(--color-lime)' } : undefined}>{ch.c}</span>
      ))}
    </span>
  )
}
