import { site_info } from '@/data/identity'
import logoUrl from '@assets/logo_same_hight.svg'
import styles from './Footer.module.css'

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Brand */}
        <div className={styles.brand}>
          <img src={logoUrl} alt={site_info.brand_name} className={styles.logo} />
          <p className={styles.tagline}>{site_info.footer_slogan}</p>
          <div className={styles.contact}>
            <a href={`tel:${site_info.phone.replace(/\s/g, '')}`} className={styles.contactLink}>
              {site_info.phone}
            </a>
            <a href={`mailto:${site_info.email}`} className={styles.contactLink}>
              {site_info.email}
            </a>
          </div>
        </div>

        {/* Nav */}
        <nav className={styles.nav} aria-label="Site navigation">
          <span className={styles.navHeading}>Navigate</span>
          <ul className={styles.navList}>
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.navLink}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA column */}
        <div className={styles.cta}>
          <span className={styles.navHeading}>Start a project</span>
          <p className={styles.ctaText}>Have a challenge in mind?<br />Let&apos;s talk.</p>
          <a href="#contact" className={styles.ctaButton}>Get in touch</a>
        </div>

      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <hr className={styles.rule} />
          <div className={styles.bottomRow}>
            <p className={styles.copyright}>© {YEAR} {site_info.brand_name}. All rights reserved.</p>
            <p className={styles.copyright}>Built by {site_info.founder}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
