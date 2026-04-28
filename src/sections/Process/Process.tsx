import { motion } from 'framer-motion'
import { proven_process, process_intro } from '@/data/identity'
import styles from './Process.module.css'

const PHASE_SHORT: Record<number, string> = {
  1: 'SPARRING',
  2: 'BLUEPRINT',
  3: 'BUILD',
  4: 'DELIVER',
}

// [min-scale, duration(s), delay(s)] for each of the 4 bars per column
const BAR_DATA: [number, number, number][][] = [
  [[0.20, 1.3, 0.00], [0.60, 1.7, 0.20], [0.40, 1.1, 0.40], [0.80, 1.5, 0.15]],
  [[0.50, 1.6, 0.10], [0.30, 1.2, 0.30], [0.70, 1.8, 0.00], [0.40, 1.4, 0.25]],
  [[0.70, 1.4, 0.20], [0.40, 1.6, 0.00], [0.55, 1.3, 0.35], [0.30, 1.9, 0.10]],
  [[0.30, 1.5, 0.15], [0.65, 1.2, 0.40], [0.45, 1.7, 0.05], [0.70, 1.4, 0.30]],
]

function EqBars({ colIndex }: { colIndex: number }) {
  return (
    <div className={styles.bars} aria-hidden>
      {BAR_DATA[colIndex].map(([min, dur, delay], i) => (
        <span
          key={i}
          className={styles.bar}
          style={{
            '--bar-min': min,
            '--bar-dur': `${dur}s`,
            '--bar-delay': `${delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

export function Process() {
  return (
    <section className={styles.section} id="process">
      <div className={styles.noise} aria-hidden />

      {/* Title as dominant design element */}
      <motion.div
        className={styles.titleBlock}
        initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.titleSlash}>//</span>
        <h2 className={styles.title}>
          <span className={styles.titleLine}>PROVEN</span>
          <span className={styles.titleLine}>PROCESS</span>
        </h2>
      </motion.div>

      {/* Intro annotation */}
      <motion.p
        className={styles.introText}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        {process_intro}
      </motion.p>

      {/* 4-column grid */}
      <div className={styles.grid}>
        {proven_process.map((step, i) => (
          <motion.div
            key={step.step}
            className={styles.col}
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
          >
            {/* // 001 */}
            <span className={styles.num}>
              <span className={styles.numSlash}>// </span>
              {String(step.step).padStart(3, '0')}
            </span>

            {/* Body: name → bars → focus */}
            <div className={styles.body}>
              <h3 className={styles.name}>{step.name}</h3>
              <EqBars colIndex={i} />
              <p className={styles.focus}>{step.focus}</p>
            </div>

            {/* Bottom */}
            <div className={styles.footer}>
              <span className={styles.phaseLabel}>
                <span className={styles.phasePrefix}>PHASE/</span>
                <span className={styles.phaseAccent}>{PHASE_SHORT[step.step]}</span>
              </span>
              <div className={styles.pips}>
                {proven_process.map((_, j) => (
                  <span
                    key={j}
                    className={`${styles.pip} ${j < step.step ? styles.pipOn : ''}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
