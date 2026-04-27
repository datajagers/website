import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { faq, content_extensions } from '@/data/identity'
import styles from './FAQ.module.css'

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { delay, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] as const },
})

function FaqItem({
  question,
  answer,
  index,
  open,
  onToggle,
}: {
  question: string
  answer: string
  index: number
  open: boolean
  onToggle: () => void
}) {
  return (
    <motion.div className={styles.item} {...fadeUp(0.1 + index * 0.06)}>
      <div className={styles.rule} />

      <button
        className={styles.trigger}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className={styles.question}>{question}</span>
        <motion.span
          className={styles.icon}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          aria-hidden
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
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
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const headline = content_extensions.section_headlines.faq
  const base     = headline.endsWith('.') ? headline.slice(0, -1) : headline

  return (
    <section className={styles.section} id="faq">
      <div className={styles.inner}>

        {/* ── Left: sticky headline ─────────────────────────── */}
        <motion.div className={styles.left} {...fadeUp(0)}>
          <p className={`caption-label ${styles.eyebrow}`}>THINGS PEOPLE ASK</p>
          <span className={`mono-sm ${styles.sectionIndex}`}>// 05</span>
          <h2 className={styles.headline}>
            {base}<span className="dot-innovation">.</span>
          </h2>
        </motion.div>

        {/* ── Right: accordion ──────────────────────────────── */}
        <div className={styles.right}>
          {faq.map((item, i) => (
            <FaqItem
              key={i}
              index={i}
              question={item.question}
              answer={item.answer}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
          <div className={styles.closingRule} />
        </div>

      </div>
    </section>
  )
}
