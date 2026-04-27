import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { site_info } from '@/data/identity'
import logoUrl from '@assets/logo_same_hight.svg'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.header
        className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className={styles.inner}>

          {/* Logo */}
          <a href="#" className={styles.logoLink} aria-label={site_info.brand_name}>
            <img src={logoUrl} alt={site_info.brand_name} className={styles.logo} />
          </a>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a href="#contact" className={styles.cta}>
            Let&apos;s Spar
          </a>

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className={styles.bar} style={{ transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : 'none' }} />
            <span className={styles.bar} style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span className={styles.bar} style={{ transform: mobileOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
          </button>

        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <nav className={styles.mobileNav} aria-label="Mobile navigation">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={styles.mobileLink}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <motion.a
              href="#contact"
              className={styles.mobileCta}
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            >
              Let&apos;s Spar →
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
