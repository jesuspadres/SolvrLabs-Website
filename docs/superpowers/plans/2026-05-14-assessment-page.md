# Assessment Page + Homepage Repositioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual `/assessment` landing page promoting Solvr Labs' free operations assessment, and lightly reposition the homepage so visitors understand we help any small business, not just trades and not just AI receptionist.

**Architecture:** Single static HTML file `assessment.html` at site root (Vercel `cleanUrls: true` makes it `/assessment`). Both English and Spanish content live in the same DOM, gated by `body[data-lang="en|es"]` + CSS attribute selectors. A toggle button flips the attribute, swaps the visible Vimeo iframe via the Vimeo Player JS API, updates `<title>` / meta / URL hash, and fires an analytics event. Homepage gets a new banner above the existing TaskLine banner plus targeted copy edits in the "What I Do" section. No new dependencies, no build step.

**Tech Stack:** Plain HTML5, Tailwind via CDN (`https://cdn.tailwindcss.com`), DM Sans (Google Fonts), vanilla JavaScript, Vimeo Player JS API (`https://player.vimeo.com/api/player.js`). Deployed via Vercel static hosting. No test runner — verification is manual browser checks against the spec's Definition of Done.

**Reference spec:** [`docs/superpowers/specs/2026-05-14-assessment-page-design.md`](../specs/2026-05-14-assessment-page-design.md)

**Reference existing patterns to mimic:**
- Nav + footer: `index.html:144-196` and `index.html:900-937`
- Hero card / shadow / brand colors: `index.html:198-358`
- Reveal-on-scroll animation: `index.html:58-66` (CSS) + `index.html:946-953` (JS observer)
- TaskLine banner (template for both the new homepage banner and the assessment bottom-CTA): `index.html:361-391`
- "What I Do" card pattern: `index.html:393-430`
- FAQ accordion pattern: `radar.html:36-39` (CSS) + `radar.html:1180-1205` (markup, click toggle inline)
- Tailwind config and `<style>` block to copy verbatim into the new page: `index.html:9-139`

---

## File Structure

**Create:**
- `assessment.html` — the new landing page (everything in one file: head, nav copy, hero with Vimeo embed, three sections, FAQ, bottom CTA, footer copy, inline `<script>` block for toggle + analytics + Vimeo events).

**Modify:**
- `index.html` — insert a new banner section between the hero close (`</section>` at line 358) and the TaskLine banner (line 361); rewrite the "What I Do" section copy at lines 393-430.

**No modifications needed to:**
- `vercel.json` (existing `cleanUrls: true` already makes `assessment.html` resolve as `/assessment` — no new redirect required).
- Any other HTML files, the `scripts/` directory, or any assets.

---

## Task 1: Scaffold assessment.html with nav, footer, and base style

**Goal of this task:** Get an empty-but-styled page at `/assessment` that uses the existing nav and footer and visually matches the rest of the site. No content yet — just the shell.

**Files:**
- Create: `assessment.html`

- [ ] **Step 1: Create the file with the exact head + nav + footer shell from index.html**

Copy lines 1-196 of `index.html` (everything from `<!DOCTYPE html>` through the end of the `</nav>` block including the mobile menu) into the new file, with these specific changes:

1. Change `<title>` to: `Free Operations Assessment for AZ Small Businesses | Solvr Labs`
2. Change `<meta name="description">` to: `Get a free 30-minute operations assessment and a written report in 48 hours. No sales pitch. Available in English and Spanish across Arizona.`
3. Add immediately after the `<meta name="description">` line:
   ```html
   <meta property="og:title" content="Free Operations Assessment | Solvr Labs">
   <meta property="og:description" content="30-minute call, written report in 48 hours. No sales pitch. English &amp; Spanish.">
   <meta property="og:image" content="/assets/og-assessment.png">
   <meta property="og:type" content="website">
   <meta property="og:url" content="https://solvrlabs.com/assessment">
   <link rel="alternate" hreflang="en" href="https://solvrlabs.com/assessment">
   <link rel="alternate" hreflang="es" href="https://solvrlabs.com/assessment#es">
   ```
4. In the nav, change `<a href="/" class="text-lg font-medium text-brand-600">Home</a>` to `<a href="/" class="text-lg font-medium text-gray-500 hover:text-brand-600 transition-colors">Home</a>` (since we are no longer on the home page — match the inactive-link style used for the other nav items).
5. Same change in the mobile menu: change `<a href="/" class="block px-3 py-2.5 text-sm font-medium text-brand-600 rounded-lg">Home</a>` to `<a href="/" class="block px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">Home</a>`.

After the nav block, add the footer by copying lines 877-937 from `index.html` (the `<footer>` block) and place it at the END of the file. Between the nav close and the footer, add:

```html
<!-- ==========================================================
     CONFIG — replace these placeholders before going live:
       VIMEO_ID_EN          numeric Vimeo video ID, English video
       VIMEO_ID_ES          numeric Vimeo video ID, Spanish video
       CALENDLY_URL_EN      full URL, e.g. https://calendly.com/jessy-solvr/assessment
       CALENDLY_URL_ES      full URL, Spanish event
       PHONE_PHOENIX        E.164 for tel:, e.g. +16025550000
       PHONE_PHOENIX_LABEL  display, e.g. "(602) 555-0000"
       PHONE_TUCSON         E.164 for tel:, e.g. +15205550000
       PHONE_TUCSON_LABEL   display, e.g. "(520) 555-0000"
       /assets/og-assessment.png  social-share image (1200x630)
     ========================================================== -->

<main class="pt-20">
  <!-- Sections go here in later tasks -->
</main>
```

Add `data-lang="en"` to the `<body>` tag so it reads:
```html
<body data-lang="en" class="bg-white text-gray-900 overflow-x-hidden">
```

Close with `</body></html>` after the footer.

Inside the existing `<style>` block (already copied from index.html), add the language-toggle CSS rules at the end of the block, just before `</style>`:

```css
/* Language toggle */
body[data-lang="en"] .lang-es { display: none !important; }
body[data-lang="es"] .lang-en { display: none !important; }

/* FAQ accordion (mirrors radar.html) */
.faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.4s ease-out; }
.faq-item.open .faq-answer { max-height: 400px; }
.faq-item.open .faq-icon { transform: rotate(45deg); }
.faq-icon { transition: transform 0.3s ease; }

/* Responsive 16:9 video wrapper */
.video-wrap { position: relative; padding-top: 56.25%; height: 0; }
.video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
```

At the very end of the `<body>`, just before `</body>`, add the script block scaffolding from `index.html:939-980` (the mobile menu burger + IntersectionObserver). Adapt the mobile menu handler if needed — the existing pattern reads:

