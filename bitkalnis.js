// Bitkalnis: page logic (EN / LT)
import { t, eur, L, DL } from './i18n.js';
import { createSeq } from './seq.js';
import { SEQ } from './seq-data.js';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const TOUCH = document.documentElement.classList.contains('touch');
const pre = L === 'lt' ? '../' : '';
let tT; const toast = m => { const el = $('[data-toast]'); el.textContent = m; el.classList.add('on'); clearTimeout(tT); tT = setTimeout(() => el.classList.remove('on'), 2400); };
const T2 = (en, lt) => L === 'lt' ? lt : en;

/* ---------------- products ---------------- */
const P = [
  { id: 'liep', no: '01', type: 'mead', name: 'Liepžiedis', sub: T2('Linden blossom mead', 'Liepžiedžių midus'), abv: 12, vol: '0.5 l', price: 16, liquid: '#e7b443', wax: '#c8841f', bg: '#ecdcb6', sw: .78, body: .3,
    notes: T2('Linden flower, pear skin, a warm-evening sweetness.', 'Liepų žiedai, kriaušės žievelė, šilto vakaro saldumas.'), pair: T2('Blue cheese, apple pie', 'Pelėsinis sūris, obuolių pyragas'), shape: 'swing' },
  { id: 'grik', no: '02', type: 'mead', name: 'Grikių', sub: T2('Dark buckwheat mead', 'Tamsus grikių midus'), abv: 14, vol: '0.5 l', price: 19, liquid: '#7a3d12', wax: '#4a2a12', bg: '#e3cfae', sw: .62, body: .86,
    notes: T2('Malt, prune, cocoa and a long rye-bread finish.', 'Salyklas, džiovintos slyvos, kakava, ilgas ruginės duonos poskonis.'), pair: T2('Smoked meat, dark chocolate', 'Rūkyta mėsa, juodasis šokoladas'), shape: 'swing' },
  { id: 'kad', no: '03', type: 'mead', name: 'Kadagys', sub: T2('Dry mead with juniper & hops', 'Sausas midus su kadagiu ir apyniais'), abv: 11, vol: '0.5 l', price: 17, liquid: '#d9c06a', wax: '#55603a', bg: '#dfe0c4', sw: .15, body: .32,
    notes: T2('Juniper, lemon zest, a bitter hop snap. Crisp as a Riesling.', 'Kadagys, citrinos žievelė, kartokas apynių gaivumas.'), pair: T2('Trout, goat cheese, oysters', 'Upėtakis, ožkų sūris, austrės'), shape: 'swing', tag: 'new' },
  { id: 'put', no: '04', type: 'spark', name: 'Putojantis', sub: T2('Sparkling dry mead', 'Putojantis sausas midus'), abv: 9.5, vol: '0.75 l', price: 24, liquid: '#efd27a', wax: '#d9b25a', bg: '#efe2c0', sw: .25, body: .18,
    notes: T2('Fine bubbles, white flowers, green apple. Second ferment in the bottle.', 'Smulkūs burbuliukai, balti žiedai, žalias obuolys. Antroji fermentacija butelyje.'), pair: T2('Celebrations, cold starters', 'Šventės, šalti užkandžiai'), shape: 'spark' },
  { id: 'rez', no: '05', type: 'mead', name: T2('Oak Reserve', 'Ąžuolo rezervas'), sub: T2('Three winters in Lithuanian oak', 'Treji metai lietuviško ąžuolo statinėje'), abv: 16, vol: '0.5 l', price: 34, liquid: '#a8561a', wax: '#20160d', bg: '#d8c3a0', sw: .5, body: .95,
    notes: T2('Vanilla, toasted oak, dried apricot, a whisper of smoke.', 'Vanilė, skrudintas ąžuolas, džiovinti abrikosai, lengvas dūmas.'), pair: T2('After dinner, a cigar, a long talk', 'Po vakarienės, ilgam pokalbiui'), shape: 'squat', tag: 'limited' },
  { id: 'sid', no: '06', type: 'cider', name: T2('Honey Cider', 'Medaus sidras'), sub: T2('Orchard apples, linden honey · 4 × 0.33 l', 'Sodo obuoliai ir liepų medus · 4 × 0,33 l'), abv: 6, vol: '4 × 0.33 l', price: 12, liquid: '#f0c45a', wax: '#9c5a17', bg: '#ecdfc0', sw: .38, body: .12,
    notes: T2('Bright apple, honey on the finish, gently sparkling.', 'Ryškus obuolys, medaus poskonis, lengvai putojantis.'), pair: T2('Pork, picnics, a sauna evening', 'Kiauliena, iškylos, pirties vakaras'), shape: 'stubby' },
  { id: 'hl', no: 'M1', type: 'honey', name: T2('Linden honey', 'Liepų medus'), sub: T2('Raw, cold-drained · 450 g', 'Žalias, nekaitintas · 450 g'), price: 9, liquid: '#e9b947', wax: '#c8841f', bg: '#f0e3c4', shape: 'jar', nonalc: true },
  { id: 'hb', no: 'M2', type: 'honey', name: T2('Buckwheat honey', 'Grikių medus'), sub: T2('Dark and malty · 450 g', 'Tamsus, aitroko skonio · 450 g'), price: 10, liquid: '#6e3510', wax: '#4a2a12', bg: '#e6d4b4', shape: 'jar', nonalc: true },
  { id: 'hh', no: 'M3', type: 'honey', name: T2('Heather honey', 'Viržių medus'), sub: T2('Late season, thick · 450 g', 'Vėlyvas, tirštas · 450 g'), price: 11, liquid: '#b5651d', wax: '#7a4a6a', bg: '#e9d9c0', shape: 'jar', nonalc: true }
];
if (L === 'lt') P.forEach(p => { if (p.vol) p.vol = p.vol.replace(/(\d)\.(\d)/g, '$1,$2'); }); // LT decimal comma
const byId = id => P.find(p => p.id === id);

