// =====================================================================
//  SCENES — Solvr Labs blog headers (solvr-flow). 1200x630, one era per header.
//  Each function is a worked example of one topic treatment (styles/solvr-flow/STYLE.md):
//    impactMissedCall  -> Case Study, split before/after
//    crossroadsCrm     -> Comparison, crossroads
//    blueprintBlog     -> Build Log, blueprint
//  For a new post: add a function, add it to HEADERS in src/head.html, build, and render its still.
// =====================================================================

// =====================================================================
//  IMPACT HEADERS (the approved direction): full-bleed before / after.
// =====================================================================
function phoneScreen(ok) {
  return (x, y, pw, ph) => {
    sfDot(x + pw / 2, y + ph * 0.36, pw * 0.28, ok ? '#16a34a' : '#ef4444');
    sfIcon(ok ? 'check' : 'phoneMissed', x + pw / 2, y + ph * 0.36, pw * 0.32, '#ffffff', { w: 2.6 });
    sfSkel(x + pw * 0.18, y + ph * 0.66, pw * 0.64, 5, ok ? '#86efac' : '#fca5a5'); sfSkel(x + pw * 0.28, y + ph * 0.78, pw * 0.44, 5, ok ? '#bbf7d0' : '#fecaca');
  };
}

// 1. How Much Does a Missed Call Actually Cost Your Plumbing Business?

// 1. How Much Does a Missed Call Actually Cost Your Plumbing Business?
function impactMissedCall() {
  sfSplitScene({
    before: { icon: 'phoneMissed', tone: 'red', title: 'Missed call', sub: 'Caller tried the next plumber', pill: '−$350' },
    after: { label: 'With an AI receptionist', icon: 'calendar', tone: 'green', title: 'Job booked', sub: 'AI answered · Thu 10:00 AM', pill: '+$350' },
    draw: ({ ai, L, R, floorY, mute }) => {
      const p = sfPal(mute);
      sfSinkCabinet(R - 200, floorY, 196, 172, mute ? p : {});
      sfWorkerKneel(L + 178, floorY, 1.18, { reach: [96, -104], bg: p.dark, ...p });
      sfPhone(L + 4, floorY - 104, 58, 106, { rot: -0.08, buzz: ai ? null : 'rgba(239,68,68,0.55)', screenBg: ai ? '#f0fdf4' : '#fef2f2', screen: phoneScreen(ai) });
    },
  });
}

// 2. Jobber vs ServiceTitan vs Housecall Pro: Which Works Best with AI?

// ---- 2b. comparison -> crossroads: one road splits three ways; the AI hangs over all of them like a sun
function crossroadsCrm() {
  const HZ = 360;
  const sky = ctx.createLinearGradient(0, 0, 0, HZ); sky.addColorStop(0, '#dbeafe'); sky.addColorStop(1, '#ecfdf5'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HZ);
  // the AI sun, above the signpost
  const sx = 600, sy = 132;
  const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, 260); halo.addColorStop(0, 'rgba(255,255,255,0.95)'); halo.addColorStop(0.35, 'rgba(209,250,229,0.6)'); halo.addColorStop(1, 'rgba(236,253,245,0)');
  ctx.fillStyle = halo; ctx.fillRect(0, 0, W, HZ);
  ctx.save(); ctx.shadowColor = 'rgba(5,150,105,0.35)'; ctx.shadowBlur = 40; sfDot(sx, sy, 70, '#ffffff'); ctx.restore();
  sfIcon('sparkles', sx, sy, 62, SF.em600, { w: 1.8 });
  sfCloud(150, 130, 1.0); sfCloud(960, 100, 0.85); sfCloud(330, 64, 0.55, 'rgba(255,255,255,0.75)');
  // hills
  ctx.fillStyle = '#a7f3d0'; ctx.beginPath(); ctx.moveTo(0, HZ); ctx.quadraticCurveTo(200, HZ - 66, 430, HZ); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#9ee9c8'; ctx.beginPath(); ctx.moveTo(780, HZ); ctx.quadraticCurveTo(1000, HZ - 84, W, HZ - 30); ctx.lineTo(W, HZ); ctx.closePath(); ctx.fill();
  const gr = ctx.createLinearGradient(0, HZ, 0, H); gr.addColorStop(0, '#d1fae5'); gr.addColorStop(1, '#bbf7d0'); ctx.fillStyle = gr; ctx.fillRect(0, HZ, W, H - HZ);
  // road: one lane from us, splitting into three toward the horizon
  const J = 470, road = '#f8fffb', edge = '#a7f3d0';
  sfPoly([[430, H], [770, H], [690, J], [510, J]], road);
  [[[510, J], [600, J], [190, HZ], [160, HZ]], [[560, J], [640, J], [612, HZ], [588, HZ]], [[600, J], [690, J], [1040, HZ], [1010, HZ]]].forEach((P) => sfPoly(P, road));
  ctx.save(); ctx.strokeStyle = edge; ctx.lineWidth = 3; ctx.setLineDash([16, 14]);
  [[[600, H], [600, J]], [[555, J - 4], [175, HZ + 2]], [[600, J - 4], [600, HZ + 2]], [[645, J - 4], [1025, HZ + 2]]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); });
  ctx.restore();
  // the signpost at the fork
  const px = 600, pb = J + 18;
  sfRR(px - 8, 214, 16, pb - 214, 6); ctx.fillStyle = SF.b950; ctx.fill();
  sfRR(px - 28, pb - 6, 56, 14, 6); ctx.fillStyle = SF.b950; ctx.fill();
  sfSign(px - 200, 230, 184, 52, -1, 'Jobber', SF.b600);
  sfSign(px + 8, 292, 222, 52, 1, 'ServiceTitan', SF.em600);
  sfSign(px - 250, 354, 234, 52, -1, 'Housecall Pro', SF.b900);
  // the tradesperson, phone in hand, deciding
  sfWorkerStand(222, 600, 1.2, { screen: '#d1fae5' });
  sfPill('Which one works best with AI?', 104, 40, 'green', { dot: true, size: 15 });
  sfFrame('#86efac');
}

