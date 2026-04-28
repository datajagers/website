import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { faq } from '@/data/identity'
import styles from './FAQ.module.css'

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className={`${styles.item} ${open ? styles.itemOpen : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
    >
      <div className={styles.rule} />

      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.question}>{question}</span>
        <span className={styles.icon} aria-hidden>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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

        <motion.div
          className={styles.left}
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.label}>// FAQ</span>
          <h2 className={styles.title}>
            Got<br />
            <span className={styles.titleAccent}>Questions?</span>
          </h2>
          <p className={styles.sub}>
            Straight answers.<br />No fluff.
          </p>
        </motion.div>

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