// a hand-drawn looking bottle: glass, liquid, beeswax-dipped neck with drips, a paper label with the bee and the batch
function bottle(p, h = 320) {
  const id = 'g' + p.id + Math.random().toString(36).slice(2, 6);
  const lab = `<g font-family="Gloock, serif" text-anchor="middle">`;
  const bee = (x, y, s) => `<use href="#bee" x="${x - 9 * s}" y="${y - 9 * s}" width="${18 * s}" height="${18 * s}" style="color:#5a3a16"/>`;
  if (p.shape === 'jar') return `<svg viewBox="0 0 160 200" height="${h * .62}" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".2" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>
    <rect x="28" y="22" width="104" height="26" rx="5" fill="${p.wax}"/><path d="M28 40h104v6c-6 7-10 4-14 10-4-6-9-2-13-8-6 8-11 4-16 9-5-6-10-3-15-9-5 7-10 4-15 8-5-6-9-1-13-7-5 5-9 2-12 7Z" fill="${p.wax}"/>
    <rect x="22" y="48" width="116" height="140" rx="16" fill="${p.liquid}"/><rect x="22" y="48" width="116" height="140" rx="16" fill="url(#${id})"/>
    <rect x="36" y="88" width="88" height="66" rx="3" fill="#f6ecd4"/><rect x="40" y="92" width="80" height="58" fill="none" stroke="#5a3a16" stroke-width=".8"/>
    ${bee(80, 106, .8)}${lab}<text x="80" y="131" font-size="13" fill="#20160d">${p.name.split(' ')[0]}</text><text x="80" y="145" font-family="JetBrains Mono, monospace" font-size="7" fill="#5a3a16">BITKALNIS · ${p.no}</text></g></svg>`;
  const W = 120, sh = { swing: [30, 92, 300], spark: [28, 104, 320], squat: [44, 70, 270], stubby: [36, 60, 200] }[p.shape];
  const [nw, neckH, H] = sh, bw = p.shape === 'squat' ? 108 : p.shape === 'stubby' ? 74 : 86, x0 = (W + 40 - bw) / 2, cx = (W + 40) / 2, top = 330 - H, sh0 = top + neckH;
  const body = `M${cx - nw / 2} ${top + 10} V${sh0} C${cx - nw / 2} ${sh0 + 26} ${x0} ${sh0 + 22} ${x0} ${sh0 + 54} V${318} q0 12 12 12 H${x0 + bw - 12} q12 0 12 -12 V${sh0 + 54} C${x0 + bw} ${sh0 + 22} ${cx + nw / 2} ${sh0 + 26} ${cx + nw / 2} ${sh0} V${top + 10} Z`;
  const fill = p.shape === 'spark' ? sh0 + 30 : sh0 + 46, wy = top + 54;
  const drips = [0, 1, 2, 3, 4].map(k => { const x = cx - nw / 2 - 3 + k * (nw + 6) / 4, l = 8 + ((k * 37) % 17); return `M${x - 3} ${wy} q0 ${l} 3 ${l + 3} q3 -3 3 -${l + 3}`; }).join(' ');
  const swing = p.shape === 'swing' || p.shape === 'stubby' ? `<path d="M${cx - nw / 2 - 2} ${top + 4} c-10 10 -10 26 -4 40" fill="none" stroke="#8d8a82" stroke-width="2.4"/><rect x="${cx - nw / 2 + 2}" y="${top - 12}" width="${nw - 4}" height="16" rx="6" fill="#efe6d6" stroke="#bcae97"/>` : '';
  const ly = p.shape === 'stubby' ? sh0 + 64 : sh0 + 74, lh = p.shape === 'stubby' ? 64 : 96, lw = bw - 14;
  return `<svg viewBox="0 0 160 340" height="${h}" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".14" stop-color="#fff" stop-opacity=".45"/><stop offset=".22" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity=".0"/><stop offset=".93" stop-color="#000" stop-opacity=".22"/></linearGradient>
    <clipPath id="c${id}"><path d="${body}"/></clipPath></defs>
    <ellipse cx="${cx}" cy="332" rx="${bw * .62}" ry="6" fill="#000" opacity=".16"/>
    <path d="${body}" fill="#2e2a1f" opacity=".2"/>
    <g clip-path="url(#c${id})"><rect x="0" y="${fill}" width="160" height="340" fill="${p.liquid}"/><rect x="0" y="${fill}" width="160" height="5" fill="#fff" opacity=".25"/></g>
    <path d="${body}" fill="url(#${id})" stroke="rgba(32,22,13,.35)" stroke-width="1"/>
    ${swing}
    <path d="M${cx - nw / 2 - 3} ${top - (p.shape === 'spark' ? 4 : 0)} h${nw + 6} V${wy} H${cx - nw / 2 - 3} Z" fill="${p.wax}"/><path d="${drips}" fill="${p.wax}"/>
    <text x="${cx}" y="${top + 34}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="7.5" fill="rgba(255,255,255,.75)">${p.no}</text>
    <rect x="${x0 + 7}" y="${ly}" width="${lw}" height="${lh}" fill="#f6ecd4"/><rect x="${x0 + 10}" y="${ly + 3}" width="${lw - 6}" height="${lh - 6}" fill="none" stroke="#5a3a16" stroke-width=".7"/>
    ${bee(cx, ly + 17, .85)}${lab}<text x="${cx}" y="${ly + 42}" font-size="${p.name.length > 11 ? 11 : 14}" fill="#20160d">${p.name}</text>
    <text x="${cx}" y="${ly + lh - 12}" font-family="JetBrains Mono, monospace" font-size="6.5" fill="#5a3a16">${p.abv}% · ${p.vol.replace('4 × ', '')}</text></g></svg>`;
}

