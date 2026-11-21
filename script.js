// ============================================================
//  script.js — FINAL COMBINED PORTFOLIO JAVASCRIPT
//  Features from both portfolios merged:
//
//  FROM PORTFOLIO 1 (Premium):
//    1.  Loader Screen
//    2.  Three.js Particle Network (interactive)
//    3.  Scroll Progress Bar
//    4.  Parallax Hero
//    5.  Tilt Effect on Project Cards
//    6.  Animated Stat Counters
//    7.  GSAP Scroll Reveal (timeline items)
//
//  FROM PORTFOLIO 2 (Gowtham's):
//    8.  Custom Cursor (with lerp)
//    9.  Navbar (scroll + hamburger)
//   10.  Typing Animation
//   11.  Skills Tab Renderer
//   12.  Projects Renderer (featured + grid + filter)
//   13.  Internships Renderer (interactive panel)
//   14.  Scroll Reveal (fade-in observer)
//   15.  Scroll-to-Top Button
//   16.  Mobile Nav
// ============================================================


// ══════════════════════════════════════════════════════════
//  1. LOADER
// ══════════════════════════════════════════════════════════
function initLoader() {
  window.addEventListener('load', () => {
    // Wait for fill animation (2.2s) then fade out
    setTimeout(() => {
      document.body.classList.add('loaded');
      // Start all other inits AFTER loader fades
      initAfterLoad();
      // Re-check all fade-in elements now that loader is gone
      setTimeout(refreshScrollReveal, 100);
      // Fallback: force-reveal anything still hidden after 4s
      setTimeout(() => {
        document.querySelectorAll('.fade-in:not(.visible)').forEach(el => el.classList.add('visible'));
      }, 4000);
    }, 2400);
  });
}


// ══════════════════════════════════════════════════════════
//  2. THREE.JS PARTICLE NETWORK
// ══════════════════════════════════════════════════════════
function initThreeJS() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 3;

  // Particles
  const COUNT = window.innerWidth < 768 ? 600 : 1200;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 14;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0x7c3aed, size: 0.018, transparent: true, opacity: 0.45
  });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Connection lines
  const lineMat = new THREE.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.04 });
  const lineGeo = new THREE.BufferGeometry();
  const linePos = [];
  for (let i = 0; i < 100; i++) {
    const a = Math.floor(Math.random() * COUNT);
    const b = Math.floor(Math.random() * COUNT);
    linePos.push(
      positions[a*3], positions[a*3+1], positions[a*3+2],
      positions[b*3], positions[b*3+1], positions[b*3+2]
    );
  }
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePos), 3));
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  // Mouse influence
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 0.15;
    my = (e.clientY / window.innerHeight - 0.5) * 0.15;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.0003;
    particles.rotation.x = t * 0.25 + my;
    particles.rotation.y = t * 0.4  + mx;
    lines.rotation.x     = t * 0.25 + my;
    lines.rotation.y     = t * 0.4  + mx;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}


// ══════════════════════════════════════════════════════════
//  3. SCROLL PROGRESS BAR
// ══════════════════════════════════════════════════════════
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  });
}


// ══════════════════════════════════════════════════════════
//  4. PARALLAX HERO
// ══════════════════════════════════════════════════════════
function initParallax() {
  const content = document.querySelector('.hero-content');
  const visual  = document.querySelector('.hero-avatar-col');
  if (!content || !visual) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      content.style.transform = `translateY(${y * 0.15}px)`;
      visual.style.transform  = `translateY(${y * 0.08}px)`;
    }
  });
}


