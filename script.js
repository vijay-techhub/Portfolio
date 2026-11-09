// ===== Nav scroll state =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== Mobile menu =====
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  toggle.classList.toggle('open');
  links.classList.toggle('mobile-open');
});
document.querySelectorAll('.nav-link').forEach(l =>
  l.addEventListener('click', () => {
    toggle?.classList.remove('open');
    links?.classList.remove('mobile-open');
  })
);

// ===== Cursor glow =====
const glow = document.querySelector('.cursor-glow');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let currentX = mouseX, currentY = mouseY;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
function animateGlow() {
  currentX += (mouseX - currentX) * 0.12;
  currentY += (mouseY - currentY) * 0.12;
  if (glow) glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateGlow);
}
animateGlow();

// ===== Typewriter =====
const typedEl = document.getElementById('typed');
const phrases = [
  'automation that scales.',
  'APIs that just work.',
  'automation frameworks people trust.',
  'reliable delivery.',
];
let pIdx = 0, cIdx = 0, deleting = false;
function typeLoop() {
  if (!typedEl) return;
  const current = phrases[pIdx];
  if (deleting) {
    typedEl.textContent = current.substring(0, cIdx--);
    if (cIdx < 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 35);
  } else {
    typedEl.textContent = current.substring(0, cIdx++);
    if (cIdx > current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
    setTimeout(typeLoop, 70);
  }
}
setTimeout(typeLoop, 800);

// ===== Reveal on scroll =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Counter animation =====
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.nextElementSibling?.classList.contains('suffix-percent') ? '%'
        : el.nextElementSibling?.classList.contains('suffix-plus') ? '+' : '';
      let start = 0;
      const duration = 1600;
      const t0 = performance.now();
      function tick(now) {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = Math.floor(eased * target);
        el.textContent = value + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => activeObserver.observe(s));

// ===== Particle background =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.reset(true);
  }
  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : height + 10;
    this.size = Math.random() * 1.8 + 0.4;
    this.speedY = -(Math.random() * 0.4 + 0.1);
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.color = Math.random() > 0.7 ? '199, 125, 255' : Math.random() > 0.5 ? '124, 158, 255' : '100, 255, 218';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y < -10 || this.x < -10 || this.x > width + 10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(80, Math.floor((width * height) / 18000));
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();
window.addEventListener('resize', initParticles);

function connectParticles() {
  const maxDist = 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.15;
        ctx.strokeStyle = `rgba(100, 255, 218, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animate);
}
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  animate();
}

// ===== Tilt effect on cards =====
document.querySelectorAll('.skill-card, .ach-card, .timeline-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -4;
    const ry = ((x - cx) / cx) * 4;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Add style for active nav link
const styleEl = document.createElement('style');
styleEl.textContent = `.nav-link.active { color: var(--accent); background: rgba(100, 255, 218, 0.08); }`;
document.head.appendChild(styleEl);
