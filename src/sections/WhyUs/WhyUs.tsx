import { motion } from 'framer-motion'
import { value_proposition } from '@/data/identity'
import styles from './WhyUs.module.css'

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
})

export function WhyUs() {
  return (
    <section className={styles.section} id="why">
      <div className={styles.inner}>
        <div className={styles.layout}>

          {/* ── Left: sticky anchor ──────────────────────────── */}
          <motion.div
            className={styles.left}
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.eyebrow}>// Why Datajagers</span>

            <h2 className={styles.headline}>
              The<br />
              <span className={styles.headlineAccent}>Difference</span>
            </h2>

            <blockquote className={styles.pullQuote}>
              {value_proposition.the_crucial_question}
            </blockquote>
          </motion.div>

          {/* ── Right: USP grid ──────────────────────────────── */}
          <div className={styles.right}>
            {value_proposition.reasons_to_choose.map((reason, i) => (
              <motion.div
                key={reason.title}
                className={styles.reason}
                {...fadeUp(0.08 + i * 0.08)}
              >
                <div className={styles.reasonRule} />
                <span className={styles.reasonNum}>0{i + 1}</span>
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
