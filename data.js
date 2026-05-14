// ============================================================
//  data.js  —  YOUR PORTFOLIO CONTENT
//  ✏️  Edit this file to update all your content.
//  No need to touch script.js or style.css for content changes.
// ============================================================


// ── TYPING ROLES ─────────────────────────────────────────────
// Words that cycle in the hero typing animation
const ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Data Analytics',
  'Python Developer',
  'Problem Solver',
];


// ── SKILLS ───────────────────────────────────────────────────
// level: 0–100 (shown as a progress bar percentage)
const SKILLS = {

  languages: [
    { name: 'Python',       level: 95 },
    { name: 'HTML',         level: 90 },
    { name: 'JavaScript',   level: 80 },
    { name: 'C',            level: 65 },
    { name: 'SQL',          level: 75 },
  ],

  frameworks: [
    { name: 'React.js',    level: 72 },
    { name: 'Node.js',     level: 78 },
    { name: 'Flask',       level: 70 },
    { name: 'Django',      level: 75 },
    { name: 'Streamlit',   level: 80 },
  ],

  // These show as tags, no level needed
  tools: [
    'Git & GitHub', 'Notepad++',    'Linux',      'VS Code',
    'PyCharm',      'Figma',        'Power BI',   'SQLite',
    'Google Cloud', 'Firebase',     'MS Excel',   'Webpack',
  ],

  softSkills: [
    'Problem Solving',    'Team Collaboration', 'Technical Writing',
          'Communication',      'Leadership',
  ],
};


// ── PROJECTS ─────────────────────────────────────────────────
// featured: true  →  shown in the large featured section (max 2)
// featured: false →  shown in the filterable grid below
const PROJECTS = [
  {
    id: 1,
    featured: true,
    title: 'jarvis-AI',
    category: 'AI',
    year: '2025',
    description: 'J.A.R.V.I.S. (Just A Rather Very Intelligent System) A cinematic, full-stack AI assistant application featuring a custom-built Marvel HUD interface. Powered by Google’s Gemini 2.5 Flash model, (voice and text) with (TTS) output.',
    tech: ['Python', 'Streamlit', 'Google Generative AI'],
    github: 'https://github.com/gowthamoffll/jarvis-mark-80/',
    live: null,
  },
  // {
  //   id: 2,
  //   featured: true,
  //   title: 'Rain Fall Predictor',
  //   category: 'AI / ML',
  //   year: '2024',
  //   description: 'Machine learning web app that predicts common diseases based on symptoms using Random Forest and SVM models. Includes an interactive symptom input UI with confidence scores and medical recommendations.',
  //   tech: ['Python', 'Flask', 'scikit-learn', 'React', 'Chart.js'],
  //   github: 'https://github.com/yourusername/disease-predictor',
  //   live: null, // set to null if no live link
  // },
  {
    id: 3,
    featured: false,
    title: 'calcify-web-app',
    category: 'Frontend',
    year: '2025',
    description: 'CALCIFY is a sleek, glassmorphic calculator application designed for a premium user experience. It combines a minimalist aesthetic with robust functionality, including keyboard support and advanced CSS animations.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/gowthamoffll/calcify-web-app',
    live: 'https://gowthamoffll.github.io/calcify-web-app/',
  },
  {
    id: 4,
    featured: false,
    title: 'Zomato-landing-page',
    category: 'Frontend',
    year: '2025',
    description: 'A pixel-perfect, responsive landing page inspired by Zomato. This project focuses on the food and nightlife scene in Chennai, offering a clean user interface with interactive elements and smooth animations.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/gowthamoffll/zomato-landing-page-replica',
    live: 'https://gowthamoffll.github.io/zomato-landing-page-replica/',
  },
  {
    id: 5,
    featured: false,
    title: 'railway-reservation-system',
    category: 'Backend',
    year: '2026',
    description: 'This is a professional Streamlit application integrated with an SQLite backend to manage train ticket bookings. It features a modern web UI with custom styling and an interactive seat map.',
    tech: ['Python', 'SQLite', 'Streamlit', 'Pandas'],
    github: 'https://github.com/gowthamoffll/railway-reservation-system',
    live: null,
  },
  {
    id: 6,
    featured: false,
    title: 'Snake-game',
    category: 'Python',
    year: '2026',
    description: 'A retro-inspired Snake game built with Pygame featuring a polished Nokia "greenscreen" aesthetic, smooth animations, and a wrap-around grid system.',
    tech: ['Python', 'Pygame'],
    github: 'https://github.com/gowthamoffll/snake-game',
    live: null,
  },
  {
    id: 7,
    featured: false,
    title: 'Swiggy-webpage',
    category: 'node.js',
    year: '2026',
    description: 'A lightweight, full-stack Swiggy clone built with Node.js 22 (using experimental-sqlite), Express 5, and a vanilla JS/CSS frontend. Features JWT authentication, secure password hashing, and a persistent SQLite database.',
    tech: ['HTML', 'CSS', 'SQLite', 'Node.js'],
    github: 'https://github.com/gowthamoffll/Swiggy-webpage',
    live: null,
  },
];


// ── INTERNSHIPS ──────────────────────────────────────────────
// color: accent color for that company card
// logo:  1–2 letter abbreviation shown in the logo circle
const INTERNSHIPS = [
  {
    id: 1,
    company: 'NoviTech R&D Pvt Ltd',
    role: 'Artificial Intelligence Intern',
    duration: 'Jun 2025 – Jul 2024',
    location: 'Coimbatore, Tamil Nadu (Online)',
    description: 'Gained practical experience in AI methodologies and R&D workflows under the guidance of industry experts in Coimbatore.',
    achievements: [
      'Mastered complex AI tools and methodologies',
      'Earned a satisfactory performance rating from the HR Manager',
    ],
    tech: ['VS Code', 'Python', 'ChatGPT', 'Gemini'],
    logo: 'N',
    color: '#4285F4',
  },
  {
    id: 2,
    company: 'iNetz Technologies Pvt Ltd',
    role: 'web Development Intern',
    duration: 'Jul 2025 – Aug 2025',
    location: 'Chennai, Tamil Nadu (On-site)',
    description: 'Completed a professional Web Development internship at iNetz Technologies Pvt Ltd, Chennai, focusing on industry-standard development practices and technical training during a intensive one-month tenure',
    achievements: [
      'Developed and maintained responsive web interfaces using HTML, CSS, JavaScript, and React JS.',
      'Collaborated with the development team on front-end feature implementation and debugging.',
      'Presented technical demo to senior product managers',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'Python', 'React JS'],
    logo: 'I',
    color: '#E32729',
  },
  {
    id: 3,
    company: 'NoviTech R&D Pvt Ltd',
    role: 'Data Analytics Intern',
    duration: 'Sep 2025 – Oct 2025',
    location: 'Chennai, Tamil Nadu (Online)',
    description: 'Completed a specialized one-month Data Analytics internship at NoviTech R&D Private Limited, in Coimbatore. The program focused on practical research and development within the data analytics domain.',
    achievements: [
      'Performed data cleaning, analysis, and visualization using Power BI and MS Excel.',
      'Delivered actionable insights through interactive dashboards and reports.',
      'Successfully fulfilled internship requirements and project milestones',
    ],
    tech: ['Python', 'MS Excel', 'Power BI'],
    logo: 'N',
    color: '#00a86b',
  },
];
