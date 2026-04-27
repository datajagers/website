import { motion } from 'framer-motion'
import { testimonials, content_extensions } from '@/data/identity'
import styles from './Testimonials.module.css'

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { delay, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
})

export function Testimonials() {
  const headline = content_extensions.section_headlines.testimonials
  const base     = headline.endsWith('.') ? headline.slice(0, -1) : headline

  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.inner}>

        {/* ── Header ────────────────────────────────────────── */}
        <div className={styles.header}>
          <motion.p className={`caption-label ${styles.eyebrow}`} {...fadeUp(0)}>
            WHAT CLIENTS SAY
          </motion.p>
          <motion.span className={`mono-sm ${styles.sectionIndex}`} {...fadeUp(0.04)}>
            // 04
          </motion.span>
        </div>

        <motion.h2 className={styles.headline} {...fadeUp(0.08)}>
          {base}<span className="dot-innovation">.</span>
        </motion.h2>

        {/* ── Quote cards ───────────────────────────────────── */}
        <div className={styles.cards}>
          {testimonials.map((t, i) => (
            <motion.article
              key={i}
              className={`${styles.card} ${t.dark ? styles.cardDark : styles.cardLight}`}
              {...fadeUp(0.14 + i * 0.1)}
            >
              <p className={`mono-sm ${t.dark ? styles.themeDark : styles.themeLight}`}>
                // {t.theme}
              </p>

              <blockquote className={styles.quote}>
                {t.quote}
                <span className={t.dark ? 'dot-innovation' : 'dot-structure'}>.</span>
              </blockquote>

              <footer className={styles.attribution}>
                <span className={styles.name}>{t.name}</span>
                <span className={`${styles.role} ${t.dark ? styles.roleDark : ''}`}>
                  {t.role}
                </span>
              </footer>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  )
}
