# gauravmasand.github.io

Personal site of **Gaurav Masand** — software engineer and AI/ML researcher.
Live at <https://gauravmasand.github.io>.

A static, single-page site: hand-written HTML, CSS and JavaScript with no framework
runtime, no client-side router and no build-time dependencies. `node build.mjs` is
the entire pipeline.

---

## Layout

```
build.mjs               the whole build — reads src/, writes the site to the repo root
serve.mjs               local preview server (never deployed)
src/
  content/
    profile.mjs         identity, hero, research statement, publications, portraits
    work.mjs            projects, experience, honours, education, skills, contact
  templates/
    page.mjs            renders index.html from the content model
    icons.mjs           inline SVG icon set
  styles/*.css          concatenated and inlined into the document at build time
  scripts/
    main.js             theme, navigation, reveals, disclosures, filters, counters
    molecule.js         hero canvas — a molecular graph projected and depth-sorted
  photos/               original photographs — input to make-portraits, not published
  static/               fonts and generated images, copied verbatim
scripts/
  verify.mjs            static checks on the generated output (runs in CI)
  check-links.mjs       resolves every external link (manual — needs network)
  make-icons.mjs        regenerates og.png / favicon.ico / apple-touch-icon.png
  make-portraits.mjs    regenerates the portrait cut-outs in src/static/img/
  portrait-cutout.swift the Vision subject-lifting step make-portraits drives
```

Generated files live at the repository root — `index.html`, `404.html`, `assets/`,
`favicon.svg`, `sitemap.xml`, `robots.txt`, `site.webmanifest`, `.nojekyll` — and are
committed. Do not edit them; edit `src/` and rebuild.

**`src/content/` is the single source of truth for every factual claim on the page.**
Publication titles, venues, author order and DOIs are transcribed from the academic CV
and cross-checked against CrossRef.

---

## Commands

```bash
node build.mjs          # build once
npm run build           # same
npm run dev             # rebuild on change
npm run serve           # build, then preview at http://localhost:4321
npm run check           # build, then run the static checks
npm run links           # resolve every external link (network)
```

No `npm install` is required — there are no dependencies.

---

## Deployment

GitHub Pages serves this repository with the **classic branch builder**
(source: `main`, path: `/`). The built output is committed at the repository root, so
pushing to `main` publishes the site; `.nojekyll` stops Jekyll from reprocessing it.

`.github/workflows/build.yml` does not deploy. It rebuilds on every push and fails if
the committed output differs from what the build produces, so the served files can
never drift from `src/`.

If Pages is ever switched to the "GitHub Actions" source, the workflow needs an
`actions/upload-pages-artifact` + `actions/deploy-pages` pair added to it.

### Regenerating images

`og.png`, `favicon.ico` and `apple-touch-icon.png` are committed. They are produced by
`node scripts/make-icons.mjs`, which needs Google Chrome locally (override the path
with `CHROME_PATH`). This is deliberately outside `npm run build` so that a normal
build — and CI — needs nothing beyond Node.

The portrait cut-outs in `src/static/img/` are committed too, and produced by
`node scripts/make-portraits.mjs` from the originals in `src/photos/`. It is macOS
only: it compiles `scripts/portrait-cutout.swift`, which uses the Vision framework's
foreground segmentation to lift the subject onto transparency, erodes the matte to
kill the halo of background colour that soft edges carry, crops to the alpha bounding
box and rescales. The WebP encode needs `cwebp` (`brew install webp`). Update the
`w`/`h` in `src/content/profile.mjs` if a regenerated file changes size — they reserve
the layout box.

---

## Design and behaviour notes

- **Two accents carry meaning.** Cool blue marks engineering, warm gold marks
  research. The dual identity is encoded in the colour system, so a reader can place a
  card, a timeline entry or a skill group before reading it.
- **Two palettes, one set of names.** `src/styles/01-tokens.css` is the only file in
  the stylesheet allowed to name a colour; `scripts/verify.mjs` fails the build if any
  other one does. Dark is the native palette and the default. Light arrives either
  from `prefers-color-scheme` — a plain media query, so it works with JavaScript off —
  or from `html[data-theme]`, which the toggle in the nav writes and `localStorage`
  remembers. With no stored choice the OS preference wins and keeps winning as it
  changes; a click pins the palette until the reader clicks again. An inline script in
  `<head>` applies a stored choice before first paint, so the wrong theme never
  flashes. Both palettes clear 4.5:1 on body text and fail the same eleven decorative
  cases as each other.
- **Print has a third palette.** Browsers suppress background fills, which used to
  leave the dark foreground tokens printing as pale grey on white. The `@media print`
  block in `08-motion.css` remaps the tokens to ink-on-paper and forces every reveal
  to its resting state.
- **The portraits are cut-outs, not photographs.** The subject is lifted onto
  transparency at build-authoring time, so one file sits correctly on ink, on paper
  and on a printed page — no baked-in background to clash with a palette. The panel
  behind each one is drawn in CSS from the same tokens, darkest at the bottom where a
  dark jacket would otherwise dissolve into the page.
- **Progressive enhancement.** The document is complete without JavaScript: every
  disclosure panel is open, script-only controls are removed rather than left inert,
  and the mobile navigation degrades to a static wrapping row.
- **Reduced motion is honoured.** `prefers-reduced-motion: reduce` disables reveals,
  magnetic buttons, the timeline rail and the hero canvas; disclosures still open, just
  instantly.
- **The hero canvas is not decoration.** It builds a molecular graph, rotates it,
  projects it with perspective, sorts back-to-front and shades by depth — the same
  sequence of operations described in the PyChem-Pro entry. It is ~4 kB of bespoke
  code rather than a 3D library, parks its animation frame when scrolled away or the
  tab is hidden, and is not mounted at all below 760 px.
- **Fonts are self-hosted** (Inter and Newsreader, Latin subset, ~200 kB total) so the
  page makes no third-party requests. Monospace uses the system stack.
- **Weight budget** is asserted in `scripts/verify.mjs`: ~27 kB gzipped HTML with the
  CSS inlined, ~23 kB of JavaScript, ~200 kB of fonts, ~72 kB of portraits.