// ══════════════════════════════════════════════════════════
//  5. TILT EFFECT on Project Cards
// ══════════════════════════════════════════════════════════
function attachTiltEffect() {
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      card.style.transform = `perspective(700px) rotateY(${x * 0.05}deg) rotateX(${-y * 0.05}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


// ══════════════════════════════════════════════════════════
//  6. ANIMATED STAT COUNTERS
// ══════════════════════════════════════════════════════════
function animateSingleCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.classList.contains('stat-val') ? '+' : '+';
  let startTime = null;
  const duration = 1600;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(ease * target) + (target >= 3 ? '+' : '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + (target >= 3 ? '+' : '');
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-count]').forEach(animateSingleCounter);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  // Hero stats
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) io.observe(heroStats);

  // About counters
  const aboutRow = document.querySelector('.about-counter-row');
  if (aboutRow) io.observe(aboutRow);
}


// ══════════════════════════════════════════════════════════
//  7. GSAP SCROLL REVEAL (enhanced version)
// ══════════════════════════════════════════════════════════
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Section titles stagger
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
  });
}


// ══════════════════════════════════════════════════════════
//  8. CUSTOM CURSOR
// ══════════════════════════════════════════════════════════
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .skill-cat, .tech-item, .chip').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('cursor-hover'); ring.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('cursor-hover'); ring.classList.remove('cursor-hover'); });
  });
}


// ══════════════════════════════════════════════════════════
//  9. NAVBAR
// ══════════════════════════════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const ham    = document.getElementById('nav-ham');
  const links  = document.getElementById('nav-links');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  if (ham) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      if (links) links.classList.toggle('open');
    });
  }
}


// ══════════════════════════════════════════════════════════
//  10. TYPING ANIMATION
// ══════════════════════════════════════════════════════════
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el || typeof ROLES === 'undefined') return;

  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;

  function tick() {
    const current = ROLES[roleIndex];
    if (!isDeleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        setTimeout(() => { isDeleting = true; tick(); }, 2000);
        return;
      }
      setTimeout(tick, 80);
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
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


// ══════════════════════════════════════════════════════════
//  11. SKILLS TAB RENDERER
// ══════════════════════════════════════════════════════════
function initSkills() {
  const panel    = document.getElementById('skill-panel');
  const tabGroup = document.getElementById('skill-tabs');
  if (!panel || !tabGroup || typeof SKILLS === 'undefined') return;

  function renderTab(tab) {
    if (tab === 'languages' || tab === 'frameworks') {
      const data  = SKILLS[tab];
      const color = tab === 'languages' ? '#a78bfa' : '#22d3ee';
      panel.innerHTML = `
        <div class="bars-grid">
          ${data.map(s => `
            <div class="skill-bar-item">
              <div class="bar-header">
                <span class="bar-name">${s.name}</span>
                <span class="bar-pct" style="color:${color}">${s.level}%</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill"
                  style="width:0%;background:linear-gradient(90deg,${color}88,${color})"
                  data-width="${s.level}%"></div>
              </div>
            </div>
          `).join('')}
        </div>`;
      setTimeout(() => {
        panel.querySelectorAll('.bar-fill').forEach(bar => { bar.style.width = bar.dataset.width; });
      }, 60);
    } else if (tab === 'tools') {
      panel.innerHTML = `<div class="chips">${SKILLS.tools.map(t => `<span class="chip chip-tool">${t}</span>`).join('')}</div>`;
    } else if (tab === 'compliance') {
      panel.innerHTML = `<div class="chips">${SKILLS.compliance.map(t => `<span class="chip chip-compliance">${t}</span>`).join('')}</div>`;
    } else if (tab === 'soft') {
      panel.innerHTML = `<div class="chips">${SKILLS.softSkills.map(t => `<span class="chip chip-soft">${t}</span>`).join('')}</div>`;
    }
  }

  renderTab('languages');

  tabGroup.addEventListener('click', e => {
    if (!e.target.classList.contains('skill-tab')) return;
    document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    renderTab(e.target.dataset.tab);
  });
}

// ══════════════════════════════════════════════════════════
//  12. PROJECTS RENDERER
// ══════════════════════════════════════════════════════════
function initProjects() {
  const gridEl   = document.getElementById('new-proj-grid');
  const filterEl = document.getElementById('proj-filters');
  if (!gridEl || typeof PROJECTS === 'undefined') return;

  // ── Filters
  const cats = ['All', ...new Set(PROJECTS.map(p => p.category))];
  if (filterEl) {
    filterEl.innerHTML = cats.map(c =>
      `<button class="pf-btn ${c === 'All' ? 'active' : ''}" data-cat="${c}">${c}</button>`
    ).join('');
  }

  // ── Card renderer
  function renderGrid(cat) {
    const filtered = cat === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === cat);
    gridEl.innerHTML = filtered.map(p => `
      <div class="np-card">
        <div class="np-img">
          <span class="np-emoji">${p.icon}</span>
        </div>
        <div class="np-body">
          <div class="np-tags">
            ${p.tech.map(t => `<span class="np-tag">${t}</span>`).join('')}
          </div>
          <h3 class="np-title">${p.title}</h3>
          <p class="np-desc">${p.description}</p>
          <div class="np-links">
            ${p.live ? `<a href="${p.live}" target="_blank" class="np-btn np-btn-primary">Live Demo ↗</a>` : ''}
            <a href="${p.github}" target="_blank" class="np-btn np-btn-ghost">GitHub</a>
          </div>
        </div>
      </div>
    `).join('');

    setTimeout(attachTiltEffect, 50);
    setTimeout(refreshScrollReveal, 60);
  }

  renderGrid('All');

  if (filterEl) {
    filterEl.addEventListener('click', e => {
      if (!e.target.classList.contains('pf-btn')) return;
      document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderGrid(e.target.dataset.cat);
    });
  }
}


// ══════════════════════════════════════════════════════════
//  CONTACT FORM HANDLER
// ══════════════════════════════════════════════════════════
async function submitContactForm() {
  const name    = document.getElementById('cf-name')?.value.trim();
  const email   = document.getElementById('cf-email')?.value.trim();
  const message = document.getElementById('cf-message')?.value.trim();
  const fb      = document.getElementById('cf-feedback');
  const btn     = document.getElementById('cf-submit');

  if (!name || !email || !message) {
    fb.textContent = '⚠️ Please fill in all fields.';
    fb.className = 'cf-feedback cf-error';
    return;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    fb.textContent = '⚠️ Please enter a valid email address.';
    fb.className = 'cf-feedback cf-error';
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;
  try {
    const res = await fetch('https://formspree.io/f/mljbwldr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    if (!res.ok) throw new Error('Request failed');
    fb.textContent = "✅ Message sent! I'll get back to you soon.";
    fb.className = 'cf-feedback cf-success';
    ['cf-name', 'cf-email', 'cf-message'].forEach(id => document.getElementById(id).value = '');
  } catch (err) {
    fb.textContent = '❌ Could not send. Please email me directly instead.';
    fb.className = 'cf-feedback cf-error';
  }
  btn.textContent = 'Send Message →';
  btn.disabled = false;
  setTimeout(() => { fb.textContent = ''; fb.className = 'cf-feedback'; }, 5000);
}


// ══════════════════════════════════════════════════════════
//  13. INTERNSHIPS RENDERER
// ══════════════════════════════════════════════════════════
let activeIntern = 0;

function initInternships() {
  renderInternships();
}

function renderInternships() {
  const listEl   = document.getElementById('intern-list');
  const detailEl = document.getElementById('intern-detail');
  if (!listEl || !detailEl || typeof INTERNSHIPS === 'undefined') return;

  // Company list
  listEl.innerHTML = INTERNSHIPS.map((d, i) => `
    <button class="intern-btn ${i === activeIntern ? 'active' : ''}" onclick="selectIntern(${i})">
      <div class="intern-logo" style="background:${d.color}20;border-color:${d.color}50;color:${d.color}">${d.logo}</div>
      <div class="intern-btn-text">
        <span class="intern-co">${d.company}</span>
        <span class="intern-role-sm">${d.role}</span>
      </div>
      <span class="intern-arrow">→</span>
    </button>
  `).join('');

  // Detail panel
  const d = INTERNSHIPS[activeIntern];
  detailEl.innerHTML = `
    <div class="intern-detail-hdr">
      <div class="intern-detail-logo" style="background:${d.color}15;border-color:${d.color}50;color:${d.color}">${d.logo}</div>
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
      ${d.achievements.map(a => `<li class="ach-item">${a}</li>`).join('')}
    </ul>

    <h4 class="intern-section-title" style="margin-top:24px">Technologies Used</h4>
    <div class="intern-tech-chips">
      ${d.tech.map(t => `
        <span class="intern-tech-chip" style="border-color:${d.color}40;color:${d.color};background:${d.color}12">${t}</span>
      `).join('')}
    </div>

    ${d.certificate ? `
      <h4 class="intern-section-title" style="margin-top:24px">Internship Certificate</h4>
      <ul class="ach-list">
        <li class="ach-item">
          📋 ${d.company} –
          <a href="${d.certificate}" target="_blank" class="cert-link">View Certificate ↗</a>
        </li>
      </ul>
    ` : ''}
  `;
}

function selectIntern(index) {
  activeIntern = index;
  renderInternships();
}

// ══════════════════════════════════════════════════════════
//  13b. PROFESSIONAL EXPERIENCE RENDERER
// ══════════════════════════════════════════════════════════
function initExperience() {
  const detailEl = document.getElementById('exp-detail');
  if (!detailEl || typeof EXPERIENCE === 'undefined') return;

  detailEl.innerHTML = EXPERIENCE.map(d => `
    <div class="intern-detail-hdr">
      <div class="intern-detail-logo" style="background:${d.color}15;border-color:${d.color}50;color:${d.color}">${d.logo}</div>
      <div>
        <span class="exp-pill"><span class="exp-pill-dot"></span>Current Role</span>
        <h3 class="intern-detail-role">${d.role}</h3>
        <div class="intern-detail-co" style="color:${d.color}">@ ${d.company}</div>
        <div class="intern-detail-meta">
          <span>📅 ${d.duration}</span>
          <span>📍 ${d.location}</span>
        </div>
      </div>
    </div>

    <div class="market-stats-row">
      <div class="market-stat"><span class="ms-val">📈</span><span class="ms-lbl">Domain</span><span class="ms-sub">Stock Market</span></div>
      <div class="market-stat"><span class="ms-val">🏦</span><span class="ms-lbl">Regulator</span><span class="ms-sub">SEBI</span></div>
      <div class="market-stat"><span class="ms-val">🛡️</span><span class="ms-lbl">Function</span><span class="ms-sub">Compliance</span></div>
      <div class="market-stat"><span class="ms-val">🎯</span><span class="ms-lbl">Focus</span><span class="ms-sub">Trade Surveillance</span></div>
    </div>

    <p class="intern-detail-desc">${d.description}</p>

    <h4 class="intern-section-title">Key Responsibilities</h4>
    <ul class="ach-list">
      ${d.achievements.map(a => `<li class="ach-item">${a}</li>`).join('')}
    </ul>

    <h4 class="intern-section-title" style="margin-top:24px">Focus Areas</h4>
    <div class="intern-tech-chips">
      ${d.tech.map(t => `
        <span class="intern-tech-chip" style="border-color:${d.color}40;color:${d.color};background:${d.color}12">${t}</span>
      `).join('')}
    </div>

    ${d.regulators ? `
      <h4 class="intern-section-title" style="margin-top:24px">Regulatory & Exchange Exposure</h4>
      <div class="intern-tech-chips">
        ${d.regulators.map(r => `<span class="intern-tech-chip reg-chip">${r}</span>`).join('')}
      </div>
    ` : ''}
  `).join('');
}


// ══════════════════════════════════════════════════════════
//  13c. MARKET TICKER RENDERER
// ══════════════════════════════════════════════════════════
function initMarketTicker() {
  const track = document.getElementById('ticker-track');
  if (!track || typeof MARKET_TICKER === 'undefined') return;

  const itemsHtml = MARKET_TICKER.map(t => `
    <span class="ticker-item">
      <span class="ticker-label">${t.label}</span>
      <span class="ticker-value">${t.value}</span>
      <span class="ticker-change ${t.up ? 'ticker-up' : 'ticker-down'}">${t.up ? '▲' : '▼'} ${t.change}</span>
    </span>
  `).join('');

  // Duplicate content so the CSS marquee loops seamlessly
  track.innerHTML = itemsHtml + itemsHtml;
}


// ══════════════════════════════════════════════════════════
//  14. SCROLL REVEAL (Intersection Observer)
// ══════════════════════════════════════════════════════════
let _revealObserver = null;

function initScrollReveal() {
  _revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        _revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      _revealObserver.observe(el);
    }
  });
}

function refreshScrollReveal() {
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
    if (!_revealObserver) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      _revealObserver.observe(el);
    }
  });
}


// ══════════════════════════════════════════════════════════
//  15. SCROLL-TO-TOP BUTTON
// ══════════════════════════════════════════════════════════
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
}


// ══════════════════════════════════════════════════════════
//  16. MOBILE NAV
// ══════════════════════════════════════════════════════════
function closeMobileNav() {
  document.getElementById('mobile-nav')?.classList.remove('open');
}

function initMobileNav() {
  const closeBtn = document.getElementById('mobile-close');
  if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);
}


// ══════════════════════════════════════════════════════════
//  SMOOTH SCROLL (called from onclick attrs in HTML)
// ══════════════════════════════════════════════════════════
function smoothScroll(selector) {
  const target = document.querySelector(selector);
  if (target) target.scrollIntoView({ behavior: 'smooth' });
  // Close desktop nav mobile dropdown
  document.getElementById('nav-links')?.classList.remove('open');
  document.getElementById('nav-ham')?.classList.remove('open');
}


// ══════════════════════════════════════════════════════════
//  SVG HELPERS
// ══════════════════════════════════════════════════════════
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


// ══════════════════════════════════════════════════════════
//  INIT ORDER
// ══════════════════════════════════════════════════════════

// Start loader immediately (before DOM ready)
initLoader();

// Start Three.js immediately (doesn't need DOM)
// ══════════════════════════════════════════════════════════
//  CAREER TIMELINE (current role + internships)
// ══════════════════════════════════════════════════════════
function initCareerTimeline() {
  const el = document.getElementById('career-timeline');
  if (!el || typeof EXPERIENCE === 'undefined' || typeof INTERNSHIPS === 'undefined') return;

  const current = EXPERIENCE.map(d => ({ ...d, tag: 'Full-time', current: true, target: '#experience' }));
  const past = [...INTERNSHIPS].reverse().map(d => ({ ...d, tag: 'Internship', current: false, target: '#internships' }));

  el.innerHTML = [...current, ...past].map(d => `
    <div class="ct-item ${d.current ? 'ct-current' : ''}" onclick="smoothScroll('${d.target}')">
      <span class="ct-dot" style="border-color:${d.color};${d.current ? `background:${d.color}` : ''}"></span>
      <div class="ct-body">
        <div class="ct-date">${d.duration}</div>
        <div class="ct-role">${d.role}</div>
        <div class="ct-co" style="color:${d.color}">@ ${d.company}
          <span class="ct-tag" style="border-color:${d.color}55;color:${d.color}">${d.tag}</span>
        </div>
      </div>
    </div>
  `).join('');
}


document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();     // P1: particle canvas
  initCursor();      // P2: custom cursor
  initNavbar();      // P2: navbar scroll + ham
  initMobileNav();   // P1: mobile fullscreen nav
  initTyping();      // P2: typing animation
  initSkills();      // P2: skill tabs
  initProjects();    // P2: projects + tilt
  initExperience();  // Compliance/professional experience panel
  initCareerTimeline(); // Career timeline
  initInternships(); // P2: internship panel
  initMarketTicker();// Market ticker tape
  initScrollReveal();// P2: fade-in observer
  initScrollTop();   // P2: scroll-to-top
  initScrollProgress(); // P1: progress bar
  initParallax();    // P1: parallax hero
  initCounters();    // P1: animated counters
});

// GSAP after load (needs scroll trigger ready)
function initAfterLoad() {
  initGSAP();
}
