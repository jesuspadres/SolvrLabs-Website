# Free Operations Assessment landing page + homepage repositioning

**Date:** 2026-05-14
**Owner:** Jessy / Solvr Labs
**Ship target:** one evening

## Goal

1. Add a dedicated `/assessment` landing page promoting the free operations assessment offer (30-min call, written report in 48 hours, no sales pitch).
2. Reposition the homepage so visitors understand Solvr Labs helps any small business with operational problems — not just trades, not just AI receptionist.

The new page must be bilingual (English / Spanish) on a single URL via inline toggle.

## Constraints

- **Site is static HTML + Tailwind via CDN script** — not Next.js, not React. No env vars, no shadcn/ui, no i18n framework. Plain HTML, plain JS, Tailwind classes only.
- Vercel deploys with `cleanUrls: true`. A file at `assessment.html` resolves to `/assessment`.
- Must match the existing brand system: `brand.50–950` blues, DM Sans, the `.reveal` scroll-animation pattern, rounded-pill buttons (`px-7 py-3 rounded-full bg-brand-600`), `rounded-2xl shadow-sm border border-gray-100` cards, the `.faq-item` accordion pattern from `radar.html`.
- Real Vimeo IDs, phone numbers, and Calendly URLs are not available yet — bake in clearly-marked placeholders.
- No analytics product is installed on the site today. Stub the event helper now; wire to a real provider later.

## Architecture

**One file:** `assessment.html` at site root. Both EN and ES content live in the same DOM, gated by `body[data-lang="en|es"]` + CSS attribute selectors on `.lang-en` / `.lang-es` classes. A toggle button flips the attribute, swaps the visible Vimeo iframe, updates `document.title` + meta description + `<html lang>`, and writes `#es` (or removes it) to the URL hash for persistence.

**No `evaluacion.html`** — saves duplication. The hash-based URL means the Spanish page is shareable as `/assessment#es`.

**Homepage edits:** small, targeted edits to `index.html` only. No restructuring.

## Page structure — `/assessment`

```
<nav>                                    (existing nav, unchanged)

<section hero>
  EN/ES toggle pill (top-right of hero)
  Headline                                "Free Operations Assessment for Small Businesses"
  Subhead                                 "30 minutes. Written report in 48 hours. No sales pitch."
  Vimeo embed (responsive 16:9, autoplay muted, captions on)
    - iframe.lang-en + iframe.lang-es side by side, one hidden
  Two CTA buttons (stack on mobile)
    - Primary  : Book a call with Jessy  → CALENDLY_URL_{LANG}
    - Secondary: Call our assessment line → tel:PHONE_PHOENIX
      Caption below: "Or call our Tucson line: tel:PHONE_TUCSON"

<section "What you'll get">              (3 cards, md:grid-cols-3)
  1. A real conversation, not a sales pitch
  2. A written report within 48 hours
  3. Yours to keep, no matter what

<section "Two ways to get started">     (md:grid-cols-2)
  Left  card (Recommended badge): Talk to Jessy directly
    - 30–45 min Zoom · Mon–Sat · best if you want questions answered
    - CTA: Book a time → CALENDLY_URL_{LANG}
  Right card: Call our AI line (24/7)
    - 15–20 min phone · any time · best if you're busy
    - CTA: tel:PHONE_PHOENIX (Phoenix) / tel:PHONE_TUCSON (Tucson)

<section FAQ>                            (6 questions, md:grid-cols-2, .faq-item accordion)
  1. Is this really free?
  2. What kind of businesses do you work with?
  3. How long does the whole process take?
  4. What if I call after hours?
  5. Do you work in Spanish?
  6. What happens to my information?

<section bottom CTA>                     (full-width brand-gradient, mirrors TaskLine banner)
  "Book your free assessment →" → CALENDLY_URL_{LANG}

<footer>                                 (existing footer, unchanged)
```

## Language toggle behavior

- Button label: "En español" when EN active, "In English" when ES active.
- Click:
  1. Toggle `body[data-lang]` between `en` and `es`.
  2. Update `document.documentElement.lang`.
  3. Pause hidden Vimeo player; unmute + play visible player via the Vimeo Player JS API.
  4. Swap `document.title` and `<meta name="description">` content.
  5. Update `location.hash`: `#es` or empty (uses `history.replaceState` so no scroll jump).
  6. Fire `trackEvent('assessment_click_lang_toggle', { to: 'en' | 'es' })`.
- On load:
  - If `location.hash === '#es'` → ES.
  - Else if `navigator.language.startsWith('es')` → ES.
  - Else → EN.

## Placeholders block

A single HTML comment at the top of `assessment.html` lists every value to swap:

```html
<!-- ==========================================================
     CONFIG — replace these placeholders before going live:
       VIMEO_ID_EN          (numeric Vimeo video ID, English video)
       VIMEO_ID_ES          (numeric Vimeo video ID, Spanish video)
       CALENDLY_URL_EN      (full URL, e.g. https://calendly.com/jessy-solvr/assessment)
       CALENDLY_URL_ES      (full URL, Spanish event)
       PHONE_PHOENIX        (E.164 for tel:, e.g. +16025550000)
       PHONE_PHOENIX_LABEL  (display, e.g. "(602) 555-0000")
       PHONE_TUCSON         (E.164 for tel:, e.g. +15205550000)
       PHONE_TUCSON_LABEL   (display, e.g. "(520) 555-0000")
     ========================================================== -->
```