// ---- 3b. build log -> blueprint: a machine prints a new post every Monday while you rest
function blueprintBlog() {
  sfBlueprint();
  const floor = 520;
  ctx.fillStyle = 'rgba(125,160,248,0.25)'; ctx.fillRect(0, floor, W, 2);
  // conveyor out of the machine, to the right edge
  const cy = floor - 96;
  sfRR(560, cy, 640, 22, 11); ctx.fillStyle = '#334a9a'; ctx.fill();
  for (let i = 0; i < 12; i++) sfDot(578 + i * 52, cy + 11, 7, '#4664d6');
  ctx.fillStyle = '#2c3a7c'; ctx.fillRect(600, cy + 22, 10, floor - cy - 22); ctx.fillRect(1080, cy + 22, 10, floor - cy - 22);
  // blog post cards riding the belt
  [[620, 'Mon'], [790, 'Mon'], [960, 'Mon']].forEach(([x, d], i) => {
    const y = cy - 118, w = 150, h = 116;
    sfCard(x, y, w, h, { r: 12, lift: 0.8 });
    ctx.save(); sfRR(x, y, w, h, 12); ctx.clip(); const g = ctx.createLinearGradient(x, y, x + w, y + 48); g.addColorStop(0, SF.b600); g.addColorStop(1, SF.b900); ctx.fillStyle = g; ctx.fillRect(x, y, w, 48); ctx.restore();
    sfIcon(['zap', 'chart', 'code'][i], x + w / 2, y + 24, 22, 'rgba(255,255,255,0.85)', { w: 1.8 });
    sfSkel(x + 12, y + 60, 110, 8, SF.b900 + 'cc'); sfSkel(x + 12, y + 74, 80, 8, SF.b900 + 'cc');
    sfPill(d, x + 12, y + 88, 'green', { size: 10, padX: 7 });
  });
  // the machine
  const mx = 400, my = 186, mw = 190, mh = floor - my;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; sfRR(mx, my, mw, mh, 22); ctx.fillStyle = '#f0f5ff'; ctx.fill(); ctx.restore();
  sfRR(mx + 18, my + 22, mw - 36, 70, 12); ctx.fillStyle = SF.b950; ctx.fill();
  sfText('weekly-blog.yml', mx + mw / 2, my + 52, 13, '#7dd3fc', { mono: true, align: 'center', weight: 500 });
  sfText('running…', mx + mw / 2, my + 74, 12, '#86efac', { mono: true, align: 'center', weight: 500 });
  sfSpark(mx + mw / 2, my + 162, 36);
  for (let i = 0; i < 3; i++) sfDot(mx + 40 + i * 22, my + mh - 30, 6, ['#86efac', '#fde68a', '#fca5a5'][i]);
  // a calendar page feeding in from the top
  sfCard(mx + 46, my - 92, 98, 84, { r: 12, lift: 0.6 });
  ctx.save(); sfRR(mx + 46, my - 92, 98, 84, 12); ctx.clip(); ctx.fillStyle = '#ef4444'; ctx.fillRect(mx + 46, my - 92, 98, 24); ctx.restore();
  sfText('MON', mx + 95, my - 74, 13, '#ffffff', { weight: 700, align: 'center' });
  sfText('9:00', mx + 95, my - 26, 26, SF.ink, { weight: 700, align: 'center' });
  // the author, off duty
  sfWorkerSeated(170, floor, 1.15, { pose: 'relaxed', chair: '#4664d6', shirt: '#e0e7ff', pants: SF.b500, far: SF.b600, hair: '#0f172a', mug: '#fde68a' });
  // annotations
  sfNote(mx + 46, my - 50, 252, 120, "cron: '0 9 * * 1'", { align: 'right' });
  sfNote(1035, cy - 120, 1035, 150, 'published to /blog', { align: 'right' });
  sfPill('Build log', 104, 40, 'white', { size: 15 });
  sfFrame('rgba(165,180,252,0.45)');
}

// 4. Supabase for Everything: Why It's My Go-To Backend

