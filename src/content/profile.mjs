/**
 * SINGLE SOURCE OF TRUTH for every factual claim rendered on this site.
 *
 * Provenance key used on entries:
 *   cv    — Gaurav_Masand_CV_Academic (Aug 2026 revision)
 *   site  — previous gauravmasand.github.io content
 *   both  — corroborated by both; CV wins on any conflict
 *   live  — verified against a live API at build authoring time (CrossRef, GitHub)
 *
 * Nothing here may be invented. If a link is unknown, omit the field entirely.
 */

export const meta = {
  name: 'Gaurav Masand',
  shortName: 'Gaurav Masand',
  role: 'Software Engineer',
  secondRole: 'AI & Data Science Researcher',
  location: 'Pune, Maharashtra, India',
  email: 'gauravsmasand@gmail.com',
  siteUrl: 'https://gauravmasand.github.io',
  title: 'Gaurav Masand — Software Engineer & AI/Data Science Researcher',
  description:
    'Gaurav Masand builds production backend systems and publishes computational research. Six peer-reviewed journal articles on interpretable machine learning, architect of PyChem-Pro, and Spring Boot / BigQuery microservices serving 1M+ users.',
  ogDescription:
    'Software engineer and AI/data-science researcher. Six peer-reviewed publications in interpretable ML, architect of the open-source PyChem-Pro molecular platform, backend microservices at 1M+ user scale.',
  keywords: [
    'Gaurav Masand', 'software engineer', 'AI researcher', 'machine learning',
    'explainable AI', 'QSAR', 'PyChem-Pro', 'backend engineering', 'Spring Boot',
    'computational research', 'interpretable machine learning', 'Pune',
  ],
};

export const links = {
  github: 'https://github.com/gauravmasand',
  linkedin: 'https://www.linkedin.com/in/gaurav-masand/',
  scholar: 'https://scholar.google.com/citations?user=Hjdvr88AAAAJ&hl=en',
  email: 'mailto:gauravsmasand@gmail.com',
};

/* ── Hero ─────────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: 'Pune, India',
  lede:
    'I build systems that have to be both fast and explainable — production backends measured in P95 latency, and research code measured in whether another scientist can reproduce it.',
  sub:
    'Six peer-reviewed journal articles on interpretable machine learning. Architect of PyChem-Pro, a molecular simulation platform written from first principles in pure Python and NumPy. Backend microservices ingesting events for over a million users.',
  // Every figure below is sourced; see `provenance`.
  stats: [
    { value: 6,    suffix: '',   label: 'Peer-reviewed<br>journal articles', provenance: 'cv' },
    { value: 30,   suffix: '',   label: 'Citations,<br>h-index 3',           provenance: 'cv' },
    { value: 350,  suffix: '+',  label: 'GitHub stars on<br>PyChem-Pro',     provenance: 'live' },
    { value: 1,    suffix: 'M+', label: 'Users served by<br>ingestion layer', provenance: 'cv' },
  ],
};

/* ── Identity / the two disciplines ───────────────────────────────────── */

