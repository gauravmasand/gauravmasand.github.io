/* Engineering work, experience, honours, education, skills.
   Sources: academic CV (authoritative) + previous site (for entries the CV omits). */

/* ── Selected engineering work ────────────────────────────────────────── */

export const projectsMeta = {
  kicker: 'Engineering',
  title: 'Things I built, and what was hard about them.',
  summary:
    'Not a list of repositories. Each of these had one genuinely difficult constraint — a numerical method with no library to lean on, a grammar that does not map onto English, a write path that could not survive its own volume — and that constraint is what the work is.',
};

export const projects = [
  {
    id: 'pychem-pro',
    name: 'PyChem-Pro',
    role: 'Architect & Lead Developer',
    period: 'Mar 2026 — Present',
    category: 'Research software',
    tone: 'res',
    tagline: 'A molecular simulation, analysis and visualization platform written from first principles.',
    summary:
      'Cross-platform desktop application and Python library — no C/C++ extensions, no external cheminformatics dependency. The force field, the optimizer, the parser and the renderer are all implemented from the published specifications in pure Python and NumPy. I am the only computer scientist on a team of domain chemists and wrote roughly 70% of the codebase.',
    metrics: [
      { value: '350+', label: 'GitHub stars' },
      { value: '~600', label: 'users in five months' },
      { value: '~70%', label: 'of codebase authored' },
    ],
    highlights: [
      {
        title: 'Numerical optimization',
        body:
          'Implemented MMFF94 from the published specification in pure NumPy — bond stretching, cubic-corrected angle bending, Fourier torsions, Lennard-Jones 12-6 with 1-2/1-3 exclusions, bond-charge-increment partial charges. Derived analytical gradients by hand for the angle and torsion terms and validated them against finite differences to 1e-4 and 1e-3. Minimization by L-BFGS with Armijo backtracking line search.',
      },
      {
        title: 'Computer graphics',
        body:
          'Wrote the full 3D rendering pipeline: a software rasterizer with projection, depth sorting, view-frustum culling and level-of-detail substitution; a keyed gradient cache that amortizes per-atom shading arithmetic; an offline tiled ray-tracer; Catmull–Rom ribbon geometry and a DSSP-style secondary-structure classifier. ~60 FPS at 100 atoms.',
      },
      {
        title: 'Systems architecture',
        body:
          'Dependency-ordered layering — core domain to infrastructure to services to features to public API — with every subsystem behind a typing.Protocol interface (IForceField, IRenderer, ILoader) so implementations are swappable by structural subtyping. An event bus for decoupled pub/sub, and a plugin API with lifecycle hooks.',
      },
      {
        title: 'Parallelism & performance',
        body:
          'One shared ProcessPoolExecutor pinned to a forced spawn start method for cross-platform safety — Qt plus fork() deadlocks on macOS, and fork() does not exist on Windows. It is used across parsing, force-field evaluation, descriptor computation, rendering and ray-trace tiling, and it is what lets a pure-Python implementation reach throughput competitive with compiled alternatives.',
      },
      {
        title: 'Algorithms',
        body:
          'SMILES parser with Hückel aromaticity perception. PDB/mmCIF/MOL2/SDF readers with automatic bond perception. Kabsch superposition with outlier rejection and Needleman–Wunsch C-alpha correspondence. Shrake–Rupley SASA. Seven KS-test-evaluated partitioning algorithms.',
      },
    ],
    stack: ['Python', 'NumPy', 'Qt', 'Multiprocessing', 'Computational geometry'],
    note: 'Sponsored by AcuroRx, USA.',
    links: [{ label: 'Source', href: 'https://github.com/vijaymasand/PyChem-Pro' }],
  },
  {
    id: 'tap-hexa',
    name: 'Tap Hexa — data ingestion layer',
    role: 'Software Engineer Intern, Airoclip',
    period: 'Aug 2025 — Jun 2026',
    category: 'Backend & distributed systems',
    tone: 'eng',
    tagline: 'The write path for a product with more than a million users.',
    summary:
      'High-throughput Java Spring Boot microservices forming the core data-ingestion layer, orchestrating low-latency inter-service calls over a partitioned BigQuery backend.',
    metrics: [
      { value: '1M+', label: 'users served' },
      { value: '30%', label: 'P95 query latency cut' },
      { value: '95%', label: 'less manual analysis time' },
    ],
    highlights: [
      {
        title: 'Redis write-behind buffer',
        body:
          'High-frequency user events — clicks, swipes, state snapshots — are held in memory and flushed to BigQuery on an hourly batch rather than written through. That cut write amplification and raised ingestion throughput, which is the difference between a warehouse that keeps up and one that does not.',
      },
      {
        title: 'Production incident response',
        body:
          'Led root-cause analysis across GCP microservices and built the automated diagnostics — distributed tracing, query profiling — that took P95 query latency down 30%.',
      },
      {
        title: 'LLM analytics pipeline',
        body:
          'A LangChain-over-BigQuery pipeline that took a recurring analysis from four-plus hours of manual work to under three minutes.',
      },
    ],
    stack: ['Java', 'Spring Boot', 'BigQuery', 'Redis', 'GCP', 'LangChain'],
  },
  {
    id: 'mudra',
    name: 'Mudra',
    role: 'Project Lead',
    period: 'Nov 2024 — Mar 2025',
    category: 'Applied ML',
    tone: 'both',
    tagline: 'Bidirectional Indian Sign Language translation — and the corpus it needed.',
    summary:
      'A translation system in both directions, advised by Dr. Mithra Venkatesan, Head of the Department of AI & Data Science at Dr. D. Y. Patil Institute of Technology. The recognition half was a modelling problem. The generation half was a linguistics problem. The dataset was neither, and it was the part nobody else had solved.',
    metrics: [
      { value: '~5,000', label: 'sign classes collected' },
      { value: '~2.5M', label: 'labelled frames' },
      { value: '~200ms', label: 'end-to-end latency' },
    ],
    highlights: [
      {
        title: 'Recognition — sign to text',
        body:
          'MediaPipe hand and pose landmark extraction feeding a CNN spatial encoder and an LSTM temporal model for continuous sign classification.',
      },
      {
        title: 'Generation — text to sign',
        body:
          'ISL grammar differs structurally from English, so this is syntactic reordering rather than lookup. The NLP layer transduces English into Indian Sign Language word order and drives a SiGML avatar renderer to articulate the sequence.',
      },
      {
        title: 'The corpus',
        body:
          'Led construction of an original ISL corpus — roughly 5,000 sign classes at about 500 frames each, near 2.5M labelled frames — collected with volunteer native signers through a purpose-built capture tool running at 60–90 frames per second. We are the primary source for this data.',
      },
      {
        title: 'Delivery',
        body:
          'Deployed as a Flutter and React client over a Dockerized FastAPI backend at roughly 200 ms end to end, with 300+ users. Top 5 finalist among 500+ teams at the Smart India Hackathon 2024 Grand Finale.',
      },
    ],
    stack: ['Python', 'MediaPipe', 'CNN + LSTM', 'FastAPI', 'Flutter', 'Docker'],
    links: [
      { label: 'Project repositories', href: 'https://github.com/gauravmasand/Indian-Sign-Language-Project' },
      { label: 'Models', href: 'https://github.com/gauravmasand/SIH-ISL-to-Text-models' },
    ],
  },
  {
    id: 'jdescriptor',
    name: 'JDescriptor',
    role: 'Lead Developer',
    period: '2025',
    category: 'Research software',
    tone: 'res',
    tagline: 'A molecular feature-extraction engine at 4× the reference implementation.',
    summary:
      'High-throughput engine computing more than 15,000 molecular descriptors, packaged as an automated containerized modelling pipeline on AWS and integrated into a QSAR workflow using XGBoost.',
    metrics: [
      { value: '15,000+', label: 'descriptors computed' },
      { value: '4×', label: 'speedup over reference' },
      { value: 'Gold', label: 'e-Inovasi 2025, international' },
    ],
    highlights: [
      {
        title: 'Where it went',
        body:
          'Built during a research internship at Sunway University under Prof. Dr. Long Chiau Ming. The work won the International Gold Medal at e-Inovasi 2025 — top 20 of more than 1,000 teams — supported a Sunway–UAEU joint grant proposal, and has been accepted for publication at RPIC 2026.',
      },
    ],
    stack: ['Python', 'XGBoost', 'AWS', 'Docker'],
    links: [{ label: 'Source', href: 'https://github.com/gauravmasand/JDescriptor-Python-Full-Stack' }],
  },
  {
    id: 'lelekart',
    name: 'LeleKart',
    role: 'Full Stack Developer Intern, Mymegaminds',
    period: 'Feb 2024 — Jun 2024',
    category: 'Product engineering',
    tone: 'eng',
    tagline: 'An e-commerce product shipped to web and Android, then made fast.',
    summary:
      'Built with React on the web and Flutter on Android over a Node.js and Express backend, serving more than 5,000 users.',
    metrics: [
      { value: '5,000+', label: 'users' },
      { value: '5s → 1.3s', label: 'page load time' },
      { value: '>98.8%', label: 'uptime' },
    ],
    highlights: [
      {
        title: 'Performance',
        body:
          'Refined asset rendering and caching to bring page load from five seconds to 1.3 — a 74% reduction, and the single change users actually noticed.',
      },
      {
        title: 'Delivery',
        body:
          'Accelerated RESTful API releases with BLoC architecture and automated CI/CD, and shipped production Web and Android builds holding above 98.8% uptime.',
      },
    ],
    stack: ['React', 'Flutter', 'Node.js', 'Express', 'CI/CD'],
  },
  {
    id: 'dazel',
    name: 'Dazel',
    role: 'Creator',
    period: '2024',
    category: 'Backend',
    tone: 'eng',
    tagline: 'A matching engine that had to answer in under 200 ms.',
    summary:
      'A matching algorithm scoring across 30+ parameters with geolocation constraints, backed by Redis caching to hold sub-200ms response times, plus real-time chat with data encryption. First place among 80+ teams at the MIT-WPU Codethon 2024.',
    metrics: [
      { value: '30+', label: 'matching parameters' },
      { value: '<200ms', label: 'response time' },
      { value: '1st', label: 'of 80+ teams, MIT-WPU' },
    ],
    highlights: [],
    stack: ['Node.js', 'Redis', 'MongoDB', 'Flutter'],
    links: [{ label: 'Source', href: 'https://github.com/gauravmasand/dazel-dating-app-flutter' }],
  },
];