/* ---------------- age gate ---------------- */
const age = $('[data-age]');
if (!localStorage.getItem('bk-age')) age.hidden = false;
$('[data-age-yes]').addEventListener('click', () => { localStorage.setItem('bk-age', '1'); age.hidden = true; });
$('[data-age-no]').addEventListener('click', () => { age.hidden = true; filter('honey'); });

/* ---------------- nav ---------------- */
const nav = $('[data-nav]'), mb = $('[data-menu]');
mb.addEventListener('click', () => { const o = !nav.classList.contains('open'); nav.classList.toggle('open', o); mb.setAttribute('aria-expanded', o); mb.textContent = o ? mb.dataset.close : mb.dataset.open; });
$$('[data-sheet] a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); mb.setAttribute('aria-expanded', false); mb.textContent = mb.dataset.open; }));
const flightEl = $('[data-flight]');
new IntersectionObserver(([e]) => { if (e.isIntersecting || e.boundingClientRect.top < 0) nav.classList.add('sc'); else nav.classList.remove('sc'); }, { rootMargin: '0px 0px -100% 0px' }).observe($('.facts'));

/* ---------------- the flight ---------------- */
const chs = $$('[data-ch]'), rail = $$('[data-rail] li'), cue = $('[data-cue]');
let trackTop = 0, trackLen = 1, vh = innerHeight;
const measure = () => { const r = flightEl.getBoundingClientRect(); trackTop = r.top + scrollY; vh = innerHeight; trackLen = Math.max(1, flightEl.offsetHeight - vh); };
measure(); let lw = innerWidth; addEventListener('resize', () => { if (innerWidth !== lw) { lw = innerWidth; measure(); } });
new ResizeObserver(measure).observe(document.body);
let curCh = 0; rail.forEach((r, i) => { r.hidden = i >= SEQ.chapters.length; });
function chapter(fr) { // which chapter for frame fr
  let k = 0; SEQ.chapters.forEach((c, i) => { if (fr >= c) k = i; }); return k; }
function setCh(fr) {
  const k = chapter(fr), c0 = SEQ.chapters[k], c1 = SEQ.chapters[k + 1] ?? SEQ.count + 30;
  const show = fr < c1 - (c1 - c0) * .28 || k === SEQ.chapters.length - 1; const want = show ? k : -1;
  if (want !== curCh) { curCh = want; chs.forEach((c, i) => c.classList.toggle('on', i === want)); }
  rail.forEach((r, i) => r.classList.toggle('on', i === k));
  cue.classList.toggle('off', fr > 6);
}
let seq = null;
const canvas = $('[data-gl]');
try {
  seq = createSeq({ canvas, count: SEQ.count, src: i => `${pre}seq/${TOUCH ? 'm' : 'd'}/${String(i).padStart(3, '0')}.webp`, onFrame: setCh, focusX: () => .5 });
  seq.first.then(() => flightEl.classList.add('gl'));
} catch { seq = null; }
const onScroll = () => { const p = Math.min(1, Math.max(0, (scrollY - trackTop) / trackLen)); if (seq) seq.set(p * (SEQ.count - 1)); else setCh(p * (SEQ.count - 1)); };
addEventListener('scroll', onScroll, { passive: true }); onScroll();
// load the rest of the frames while the user is not mid-swipe
let touching = 0, lastScroll = 0;
addEventListener('touchstart', () => touching++, { passive: true, capture: true });
addEventListener('touchend', () => { touching = Math.max(0, touching - 1); lastScroll = performance.now(); }, { passive: true, capture: true });
addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });
const gate = () => new Promise(res => { const chk = () => { if (touching && scrollY > trackTop + trackLen) setTimeout(chk, 150); else res(); }; chk(); });
addEventListener('load', () => seq && seq.loadAll(gate, TOUCH ? 3 : 5), { once: true });

