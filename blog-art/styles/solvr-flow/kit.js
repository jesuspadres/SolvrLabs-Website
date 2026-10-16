// =====================================================================
//  styles/solvr-flow/kit.js — the Solvr Labs website look (solvrlabs.com), for blog headers and short reels.
//  A brand-blue gradient ground (the blog cards' Tailwind gradients), a faint dot grid and soft glow, and the
//  site's product language on top: white rounded cards with soft navy shadows, Lucide-style line icons in tinted
//  tiles, workflow nodes joined by connectors with flowing dots, small caps labels, DM Sans.
//  Built on kit/core.js. Helpers are prefixed sf. Needs from the piece head: HAND (a font stack), W, H.
// =====================================================================
const SF = {
  b50: '#f0f5ff', b100: '#e1ebff', b200: '#c8d8fe', b300: '#a3bffc', b400: '#7da0f8', b500: '#5a7de6',
  b600: '#4664d6', b700: '#3a53bd', b800: '#33469a', b900: '#2c3a7c', b950: '#1d264e', em600: '#059669',
  ink: '#1d1e20', g700: '#374151', g500: '#6b7280', g400: '#9ca3af', g300: '#d1d5db', g200: '#e5e7eb', g100: '#f2f3f6', g50: '#f9fafb',
  white: '#ffffff',
};
// tile tones from the site's workflow nodes: [tile background, icon colour]
const SF_TONE = {
  blue: ['#eef2ff', '#4664d6'], red: ['#fef2f2', '#ef4444'], green: ['#f0fdf4', '#16a34a'],
  violet: ['#faf5ff', '#a855f7'], amber: ['#fffbeb', '#d97706'], slate: ['#f2f3f6', '#4b5563'],
};
// the blog's category gradients (bg-gradient-to-br), from blog.html
const SF_GROUND = {
  opinion: ['#4664d6', '#2c3a7c'], comparison: ['#4664d6', '#059669'],
  build: ['#7da0f8', '#4664d6'], case: ['#5a7de6', '#3a53bd'],
};
const SF_FONT = () => (typeof HAND !== 'undefined' ? HAND : '"DM Sans", system-ui, sans-serif');

