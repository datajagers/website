import raw from '../../datajagers_identity.json'

export const identity = raw

export const {
  site_info,
  persona,
  value_proposition,
  services,
  process_intro,
  proven_process,
  testimonials,
  contact,
  faq,
  content_extensions,
} = raw

export type Service      = typeof services[number]
export type ProcessStep  = typeof proven_process[number]
export type Testimonial  = typeof testimonials[number]
export type FaqItem      = typeof faq[number]
export type Reason       = typeof value_proposition.reasons_to_choose[number]