/* ---------------- shop ---------------- */
const grid = $('[data-grid]'); let curF = 'all';
grid.innerHTML = P.map(p => `<article class="pc" data-type="${p.type}" data-id="${p.id}" style="--bg:${p.bg}">
  <div class="pc__art"><span class="pc__no mono">Nr. ${p.no}</span>${p.tag ? `<span class="pc__tag">${t(p.tag)}</span>` : ''}${bottle(p, 300)}</div>
  <div class="pc__b"><p class="mono pc__meta">${t('t_' + p.type)}${p.abv ? ' · ' + t('abv', { a: String(p.abv).replace('.', L === 'lt' ? ',' : '.'), v: p.vol }) : ''}</p><h3>${p.name}</h3><p>${p.sub}</p>${p.notes ? `<p class="pc__notes">${p.notes}</p>` : ''}
  <div class="pc__foot"><span class="pc__price">${eur(p.price)}</span><button class="btn btn--sm pc__add" type="button" data-add="${p.id}">${t('add')}</button></div></div></article>`).join('');
function filter(f) { curF = f; $$('[data-chips] button').forEach(b => b.setAttribute('aria-pressed', b.dataset.f === f)); $$('.pc', grid).forEach(c => { c.hidden = f !== 'all' && c.dataset.type !== f; }); grid.scrollLeft = 0; }
$('[data-chips]').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (b) filter(b.dataset.f); });
grid.addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (b) { add(b.dataset.add); } });
$('[data-jump-honey]')?.addEventListener('click', () => filter('honey'));

/* flavour map */
const plot = $('[data-fplot]'), fcard = $('[data-fcard]');
const meads = P.filter(p => p.sw != null);
plot.insertAdjacentHTML('beforeend', meads.map(p => `<button type="button" class="dot" data-dot="${p.id}" style="left:${8 + p.sw * 84}%;top:${8 + p.body * 84}%;--c:${p.liquid}" aria-pressed="false"><i></i><span>${p.name}</span></button>`).join(''));
function showDot(id) { const p = byId(id); $$('[data-dot]', plot).forEach(d => d.setAttribute('aria-pressed', d.dataset.dot === id));
  fcard.innerHTML = `<b>${p.name}</b><p class="small">${p.notes}</p><p class="small muted">${t('pair')}: ${p.pair}</p><div class="row" style="margin-top:12px"><span class="pc__price">${eur(p.price)}</span><button class="btn btn--sm" type="button" data-add="${p.id}">${t('add')}</button></div>`; }
plot.addEventListener('click', e => { const d = e.target.closest('[data-dot]'); if (d) showDot(d.dataset.dot); });
fcard.addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (b) add(b.dataset.add); });
const LIKE = { white: ['kad', 'put'], beer: ['sid', 'kad'], dessert: ['liep', 'grik'], whisky: ['rez'] };
$('[data-like]').addEventListener('click', e => { const b = e.target.closest('[data-like]'); if (!b || !b.dataset.like || b === e.currentTarget) return;
  $$('[data-like] button').forEach(x => x.setAttribute('aria-pressed', x === b)); const ids = LIKE[b.dataset.like];
  $$('[data-dot]', plot).forEach(d => d.classList.toggle('like', ids.includes(d.dataset.dot))); showDot(ids[0]); fcard.insertAdjacentHTML('afterbegin', `<p class="mono" style="color:var(--amber);margin-bottom:8px">${t('like_' + b.dataset.like)}</p>`); });
