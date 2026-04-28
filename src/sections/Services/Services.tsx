import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { services, persona } from '@/data/identity'
import styles from './Services.module.css'
import type { Service } from '@/data/identity'

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
  return (
    <div className={`${styles.row} ${isOpen ? styles.rowOpen : ''}`}>

      <button
        className={styles.trigger}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.rowIndex}>// 0{index + 1}</span>
        <span className={styles.rowHook}>{service.hook}</span>
        <span className={styles.rowMethod}>{service.method}</span>
        <motion.span
          className={styles.rowArrow}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          +
        </motion.span>
      </button>

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
                <p className={styles.description}>{service.full_description}</p>
                <p className={styles.audience}>{service.target_audience}</p>
              </div>

              <div className={styles.expandRight}>
                <span className={styles.deliverablesLabel}>// Deliverables</span>
                <p className={styles.deliverablesText}>{service.deliverables}</p>
                <div className={styles.tags}>
                  {service.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i))

  return (
    <section className={styles.section} id="services">
      <div className={styles.inner}>

        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.label}>// What We Do</span>
          <p className={styles.intro}>{persona.mission}</p>
        </motion.div>

        <motion.div
          className={styles.list}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {services.map((service, i) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