/* ── Experience timeline ──────────────────────────────────────────────── */

export const experienceMeta = { kicker: 'Journey', title: 'Where the work happened.' };

export const experience = [
  {
    org: 'Airoclip',
    location: 'Bengaluru, India',
    role: 'Software Engineer Intern',
    kind: 'Industry',
    tone: 'eng',
    period: 'Aug 2025 — Jun 2026',
    start: '2025-08',
    points: [
      'Engineered high-throughput Java Spring Boot microservices for the core data-ingestion layer of Tap Hexa, orchestrating low-latency inter-service calls over a partitioned BigQuery backend serving 1M+ users.',
      'Designed a Redis write-behind buffer holding high-frequency user events in memory with an hourly batch flush to BigQuery, cutting write amplification and raising ingestion throughput.',
      'Led root-cause analysis and production incident response across GCP microservices, building automated diagnostics that cut P95 query latency by 30%.',
      'Built an LLM-powered analytics pipeline with LangChain and BigQuery, cutting manual analysis time by 95%.',
    ],
  },
  {
    org: 'Sunway University',
    location: 'Kuala Lumpur, Malaysia',
    role: 'Research Intern — Cheminformatics, AI & Cloud Engineering',
    kind: 'Research',
    tone: 'res',
    period: 'Jun — Jul 2025',
    start: '2025-06',
    advisor: 'Advisor: Prof. Dr. Long Chiau Ming, Deputy Dean (Research & Sustainability)',
    points: [
      'Engineered the JDescriptor computation engine and integrated it into an automated QSAR modelling pipeline on AWS using XGBoost.',
      'The work won the International Gold Medal at e-Inovasi 2025 — top 20 of 1,000+ teams — and supported a Sunway–UAEU joint grant proposal.',
      'Authored a systematic review on generative AI in the clinical setting and built an associated clinical risk calculator.',
    ],
  },
  {
    org: 'Defence Institute of Advanced Technology (DRDO)',
    location: 'Pune, India — Government of India',
    role: 'Research Intern — R&D Management & AI Analytics Group',
    kind: 'Research',
    tone: 'res',
    period: 'Dec 2024 — Feb 2025',
    start: '2024-12',
    advisor: 'Advisor: Dr. Amrita Nighojkar, Dept. of Technology Management',
    points: [
      'Built a drone obstacle-detection system with real-time perception, cutting simulation testing cycles by 40% through an optimized Python validation harness.',
      'Engineered Python modules for high-level drone autonomy and mission planning, implementing route generation and safety-constraint logic.',
      'Conducted semantic and bibliometric analysis of blockchain applications in aviation using Python, R and VOSviewer, synthesizing 100+ manuscripts into a co-authored review of emerging defence technologies.',
    ],
  },
  {
    org: 'Dr. D. Y. Patil Institute of Technology',
    location: 'Pune, India',
    role: 'Project Lead — Mudra, Indian Sign Language translation',
    kind: 'Research',
    tone: 'res',
    period: 'Nov 2024 — Mar 2025',
    start: '2024-11',
    advisor: 'Advisor: Dr. Mithra Venkatesan, Head, Dept. of AI & Data Science',
    points: [
      'Led a bidirectional ISL translation system: MediaPipe landmarks into a CNN + LSTM stack for recognition, and an NLP layer transducing English into ISL word order to drive a SiGML avatar for generation.',
      'Led construction of an original ISL corpus of ~5,000 sign classes and ~2.5M labelled frames with volunteer native signers — we are the primary source for this data.',
      'Deployed to 300+ users as a Flutter/React client over a Dockerized FastAPI backend at ~200 ms.',
    ],
  },
  {
    org: 'Mymegaminds',
    location: 'Pune, India',
    role: 'Full Stack Developer Intern',
    kind: 'Industry',
    tone: 'eng',
    period: 'Feb 2024 — Jun 2024',
    start: '2024-02',
    points: [
      'Developed the LeleKart e-commerce application for 5,000+ users using React and Flutter over a Node.js/Express backend.',
      'Optimised performance by refining asset rendering and caching, reducing page load time from 5s to 1.3s — a 74% improvement.',
      'Accelerated RESTful API releases with BLoC architecture and automated CI/CD, shipping production Web and Android builds at >98.8% uptime.',
    ],
  },
];