showDot('kad');

/* ---------------- bag ---------------- */
let bag = []; try { bag = JSON.parse(localStorage.getItem('bk-bag') || '[]'); } catch { bag = []; }
const save = () => localStorage.setItem('bk-bag', JSON.stringify(bag));
function add(id, extra) {
  if (extra) bag.push({ id: 'box' + Date.now(), qty: 1, box: extra });
  else { const l = bag.find(x => x.id === id); if (l) l.qty++; else bag.push({ id, qty: 1 }); }
  save(); renderBag(); toast(extra ? t('g_added') : t('added'));
  const c = $('[data-bag-count]'); c.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.45)' }, { transform: 'scale(1)' }], { duration: 380 });
}
const lineInfo = l => l.box ? { name: t('box') + ' · ' + l.box.label, price: l.box.price, c: '#9c5a17', sub: l.box.items.map(i => byId(i).name).join(', ') } : (p => ({ name: p.name, price: p.price, c: p.liquid, sub: p.sub }))(byId(l.id));
function renderBag() {
  const n = bag.reduce((a, l) => a + l.qty, 0), tot = bag.reduce((a, l) => a + lineInfo(l).price * l.qty, 0);
  const c = $('[data-bag-count]'); c.textContent = n || ''; c.toggleAttribute('data-zero', !n);
  $('[data-bag-list]').innerHTML = bag.length ? bag.map((l, i) => { const o = lineInfo(l); return `<li><span class="sw" style="--c:${o.c}"></span><div><b>${o.name}</b><small>${o.sub}</small><div class="qty"><button type="button" data-q="${i}" data-d="-1" aria-label="−">−</button><span>${l.qty}</span><button type="button" data-q="${i}" data-d="1" aria-label="+">+</button></div></div><b>${eur(o.price * l.qty)}</b></li>`; }).join('') : `<li class="bag__empty">${t('bag_empty')}</li>`;
  $('[data-bag-tot]').textContent = eur(tot);
  const left = 60 - tot; $('[data-ship]').innerHTML = `${left > 0 ? t('ship_left', { n: eur(left) }) : t('ship_free')}<br><span class="muted">${t('ship_eu')}</span><i style="--w:${Math.min(100, tot / 60 * 100)}%"></i>`;
}
$('[data-bag-list]').addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (!b) return; const l = bag[+b.dataset.q]; l.qty += +b.dataset.d; if (l.qty <= 0) bag.splice(+b.dataset.q, 1); save(); renderBag(); });
const bagEl = $('[data-bag]'); let lastFocus = null;
function openBag() { lastFocus = document.activeElement; bagEl.hidden = false; requestAnimationFrame(() => bagEl.classList.add('on')); document.body.style.overflow = 'hidden'; $('[data-bag-close]').focus(); }
function closeBag() { bagEl.classList.remove('on'); document.body.style.overflow = ''; setTimeout(() => { bagEl.hidden = true; }, 260); lastFocus?.focus?.(); }
$('[data-bag-open]').addEventListener('click', openBag); $('[data-bag-close]').addEventListener('click', closeBag);
bagEl.addEventListener('click', e => { if (e.target === bagEl) closeBag(); });
$('[data-checkout]').addEventListener('click', () => { const note = $('[data-bag-note]'); if (!bag.length) return; if (!$('[data-bag-age]').checked && bag.some(l => l.box || !byId(l.id).nonalc)) { note.textContent = t('age_need'); note.style.color = '#a3361c'; return; } note.style.color = ''; note.textContent = t('checkout_note'); });
renderBag();

