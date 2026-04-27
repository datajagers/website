import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { value_proposition } from '@/data/identity'
import styles from './WhyUs.module.css'

const HandshakeMesh = lazy(() =>
  import('@/components/HandshakeMesh/HandshakeMesh').then((m) => ({ default: m.HandshakeMesh }))
)

const usps = value_proposition.reasons_to_choose
const leftUsps  = [usps[0], usps[1]]
const rightUsps = [usps[2], usps[3]]

export function WhyUs() {
  return (
    <section className={styles.section} id="why">
      <div className={styles.inner}>

        {/* Large headline */}
        <motion.h2
          className={styles.headline}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          4 Reasons to{' '}
          <span className={styles.headlineAccent}>Choose</span>
          <br />Us as Your Partner
        </motion.h2>

        {/* Three-column radial layout */}
        <div className={styles.layout}>

          {/* Left USPs */}
          <div className={styles.leftCol}>
            {leftUsps.map((usp, i) => (
              <motion.div
                key={usp.title}
                className={styles.uspLeft}
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.13 }}
              >
                <div className={styles.uspText}>
                  <h3 className={styles.uspTitle}>{usp.title}</h3>
                  <p className={styles.uspBody}>{usp.description}</p>
                </div>
                <div className={styles.connectorLeft} aria-hidden />
              </motion.div>
            ))}
          </div>

          {/* Centre image */}
          <motion.div
            className={styles.imageCol}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <Suspense fallback={<div className={styles.mesh} />}>
              <HandshakeMesh className={styles.mesh} />
            </Suspense>
          </motion.div>

          {/* Right USPs */}
          <div className={styles.rightCol}>
            {rightUsps.map((usp, i) => (
              <motion.div
                key={usp.title}
                className={styles.uspRight}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.13 }}
              >
                <div className={styles.connectorRight} aria-hidden />
                <div className={styles.uspText}>
                  <h3 className={styles.uspTitle}>{usp.title}</h3>
                  <p className={styles.uspBody}>{usp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
