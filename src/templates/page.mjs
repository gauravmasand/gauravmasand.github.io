import { icons } from './icons.mjs';
import * as P from '../content/profile.mjs';
import * as W from '../content/work.mjs';

/* ── helpers ──────────────────────────────────────────────────────────── */

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Content strings that intentionally carry inline markup (only `<br>` today). */
const raw = (s) => String(s);

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/** Split a display heading into masked lines so each can rise independently. */
const lines = (parts) =>
  parts
    .map((p, i) => `<span class="line-mask"><span class="line-inner" style="--d:${i * 90}ms">${p}</span></span>`)
    .join('');

const toneClass = (tone) => (tone === 'res' ? 'tone tone-res' : tone === 'eng' ? 'tone tone-eng' : 'tone');

const ext = (href, label, cls = 'xlink') =>
  `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)}${icons.external}</a>`;

/* ── nav ──────────────────────────────────────────────────────────────── */

const NAV = [
  ['about', 'About'],
  ['engineering', 'Engineering'],
  ['research', 'Research'],
  ['honours', 'Honours'],
  ['journey', 'Journey'],
  ['skills', 'Skills'],
];

/* Both glyphs are in the DOM; the stylesheet shows the one that names the
   theme you would switch *to*. Script only flips an attribute and a label —
   which is why the control is removed outright when script is absent. */
const themeToggle = () => `
<button class="theme-toggle" type="button" data-theme-toggle
        aria-label="Switch to the light theme" title="Switch theme">
  ${icons.sun}${icons.moon}
</button>`;

const nav = () => `
<div class="progress" data-progress aria-hidden="true"></div>
<header class="nav" data-nav>
  <div class="shell nav-inner">
    <a class="brand" href="#top">
      <span class="brand-dot" aria-hidden="true"></span>
      <span>Gaurav Masand</span>
      <span class="brand-sub" aria-hidden="true">SWE / Research</span>
    </a>
    <nav class="nav-links" aria-label="Sections">
      ${NAV.map(([id, label]) => `<a href="#${id}" data-nav-link>${label}</a>`).join('')}
    </nav>
    <div class="nav-cta">
      ${themeToggle()}
      <a class="btn" href="#contact">Get in touch ${icons.arrow}</a>
      <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="nav-sheet">
        <span></span><span></span><span></span>
        <span class="vh">Menu</span>
      </button>
    </div>
  </div>
</header>
<div class="nav-sheet" id="nav-sheet" data-nav-sheet aria-hidden="true">
  ${NAV.map(([id, label], i) => `<a href="#${id}"><span class="idx">0${i + 1}</span>${label}</a>`).join('')}
  <a href="#contact"><span class="idx">0${NAV.length + 1}</span>Contact</a>
  <div class="sheet-foot">
    ${ext(P.links.github, 'GitHub')}
    ${ext(P.links.scholar, 'Scholar')}
    ${ext(P.links.linkedin, 'LinkedIn')}
  </div>
</div>`;

/* Cut-outs, not photographs with a background: the subject is lifted onto
   transparency by scripts/make-portraits.mjs, so the same file sits correctly
   on ink and on paper. The panel behind it is drawn in CSS from the palette. */
const portrait = (p) => `
<figure class="portrait portrait--${p.variant}">
  <img src="assets/img/${esc(p.file)}" alt="${esc(p.alt)}"
       width="${p.w}" height="${p.h}"
       loading="${esc(p.loading)}" fetchpriority="${esc(p.priority)}" decoding="async">
</figure>`;

/* ── hero ─────────────────────────────────────────────────────────────── */

const hero = () => `
<section class="hero" id="top">
  <canvas class="hero-canvas" data-molecule aria-hidden="true"></canvas>
  <div class="shell hero-inner">
    <p class="hero-eyebrow mono" data-reveal><span class="dot" aria-hidden="true"></span>${esc(P.hero.eyebrow)}</p>

    <h1 data-reveal="lines">${lines(['Gaurav', 'Masand'])}</h1>

    <p class="hero-roles" data-reveal style="--d:260ms">
      <span class="r-eng">${esc(P.meta.role)}</span>
      <span class="sep" aria-hidden="true"></span>
      <span class="r-res">${esc(P.meta.secondRole)}</span>
    </p>

    <p class="hero-lede" data-reveal style="--d:340ms">${esc(P.hero.lede)}</p>
    <p class="hero-sub" data-reveal style="--d:420ms">${esc(P.hero.sub)}</p>

    <div class="hero-actions" data-reveal style="--d:500ms">
      <a class="btn magnetic" data-magnetic href="#research">Read the research ${icons.arrow}</a>
      <a class="btn btn--ghost magnetic" data-magnetic href="#engineering">See the engineering ${icons.arrow}</a>
    </div>

    <dl class="hero-stats" data-reveal style="--d:580ms">
      ${P.hero.stats
        .map(
          (s) => `<div class="hero-stat">
        <dd><span class="counter" data-count="${s.value}">${s.value}</span>${esc(s.suffix)}</dd>
        <dt>${raw(s.label)}</dt>
      </div>`
        )
        .join('')}
    </dl>
  </div>
</section>`;

