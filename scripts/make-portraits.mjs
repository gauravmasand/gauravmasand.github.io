/**
 * Regenerates the portrait cut-outs in src/static/img/ from the originals in
 * src/photos/.
 *
 * Deliberately outside `npm run build` — like scripts/make-icons.mjs — so that
 * a normal build, and CI, needs nothing beyond Node. This one is macOS-only:
 * it compiles scripts/portrait-cutout.swift, which uses the Vision framework's
 * subject segmentation to lift each subject off its background, and then
 * encodes the result with cwebp (`brew install webp`).
 *
 * The cut-outs are what let the same photograph sit correctly on both the dark
 * and the light palette: there is no baked-in background to clash with either.
 *
 *   node scripts/make-portraits.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src', 'photos');
const OUT = path.join(ROOT, 'src', 'static', 'img');

/** width = the largest size the layout renders at, doubled for 2× screens. */
const PORTRAITS = [
  { in: 'portrait-studio.jpg', out: 'portrait-studio.webp', width: 900, erode: 2, quality: 82 },
  { in: 'portrait-candid.jpg', out: 'portrait-candid.webp', width: 760, erode: 2, quality: 82 },
];

const has = (cmd) => {
  try { execFileSync('which', [cmd], { stdio: 'ignore' }); return true; } catch { return false; }
};

if (process.platform !== 'darwin') {
  console.error('  make-portraits: macOS only — it needs the Vision framework.');
  process.exit(1);
}
for (const cmd of ['swiftc', 'cwebp']) {
  if (!has(cmd)) {
    console.error(`  make-portraits: \`${cmd}\` not found.` +
      (cmd === 'cwebp' ? ' Install it with `brew install webp`.' : ' Install the Xcode command line tools.'));
    process.exit(1);
  }
}

const work = path.join(tmpdir(), `portraits-${process.pid}`);
await mkdir(work, { recursive: true });
await mkdir(OUT, { recursive: true });

const bin = path.join(work, 'portrait-cutout');
console.log('\n  compiling portrait-cutout.swift …');
execFileSync('swiftc', ['-O', path.join(ROOT, 'scripts', 'portrait-cutout.swift'), '-o', bin], { stdio: 'inherit' });

const kb = (n) => `${(n / 1024).toFixed(1)} kB`;

for (const p of PORTRAITS) {
  const source = path.join(SRC, p.in);
  if (!existsSync(source)) { console.error(`  missing source: ${path.relative(ROOT, source)}`); process.exit(1); }
  const png = path.join(work, p.out.replace(/\.webp$/, '.png'));
  execFileSync(bin, [source, png, String(p.width), String(p.erode)], { stdio: 'inherit' });
  const dest = path.join(OUT, p.out);
  // -alpha_q 100 keeps the matte edge crisp; the colour channel can take the loss.
  execFileSync('cwebp', ['-q', String(p.quality), '-alpha_q', '100', '-m', '6', '-quiet', png, '-o', dest]);
  console.log(`  ${path.relative(ROOT, dest)}  ${kb((await stat(dest)).size)}`);
}

await rm(work, { recursive: true, force: true });
console.log('\n  done — rebuild to copy them into assets/img/\n');