// ---- build log -> blueprint: one Postgres database, every customer locked to their own rows (row level security)
function blueprintSupabase() {
  sfBlueprint();
  const floor = 548;
  ctx.fillStyle = 'rgba(125,160,248,0.25)'; ctx.fillRect(0, floor, W, 2);
  // the database
  const cx = 470, top = 218, dw = 250, dh = 270;
  const rows = [['Martinez', 'green'], ['Okafor', 'blue'], ['Chen', 'violet']];
  const bands = sfDatabase(cx, top, dw, dh, {
    rows: 3,
    band: (i, x, y, w, h) => {
      const my = y + h / 2 + 10;
      sfTile('lock', x + 26, my - 22, 44, rows[i][1]);
      sfSkel(x + 84, my - 12, 116, 9, '#a3bffc'); sfSkel(x + 84, my + 6, 78, 9, '#c8d8fe');
    },
  });
  sfSpark(cx, top - 4, 32);
  sfText('postgres', cx, top + dh + 64, 14, '#7dd3fc', { mono: true, align: 'center', weight: 500 });
  // customer portals on the right, each wired to its own row only
  const px = 812, pw = 280, ph = 74;
  rows.forEach(([name, tone], i) => {
    const b = bands[i], ry = b.y + b.h / 2 + 10, py = 176 + i * 128;
    sfConnector([[cx + dw / 2 + 6, ry], [px - 40, ry], [px - 40, py + ph / 2], [px, py + ph / 2]], { c: 'rgba(125,211,252,0.6)', dots: 1, glow: 'rgba(125,211,252,0.8)', dot: '#e0f2fe', t: 0.15 + i * 0.27 });
    sfNode(px, py, pw, ph, 'user', tone, name, 'sees only their jobs', { size: 18 });
  });
  // the owner, standing beside it, checking the dashboard on a phone
  sfWorkerStand(150, floor, 1.25, { skin: 2, shirt: '#0f766e', pants: SF.b700, far: SF.b800, cap: '#f59e0b', farArm: '#0b5e58', screen: '#e0f2fe' });
  // annotations
  sfNote(cx + dw / 2 - 24, top - 8, 640, 118, 'enable row level security', { align: 'left' });
  sfNote(px - 40, 470, 764, 574, 'using (auth.uid() = owner_id)', { align: 'left', size: 14 });
  sfPill('Build log', 104, 40, 'white', { size: 15 });
  sfFrame('rgba(165,180,252,0.45)');
}

// =====================================================================
//  BACKFILL (Oct 2026): one header per older post.
// =====================================================================

// ---- shared: a mirrored standing worker (faces left)
function sfStandFacing(x, floorY, s, o, left) {
  if (!left) return sfWorkerStand(x, floorY, s, o);
  ctx.save(); ctx.translate(x, 0); ctx.scale(-1, 1); sfWorkerStand(0, floorY, s, o); ctx.restore();
}

// ---- comparison -> crossroads, two roads. c = { a, b, ca, cb, q, sky, hill, ground, sun, moon, fork, side, person, prop }
function crossroads2(c) {
  const HZ = 356, fx = c.fork ?? 600;
  const sky = ctx.createLinearGradient(0, 0, 0, HZ); sky.addColorStop(0, c.sky[0]); sky.addColorStop(1, c.sky[1]); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, HZ);
  const [sx, sy] = c.sun ?? [fx, 128];
  const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, 240); halo.addColorStop(0, 'rgba(255,255,255,0.9)'); halo.addColorStop(0.4, c.glow ?? 'rgba(209,250,229,0.55)'); halo.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = halo; ctx.fillRect(0, 0, W, HZ);
  ctx.save(); ctx.shadowColor = c.sunShadow ?? 'rgba(5,150,105,0.35)'; ctx.shadowBlur = 40; sfDot(sx, sy, 62, '#ffffff'); ctx.restore();
  sfIcon('sparkles', sx, sy, 56, c.sunIcon ?? SF.em600, { w: 1.8 });
  if (c.stars) c.stars.forEach(([x, y]) => sfDot(x, y, 2.2, '#ffffff'));
  (c.clouds ?? [[140, 120, 0.9], [930, 96, 0.8]]).forEach(([x, y, k]) => sfCloud(x, y, k, c.cloud ?? 'rgba(255,255,255,0.9)'));
  ctx.fillStyle = c.hill[0]; ctx.beginPath(); ctx.moveTo(0, HZ); ctx.quadraticCurveTo(c.hillA ?? 240, HZ - 74, 520, HZ); ctx.closePath(); ctx.fill();
  ctx.fillStyle = c.hill[1]; ctx.beginPath(); ctx.moveTo(700, HZ); ctx.quadraticCurveTo(c.hillB ?? 980, HZ - 90, W, HZ - 24); ctx.lineTo(W, HZ); ctx.closePath(); ctx.fill();
  if (c.prop === 'house') sfHouse(c.propX ?? 900, HZ + 2, 0.42, { roof: SF.b700 });
  const gr = ctx.createLinearGradient(0, HZ, 0, H); gr.addColorStop(0, c.ground[0]); gr.addColorStop(1, c.ground[1]); ctx.fillStyle = gr; ctx.fillRect(0, HZ, W, H - HZ);
  const J = 476, road = c.road ?? '#fbfffd', edge = c.edge ?? 'rgba(0,0,0,0.12)';
  const lx = c.left ?? fx - 400, rx = c.right ?? fx + 420;
  sfPoly([[fx - 170, H], [fx + 170, H], [fx + 92, J], [fx - 92, J]], road);
  sfPoly([[fx - 92, J], [fx, J], [lx + 16, HZ], [lx - 16, HZ]], road);
  sfPoly([[fx, J], [fx + 92, J], [rx + 16, HZ], [rx - 16, HZ]], road);
  ctx.save(); ctx.strokeStyle = edge; ctx.lineWidth = 3; ctx.setLineDash([16, 14]);
  [[[fx, H], [fx, J]], [[fx - 46, J - 4], [lx, HZ + 2]], [[fx + 46, J - 4], [rx, HZ + 2]]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); });
  ctx.restore();
  // signpost
  const pb = J + 22, ptop = 218;
  sfRR(fx - 8, ptop, 16, pb - ptop, 6); ctx.fillStyle = SF.b950; ctx.fill(); sfRR(fx - 28, pb - 6, 56, 14, 6); ctx.fill();
  ctx.save(); ctx.font = `700 22px ${SF_FONT()}`; const wa = ctx.measureText(c.a).width + 56, wb = ctx.measureText(c.b).width + 56; ctx.restore();
  sfSign(fx - 18 - wa, 236, wa, 56, -1, c.a, c.ca, { size: 22 });
  sfSign(fx + 10, 306, wb, 56, 1, c.b, c.cb, { size: 22 });
  if (c.prop === 'van') sfVan(c.propX ?? 900, c.propY ?? 600, 0.72, { stripe: SF.b600 });
  const p = c.person ?? {};
  sfStandFacing(c.side === 'right' ? 1000 : 210, 602, 1.2, p, c.side === 'right');
  sfPill(c.q, c.qRight ? 1096 : 104, 40, c.qTone ?? 'green', { dot: true, size: 15, align: c.qRight ? 'right' : 'left' });
  sfFrame(c.frame ?? '#86efac');
}

