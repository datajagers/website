import { motion } from 'framer-motion'
import { services, content_extensions } from '@/data/identity'
import { Wordmark } from '@/components/Wordmark/Wordmark'
import styles from './Services.module.css'

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true, margin: '-60px' },
  transition: { delay, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
})

export function Services() {
  return (
    <section className={styles.section} id="services">
      <div className={styles.inner}>

        {/* ── Section header ────────────────────────────────── */}
        <div className={styles.header}>
          <motion.p className={`caption-label ${styles.eyebrow}`} {...fadeUp(0)}>
            WHAT I DO
          </motion.p>
          <motion.span className={`mono-sm ${styles.sectionIndex}`} {...fadeUp(0.05)}>
            // 02
          </motion.span>
        </div>

        {/* ── Section wordmark ──────────────────────────────── */}
        <motion.div className={styles.wordmarkWrap} {...fadeUp(0.1)}>
          <Wordmark
            text={content_extensions.section_wordmark_services}
            className={styles.wordmark}
            as="h2"
          />
        </motion.div>

        {/* ── Service rows ──────────────────────────────────── */}
        <div className={styles.rows}>
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              className={styles.row}
              {...fadeUp(0.05 + i * 0.06)}
            >
              <div className={styles.rowRule} />

              <div className={styles.rowGrid}>
                {/* col 1–2: number */}
                <p className={`mono-sm ${styles.rowIndex}`}>
                  0{i + 1}
                </p>

                {/* col 3–7: hook */}
                <h3 className={styles.hook}>
                  {service.hook}
                  <span className="dot-innovation">.</span>
                </h3>

                {/* col 8–12: service details */}
                <div className={styles.details}>
                  <p className={styles.serviceName}>{service.service_name}</p>
                  <p className={styles.description}>{service.full_description}</p>
                  <p className={styles.audience}>{service.target_audience}</p>
                  <div className={styles.tags}>
                    {service.tags.map((tag) => {
                      const [hash, ...rest] = tag
                      return (
                        <span key={tag} className={styles.tag}>
                          <span className={styles.tagHash}>{hash}</span>
                          {rest.join('')}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <div className={styles.closingRule} />
        </div>

      </div>
    </section>
  )
}