/* ── Honours ──────────────────────────────────────────────────────────── */

export const honoursMeta = {
  kicker: 'Honours',
  title: 'Eleven competitions. Two continents.',
  summary:
    'Hackathons and competitive programming are where I learned to ship under a deadline that does not move. The international medals came out of research work; the rest came out of forty-eight hour sprints.',
};

export const honourFilters = [
  { id: 'all', label: 'All' },
  { id: 'international', label: 'International' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'coding', label: 'Competitive coding' },
];

export const honours = [
  {
    cat: 'international',
    rank: 'Gold Medal',
    tier: 'gold',
    title: 'e-Inovasi 2025',
    org: 'IMU University, Malaysia',
    date: 'Sep 2025',
    scale: 'Top 20 of 1,000+ teams',
    detail:
      'International gold for JDescriptor — a molecular feature-extraction engine computing 15,000+ descriptors at a 4× speedup, packaged as a containerized modelling pipeline on AWS.',
  },
  {
    cat: 'international',
    rank: 'Silver Medal',
    tier: 'silver',
    title: 'Malaysia Startup Challenge 2025',
    org: 'Tertiary — Startup Product Category',
    date: 'Aug 2025',
    scale: 'Against 1,000+ teams',
    detail:
      'A scalable AI-driven e-commerce ecosystem with automated inventory management and real-time personalization. Led by Prof. Long Ming.',
  },
  {
    cat: 'coding',
    rank: 'Top 300',
    tier: 'gold',
    title: 'Amazon ML Challenge 2025',
    org: 'Amazon',
    date: '2025',
    scale: 'Of 80,000+ teams',
    detail: 'National machine-learning competition, placed in the top 300 of a field above eighty thousand teams.',
  },
  {
    cat: 'hackathon',
    rank: 'Top 5 Finalist',
    tier: 'gold',
    title: 'Smart India Hackathon 2024 — Grand Finale',
    org: 'Ministry of Education & AICTE, Government of India',
    date: 'Dec 2024',
    scale: 'Of 500+ teams',
    detail:
      'Mudra — a full-stack mobile and web system for real-time Indian Sign Language translation, built on a CNN + LSTM recognition stack and an ISL grammar transduction layer.',
  },
  {
    cat: 'hackathon',
    rank: '1st Place',
    tier: 'gold',
    title: 'Tietoevry Hackathon, MindSpark ’24',
    org: 'COEP Technological University & Krafton',
    date: 'Nov 2024',
    scale: 'Of 240+ teams',
    detail:
      'NeuralBytes — an emergency health assistance app for senior citizens with SOS alerts, heartbeat monitoring and real-time nurse tracking, in Flutter and Firebase.',
  },
  {
    cat: 'hackathon',
    rank: '1st Place',
    tier: 'gold',
    title: 'Silicon Fusion 2024',
    org: 'AISSMS College of Engineering',
    date: 'Oct 2024',
    scale: 'Of 50+ teams',
    detail:
      'A backend-focused DSA teaching platform, built around the algorithmic work needed to deliver scalable, structured practice.',
  },
  {
    cat: 'hackathon',
    rank: '3rd Place',
    tier: 'bronze',
    title: 'VCET Hackathon 2024',
    org: 'VCET',
    date: 'Oct 2024',
    scale: 'Of 200+ teams',
    detail:
      'A secure authentication service with three-factor authentication (email, OTP, fingerprint), DDoS defence, and an admin dashboard for session tracking.',
  },
  {
    cat: 'hackathon',
    rank: '1st Place',
    tier: 'gold',
    title: 'MIT-WPU Codethon 2024',
    org: 'MIT-WPU',
    date: 'May 2024',
    scale: 'Of 80+ teams',
    detail:
      'Dazel — a matching engine scoring 30+ parameters with geolocation constraints, Redis-cached to hold sub-200ms responses, plus encrypted real-time chat.',
  },
  {
    cat: 'hackathon',
    rank: '1st Place',
    tier: 'gold',
    title: 'Hash It Out, ZION 2024',
    org: 'Dr. D. Y. Patil Institute of Technology',
    date: 'Apr 2024',
    scale: 'Of 70+ teams',
    detail:
      'HealthEase — a Flutter healthcare app integrating doctor consultations, ambulance tracking and medicine ordering, built inside a six-hour window.',
  },
  {
    cat: 'coding',
    rank: '1st Runner Up',
    tier: 'silver',
    title: 'Dataverse 2024',
    org: 'Dr. D. Y. Patil Institute of Technology',
    date: 'Mar 2024',
    scale: 'Solo competition',
    detail: 'Second place in a solo data-science and algorithms contest.',
  },
  {
    cat: 'coding',
    rank: '2nd Place',
    tier: 'silver',
    title: 'Blind C Coding Competition',
    org: 'Dr. Punjabrao Deshmukh Polytechnic',
    date: 'Mar 2022',
    scale: 'Of 150+ participants',
    detail:
      'Wrote C with the monitor switched off — no visual feedback at any point. It is a syntax-recall exercise disguised as a contest.',
  },
];