function crossDialzara() {
  crossroads2({ a: 'Dialzara', b: 'Radar', ca: '#475569', cb: SF.b600, q: 'Generic AI, or built for the trades?',
    sky: ['#dbeafe', '#ecfdf5'], hill: ['#a7f3d0', '#9ee9c8'], ground: ['#d1fae5', '#bbf7d0'], prop: 'house', propX: 860,
    person: { skin: 0, shirt: SF.b900, cap: '#16a34a', screen: '#dcfce7' } });
}
function crossGoodcall() {
  crossroads2({ a: 'Goodcall', b: 'Radar', ca: '#64748b', cb: SF.b700, q: 'Who dispatches the on-call tech at 2 AM?', qTone: 'violet',
    sky: ['#c7d2fe', '#fde2e4'], hill: ['#c4b5fd', '#a5b4fc'], ground: ['#e0e7ff', '#c7d2fe'], sun: [900, 120], glow: 'rgba(224,231,255,0.7)', sunShadow: 'rgba(79,70,229,0.35)', sunIcon: SF.b600,
    clouds: [[120, 150, 0.7, 0]], stars: [[200, 60], [320, 100], [470, 50], [640, 80], [760, 44], [1060, 210], [1110, 70]], cloud: 'rgba(255,255,255,0.7)',
    road: '#f5f3ff', edge: 'rgba(79,70,229,0.25)', fork: 640, side: 'left', prop: 'house', propX: 1010,
    person: { skin: 2, shirt: '#3730a3', pants: SF.b700, cap: '#f59e0b', screen: '#e0e7ff' }, frame: '#a5b4fc' });
}
function crossRosie() {
  crossroads2({ a: 'Rosie AI', b: 'Radar', ca: '#be185d', cb: SF.b600, q: 'Which one actually gets home service work?', qTone: 'amber', qRight: true,
    sky: ['#fef3c7', '#fff7ed'], hill: ['#fcd34d', '#fbbf24'], ground: ['#fef3c7', '#fde68a'], glow: 'rgba(254,243,199,0.7)', sunShadow: 'rgba(217,119,6,0.35)', sunIcon: '#d97706',
    road: '#fffdf5', edge: 'rgba(217,119,6,0.25)', fork: 560, side: 'right', prop: 'van', propX: 120, propY: 606,
    person: { skin: 1, hair: '#3b2416', style: 'long', shirt: '#9a3412', pants: SF.b700, screen: '#fef3c7' }, frame: '#fcd34d' });
}
function crossRuby() {
  crossroads2({ a: 'Ruby', b: 'Radar', ca: '#b91c1c', cb: SF.b600, q: '$235/mo for 100 minutes, or $149/mo flat?', qTone: 'blue',
    sky: ['#bfdbfe', '#f0f9ff'], hill: ['#86efac', '#4ade80'], ground: ['#dcfce7', '#bbf7d0'], sun: [330, 112], glow: 'rgba(219,234,254,0.7)', sunShadow: 'rgba(70,100,214,0.35)', sunIcon: SF.b600,
    clouds: [[620, 90, 0.8], [960, 140, 1.0]], fork: 620, side: 'right', prop: 'house', propX: 120,
    person: { skin: 2, shirt: '#0f766e', pants: SF.b700, cap: SF.b500, screen: '#dbeafe' }, frame: '#93c5fd' });
}
function crossSmith() {
  crossroads2({ a: 'Smith.ai', b: 'Radar', ca: '#0f766e', cb: SF.b600, q: 'Per-call fees, or a flat $149/mo?', qTone: 'red',
    sky: ['#ffe4e6', '#fff7ed'], hill: ['#fda4af', '#fdba74'], ground: ['#ffedd5', '#fed7aa'], sun: [820, 150], glow: 'rgba(255,228,230,0.7)', sunShadow: 'rgba(225,29,72,0.3)', sunIcon: '#e11d48',
    road: '#fffaf5', edge: 'rgba(234,88,12,0.25)', fork: 560, side: 'left', prop: 'van', propX: 880, propY: 606,
    person: { skin: 0, hair: '#7c2d12', style: 'curly', shirt: SF.b900, pants: SF.b700, screen: '#ffe4e6' }, frame: '#fdba74' });
}
function crossZapierN8n() {
  crossroads2({ a: 'Zapier', b: 'n8n', ca: '#ea580c', cb: '#db2777', q: 'Easier, or more powerful?', qTone: 'violet', qRight: true,
    sky: ['#e0f2fe', '#f5f3ff'], hill: ['#c4b5fd', '#a78bfa'], ground: ['#ede9fe', '#ddd6fe'], sun: [260, 120], glow: 'rgba(237,233,254,0.7)', sunShadow: 'rgba(124,58,237,0.3)', sunIcon: '#7c3aed',
    road: '#faf5ff', edge: 'rgba(124,58,237,0.25)', fork: 640, side: 'right', prop: 'house', propX: 120, clouds: [[540, 80, 0.7], [820, 130, 0.9]],
    person: { skin: 1, shirt: '#1e3a8a', pants: SF.b700, cap: '#a855f7', screen: '#ede9fe' }, frame: '#c4b5fd' });
}

