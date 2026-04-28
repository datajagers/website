import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { faq } from '@/data/identity'
import { ScrambleText } from '@/components/ScrambleText'
import styles from './FAQ.module.css'

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className={`${styles.item} ${open ? styles.itemOpen : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
    >
      <motion.div
        className={styles.rule}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.question}>{question}</span>
        <span className={styles.icon} aria-hidden>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'block', lineHeight: 1 }}
          >
            +
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p className={styles.answer}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  return (
    <section className={styles.section} id="faq">
      <div className={styles.inner}>

        {/* ── Left sticky title ────────────────────────────── */}
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScrambleText className={styles.label}>// FAQ</ScrambleText>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            Got<br />
            <span className={styles.titleAccent}>Questions?</span>
          </motion.h2>
          <motion.p
            className={styles.sub}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Straight answers.<br />No fluff.
          </motion.p>
        </motion.div>

        {/* ── Right accordion ──────────────────────────────── */}
        <div className={styles.right}>
          {faq.map((item, i) => (
            <FaqItem
              key={i}
              index={i}
              question={item.question}
              answer={item.answer}
            />
          ))}
          <div className={styles.closingRule} />
        </div>

      </div>
    </section>
  )
}