## Analytics

`window.trackEvent(name, props)` helper, defined at top of `assessment.html`. Today it `console.debug`s. When Plausible/Fathom/GA4 is installed sitewide, the helper body is replaced once.

Wired events:
- `assessment_page_view` (on DOMContentLoaded)
- `assessment_video_play` (Vimeo `play` event)
- `assessment_video_50` (Vimeo `timeupdate` ≥ 50% — fired once)
- `assessment_video_90` (Vimeo `timeupdate` ≥ 90% — fired once)
- `assessment_click_book_calendly` (any Calendly link)
- `assessment_click_phone` with `{ location: 'phoenix' | 'tucson' }`
- `assessment_click_lang_toggle` with `{ to: 'en' | 'es' }`
- `assessment_faq_open` with `{ question: '<kebab-id>' }` (only on open, not close)

## SEO

- `<title>` EN: `Free Operations Assessment for AZ Small Businesses | Solvr Labs`
- `<title>` ES: `Evaluación Gratuita de Operaciones para Pequeños Negocios en AZ | Solvr Labs`
- Meta description EN: `Get a free 30-minute operations assessment and a written report in 48 hours. No sales pitch. Available in English and Spanish across Arizona.`
- Meta description ES: `Recibe una evaluación gratuita de operaciones de 30 minutos y un informe escrito en 48 horas. Sin presión de venta. Disponible en inglés y español en todo Arizona.`
- OG image: placeholder reference `assets/og-assessment.png` — note in CONFIG block that this image needs to be created.
- JSON-LD Service schema: provider Solvr Labs, areaServed Arizona, offers price 0 USD, description matches meta.

## Homepage edits — `index.html`

**1. New banner strip — inserted between hero close and TaskLine banner (currently line 359/361).**
- Style: light, `bg-white` with `border-y-2 border-brand-200`, so it does not visually fight the dark TaskLine banner that follows.
- Content: small "NEW" pill (brand-100 background) + headline "Free Operations Assessment" + subhead "30 minutes with Jessy. A written report in 48 hours. No sales pitch." + CTA `Learn more →` linking `/assessment`.
- Layout: `flex flex-col sm:flex-row items-center justify-between` matching the TaskLine banner.

**2. "What I Do" section copy — lines 393-430 of index.html.**
- Eyebrow: `What I Do` → `How I Help`
- Heading: `AI Integration Services` → `Three Ways to Get Your Time Back`
- Subhead: `I plug AI into your existing workflow…` → `Whether you run a law office, a clinic, an e-commerce shop, or a trades business — these are the three ways I help small teams stop drowning in operations.`
- Card 1: `AI Workflow Automation` → `Save hours every week`
  - Body: `Connect your existing tools and automate the work that eats your day — missed call text-backs, proposal drafts, invoice follow-ups. Set it up once; it runs on its own.`
- Card 2: `Voice AI & Smart Receptionist` → `Never miss a customer call`
  - Body: `An AI line that answers your phone, books appointments, and follows up — 24/7, in English and Spanish. Even on weekends. Even at 2am.`
- Card 3: `Custom AI Software` → `Tools built around your business`
  - Body: `Full-stack apps with AI built in — client portals, dashboards, internal tools — designed around how your business actually works, not how a template says it should.`

Everything else on the homepage (nav, hero, TaskLine sections, FAQ, footer) is untouched.

## Mobile behavior

- Hero CTAs: `flex-wrap gap-3` so they stack on narrow screens (already the standard pattern in this codebase).
- Comparison cards: `grid md:grid-cols-2 gap-6` — stack on mobile.
- Vimeo embed: responsive 16:9 via `padding-top:56.25%` wrapper. Plays inline (not fullscreen) — Vimeo's default behavior.
- Phone numbers: `tel:` href on every phone link so tapping opens the dialer.
- Calendly: `target="_blank" rel="noopener noreferrer"` on every Calendly link.

## Definition of Done

- [ ] `/assessment` renders correctly desktop and mobile (Chrome + Safari iOS).
- [ ] EN/ES toggle works: visual swap, video swap, title swap, hash persistence.
- [ ] Direct link to `/assessment#es` opens in Spanish.
- [ ] `tel:` links open the dialer on a mobile device.
- [ ] FAQ accordion opens/closes; multiple can be open at once (matches existing radar.html behavior).
- [ ] Vimeo iframe loads (with placeholder ID it'll show "Video not found" — acceptable for handoff).
- [ ] Homepage banner renders above TaskLine banner, links to `/assessment`.
- [ ] "How I Help" copy edits applied to index.html.
- [ ] All placeholders documented in the CONFIG block.
- [ ] No new external dependencies added (no shadcn, no i18n library, no analytics script).
- [ ] No console errors in the browser dev tools on the new page.

## Out of scope (deferred)

- Real Vimeo videos, phone numbers, Calendly URLs (placeholders only).
- Real OG image (placeholder reference only).
- Analytics provider integration (stub only).
- Hero copy changes on homepage (intentionally untouched).
- Industries footer update (intentionally untouched — broadening lives in the "How I Help" section).
- Full positioning rewrite of services.html, about.html, etc.
