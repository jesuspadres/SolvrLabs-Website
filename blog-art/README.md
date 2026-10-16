# blog-art

Blog header images for solvrlabs.com, drawn in code with the **animate** skill (github.com/cth9191/animate) in the **solvr-flow** style.

- `styles/solvr-flow/` — the style: `kit.js` (drawing code), `STYLE.md` (palette, topic treatments, frame checklist), `sample.png`.
- `pieces/blog-headers/` — the header "piece": one function per header in `src/scenes.js`, listed in `HEADERS` in `src/head.html`. Each header is a 1s era; render era *i* at t = i + 0.5.
- Finished images go to `blog/images/<slug>.png` (1200x630, used for the blog card and the link preview).

## Make a header by hand

Needs Node 18+, Playwright with Chromium, ffmpeg, and DM Sans installed as a local font.

```bash
SKILL=<path to the animate skill>          # e.g. ~/.claude/plugins/.../animate/skills/animate
node $SKILL/tools/build.mjs blog-art/pieces/blog-headers
node $SKILL/tools/still.mjs blog-art/pieces/blog-headers 0.5 blog/images/<slug>.png
```

## Weekly automation

A Claude scheduled task runs every Monday morning: it takes the next topic from `blog/topics.json`, writes the post in the site's format, draws its header with the topic's treatment, adds the card to `blog.html`, and leaves the changes in this folder for review. Push them when you're happy.
