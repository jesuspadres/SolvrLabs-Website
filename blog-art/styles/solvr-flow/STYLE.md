# solvr-flow

The Solvr Labs website look, for blog headers (1200x630 stills) and short reels. Made from solvrlabs.com with new-style.md.

## What it is

Flat, rounded, product-first illustration in the site's palette. Every header tells **what the article changes for a business**, and each topic gets its **own treatment** so the blog grid never looks like one image repeated. A thin inset border frames every image.

## Measured from the site

| what | value | source |
|---|---|---|
| brand blues | `#f0f5ff #e1ebff #c8d8fe #a3bffc #7da0f8 #5a7de6 #4664d6 #3a53bd #33469a #2c3a7c #1d264e` | Tailwind config in index.html |
| neutrals | `#f9fafb #f2f3f6 #e5e7eb #d1d5db #9ca3af #6b7280 #374151 #1d1e20` | Tailwind config |
| category grounds | opinion 600→900, comparison 600→emerald-600, build log 400→600, case study 500→700 | blog.html cards |
| node tile tones | red `#fef2f2/#ef4444`, blue `#eef2ff/#4664d6`, green `#f0fdf4/#16a34a`, violet `#faf5ff/#a855f7` | hero "Live workflow" |
| type | DM Sans 400/500/600/700; eyebrows 13px caps, +1.2 tracking | site CSS |
| cards | white, 14–18px radius, soft navy shadow `rgba(29,38,78,.22–.38)`, 1px `#e5e7eb` border | site cards |
| icons | Lucide, 24 grid, stroke 2 | site icons |

## Topic treatments

| topic | treatment | ground | the picture |
|---|---|---|---|
| Case Study | **split** (`sfSplitScene`) | left `#eef1f8` (muted), right white + soft blue glow, 2px `#c8d8fe` seam, AI spark on the seam | the same person, same job: without vs with. One result card per side with a ± money pill |
| Comparison | **crossroads** | mint sky `#dbeafe→#ecfdf5`, green hills and ground | a road splitting three ways, a signpost with the options' names, the AI as a sun over all of them, a person deciding |
| Build Log | **blueprint** (`sfBlueprint`) | navy `#22306a→#161e40` with a cyan grid | a machine doing the work (the AI spark on it), outputs on a conveyor, mono cyan annotations (`sfNote`), the person off the clock |
| Opinion | **editorial** (unproven) | warm paper `#faf7f2`, one brand accent | one oversized symbolic object and one person; big negative space |

New topics: pick the treatment by what the article *does* (shows a result → split; chooses between options → crossroads; explains how something is built → blueprint; argues a point → editorial). Vary the people (trade, skin tone `SF_SKIN[0..2]`, pose) between posts.

## Kit API (kit.js)

- Ground and frame: `sfGround(kind)`, `sfBlueprint()`, `sfFrame(color)` (always last).
- UI: `sfCard`, `sfWindow`, `sfNode`, `sfTile(icon, x, y, s, tone)`, `sfIcon(name, cx, cy, size, color)`, `sfPill(text, x, y, tone, {dot, align})`, `sfEyebrow`, `sfText`, `sfSkel`, `sfConnector`, `sfSpark` (the AI hero).
- Illustration: `sfWorkerKneel`, `sfWorkerSeated(pose: 'typing'|'relaxed')`, `sfWorkerStand`, `sfSinkCabinet`, `sfDesk(screen)`, `sfPhone(screen)`, `sfWindowWall(night)`, `sfCloud`, `sfSign`, `sfNote`, `sfPal(mute)`.
- Layout: `sfSplitScene({ before, after, draw })`.

## Frame checklist (on top of grammar/FRAME.md)

1. Says the article's **impact** at a glance (a result, a choice, a machine doing the work), not just its topic.
2. Uses the treatment for its topic, and doesn't repeat the previous post's composition.
3. Full bleed: little or no plain blue gradient. Blue is an accent.
4. Thin inset border (`sfFrame`) present, 14px inset, 18px radius.
5. Text: at most one pill plus two short card lines per side; nothing smaller than 13px.
6. Numbers on screen come from the article itself (e.g. "$350 avg. ticket" from the missed-call post). No invented stats, no testimonials, no third-party logos (names in plain text are fine).
7. Subject inside x 100–1100 when the blog card crops (or set the card to `aspect-ratio: 1200/630`, recommended).

## Do / don't

- Do keep people faceless and rounded, limbs as thick round strokes, navy clothing, brand-blue props.
- Do give the AI exactly one visual: the white spark node (`sfSpark`).
- Don't fill the frame with the brand gradient; don't use dark navy outside the blueprint treatment.
- Don't draw a fake screen as if it were a real product screenshot; screens stay skeletal or use real assets.

## Not matched

The site's 3D tilt-on-hover and animated flow dots (stills only show a frozen dot). DM Sans must be installed as a local font on the rendering machine (`~/.fonts/DMSans.ttf` from github.com/google/fonts, OFL).

## Proven on

Three headers: How Much Does a Missed Call Actually Cost Your Plumbing Business? (split), Jobber vs ServiceTitan vs Housecall Pro (crossroads), I Automated This Blog With AI and GitHub Actions (blueprint).