// ---- case study -> split: the same owner, nights of admin vs evenings back
function impactPlumberHours() {
  sfSplitScene({
    before: { icon: 'clock', tone: 'red', title: 'Admin every night', sub: '10 to 12 hours a week of paperwork', pill: '10-12 hrs' },
    after: { label: 'With three automations', icon: 'zap', tone: 'green', title: 'Admin runs itself', sub: 'Calls, proposals, invoices', pill: '+10 hrs/wk' },
    draw: ({ ai, L, R, floorY, mute }) => {
      const p = sfPal(mute);
      sfWindowWall(L + 8, 214, 132, 104, !ai);
      sfDesk(L + 120, floorY, R - L - 120, { top: p.deskTop, leg: p.leg, mw: 168, mh: 110, screenBg: ai ? '#f0fdf4' : '#fef2f2',
        screen: (x, y, w, h) => { if (ai) { sfTile('checkCircle', x + w / 2 - 26, y + h / 2 - 26, 52, 'green'); } else { for (let i = 0; i < 4; i++) sfSkel(x + 14, y + 16 + i * 20, w - 28 - (i % 2) * 40, 9, '#fca5a5'); } } });
      sfWorkerSeated(L + 112, floorY, 1.05, { pose: ai ? 'relaxed' : 'typing', skin: 0, ...p, hair: p.hair, mug: ai ? '#fde68a' : p.mug });
    },
  });
}

// ---- build log -> blueprint: Copilot mode. The receptionist talks; the AI fills the job card; one click fires it.
function blueprintCopilot() {
  sfBlueprint();
  const floor = 548;
  ctx.fillStyle = 'rgba(125,160,248,0.25)'; ctx.fillRect(0, floor, W, 2);
  const d = sfDesk(70, floor, 360, { top: '#a3bffc', leg: '#4664d6', mw: 176, mh: 116, screenBg: '#f0f5ff',
    screen: (x, y, w, h) => { sfTile('headset', x + 16, y + h / 2 - 24, 48, 'blue'); sfSkel(x + 78, y + h / 2 - 12, 70, 8, SF.b300); sfSkel(x + 78, y + h / 2 + 4, 50, 8, SF.b200); } });
  sfWorkerSeated(130, floor, 1.12, { pose: 'typing', skin: 2, style: 'bun', hair: '#111827', shirt: '#f0abfc', pants: SF.b600, far: SF.b700, chair: '#4664d6' });
  sfConnector([[d.mx + d.mw, d.my + d.mh / 2], [560, 240]], { c: 'rgba(125,211,252,0.6)', dots: 2, glow: 'rgba(125,211,252,0.8)', dot: '#e0f2fe', t: 0.3 });
  sfSpark(590, 240, 36);
  sfConnector([[626, 240], [700, 240]], { c: 'rgba(125,211,252,0.6)', dots: 1, glow: 'rgba(125,211,252,0.8)', dot: '#e0f2fe', t: 0.6 });
  const cx = 700, cy = 92, cw = 392, ch = 400;
  sfCard(cx, cy, cw, ch, { r: 18, lift: 1 });
  sfEyebrow('Live call · job card', cx + 26, cy + 40, SF.b600);
  [['Caller name', 'done'], ['Service address', 'done'], ['Urgency: emergency', 'done'], ['Preferred time', 'done']].forEach(([t, s], i) => sfCheckRow(cx + 26, cy + 64 + i * 56, cw - 52, t, s));
  sfRR(cx + 26, cy + ch - 84, cw - 52, 56, 14); ctx.fillStyle = SF.b600; ctx.fill();
  sfText('Confirm & Execute', cx + cw / 2, cy + ch - 49, 20, '#ffffff', { weight: 700, align: 'center' });
  sfNote(590, 282, 690, 470, 'extracts caller info live', { align: 'right' });
  sfNote(cx + cw - 30, cy + ch - 20, 900, 584, 'one click fires everything', { align: 'right' });
  sfPill('Build log', 104, 40, 'white', { size: 15 });
  sfFrame('rgba(165,180,252,0.45)');
}