/* ---------------- tastings ---------------- */
const EXP = [
  { id: 'e1', price: 26, dur: 75, img: 'candle', days: [3, 4, 5, 6, 0], times: ['12:00', '15:00', '17:30'], cap: 16 },
  { id: 'e2', price: 42, dur: 120, img: 'cellar2', days: [5, 6, 0], times: ['14:00', '18:00'], cap: 12 },
  { id: 'e3', price: 48, dur: 120, img: 'hiver', days: [6, 0], times: ['09:30'], cap: 8, season: [4, 8] }
];
let bx = EXP[0], bDate = null, bTime = null, guests = 2, drivers = 0, calM = 0;
$('[data-exps]').innerHTML = EXP.map((e, i) => `<button type="button" class="exp" role="radio" aria-checked="${i === 0}" data-exp="${e.id}"><img src="${pre}img/${e.img}-640.webp" alt="" loading="lazy" decoding="async" width="120" height="120"><span><b>${t(e.id)}</b><small>${t(e.id + 'd')}</small><span class="mono">${t(e.id + 'm')}</span></span></button>`).join('');
const today0 = new Date(); today0.setHours(0, 0, 0, 0);
const seatsLeft = (e, d, tm) => { let h = 0; const s = e.id + d.toISOString().slice(0, 10) + tm; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; const used = h % (e.cap + 4); return Math.max(0, e.cap - used); };
const available = (e, d) => d > today0 && e.days.includes(d.getDay()) && (!e.season || (d.getMonth() >= e.season[0] && d.getMonth() <= e.season[1]));
function renderCal() {
  const base = new Date(today0.getFullYear(), today0.getMonth() + calM, 1), y = base.getFullYear(), m = base.getMonth(), days = new Date(y, m + 1, 0).getDate(), off = (base.getDay() + 6) % 7;
  let h = `<div class="cal__m"><button type="button" data-cm="-1" ${calM <= 0 ? 'disabled' : ''} aria-label="‹">‹</button><b>${base.toLocaleDateString(DL, { month: 'long', year: 'numeric' })}</b><button type="button" data-cm="1" ${calM >= 4 ? 'disabled' : ''} aria-label="›">›</button></div>`;
  h += t('wd').map(w => `<span class="cal__wd">${w}</span>`).join('') + '<span></span>'.repeat(off);
  for (let d = 1; d <= days; d++) { const dt = new Date(y, m, d), ok = available(bx, dt), on = bDate && +bDate === +dt;
    h += `<button type="button" class="cal__d${ok ? ' has' : ''}" data-day="${+dt}" ${ok ? '' : 'disabled'} aria-pressed="${!!on}">${d}</button>`; }
  $('[data-cal]').innerHTML = h;
}
function renderSlots() {
  const el = $('[data-slots]'); if (!bDate) { el.innerHTML = `<p class="muted small">${t('pick_date')}</p>`; return; }
  el.innerHTML = bx.times.map(tm => { const n = seatsLeft(bx, bDate, tm); return `<button type="button" class="slot" data-tm="${tm}" ${n ? '' : 'disabled'} aria-pressed="${bTime === tm}">${tm}<small>${n ? t('seats', { n }) : t('full')}</small></button>`; }).join('');
}
function bSum() {
  const pay = (guests - drivers) * bx.price + drivers * bx.price / 2; $('[data-btot]').textContent = eur(pay);
  $('[data-bsum]').textContent = bDate && bTime ? t('sum', { g: guests, d: drivers ? t('drv', { n: drivers }) : '', e: t(bx.id), when: bDate.toLocaleDateString(DL, { weekday: 'short', day: 'numeric', month: 'short' }) + ', ' + bTime }) : t('pick_slot');
}
$('[data-exps]').addEventListener('click', e => { const b = e.target.closest('[data-exp]'); if (!b) return; bx = EXP.find(x => x.id === b.dataset.exp); $$('[data-exp]').forEach(x => x.setAttribute('aria-checked', x === b));
  if (bDate && !available(bx, bDate)) { bDate = null; } bTime = null; if (bx.season && !bDate) { const first = [...Array(200)].map((_, i) => new Date(+today0 + (i + 1) * 864e5)).find(d => available(bx, d)); calM = first ? (first.getFullYear() - today0.getFullYear()) * 12 + first.getMonth() - today0.getMonth() : 0; calM = Math.min(4, Math.max(0, calM)); }
  renderCal(); renderSlots(); bSum(); });
