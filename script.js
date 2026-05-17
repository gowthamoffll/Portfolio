// ============================================================
//  script.js  —  ALL JAVASCRIPT LOGIC
//  Sections:
//    1. Custom Cursor
//    2. Navbar
//    3. Smooth Scroll
//    4. Typing Animation
//    5. Skills Tab Renderer
//    6. Projects Renderer
//    7. Internships Renderer
//    8. Scroll Reveal (fade-in)
//    9. Scroll-to-Top Button
//   10. Init — runs everything on page load
// ============================================================


// ── 1. CUSTOM CURSOR ─────────────────────────────────────────
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  // Dot follows mouse instantly
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Ring follows with a slight lag (smooth lerp)
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Grow cursor when hovering links/buttons
  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('cursor-hover');
      ring.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('cursor-hover');
      ring.classList.remove('cursor-hover');
    });
  });
}


// ── 3. NAVBAR ────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const ham    = document.getElementById('nav-ham');
  const links  = document.getElementById('nav-links');

  // Add scrolled class when page is scrolled down
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Hamburger toggle for mobile
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    links.classList.toggle('open');
  });
}


// ── 4. SMOOTH SCROLL ─────────────────────────────────────────
// Called from onclick attributes in HTML
function smoothScroll(selector) {
  const target = document.querySelector(selector);
  if (target) target.scrollIntoView({ behavior: 'smooth' });

  // Close mobile menu if open
  document.getElementById('nav-links').classList.remove('open');
  document.getElementById('nav-ham').classList.remove('open');
}


// ── 5. TYPING ANIMATION ──────────────────────────────────────
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  let roleIndex   = 0;  // which role we're showing
  let charIndex   = 0;  // how many chars typed so far
  let isDeleting  = false;

  function tick() {
    const current = ROLES[roleIndex];

    if (!isDeleting) {
      // Typing forward
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        // Finished typing — pause then start deleting
        setTimeout(() => { isDeleting = true; tick(); }, 2000);
        return;
      }
      setTimeout(tick, 80);

    } else {
      // Deleting backward
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        // Finished deleting — move to next role
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % ROLES.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 40);
    }
  }

  tick();
}


// ── 6. SKILLS TAB RENDERER ───────────────────────────────────
function initSkills() {
  const panel    = document.getElementById('skill-panel');
  const tabGroup = document.getElementById('skill-tabs');
  if (!panel || !tabGroup) return;

  // Render the correct content for each tab
  function renderTab(tab) {
    if (tab === 'languages' || tab === 'frameworks') {
      const data   = SKILLS[tab];
      const color  = tab === 'languages' ? '#a78bfa' : '#22d3ee';

      panel.innerHTML = `
        <div class="bars-grid">
          ${data.map(skill => `
            <div class="skill-bar-item">
              <div class="bar-header">
                <span class="bar-name">${skill.name}</span>
                <span class="bar-pct" style="color:${color}">${skill.level}%</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill"
                  style="width:0%; background:linear-gradient(90deg, ${color}88, ${color})"
                  data-width="${skill.level}%">
                </div>
              </div>
            </div>
          `).join('')}
        </div>`;

      // Animate bars in after a tiny delay
      setTimeout(() => {
        panel.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
      }, 60);

    } else if (tab === 'tools') {
      panel.innerHTML = `
        <div class="chips">
          ${SKILLS.tools.map(t => `<span class="chip chip-tool">${t}</span>`).join('')}
        </div>`;

    } else if (tab === 'soft') {
      panel.innerHTML = `
        <div class="chips">
          ${SKILLS.softSkills.map(t => `<span class="chip chip-soft">${t}</span>`).join('')}
        </div>`;
    }
  }

  // Default tab
  renderTab('languages');

  // Tab click handler
  tabGroup.addEventListener('click', (e) => {
    if (!e.target.classList.contains('skill-tab')) return;
    document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    renderTab(e.target.dataset.tab);
  });
}


