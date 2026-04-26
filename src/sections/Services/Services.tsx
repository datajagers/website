import { motion } from 'framer-motion'
import { services } from '@/data/identity'
import styles from './Services.module.css'

import optimizeImg from '@assets/optimizewhatisslow.jpeg'
import structureImg from '@assets/structurewhatismessy.jpeg'
import uncoverImg from '@assets/findwhatismissing.jpeg'
import buildImg from '@assets/buildwhatismissing.jpeg'

const images: Record<string, string> = {
  optimize: optimizeImg,
  structure: structureImg,
  uncover: uncoverImg,
  build: buildImg,
}

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export function Services() {
  return (
    <section className={styles.section} id="services">
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label}>{'{What We Do}'}</span>
          <h2 className={styles.title}>
            Four Ways To Move <span className={styles.titleAccent}>Forward</span>
          </h2>
        </div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.12 }}
        >
          {services.map((service) => (
            <motion.article
              key={service.id}
              className={styles.card}
              variants={cardVariant}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
            >
              <div className={styles.imageWrap}>
                <img
                  src={images[service.id]}
                  alt={service.service_name}
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.imageOverlay} />
              </div>

              <div className={styles.content}>
                <div className={styles.meta}>
                  <span
                    className={styles.methodPill}
                    style={{
                      backgroundColor: service.brand_color,
                      color: service.brand_color === '#cfff71' ? '#363636' : '#ffffff',
                    }}
                  >
                    {service.method}
                  </span>
                </div>

                <h3 className={styles.hook}>{service.hook}</h3>
                <p className={styles.serviceName}>{service.service_name}</p>
                <p className={styles.audience}>{service.target_audience}</p>

                <div className={styles.deliverables}>
                  <span className={styles.deliverablesLabel}>Deliverables</span>
                  <p className={styles.deliverablesText}>{service.deliverables}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