/* ── identity ─────────────────────────────────────────────────────────── */

const identity = () => `
<section class="section" id="about" aria-labelledby="about-title">
  <div class="shell">
    <div class="sec-head">
      <p class="sec-kicker mono" data-reveal>${esc(P.identity.kicker)}</p>
      <h2 class="sec-title" id="about-title" data-reveal style="--d:80ms">${esc(P.identity.title)}</h2>
    </div>

    <div class="identity-split">
      <div>
        <p class="statement" data-reveal>${esc(P.identity.statement)}</p>
        <p class="statement-src mono" data-reveal style="--d:120ms">${esc(P.identity.statementSource)}</p>
      </div>
      <div class="identity-side" data-reveal style="--d:180ms">
        ${portrait(P.portraits.studio)}
        <dl class="now">
          ${P.identity.now
            .map(
              (n) => `<div class="now-row">
            <dt class="mono">${esc(n.k)}</dt>
            <dd><b>${esc(n.v)}</b><span>${esc(n.note)}</span></dd>
          </div>`
            )
            .join('')}
        </dl>
      </div>
    </div>

    <div class="disciplines">
      ${P.identity.columns
        .map(
          (c, i) => `<article class="discipline ${toneClass(c.tone)}" data-inview style="--d:${i * 120}ms">
        <p class="chip">${esc(c.label)}</p>
        <h3>${esc(c.headline)}</h3>
        <p>${esc(c.body)}</p>
        <ul>${c.points.map((p) => `<li><span>${esc(p)}</span></li>`).join('')}</ul>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>`;

/* ── engineering ──────────────────────────────────────────────────────── */

const project = (p, i) => {
  const n = String(i + 1).padStart(2, '0');
  return `
