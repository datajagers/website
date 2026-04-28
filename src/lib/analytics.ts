// Plausible custom events — typed wrapper
// Plausible is injected via index.html; this module provides a safe call site.

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

function track(event: string, props?: Record<string, string>) {
  window.plausible?.(event, props ? { props } : undefined)
}

// ── Named events ───────────────────────────────────────────
// Add new events here as the site grows.

export const analytics = {
  /** Visitor clicked the hero "Start the conversation" CTA */
  heroCta: () => track('Hero CTA Clicked'),

  /** Visitor submitted the contact form successfully */
  contactSubmitted: (service: string) =>
    track('Contact Form Submitted', { service: service || 'Not specified' }),

  /** Visitor clicked the direct email link in the contact section */
  emailClicked: () => track('Email Link Clicked'),
}