// ---- build log -> blueprint: the first AI receptionist. A call at night, answered, booked, the team pinged.
function blueprintReceptionist() {
  sfBlueprint();
  const floor = 548;
  ctx.fillStyle = 'rgba(125,160,248,0.25)'; ctx.fillRect(0, floor, W, 2);
  sfHouse(96, floor, 1.0, { night: true, roof: '#4664d6', wall: '#e0e7ff', door: '#2c3a7c' });
  sfDot(240, 120, 24, '#e0e7ff'); sfDot(250, 112, 21, '#1f2a5c');
  sfPhone(300, 270, 92, 168, { rot: 0.06, buzz: 'rgba(125,211,252,0.7)', screenBg: '#f0f5ff', screen: (x, y, w, h) => { sfDot(x + w / 2, y + h * 0.38, w * 0.3, '#16a34a'); sfIcon('phone', x + w / 2, y + h * 0.38, w * 0.3, '#ffffff', { w: 2.4 }); sfSkel(x + w * 0.2, y + h * 0.68, w * 0.6, 7, SF.b300); } });
  sfConnector([[420, 354], [548, 300]], { c: 'rgba(125,211,252,0.6)', dots: 2, glow: 'rgba(125,211,252,0.8)', dot: '#e0f2fe', t: 0.2 });
  sfSpark(590, 290, 40);
  const nx = 760, nodes = [['calendar', 'green', 'Booked on Google Calendar', 'no one touched the phone'], ['message', 'violet', 'Team alerted on Discord', 'details, not a voicemail'], ['phone', 'blue', 'Warm handoff to the owner', 'when a caller asks for a person']];
  nodes.forEach(([ic, tone, t, s], i) => {
    const y = 128 + i * 128;
    sfConnector([[632, 290], [700, 290], [700, y + 37], [nx, y + 37]], { c: 'rgba(125,211,252,0.6)', dots: 1, glow: 'rgba(125,211,252,0.8)', dot: '#e0f2fe', t: 0.1 + i * 0.3 });
    sfNode(nx, y, 340, 74, ic, tone, t, s, { size: 17 });
  });
  sfNote(590, 340, 470, 470, 'voice AI answers every call', { align: 'left' });
  sfPill('Build log', 104, 40, 'white', { size: 15 });
  sfFrame('rgba(165,180,252,0.45)');
}

// ---- build log -> blueprint: TaskLine's stack, layer by layer, and what comes off the top
function blueprintTaskline() {
  sfBlueprint();
  const floor = 548;
  ctx.fillStyle = 'rgba(125,160,248,0.25)'; ctx.fillRect(0, floor, W, 2);
  const cx = 520, layers = [['Twilio', '#7dd3fc'], ['Claude AI', '#c4b5fd'], ['Stripe', '#a5b4fc'], ['Supabase', '#86efac'], ['Next.js', '#f0f5ff']];
  layers.forEach(([name, c], i) => {
    const y = 470 - i * 64, w = 300, h = 46;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
    sfPoly([[cx - w / 2 + 30, y], [cx + w / 2 + 30, y], [cx + w / 2 - 30, y + h], [cx - w / 2 - 30, y + h]], c); ctx.restore();
    sfText(name, cx, y + 30, 18, SF.b950, { weight: 700, align: 'center' });
  });
  sfSpark(cx, 150, 36);
  const nx = 790, outs = [['file', 'blue', 'Proposal drafted', 'about 90 seconds'], ['calendar', 'green', 'Slots that fit the drive', 'travel time built in'], ['dollar', 'violet', 'Invoice + follow-ups', 'day 3, day 7, day 14']];
  outs.forEach(([ic, tone, t, s], i) => {
    const y = 136 + i * 120;
    sfConnector([[cx + 40, 150], [740, 150], [740, y + 37], [nx, y + 37]], { c: 'rgba(125,211,252,0.6)', dots: 1, glow: 'rgba(125,211,252,0.8)', dot: '#e0f2fe', t: 0.15 + i * 0.3 });
    sfNode(nx, y, 300, 74, ic, tone, t, s, { size: 17 });
  });
  sfWorkerStand(180, floor, 1.2, { skin: 0, hair: '#78350f', style: 'long', shirt: '#be123c', pants: SF.b700, far: SF.b800, farArm: '#9f1239', screen: '#dcfce7' });
  sfNote(cx + 120, 516, 760, 566, 'one stack, AI built in', { align: 'left' });
  sfPill('Build log', 104, 40, 'white', { size: 15 });
  sfFrame('rgba(165,180,252,0.45)');
}

// ---- build log -> blueprint: one developer, Claude beside him, four kinds of work coming out
function blueprintClaudeBusiness() {
  sfBlueprint();
  const floor = 548;
  ctx.fillStyle = 'rgba(125,160,248,0.25)'; ctx.fillRect(0, floor, W, 2);
  const d = sfDesk(250, floor, 330, { top: '#a3bffc', leg: '#4664d6', mw: 190, mh: 124, screenBg: '#1d264e',
    screen: (x, y, w, h) => { ['#7dd3fc', '#86efac', '#c4b5fd', '#7dd3fc', '#fde68a'].forEach((c, i) => sfSkel(x + 14 + (i % 3) * 14, y + 14 + i * 19, w - 60 - (i % 2) * 30, 7, c)); } });
  sfWorkerSeated(270, floor, 1.12, { pose: 'typing', skin: 1, hair: '#1f2937', style: 'curly', shirt: '#334155', pants: SF.b600, far: SF.b700, chair: '#4664d6' });
  sfSpark(d.mx + d.mw / 2, d.my - 70, 34);
  const nx = 790, outs = [['code', 'blue', 'Code'], ['file', 'green', 'Client proposals'], ['workflow', 'violet', 'Automation plans'], ['message', 'amber', 'Blog drafts']];
  outs.forEach(([ic, tone, t], i) => {
    const y = 92 + i * 104;
    sfConnector([[d.mx + d.mw / 2 + 36, d.my - 70], [740, d.my - 70], [740, y + 34], [nx, y + 34]], { c: 'rgba(125,211,252,0.6)', dots: 1, glow: 'rgba(125,211,252,0.8)', dot: '#e0f2fe', t: 0.1 + i * 0.22 });
    sfNode(nx, y, 290, 68, ic, tone, t, null, { size: 19 });
  });
  sfNote(d.mx + d.mw - 10, d.my + 60, 790, 520, '~60% of my code generation', { align: 'left' });
  sfPill('Build log', 104, 40, 'white', { size: 15 });
  sfFrame('rgba(165,180,252,0.45)');
}