<article class="project ${toneClass(p.tone)}" data-disclosure data-open="${i === 0 ? 'true' : 'false'}">
  <h3 class="vh">${esc(p.name)}</h3>
  <div class="shell">
    <button class="project-head" type="button" data-disclosure-btn
            aria-expanded="${i === 0}" aria-controls="proj-${p.id}">
      <span class="project-idx" aria-hidden="true">${n}</span>
      <span>
        <span class="project-title">
          <h3>${esc(p.name)}</h3>
          <span class="chip">${esc(p.category)}</span>
        </span>
        <span class="project-meta">${esc(p.role)}<span class="sep" aria-hidden="true">—</span>${esc(p.period)}</span>
        <span class="project-tagline">${esc(p.tagline)}</span>
      </span>
      <span class="project-toggle" aria-hidden="true">${icons.plus}</span>
    </button>

    <div class="project-body" id="proj-${p.id}" data-disclosure-panel>
      <div>
        <div class="project-detail">
          <div class="spacer" aria-hidden="true"></div>
          <div>
            <p class="project-summary">${esc(p.summary)}</p>

            ${
              p.metrics.length
                ? `<div class="project-metrics">${p.metrics
                    .map((m) => `<div class="project-metric"><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`)
                    .join('')}</div>`
                : ''
            }

            ${
              p.highlights.length
                ? `<ul class="project-highlights">${p.highlights
                    .map((h) => `<li><h4>${esc(h.title)}</h4><p>${esc(h.body)}</p></li>`)
                    .join('')}</ul>`
                : ''
            }

            ${p.note ? `<p class="project-note">${esc(p.note)}</p>` : ''}

            <div class="project-foot">
              <ul class="stack-list">${p.stack.map((s) => `<li class="tag">${esc(s)}</li>`).join('')}</ul>
              ${
                p.links && p.links.length
                  ? `<div class="project-links">${p.links.map((l) => ext(l.href, l.label)).join('')}</div>`
                  : ''
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</article>`;
};

const engineering = () => `
<section class="section" id="engineering" aria-labelledby="eng-title">
  <div class="shell">
    <div class="sec-head">
      <p class="sec-kicker mono" data-reveal>${esc(W.projectsMeta.kicker)}</p>
      <h2 class="sec-title" id="eng-title" data-reveal style="--d:80ms">${esc(W.projectsMeta.title)}</h2>
      <p class="sec-summary" data-reveal style="--d:160ms">${esc(W.projectsMeta.summary)}</p>
    </div>
  </div>
  <div class="projects">${W.projects.map(project).join('')}</div>
</section>`;

/* ── research ─────────────────────────────────────────────────────────── */

const paper = (pub) => {
  const isMe = (a) => /^G\.\s?(S\.\s?)?Masand$/.test(a);
  return `
<article class="paper" data-disclosure data-open="false" data-cat="${esc(slug(pub.area))}">
  <div class="shell">
    <button class="paper-head" type="button" data-disclosure-btn
            aria-expanded="false" aria-controls="pub-${pub.id}">
      <span class="paper-year" aria-hidden="true">${esc(pub.year)}</span>
      <span>
        <span class="paper-title">${esc(pub.title)}</span>
        <span class="paper-venue">${esc(pub.venue)}<span class="vol">${esc(pub.volume)}</span></span>
        <span class="paper-badges">
          <span class="chip tone tone-res">${esc(pub.area)}</span>
          <span class="paper-facts mono">
            <span>${esc(pub.positionLabel)} of ${pub.authors.length}</span>
            ${pub.citations ? `<span>${pub.citations} citations</span>` : ''}
          </span>
        </span>
      </span>
      <span class="paper-toggle" aria-hidden="true">${icons.plus}</span>
    </button>

    <div class="paper-body" id="pub-${pub.id}" data-disclosure-panel>
      <div>
        <div class="paper-detail">
          <div class="spacer" aria-hidden="true"></div>
          <div>
            <dl class="paper-rows">
              <div class="paper-row">
                <dt>Authors</dt>
                <dd><ol class="authors">${pub.authors
                  .map((a) => `<li${isMe(a) ? ' class="me"' : ''}>${esc(a)}</li>`)
                  .join('')}</ol></dd>
              </div>
              <div class="paper-row">
                <dt>My contribution</dt>
                <dd>${esc(pub.contribution)}</dd>
              </div>
              <div class="paper-row">
                <dt>Methods</dt>
                <dd><ul class="methods">${pub.methods.map((m) => `<li class="tag">${esc(m)}</li>`).join('')}</ul></dd>
              </div>
              <div class="paper-row">
                <dt>Published in</dt>
                <dd>${esc(pub.venue)} · ${esc(pub.volume)} · ${esc(pub.year)}</dd>
              </div>
            </dl>
            ${
              pub.doi
                ? `<p class="paper-doi">${ext(`https://doi.org/${pub.doi}`, 'View publication')}<span class="doi-code">doi:${esc(pub.doi)}</span></p>`
                : ''
            }
          </div>
        </div>
      </div>
    </div>
  </div>
</article>`;
};

const research = () => {
  const areas = [...new Set(P.publications.map((p) => p.area))];
  const counts = (a) => P.publications.filter((p) => p.area === a).length;
  return `
<section class="section research" id="research" aria-labelledby="res-title">
  <div class="shell">
    <div class="research-head">
      <div class="sec-head" style="margin-bottom:0">
        <p class="sec-kicker mono" data-reveal>${esc(P.publicationsMeta.kicker)}</p>
        <h2 class="sec-title" id="res-title" data-reveal style="--d:80ms">${esc(P.publicationsMeta.title)}</h2>
        <p class="sec-summary" data-reveal style="--d:160ms">${esc(P.publicationsMeta.summary)}</p>
      </div>
      <div class="research-metrics" data-reveal style="--d:220ms">
        <div class="research-metric"><b><span class="counter" data-count="6">6</span></b><span>Journal articles</span></div>
        <div class="research-metric"><b><span class="counter" data-count="30">30</span></b><span>Citations</span></div>
        <div class="research-metric"><b><span class="counter" data-count="3">3</span></b><span>h-index</span></div>
      </div>
    </div>

    <div class="filters" data-filter-group data-filter-target=".paper" data-filter-status="#research-status"
         role="group" aria-label="Filter publications by research area">
      <button class="filter" type="button" data-filter="all" aria-pressed="true">All<span class="n">${P.publications.length}</span></button>
      ${areas
        .map(
          (a) =>
            `<button class="filter" type="button" data-filter="${esc(slug(a))}" aria-pressed="false">${esc(a)}<span class="n">${counts(a)}</span></button>`
        )
        .join('')}
    </div>
    <p class="vh" id="research-status" role="status" aria-live="polite"></p>
  </div>

  <div class="papers">${P.publications.map(paper).join('')}</div>

  <div class="shell research-foot">
    <p class="research-note">Author position and venue as published. Every DOI below resolves to the article of record.</p>
    ${`<a class="btn btn--ghost magnetic" data-magnetic href="${esc(P.links.scholar)}" target="_blank" rel="noopener noreferrer">${icons.scholar}<span>${esc(P.publicationsMeta.scholarLabel)}</span>${icons.external}</a>`}
  </div>
</section>`;
};

/* ── honours ──────────────────────────────────────────────────────────── */

const honours = () => `
<section class="section" id="honours" aria-labelledby="hon-title">
  <div class="shell">
    <div class="sec-head">
      <p class="sec-kicker mono" data-reveal>${esc(W.honoursMeta.kicker)}</p>
      <h2 class="sec-title" id="hon-title" data-reveal style="--d:80ms">${esc(W.honoursMeta.title)}</h2>
      <p class="sec-summary" data-reveal style="--d:160ms">${esc(W.honoursMeta.summary)}</p>
    </div>

    <div class="filters" data-filter-group data-filter-target=".honour" data-filter-status="#honour-status"
         role="group" aria-label="Filter honours by type">
      ${W.honourFilters
        .map((f) => {
          const n = f.id === 'all' ? W.honours.length : W.honours.filter((h) => h.cat === f.id).length;
          return `<button class="filter" type="button" data-filter="${f.id}" aria-pressed="${f.id === 'all'}">${esc(f.label)}<span class="n">${n}</span></button>`;
        })
        .join('')}
    </div>
    <p class="vh" id="honour-status" role="status" aria-live="polite"></p>

    <div class="honours-grid">
      ${W.honours
        .map(
          (h, i) => `<article class="honour" data-cat="${esc(h.cat)}" data-tier="${esc(h.tier)}" data-track
                 data-reveal style="--d:${Math.min(i, 5) * 60}ms">
        <p class="honour-rank">${esc(h.rank)}</p>
        <h3>${esc(h.title)}</h3>
        <p class="honour-meta">${esc(h.org)} · ${esc(h.date)}<br><span class="scale">${esc(h.scale)}</span></p>
        <p>${esc(h.detail)}</p>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>`;

/* ── journey ──────────────────────────────────────────────────────────── */

const journey = () => `
<section class="section" id="journey" aria-labelledby="jou-title">
  <div class="shell">
    <div class="sec-head">
      <p class="sec-kicker mono" data-reveal>${esc(W.experienceMeta.kicker)}</p>
      <h2 class="sec-title" id="jou-title" data-reveal style="--d:80ms">${esc(W.experienceMeta.title)}</h2>
    </div>

    <ol class="timeline">
      <span class="timeline-progress" data-timeline-progress aria-hidden="true"></span>
      ${W.experience
        .map(
          (e) => `<li class="tl-item ${toneClass(e.tone)}" data-inview>
        <div class="tl-top">
          <h3 class="tl-role">${esc(e.role)}</h3>
          <span class="tl-period">${esc(e.period)}</span>
        </div>
        <p class="tl-org"><b>${esc(e.org)}</b><span>${esc(e.location)}</span><span class="chip">${esc(e.kind)}</span></p>
        ${e.advisor ? `<p class="tl-advisor">${esc(e.advisor)}</p>` : ''}
        <ul class="tl-points">${e.points.map((p) => `<li><span>${esc(p)}</span></li>`).join('')}</ul>
      </li>`
        )
        .join('')}
    </ol>
  </div>
</section>`;

/* ── education, service, certifications ───────────────────────────────── */

const education = () => `
<section class="section" id="education" aria-labelledby="edu-title">
  <div class="shell">
    <div class="sec-head">
      <p class="sec-kicker mono" data-reveal>Education &amp; service</p>
      <h2 class="sec-title" id="edu-title" data-reveal style="--d:80ms">The academic record.</h2>
    </div>

    <div class="edu-grid" data-reveal>
      ${W.education
        .map(
          (e) => `<article class="edu">
        <p class="edu-period">${esc(e.period)}</p>
        <h3>${esc(e.degree)}</h3>
        <p class="edu-school">${esc(e.school)}</p>
        <p class="edu-loc">${esc(e.location)}</p>
        <p class="edu-result"><b>${esc(e.result)}</b><span>${esc(e.resultNote)}</span></p>
      </article>`
        )
        .join('')}
    </div>

    <div class="service tone tone-eng" data-reveal style="--d:100ms">
      <div>
        <p class="chip">Leadership &amp; service</p>
        <h3>${esc(W.service.role)}, ${esc(W.service.org)}</h3>
        <p class="service-org">${esc(W.service.school)} · ${esc(W.service.period)}</p>
        <p>${esc(W.service.body)}</p>
        <p style="margin-top:1.4rem">${ext(W.service.link.href, W.service.link.label)}</p>
      </div>
      <div class="service-stats">
        ${W.service.stats
          .map((s) => `<div class="service-stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`)
          .join('')}
      </div>
    </div>

    <div class="certs" data-reveal style="--d:160ms">
      ${W.certifications
        .map(
          (c) => `<a class="cert" href="${esc(c.href)}" target="_blank" rel="noopener noreferrer">
        <span class="cert-name">${esc(c.name)} ${icons.external}</span>
        <span class="cert-score">${esc(c.score)}</span>
      </a>`
        )
        .join('')}
    </div>
  </div>
</section>`;

/* ── skills ───────────────────────────────────────────────────────────── */

const skills = () => `
<section class="section" id="skills" aria-labelledby="skl-title">
  <div class="shell">
    <div class="sec-head">
      <p class="sec-kicker mono" data-reveal>${esc(W.skillsMeta.kicker)}</p>
      <h2 class="sec-title" id="skl-title" data-reveal style="--d:80ms">${esc(W.skillsMeta.title)}</h2>
      <p class="sec-summary" data-reveal style="--d:160ms">${esc(W.skillsMeta.summary)}</p>
    </div>

    <div class="skills">
      ${W.skills
        .map(
          (g) => `<section class="skill-group ${toneClass(g.tone)}" data-reveal>
        <h3>${esc(g.group)}</h3>
        <ul class="skill-items">${g.items.map((i) => `<li class="tag">${esc(i)}</li>`).join('')}</ul>
      </section>`
        )
        .join('')}
    </div>
  </div>
</section>`;

/* ── contact ──────────────────────────────────────────────────────────── */

const contact = () => `
<section class="section contact" id="contact" aria-labelledby="con-title">
  <div class="shell contact-top">
    <div class="contact-copy">
      <p class="sec-kicker mono" data-reveal>${esc(W.contact.kicker)}</p>
      <h2 class="contact-title" id="con-title" data-reveal style="--d:80ms">${esc(W.contact.title)}</h2>
      <p class="contact-body" data-reveal style="--d:160ms">${esc(W.contact.body)}</p>

      <div class="contact-actions" data-reveal style="--d:220ms">
        <a class="btn magnetic" data-magnetic href="${esc(P.links.email)}">${icons.mail}<span>Email me</span></a>
        <button class="btn btn--ghost magnetic" type="button" data-magnetic data-copy="${esc(P.meta.email)}">
          ${icons.copy}<span data-copy-label>Copy address</span>
        </button>
      </div>
    </div>
    <div data-reveal style="--d:280ms">${portrait(P.portraits.candid)}</div>
  </div>

  <div class="shell">
    <div class="contact-links" data-reveal style="--d:280ms">
      <a class="contact-link" href="${esc(P.links.email)}">
        <span class="k">Email</span><span class="v">${esc(P.meta.email)} ${icons.arrow}</span>
      </a>
      <a class="contact-link" href="${esc(P.links.github)}" target="_blank" rel="noopener noreferrer">
        <span class="k">GitHub</span><span class="v">${icons.github} github.com/gauravmasand ${icons.arrow}</span>
      </a>
      <a class="contact-link" href="${esc(P.links.linkedin)}" target="_blank" rel="noopener noreferrer">
        <span class="k">LinkedIn</span><span class="v">${icons.linkedin} in/gaurav-masand ${icons.arrow}</span>
      </a>
      <a class="contact-link" href="${esc(P.links.scholar)}" target="_blank" rel="noopener noreferrer">
        <span class="k">Google Scholar</span><span class="v">${icons.scholar} Publications ${icons.arrow}</span>
      </a>
    </div>
  </div>
</section>`;

const footer = () => `
<footer class="footer">
  <div class="shell footer-inner">
    <div>
      <p>© <span data-year>2026</span> ${esc(P.meta.name)} · ${esc(P.meta.location)}</p>
      <p class="footer-note">Built as a static site — hand-written HTML, CSS and JavaScript, no framework runtime. Every figure on this page is drawn from a published record.</p>
    </div>
    <nav class="footer-links" aria-label="Elsewhere">
      <a href="${esc(P.links.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="${esc(P.links.scholar)}" target="_blank" rel="noopener noreferrer">Google Scholar</a>
      <a href="${esc(P.links.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="${esc(P.links.email)}">Email</a>
    </nav>
  </div>
</footer>`;

/* ── structured data ──────────────────────────────────────────────────── */

const jsonLd = () => {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: P.meta.name,
    url: P.meta.siteUrl,
    email: `mailto:${P.meta.email}`,
    jobTitle: [P.meta.role, P.meta.secondRole],
    description: P.meta.ogDescription,
    address: { '@type': 'PostalAddress', addressLocality: 'Pune', addressRegion: 'Maharashtra', addressCountry: 'IN' },
    alumniOf: W.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
    knowsAbout: [
      'Interpretable machine learning', 'Explainable AI', 'Backend engineering',
      'Distributed systems', 'Numerical optimization', 'Cheminformatics', 'QSAR modelling',
    ],
    sameAs: [P.links.github, P.links.linkedin, P.links.scholar],
  };

  const articles = P.publications.map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: p.title,
    name: p.title,
    datePublished: p.year,
    isPartOf: { '@type': 'Periodical', name: p.venue },
    author: p.authors.map((a) => ({ '@type': 'Person', name: a })),
    ...(p.doi ? { identifier: `https://doi.org/${p.doi}`, url: `https://doi.org/${p.doi}` } : {}),
  }));

  return [person, ...articles]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)
    .join('\n');
};

