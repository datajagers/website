import { motion } from 'framer-motion'
import { site_info } from '@/data/identity'
import logoUrl from '@assets/logo_same_hight.svg'
import styles from './Footer.module.css'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

const YEAR = new Date().getFullYear()

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-40px' },
  transition:  { delay, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] as const },
})

export function Footer() {
  return (
    <footer className={styles.footer}>

      {/* ── Showreel band ───────────────────────────────────── */}
      <div className={styles.band}>
        <div className={styles.bandInner}>
          <span className="caption-label">{site_info.brand_name.toUpperCase()}</span>
          <div className="showreel-band__rule" />
          <span className="caption-label">{site_info.core_slogan.toUpperCase()}</span>
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────── */}
      <div className={styles.inner}>

        <motion.div className={styles.brand} {...fadeUp(0)}>
          <a href="#" aria-label={site_info.brand_name}>
            <img src={logoUrl} alt={site_info.brand_name} className={styles.logo} />
          </a>
          <p className={styles.tagline}>{site_info.footer_slogan}</p>
          <div className={styles.contact}>
            <a href={`tel:${site_info.phone.replace(/\s/g, '')}`} className={styles.contactLink}>
              {site_info.phone}
            </a>
            <a href={`mailto:${site_info.email}`} className={styles.contactLink}>
              {site_info.email}
            </a>
          </div>
        </motion.div>

        <motion.nav className={styles.nav} aria-label="Footer navigation" {...fadeUp(0.06)}>
          <span className={styles.navHeading}>Navigate</span>
          <ul className={styles.navList}>
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.navLink}>{item.label}</a>
              </li>
            ))}
          </ul>
        </motion.nav>

        <motion.div className={styles.cta} {...fadeUp(0.12)}>
          <span className={styles.navHeading}>Start a project</span>
          <p className={styles.ctaText}>
            Have a challenge in mind?<br />Let&apos;s talk.
          </p>
          <a href="#contact" className={styles.ctaButton}>Book a session</a>
        </motion.div>

      </div>

      {/* ── Bottom bar ──────────────────────────────────────── */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <div className={styles.rule} />
          <div className={styles.bottomRow}>
            <p className={styles.copyright}>© {YEAR} {site_info.brand_name}. All rights reserved.</p>
            <p className={styles.copyright}>Built by {site_info.founder}</p>
          </div>
        </div>
      </div>

    </footer>
  )
}
