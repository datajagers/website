import { motion } from 'framer-motion'
import { contact, site_info } from '@/data/identity'
import styles from './Contact.module.css'

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { delay, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
})

export function Contact() {
  const tagline = contact.tagline
  const taglineBase = tagline.endsWith('.') ? tagline.slice(0, -1) : tagline

  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>

        {/* ── Header ────────────────────────────────────────── */}
        <motion.p className={`caption-label-inv ${styles.eyebrow}`} {...fadeUp(0)}>
          {contact.label}
        </motion.p>
        <motion.span className={`mono-sm-inv ${styles.sectionIndex}`} {...fadeUp(0.04)}>
          // 06
        </motion.span>

        {/* ── Statement headline ────────────────────────────── */}
        <motion.h2 className={styles.headline} {...fadeUp(0.1)}>
          {taglineBase}<span className="dot-innovation">.</span>
        </motion.h2>

        {/* ── CTAs ──────────────────────────────────────────── */}
        <motion.div className={styles.ctas} {...fadeUp(0.18)}>
          <a
            href={`mailto:${site_info.email}`}
            className={styles.ctaPrimary}
          >
            Book a sparring session
          </a>
          <a
            href={`tel:${site_info.phone.replace(/\s/g, '')}`}
            className={styles.ctaSecondary}
          >
            {site_info.phone}
          </a>
        </motion.div>

      </div>

      {/* ── Showreel band ─────────────────────────────────────── */}
      <motion.div
        className={styles.band}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className={styles.bandInner}>
          <span className="caption-label-inv">{site_info.email}</span>
          <div className="showreel-band__rule showreel-band__rule--inv" />
          <span className="caption-label-inv">{site_info.phone}</span>
        </div>
      </motion.div>
    </section>
  )
}