/* ── document ─────────────────────────────────────────────────────────── */

export function renderPage({ cssHref, jsHref, cssInline }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(P.meta.title)}</title>
<meta name="description" content="${esc(P.meta.description)}">
<meta name="author" content="${esc(P.meta.name)}">
<meta name="keywords" content="${esc(P.meta.keywords.join(', '))}">
<meta name="theme-color" content="#08090c" media="(prefers-color-scheme: dark)" data-theme-color>
<meta name="theme-color" content="#f7f6f3" media="(prefers-color-scheme: light)" data-theme-color>
<link rel="canonical" href="${esc(P.meta.siteUrl)}/">

<meta property="og:type" content="website">
<meta property="og:url" content="${esc(P.meta.siteUrl)}/">
<meta property="og:site_name" content="${esc(P.meta.name)}">
<meta property="og:title" content="${esc(P.meta.title)}">
<meta property="og:description" content="${esc(P.meta.ogDescription)}">
<meta property="og:image" content="${esc(P.meta.siteUrl)}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(P.meta.name)} — ${esc(P.meta.role)} and ${esc(P.meta.secondRole)}">
<meta property="og:locale" content="en_US">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(P.meta.title)}">
<meta name="twitter:description" content="${esc(P.meta.ogDescription)}">
<meta name="twitter:image" content="${esc(P.meta.siteUrl)}/og.png">

<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">

<link rel="preload" href="assets/fonts/inter-latin-normal.woff2" as="font" type="font/woff2" crossorigin>
<!-- Set before first paint so enhanced styles never flash their fallback
     state, and so a stored theme choice is in force for the very first frame.
     No stored choice means no attribute, which leaves the palette to the
     prefers-color-scheme media query in the stylesheet. -->
<script>document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}</script>
${cssInline ? `<style>${cssInline}</style>` : `<link rel="stylesheet" href="${cssHref}">`}
<script type="module" src="${jsHref}"></script>
${jsonLd()}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${nav()}
<main id="main">
${hero()}
${identity()}
${engineering()}
${research()}
${honours()}
${journey()}
${education()}
${skills()}
${contact()}
</main>
${footer()}
</body>
</html>`;
}