```html
<script>
  // Mobile menu
  document.getElementById('burger').addEventListener('click', function () {
    this.classList.toggle('active');
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });

  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
</script>
```

- [ ] **Step 2: Verify the shell renders**

Open `assessment.html` in a browser (double-click the file, or run a local server). Expected:

- The Solvr Labs logo and full nav appear at the top, with all links present.
- The footer appears at the bottom with the existing Solvr Labs branding.
- The page body between them is empty (just whitespace from the `<main>` placeholder).
- No console errors.
- Mobile menu opens when the burger is clicked.

If the nav links are styled differently from `index.html`, the styles weren't copied correctly — re-verify against `index.html:9-139`.

- [ ] **Step 3: Commit**

```bash
git add assessment.html
git commit -m "feat(assessment): scaffold assessment.html with nav, footer, and base styles"
```

---

## Task 2: Build the hero section with EN + ES content and Vimeo embed

**Goal of this task:** Headline, subhead, language toggle button, responsive 16:9 Vimeo embed with both EN + ES iframes in the DOM (Spanish hidden), and the two CTA buttons. No JS behavior yet — toggle is non-functional, video is just embedded with no API control.

**Files:**
- Modify: `assessment.html` (inside `<main>`)

- [ ] **Step 1: Replace the `<main>` placeholder with the hero section**

Find the `<main class="pt-20">` block in `assessment.html` and replace its contents with:

```html
<main class="pt-20">

  <!-- ===================== HERO ===================== -->
  <section class="relative bg-white overflow-hidden">
    <div class="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[700px] sm:h-[700px] bg-brand-100/50 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none"></div>
    <div class="relative max-w-5xl mx-auto px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">

      <!-- Language toggle pill -->
      <div class="flex justify-end mb-8">
        <button id="lang-toggle" type="button"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50 text-sm font-medium text-gray-700 transition-colors">
          <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
          <span class="lang-en">En español</span>
          <span class="lang-es">In English</span>
        </button>
      </div>

      <!-- Headline -->
      <div class="text-center max-w-3xl mx-auto mb-10">
        <h1 class="font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-brand-900 mb-5">
          <span class="lang-en">Free Operations Assessment for Small Businesses</span>
          <span class="lang-es">Evaluación Gratuita de Operaciones para Pequeños Negocios</span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-500 leading-relaxed">
          <span class="lang-en">30 minutes. A written report in 48 hours. The fixes you've been missing — without the sales pitch.</span>
          <span class="lang-es">30 minutos. Un informe escrito en 48 horas. Las soluciones que te estás perdiendo, sin la presión de venta.</span>
        </p>
      </div>

      <!-- Vimeo embed -->
      <div class="relative max-w-3xl mx-auto mb-10">
        <div class="video-wrap rounded-2xl overflow-hidden shadow-2xl shadow-gray-300/50 border border-gray-200/80 bg-gray-100">
          <iframe id="vimeo-en" class="lang-en"
                  src="https://player.vimeo.com/video/VIMEO_ID_EN?autoplay=1&amp;muted=1&amp;loop=0&amp;controls=1&amp;texttrack=en&amp;dnt=1"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowfullscreen
                  title="Solvr Labs Free Operations Assessment — Introduction"></iframe>
          <iframe id="vimeo-es" class="lang-es"
                  src="https://player.vimeo.com/video/VIMEO_ID_ES?autoplay=0&amp;muted=1&amp;loop=0&amp;controls=1&amp;texttrack=es&amp;dnt=1"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowfullscreen
                  title="Solvr Labs Evaluación Gratuita de Operaciones — Introducción"></iframe>
        </div>
      </div>

      <!-- CTA buttons -->
      <div class="max-w-2xl mx-auto">
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="CALENDLY_URL_EN" target="_blank" rel="noopener noreferrer"
             data-event="assessment_click_book_calendly"
             class="lang-en inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-600 hover:bg-brand-700 rounded-full text-white text-base font-semibold transition-colors shadow-md shadow-brand-600/20">
            Book a call with Jessy
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
          <a href="CALENDLY_URL_ES" target="_blank" rel="noopener noreferrer"
             data-event="assessment_click_book_calendly"
             class="lang-es inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-600 hover:bg-brand-700 rounded-full text-white text-base font-semibold transition-colors shadow-md shadow-brand-600/20">
            Reserva una llamada con Jessy
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>

          <a href="tel:PHONE_PHOENIX"
             data-event="assessment_click_phone" data-event-location="phoenix"
             class="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-gray-200 hover:border-brand-300 hover:bg-brand-50 rounded-full text-gray-700 text-base font-semibold transition-colors">
            <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <span class="lang-en">Call our assessment line</span>
            <span class="lang-es">Llama a nuestra línea</span>
          </a>
        </div>
        <p class="text-center text-sm text-gray-400 mt-4">
          <span class="lang-en">Phoenix line shown above · Tucson: <a href="tel:PHONE_TUCSON" data-event="assessment_click_phone" data-event-location="tucson" class="underline hover:text-brand-600">PHONE_TUCSON_LABEL</a></span>
          <span class="lang-es">Línea de Phoenix arriba · Tucson: <a href="tel:PHONE_TUCSON" data-event="assessment_click_phone" data-event-location="tucson" class="underline hover:text-brand-600">PHONE_TUCSON_LABEL</a></span>
        </p>
      </div>
    </div>
  </section>

</main>
```

- [ ] **Step 2: Verify the hero renders**

Open `assessment.html` in a browser. Expected:

- Headline reads "Free Operations Assessment for Small Businesses" (English visible, Spanish hidden via the `body[data-lang="en"] .lang-es { display: none }` rule).
- Subhead is visible directly under the headline.
- A grey placeholder video box appears (Vimeo will show "Video not found" because `VIMEO_ID_EN` is a non-numeric string — this is expected and acceptable).
- The three CTA buttons appear: blue "Book a call with Jessy", and grey-outlined "Call our assessment line". The Spanish CTA "Reserva una llamada con Jessy" must NOT be visible.
- Tucson phone link appears below in small text.
- The "En español" toggle pill appears in the top-right of the hero.
- On a mobile viewport (DevTools responsive mode, 375px wide), CTAs stack vertically.
- No console errors.

To verify Spanish content exists in the DOM but is hidden, in DevTools console run:
```js
document.querySelector('.lang-es').textContent
```
Expected: returns the Spanish headline text. (If `null`, the Spanish markup is missing.)

- [ ] **Step 3: Commit**

```bash
git add assessment.html
git commit -m "feat(assessment): hero with bilingual headline, Vimeo embed, and CTAs"
```

---

## Task 3: Build the "What you'll get" 3-card section

**Goal of this task:** Three side-by-side cards (stacked on mobile) describing what visitors receive from the assessment.

**Files:**
- Modify: `assessment.html` (insert after the hero `</section>` close, still inside `<main>`)

