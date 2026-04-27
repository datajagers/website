import { motion } from 'framer-motion'
import { proven_process, process_intro, content_extensions } from '@/data/identity'
import styles from './Process.module.css'

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true, margin: '-60px' },
  transition: { delay, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
})

export function Process() {
  const processHl = content_extensions.section_headlines.process
  const processBase = processHl.endsWith('.') ? processHl.slice(0, -1) : processHl

  return (
    <section className={styles.section} id="process">
      <div className={styles.inner}>

        {/* ── Header ────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <motion.p className={`caption-label-inv ${styles.eyebrow}`} {...fadeUp(0)}>
              THE PROVEN PROCESS
            </motion.p>
            <motion.span className={`mono-sm-inv ${styles.sectionIndex}`} {...fadeUp(0.04)}>
              // 03
            </motion.span>
            <motion.h2 className={styles.headline} {...fadeUp(0.08)}>
              {processBase}<span className="dot-innovation">.</span>
            </motion.h2>
          </div>
          <motion.p className={styles.intro} {...fadeUp(0.14)}>
            {process_intro}
          </motion.p>
        </div>

        {/* ── Horizontal step rail ──────────────────────────── */}
        <div className={styles.rail}>

          {/* Connecting hairline */}
          <motion.div
            className={styles.railLine}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          />

          {proven_process.map((step, i) => (
            <motion.div
              key={step.step}
              className={styles.step}
              {...fadeUp(0.15 + i * 0.1)}
            >
              {/* Step dot on the rail */}
              <div
                className={styles.stepDot}
                style={{ background: step.brand_color }}
              />

              <p className={`mono-sm-inv ${styles.stepIndex}`}>
                // 0{step.step}
              </p>
              <h3 className={styles.stepName}>{step.name}</h3>
              <p className={styles.stepFocus}>{step.focus}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