export const identity = {
  kicker: 'Identity',
  title: 'Two disciplines, one method.',
  statement:
    'I work at the intersection of numerical computing, systems engineering and interpretable machine learning. My contribution across six journal publications has been methodological rather than domain-specific: feature-selection and model-explanation pipelines for problems where the feature space is large, the sample count is small, and a black-box predictor is not acceptable.',
  statementSource: 'Research statement, academic CV',
  /* A short orientation rail beside the statement — all four facts are in the CV. */
  now: [
    { k: 'Degree', v: 'B.E. Artificial Intelligence & Data Science, 2026', note: 'Dr. D. Y. Patil Institute of Technology (SPPU), Pune · CGPA 8.94/10' },
    { k: 'Most recent', v: 'Software Engineer Intern, Airoclip', note: 'Bengaluru · Aug 2025 — Jun 2026' },
    { k: 'Building', v: 'PyChem-Pro', note: 'Architect and lead developer · 350+ GitHub stars' },
    { k: 'Based in', v: 'Pune, Maharashtra, India', note: 'Research internship at Sunway University, Malaysia, 2025' },
  ],
  columns: [
    {
      id: 'engineering',
      tone: 'eng',
      label: 'Engineering',
      headline: 'Systems that hold up under load.',
      body:
        'Java Spring Boot microservices over a partitioned BigQuery backend. A Redis write-behind buffer that absorbs high-frequency user events in memory and flushes hourly, cutting write amplification. Distributed tracing and query profiling that took P95 latency down 30%. The work is unglamorous and it is the part that decides whether a product survives its own traffic.',
      points: [
        'Backend & distributed systems — Spring Boot, Kafka, GraphQL, FastAPI',
        'Data infrastructure — BigQuery, PostgreSQL, MongoDB, Redis',
        'Cloud & delivery — GCP, AWS, Docker, Kubernetes, CI/CD',
        'Production incident response and root-cause analysis',
      ],
    },
    {
      id: 'research',
      tone: 'res',
      label: 'Research',
      headline: 'Models you are allowed to interrogate.',
      body:
        'Small samples, thousands of candidate features, and a domain where nobody will accept "the model said so." That constraint is the whole problem. Genetic-algorithm feature selection wrapped around gradient-boosted trees; recursive feature addition with random-forest regression; SHAP attribution carried all the way through to a claim a chemist can check against an X-ray structure.',
      points: [
        'Interpretability & feature attribution on high-dimensional, low-n data',
        'Representation learning over graph-structured molecular inputs',
        'Numerical optimization — force fields, analytical gradients, L-BFGS',
        'Reproducible research software and computational pipelines',
      ],
    },
  ],
};

/* ── Publications ─────────────────────────────────────────────────────── */
/* Titles, venues, author order and contributions are transcribed from the
   academic CV. DOIs cross-checked against the CrossRef API — each resolves to
   the exact article title listed here. The RHAZES DOI resolves through
   doi.org (IMIST/PRSM registry, not indexed by CrossRef).                  */

export const publicationsMeta = {
  kicker: 'Research',
  title: 'Six peer-reviewed journal articles.',
  summary:
    '30 citations · h-index 3 · i10-index 1 — Google Scholar, July 2026. My contribution is consistently the machine-learning side: feature selection, model construction, validation, and the explainability layer that makes a result arguable rather than asserted.',
  scholarLabel: 'Google Scholar profile',
};

