import { useEffect, useRef } from 'react'

interface FitTextProps {
  children: React.ReactNode
  className?: string
  as?: 'span' | 'div'
}

export function FitText({ children, className, as: Tag = 'span' }: FitTextProps) {
  const wrapRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner) return

    const fit = () => {
      inner.style.fontSize = '1px'
      const available = wrap.offsetWidth
      let lo = 1, hi = 600
      while (lo < hi - 1) {
        const mid = Math.floor((lo + hi) / 2)
        inner.style.fontSize = `${mid}px`
        if (inner.scrollWidth <= available) lo = mid
        else hi = mid
      }
      inner.style.fontSize = `${lo}px`
    }

    fit()
    const obs = new ResizeObserver(fit)
    obs.observe(wrap)
    return () => obs.disconnect()
  }, [])

  return (
    <Tag
      ref={wrapRef as React.RefObject<HTMLSpanElement & HTMLDivElement>}
      style={{ display: 'block', width: '100%', overflow: 'hidden' }}
    >
      <Tag
        ref={innerRef as React.RefObject<HTMLSpanElement & HTMLDivElement>}
        className={className}
        style={{ display: 'block', whiteSpace: 'nowrap', lineHeight: 1 }}
      >
        {children}
      </Tag>
    </Tag>
  )
}
