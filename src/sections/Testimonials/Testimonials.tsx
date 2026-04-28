import { motion } from 'framer-motion'
import { testimonials } from '@/data/identity'
import styles from './Testimonials.module.css'

const cardVariant = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

function Stars({ dark }: { dark: boolean }) {
  const color = dark ? '#cfff71' : '#5d67e6'
  return (
    <div className={styles.stars} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 16 16" fill={color} aria-hidden>
          <path d="M8 1.2l1.75 3.55 3.92.57-2.84 2.77.67 3.9L8 10.1l-3.5 1.84.67-3.9L2.33 5.32l3.92-.57L8 1.2z" />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={styles.avatar} aria-hidden>
      {initials}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.inner}>

        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.label}>// Testimonials</span>
          <h2 className={styles.title}>
            Real <span className={styles.highlight}>Results</span>.<br />
            Real Feedback.
          </h2>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.13 }}
        >
          {testimonials.map((t, i) => (
            <motion.article
              key={i}
              className={`${styles.card} ${t.dark ? styles.cardDark : styles.cardLight}`}
              variants={cardVariant}
              whileHover={{ scale: 1.03, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
            >
              <div className={styles.cardTop}>
                <span className={styles.openQuote} aria-hidden>&ldquo;</span>
                <Stars dark={t.dark} />
              </div>

              <blockquote className={styles.quote}>
                {t.quote}
              </blockquote>

              <div className={styles.person}>
                <Avatar name={t.name} />
                <div className={styles.personInfo}>
                  <span className={styles.personName}>{t.name}</span>
                  <span className={styles.personRole}>{t.role}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
