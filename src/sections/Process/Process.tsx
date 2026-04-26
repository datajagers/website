import { motion } from 'framer-motion'
import { proven_process, process_intro } from '@/data/identity'
import styles from './Process.module.css'

const rule = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

const num = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, delay: 0.4 } },
}

const nameReveal = {
  hidden: { y: '105%' },
  visible: { y: '0%', transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.3 } },
}

const focus = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.5 } },
}

export function Process() {
  return (
    <section className={styles.section} id="process">
      <div className={styles.inner}>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.label}>{'{How It Works}'}</span>
            <h2 className={styles.title}>
              A Simple,<br />
              Proven<br />
              <span className={styles.titleAccent}>Process</span>
            </h2>
          </div>
          <p className={styles.intro}>{process_intro}</p>
        </div>

        <div className={styles.steps}>
          {proven_process.map((step) => (
            <motion.div
              key={step.step}
              className={styles.step}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {/* Animated rule */}
              <motion.div className={styles.rule} variants={rule} />

              {/* Row */}
              <div className={styles.row}>
                <motion.span className={styles.num} variants={num}>
                  {String(step.step).padStart(2, '0')}
                </motion.span>

                {/* Masked name reveal */}
                <div className={styles.nameWrap}>
                  <motion.h3 className={styles.name} variants={nameReveal}>
                    {step.name}
                  </motion.h3>
                </div>

                <motion.p className={styles.focus} variants={focus}>
                  {step.focus}
                </motion.p>
              </div>
            </motion.div>
          ))}

          {/* Closing rule */}
          <motion.div
            className={styles.rule}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

      </div>
    </section>
  )
}