// ---- build log -> blueprint: emergency call -> AI -> job in ServiceTitan -> tech on the road
function blueprintServiceTitan() {
  sfBlueprint();
  const floor = 548;
  ctx.fillStyle = 'rgba(125,160,248,0.25)'; ctx.fillRect(0, floor, W, 2);
  sfNode(70, 150, 270, 78, 'alert', 'red', 'Emergency call', 'burst pipe, after hours', { size: 18 });
  sfConnector([[340, 189], [420, 189], [420, 230], [470, 230]], { c: 'rgba(125,211,252,0.6)', dots: 1, glow: 'rgba(125,211,252,0.8)', dot: '#e0f2fe', t: 0.2 });
  sfSpark(510, 230, 38);
  sfConnector([[548, 230], [640, 230]], { c: 'rgba(125,211,252,0.6)', dots: 1, glow: 'rgba(125,211,252,0.8)', dot: '#e0f2fe', t: 0.5 });
  const wx = 640, wy = 120, ww = 460, wh = 220;
  const inner = sfWindow(wx, wy, ww, wh, 'ServiceTitan');
  sfTile('checkCircle', inner.x + 24, inner.y + 26, 56, 'green');
  sfText('Job created', inner.x + 96, inner.y + 52, 22, SF.ink, { weight: 700 });
  sfText('customer, address, priority filled in', inner.x + 96, inner.y + 78, 15, SF.g500, { weight: 400 });
  sfSkel(inner.x + 24, inner.y + 116, 300, 9); sfSkel(inner.x + 24, inner.y + 136, 220, 9);
  sfVan(800, floor + 2, 0.9, { stripe: '#ef4444', label: 'On call' });
  sfNote(510, 280, 300, 420, 'job pushed through the API', { align: 'right' });
  sfNote(wx + 120, wy + wh, 680, 420, 'on-call tech gets an SMS', { align: 'right' });
  sfPill('Build log', 104, 40, 'white', { size: 15 });
  sfFrame('rgba(165,180,252,0.45)');
}

// ---- opinion -> editorial: warm paper, one oversized object, one person, room to breathe.
function editorialFrame() { sfFrame('#e4dccf'); }

