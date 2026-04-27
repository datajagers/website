import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { contact, services } from '@/data/identity'
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

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (status === 'sent') {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [status])

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...form }),
      })
      setStatus('sent')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className={styles.section} id="contact" ref={sectionRef}>
      <div className={styles.inner}>

        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.label}>{`{${contact.label}}`}</span>
          <h2 className={styles.title}>
            Let's Work <span className={styles.accent}>Together</span>
          </h2>
          <p className={styles.tagline}>{contact.tagline}</p>
        </motion.div>

        {/* Form */}
        {status === 'sent' ? (
          <motion.div
            className={styles.successMessage}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={styles.successTitle}>Message received.</p>
            <p className={styles.successSub}>I'll get back to you within one business day.</p>
          </motion.div>
        ) : (
          <motion.form
            className={styles.form}
            name="contact"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            noValidate
          >
            <input type="hidden" name="form-name" value="contact" />
            <input type="hidden" name="bot-field" />

            {/* Name + Email */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={styles.input}
                  placeholder="Tom Janssen"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  placeholder="tom@company.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
              </div>
            </div>

            {/* Service Interest */}
            <div className={styles.fieldHalf}>
              <label className={styles.fieldLabel} htmlFor="service">Service Interest</label>
              <div className={styles.selectWrap}>
                <select
                  id="service"
                  name="service"
                  className={styles.select}
                  value={form.service}
                  onChange={set('service')}
                >
                  <option value="">Select a service…</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.service_name}>{s.service_name}</option>
                  ))}
                  <option value="Not sure yet">Not sure yet</option>
                </select>
                <span className={styles.selectArrow} aria-hidden>↓</span>
              </div>
            </div>

            {/* Message */}
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                className={styles.textarea}
                placeholder="Share anything you'd like"
                value={form.message}
                onChange={set('message')}
                rows={6}
                required
              />
            </div>

            {/* Submit */}
            <div className={styles.submitRow}>
              {status === 'error' && (
                <p className={styles.errorMessage}>Something went wrong — please try again.</p>
              )}
              <button type="submit" className={styles.submit} disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Get In Touch'}
              </button>
            </div>
          </motion.form>
        )}

      </div>
    </section>
  )
}