- [ ] **Step 1: Insert the "What you'll get" section markup**

Find the closing `</section>` of the hero in `assessment.html` and insert this block immediately after it (still inside `<main>`):

```html
  <!-- ===================== WHAT YOU'LL GET ===================== -->
  <section class="py-20 bg-brand-50/40">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-12">
        <span class="reveal text-sm font-semibold text-brand-600 uppercase tracking-wider">
          <span class="lang-en">What You'll Get</span>
          <span class="lang-es">Lo Que Recibirás</span>
        </span>
        <h2 class="reveal reveal-delay-1 font-bold text-3xl sm:text-4xl text-brand-900 mt-3">
          <span class="lang-en">No sales pitch. Just answers.</span>
          <span class="lang-es">Sin presión de venta. Solo respuestas.</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Card 1 -->
        <div class="reveal group bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-100 hover:-translate-y-1 transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors">
            <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </div>
          <h3 class="font-bold text-lg text-brand-900 mb-2">
            <span class="lang-en">A real conversation, not a sales pitch</span>
            <span class="lang-es">Una conversación real, no un argumento de venta</span>
          </h3>
          <p class="text-gray-500 text-sm leading-relaxed">
            <span class="lang-en">Jessy spends 30 to 45 minutes understanding how your business actually runs day to day — what eats your time, what falls through the cracks, what you've been meaning to fix for months.</span>
            <span class="lang-es">Jessy dedica de 30 a 45 minutos a entender cómo funciona realmente tu negocio día a día — qué te consume tiempo, qué se te escapa, qué has querido arreglar durante meses.</span>
          </p>
        </div>

        <!-- Card 2 -->
        <div class="reveal reveal-delay-1 group bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-100 hover:-translate-y-1 transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors">
            <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <h3 class="font-bold text-lg text-brand-900 mb-2">
            <span class="lang-en">A written report within 48 hours</span>
            <span class="lang-es">Un informe escrito en 48 horas</span>
          </h3>
          <p class="text-gray-500 text-sm leading-relaxed">
            <span class="lang-en">Three to five specific places you're losing time or money, with the tools and steps to fix each one. Plain English. No buzzwords. No "schedule a follow-up to learn more."</span>
            <span class="lang-es">Tres a cinco puntos específicos donde estás perdiendo tiempo o dinero, con las herramientas y los pasos para arreglar cada uno. En lenguaje claro. Sin tecnicismos.</span>
          </p>
        </div>

        <!-- Card 3 -->
        <div class="reveal reveal-delay-2 group bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:border-brand-100 hover:-translate-y-1 transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-5 group-hover:bg-brand-100 transition-colors">
            <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h3 class="font-bold text-lg text-brand-900 mb-2">
            <span class="lang-en">Yours to keep, no matter what</span>
            <span class="lang-es">Tuyo para quedarte, pase lo que pase</span>
          </h3>
          <p class="text-gray-500 text-sm leading-relaxed">
            <span class="lang-en">No obligation. The report is yours. If you want help implementing the fixes, that's a separate paid conversation — only if you decide it's worth it.</span>
            <span class="lang-es">Sin compromiso. El informe es tuyo. Si quieres ayuda para implementar las soluciones, esa es una conversación pagada aparte — solo si decides que vale la pena.</span>
          </p>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Verify the section renders**

Refresh `assessment.html` in the browser. Expected:

- Three cards visible side-by-side on desktop (`md:` breakpoint = 768px+), stacked on mobile.
- Each card has a brand-blue icon, a heading, and a paragraph.
- Headings: "A real conversation, not a sales pitch", "A written report within 48 hours", "Yours to keep, no matter what".
- Hover on a card: it lifts (translates up 4px) and the shadow deepens.
- Scrolling into the section triggers the `.reveal` fade-up animation (cards appear one at a time with the `reveal-delay-N` staggering).
- No console errors.

- [ ] **Step 3: Commit**

```bash
git add assessment.html
git commit -m "feat(assessment): What You'll Get 3-card section"
```

---

## Task 4: Build the "Two ways to get started" comparison section

**Goal of this task:** Two side-by-side cards comparing the Zoom-with-Jessy path against the 24/7 AI line path. Left card has a "Recommended" badge.

**Files:**
- Modify: `assessment.html` (insert after the "What you'll get" section's `</section>` close)

- [ ] **Step 1: Insert the comparison section markup**

Insert immediately after the "What you'll get" section's closing `</section>`:

```html
  <!-- ===================== TWO WAYS TO GET STARTED ===================== -->
  <section class="py-20 bg-white">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-12">
        <span class="reveal text-sm font-semibold text-brand-600 uppercase tracking-wider">
          <span class="lang-en">How to Start</span>
          <span class="lang-es">Cómo Empezar</span>
        </span>
        <h2 class="reveal reveal-delay-1 font-bold text-3xl sm:text-4xl text-brand-900 mt-3">
          <span class="lang-en">Two ways to get started</span>
          <span class="lang-es">Dos formas de empezar</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-6 lg:gap-8">
        <!-- Option A: Talk to Jessy -->
        <div class="reveal relative bg-white rounded-2xl p-8 shadow-sm border-2 border-brand-200 hover:shadow-xl transition-all duration-300">
          <span class="absolute -top-3 left-8 inline-block px-3 py-1 rounded-full bg-brand-600 text-white text-[11px] font-semibold uppercase tracking-wider">
            <span class="lang-en">Recommended</span>
            <span class="lang-es">Recomendado</span>
          </span>
          <h3 class="font-bold text-xl text-brand-900 mb-2 mt-2">
            <span class="lang-en">Talk to Jessy directly</span>
            <span class="lang-es">Habla con Jessy directamente</span>
          </h3>
          <p class="text-gray-500 text-sm mb-6">
            <span class="lang-en">A 30–45 minute Zoom call. Best if you want to ask questions and see if we're a fit.</span>
            <span class="lang-es">Una llamada de Zoom de 30 a 45 minutos. Ideal si quieres hacer preguntas y ver si encajamos.</span>
          </p>
          <ul class="space-y-2.5 mb-6">
            <li class="flex items-start gap-2.5 text-sm text-gray-700">
              <svg class="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span><span class="lang-en">30–45 minute Zoom call</span><span class="lang-es">Llamada de Zoom de 30–45 minutos</span></span>
            </li>
            <li class="flex items-start gap-2.5 text-sm text-gray-700">
              <svg class="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span><span class="lang-en">Available Mon–Sat</span><span class="lang-es">Disponible de Lun a Sáb</span></span>
            </li>
            <li class="flex items-start gap-2.5 text-sm text-gray-700">
              <svg class="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span><span class="lang-en">Available in English or Spanish</span><span class="lang-es">Disponible en inglés o español</span></span>
            </li>
          </ul>
          <a href="CALENDLY_URL_EN" target="_blank" rel="noopener noreferrer"
             data-event="assessment_click_book_calendly"
             class="lang-en inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 rounded-full text-white text-sm font-semibold transition-colors">
            Book a time
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
          <a href="CALENDLY_URL_ES" target="_blank" rel="noopener noreferrer"
             data-event="assessment_click_book_calendly"
             class="lang-es inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 rounded-full text-white text-sm font-semibold transition-colors">
            Reserva un horario
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
        </div>

        <!-- Option B: 24/7 AI line -->
        <div class="reveal reveal-delay-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300">
          <h3 class="font-bold text-xl text-brand-900 mb-2 mt-2">
            <span class="lang-en">Call our AI line (24/7)</span>
            <span class="lang-es">Llama a nuestra línea de IA (24/7)</span>
          </h3>
          <p class="text-gray-500 text-sm mb-6">
            <span class="lang-en">A 15–20 minute phone conversation. Best if you're busy or want to try things out first.</span>
            <span class="lang-es">Una conversación telefónica de 15 a 20 minutos. Ideal si estás ocupado o quieres probar primero.</span>
          </p>
          <ul class="space-y-2.5 mb-6">
            <li class="flex items-start gap-2.5 text-sm text-gray-700">
              <svg class="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span><span class="lang-en">15–20 minute phone conversation</span><span class="lang-es">Conversación telefónica de 15–20 min</span></span>
            </li>
            <li class="flex items-start gap-2.5 text-sm text-gray-700">
              <svg class="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span><span class="lang-en">Any time, day or night</span><span class="lang-es">Cualquier hora, día o noche</span></span>
            </li>
            <li class="flex items-start gap-2.5 text-sm text-gray-700">
              <svg class="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span><span class="lang-en">Available in English or Spanish</span><span class="lang-es">Disponible en inglés o español</span></span>
            </li>
          </ul>
          <div class="grid grid-cols-2 gap-3">
            <a href="tel:PHONE_PHOENIX"
               data-event="assessment_click_phone" data-event-location="phoenix"
               class="inline-flex flex-col items-center justify-center gap-0.5 px-4 py-3 border border-gray-200 hover:border-brand-300 hover:bg-brand-50 rounded-full transition-colors">
              <span class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Phoenix</span>
              <span class="text-sm font-semibold text-brand-900">PHONE_PHOENIX_LABEL</span>
            </a>
            <a href="tel:PHONE_TUCSON"
               data-event="assessment_click_phone" data-event-location="tucson"
               class="inline-flex flex-col items-center justify-center gap-0.5 px-4 py-3 border border-gray-200 hover:border-brand-300 hover:bg-brand-50 rounded-full transition-colors">
              <span class="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Tucson</span>
              <span class="text-sm font-semibold text-brand-900">PHONE_TUCSON_LABEL</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Verify the comparison section renders**

