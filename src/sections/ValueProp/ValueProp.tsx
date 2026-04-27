import { motion } from 'framer-motion'
import { value_proposition, content_extensions } from '@/data/identity'
import styles from './ValueProp.module.css'

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true, margin: '-60px' },
  transition: { delay, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
})

export function ValueProp() {
  return (
    <section className={styles.section} id="why">
      <div className={styles.inner}>

        <div className={styles.layout}>

          {/* ── Left column ─────────────────────────────────── */}
          <div className={styles.left}>
            <motion.p className={`caption-label ${styles.eyebrow}`} {...fadeUp(0)}>
              WHY DATAJAGERS
            </motion.p>

            <motion.h2 className={styles.headline} {...fadeUp(0.08)}>
              <span className={`mono-sm ${styles.sectionIndex}`}>// 01</span>
              {content_extensions.section_headlines.value_proposition}
              <span className="dot-innovation">.</span>
            </motion.h2>

            <motion.p className={styles.subhead} {...fadeUp(0.16)}>
              {value_proposition.methodology}
            </motion.p>
          </div>

          {/* ── Right column: 2×2 reasons grid ──────────────── */}
          <div className={styles.right}>
            {value_proposition.reasons_to_choose.map((reason, i) => (
              <motion.div key={reason.title} className={styles.reason} {...fadeUp(0.1 + i * 0.07)}>
                <div className={styles.reasonRule} />
                <h3 className={styles.reasonTitle}>{reason.title}</h3>
                <p className={styles.reasonBody}>{reason.description}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
