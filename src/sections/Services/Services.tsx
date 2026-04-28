import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { services, persona } from '@/data/identity'
import { FitText } from '@/components/FitText'
import { ScrambleText } from '@/components/ScrambleText'
import styles from './Services.module.css'
import type { Service } from '@/data/identity'

// ─── Service row ──────────────────────────────────────────────────────────────

function ServiceRow({
  service,
  index,
  isOpen,
  onToggle,
}: {
  service: Service
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const rowDelay = index * 0.07

  return (
    <motion.div
      className={`${styles.row} ${isOpen ? styles.rowOpen : ''}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: rowDelay, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className={styles.trigger} onClick={onToggle} aria-expanded={isOpen}>

        <ScrambleText className={styles.rowIndex}>{`// 0${index + 1}`}</ScrambleText>

        <span className={styles.rowHook}>
          {service.hook}
        </span>

        <ScrambleText className={styles.rowMethod}>{service.method}</ScrambleText>

        <motion.span
          className={styles.rowArrow}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          +
        </motion.span>
      </button>

      {/* Accordion expand */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className={styles.expandInner}>

              <div className={styles.expandLeft}>
                <span className={styles.serviceName}>{service.service_name}</span>

                <motion.p
                  className={styles.description}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {service.full_description}
                </motion.p>

                <motion.p
                  className={styles.audience}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {service.target_audience}
                </motion.p>
              </div>

              <div className={styles.expandRight}>
                <ScrambleText className={styles.deliverablesLabel}>// Deliverables</ScrambleText>

                <motion.p
                  className={styles.deliverablesText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {service.deliverables}
                </motion.p>

                {/* Tags stagger in */}
                <div className={styles.tags}>
                  {service.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      className={styles.tag}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.32 + i * 0.045, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i))

  // Big title enters at 2.5× and zooms to 1× as section comes into view
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 0.35'],
  })
  const titleScale   = useTransform(scrollYProgress, [0, 1], [2.5, 1])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0.4, 1])

  return (
    <section ref={sectionRef} className={styles.section} id="services">

      {/* Big scaling title */}
      <div className={styles.bigTitleBlock}>
        <motion.div style={{ scale: titleScale, opacity: titleOpacity, transformOrigin: 'top center' }}>
          <FitText className={styles.bigTitleText}>What We Do</FitText>
        </motion.div>
      </div>

      <div className={styles.inner}>

        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScrambleText className={styles.label}>// What We Do</ScrambleText>

          <motion.p
            className={styles.intro}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {persona.mission}
          </motion.p>
        </motion.div>

        {/* Service rows */}
        <div className={styles.list}>
          {services.map((service, i) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