$('[data-cal]').addEventListener('click', e => { const c = e.target.closest('[data-cm]'); if (c) { calM += +c.dataset.cm; renderCal(); return; } const d = e.target.closest('[data-day]'); if (!d || d.disabled) return; bDate = new Date(+d.dataset.day); bTime = null; renderCal(); renderSlots(); bSum(); });
$('[data-slots]').addEventListener('click', e => { const s = e.target.closest('[data-tm]'); if (!s || s.disabled) return; bTime = s.dataset.tm; renderSlots(); bSum(); });
const stepper = (sel, get, set, min, max) => $(sel).addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (!b) return; set(Math.min(max(), Math.max(min, get() + +b.dataset.d))); });
stepper('[data-guests]', () => guests, v => { guests = v; drivers = Math.min(drivers, guests); $('[data-gout]').textContent = guests; $('[data-dout]').textContent = drivers; bSum(); }, 1, () => 12);
stepper('[data-drivers]', () => drivers, v => { drivers = v; $('[data-dout]').textContent = drivers; bSum(); }, 0, () => guests);
renderCal(); renderSlots(); bSum();
const tk = $('[data-ticket]');
$('[data-bform]').addEventListener('submit', e => { e.preventDefault(); const f = e.currentTarget, err = $('[data-berr]'), nm = f.elements.namedItem('nm').value.trim(), em = f.elements.namedItem('em').value.trim();
  if (!bDate || !bTime) return err.textContent = t('err_slot'); if (!nm) return err.textContent = t('err_name'); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return err.textContent = t('err_mail');
  const left = seatsLeft(bx, bDate, bTime); if (guests > left) return err.textContent = t('err_seats', { n: left }); err.textContent = '';
  const code = 'BK-' + Math.random().toString(36).slice(2, 7).toUpperCase(), [hh, mm] = bTime.split(':').map(Number), st = new Date(bDate); st.setHours(hh, mm);
  const en = new Date(+st + bx.dur * 6e4), z = d => d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Bitkalnis//EN\r\nBEGIN:VEVENT\r\nUID:${code}@bitkalnis\r\nDTSTAMP:${z(new Date())}\r\nDTSTART:${z(st)}\r\nDTEND:${z(en)}\r\nSUMMARY:Bitkalnis · ${t(bx.id)}\r\nLOCATION:Bitkalnio g. 3, Molėtų r.\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  $('[data-tk-code]').textContent = code; $('[data-tk-title]').textContent = t(bx.id);
  $('[data-tk-when]').textContent = st.toLocaleDateString(DL, { weekday: 'long', day: 'numeric', month: 'long' }) + ', ' + bTime + ' · ' + $('[data-bsum]').textContent.split(' · ')[0] + ' · ' + $('[data-btot]').textContent;
  $('[data-tk-note]').textContent = t('tk_note', { m: em }); $('[data-tk-ics]').href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  tk.hidden = false; $('[data-ticket-close]').focus(); });
$$('[data-ticket-close]').forEach(b => b.addEventListener('click', () => { tk.hidden = true; }));

/* ---------------- gift box ---------------- */
const CASE = { card2: { n: 2, price: 6, k: 'kraft' }, card3: { n: 3, price: 8, k: 'kraft' }, oak3: { n: 3, price: 22, k: 'crate' } };
let gcase = 'card2', gsel = [];
const gopts = P.filter(p => !p.nonalc && p.id !== 'sid');
$('[data-gpick]').innerHTML = gopts.map(p => `<button type="button" class="gp" data-gp="${p.id}" aria-pressed="false"><i style="--c:${p.liquid}"></i><span><b>${p.name}</b><small>${eur(p.price)}</small></span></button>`).join('');
function gRender() {
  const c = CASE[gcase]; gsel = gsel.slice(0, c.n);
  $$('[data-gp]').forEach(b => { const on = gsel.includes(b.dataset.gp); b.setAttribute('aria-pressed', on); b.disabled = !on && gsel.length >= c.n; });
  $('[data-gcount]').textContent = t('g_pick', { n: gsel.length, m: c.n });
  const burn = $('[data-gburn]'); burn.disabled = gcase !== 'oak3'; if (burn.disabled) burn.checked = false;
  const tot = c.price + gsel.reduce((a, id) => a + byId(id).price, 0) + (burn.checked ? 8 : 0); $('[data-gtot]').textContent = eur(tot);
  const msg = $('[data-gmsg]').value; $('[data-gleft]').textContent = 90 - msg.length;
  // the box drawn from above-front: case, hay, the chosen bottles, the card
  const crate = gcase === 'oak3', slots = c.n, bw = 150;
  const bottles = Array.from({ length: slots }, (_, i) => { const p = gsel[i] ? byId(gsel[i]) : null, x = 250 - (slots - 1) * bw / 2 + i * bw;
    return p ? `<g transform="translate(${x - 52} 70)">${bottle(p, 260).replace('<svg', '<svg width="104"')}</g>` : `<g transform="translate(${x} 200)"><rect x="-34" y="-110" width="68" height="200" rx="12" fill="none" stroke="rgba(246,234,208,.35)" stroke-dasharray="6 6"/><text y="0" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="rgba(246,234,208,.5)">${i + 1}</text></g>`; }).join('');
  const caseFront = crate ? `<rect x="40" y="300" width="420" height="96" fill="#c89a62"/>${[0, 1, 2].map(k => `<rect x="40" y="${300 + k * 32}" width="420" height="30" fill="${['#c99d66', '#bf9058', '#c5975f'][k]}"/><path d="M40 ${330 + k * 32}h420" stroke="#8e6435" stroke-width="2"/>`).join('')}${burn.checked ? `<text x="250" y="356" text-anchor="middle" font-family="Gloock, serif" font-size="30" fill="#4a2a10" opacity=".8">${(msg.split(/[,.!\n]/)[0] || 'Bitkalnis').slice(0, 22)}</text>` : '<use href="#bee" x="232" y="330" width="36" height="36" style="color:#6b4420"/>'}`
    : `<rect x="40" y="300" width="420" height="96" fill="#a77c4c"/><rect x="40" y="300" width="420" height="10" fill="#8f6538"/><use href="#bee" x="232" y="330" width="36" height="36" style="color:#4a2e14"/><text x="250" y="384" text-anchor="middle" font-family="JetBrains Mono" font-size="11" fill="#4a2e14">BITKALNIS · ${new Date().getFullYear()}</text>`;
  $('[data-gview]').innerHTML = `<svg viewBox="0 0 500 400" role="img" aria-label="${t('box')}"><rect width="500" height="400" fill="#2b1d10"/>
    <path d="M40 300 L80 250 H420 L460 300 Z" fill="${crate ? '#8e6435' : '#6f4f2c'}"/>
    ${Array.from({ length: 40 }, (_, k) => `<path d="M${60 + (k * 37) % 380} ${262 + (k * 13) % 34} q${8 - (k % 5) * 4} -14 ${18 - (k % 7) * 5} -${6 + (k % 4) * 3}" stroke="${['#d8b56a', '#c49a4c', '#e6c77f'][k % 3]}" stroke-width="2" fill="none"/>`).join('')}
    ${bottles}${caseFront}
    ${msg ? `<g transform="rotate(-6 390 120)"><rect x="330" y="60" width="140" height="92" fill="#f6ecd4"/><text x="342" y="84" font-family="Gloock, serif" font-size="13" fill="#20160d">${t('card')}</text>${msg.match(/.{1,22}(\s|$)/g)?.slice(0, 4).map((ln, i) => `<text x="342" y="${104 + i * 13}" font-family="Hanken Grotesk, sans-serif" font-size="10.5" fill="#3a2a18">${ln.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`).join('') || ''}</g>` : ''}</svg>`;
  return tot;
}
$('[data-gcase]').addEventListener('change', e => { gcase = e.target.value; gRender(); });
$('[data-gpick]').addEventListener('click', e => { const b = e.target.closest('[data-gp]'); if (!b || b.disabled) return; const id = b.dataset.gp; gsel = gsel.includes(id) ? gsel.filter(x => x !== id) : [...gsel, id]; $('[data-gerr]').textContent = ''; gRender(); });
$('[data-gmsg]').addEventListener('input', gRender); $('[data-gburn]').addEventListener('change', gRender);
$('[data-gadd]').addEventListener('click', () => { const c = CASE[gcase], err = $('[data-gerr]'); if (gsel.length < c.n) return err.textContent = t('g_need', { m: c.n });
  const price = gRender(); add(null, { items: [...gsel], label: t(c.k), price, msg: $('[data-gmsg]').value }); gsel = []; $('[data-gmsg]').value = ''; gRender(); });
