import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './PrivacyNotice.module.css'

const STORAGE_KEY = 'dj_privacy_accepted'

export function PrivacyNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Small delay so it doesn't compete with page load animations
      const t = setTimeout(() => setVisible(true), 1800)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.bar}
          role="region"
          aria-label="Privacy notice"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.inner}>
            <div className={styles.text}>
              <span className={styles.label}>// Privacy</span>
              <p className={styles.body}>
                This site uses no tracking cookies. We only process personal data you submit via the contact form.{' '}
                <a href="/privacy" className={styles.link}>Read our privacy policy</a>.
              </p>
            </div>
            <button className={styles.accept} onClick={accept} aria-label="Acknowledge privacy notice">
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