// HVAC peak season: the thermometer is pinned, the phone won't stop
function editorialHvac() {
  sfEditorial({ disc: [700, 290, 230], discColor: '#fee2e2' });
  sfThermo(640, 70, 360, 0.92, { w: 74 });
  sfPhone(790, 300, 104, 190, { rot: 0.1, buzz: 'rgba(239,68,68,0.55)', screenBg: '#fef2f2', screen: (x, y, w, h) => { sfDot(x + w / 2, y + h * 0.36, w * 0.28, '#ef4444'); sfIcon('phone', x + w / 2, y + h * 0.36, w * 0.3, '#fff', { w: 2.4 }); sfSkel(x + w * 0.2, y + h * 0.66, w * 0.6, 7, '#fca5a5'); } });
  sfSpark(960, 250, 30);
  sfWorkerStand(300, 600, 1.25, { skin: 1, shirt: '#1e40af', pants: SF.b700, cap: '#ef4444', screen: '#fee2e2' });
  sfPill('Peak season', 104, 40, 'red', { dot: true, size: 15 });
  editorialFrame();
}
// building in public: the whole workshop, in a window anyone can look through
function editorialInPublic() {
  sfEditorial({ disc: [640, 300, 260], discColor: '#e1ebff' });
  const inner = sfWindow(420, 80, 620, 420, 'solvrlabs.com/blog');
  for (let i = 0; i < 3; i++) {
    const x = inner.x + 28 + i * 196, y = inner.y + 30;
    sfRR(x, y, 172, 96, 10); ctx.fillStyle = [SF.b100, '#dcfce7', '#f3e8ff'][i]; ctx.fill();
    sfIcon(['code', 'chart', 'zap'][i], x + 86, y + 48, 32, [SF.b600, '#16a34a', '#a855f7'][i], { w: 2 });
    sfSkel(x, y + 112, 150, 9, SF.g300); sfSkel(x, y + 130, 110, 9, SF.g200);
  }
  sfSpark(inner.x + inner.w / 2, inner.y + 268, 34);
  sfStandFacing(250, 600, 1.25, { skin: 0, hair: '#b45309', style: 'bun', shirt: '#0f766e', pants: SF.b700, farArm: '#115e59', screen: '#e1ebff' }, false);
  sfPill('Building in public', 104, 40, 'blue', { dot: true, size: 15 });
  editorialFrame();
}
// n8n over Zapier: the bill that changed his mind
function editorialAutomationBill() {
  sfEditorial({ disc: [690, 300, 240], discColor: '#dcfce7' });
  sfPriceTag(520, 100, 420, 170, -0.08, '$600/mo', { size: 72, color: '#9ca3af', strike: true });
  sfPriceTag(640, 300, 330, 140, 0.06, '$40/mo', { size: 66, color: '#15803d', edge: '#86efac' });
  sfSpark(1010, 420, 28);
  sfWorkerStand(260, 600, 1.25, { skin: 2, shirt: '#7c2d12', pants: SF.b700, cap: SF.b500, screen: '#dcfce7' });
  sfPill('One client\'s automation bill', 104, 40, 'green', { dot: true, size: 15 });
  editorialFrame();
}
// voice AI: the waveform is the object; latency and voice are solved, interruptions are not
function editorialVoice() {
  sfEditorial({ disc: [620, 300, 250], discColor: '#ede9fe' });
  sfWave(380, 300, 760, 300, 30, { color: (i, n) => (i > n * 0.7 ? '#d8b4fe' : i > n * 0.4 ? '#a78bfa' : '#7c3aed') });
  sfSpark(380 + 760 * 0.42, 300, 40);
  sfWorkerStand(200, 600, 1.25, { skin: 0, hair: '#111827', style: 'short', shirt: '#4c1d95', pants: SF.b700, farArm: '#3b0764', screen: '#ede9fe' });
  sfPill('Voice AI in 2026', 104, 40, 'violet', { dot: true, size: 15 });
  editorialFrame();
}
// what AI can't do (yet): the list it handles, and the call that still needs you
function editorialAiCant() {
  sfEditorial({ disc: [600, 300, 250], discColor: '#fef3c7' });
  const cx = 380, cy = 90, cw = 520, ch = 380;
  sfCard(cx, cy, cw, ch, { r: 20, lift: 1 });
  sfSpark(cx + cw - 20, cy + 18, 30);
  [['Answer the routine call', 'done'], ['Book the appointment', 'done'], ['Send the reminder', 'done'], ['Price a $15k backyard reno', 'human']].forEach(([t, s], i) => {
    const y = cy + 44 + i * 78;
    if (s === 'human') { sfRR(cx + 16, y - 12, cw - 32, 64, 14); ctx.fillStyle = '#fffbeb'; ctx.fill(); }
    sfCheckRow(cx + 32, y, cw - 64, t, s, { size: 21 });
  });
  sfWorkerStand(1000, 600, 1.25, { skin: 1, shirt: '#92400e', pants: SF.b700, cap: '#16a34a', screen: '#fef3c7' });
  sfPill('Still needs a human', 104, 40, 'amber', { dot: true, size: 15 });
  editorialFrame();
}
// answering services: $300/mo for a note that says "someone called"
function editorialAnsweringService() {
  sfEditorial({ disc: [560, 290, 240], discColor: '#fef9c3' });
  sfSticky(300, 90, 340, 300, -0.06, [['Someone called.', 34], ['Wants a call back.', 30], ['No address.', 26, '#a16207', 600], ['No job type.', 26, '#a16207', 600]]);
  sfPriceTag(500, 380, 250, 100, 0.1, '$300/mo', { size: 44, color: SF.b900 });
  sfSinkCabinet(930, 548, 180, 150, {});
  sfWorkerKneel(820, 548, 1.18, { skin: 2, reach: [96, -104], shirt: SF.b900, cap: '#0ea5e9', bg: '#efe9df' });
  sfPill('The message-taking model', 104, 40, 'amber', { dot: true, size: 15 });
  editorialFrame();
}
// small businesses and AI: the toolbox you already own, with the AI inside
function editorialToolbox() {
  sfEditorial({ disc: [620, 290, 250], discColor: '#e1ebff' });
  sfToolbox(440, 548, 380, 190, { color: SF.b600, dark: SF.b800 });
  sfSpark(630, 250, 36);
  [['calendar', 'green', 470, 150], ['message', 'violet', 740, 140], ['file', 'amber', 560, 80], ['dollar', 'blue', 680, 66]].forEach(([ic, tone, x, y]) => sfTile(ic, x, y, 60, tone, { ring: true }));
  sfWorkerStand(1000, 600, 1.25, { skin: 0, hair: '#0f172a', style: 'long', shirt: '#0e7490', pants: SF.b700, farArm: '#155e75', screen: '#e1ebff' });
  sfPill('30+ hours a month back', 104, 40, 'blue', { dot: true, size: 15 });
  editorialFrame();
}

// AI agents are booking contractors now: the next caller on the line is an AI, asking price, availability, and to book
function editorialAgentCaller() {
  sfEditorial({ disc: [560, 300, 255], discColor: '#e1ebff' });
  sfPhone(400, 70, 300, 440, { rot: -0.06, buzz: 'rgba(70,100,214,0.8)', screenBg: '#ffffff', screen: (x, y, w, h) => {
    ctx.fillStyle = SF.b50; ctx.fillRect(x, y, w, h * 0.46);
    sfText('Incoming call', x + w / 2, y + 44, 17, SF.g500, { weight: 500, align: 'center' });
    sfSpark(x + w / 2, y + 112, 38);
    sfText('AI assistant', x + w / 2, y + 186, 22, SF.ink, { weight: 700, align: 'center' });
    [['dollar', 'green', 'What does it cost?'], ['clock', 'amber', 'Open today?'], ['calendar', 'blue', 'Book the job']].forEach(([ic, tone, t], i) => {
      const ry = y + 222 + i * 60;
      sfRR(x + 18, ry, w - 36, 48, 12); ctx.fillStyle = SF.g50; ctx.fill(); ctx.strokeStyle = SF.g200; ctx.lineWidth = 1; ctx.stroke();
      sfTile(ic, x + 26, ry + 6, 36, tone);
      sfText(t, x + 74, ry + 31, 17, SF.g700, { weight: 600 });
    });
  } });
  sfLadder(1010, 548, 250, { color: '#d97706', back: '#b45309' });
  sfStandFacing(930, 600, 1.25, { skin: 1, shirt: '#be123c', pants: SF.b700, cap: '#facc15', farArm: '#9f1239', screen: '#e1ebff' }, true);
  sfPill('45% now use AI to find local businesses', 104, 40, 'blue', { dot: true, size: 15 });
  editorialFrame();
}
