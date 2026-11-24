// Bitkalnis: scroll-scrubbed flight made of video frames (like a drone shot you steer with the scroll).
// Frames load sparse-first (every 8th, then 4th, 2nd, all), decode off the main thread, and the canvas
// draws the nearest loaded frame blended with the next one, only while the position is still moving.

export function createSeq({ canvas, count, src, onFrame, focusX = () => .5 }) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const frames = new Array(count).fill(null);
  let W = 0, H = 0, target = 0, cur = 0, last = 0, running = false, vis = true, drawn = -1;

  function nearest(i) { // closest loaded frame at or before i, else after
    for (let d = 0; d < count; d++) { if (frames[i - d]) return i - d; if (frames[i + d]) return i + d; } return -1; }
  function blit(img, a) {
    const iw = img.width, ih = img.height, s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s;
    const fx = focusX(cur), dx = Math.min(0, Math.max(W - dw, W / 2 - dw * fx)), dy = (H - dh) / 2;
    ctx.globalAlpha = a; ctx.drawImage(img, dx, dy, dw, dh); }
  function draw() {
    if (!W) return; const i = Math.floor(cur), f = cur - i, a = nearest(i); if (a < 0) return;
    const key = a * 1000 + Math.round(f * 8); if (key === drawn) return; drawn = key;
    blit(frames[a], 1);
    const b = i + 1 < count && frames[i + 1] && a === i ? i + 1 : -1;
    if (b > 0 && f > .12) blit(frames[b], Math.min(1, f));
    ctx.globalAlpha = 1; onFrame && onFrame(cur);
  }
  function loop(t) {
    const dt = Math.min(.05, (t - last) / 1000 || .016); last = t;
    cur += (target - cur) * (1 - Math.exp(-dt * 9)); if (Math.abs(target - cur) < .01) cur = target;
    draw(); if (cur !== target) requestAnimationFrame(loop); else running = false;
  }
  function kick() { if (!running && vis) { running = true; last = performance.now(); requestAnimationFrame(loop); } }
  function resize() {
    const r = canvas.getBoundingClientRect(); if (!r.width) return;
    const dpr = Math.min(devicePixelRatio || 1, 2), w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = W = w; canvas.height = H = h; ctx.imageSmoothingQuality = 'high'; drawn = -1; draw();
  }
  async function get(i) {
    const r = await fetch(src(i)); const b = await r.blob();
    frames[i] = window.createImageBitmap ? await createImageBitmap(b) : await new Promise(res => { const im = new Image(); im.onload = () => res(im); im.src = URL.createObjectURL(b); });
    if (Math.abs(i - cur) < 9) { drawn = -1; kick(); draw(); }
  }
  // order: first frame, then coarse to fine so scrubbing works early and sharpens as it loads
  const order = []; const seen = new Set(); for (const step of [24, 8, 4, 2, 1]) for (let i = 0; i < count; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
  if (!seen.has(count - 1)) order.push(count - 1);
  const first = get(0).then(() => { resize(); draw(); });
  async function loadAll(gate, par = 4) {
    let k = 1; const worker = async () => { while (k < order.length) { const i = order[k++]; if (gate) await gate(); try { await get(i); } catch {} } };
    await Promise.all(Array.from({ length: par }, worker));
  }
  new ResizeObserver(() => { resize(); kick(); }).observe(canvas);
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) kick(); }).observe(canvas);
  return { first, loadAll, set(p) { target = Math.max(0, Math.min(count - 1, p)); kick(); }, get pos() { return cur; }, get loaded() { return frames.filter(Boolean).length; } };
}
