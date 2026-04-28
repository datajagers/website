import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { site_info, persona, services } from '@/data/identity'
import { GridOverlay } from '@/components/GridOverlay/GridOverlay'
import { FitText } from '@/components/FitText'
import { analytics } from '@/lib/analytics'
import styles from './Hero.module.css'

// ─── Scramble engine ──────────────────────────────────────────────────────────

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function useScramble(word: string, delayMs: number) {
  const [chars, setChars] = useState<{ c: string; s: boolean }[]>(
    () => word.split('').map(() => ({ c: ' ', s: false }))
  )
  useEffect(() => {
    const letters = word.split('')
    const STAGGER  = 45
    const DURATION = 300
    let rafId: number
    const start = performance.now() + delayMs
    const tick = (now: number) => {
      const elapsed = now - start
      if (elapsed < 0) { rafId = requestAnimationFrame(tick); return }
      let allDone = true
      const next = letters.map((ch, i) => {
        const t = elapsed - i * STAGGER
        if (t < 0)         { allDone = false; return { c: ' ', s: false } }
        if (t >= DURATION) { return { c: ch, s: false } }
        allDone = false
        return { c: CHARS[Math.floor(Math.random() * 26)], s: true }
      })
      setChars(next)
      if (!allDone) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [word, delayMs])
  return chars
}

const WORDS      = ['IMAGINE',  'BUILD',  'INNOVATE']
const WORD_DELAY = [400,         900,      1400]     // ms

function wordDotDelay(i: number) {
  return (WORD_DELAY[i] + WORDS[i].length * 45 + 300) / 1000 + 0.06
}

function ScrambleWord({ word, delayMs }: { word: string; delayMs: number }) {
  const chars = useScramble(word, delayMs)
  return (
    <span aria-label={word}>
      {chars.map((ch, i) => (
        <span key={i} className={ch.s ? styles.scrambling : undefined}>{ch.c}</span>
      ))}
    </span>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export function Hero() {
  const outerRef = useRef<HTMLElement>(null)
  const ctaRef   = useRef<HTMLAnchorElement>(null)

  // Scroll progress over the full 200vh section:
  // 0 = section top at viewport top, 1 = section bottom at viewport top
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end start'],
  })

  // Content exits through the top of the sticky frame
  const contentY = useTransform(scrollYProgress, [0, 0.55], ['0px', '-115vh'])
  // "Let's Create" rises from the bottom of the frame as content slides away
  const revealOpacity = useTransform(scrollYProgress, [0.18, 0.52], [0, 1])
  const revealY       = useTransform(scrollYProgress, [0.18, 0.52], ['52vh', '0vh'])

  return (
    <section ref={outerRef} className={styles.hero}>
      {/* Sticky 100vh frame — content scrolls out the top */}
      <div className={styles.stickyFrame}>

        {/* Reveal text — rises from bottom as content exits */}
        <motion.div className={styles.revealLayer} style={{ opacity: revealOpacity, y: revealY }} aria-hidden>
          <FitText className={styles.revealText} as="div">Let's Create</FitText>
        </motion.div>

        {/* All hero content — translated upward on scroll */}
        <motion.div className={styles.contentLayer} style={{ y: contentY }}>
          <div className={styles.grain} aria-hidden />
          <div className={styles.orb}   aria-hidden />
          <GridOverlay />

          <div className={styles.body}>
            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              // Strategic Data Partner
            </motion.p>

            <div className={styles.headline} aria-label={site_info.core_slogan}>
              {WORDS.map((word, i) => (
                <div key={word} className={styles.wordRow}>
                  <span className={styles.word}>
                    <ScrambleWord word={word} delayMs={WORD_DELAY[i]} />
                  </span>
                  <motion.span
                    className={styles.dot}
                    initial={{ opacity: 0, y: -22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: wordDotDelay(i), duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  >
                    .
                  </motion.span>
                </div>
              ))}
            </div>

            <motion.p
              className={styles.mission}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {persona.mission}
            </motion.p>

            <motion.a
              ref={ctaRef}
              href="#contact"
              className={styles.cta}
              onClick={() => analytics.heroCta()}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Start the conversation <span className={styles.arrow}>→</span>
            </motion.a>
          </div>

          <motion.div
            className={styles.strip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.6 }}
          >
            {services.map((service, i) => (
              <div key={service.id} className={styles.hook}>
                <span className={styles.hookNum}>0{i + 1}</span>
                <span className={styles.hookLabel}>{service.hook}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
