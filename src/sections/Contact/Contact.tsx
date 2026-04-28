import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { contact, services } from '@/data/identity'
import { FitText } from '@/components/FitText'
import { ScrambleText } from '@/components/ScrambleText'
import { analytics } from '@/lib/analytics'
import styles from './Contact.module.css'

interface FormState {
  name: string
  email: string
  service: string
  message: string
}

const EMPTY: FormState = { name: '', email: '', service: '', message: '' }

const encode = (data: Record<string, string>) =>
  Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')

const EXPLODE_MS = 720

export function Contact() {
  const [form, setForm]           = useState<FormState>(EMPTY)
  const [status, setStatus]       = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [explodeOrigin, setExplodeOrigin] = useState<{ x: string; y: string } | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const buttonRef  = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (status === 'sent') {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [status])

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const start = Date.now()

    if (sectionRef.current && buttonRef.current) {
      const sr = sectionRef.current.getBoundingClientRect()
      const br = buttonRef.current.getBoundingClientRect()
      setExplodeOrigin({
        x: `${(((br.left + br.width / 2) - sr.left) / sr.width * 100).toFixed(1)}%`,
        y: `${(((br.top + br.height / 2) - sr.top) / sr.height * 100).toFixed(1)}%`,
      })
    }

    const waitForExplosion = () => {
      const remaining = EXPLODE_MS - (Date.now() - start)
      return remaining > 0 ? new Promise<void>(r => setTimeout(r, remaining)) : Promise.resolve()
    }

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...form }),
      })
      analytics.contactSubmitted(form.service)
      setForm(EMPTY)
      await waitForExplosion()
      setStatus('sent')
    } catch {
      await waitForExplosion()
      setStatus('error')
      setExplodeOrigin(null)
    }
  }

  return (
    <section className={styles.section} id="contact" ref={sectionRef}>

      {/* Lime explosion — covers entire section from button center */}
      {explodeOrigin && (
        <div
          className={styles.explodeOverlay}
          style={{ '--ox': explodeOrigin.x, '--oy': explodeOrigin.y } as React.CSSProperties}
        >
          {status === 'sent' && (
            <motion.div
              className={styles.successInner}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className={styles.successTitle}>Message received.</p>
              <p className={styles.successSub}>I'll get back to you within one business day.</p>
            </motion.div>
          )}
        </div>
      )}

      <div className={styles.inner}>

        {/* ── Left: statement ──────────────────────────────── */}
        <div className={styles.left}>
          <motion.div
            className={styles.titleBlock}
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Let's Work Together"
          >
            <FitText className={styles.titleLine}>Let's Work</FitText>
            <FitText className={styles.titleLineAccent}>Together</FitText>
          </motion.div>

          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {contact.tagline}
          </motion.p>

          <motion.a
            href="mailto:wouter.jagers@datajagers.nl"
            className={styles.emailLink}
            onClick={() => analytics.emailClicked()}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.32 }}
          >
            <ScrambleText className={styles.emailLabel}>// Or reach me directly</ScrambleText>
            <span className={styles.emailAddress}>wouter.jagers@datajagers.nl</span>
          </motion.a>
        </div>

        {/* ── Right: form ───────────────────────────────────── */}
        <div className={styles.right}>
          {status !== 'sent' && (
            <motion.form
              className={styles.form}
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              noValidate
            >
              <input type="hidden" name="form-name" value="contact" />
              <input type="hidden" name="bot-field" />

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" className={styles.input} placeholder="Tom Janssen" value={form.name} onChange={set('name')} required />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" className={styles.input} placeholder="tom@company.com" value={form.email} onChange={set('email')} required />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>What can I help you with?</label>
                <div className={styles.chips}>
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`${styles.chip} ${form.service === s.service_name ? styles.chipActive : ''}`}
                      onClick={() => setForm((f) => ({ ...f, service: s.service_name }))}
                    >
                      {s.hook}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`${styles.chip} ${form.service === 'Not sure yet' ? styles.chipActive : ''}`}
                    onClick={() => setForm((f) => ({ ...f, service: 'Not sure yet' }))}
                  >
                    Not sure yet
                  </button>
                </div>
                <input type="hidden" name="service" value={form.service} />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="message">Message</label>
                <textarea id="message" name="message" className={styles.textarea} placeholder="Share what's on your mind — even half a sentence is enough." value={form.message} onChange={set('message')} rows={5} required />
              </div>

              <div className={styles.submitRow}>
                {status === 'error' && (
                  <p className={styles.errorMessage}>Something went wrong — please try again.</p>
                )}
                <button
                  ref={buttonRef}
                  type="submit"
                  className={styles.submit}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending…' : 'Start the Conversation →'}
                </button>
              </div>
            </motion.form>
          )}
        </div>

      </div>
    </section>
  )
}
