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
    const handler = () => setScrolled(window.scrollY > 60)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  const linkColor = scrolled ? 'var(--color-dark)' : 'rgba(255,255,255,0.82)'
  const logoFilter = scrolled ? 'none' : 'brightness(0) invert(1)'
  const hamColor = scrolled ? 'var(--color-dark)' : 'var(--color-white)'

  return (
    <>
      <header className={styles.header}>
        <div className={`${styles.inner} ${scrolled ? styles.innerScrolled : ''}`}>
          {/* Logo */}
          <a href="#" className={styles.logoLink} aria-label={site_info.brand_name}>
            <img
              src={logoUrl}
              alt={site_info.brand_name}
              className={styles.logo}
              style={{ filter: logoFilter }}
            />
          </a>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={styles.navLink}
                style={{ color: linkColor }}
              >
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
            style={{ color: hamColor }}
          >
            <span
              className={styles.bar}
              style={{
                transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className={styles.bar}
              style={{ opacity: mobileOpen ? 0 : 1 }}
            />
            <span
              className={styles.bar}
              style={{
                transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Grain overlay */}
            <div className={styles.menuGrain} aria-hidden />

            <nav className={styles.mobileNav} aria-label="Mobile navigation">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={styles.mobileLink}
                  onClick={closeMobile}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <motion.a
              href="#contact"
              className={styles.mobileCta}
              onClick={closeMobile}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              Let&apos;s Spar →
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
