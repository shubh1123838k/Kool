export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface SkillItem {
  number: string;
  title: string;
  details: string;
}

export interface ProjectSlide {
  id: string;
  tabNumber: string;
  tabLabel: string;
  type: 'image' | 'video';
  src: string;
  poster?: string;
  alt: string;
  caption: string;
}

export interface ProjectActionLink {
  label: string;
  ariaLabel: string;
  type: 'external' | 'demo';
  href?: string;
  icon: 'arrow' | 'github' | 'playstore' | 'play';
  videoSlide?: number;
}

export interface ProjectCaseStudy {
  id: 'memorae' | 'workforge' | 'letstalk' | 'nexachat';
  title: string;
  description: string;
  coverSrc: string;
  coverAlt: string;
  actions: ProjectActionLink[];
  slides: ProjectSlide[];
  ideaParagraphs: string[];
  technicalApproach: string;
  keyDetails: string[];
  builtWith: string;
  footerLinks: Array<{ label: string; ariaLabel: string; href: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'work', label: 'Projects', href: '#work' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const SKILLS_DATA: SkillItem[] = [
  {
    number: '01',
    title: 'Python & Data Science',
    details: 'Python · NumPy · Pandas · Matplotlib · Data Insights · VS Code',
  },
  {
    number: '02',
    title: 'AI / ML & Computer Vision',
    details: 'OpenCV · AI For Beginners · Prompt Engineering · Chat Assistants · Telegram Bots',
  },
  {
    number: '03',
    title: 'Databases & SQL',
    details: 'MySQL · SQL (Basic) · Relational Queries · Data Management',
  },
  {
    number: '04',
    title: 'Startup & Leadership',
    details: 'Founder @Arcitic (Mar 2025–Present) · Product Building · Logical Problem-Solving · Collaborations',
  },
  {
    number: '05',
    title: 'Certifications',
    details: "CS50's Introduction to Programming with Python · Python (Basic) · Python for Beginners · SQL (Basic)",
  },
  {
    number: '06',
    title: 'Languages & Honors',
    details: 'English (Native or Bilingual) · Hindi (Native or Bilingual) · State Tournament Award · Weather Data Analyzer',
  },
];

export const PROJECTS_DATA: ProjectCaseStudy[] = [
  {
    id: 'memorae',
    title: 'MeMorae',
    description: 'Memory that carries AI context across sessions.',
    coverSrc: '/assets/projects/memorae-supplied-cover.png',
    coverAlt: 'MeMorae home page showing persistent AI memory and knowledge graph',
    actions: [
      {
        label: 'Live',
        ariaLabel: 'MeMorae — Live Website',
        type: 'external',
        href: 'https://memorae.tech',
        icon: 'arrow',
      },
      {
        label: 'Demo',
        ariaLabel: 'Play MeMorae demo',
        type: 'demo',
        icon: 'play',
        videoSlide: 2,
      },
    ],
    slides: [
      {
        id: '0',
        tabNumber: '01',
        tabLabel: 'MeMorae',
        type: 'image',
        src: '/assets/projects/memorae-supplied-cover.png',
        alt: 'MeMorae home page showing persistent AI memory and knowledge graph',
        caption: 'MeMorae · project preview',
      },
      {
        id: '1',
        tabNumber: '02',
        tabLabel: 'Public website',
        type: 'image',
        src: '/assets/projects/memorae-site-2026-10-22.png',
        alt: 'MeMorae public website captured from memorae.tech',
        caption: 'Public website · real capture',
      },
      {
        id: '2',
        tabNumber: '03',
        tabLabel: 'Demo',
        type: 'video',
        src: '/assets/projects/memorae-demo.mp4',
        poster: '/assets/projects/memorae-demo-poster.jpg',
        alt: 'MeMorae animated product walkthrough',
        caption: 'Product walkthrough · existing project video',
      },
    ],
    ideaParagraphs: [
      'Useful context is often lost between agent sessions. A longer prompt alone does not provide a durable, reviewable memory system.',
      'I built a shared memory service with scoped ingestion, retrieval, and review, accessible through an API, LangChain integration, and MCP tools.',
    ],
    technicalApproach:
      'FastAPI accepts scoped requests and persists records in PostgreSQL. Background workers handle extraction and indexing. Qdrant, OpenSearch, and Neo4j are rebuildable retrieval projections; PostgreSQL remains the source of truth.',
    keyDetails: [
      'Project-scoped memory with provenance and review states.',
      'Hybrid retrieval using vector, lexical, and graph indexes.',
      'MCP tools and documented LangChain/LangGraph integration.',
    ],
    builtWith:
      'Python · FastAPI · LangChain · LangGraph integration · MCP · PostgreSQL · Qdrant · OpenSearch · Neo4j · Redis · Next.js',
    footerLinks: [
      { label: 'Live', ariaLabel: 'MeMorae — Live Website', href: 'https://memorae.tech' },
    ],
  },
  {
    id: 'workforge',
    title: 'WorkForge',
    description: 'Workflows that turn project activity into action.',
    coverSrc: '/assets/projects/workforge-supplied-cover.png',
    coverAlt: 'WorkForge home page showing workflow integrations',
    actions: [
      {
        label: 'Live',
        ariaLabel: 'WorkForge — Live Website',
        type: 'external',
        href: 'https://workforge.tech',
        icon: 'arrow',
      },
      {
        label: 'GitHub',
        ariaLabel: 'WorkForge — GitHub',
        type: 'external',
        href: 'https://github.com/KeshavKandoi/AI-AUTOMATION',
        icon: 'github',
      },
      {
        label: 'Demo',
        ariaLabel: 'Play WorkForge demo',
        type: 'demo',
        icon: 'play',
        videoSlide: 3,
      },
    ],
    slides: [
      {
        id: '0',
        tabNumber: '01',
        tabLabel: 'WorkForge',
        type: 'image',
        src: '/assets/projects/workforge-supplied-cover.png',
        alt: 'WorkForge home page showing workflow integrations',
        caption: 'WorkForge · project preview',
      },
      {
        id: '1',
        tabNumber: '02',
        tabLabel: 'Public home page',
        type: 'image',
        src: '/assets/projects/workforge-home.png',
        alt: 'WorkForge dark-theme home page showing workflow integrations',
        caption: 'Public home page · real capture',
      },
      {
        id: '2',
        tabNumber: '03',
        tabLabel: 'Workflow automations',
        type: 'image',
        src: '/assets/projects/workforge-workflows.png',
        alt: 'WorkForge Workflow Automations screen showing example release, issue, and review workflows',
        caption: 'Workflow automations · repository demo image',
      },
      {
        id: '3',
        tabNumber: '04',
        tabLabel: 'Demo',
        type: 'video',
        src: '/assets/projects/workforge-cinematic-16x9.mp4',
        poster: '/assets/projects/workforge-video-poster.jpg',
        alt: 'WorkForge cinematic product walkthrough',
        caption: 'Cinematic walkthrough · supplied video',
      },
    ],
    ideaParagraphs: [
      'Project events, scheduled work, and application integrations create repetitive coordination tasks across disconnected tools.',
      'I built a workspace that connects GitHub, email, calendar, and Discord to workflows and scheduled actions, with a distinct human approval path for task emails.',
    ],
    technicalApproach:
      'A React/Vite client calls FastAPI. Supabase stores organization data and encrypted OAuth tokens. Webhooks trigger matching workflows, while scheduled jobs run inside the backend process. Gemini supports summaries and suggestions.',
    keyDetails: [
      'Verified GitHub webhooks with duplicate-event handling.',
      'Scheduled actions and organization-scoped integrations.',
      'AI-assisted summaries and task suggestions.',
    ],
    builtWith: 'React · Vite · Python · FastAPI · Supabase · Gemini · OAuth',
    footerLinks: [
      { label: 'Live', ariaLabel: 'WorkForge — Live Website', href: 'https://workforge.tech' },
      {
        label: 'GitHub',
        ariaLabel: 'WorkForge — GitHub',
        href: 'https://github.com/KeshavKandoi/AI-AUTOMATION',
      },
    ],
  },
  {
    id: 'letstalk',
    title: 'LetsTalk',
    description: 'Meet people nearby who are ready to talk in person.',
    coverSrc: '/assets/projects/letstalk-supplied-cover.png',
    coverAlt: 'LetsTalk cover showing nearby people and conversation discovery',
    actions: [
      {
        label: 'Google Play',
        ariaLabel: 'LetsTalk — Google Play',
        type: 'external',
        href: 'https://play.google.com/store/apps/details?id=com.keshavkandoi.letstalk',
        icon: 'playstore',
      },
      {
        label: 'Live',
        ariaLabel: 'LetsTalk — Live Website',
        type: 'external',
        href: 'https://letstalks.app',
        icon: 'arrow',
      },
      {
        label: 'GitHub',
        ariaLabel: 'LetsTalk — GitHub',
        type: 'external',
        href: 'https://github.com/KeshavKandoi/LetsTalk',
        icon: 'github',
      },
    ],
    slides: [
      {
        id: '0',
        tabNumber: '01',
        tabLabel: 'LetsTalk',
        type: 'image',
        src: '/assets/projects/letstalk-supplied-cover.png',
        alt: 'LetsTalk cover showing nearby people and conversation discovery',
        caption: 'LetsTalk · project preview',
      },
      {
        id: '1',
        tabNumber: '02',
        tabLabel: 'Public website',
        type: 'image',
        src: '/assets/projects/letstalk-site.png',
        alt: 'LetsTalk public website showing nearby places and conversation discovery',
        caption: 'Public website · real capture',
      },
    ],
    ideaParagraphs: [
      'Being in the same place does not tell you who is open to a conversation.',
      'LetsTalk lets people discover nearby places, signal readiness, and connect in person.',
    ],
    technicalApproach:
      'A React interface uses TanStack Start server functions for place discovery, profiles, and readiness. PostgreSQL stores application records through Drizzle; Better Auth manages authentication.',
    keyDetails: [
      'Place discovery and ready status.',
      'QR-based connection flows.',
      'Profiles and authenticated sessions.',
    ],
    builtWith: 'React · TypeScript · TanStack Start · PostgreSQL · Drizzle ORM · Better Auth',
    footerLinks: [
      {
        label: 'Google Play',
        ariaLabel: 'LetsTalk — Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.keshavkandoi.letstalk',
      },
      { label: 'Live', ariaLabel: 'LetsTalk — Live Website', href: 'https://letstalks.app' },
      {
        label: 'GitHub',
        ariaLabel: 'LetsTalk — GitHub',
        href: 'https://github.com/KeshavKandoi/LetsTalk',
      },
    ],
  },
  {
    id: 'nexachat',
    title: 'NexaChat',
    description: 'Local AI conversations and document search on your machine.',
    coverSrc: '/assets/projects/nexachat-supplied-cover.png',
    coverAlt: 'NexaChat home page showing local AI models and offline runtime',
    actions: [
      {
        label: 'Live',
        ariaLabel: 'NexaChat — Live Website',
        type: 'external',
        href: 'https://offline-chat-bot.vercel.app/',
        icon: 'arrow',
      },
      {
        label: 'GitHub',
        ariaLabel: 'NexaChat — GitHub',
        type: 'external',
        href: 'https://github.com/KeshavKandoi/OfflineChatBot',
        icon: 'github',
      },
      {
        label: 'Demo',
        ariaLabel: 'Play NexaChat demo',
        type: 'demo',
        icon: 'play',
        videoSlide: 2,
      },
    ],
    slides: [
      {
        id: '0',
        tabNumber: '01',
        tabLabel: 'NexaChat',
        type: 'image',
        src: '/assets/projects/nexachat-supplied-cover.png',
        alt: 'NexaChat home page showing local AI models and offline runtime',
        caption: 'NexaChat · project preview',
      },
      {
        id: '1',
        tabNumber: '02',
        tabLabel: 'Public website',
        type: 'image',
        src: '/assets/projects/nexachat-local-ai.png',
        alt: 'NexaChat public project website',
        caption: 'Public website · real capture',
      },
      {
        id: '2',
        tabNumber: '03',
        tabLabel: 'Demo',
        type: 'video',
        src: '/assets/projects/nexabot-animated-16x9.mp4',
        poster: '/assets/projects/nexachat-chat-feature.png',
        alt: 'NexaChat product walkthrough',
        caption: 'Product walkthrough',
      },
    ],
    ideaParagraphs: [
      'Cloud-only assistants are a poor fit when a conversation or document needs to remain on a local machine.',
      'I built a desktop assistant with a local model path through Ollama and a document retrieval pipeline. Local mode runs inference on the device; optional cloud integrations are separate.',
    ],
    technicalApproach:
      'Electron hosts the React client and coordinates the local backend. FastAPI handles chat and document requests; Ollama runs local models, while the retrieval pipeline indexes document chunks in ChromaDB.',
    keyDetails: [
      'Local model inference through Ollama.',
      'Document ingestion and retrieval with ChromaDB.',
      'An Electron shell around a React interface and Python backend.',
    ],
    builtWith: 'Electron · React · TypeScript · Python · FastAPI · Ollama · LangGraph · ChromaDB',
    footerLinks: [
      {
        label: 'Live',
        ariaLabel: 'NexaChat — Live Website',
        href: 'https://offline-chat-bot.vercel.app/',
      },
      {
        label: 'GitHub',
        ariaLabel: 'NexaChat — GitHub',
        href: 'https://github.com/KeshavKandoi/OfflineChatBot',
      },
    ],
  },
];

export const IDLE_TYPEWRITER_LINES = [
  'A conversation worth starting.',
  'Some ideas deserve a note.',
  "Write when you're ready.",
];

export const TYPEWRITER_ROWS: string[][] = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Backspace'],
  ['@', '#', '!', '?', ' ', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'Enter'],
];