export const publications = [
  {
    id: 'inhalation-toxicity',
    year: '2026',
    title:
      'Machine learning modeling of acute inhalation toxicity using an RFA-RFR framework, supported by explainable AI and SALI-based activity cliff analysis',
    venue: 'Journal of Pharmacological and Toxicological Methods',
    venueShort: 'J. Pharmacol. Toxicol. Methods',
    volume: 'Article 108426',
    authors: ['V. H. Masand', 'M. M. Rathore', 'J. R. Bansod', 'M. K. Patil', 'G. S. Masand', 'A. Samad'],
    position: 5,
    positionLabel: 'Fifth author',
    area: 'Interpretable ML',
    contribution:
      'Built the ML pipeline — random-forest regression driven by recursive feature addition — and ran the explainable-AI analysis over the selected feature set.',
    methods: ['Random forest regression', 'Recursive feature addition', 'Explainable AI', 'Activity-cliff (SALI) analysis'],
    doi: '10.1016/j.vascn.2026.108426',
  },
  {
    id: 'pydescriptor-c',
    year: '2025',
    title:
      'PyDescriptorC*: a descriptor calculation tool for decoding chirality cliffs and revealing hidden patterns in drug discovery',
    venue: 'RHAZES: Green and Applied Chemistry',
    venueShort: 'RHAZES',
    volume: 'Preprint: ChemRxiv 0211',
    authors: ['V. Masand', 'G. Masand', 'S. A. Al-Hussain', 'R. Jawarkar', 'V. Rastija', 'M. E. A. Zaki'],
    position: 2,
    positionLabel: 'Second author',
    area: 'Research software',
    contribution:
      'Designed, implemented and tested the core descriptor algorithm; co-wrote the manuscript. This is the paper where the software itself is the contribution.',
    methods: ['Descriptor algorithm design', 'Stereochemistry / chirality cliffs', 'Python', 'Manuscript writing'],
    doi: '10.48419/IMIST.PRSM/rhazes-v21.55913',
    featured: true,
  },
  {
    id: 'e-qsar-gsk3',
    year: '2025',
    title:
      'e-QSAR (Explainable AI-QSAR), molecular docking, and ADMET analysis of structurally diverse GSK3-beta modulators',
    venue: 'Computational Biology and Chemistry',
    venueShort: 'Comput. Biol. Chem.',
    volume: '115:108324',
    authors: ['V. H. Masand', 'S. Al-Hussain', 'G. S. Masand', 'A. Samad', 'R. Gawali', 'S. Jadhav', 'M. E. A. Zaki'],
    position: 3,
    positionLabel: 'Third author',
    area: 'Explainable AI',
    contribution:
      'Data curation, molecular docking, and the SHAP-based explainability layer used to surface the modulatory features the model was actually relying on.',
    methods: ['SHAP', 'QSAR', 'Molecular docking', 'ADMET analysis'],
    citations: 9,
    doi: '10.1016/j.compbiolchem.2024.108324',
  },
  {
    id: 'oxygen-distribution',
    year: '2025',
    title: 'Analyzing oxygen atom distribution in FDA-approved drugs to enhance drug discovery strategies',
    venue: 'Chemical Biology & Drug Design',
    venueShort: 'Chem. Biol. Drug Des.',
    volume: '105(2):e70060',
    authors: ['V. H. Masand', 'M. K. Patil', 'S. A. Al-Hussain', 'A. Samad', 'V. Rastija', 'R. D. Jawarkar', 'G. S. Masand', 'R. G. Gawali'],
    position: 7,
    positionLabel: 'Co-author',
    area: 'Data mining',
    contribution:
      'Data mining across the FDA-approved compound set, formal analysis, and identification of the distributional patterns the paper reports.',
    methods: ['Large-scale data mining', 'Statistical analysis', 'Pattern identification'],
    citations: 11,
    doi: '10.1111/cbdd.70060',
  },
  {
    id: 'estrogen-beta',
    year: '2025',
    title: 'Identification of pharmacophore synergism for optimization of estrogen receptor beta binders',
    venue: 'Chemical Physics Impact',
    venueShort: 'Chem. Phys. Impact',
    volume: '10:100872',
    authors: ['R. A. Hussien', 'F. A. S. Alasmary', 'V. H. Masand', 'A. Samad', 'R. D. Jawarkar', 'G. S. Masand', 'S. A. Al-Hussain', 'M. E. A. Zaki'],
    position: 6,
    positionLabel: 'Co-author',
    area: 'Explainable AI',
    contribution: 'Explainable-QSAR modelling, computational analysis and model optimization.',
    methods: ['Explainable QSAR', 'Pharmacophore modelling', 'Model optimization'],
    citations: 2,
    doi: '10.1016/j.chphi.2025.100872',
  },
  {
    id: 'ga-xgboost',
    year: '2024',
    title:
      'GA-XGBoost, an explainable AI technique, for analysis of thrombin inhibitory activity of a diverse pool of molecules',
    venue: 'Chemometrics and Intelligent Laboratory Systems',
    venueShort: 'Chemom. Intell. Lab. Syst.',
    volume: '253:105197',
    authors: ['V. H. Masand', 'S. Al-Hussain', 'A. Y. Alzahrani', 'A. A. Al-Mutairi', 'A. S. Alqahtani', 'A. Samad', 'G. S. Masand', 'M. E. A. Zaki'],
    position: 7,
    positionLabel: 'Co-author',
    area: 'Interpretable ML',
    contribution:
      'Implemented the GA-XGBoost hybrid — genetic-algorithm feature selection wrapped around gradient-boosted trees — plus model validation and manuscript writing.',
    methods: ['Genetic algorithms', 'XGBoost', 'Feature selection', 'Model validation'],
    citations: 6,
    doi: '10.1016/j.chemolab.2024.105197',
  },
];

export const researchAreas = ['All', 'Interpretable ML', 'Explainable AI', 'Research software', 'Data mining'];