Refresh the page. Expected:

- Two cards side-by-side on desktop, stacked on mobile.
- Left card has a brand-blue border (`border-brand-200`) and a "Recommended" pill badge at the top-left.
- Right card has a plain grey border.
- Each card has a heading, a short paragraph, a checklist with 3 brand-blue checkmarks, and a CTA at the bottom.
- Left card's CTA: full-width brand-blue "Book a time" button.
- Right card's CTA: two side-by-side pill buttons labeled "Phoenix / PHONE_PHOENIX_LABEL" and "Tucson / PHONE_TUCSON_LABEL".
- Phone link `href` values are `tel:PHONE_PHOENIX` and `tel:PHONE_TUCSON` (will be replaced with real E.164 numbers later).

- [ ] **Step 3: Commit**

```bash
git add assessment.html
git commit -m "feat(assessment): Two Ways to Get Started comparison section"
```

---

## Task 5: Build the FAQ accordion section

**Goal of this task:** Six FAQ entries in a 2-column grid using the existing `.faq-item` click-to-toggle pattern from `radar.html`. Each question has both EN + ES content.

**Files:**
- Modify: `assessment.html` (insert after the comparison section's `</section>` close)

- [ ] **Step 1: Insert the FAQ section markup**

Insert immediately after the comparison section's closing `</section>`:

```html
  <!-- ===================== FAQ ===================== -->
  <section class="py-20 bg-brand-50/40">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center mb-12">
        <span class="reveal text-sm font-semibold text-brand-600 uppercase tracking-wider">FAQ</span>
        <h2 class="reveal reveal-delay-1 font-bold text-3xl sm:text-4xl text-brand-900 mt-3">
          <span class="lang-en">Common questions</span>
          <span class="lang-es">Preguntas comunes</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 gap-3">
        <!-- Q1 -->
        <div class="reveal faq-item bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
             data-faq-id="is-this-really-free"
             onclick="this.classList.toggle('open'); if (this.classList.contains('open')) window.trackEvent &amp;&amp; window.trackEvent('assessment_faq_open', { question: this.dataset.faqId });">
          <div class="flex items-center justify-between p-5">
            <span class="font-medium text-brand-900 pr-4 text-sm">
              <span class="lang-en">Is this really free?</span>
              <span class="lang-es">¿Es realmente gratis?</span>
            </span>
            <span class="faq-icon text-brand-600 text-lg flex-shrink-0">+</span>
          </div>
          <div class="faq-answer px-5">
            <p class="text-gray-500 pb-5 text-sm leading-relaxed">
              <span class="lang-en">Yes. The assessment call and the written report are free, no credit card required. Implementation is a separate paid conversation only if you want it.</span>
              <span class="lang-es">Sí. La llamada de evaluación y el informe escrito son gratis, sin tarjeta de crédito. La implementación es una conversación pagada aparte, solo si la deseas.</span>
            </p>
          </div>
        </div>

        <!-- Q2 -->
        <div class="reveal reveal-delay-1 faq-item bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
             data-faq-id="what-businesses"
             onclick="this.classList.toggle('open'); if (this.classList.contains('open')) window.trackEvent &amp;&amp; window.trackEvent('assessment_faq_open', { question: this.dataset.faqId });">
          <div class="flex items-center justify-between p-5">
            <span class="font-medium text-brand-900 pr-4 text-sm">
              <span class="lang-en">What kind of businesses do you work with?</span>
              <span class="lang-es">¿Con qué tipo de negocios trabajan?</span>
            </span>
            <span class="faq-icon text-brand-600 text-lg flex-shrink-0">+</span>
          </div>
          <div class="faq-answer px-5">
            <p class="text-gray-500 pb-5 text-sm leading-relaxed">
              <span class="lang-en">Small businesses across Arizona — legal, medical, trades, professional services, e-commerce. If you run operations yourself or with a small team, this is for you.</span>
              <span class="lang-es">Pequeños negocios en Arizona — legales, médicos, oficios, servicios profesionales, e-commerce. Si manejas las operaciones tú mismo o con un equipo pequeño, esto es para ti.</span>
            </p>
          </div>
        </div>

        <!-- Q3 -->
        <div class="reveal reveal-delay-2 faq-item bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
             data-faq-id="how-long"
             onclick="this.classList.toggle('open'); if (this.classList.contains('open')) window.trackEvent &amp;&amp; window.trackEvent('assessment_faq_open', { question: this.dataset.faqId });">
          <div class="flex items-center justify-between p-5">
            <span class="font-medium text-brand-900 pr-4 text-sm">
              <span class="lang-en">How long does the whole process take?</span>
              <span class="lang-es">¿Cuánto tarda todo el proceso?</span>
            </span>
            <span class="faq-icon text-brand-600 text-lg flex-shrink-0">+</span>
          </div>
          <div class="faq-answer px-5">
            <p class="text-gray-500 pb-5 text-sm leading-relaxed">
              <span class="lang-en">The assessment call is 30–45 minutes. The written report arrives within 48 hours. If you decide to move forward with implementation, the timeline varies by scope.</span>
              <span class="lang-es">La llamada de evaluación dura de 30 a 45 minutos. El informe escrito llega en 48 horas. Si decides avanzar con la implementación, el tiempo varía según el alcance.</span>
            </p>
          </div>
        </div>

        <!-- Q4 -->
        <div class="reveal faq-item bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
             data-faq-id="after-hours"
             onclick="this.classList.toggle('open'); if (this.classList.contains('open')) window.trackEvent &amp;&amp; window.trackEvent('assessment_faq_open', { question: this.dataset.faqId });">
          <div class="flex items-center justify-between p-5">
            <span class="font-medium text-brand-900 pr-4 text-sm">
              <span class="lang-en">What if I call after hours?</span>
              <span class="lang-es">¿Y si llamo fuera de horario?</span>
            </span>
            <span class="faq-icon text-brand-600 text-lg flex-shrink-0">+</span>
          </div>
          <div class="faq-answer px-5">
            <p class="text-gray-500 pb-5 text-sm leading-relaxed">
              <span class="lang-en">Our AI line answers 24/7, every day. Zoom bookings get a confirmation within one business day.</span>
              <span class="lang-es">Nuestra línea de IA contesta 24/7, todos los días. Las reservas de Zoom reciben confirmación dentro de un día hábil.</span>
            </p>
          </div>
        </div>

        <!-- Q5 -->
        <div class="reveal reveal-delay-1 faq-item bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
             data-faq-id="spanish"
             onclick="this.classList.toggle('open'); if (this.classList.contains('open')) window.trackEvent &amp;&amp; window.trackEvent('assessment_faq_open', { question: this.dataset.faqId });">
          <div class="flex items-center justify-between p-5">
            <span class="font-medium text-brand-900 pr-4 text-sm">
              <span class="lang-en">Do you work in Spanish?</span>
              <span class="lang-es">¿Trabajan en español?</span>
            </span>
            <span class="faq-icon text-brand-600 text-lg flex-shrink-0">+</span>
          </div>
          <div class="faq-answer px-5">
            <p class="text-gray-500 pb-5 text-sm leading-relaxed">
              <span class="lang-en">Yes. Jessy is bilingual, and the AI line speaks both English and Spanish fluently.</span>
              <span class="lang-es">Sí. Jessy es bilingüe, y la línea de IA habla inglés y español con fluidez.</span>
            </p>
          </div>
        </div>

        <!-- Q6 -->
        <div class="reveal reveal-delay-2 faq-item bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
             data-faq-id="privacy"
             onclick="this.classList.toggle('open'); if (this.classList.contains('open')) window.trackEvent &amp;&amp; window.trackEvent('assessment_faq_open', { question: this.dataset.faqId });">
          <div class="flex items-center justify-between p-5">
            <span class="font-medium text-brand-900 pr-4 text-sm">
              <span class="lang-en">What happens to my information?</span>
              <span class="lang-es">¿Qué pasa con mi información?</span>
            </span>
            <span class="faq-icon text-brand-600 text-lg flex-shrink-0">+</span>
          </div>
          <div class="faq-answer px-5">
            <p class="text-gray-500 pb-5 text-sm leading-relaxed">
              <span class="lang-en">It stays between you and Solvr Labs. We never sell or share it.</span>
              <span class="lang-es">Se queda entre tú y Solvr Labs. Nunca la vendemos ni la compartimos.</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>
```

- [ ] **Step 2: Verify the FAQ section renders**

Refresh the page. Expected:

- Six FAQ cards in a 2-column grid on desktop, stacked on mobile.
- Each card has a question and a `+` icon.
- Clicking a card expands it to reveal the answer; the `+` rotates 45° to become an `×`.
- Clicking again collapses it.
- Multiple cards can be open at once (matches the radar.html behavior — this is intentional).
- No console errors.

The `trackEvent` call in the `onclick` will throw `window.trackEvent is not a function` warnings in the console until Task 7 adds the helper. That's expected here and will be fixed then. To verify the click logic works regardless, the FAQ should still expand and collapse correctly.

- [ ] **Step 3: Commit**

```bash
git add assessment.html
git commit -m "feat(assessment): bilingual FAQ accordion with 6 questions"
```

---

## Task 6: Build the bottom CTA banner

**Goal of this task:** A single full-width brand-gradient CTA strip at the bottom (mirrors the existing TaskLine banner style).

**Files:**
- Modify: `assessment.html` (insert after the FAQ section's `</section>` close, before `</main>`)

- [ ] **Step 1: Insert the bottom CTA markup**

Insert immediately after the FAQ section's closing `</section>` and before the `</main>` close:

```html
  <!-- ===================== BOTTOM CTA ===================== -->
  <section class="relative py-12 bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 overflow-hidden">
    <div class="absolute inset-0 opacity-30 pointer-events-none" style="background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);"></div>
    <div class="relative max-w-4xl mx-auto px-6 text-center">
      <h2 class="font-bold text-2xl sm:text-3xl text-white mb-3">
        <span class="lang-en">Ready when you are.</span>
        <span class="lang-es">Cuando estés listo.</span>
      </h2>
      <p class="text-white/80 text-base sm:text-lg mb-7">
        <span class="lang-en">30 minutes with Jessy. A written report in 48 hours. No sales pitch.</span>
        <span class="lang-es">30 minutos con Jessy. Un informe escrito en 48 horas. Sin presión de venta.</span>
      </p>
      <a href="CALENDLY_URL_EN" target="_blank" rel="noopener noreferrer"
         data-event="assessment_click_book_calendly"
         class="lang-en inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 rounded-full text-brand-700 text-base font-semibold transition-colors shadow-md">
        Book your free assessment
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
      </a>
      <a href="CALENDLY_URL_ES" target="_blank" rel="noopener noreferrer"
         data-event="assessment_click_book_calendly"
         class="lang-es inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 rounded-full text-brand-700 text-base font-semibold transition-colors shadow-md">
        Reserva tu evaluación gratuita
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
      </a>
    </div>
  </section>
```

- [ ] **Step 2: Verify the bottom CTA renders**

Refresh the page. Expected:

- Full-width gradient strip (brand-600 → brand-700 → brand-800) at the bottom before the footer.
- White heading "Ready when you are."
- White subhead.
- White rounded button "Book your free assessment →".
- The Spanish version of the button is NOT visible (because `body[data-lang="en"]`).
- The footer appears below this section.

- [ ] **Step 3: Commit**

```bash
git add assessment.html
git commit -m "feat(assessment): bottom CTA banner"
```

---

## Task 7: Wire up language toggle, analytics helper, and Vimeo events

**Goal of this task:** Make the EN/ES toggle button actually work — DOM swap, video swap, title/meta swap, URL-hash persistence, language auto-detection on load. Add the `window.trackEvent` stub. Wire all `data-event` attributes to fire events on click. Wire Vimeo `play` + 50% + 90% events.

**Files:**
- Modify: `assessment.html` (the bottom `<script>` block)

- [ ] **Step 1: Add the Vimeo Player JS API tag to `<head>`**

Find the existing `<link>` tags in `<head>` and add this after the Google Fonts `<link>`:

```html
<script src="https://player.vimeo.com/api/player.js"></script>
```

- [ ] **Step 2: Replace the bottom `<script>` block with the full behavior**

Find the existing `<script>` block at the bottom of `assessment.html` and replace its entire contents (the mobile menu + IntersectionObserver block from Task 1) with:

```html
<script>
  // ============================================================
  // Analytics helper — stub today, swap to real provider later.
  // ============================================================
  window.trackEvent = function (name, props) {
    if (typeof console !== 'undefined' && console.debug) {
      console.debug('[trackEvent]', name, props || {});
    }
    // When Plausible is installed sitewide:
    //   if (window.plausible) window.plausible(name, { props: props });
    // When GA4 is installed sitewide:
    //   if (window.gtag) window.gtag('event', name, props);
  };

  // ============================================================
  // Mobile menu (same as index.html)
  // ============================================================
  document.getElementById('burger').addEventListener('click', function () {
    this.classList.toggle('active');
    document.getElementById('mobile-menu').classList.toggle('hidden');
  });

  // ============================================================
  // Reveal on scroll (same as index.html)
  // ============================================================
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ============================================================
  // Language toggle (EN <-> ES)
  // ============================================================
  var META = {
    en: {
      title: "Free Operations Assessment for AZ Small Businesses | Solvr Labs",
      desc: "Get a free 30-minute operations assessment and a written report in 48 hours. No sales pitch. Available in English and Spanish across Arizona.",
      htmlLang: "en",
      toggleLabel: "En español"
    },
    es: {
      title: "Evaluación Gratuita de Operaciones para Pequeños Negocios en AZ | Solvr Labs",
      desc: "Recibe una evaluación gratuita de operaciones de 30 minutos y un informe escrito en 48 horas. Sin presión de venta. Disponible en inglés y español en todo Arizona.",
      htmlLang: "es",
      toggleLabel: "In English"
    }
  };

  function getVimeoPlayers() {
    var en = document.getElementById('vimeo-en');
    var es = document.getElementById('vimeo-es');
    return {
      en: en && window.Vimeo ? new Vimeo.Player(en) : null,
      es: es && window.Vimeo ? new Vimeo.Player(es) : null
    };
  }
  var vimeoPlayers = null; // initialized on first use

  function applyLang(lang) {
    document.body.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', META[lang].htmlLang);
    document.title = META[lang].title;
    var descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', META[lang].desc);

    // Update URL hash so the choice persists on refresh.
    if (lang === 'es' && location.hash !== '#es') {
      history.replaceState(null, '', '#es');
    } else if (lang === 'en' && location.hash === '#es') {
      history.replaceState(null, '', location.pathname + location.search);
    }

    // Pause hidden video, play visible video.
    if (!vimeoPlayers) vimeoPlayers = getVimeoPlayers();
    var active = vimeoPlayers[lang];
    var inactive = vimeoPlayers[lang === 'en' ? 'es' : 'en'];
    if (inactive) {
      try { inactive.pause(); } catch (e) { /* ignore */ }
    }
    if (active) {
      try { active.play(); } catch (e) { /* ignore — user gesture may be required */ }
    }
  }

  function detectInitialLang() {
    if (location.hash === '#es') return 'es';
    if (navigator.language && navigator.language.toLowerCase().indexOf('es') === 0) return 'es';
    return 'en';
  }

  document.getElementById('lang-toggle').addEventListener('click', function () {
    var current = document.body.getAttribute('data-lang') || 'en';
    var next = current === 'en' ? 'es' : 'en';
    applyLang(next);
    window.trackEvent('assessment_click_lang_toggle', { to: next });
  });

  // Apply detected language on load (the page renders as EN initially via the data-lang attribute set in markup).
  var initialLang = detectInitialLang();
  if (initialLang !== 'en') applyLang(initialLang);

  // ============================================================
  // Click events for buttons / links with data-event attributes
  // ============================================================
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-event]');
    if (!el) return;
    var name = el.getAttribute('data-event');
    var props = {};
    if (el.hasAttribute('data-event-location')) {
      props.location = el.getAttribute('data-event-location');
    }
    window.trackEvent(name, props);
  }, true);

  // ============================================================
  // Vimeo video events (play, 50%, 90%)
  // ============================================================
  function wireVimeoEvents() {
    if (!window.Vimeo) return;
    if (!vimeoPlayers) vimeoPlayers = getVimeoPlayers();
    ['en', 'es'].forEach(function (lang) {
      var player = vimeoPlayers[lang];
      if (!player) return;
      var fired50 = false, fired90 = false;
      player.on('play', function () {
        window.trackEvent('assessment_video_play', { lang: lang });
      });
      player.on('timeupdate', function (data) {
        if (!data || !data.percent) return;
        if (!fired50 && data.percent >= 0.5) {
          fired50 = true;
          window.trackEvent('assessment_video_50', { lang: lang });
        }
        if (!fired90 && data.percent >= 0.9) {
          fired90 = true;
          window.trackEvent('assessment_video_90', { lang: lang });
        }
      });
    });
  }
  wireVimeoEvents();

  // ============================================================
  // Page view event
  // ============================================================
  window.trackEvent('assessment_page_view', { lang: document.body.getAttribute('data-lang') });
</script>
```

- [ ] **Step 3: Verify the toggle and analytics work**

Refresh `assessment.html` in a browser. Open DevTools console first. Expected:

1. **Page view fires:** console shows `[trackEvent] assessment_page_view { lang: 'en' }` on load.
2. **Click "En español" toggle.** Expected:
   - Console shows `[trackEvent] assessment_click_lang_toggle { to: 'es' }`.
   - Headline switches to "Evaluación Gratuita de Operaciones para Pequeños Negocios".
   - Subhead switches to Spanish.
   - All section headings switch to Spanish.
   - Toggle button text changes to "In English".
   - URL bar shows `#es` appended.
   - Browser tab title changes to "Evaluación Gratuita de Operaciones para Pequeños Negocios en AZ | Solvr Labs".
   - `document.documentElement.lang` is now `"es"` (verify with `document.documentElement.lang` in console).
3. **Click "In English" toggle.** Expected: everything reverts to English. URL hash `#es` is removed.
4. **Click a FAQ question.** Expected: console shows `[trackEvent] assessment_faq_open { question: 'is-this-really-free' }` (or similar).
5. **Refresh the page at `assessment.html#es`.** Expected: page loads directly in Spanish.
6. **Click a Calendly CTA.** Expected: console shows `[trackEvent] assessment_click_book_calendly {}` and a new tab opens to the (invalid) `CALENDLY_URL_EN` URL — that's fine, the placeholder is intentional.
7. **Click the Phoenix phone link.** Expected: console shows `[trackEvent] assessment_click_phone { location: 'phoenix' }`. On desktop, the browser may show a "Open in dialer?" dialog; on mobile, the dialer opens.
8. **No JavaScript errors in the console.** (Vimeo iframe will log a network error about the invalid `VIMEO_ID_EN` — that's expected and not a JS error.)

- [ ] **Step 4: Commit**

```bash
git add assessment.html
git commit -m "feat(assessment): language toggle, analytics helper, Vimeo events"
```

---

## Task 8: Add JSON-LD Service schema

**Goal of this task:** Add structured data so the assessment shows up well in Google search.

**Files:**
- Modify: `assessment.html` (inside `<head>`)

- [ ] **Step 1: Add the JSON-LD block to `<head>`**

Find the closing `</head>` tag in `assessment.html` and insert this block immediately before it:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Free Operations Assessment",
  "description": "A free 30-minute operations assessment and written report for small businesses in Arizona. No sales pitch. Available in English and Spanish.",
  "provider": {
    "@type": "Organization",
    "name": "Solvr Labs",
    "url": "https://solvrlabs.com"
  },
  "areaServed": {
    "@type": "State",
    "name": "Arizona"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "availableLanguage": ["en", "es"]
}
</script>
```

- [ ] **Step 2: Verify the schema is valid**

Refresh the page. In DevTools, run:
```js
JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)
```
Expected: returns a valid object with `@type: "Service"`. If it throws a SyntaxError, fix any JSON typos.

- [ ] **Step 3: Commit**

```bash
git add assessment.html
git commit -m "feat(assessment): add Service JSON-LD schema for SEO"
```

---

## Task 9: Add the homepage banner pointing to /assessment

**Goal of this task:** A new banner strip on `index.html` above the existing TaskLine banner, promoting the assessment.

**Files:**
- Modify: `index.html` (insert a new `<section>` between line 358 — end of hero — and line 361 — start of TaskLine banner)

- [ ] **Step 1: Insert the new banner**

Open `index.html`. Locate the closing `</section>` of the hero (currently line 358) and the opening of the TaskLine banner (currently `<!-- Featured Product Banner — TaskLine -->` at line 360). Insert this block between them, immediately after the hero's `</section>`:

```html
    <!-- Free Operations Assessment Banner -->
    <section class="relative py-6 bg-white border-y-2 border-brand-100">
        <div class="relative max-w-6xl mx-auto px-6">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
                    <div class="hidden sm:flex w-12 h-12 rounded-xl bg-brand-50 ring-1 ring-brand-100 items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div>
                        <div class="flex items-center gap-2 justify-center sm:justify-start">
                            <span class="inline-block px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-semibold uppercase tracking-wider">New</span>
                            <span class="text-brand-700 text-xs font-semibold uppercase tracking-wider">Free Operations Assessment</span>
                        </div>
                        <p class="text-brand-900 text-base sm:text-lg font-semibold mt-1">
                            30 minutes with Jessy. A written report in 48 hours. No sales pitch.
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                    <a href="/assessment" class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 rounded-full text-white text-sm font-semibold transition-colors shadow-md">
                        Learn more
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </a>
                </div>
            </div>
        </div>
    </section>
```

- [ ] **Step 2: Verify the banner renders**

Open `index.html` in a browser. Expected:

- Below the hero, a new light banner strip appears with a thin brand-blue top and bottom border.
- Contains: a document icon on the left, "NEW · FREE OPERATIONS ASSESSMENT" eyebrow, headline "30 minutes with Jessy. A written report in 48 hours. No sales pitch.", and a blue "Learn more →" button on the right.
- Below this new banner, the existing dark TaskLine banner appears as before.
- The new banner does NOT visually clash with the dark TaskLine banner because of the light bg + thin borders.
- Clicking "Learn more" navigates to `/assessment` (which serves `assessment.html` via `cleanUrls`).
- On mobile, the icon hides and the layout stacks vertically.
- No console errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(home): add Free Operations Assessment banner above TaskLine banner"
```

---

## Task 10: Rewrite the homepage "What I Do" section copy

**Goal of this task:** Reposition the section so it reads as "small businesses, outcomes" rather than "trades, tech categories."

**Files:**
- Modify: `index.html` lines 393-430 (the `<!-- What I Do -->` section)

- [ ] **Step 1: Update the section eyebrow, heading, and subhead**

In `index.html`, find:

```html
            <div class="text-center mb-14">
                <span class="reveal text-sm font-semibold text-brand-600 uppercase tracking-wider">What I Do</span>
                <h2 class="reveal reveal-delay-1 font-bold text-3xl sm:text-4xl text-brand-900 mt-3 mb-4">AI Integration Services</h2>
                <p class="reveal reveal-delay-2 text-gray-500 text-lg max-w-xl mx-auto">
                    I plug AI into your existing workflow so your business runs smoother without replacing what already works.
                </p>
            </div>
```

Replace with:

```html
            <div class="text-center mb-14">
                <span class="reveal text-sm font-semibold text-brand-600 uppercase tracking-wider">How I Help</span>
                <h2 class="reveal reveal-delay-1 font-bold text-3xl sm:text-4xl text-brand-900 mt-3 mb-4">Three Ways to Get Your Time Back</h2>
                <p class="reveal reveal-delay-2 text-gray-500 text-lg max-w-2xl mx-auto">
                    Whether you run a law office, a clinic, an e-commerce shop, or a trades business — these are the three ways I help small teams stop drowning in operations.
                </p>
            </div>
```

- [ ] **Step 2: Update Card 1 — "AI Workflow Automation"**

In the same section, find:

```html
                    <h3 class="font-bold text-lg text-brand-900 mb-2">AI Workflow Automation</h3>
                    <p class="text-gray-500 text-sm leading-relaxed">Connect your existing tools and automate repetitive tasks. Missed call text-backs, proposal generation, invoice follow-ups — all running on autopilot.</p>
```

Replace with:

```html
                    <h3 class="font-bold text-lg text-brand-900 mb-2">Save hours every week</h3>
                    <p class="text-gray-500 text-sm leading-relaxed">Connect your existing tools and automate the work that eats your day — missed call text-backs, proposal drafts, invoice follow-ups. Set it up once; it runs on its own.</p>
```

- [ ] **Step 3: Update Card 2 — "Voice AI & Smart Receptionist"**

Find:

```html
                    <h3 class="font-bold text-lg text-brand-900 mb-2">Voice AI &amp; Smart Receptionist</h3>
                    <p class="text-gray-500 text-sm leading-relaxed">An AI that answers your calls, books appointments, and follows up with clients — 24/7, in English and Spanish. No more missed jobs.</p>
```

Replace with:

```html
                    <h3 class="font-bold text-lg text-brand-900 mb-2">Never miss a customer call</h3>
                    <p class="text-gray-500 text-sm leading-relaxed">An AI line that answers your phone, books appointments, and follows up — 24/7, in English and Spanish. Even on weekends. Even at 2am.</p>
```

- [ ] **Step 4: Update Card 3 — "Custom AI Software"**

Find:

```html
                    <h3 class="font-bold text-lg text-brand-900 mb-2">Custom AI Software</h3>
                    <p class="text-gray-500 text-sm leading-relaxed">Full-stack applications with AI built in. Client portals, management platforms, and internal tools — designed around how your business actually works.</p>
```

Replace with:

```html
                    <h3 class="font-bold text-lg text-brand-900 mb-2">Tools built around your business</h3>
                    <p class="text-gray-500 text-sm leading-relaxed">Full-stack apps with AI built in — client portals, dashboards, internal tools — designed around how your business actually works, not how a template says it should.</p>
```

- [ ] **Step 5: Verify the section renders**

Refresh `index.html`. Expected:

- The "What I Do" eyebrow now reads "How I Help".
- The heading now reads "Three Ways to Get Your Time Back".
- The subhead now mentions law office, clinic, e-commerce, trades.
- The three card headings now read: "Save hours every week" / "Never miss a customer call" / "Tools built around your business".
- The card icons are unchanged.
- The card body paragraphs match the spec above.
- Card hover effects still work.
- No console errors.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(home): reposition 'What I Do' as 'How I Help' for broader small-business audience"
```

---

## Task 11: Final cross-page verification

**Goal of this task:** Verify the whole feature works end to end — assessment page, homepage banner, link between them, on desktop and mobile.

**Files:** No file changes in this task.

- [ ] **Step 1: Desktop verification on `/` (open `index.html`)**

- The Free Operations Assessment banner appears below the hero and above the TaskLine banner.
- The "How I Help" section heading reads correctly.
- Clicking "Learn more →" navigates to `/assessment` (file-system test: open the file; production test after deploy: hit `solvrlabs.com/assessment`).

- [ ] **Step 2: Desktop verification on `/assessment` (open `assessment.html`)**

- Headline, subhead, video embed, two CTA buttons, Tucson sub-link all render in English.
- "What you'll get" 3 cards render.
- "Two ways to get started" 2 cards render with the Recommended badge on the left.
- 6 FAQ entries render and expand/collapse on click.
- Bottom CTA gradient strip renders.
- Footer renders.

- [ ] **Step 3: Spanish toggle verification**

- Click "En español". Every visible block of text changes to Spanish.
- The Vimeo player attempts to switch (will fail-soft because the IDs are placeholders).
- URL bar shows `#es`.
- Refresh — page comes back up in Spanish.
- Click "In English" — everything reverts.

- [ ] **Step 4: Mobile viewport verification**

In DevTools, switch to a mobile viewport (375px wide, e.g. iPhone SE preset):

- Nav burger menu opens/closes.
- Hero CTAs stack vertically.
- "What you'll get" cards stack vertically.
- Comparison cards stack vertically.
- FAQ accordion still works.
- Phone links: hovering shows the `tel:` URL in the status bar (and tapping on a real device opens the dialer).

- [ ] **Step 5: Analytics verification**

With DevTools console open:

- Loading the page logs `[trackEvent] assessment_page_view`.
- Clicking the language toggle logs `assessment_click_lang_toggle`.
- Clicking a FAQ logs `assessment_faq_open`.
- Clicking a Calendly button logs `assessment_click_book_calendly`.
- Clicking a phone link logs `assessment_click_phone` with the location prop.

- [ ] **Step 6: Console must be error-free**

The only acceptable console noise is the Vimeo network warning for the placeholder video IDs. No JavaScript errors, no Tailwind warnings, no broken-image warnings (except the placeholder `og-assessment.png` which is OK).

- [ ] **Step 7: Confirm no other pages were touched**

```bash
git log --since=today --oneline
```
Expected output: 10 commits matching the task scope (`feat(assessment): ...`, `feat(home): ...`). No commits touching `radar.html`, `services.html`, `contact.html`, `about.html`, `blog/`, or any other files.

If everything passes, the feature is ready for placeholder replacement (real Vimeo IDs, phone numbers, Calendly URLs, OG image) and then a `git push` to deploy via Vercel.

---

## Summary of placeholders to replace before going live

Before pushing to production, replace these strings everywhere they appear in `assessment.html`:

| Placeholder | Replace with |
|---|---|
| `VIMEO_ID_EN` | Numeric Vimeo video ID for the English intro (e.g. `987654321`) |
| `VIMEO_ID_ES` | Numeric Vimeo video ID for the Spanish intro |
| `CALENDLY_URL_EN` | Full Calendly URL for the English event |
| `CALENDLY_URL_ES` | Full Calendly URL for the Spanish event |
| `PHONE_PHOENIX` | E.164 number for the Phoenix line, e.g. `+16025550000` |
| `PHONE_PHOENIX_LABEL` | Display form, e.g. `(602) 555-0000` |
| `PHONE_TUCSON` | E.164 number for the Tucson line |
| `PHONE_TUCSON_LABEL` | Display form |

Also: create `/assets/og-assessment.png` (1200×630px social-share image with a video still and "Free Operations Assessment" text overlay).
