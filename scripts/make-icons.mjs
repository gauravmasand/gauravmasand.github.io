/**
 * Generates og.png, apple-touch-icon.png and favicon.ico into src/static/.
 *
 * Requires Google Chrome on the machine and is NOT part of `npm run build` —
 * the outputs are committed, so a normal build (and CI) needs nothing extra.
 * Re-run with `node scripts/make-icons.mjs` only when the artwork changes.
 */
import { spawn } from 'node:child_process';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'static');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = path.join(ROOT, '.icon-profile');
const chrome = spawn(CHROME, [
  '--headless=new', '--remote-debugging-port=9444', `--user-data-dir=${profile}`,
  '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  '--allow-file-access-from-files', 'about:blank',
], { stdio: 'ignore' });

let target = null;
for (let i = 0; i < 60 && !target; i++) {
  await sleep(250);
  try { target = (await fetch('http://127.0.0.1:9444/json/list').then((r) => r.json())).find((t) => t.type === 'page'); } catch {}
}
if (!target) { chrome.kill(); throw new Error('Chrome did not start. Set CHROME_PATH.'); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });

await send('Page.enable');
await mkdir(OUT, { recursive: true });

async function shoot(url, w, h, scale, file) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: scale, mobile: false });
  await send('Page.navigate', { url });
  await sleep(1400);
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(path.join(OUT, file), Buffer.from(data, 'base64'));
  console.log('  →', file);
}

await shoot(pathToFileURL(path.join(ROOT, 'scripts', 'og-card.html')).href, 1200, 630, 1, 'og.png');

const markUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(`<!doctype html><html><body style="margin:0">
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 64 64">
<rect width="64" height="64" rx="14" fill="#08090c"/>
<g stroke="#8ea3c4" stroke-width="2.1" stroke-linecap="round" opacity=".75">
<path d="M22 24 43 19"/><path d="M22 24 41 43"/><path d="M22 24 19 45"/><path d="M41 43 43 19"/></g>
<circle cx="22" cy="24" r="6" fill="#7ba3ff"/><circle cx="43" cy="19" r="4.2" fill="#e7b45a"/>
<circle cx="41" cy="43" r="5.2" fill="#e9ebef"/><circle cx="19" cy="45" r="3.6" fill="#a3abb8"/>
</svg></body></html>`);

await shoot(markUrl, 180, 180, 1, 'apple-touch-icon.png');
await shoot(markUrl, 64, 64, 1, 'favicon-64.png');

/* Wrap the 64x64 PNG in an ICO container (PNG-in-ICO, universally supported
   by anything still asking for /favicon.ico). */
const png = await readFile(path.join(OUT, 'favicon-64.png'));
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16);
entry[0] = 64; entry[1] = 64; entry[2] = 0; entry[3] = 0;
entry.writeUInt16LE(1, 4); entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(png.length, 8); entry.writeUInt32LE(22, 12);
await writeFile(path.join(OUT, 'favicon.ico'), Buffer.concat([header, entry, png]));
console.log('  → favicon.ico');

ws.close(); chrome.kill(); process.exit(0);
