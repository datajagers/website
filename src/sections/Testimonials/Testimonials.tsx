import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView, type MotionValue } from 'framer-motion'
import { testimonials } from '@/data/identity'
import { ScrambleText } from '@/components/ScrambleText'
import { useIsMobile } from '@/hooks/useIsMobile'
import styles from './Testimonials.module.css'

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

// ── Per-card exit driven by scroll ────────────────────────────────────────────

function TestimonialCard({
  t,
  scrollYProgress,
  exitStart,
}: {
  t: (typeof testimonials)[0]
  scrollYProgress: MotionValue<number>
  exitStart: number
}) {
  // Blur only on laptop/desktop (>1023px)
  const isMobile = useIsMobile(1023)
  const entryRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(entryRef, { once: true, margin: '-60px' })
  const exitEnd  = exitStart + 0.15

  const y       = useTransform(scrollYProgress, [exitStart, exitEnd], ['0%', '-14%'])
  const opacity = useTransform(scrollYProgress, [exitStart, exitEnd], [1, 0])
  const scale   = useTransform(scrollYProgress, [exitStart, exitEnd], [1, 0.88])
  const filter  = useTransform(
    scrollYProgress,
    [exitStart, exitStart + 0.045, exitStart + 0.09, exitEnd],
    [
      'blur(0px) brightness(1) saturate(1)',
      'blur(0px) brightness(1.18) saturate(0.5)',
      'blur(3px) brightness(0.88) saturate(0.2)',
      'blur(10px) brightness(0.7) saturate(0)',
    ]
  )

  const exitStyle = isMobile
    ? { y, opacity, scale }
    : { y, opacity, scale, filter }

  return (
    // Entry wrapper: opacity + y reveal on viewport enter
    <motion.div
      ref={entryRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Exit wrapper: scroll-driven transforms — opacity here multiplies with entry opacity */}
      <motion.div style={{ ...exitStyle, willChange: 'transform, opacity' }}>
        <motion.article
          className={`${styles.card} ${t.dark ? styles.cardDark : styles.cardLight}`}
          whileHover={{ y: -6, rotateX: 4, rotateY: -3, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
          style={{ transformPerspective: 900 }}
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
              <ScrambleText className={styles.personRole}>{t.role}</ScrambleText>
            </div>
          </div>
        </motion.article>
      </motion.div>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

// Cards exit one by one. Gap of 0.14 between starts gives ~75% more scroll
// distance between exits than the previous 0.08 gap.
const EXIT_STARTS = [0.50, 0.64, 0.78]

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Label clears just before the first card starts exiting at 0.50
  const labelScale   = useTransform(scrollYProgress, [0.38, 0.52], [1, 0])
  const labelOpacity = useTransform(scrollYProgress, [0.37, 0.50], [1, 0])

  // Title slides out over the mid-section, spanning card 0 + card 1 exits
  const titleY       = useTransform(scrollYProgress, [0.45, 0.72], ['0%', '-115%'])
  const titleOpacity = useTransform(scrollYProgress, [0.45, 0.66], [1, 0])

  return (
    <section ref={sectionRef} className={styles.section} id="testimonials">
      <div className={styles.inner}>

        {/* ── Header ──────────────────────────────────────────── */}
        <div className={styles.header}>

          {/* Label — scales to zero */}
          <motion.div
            style={{ scale: labelScale, opacity: labelOpacity, transformOrigin: 'left center' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ScrambleText className={styles.label}>// Testimonials</ScrambleText>
            </motion.div>
          </motion.div>

          {/* Title — slides out top of clip */}
          <div className={styles.titleClip}>
            <motion.div style={{ y: titleY, opacity: titleOpacity }}>
              <motion.h2
                className={styles.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                Real <span className={styles.highlight}>Results</span>.<br />
                Real Feedback.
              </motion.h2>
            </motion.div>
          </div>

        </div>

        {/* ── Cards ───────────────────────────────────────────── */}
        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              t={t}
              scrollYProgress={scrollYProgress}
              exitStart={EXIT_STARTS[i]}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
