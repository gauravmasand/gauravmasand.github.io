# gauravmasand.github.io

Personal site of **Gaurav Masand** — software engineer and AI/data-science researcher.
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
    profile.mjs         identity, hero, research statement, publications
    work.mjs            projects, experience, honours, education, skills, contact
  templates/
    page.mjs            renders index.html from the content model
    icons.mjs           inline SVG icon set
  styles/*.css          concatenated and inlined into the document at build time
  scripts/
    main.js             navigation, reveals, disclosures, filters, counters
    molecule.js         hero canvas — a molecular graph projected and depth-sorted
  static/               fonts and generated images, copied verbatim
scripts/
  verify.mjs            static checks on the generated output (runs in CI)
  check-links.mjs       resolves every external link (manual — needs network)
  make-icons.mjs        regenerates og.png / favicon.ico / apple-touch-icon.png
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

---

## Design and behaviour notes

- **Two accents carry meaning.** Cool blue marks engineering, warm gold marks
  research. The dual identity is encoded in the colour system, so a reader can place a
  card, a timeline entry or a skill group before reading it.
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
- **Weight budget** is asserted in `scripts/verify.mjs`: ~25 kB gzipped HTML with the
  CSS inlined, ~19 kB of JavaScript, ~200 kB of fonts.