gRender();

/* ---------------- open now ---------------- */
(() => {
  const H = { 0: [11, 17], 3: [12, 19], 4: [12, 19], 5: [11, 21], 6: [11, 21] };
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Vilnius' })), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60, el = $('[data-open-now]');
  const rows = $$('.hours tr'), rowOf = { 1: 0, 2: 0, 3: 1, 4: 1, 5: 2, 6: 2, 0: 3 }; rows[rowOf[d]]?.classList.add('today');
  if (H[d] && h >= H[d][0] && h < H[d][1]) { el.textContent = t('open_now', { t: H[d][1] + ':00' }); el.style.setProperty('--c', '#4f8a3a'); return; }
  for (let k = 0; k < 8; k++) { const dd = (d + k) % 7; if (H[dd] && (k > 0 || h < H[dd][0])) { el.textContent = t('opens', { d: k === 0 ? t('today') : k === 1 ? t('tomorrow') : t('days')[dd], t: H[dd][0] + ':00' }); el.style.setProperty('--c', '#c8841f'); return; } }
})();

/* ---------------- lightbox ---------------- */
const lb = $('[data-lb]'), lbT = $('[data-lb-track]');
const lbSet = () => { const i = Math.round(lbT.scrollLeft / lbT.clientWidth); $('[data-lb-n]').textContent = `${i + 1} / ${lbT.children.length}`; };
lbT.addEventListener('scroll', () => requestAnimationFrame(lbSet), { passive: true });
$$('[data-lb-i]').forEach(b => b.addEventListener('click', () => { $$('img[data-src]', lbT).forEach(im => { im.src = im.dataset.src; im.removeAttribute('data-src'); }); lb.hidden = false; document.body.style.overflow = 'hidden'; requestAnimationFrame(() => { lbT.scrollLeft = +b.dataset.lbI * lbT.clientWidth; lbSet(); }); }));
const lbClose = () => { lb.hidden = true; document.body.style.overflow = ''; };
$('[data-lb-close]').addEventListener('click', lbClose);
addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (!lb.hidden) lbClose(); if (!bagEl.hidden) closeBag(); if (!tk.hidden) tk.hidden = true; });
