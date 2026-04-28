import { useRef } from 'react'
import { motion } from 'framer-motion'
import { proven_process, process_intro } from '@/data/identity'
import styles from './Process.module.css'

const PHASE_SHORT: Record<number, string> = {
  1: 'SPARRING',
  2: 'BLUEPRINT',
  3: 'BUILD',
  4: 'DELIVER',
}

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
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className={styles.section} id="process">
      <div className={styles.noise} aria-hidden />

      {/* ── Header: progressive reveal ─────────────────────── */}
      <div className={styles.titleBlock}>
        <motion.span
          className={styles.titleSlash}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          //
        </motion.span>
        <h2 className={styles.title}>
          <motion.span
            className={styles.titleLine}
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            style={{ display: 'block' }}
          >
            PROVEN
          </motion.span>
          <motion.span
            className={`${styles.titleLine} ${styles.titleLineDim}`}
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            style={{ display: 'block' }}
          >
            PROCESS
          </motion.span>
        </h2>
      </div>

      {/* ── Intro ─────────────────────────────────────────── */}
      <motion.p
        className={styles.introText}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {process_intro}
      </motion.p>

      {/* ── 4-column grid ─────────────────────────────────── */}
      <div className={styles.grid}>
        {proven_process.map((step, i) => (
          <motion.div
            key={step.step}
            className={styles.col}
            initial={{ opacity: 0, y: 24, rotateX: 8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            whileHover={{ y: -4, rotateX: 3, rotateY: -3 }}
            style={{ transformPerspective: 900 }}
          >
            {/* Lime rule draws in from left */}
            <motion.div
              className={styles.colRule}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left' }}
            />

            <span className={styles.num}>
              <span className={styles.numSlash}>// </span>
              {String(step.step).padStart(3, '0')}
            </span>

            <div className={styles.body}>
              <h3 className={styles.name}>{step.name}</h3>
              <EqBars colIndex={i} />
              <motion.p
                className={styles.focus}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ delay: i * 0.08 + 0.3, duration: 0.45 }}
              >
                {step.focus}
              </motion.p>
            </div>

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
