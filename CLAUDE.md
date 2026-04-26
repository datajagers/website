# Datajagers Website — Claude Project Instructions

## Mandatory Workflow Rule

**Before writing any frontend code — every session, no exceptions — invoke the `/frontend-design` skill.**
This ensures every component starts from a deliberate aesthetic direction, not a default. Do not skip this step even for small components or quick fixes.

---

## What We're Building

A fully dynamic, production-ready React website for **Datajagers**, a solo consultancy run by Wouter Jagers. The site must feel like a premium, high-conviction brand — not a generic agency template. Every component, copy choice, and interaction should reflect the Digital DNA encoded in `datajagers_identity.json`.

---

## Brand Identity (Single Source of Truth)

### Core Slogan
> **Imagine. Build. Innovate.**

Footer variant: *"Focusing on your Why — I help you imagine.build.innovate"*

### Colour Palette

| Token | Hex | Role |
|---|---|---|
| `--color-dark` | `#363636` | Foundational text, dark contrast elements |
| `--color-white` | `#FFFFFF` | Contrast text on dark; occasional light panels |
| `--color-blue` | `#5d67e6` | **Dominant** — primary section backgrounds, hero, heavy panels |
| `--color-lime` | `#cfff71` | **Accent only** — primary CTA, one highlight per section maximum |

Use these as CSS custom properties. Never hardcode hex values in components — always reference the token.

**Palette hierarchy:** The site is blue-first. `#5d67e6` is the dominant background tone across major sections. `#363636` is used for text, dark contrast panels, and grounding elements. White provides contrast and readability on coloured backgrounds. Lime is a true accent — signals "act now" exactly where needed, never on more than one element per visible viewport.

### Typography
- Font family: **Inter** (assets/Inter/ — already available locally, do not load from CDN)
- Voice: Personal, Direct, Structured, Value-driven
- Never write in third person. Wouter speaks directly to the visitor.

### Tone of Voice Rules
- Short sentences. Punchy hooks. No filler words.
- Lead with the client's pain, not with credentials.
- The crucial question to keep in mind when writing any copy: *"What do you want to achieve with this data?"*
- Needs only half a sentence to understand complex issues — copy should reflect this speed.

---

## Services (content source of truth)

| ID | Hook | Service Name | Accent Colour |
|---|---|---|---|
| `optimize` | Optimize what's slow | Process Optimization | `#5d67e6` |
| `structure` | Structure what's messy | Data Architecture & Dashboards | `#363636` |
| `uncover` | Uncover what's hidden | Data Analysis | `#cfff71` |
| `build` | Build what's missing | Custom Software & Tools | `#cfff71` |

Each service card must show: hook, service name, method tag, target audience blurb, and deliverables. Full descriptions and hashtag arrays are in `datajagers_identity.json`.

---

## Proven Process (4 steps)

1. **The Sparring Session** — Uncovering the 'Why' `(blue)`
2. **The Blueprint** — Mapping efficient paths using Lean Six Sigma `(dark)`
3. **The Build & Optimize** — Rapid realization of the missing pieces `(lime)`
4. **Value Delivery** — Refining and ongoing support `(blue)`

---

## Available Assets

All assets live in `assets/`. Reference them by relative path from the component.

### Images
| File | Use |
|---|---|
| `sparring.jpeg` | Process step 1 — Sparring Session |
| `blueprint.jpeg` | Process step 2 — Blueprint |
| `thebuild.jpeg` | Process step 3 — Build & Optimize |
| `valuedelivery.jpeg` | Process step 4 — Value Delivery |
| `optimizewhatisslow.jpeg` | Service — Process Optimization |
| `structurewhatismessy.jpeg` | Service — Data Architecture |
| `findwhatismissing.jpeg` | Service — Data Analysis |
| `buildwhatismissing.jpeg` | Service — Custom Software |
| `customersupport.jpeg` | General / support / testimonials section |

### Logos & Icons
| File | Use |
|---|---|
| `logo_no_point.svg` | Primary logo (with border) |
| `logo_no_point_no_border.svg` | Logo on dark/coloured backgrounds |
| `logo_no_point_no_border_grey_bg.svg` | Logo on grey backgrounds |
| `logo_same_hight.svg` | Logo + wordmark, equal height |
| `logo_wide_no_border.svg` | Wide horizontal lockup |
| `favicon.png` | Browser favicon (32×32) |
| `apple_touch_icon.png` | Apple touch icon (180×180) |
| `socialpreview.png` | OG / social share preview image |

---

## Personas & Reasons to Choose

Four differentiators to weave into the site — especially hero and about sections:

1. **Proven Experience** — Insights from a current full-time Business Analyst.
2. **Personalized Approach** — Strategic sparring partner who challenges your 'Why'.
3. **1-Stop Shop** — Handling everything from process optimization to custom AI builds.
4. **Ongoing Support** — Reliability beyond the build to ensure tools stay valuable.

---

## Testimonials

| Quote | Theme |
|---|---|
| "Worth his weight in gold. Understands exactly what's needed from just half a sentence." | Intuition & Speed |
| "Ensures time is invested in projects that add real value instead of sitting on a shelf." | Value focus |
| "Creates a rock-solid foundation by turning complex ideas into organized systems." | Structured mindset |

---

## Design System — Shape & Radius

Apple-like premium feel: everything rounded. Use the radius tokens from `tokens.css` — never hardcode `border-radius` values.

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 8px | Tags, badges, small chips |
| `--radius-md` | 14px | Inputs, small cards |
| `--radius-lg` | 20px | Service cards, feature panels |
| `--radius-xl` | 28px | Large hero cards, modals |
| `--radius-pill` | 999px | All buttons, CTAs |

**Rule:** Buttons are always pill-shaped (`--radius-pill`). Cards use `--radius-lg` or `--radius-xl`. Nothing on this site has sharp corners.

---

## Technical Conventions

- **Stack**: React (functional components, hooks only — no class components)
- **Styling**: CSS custom properties + CSS Modules (chosen — stay consistent, no Tailwind)
- **Data source**: Components read content from `datajagers_identity.json` — never hardcode business copy inside JSX
- **No placeholder content**: Every component ships with real brand copy, not Lorem Ipsum
- **Responsive-first**: Mobile breakpoint → tablet → desktop
- **Accessibility**: Semantic HTML, alt text on all images, keyboard-navigable interactions
- **Performance**: Lazy-load heavy JPEG assets; use `<img loading="lazy" />` or dynamic imports
- **No external UI libraries** unless the user explicitly approves (e.g. Framer Motion for animation is fine to propose, not to add silently)
- **Contact form**: Wouter's email is `wouter.jagers@datajagers.nl`

---

## File & Folder Conventions

```
src/
  components/      # Reusable UI pieces (Button, ServiceCard, TestimonialCard…)
  sections/        # Full-page sections (Hero, Services, Process, Testimonials, Contact)
  data/            # Re-exports of datajagers_identity.json as typed constants
  styles/          # Global CSS variables / reset
  assets/          # Symlink or copy of ../assets/ — resolve at setup time
```

---

## What NOT to Do

- Do not invent slogans, copy, or service descriptions — use `datajagers_identity.json` as the single source of truth.
- Do not add services, steps, or testimonials beyond what is in the JSON.
- Do not use stock placeholder images — only use the images listed above.
- Do not change brand colours without an explicit instruction from Wouter.
- Do not add animations that slow perceived load time on mobile.
- Do not use a generic "Contact Us" CTA — match the brand voice (e.g. *"Let's Spar"* or *"Start the Conversation"*).
