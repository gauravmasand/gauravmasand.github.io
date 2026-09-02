/**
 * Hero backdrop: a molecular graph projected, depth-sorted and shaded in
 * software on a 2D canvas.
 *
 * It is deliberately the same sequence of operations as the PyChem-Pro
 * rasterizer described in the Engineering section — build a graph, apply a
 * rotation, project with perspective, sort back-to-front, shade by depth —
 * which is why it earns its place here rather than being decoration.
 *
 * ~70 atoms and ~80 bonds; one rAF loop that parks itself when the hero
 * scrolls away or the tab is hidden.
 */

const TAU = Math.PI * 2;

/* Deterministic PRNG so the structure is identical on every load. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Fused, puckered six-rings with pendant atoms — a plausible molecular graph. */
function buildMolecule() {
  const rand = rng(20260903);
  const atoms = [];
  const bonds = [];

  const ringCentres = [
    [0, 0, 0],
    [2.55, 0.35, -0.7],
    [-2.3, -0.6, 0.9],
    [1.15, 2.3, 1.4],
    [-1.0, -2.45, -1.2],
  ];

  ringCentres.forEach((c, ri) => {
    const first = atoms.length;
    const tilt = (ri * 0.7 + 0.35) % 1.6;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + ri * 0.4;
      const pucker = (i % 2 ? 0.22 : -0.22) + (rand() - 0.5) * 0.16;
      const x = c[0] + Math.cos(a) * 1.42;
      const y = c[1] + Math.sin(a) * 1.42 * Math.cos(tilt);
      const z = c[2] + Math.sin(a) * 1.42 * Math.sin(tilt) + pucker;
      atoms.push({ x, y, z, r: 0.3 + rand() * 0.1, kind: 0 });
      bonds.push([first + i, first + ((i + 1) % 6)]);
    }
    // Fuse each ring after the first back into the structure.
    if (ri > 0) bonds.push([first, Math.floor(rand() * first)]);
  });

  // Pendant atoms — the accent-coloured ones, kept sparse.
  const core = atoms.length;
  for (let i = 0; i < 14; i++) {
    const host = Math.floor(rand() * core);
    const h = atoms[host];
    const t = rand() * TAU;
    const p = Math.acos(2 * rand() - 1);
    atoms.push({
      x: h.x + Math.sin(p) * Math.cos(t) * 1.15,
      y: h.y + Math.sin(p) * Math.sin(t) * 1.15,
      z: h.z + Math.cos(p) * 1.15,
      r: 0.2 + rand() * 0.07,
      kind: i % 5 === 0 ? 2 : 1,
    });
    bonds.push([host, atoms.length - 1]);
  }

  // Centre the structure on its centroid so rotation looks anchored.
  const n = atoms.length;
  const cx = atoms.reduce((s, a) => s + a.x, 0) / n;
  const cy = atoms.reduce((s, a) => s + a.y, 0) / n;
  const cz = atoms.reduce((s, a) => s + a.z, 0) / n;
  atoms.forEach((a) => { a.x -= cx; a.y -= cy; a.z -= cz; });

  return { atoms, bonds };
}

export function mountMolecule(canvas) {
  if (!canvas || !canvas.getContext) return () => {};
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => {};

  const { atoms, bonds } = buildMolecule();
  const proj = atoms.map(() => ({ x: 0, y: 0, z: 0, s: 0 }));
  const order = atoms.map((_, i) => i);

  const palette = [
    [168, 180, 200],   // structural
    [123, 163, 255],   // engineering blue
    [231, 180, 90],    // research gold
  ];

  let w = 0, h = 0, dpr = 1;
  let rx = -0.32, ry = 0.5;
  let targetX = 0, targetY = 0;
  let raf = 0, running = false, visible = true, t = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame() {
    raf = 0;
    if (!running) return;
    t += 0.0022;

    ry += 0.0016 + (targetX * 0.35 - ry * 0) * 0;
    const ax = rx + targetY * 0.22 + Math.sin(t * 1.7) * 0.05;
    const ay = ry + targetX * 0.3;

    const cosX = Math.cos(ax), sinX = Math.sin(ax);
    const cosY = Math.cos(ay), sinY = Math.sin(ay);

    // Anchor toward the right of the frame; the copy occupies the left.
    const cx = w * (w < 780 ? 0.5 : 0.735);
    const cy = h * (w < 780 ? 0.38 : 0.46);
    const scale = Math.min(w, h) * (w < 780 ? 0.05 : 0.062);
    const depth = 13;

    for (let i = 0; i < atoms.length; i++) {
      const a = atoms[i];
      const x1 = a.x * cosY - a.z * sinY;
      const z1 = a.x * sinY + a.z * cosY;
      const y2 = a.y * cosX - z1 * sinX;
      const z2 = a.y * sinX + z1 * cosX;
      const persp = depth / (depth + z2);
      const p = proj[i];
      p.x = cx + x1 * scale * persp;
      p.y = cy + y2 * scale * persp;
      p.z = z2;
      p.s = persp;
    }

    ctx.clearRect(0, 0, w, h);

    // Bonds first, behind every atom, faded with depth.
    ctx.lineCap = 'round';
    for (let i = 0; i < bonds.length; i++) {
      const [a, b] = bonds[i];
      const pa = proj[a], pb = proj[b];
      const dz = (pa.z + pb.z) * 0.5;
      const fade = Math.max(0, Math.min(1, (5.5 - dz) / 10));
      ctx.globalAlpha = 0.06 + fade * 0.26;
      ctx.strokeStyle = '#8ea3c4';
      ctx.lineWidth = Math.max(0.5, 0.95 * ((pa.s + pb.s) * 0.5));
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }

    // Atoms back-to-front.
    order.sort((i, j) => proj[j].z - proj[i].z);
    for (let k = 0; k < order.length; k++) {
      const i = order[k];
      const p = proj[i];
      const a = atoms[i];
      const fade = Math.max(0, Math.min(1, (5.5 - p.z) / 10));
      const [r, g, bl] = palette[a.kind];
      const rad = Math.max(0.7, a.r * scale * p.s * 0.34);

      ctx.globalAlpha = 0.14 + fade * 0.46;
      ctx.fillStyle = `rgb(${r},${g},${bl})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, TAU);
      ctx.fill();

      if (a.kind > 0 && fade > 0.55) {
        ctx.globalAlpha = (fade - 0.55) * 0.34;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad * 3.2, 0, TAU);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || !visible) return;
    running = true;
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  const onPointer = (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  const onResize = () => { resize(); if (!running) frame(); };

  resize();

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        visible ? start() : stop();
      }, { threshold: 0 })
    : null;
  if (io) io.observe(canvas); else { visible = true; }

  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', onPointer, { passive: true });
  }

  start();
  canvas.dataset.ready = 'true';

  return () => {
    stop();
    io && io.disconnect();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pointermove', onPointer);
  };
}
