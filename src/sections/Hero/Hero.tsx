import { motion } from 'framer-motion'
import { site_info, content_extensions } from '@/data/identity'
import { Wordmark } from '@/components/Wordmark/Wordmark'
import styles from './Hero.module.css'

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  animate:    { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
})

const fadeIn = (delay = 0) => ({
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  transition: { delay, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
})

export function Hero() {
  return (
    <section className={styles.section} id="home">
      <div className={styles.inner}>

        {/* ── Top row ───────────────────────────────────────── */}
        <div className={styles.top}>

          {/* Left: section index + headline */}
          <div className={styles.topLeft}>
            <motion.p className={`mono-sm ${styles.sectionIndex}`} {...fadeIn(0.1)}>
              // 00.01°
            </motion.p>
            <motion.h2 className={styles.headline} {...fadeUp(0.2)}>
              Data-driven solutions that optimize, structure and innovate
              <span className="dot-innovation">.</span>
            </motion.h2>
          </div>

          {/* Right: numeric kicker */}
          <motion.div className={styles.topRight} {...fadeIn(0.15)}>
            <p className={styles.kickerPrimary}>
              {content_extensions.hero_kicker_stat.primary}
            </p>
            <p className={`caption-label ${styles.kickerSecondary}`}>
              {content_extensions.hero_kicker_stat.secondary}
            </p>
          </motion.div>
        </div>

        {/* ── Wordmark ──────────────────────────────────────── */}
        <div className={styles.wordmarkWrap}>
          <Wordmark
            text={site_info.core_slogan}
            className={styles.wordmark}
            animate
          />
        </div>

        {/* ── Bottom band ───────────────────────────────────── */}
        <motion.div className={styles.bottom} {...fadeIn(1.1)}>
          <p className={`caption-label ${styles.bottomLeft}`}>
            {content_extensions.hero_footer_left}
          </p>

          <div className={`showreel-band ${styles.bottomBand}`}>
            <div className="showreel-band__rule" />
            <span className={`mono-sm ${styles.bandLabel}`}>AVAILABLE Q2 2026</span>
            <div className="showreel-band__rule" />
            <span className={`mono-sm ${styles.bandMarker}`}>2026</span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
