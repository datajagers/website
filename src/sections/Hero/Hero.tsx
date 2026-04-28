import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { site_info, persona, services } from '@/data/identity'
import { GridOverlay } from '@/components/GridOverlay/GridOverlay'
import styles from './Hero.module.css'

const WORDS = ['Imagine', 'Build', 'Innovate']

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
}

const wordVariant = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
})

export function Hero() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const ctaRef      = useRef<HTMLAnchorElement>(null)
  const [overlayTop,    setOverlayTop]    = useState(120)
  const [overlayBottom, setOverlayBottom] = useState(0)

  useEffect(() => {
    const measure = () => {
      if (!sectionRef.current || !headlineRef.current || !ctaRef.current) return
      const sr = sectionRef.current.getBoundingClientRect()
      const hr = headlineRef.current.getBoundingClientRect()
      const cr = ctaRef.current.getBoundingClientRect()
      setOverlayTop(hr.top - sr.top)
      setOverlayBottom(sr.bottom - cr.bottom)
    }
    measure()
    const obs = new ResizeObserver(measure)
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={styles.hero}>
      {/* Noise grain overlay — breathes */}
      <div className={styles.grain} aria-hidden />
      {/* Ambient floating orb */}
      <div className={styles.orb} aria-hidden />
      {/* Excel grid + dashboard + code windows */}
      <GridOverlay top={overlayTop} bottom={overlayBottom} />

      {/* Body */}
      <div className={styles.body}>
        <motion.p
          className={styles.eyebrow}
          {...fadeUp(0.15)}
        >
          // Strategic Data Partner
        </motion.p>

        <motion.div
          ref={headlineRef}
          className={styles.headline}
          variants={container}
          initial="hidden"
          animate="visible"
          aria-label={site_info.core_slogan}
        >
          {WORDS.map((word) => (
            <motion.span key={word} variants={wordVariant} className={styles.word}>
              {word}<span className={styles.dot}>.</span>
            </motion.span>
          ))}
        </motion.div>

        <motion.p className={styles.mission} {...fadeUp(0.75)}>
          {persona.mission}
        </motion.p>

        <motion.a ref={ctaRef} href="#contact" className={styles.cta} {...fadeUp(0.95)}>
          Start the conversation <span className={styles.arrow}>→</span>
        </motion.a>
      </div>

      {/* Service hooks strip */}
      <motion.div
        className={styles.strip}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        {services.map((service, i) => (
          <div key={service.id} className={styles.hook}>
            <span className={styles.hookNum}>0{i + 1}</span>
            <span className={styles.hookLabel}>{service.hook}</span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
