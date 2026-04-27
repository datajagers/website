import { motion } from 'framer-motion'

interface Props {
  text: string          // e.g. "Imagine.Build.Innovate."
  className?: string
  animate?: boolean     // word-by-word reveal (hero only)
  as?: 'h1' | 'h2' | 'span'
}

/**
 * Renders a dot-separated wordmark per the brand spec:
 * — separator dots → accent_structure (blue)
 * — terminal dot   → accent_innovation (lime)
 * If animate=true each word fades+slides in with 80ms stagger.
 */
export function Wordmark({ text, className, animate = false, as: Tag = 'h1' }: Props) {
  // "Imagine.Build.Innovate." → ["Imagine","Build","Innovate"]
  const words = text.split('.').filter(Boolean)

  if (!animate) {
    return (
      <Tag className={className}>
        {words.map((word, i) => {
          const isTerminal = i === words.length - 1
          return (
            <span key={word}>
              {word}
              <span className={isTerminal ? 'dot-innovation' : 'dot-structure'}>.</span>
            </span>
          )
        })}
      </Tag>
    )
  }

  // Animated variant — hero only
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }

  const wordVariant = {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
  }

  const dotVariant = {
    hidden:  { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1,  transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
  }

  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => {
        const isTerminal = i === words.length - 1
        return (
          <motion.span key={word} variants={wordVariant} style={{ display: 'inline' }}>
            {word}
            <motion.span
              className={isTerminal ? 'dot-innovation' : 'dot-structure'}
              variants={isTerminal ? dotVariant : wordVariant}
            >
              .
            </motion.span>
          </motion.span>
        )
      })}
    </motion.h1>
  )
}
