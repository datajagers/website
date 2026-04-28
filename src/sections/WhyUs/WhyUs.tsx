import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { value_proposition } from '@/data/identity'
import { FitText } from '@/components/FitText'
import { ScrambleText } from '@/components/ScrambleText'
import styles from './WhyUs.module.css'

export function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null)

  // Title slides down from above the container, driven by scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  })
  const titleY       = useTransform(scrollYProgress, [0, 1], ['-110%', '0%'])
  const titleOpacity = useTransform(scrollYProgress, [0.15, 0.55], [0, 1])

  return (
    <section ref={sectionRef} className={styles.section} id="why">

      {/* ── Title slides in from top on scroll ───────────── */}
      <div className={styles.bigTitleBlock}>
        <motion.div style={{ y: titleY, opacity: titleOpacity }}>
          <FitText className={styles.bigTitleText}>The Difference</FitText>
        </motion.div>
      </div>

      <div className={styles.inner}>
        <div className={styles.layout}>

          {/* ── Left: sticky anchor ──────────────────────── */}
          <motion.div
            className={styles.left}
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <ScrambleText className={styles.eyebrow}>// Why Datajagers</ScrambleText>

            <motion.div
              className={styles.headline}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span className={styles.headlineLine}>Our</span>
              <span className={`${styles.headlineLine} ${styles.headlineAccent}`}>DNA</span>
            </motion.div>

            <motion.blockquote
              className={styles.pullQuote}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {value_proposition.the_crucial_question}
            </motion.blockquote>
          </motion.div>

          {/* ── Right: USP grid ──────────────────────────── */}
          <div className={styles.right}>
            {value_proposition.reasons_to_choose.map((reason, i) => (
              <motion.div
                key={reason.title}
                className={styles.reason}
                initial={{ opacity: 0, y: 18, rotateX: 8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, rotateX: 3, rotateY: -2 }}
                style={{ transformPerspective: 800 }}
              >
                {/* Rule draws in from left before content appears */}
                <motion.div
                  className={styles.reasonRule}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.09, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'left' }}
                />

                <ScrambleText className={styles.reasonNum}>{`// 0${i + 1}`}</ScrambleText>

                <h3 className={styles.reasonTitle}>
                  {reason.title}
                </h3>

                <motion.p
                  className={styles.reasonBody}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.09 + 0.22, duration: 0.5 }}
                >
                  {reason.description}
                </motion.p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
