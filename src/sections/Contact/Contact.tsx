import { useState } from 'react'
import { motion } from 'framer-motion'
import { contact, services, site_info } from '@/data/identity'
import styles from './Contact.module.css'

interface FormState {
  name: string
  email: string
  service: string
  message: string
}

const EMPTY: FormState = { name: '', email: '', service: '', message: '' }

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [sent, setSent] = useState(false)

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = `Contact from ${form.name} — ${form.service || 'General enquiry'}`
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Service interest: ${form.service || '—'}`,
      '',
      form.message,
    ].join('\n')
    window.location.href = `mailto:${site_info.founder === 'Wouter Jagers' ? 'wouter.jagers@datajagers.nl' : ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
    setForm(EMPTY)
  }

  return (
    <section className={styles.section} id="contact">
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
        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          noValidate
        >
          {/* Name + Email */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="name">Name</label>
              <input
                id="name"
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
            <button type="submit" className={styles.submit}>
              {sent ? 'Opening your mail app…' : 'Get In Touch'}
            </button>
          </div>
        </motion.form>

      </div>
    </section>
  )
}