// ---- ground: gradient to bottom-right, a soft glow, a faint dot grid
function sfGround(kind = 'opinion', o = {}) {
  const [a, b] = SF_GROUND[kind] || SF_GROUND.opinion;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, a); g.addColorStop(1, b);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r1 = ctx.createRadialGradient(W * 0.18, H * 0.05, 0, W * 0.18, H * 0.05, W * 0.55);
  r1.addColorStop(0, 'rgba(255,255,255,0.20)'); r1.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = r1; ctx.fillRect(0, 0, W, H);
  const r2 = ctx.createRadialGradient(W * 0.9, H * 1.05, 0, W * 0.9, H * 1.05, W * 0.5);
  r2.addColorStop(0, 'rgba(29,38,78,0.30)'); r2.addColorStop(1, 'rgba(29,38,78,0)');
  ctx.fillStyle = r2; ctx.fillRect(0, 0, W, H);
  const sp = o.grid ?? Math.round(W / 40);
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  for (let y = sp / 2; y < H; y += sp) for (let x = sp / 2; x < W; x += sp) { ctx.beginPath(); ctx.arc(x, y, 1.3, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ---- rounded rect path
function sfRR(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

// ---- the white card: soft navy shadow, hairline border. o.lift raises it (deeper shadow).
function sfCard(x, y, w, h, o = {}) {
  const r = o.r ?? 18, lift = o.lift ?? 1;
  ctx.save();
  ctx.shadowColor = `rgba(29,38,78,${0.22 + 0.08 * lift})`; ctx.shadowBlur = 30 + 24 * lift; ctx.shadowOffsetY = 10 + 10 * lift;
  sfRR(x, y, w, h, r); ctx.fillStyle = o.fill ?? SF.white; ctx.fill();
  ctx.restore();
  ctx.save(); sfRR(x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.lineWidth = 1; ctx.strokeStyle = o.border ?? 'rgba(229,231,235,0.9)'; ctx.stroke(); ctx.restore();
}

// ---- a browser-window card like the site's hero ("automation.solvrlabs.com")
function sfWindow(x, y, w, h, url, o = {}) {
  sfCard(x, y, w, h, o);
  const bar = o.bar ?? 46;
  ctx.save(); sfRR(x, y, w, h, o.r ?? 18); ctx.clip();
  ctx.fillStyle = SF.g50; ctx.fillRect(x, y, w, bar); ctx.fillStyle = SF.g200; ctx.fillRect(x, y + bar, w, 1); ctx.restore();
  ['#f87171', '#fbbf24', '#4ade80'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + 22 + i * 18, y + bar / 2, 5.5, 0, TAU); ctx.fill(); });
  if (url) {
    const ux = x + 84, uw = w - 104; sfRR(ux, y + 10, uw, bar - 20, 7); ctx.fillStyle = SF.white; ctx.fill(); ctx.strokeStyle = SF.g200; ctx.lineWidth = 1; ctx.stroke();
    sfText(url, ux + 12, y + bar / 2 + 4.5, 13, SF.g400, { weight: 400, mono: true });
  }
  return { x, y: y + bar, w, h: h - bar };
}

// ---- text
function sfText(str, x, y, size, color, o = {}) {
  ctx.save();
  ctx.font = `${o.italic ? 'italic ' : ''}${o.weight ?? 600} ${size}px ${o.mono ? 'ui-monospace, "SF Mono", Menlo, "DejaVu Sans Mono", monospace' : SF_FONT()}`;
  ctx.fillStyle = color; ctx.textAlign = o.align ?? 'left'; ctx.textBaseline = 'alphabetic';
  if (o.track) ctx.letterSpacing = `${o.track}px`;
  const w = ctx.measureText(str).width, frac = clamp(o.frac ?? 1);
  if (frac < 1) { const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x; ctx.beginPath(); ctx.rect(x0 - 2, y - size * 1.2, w * frac + 2, size * 1.7); ctx.clip(); }
  if (frac > 0) ctx.fillText(str, x, y);
  ctx.restore(); return w;
}
// the site's small-caps eyebrow ("LIVE WORKFLOW")
const sfEyebrow = (str, x, y, color = SF.b600, size = 13) => sfText(str.toUpperCase(), x, y, size, color, { weight: 600, track: 1.2 });

// ---- skeleton line (stands in for body text)
function sfSkel(x, y, w, h = 9, c = SF.g200) { sfRR(x, y, w, h, h / 2); ctx.fillStyle = c; ctx.fill(); }

// ---- pill / badge. tone: 'green' | 'blue' | 'red' | 'white' ... ; o.dot draws the status dot
function sfPill(str, x, y, tone = 'green', o = {}) {
  const size = o.size ?? 13, padX = o.padX ?? 11, hgt = size + 13;
  const [bg, fg] = tone === 'white' ? ['rgba(255,255,255,0.16)', '#ffffff'] : SF_TONE[tone] || SF_TONE.blue;
  ctx.save(); ctx.font = `600 ${size}px ${SF_FONT()}`; const tw = ctx.measureText(str).width; ctx.restore();
  const w = tw + padX * 2 + (o.dot ? 14 : 0), x0 = o.align === 'right' ? x - w : x;
  sfRR(x0, y, w, hgt, hgt / 2); ctx.fillStyle = bg; ctx.fill();
  if (o.border !== false) { ctx.strokeStyle = tone === 'white' ? 'rgba(255,255,255,0.35)' : fg + '33'; ctx.lineWidth = 1; ctx.stroke(); }
  if (o.dot) { ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(x0 + padX + 3.5, y + hgt / 2, 3.5, 0, TAU); ctx.fill(); }
  sfText(str, x0 + padX + (o.dot ? 14 : 0), y + hgt / 2 + size * 0.36, size, fg, { weight: 600 });
  return w;
}

// ---- Lucide-style line icons (24-unit grid, stroke 2), drawn as Path2D from path data
const SF_ICONS = {
  phone: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'],
  phoneMissed: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z', 'm16 2 6 6', 'm22 2-6 6'],
  zap: ['M13 2 3 14h9l-1 8 10-12h-9l1-8z'],
  sparkles: ['m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z', 'M5 3v4', 'M19 17v4', 'M3 5h4', 'M17 19h4'],
  message: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  calendar: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'],
  calendarX: ['M8 2v4', 'M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm14 14-4 4', 'm10 14 4 4'],
  chart: ['M3 3v18h18', 'M18 17V9', 'M13 17V5', 'M8 17v-3'],
  code: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
  arrows: ['m16 3 4 4-4 4', 'M20 7H4', 'm8 21-4-4 4-4', 'M4 17h16'],
  dollar: ['M12 2v20', 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  check: ['M20 6 9 17l-5-5'],
  checkCircle: ['M22 11.08V12a10 10 0 1 1-5.93-9.14', 'm9 11 3 3L22 4'],
  x: ['M18 6 6 18', 'm6 6 12 12'],
  clock: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 6v6l4 2'],
  file: ['M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z', 'M14 2v4a2 2 0 0 0 2 2h4', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  git: ['M6 3v12', 'M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M18 9a9 9 0 0 1-9 9'],
  mic: ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v3'],
  bot: ['M12 8V4H8', 'M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z', 'M2 14h2', 'M20 14h2', 'M15 13v2', 'M9 13v2'],
  wrench: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'],
  plug: ['M12 22v-5', 'M9 8V2', 'M15 8V2', 'M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z'],
  trend: ['m22 17-8.5-8.5-5 5L2 7', 'M16 17h6v-6'],
  trendDown: ['m22 17-8.5-8.5-5 5L2 7', 'M16 17h6v-6'],
  lock: ['M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z', 'M7 11V7a5 5 0 0 1 10 0v4'],
  shield: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'm9 12 2 2 4-4'],
  user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  database: ['M12 2C7 2 3 3.34 3 5s4 3 9 3 9-1.34 9-3-4-3-9-3z', 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5', 'M3 12c0 1.66 4 3 9 3s9-1.34 9-3'],
};
const SF_P2D = {};
function sfIcon(name, cx, cy, size, color, o = {}) {
  const parts = SF_ICONS[name]; if (!parts) return;
  const P = SF_P2D[name] || (SF_P2D[name] = parts.map((d) => new Path2D(d)));
  const k = size / 24;
  ctx.save(); ctx.translate(cx - size / 2, cy - size / 2); ctx.scale(k, k);
  ctx.strokeStyle = color; ctx.lineWidth = (o.w ?? 2); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  P.forEach((p) => ctx.stroke(p)); ctx.restore();
}
// an icon in a tinted rounded tile (the site's node icons)
function sfTile(name, x, y, s, tone = 'blue', o = {}) {
  const [bg, fg] = SF_TONE[tone] || SF_TONE.blue;
  sfRR(x, y, s, s, o.r ?? s * 0.28); ctx.fillStyle = o.bg ?? bg; ctx.fill();
  if (o.ring) { ctx.strokeStyle = fg + '40'; ctx.lineWidth = 1.5; ctx.stroke(); }
  sfIcon(name, x + s / 2, y + s / 2, s * 0.5, o.fg ?? fg, { w: o.w ?? 2 });
}
// a workflow node card: tile + title + sub (the hero's "Missed Call / Trigger")
function sfNode(x, y, w, h, icon, tone, title, sub, o = {}) {
  sfCard(x, y, w, h, { r: o.r ?? 14, lift: o.lift ?? 0.6, border: o.active ? SF.b300 : undefined });
  if (o.active) { ctx.save(); sfRR(x - 3, y - 3, w + 6, h + 6, (o.r ?? 14) + 3); ctx.strokeStyle = 'rgba(70,100,214,0.25)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
  const s = h * 0.56; sfTile(icon, x + h * 0.22, y + (h - s) / 2, s, tone);
  const tx = x + h * 0.22 + s + 14;
  sfText(title, tx, y + h * 0.47, o.size ?? 17, SF.ink, { weight: 600 });
  if (sub) sfText(sub, tx, y + h * 0.47 + (o.size ?? 17) * 1.15, (o.size ?? 17) * 0.76, SF.g400, { weight: 400 });
}

// ---- connector between points with flowing dots (t drives the flow; static frames still show dots)
function sfConnector(pts, o = {}) {
  ctx.save();
  ctx.strokeStyle = o.c ?? 'rgba(255,255,255,0.55)'; ctx.lineWidth = o.w ?? 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.setLineDash([]);
  const L = pathLen(pts), n = o.dots ?? 2, ph = ((o.t ?? TT) * (o.speed ?? 0.6)) % 1;
  for (let i = 0; i < n; i++) {
    const p = pointAt(pts, ((i / n + ph) % 1) * L);
    const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 10); g.addColorStop(0, o.glow ?? 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, TAU); ctx.fill();
    ctx.fillStyle = o.dot ?? '#ffffff'; ctx.beginPath(); ctx.arc(p[0], p[1], 3.2, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ---- the hero: the AI node, a gradient circle with the sparkles icon and a soft halo ring
function sfSpark(x, y, r, o = {}) {
  SPARK_AT = toScreen(x, y);
  const pulse = 1 + 0.06 * Math.sin((o.t ?? TT) * TAU * 0.8);
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.beginPath(); ctx.arc(x, y, r * 1.55 * pulse, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.beginPath(); ctx.arc(x, y, r * 1.25, 0, TAU); ctx.fill();
  ctx.shadowColor = 'rgba(29,38,78,0.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
  const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r); g.addColorStop(0, SF.white); g.addColorStop(1, SF.b50);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.restore();
  sfIcon('sparkles', x, y, r * 1.05, SF.b600, { w: 2 });
}

// =====================================================================
//  STYLE — the renderer's hooks. Eras are flat UI on a gradient, so morphs are clean iris windows.
// =====================================================================
const STYLE = {
  name: 'solvr-flow',
  paper: SF.b600,
  backdrop(c) { fillAll(c); },
  window(P, key, src) {
    ctx.save(); trace(P, true); ctx.clip(); ctx.drawImage(src, 0, 0); ctx.restore();
    ctx.save(); trace(P, true); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.stroke(); ctx.restore();
  },
  blob(P, c) { ctx.save(); trace(P, true); ctx.fillStyle = SF.white; ctx.shadowColor = 'rgba(29,38,78,0.3)'; ctx.shadowBlur = 30; ctx.fill(); ctx.restore(); },
  hero(x, y, r, o) { sfSpark(x, y, r * 0.7, o); },
  heroColor: SF.white,
  post() {},
  ones: true,
};

// =====================================================================
//  ILLUSTRATION — flat, rounded, brand-palette people and props, for "how it changes the business" scenes.
//  No faces; limbs are thick round strokes; one skin tone family; navy clothing; brand-blue props.
// =====================================================================
const SF_SKIN = ['#e9b48f', '#c98d6a', '#8d5a3f'];
function sfLimb(pts, w, c) { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore(); }
function sfDot(x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function sfPoly(pts, c) { ctx.fillStyle = c; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); }

// a tradesperson kneeling, facing right, reaching forward with a wrench. (x, y) = knee on the floor; s = scale.
function sfWorkerKneel(x, y, s = 1, o = {}) {
  const skin = SF_SKIN[o.skin ?? 1], shirt = o.shirt ?? SF.b900, pants = o.pants ?? SF.b700, cap = o.cap ?? SF.b500;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // far leg (darker): knee on the floor, shin flat behind, boot sole showing
  const far = o.far ?? SF.b800;
  sfLimb([[-30, -58], [-6, -8], [-70, -6]], 26, far); sfPoly([[-66, -20], [-92, -18], [-92, 6], [-66, 6]], SF.b950);
  // near leg: thigh forward to a raised knee, shin straight down, boot flat
  sfLimb([[-30, -60], [34, -56], [36, -8]], 28, pants); sfPoly([[22, -12], [64, -12], [66, 8], [22, 8]], SF.b950);
  // torso leaning forward
  sfLimb([[-36, -64], [6, -120]], 44, shirt);
  // tool belt
  sfLimb([[-50, -62], [-18, -70]], 8, '#b45309');
  // head + cap
  sfDot(30, -150, 21, skin);
  ctx.fillStyle = cap; ctx.beginPath(); ctx.arc(30, -155, 22, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); ctx.fill();
  sfLimb([[42, -156], [62, -152]], 7, cap);
  // reaching arm, hand and wrench
  const hx = o.reach?.[0] ?? 96, hy = o.reach?.[1] ?? -112;
  sfLimb([[10, -118], [52, -104], [hx, hy]], 18, shirt);
  sfDot(hx + 4, hy, 10, skin);
  ctx.save(); ctx.translate(hx + 8, hy - 2); ctx.rotate(-0.5);
  sfLimb([[0, 0], [34, 0]], 8, SF.g400); ctx.fillStyle = SF.g400; ctx.beginPath(); ctx.arc(40, 0, 10, 0, TAU); ctx.fill();
  ctx.fillStyle = o.bg ?? SF.white; ctx.fillRect(40, -4, 12, 8); ctx.restore();
  ctx.restore();
}
// a kitchen sink cabinet with the doors open and a U-trap pipe. (x, y) = bottom-left on the floor.
function sfSinkCabinet(x, y, w = 190, h = 150, o = {}) {
  const body = o.body ?? SF.b200, dark = o.dark ?? SF.b400, top = o.top ?? SF.b300;
  sfRR(x, y - h, w, h, 8); ctx.fillStyle = body; ctx.fill();
  sfRR(x - 10, y - h - 16, w + 20, 18, 6); ctx.fillStyle = top; ctx.fill();
  // faucet
  sfLimb([[x + w * 0.5, y - h - 16], [x + w * 0.5, y - h - 50], [x + w * 0.5 + 26, y - h - 50], [x + w * 0.5 + 26, y - h - 38]], 8, SF.g400);
  // open interior + pipe
  sfRR(x + 14, y - h + 16, w - 28, h - 28, 6); ctx.fillStyle = dark; ctx.fill();
  { const cx = x + w * 0.5, t = y - h + 16; ctx.save(); ctx.strokeStyle = SF.g300; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(cx, t); ctx.lineTo(cx, t + 48); ctx.arc(cx - 18, t + 48, 18, 0, Math.PI); ctx.lineTo(cx - 36, t + 36); ctx.lineTo(x + 18, t + 36); ctx.stroke();
    ctx.fillStyle = SF.g400; ctx.fillRect(cx - 9, t + 20, 18, 7); ctx.restore(); }
  // open door leaning left
  sfPoly([[x + 4, y - h + 12], [x - 34, y - h + 26], [x - 34, y - 12], [x + 4, y - 4]], o.door ?? SF.b100);
  if (o.drips) for (let i = 0; i < 3; i++) sfDot(x + w * 0.5 - 30, y - h + 80 + i * 18 + ((o.t ?? TT) * 40 + i * 6) % 12, 4, '#60a5fa');
}
// a smartphone lying on the floor, screen up and slightly angled; screen draws via o.screen(sx, sy, sw, sh)
function sfPhone(x, y, w, h, o = {}) {
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(o.rot ?? -0.12); ctx.translate(-w / 2, -h / 2);
  ctx.shadowColor = 'rgba(29,38,78,0.3)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
  sfRR(0, 0, w, h, w * 0.16); ctx.fillStyle = SF.b950; ctx.fill(); ctx.shadowColor = 'transparent';
  const m = w * 0.06; sfRR(m, m, w - 2 * m, h - 2 * m, w * 0.12); ctx.fillStyle = o.screenBg ?? SF.white; ctx.fill();
  ctx.save(); sfRR(m, m, w - 2 * m, h - 2 * m, w * 0.12); ctx.clip(); if (o.screen) o.screen(m, m, w - 2 * m, h - 2 * m); ctx.restore();
  ctx.restore();
  if (o.buzz) { for (const sgn of [-1, 1]) for (let k = 0; k < 2; k++) { const cx = x + w / 2 + sgn * (w / 2 + 12 + k * 10), cy = y + h * 0.45; ctx.save(); ctx.strokeStyle = o.buzz; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx - sgn * 30, cy, 22 + k * 10, sgn > 0 ? -0.5 : Math.PI - 0.5, sgn > 0 ? 0.5 : Math.PI + 0.5); ctx.stroke(); ctx.restore(); } }
}

// ---- a seated person at a desk, facing right. (x, floorY) = chair centre on the floor. pose: 'typing' | 'relaxed'
function sfWorkerSeated(x, floorY, s = 1, o = {}) {
  const skin = SF_SKIN[o.skin ?? 1], shirt = o.shirt ?? SF.b900, pants = o.pants ?? SF.b700, hair = o.hair ?? SF.b950;
  ctx.save(); ctx.translate(x, floorY); ctx.scale(s, s);
  const seat = -96;
  // chair
  sfLimb([[0, -6], [0, seat + 10]], 8, SF.g400); sfLimb([[-30, -4], [30, -4]], 7, SF.g400); sfDot(-30, -2, 5, SF.g500); sfDot(30, -2, 5, SF.g500);
  sfRR(-40, seat - 2, 82, 16, 8); ctx.fillStyle = o.chair ?? SF.b950; ctx.fill();
  sfLimb([[-38, seat], [-48, seat - 92]], 14, o.chair ?? SF.b950);
  // far leg (darker) then near leg
  sfLimb([[-4, seat - 4], [52, seat - 6], [48, -10]], 24, o.far ?? SF.b800); sfPoly([[40, -14], [72, -14], [74, 4], [40, 4]], SF.b950);
  sfLimb([[0, seat - 6], [60, seat - 10], [58, -10]], 26, pants); sfPoly([[50, -14], [84, -14], [86, 4], [50, 4]], SF.b950);
  // torso
  const lean = o.pose === 'relaxed' ? -14 : 6;
  sfLimb([[-6, seat - 12], [lean, seat - 92]], 42, shirt);
  // head + hair
  const hx = lean + 12, hy = seat - 124;
  sfDot(hx, hy, 20, skin);
  ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(hx - 2, hy - 4, 21, Math.PI * 0.95, Math.PI * 1.9); ctx.closePath(); ctx.fill();
  // arms
  if (o.pose === 'relaxed') {
    sfLimb([[lean, seat - 84], [lean - 26, seat - 140], [hx - 14, hy - 4]], 16, shirt);   // hand behind head
    sfLimb([[lean + 4, seat - 80], [lean + 34, seat - 52], [lean + 56, seat - 74]], 16, shirt);   // holding a mug
    sfDot(lean + 60, seat - 76, 9, skin);
    sfRR(lean + 58, seat - 100, 22, 26, 4); ctx.fillStyle = o.mug ?? SF.b400; ctx.fill(); ctx.strokeStyle = o.mug ?? SF.b400; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(lean + 82, seat - 87, 7, -1.2, 1.2); ctx.stroke();
  } else {
    sfLimb([[lean + 2, seat - 82], [lean + 34, seat - 40], [lean + 92, seat - 54]], 16, shirt);
    sfDot(lean + 96, seat - 55, 9, skin);
  }
  ctx.restore();
}
// a desk with a monitor turned toward the viewer. screen(sx, sy, sw, sh) draws its content. Returns geometry.
function sfDesk(x, floorY, w, o = {}) {
  const top = floorY - (o.h ?? 132);
  sfLimb([[x + 14, top + 10], [x + 14, floorY]], 10, o.leg ?? SF.g300); sfLimb([[x + w - 14, top + 10], [x + w - 14, floorY]], 10, o.leg ?? SF.g300);
  sfRR(x, top - 4, w, 16, 6); ctx.fillStyle = o.top ?? SF.b300; ctx.fill();
  const mw = o.mw ?? 220, mh = o.mh ?? 146, mx = x + w - mw - (o.mpad ?? 18), my = top - 26 - mh;
  sfLimb([[mx + mw / 2, top - 4], [mx + mw / 2, my + mh]], 10, SF.g400); sfRR(mx + mw / 2 - 30, top - 10, 60, 8, 4); ctx.fillStyle = SF.g400; ctx.fill();
  ctx.save(); ctx.shadowColor = 'rgba(29,38,78,0.22)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
  sfRR(mx, my, mw, mh, 12); ctx.fillStyle = SF.b950; ctx.fill(); ctx.restore();
  ctx.save(); sfRR(mx + 7, my + 7, mw - 14, mh - 14, 7); ctx.fillStyle = o.screenBg ?? SF.white; ctx.fill(); ctx.clip();
  if (o.screen) o.screen(mx + 7, my + 7, mw - 14, mh - 14); ctx.restore();
  return { top, mx, my, mw, mh };
}
// a window on the back wall: day (sun) or night (moon)
function sfWindowWall(x, y, w, h, night) {
  sfRR(x, y, w, h, 10); ctx.fillStyle = night ? SF.b950 : '#dbeafe'; ctx.fill();
  if (night) { sfDot(x + w * 0.68, y + h * 0.36, 16, '#e0e7ff'); sfDot(x + w * 0.68 + 7, y + h * 0.36 - 5, 14, SF.b950); [[0.25, 0.3], [0.4, 0.62], [0.2, 0.75]].forEach(([a, b]) => sfDot(x + w * a, y + h * b, 2, '#c7d2fe')); }
  else { sfDot(x + w * 0.66, y + h * 0.38, 18, '#fde68a'); }
  ctx.fillStyle = night ? '#28336a' : SF.white; ctx.fillRect(x + w / 2 - 3, y, 6, h); ctx.fillRect(x, y + h / 2 - 3, w, 6);
  sfRR(x, y, w, h, 10); ctx.strokeStyle = night ? '#28336a' : SF.white; ctx.lineWidth = 6; ctx.stroke();
}

// ---- the full-bleed before/after layout. cfg: { before: card, after: card, draw(side) } where card = { icon, tone, title, sub, pill }
//      draw receives { ai, x0, w, L, R, floorY, mute } and draws the illustration for that half.
function sfSplitScene(cfg) {
  for (const ai of [false, true]) {
    const x0 = ai ? W / 2 : 0, w = W / 2, floorY = cfg.floorY ?? 548;
    ctx.fillStyle = ai ? SF.white : '#eef1f8'; ctx.fillRect(x0, 0, w, H);
    if (ai) { const g = ctx.createRadialGradient(x0 + w * 0.55, 330, 0, x0 + w * 0.55, 330, w * 0.7); g.addColorStop(0, 'rgba(225,235,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(x0, 0, w, H); }
    ctx.fillStyle = ai ? SF.b50 : '#e3e8f3'; ctx.fillRect(x0, floorY, w, H - floorY);
    ctx.fillStyle = ai ? SF.b100 : '#d6ddeb'; ctx.fillRect(x0, floorY, w, 2);
    const L = ai ? x0 + 34 : x0 + 104, R = ai ? x0 + w - 104 : x0 + w - 34;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, w, H); ctx.clip();
    cfg.draw({ ai, x0, w, L, R, floorY, mute: !ai });
    ctx.restore();
    const c = ai ? cfg.after : cfg.before;
    sfPill(c.label ?? (ai ? 'With AI' : 'Without'), L, 30, ai ? 'blue' : 'slate', { dot: ai, size: 15 });
    const cx = L, cy = 82, cw = R - L, ch = 104;
    sfCard(cx, cy, cw, ch, { r: 18, lift: ai ? 1.2 : 0.5 });
    sfTile(c.icon, cx + 20, cy + 24, 56, c.tone);
    sfText(c.title, cx + 92, cy + 48, 21, SF.ink, { weight: 700 });
    sfText(c.sub, cx + 92, cy + 74, 15.5, SF.g500, { weight: 400 });
    if (c.pill) sfPill(c.pill, cx + cw - 20, cy + 36, c.pillTone ?? (ai ? 'green' : 'red'), { align: 'right', size: 17 });
  }
  ctx.fillStyle = SF.b200; ctx.fillRect(W / 2 - 1, 0, 2, H);
  sfSpark(W / 2, cfg.sparkY ?? 300, 34);
}
// muted (before) vs brand (after) palettes for the illustration
const sfPal = (mute) => mute
  ? { shirt: '#3f4c78', pants: '#5a6896', far: '#4a5783', cap: '#8290b8', hair: '#2b3456', chair: '#3a4468', deskTop: '#bfcae3', leg: '#c9d1e3', body: '#d3dbec', dark: '#a6b4d4', top: '#bfcae3', door: '#e2e8f4', mug: '#9aa7c8', accent: '#a6b4d4' }
  : { shirt: SF.b900, pants: SF.b700, far: SF.b800, cap: SF.b500, hair: SF.b950, chair: SF.b950, deskTop: SF.b300, leg: SF.g300, body: SF.b200, dark: SF.b400, top: SF.b300, door: SF.b100, mug: SF.b400, accent: SF.b500 };

// =====================================================================
//  TREATMENTS — each topic gets its own composition and ground (STYLE.md: Topic treatments).
//    case study  -> 'split'      before / after, light, money accent
//    comparison  -> 'crossroads' an outdoor scene: roads, a signpost, the AI rising like a sun, mint sky
//    build log   -> 'blueprint'  navy blueprint grid, cyan line annotations, a machine doing the work
//    opinion     -> 'editorial'  warm paper, one oversized symbolic object (to be proven)
//  Every treatment ends with sfFrame(): a thin inset border.
// =====================================================================
function sfFrame(c = SF.b200, o = {}) {
  const k = o.inset ?? 14; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  sfRR(k, k, W - 2 * k, H - 2 * k, o.r ?? 18); ctx.lineWidth = o.w ?? 2; ctx.strokeStyle = c; ctx.stroke();
  // mask outside the frame with the page colour so the art sits in a rounded window
  if (o.mask) { ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.roundRect(k, k, W - 2 * k, H - 2 * k, o.r ?? 18); ctx.fillStyle = o.mask; ctx.fill('evenodd'); }
  ctx.restore();
}
// a standing person, side view facing right, holding a phone up. (x, floorY) between the feet.
function sfWorkerStand(x, floorY, s = 1, o = {}) {
  const skin = SF_SKIN[o.skin ?? 1], shirt = o.shirt ?? SF.b900, pants = o.pants ?? SF.b700, cap = o.cap ?? SF.b500;
  ctx.save(); ctx.translate(x, floorY); ctx.scale(s, s);
  sfLimb([[-6, -96], [-14, -8]], 24, o.far ?? SF.b800); sfPoly([[-26, -12], [6, -12], [8, 6], [-26, 6]], SF.b950);
  sfLimb([[4, -96], [12, -8]], 26, pants); sfPoly([[0, -12], [36, -12], [38, 6], [0, 6]], SF.b950);
  sfLimb([[-2, -104], [2, -184]], 46, shirt);
  sfLimb([[-6, -110], [10, -112]], 8, '#b45309');
  sfDot(10, -214, 21, skin);
  ctx.fillStyle = cap; ctx.beginPath(); ctx.arc(10, -219, 22, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); ctx.fill(); sfLimb([[22, -220], [42, -216]], 7, cap);
  // far arm on hip, near arm holding a phone up
  sfLimb([[-10, -176], [-30, -140], [-12, -118]], 16, o.farArm ?? '#22306a');
  sfLimb([[6, -176], [30, -142], [42, -176]], 16, shirt); sfDot(44, -180, 9, skin);
  sfRR(38, -212, 22, 38, 5); ctx.fillStyle = SF.b950; ctx.fill(); sfRR(41, -208, 16, 30, 3); ctx.fillStyle = o.screen ?? '#dcfce7'; ctx.fill();
  ctx.restore();
}
function sfCloud(x, y, s, c = 'rgba(255,255,255,0.9)') { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 26 * s, Math.PI, 0); ctx.arc(x + 34 * s, y - 10 * s, 32 * s, Math.PI, 0); ctx.arc(x + 70 * s, y, 24 * s, Math.PI, 0); ctx.closePath(); ctx.fill(); }
// an arrow-shaped sign on a post
function sfSign(x, y, w, h, dir, label, c, o = {}) {
  const t = h * 0.5, P = dir > 0 ? [[x, y], [x + w, y], [x + w + t, y + h / 2], [x + w, y + h], [x, y + h]] : [[x + t, y], [x + t + w, y], [x + t + w, y + h], [x + t, y + h], [x, y + h / 2]];
  ctx.save(); ctx.shadowColor = 'rgba(29,38,78,0.25)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5; sfPoly(P, c); ctx.restore();
  sfText(label, dir > 0 ? x + w / 2 + 4 : x + t + w / 2 - 4, y + h / 2 + (o.size ?? 19) * 0.36, o.size ?? 19, '#ffffff', { weight: 700, align: 'center' });
}
// blueprint ground: navy with a fine cyan grid and a heavier major grid
function sfBlueprint(o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#22306a'); g.addColorStop(1, '#161e40'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const step = o.step ?? 24;
  for (let x = 0; x <= W; x += step) { ctx.fillStyle = x % (step * 5) === 0 ? 'rgba(125,160,248,0.20)' : 'rgba(125,160,248,0.08)'; ctx.fillRect(x, 0, 1, H); }
  for (let y = 0; y <= H; y += step) { ctx.fillStyle = y % (step * 5) === 0 ? 'rgba(125,160,248,0.20)' : 'rgba(125,160,248,0.08)'; ctx.fillRect(0, y, W, 1); }
  ctx.restore();
}
// a blueprint annotation: a leader line and a mono label
function sfNote(x1, y1, x2, y2, label, o = {}) {
  ctx.save(); ctx.strokeStyle = o.c ?? '#7dd3fc'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]);
  sfDot(x1, y1, 3.5, o.c ?? '#7dd3fc'); ctx.restore();
  sfText(label, x2 + (o.align === 'right' ? -6 : 6), y2 + 5, o.size ?? 14, o.c ?? '#7dd3fc', { mono: true, weight: 500, align: o.align ?? 'left' });
}

// ---- a database cylinder (blueprint builds). (cx, top) = centre of the lid; rows = number of bands.
//      o.band(i, x, y, w, h) draws content on band i. Returns band geometry.
function sfDatabase(cx, top, w, h, o = {}) {
  const rx = w / 2, ry = o.ry ?? 26, rows = o.rows ?? 3, body = o.body ?? '#f0f5ff', side = o.side ?? '#c8d8fe';
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
  ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(cx, top + h, rx, ry, 0, 0, Math.PI); ctx.lineTo(cx - rx, top); ctx.lineTo(cx + rx, top); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.fillStyle = body; ctx.fillRect(cx - rx, top, w, h);
  const bh = h / rows, bands = [];
  for (let i = 0; i < rows; i++) {
    const y = top + i * bh;
    if (i > 0) { ctx.save(); ctx.strokeStyle = side; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, y, rx, ry, 0, 0, Math.PI); ctx.stroke(); ctx.restore(); }
    bands.push({ x: cx - rx, y, w, h: bh });
  }
  ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(cx, top + h, rx, ry, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = o.lid ?? '#ffffff'; ctx.beginPath(); ctx.ellipse(cx, top, rx, ry, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = side; ctx.lineWidth = 2; ctx.stroke();
  bands.forEach((b, i) => o.band && o.band(i, b.x, b.y, b.w, b.h));
  return bands;
}

// ---- editorial ground (Opinion): warm paper, a floor band, one soft accent disc behind the object.
//      o.disc = [cx, cy, r], o.discColor
function sfEditorial(o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#faf7f2'; ctx.fillRect(0, 0, W, H);
  if (o.disc) { const [x, y, r] = o.disc; ctx.fillStyle = o.discColor ?? SF.b100; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#efe8de'; ctx.fillRect(0, o.floor ?? 548, W, H - (o.floor ?? 548));
  ctx.fillStyle = '#e4dccf'; ctx.fillRect(0, o.floor ?? 548, W, 2);
  ctx.restore();
}
// ---- a short stepladder seen from the side. (x, floorY) = foot of the front rail; h = height.
function sfLadder(x, floorY, h, o = {}) {
  const c = o.color ?? '#d97706', top = floorY - h, spread = h * 0.32;
  sfLimb([[x, floorY], [x + spread * 0.5, top]], 10, c);
  sfLimb([[x + spread, floorY], [x + spread * 0.5, top]], 10, o.back ?? '#b45309');
  for (let i = 1; i <= (o.rungs ?? 3); i++) { const t = i / ((o.rungs ?? 3) + 1), y = floorY - h * t, dx = spread * 0.5 * t; sfLimb([[x + dx, y], [x + spread - dx, y]], 6, c); }
  sfRR(x + spread * 0.5 - 22, top - 8, 44, 12, 4); ctx.fillStyle = c; ctx.fill();
}