// ── 7. PROJECTS RENDERER ─────────────────────────────────────
function initProjects() {
  const featuredContainer = document.getElementById('featured-projects');
  const gridContainer     = document.getElementById('proj-grid');
  const filterContainer   = document.getElementById('proj-filters');
  if (!featuredContainer || !gridContainer) return;

  const featured = PROJECTS.filter(p => p.featured);
  const others   = PROJECTS.filter(p => !p.featured);

  // ── Featured Cards (large browser-mockup style)
  featuredContainer.innerHTML = featured.map((p, i) => `
    <div class="fp ${i % 2 !== 0 ? 'fp-rev' : ''}">

      <!-- Left: Browser window mockup -->
      <div class="fp-browser">
        <div class="fp-bar">
          <span></span><span></span><span></span>
          <div class="fp-url">${p.live || p.github}</div>
        </div>
        <div class="fp-content">
          <div class="fp-mock">
            <div class="mock-sidebar">
              <div class="ml ml-s"></div>
              <div class="ml"></div>
              <div class="ml ml-m"></div>
              <div class="ml ml-s"></div>
            </div>
            <div class="mock-main">
              <div class="mock-hdr">
                <div class="ml ml-t"></div>
                <div class="ml ml-m"></div>
              </div>
              <div class="mock-body">
                <div class="ml"></div>
                <div class="ml"></div>
                <div class="ml ml-m"></div>
              </div>
            </div>
          </div>
          <div class="fp-badge">${p.category}</div>
        </div>
      </div>

      <!-- Right: Project info -->
      <div class="fp-info">
        <span class="fp-label">Featured Project</span>
        <h3 class="fp-title">${p.title}</h3>
        <div class="card fp-desc"><p>${p.description}</p></div>
        <div class="fp-tech">
          ${p.tech.map(t => `<span>${t}</span>`).join('')}
        </div>
        <div class="fp-links">
          <a href="${p.github}" target="_blank" class="fp-link">
            ${githubSVG(18)} Code
          </a>
          ${p.live ? `
            <a href="${p.live}" target="_blank" class="fp-link fp-link-live">
              ${externalSVG(16)} Live Demo
            </a>` : ''}
        </div>
      </div>

    </div>
  `).join('');

  // ── Get unique categories for filter buttons
  const categories = ['All', ...new Set(others.map(p => p.category))];

  filterContainer.innerHTML = categories.map(cat => `
    <button class="pf-btn ${cat === 'All' ? 'active' : ''}" data-cat="${cat}">${cat}</button>
  `).join('');

  // ── Render project grid cards
  function renderGrid(category) {
    const filtered = category === 'All'
      ? others
      : others.filter(p => p.category === category);

    gridContainer.innerHTML = filtered.map(p => `
      <div class="card proj-card">
        <div class="pc-top">
          <span class="pc-folder">📁</span>
          <div class="pc-links">
            <a href="${p.github}" target="_blank" class="pc-link" title="GitHub">${githubSVG(18)}</a>
            ${p.live ? `<a href="${p.live}" target="_blank" class="pc-link" title="Live">${externalSVG(16)}</a>` : ''}
          </div>
        </div>
        <div class="pc-meta">
          <span class="pc-cat">${p.category}</span>
          <span class="pc-year">${p.year}</span>
        </div>
        <h3 class="pc-title">${p.title}</h3>
        <p class="pc-desc">${p.description}</p>
        <div class="pc-tech">
          ${p.tech.map(t => `<span>${t}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  renderGrid('All');

  // Filter button click
  filterContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('pf-btn')) return;
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderGrid(e.target.dataset.cat);
  });
}


// ── 8. INTERNSHIPS RENDERER ──────────────────────────────────
let activeIntern = 0;

function initInternships() {
  renderInternships();
}

function renderInternships() {
  const listEl   = document.getElementById('intern-list');
  const detailEl = document.getElementById('intern-detail');
  if (!listEl || !detailEl) return;

  // ── Company list (left sidebar)
  listEl.innerHTML = INTERNSHIPS.map((d, i) => `
    <button
      class="intern-btn ${i === activeIntern ? 'active' : ''}"
      onclick="selectIntern(${i})">
      <div class="intern-logo"
        style="background:${d.color}20; border-color:${d.color}50; color:${d.color}">
        ${d.logo}
      </div>
      <div class="intern-btn-text">
        <span class="intern-co">${d.company}</span>
        <span class="intern-role-sm">${d.role}</span>
      </div>
      <span class="intern-arrow">→</span>
    </button>
  `).join('');

  // ── Detail panel (right side)
  const d = INTERNSHIPS[activeIntern];
  detailEl.innerHTML = `
    <div class="intern-detail-hdr">
      <div class="intern-detail-logo"
        style="background:${d.color}15; border-color:${d.color}50; color:${d.color}">
        ${d.logo}
      </div>
      <div>
        <h3 class="intern-detail-role">${d.role}</h3>
        <div class="intern-detail-co" style="color:${d.color}">@ ${d.company}</div>
        <div class="intern-detail-meta">
          <span>📅 ${d.duration}</span>
          <span>📍 ${d.location}</span>
        </div>
      </div>
    </div>

    <p class="intern-detail-desc">${d.description}</p>

    <h4 class="intern-section-title">Key Achievements</h4>
    <ul class="ach-list">
      ${d.achievements.map(a => `
        <li class="ach-item">${a}</li>
      `).join('')}
    </ul>

    <h4 class="intern-section-title" style="margin-top:24px">Technologies Used</h4>
    <div class="intern-tech-chips">
      ${d.tech.map(t => `
        <span class="intern-tech-chip"
          style="border-color:${d.color}40; color:${d.color}; background:${d.color}12">
          ${t}
        </span>
      `).join('')}
    </div>

    ${d.certificate ? `
    <h4 class="intern-section-title" style="margin-top:24px">Internship Certificate</h4>
    <ul class="ach-list">
      <li class="ach-item">
        📋 ${d.company} –
        <a href="${d.certificate}" target="_blank" class="cert-link">
          View Certificate ↗
        </a>
      </li>
    </ul>` : ''}
  `;
}

// Called when a company button is clicked
function selectIntern(index) {
  activeIntern = index;
  renderInternships();
}


// ── 9. SCROLL REVEAL (fade-in animations) ────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once, don't repeat
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}


// ── 11. SCROLL-TO-TOP BUTTON ─────────────────────────────────
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
}


// ── HELPER: SVG Icons (used in JS-rendered HTML) ──────────────
function githubSVG(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
  </svg>`;
}

function externalSVG(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>
  </svg>`;
}


// ── 10. INIT — runs when DOM is ready ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initTyping();
  initSkills();
  initProjects();
  initInternships();
  initScrollReveal();
  initScrollTop();
});
