import { useRef } from 'react'
import { motion } from 'framer-motion'
import { proven_process, process_intro } from '@/data/identity'
import { ScrambleText } from '@/components/ScrambleText'
import styles from './Process.module.css'

const PHASE_SHORT: Record<number, string> = {
  1: 'SPARRING',
  2: 'BLUEPRINT',
  3: 'BUILD',
  4: 'DELIVER',
}

// ── Phase visualizations ──────────────────────────────────────────────────────

// Phase 1 — Sparring/Discovery: floating scatter dots with a connecting path
const DISCOVERY_DOTS = [
  { cx: 10, cy: 42, r: 2.5, dur: '2.2s', del: '0.0s' },
  { cx: 30, cy: 14, r: 2.0, dur: '1.9s', del: '0.3s' },
  { cx: 54, cy: 30, r: 3.0, dur: '2.5s', del: '0.7s' },
  { cx: 72, cy: 10, r: 2.0, dur: '2.1s', del: '0.2s' },
  { cx: 88, cy: 34, r: 2.5, dur: '2.0s', del: '0.5s' },
  { cx: 20, cy: 5,  r: 1.5, dur: '2.3s', del: '0.9s' },
  { cx: 63, cy: 47, r: 1.5, dur: '1.8s', del: '0.4s' },
]

function DiscoveryViz() {
  return (
    <svg className={styles.viz} viewBox="0 0 100 52" preserveAspectRatio="none" aria-hidden>
      <polyline
        className={styles.discoveryPath}
        points="10,42 30,14 54,30 72,10 88,34"
      />
      {DISCOVERY_DOTS.map((d, i) => (
        <circle
          key={i}
          className={styles.discoveryDot}
          cx={d.cx} cy={d.cy} r={d.r}
          style={{ '--dur': d.dur, '--del': d.del } as React.CSSProperties}
        />
      ))}
    </svg>
  )
}

// Phase 2 — Blueprint: horizontal bars growing from left (Gantt chart)
const BLUEPRINT_BARS = [
  { y: 4,  w: 80, del: '0.00s' },
  { y: 17, w: 50, del: '0.14s' },
  { y: 30, w: 92, del: '0.07s' },
  { y: 43, w: 64, del: '0.21s' },
]

function BlueprintViz() {
  return (
    <svg className={styles.viz} viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden>
      {BLUEPRINT_BARS.map((b, i) => (
        <rect
          key={i}
          className={styles.blueprintBar}
          x="0" y={b.y}
          width={b.w} height="9"
          rx="2"
          style={{ '--del': b.del } as React.CSSProperties}
        />
      ))}
    </svg>
  )
}

// Phase 3 — Build & Optimize: vertical bars trending upward (velocity)
const BUILD_BARS = [
  { h: 22, del: '0.00s', dur: '1.6s' },
  { h: 38, del: '0.10s', dur: '1.4s' },
  { h: 52, del: '0.05s', dur: '1.7s' },
  { h: 68, del: '0.18s', dur: '1.5s' },
  { h: 82, del: '0.08s', dur: '1.3s' },
  { h: 96, del: '0.22s', dur: '1.6s' },
]

function BuildViz() {
  return (
    <div className={styles.buildViz} aria-hidden>
      {BUILD_BARS.map((b, i) => (
        <span
          key={i}
          className={styles.buildBar}
          style={{ '--h': `${b.h}%`, '--del': b.del, '--dur': b.dur } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

// Phase 4 — Value Delivery: rising trend line with animated draw
function ValueViz() {
  return (
    <svg className={styles.viz} viewBox="0 0 100 52" preserveAspectRatio="none" aria-hidden>
      {/* Subtle grid lines */}
      <line className={styles.valueGrid} x1="0" y1="46" x2="100" y2="46" />
      <line className={styles.valueGrid} x1="0" y1="30" x2="100" y2="30" />
      <line className={styles.valueGrid} x1="0" y1="14" x2="100" y2="14" />
      {/* Rising curve */}
      <path
        className={styles.valueLine}
        d="M 4,48 C 18,46 26,40 40,30 C 54,20 60,14 74,8 C 84,4 92,3 96,3"
        fill="none"
      />
      {/* Endpoint dot */}
      <circle className={styles.valueDot} cx="96" cy="3" r="2.5" />
    </svg>
  )
}

function PhaseViz({ phase }: { phase: number }) {
  if (phase === 1) return <DiscoveryViz />
  if (phase === 2) return <BlueprintViz />
  if (phase === 3) return <BuildViz />
  return <ValueViz />
}

// ── Section ───────────────────────────────────────────────────────────────────

export function Process() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className={styles.section} id="process">
      <div className={styles.noise} aria-hidden />

      {/* ── Header: progressive reveal ─────────────────────── */}
      <div className={styles.titleBlock}>
        <ScrambleText className={styles.titleSlash}>//</ScrambleText>
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
      <p className={styles.introText}>
        <ScrambleText>{process_intro}</ScrambleText>
      </p>

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

            <ScrambleText className={styles.num}>{`// ${String(step.step).padStart(3, '0')}`}</ScrambleText>

            <div className={styles.body}>
              <h3 className={styles.name}>{step.name}</h3>
              <PhaseViz phase={step.step} />
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
              <ScrambleText className={styles.phaseLabel}>{`PHASE/${PHASE_SHORT[step.step]}`}</ScrambleText>
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