/* ── Education & service ──────────────────────────────────────────────── */

export const education = [
  {
    degree: 'B.E., Artificial Intelligence & Data Science',
    school: 'Dr. D. Y. Patil Institute of Technology (SPPU)',
    location: 'Pune, India',
    period: 'Sep 2023 — Jul 2026',
    result: 'CGPA 8.94 / 10',
    resultNote: 'equivalent GPA 3.58 / 4.0',
  },
  {
    degree: 'Diploma, Computer Engineering',
    school: 'Dr. Punjabrao Deshmukh Polytechnic (MSBTE)',
    location: 'Amravati, India',
    period: 'Aug 2020 — Jun 2023',
    result: '86.06%',
    resultNote: 'equivalent GPA 3.44 / 4.0',
  },
];

export const service = {
  role: 'Chapter Lead',
  org: 'Google Developer Group on Campus',
  school: 'Dr. D. Y. Patil Institute of Technology',
  period: 'Oct 2024 — Jun 2026',
  body:
    'Rose from Flutter Lead to Chapter Lead of a 50+ member team. Organized Hack-A-Bit Chapter 2.0, the largest technical event the campus has run, with 340+ teams. Mentored 100+ students in AI and ML. Also volunteered with GDG Pune on DevFest Pune 2024, which drew over 1,200 attendees.',
  stats: [
    { value: '340+', label: 'teams at Hack-A-Bit 2.0' },
    { value: '100+', label: 'students mentored' },
    { value: '50+', label: 'member core team' },
  ],
  link: {
    label: 'GDG on Campus chapter',
    href: 'https://gdg.community.dev/gdg-on-campus-dr-d-y-patil-institute-of-technology-pune-india/',
  },
};

export const certifications = [
  { name: 'Machine Learning — Stanford University via Coursera', score: '100%', href: 'https://www.coursera.org/account/accomplishments/verify/7DKLASSWCUXZ' },
  { name: 'IBM Data Science Professional Certificate', score: '91.95%', href: 'https://coursera.org/verify/professional-cert/Z7AL50KQ9Y1W' },
];

/* ── Skills ───────────────────────────────────────────────────────────── */

export const skillsMeta = {
  kicker: 'Toolkit',
  title: 'What I reach for.',
  summary: 'Grouped by the problem it solves, not by how many logos fit on a row.',
};

export const skills = [
  { group: 'Languages', tone: 'eng', items: ['Java', 'Python', 'C++', 'JavaScript', 'SQL'] },
  {
    group: 'Core computer science',
    tone: 'eng',
    items: ['Data structures & algorithms', 'Object-oriented programming', 'DBMS', 'Operating systems (Linux/Unix)', 'Computer networks (TCP/IP)', 'Distributed systems', 'System design'],
  },
  {
    group: 'Machine learning & numerics',
    tone: 'res',
    items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'NumPy', 'SciPy', 'XGBoost', 'SHAP', 'CNN / LSTM / GRU', 'Ensembles', 'Genetic algorithms', 'PCA · t-SNE · UMAP', 'Model interpretability'],
  },
  { group: 'AI systems', tone: 'res', items: ['RAG pipelines', 'LLM orchestration (LangChain, Llama)', 'Prompt engineering', 'Agentic workflows'] },
  {
    group: 'Backend, data & cloud',
    tone: 'eng',
    items: ['Spring Boot', 'Apache Kafka', 'GraphQL', 'FastAPI', 'Node.js', 'Express.js', 'REST APIs', 'Microservices', 'PostgreSQL', 'MongoDB', 'Redis', 'GCP (BigQuery, Vertex AI)', 'AWS (EC2, S3, Lambda)', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  { group: 'Tools & practice', tone: 'eng', items: ['Git / GitHub', 'Agile / Scrum', 'Unit testing', 'API design', 'Postman', 'Maven / Gradle', 'PyMOL', 'VOSviewer'] },
];

/* ── Contact ──────────────────────────────────────────────────────────── */

export const contact = {
  kicker: 'Contact',
  title: 'Open to research collaboration and engineering roles.',
  body:
    'I am most useful on problems that sit between the two — a model that has to run in production, a pipeline that has to be reproducible, a system where somebody will eventually ask why it gave that answer. If that is the problem, write to me.',
};
