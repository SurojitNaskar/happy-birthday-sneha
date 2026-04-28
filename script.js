/* ============================================
   SNEHA'S BIRTHDAY WEBSITE — script.js
   ============================================ */

/* ── STATE ── */
let lightsOn     = false;
let musicPlaying = false;
let decorated    = false;
let noClickCount = 0;
let lbImages     = [];
let lbIndex      = 0;
let counterInterval;
const BIRTHDAY = new Date('2006-04-29T00:00:00');

/* ── LOADING SCREEN ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
    initParticles();
  }, 2600);
});

/* ── CUSTOM CURSOR ── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
document.addEventListener('mousemove', e => {
  cursor.style.left      = e.clientX + 'px';
  cursor.style.top       = e.clientY + 'px';
  cursorTrail.style.left = e.clientX + 'px';
  cursorTrail.style.top  = e.clientY + 'px';

  // Leave tiny sparkle trail
  if (Math.random() > .75) spawnTrailSpark(e.clientX, e.clientY);
});
document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(.7)');
document.addEventListener('mouseup',   () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');

function spawnTrailSpark(x, y) {
  const s = document.createElement('div');
  s.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    width:6px;height:6px;border-radius:50%;
    background:${['#ff6eb4','#ffe066','#b388ff','#fff'][~~(Math.random()*4)]};
    pointer-events:none;z-index:9997;
    transform:translate(-50%,-50%);
    animation:sparkFade .7s ease forwards;
  `;
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 700);
}

// Inject sparkFade keyframe once
const sparkStyle = document.createElement('style');
sparkStyle.textContent = '@keyframes sparkFade{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-70%) scale(0)}}';
document.head.appendChild(sparkStyle);


/* ════════════════════════════════════════════
   PARTICLE CANVAS — floating hearts & stars
   ════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const EMOJIS  = ['💖','✨','🌸','💫','⭐','🎀'];
  const COLORS  = ['rgba(255,110,180,','rgba(255,224,102,','rgba(179,136,255,','rgba(255,255,255,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 20;
      this.vy   = -(Math.random() * .8 + .3);
      this.vx   = (Math.random() - .5) * .4;
      this.size = Math.random() * 14 + 6;
      this.alpha= Math.random() * .5 + .2;
      this.rot  = Math.random() * Math.PI * 2;
      this.drot = (Math.random() - .5) * .02;
      this.type = Math.random() > .45 ? 'emoji' : 'shape';
      this.emoji= EMOJIS[~~(Math.random() * EMOJIS.length)];
      this.color= COLORS[~~(Math.random() * COLORS.length)];
      this.wobble = Math.random() * Math.PI * 2;
    }
    update() {
      this.y      += this.vy;
      this.x      += this.vx + Math.sin(this.wobble) * .3;
      this.wobble += .03;
      this.rot    += this.drot;
      if (this.y < -30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      if (this.type === 'emoji') {
        ctx.font = `${this.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, 0, 0);
      } else {
        // Simple heart path
        const r = this.size * .45;
        ctx.beginPath();
        ctx.moveTo(0, r * .3);
        ctx.bezierCurveTo(-r, -r * .6, -r * 2, r * .3, 0, r * 1.4);
        ctx.bezierCurveTo(r * 2, r * .3, r, -r * .6, 0, r * .3);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Spawn initial set
  for (let i = 0; i < 35; i++) particles.push(new Particle());

  function addParticles(n = 10) {
    for (let i = 0; i < n; i++) particles.push(new Particle());
    if (particles.length > 120) particles.splice(0, particles.length - 120);
  }

  window._addParticles = addParticles;

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}


/* ════════════════════════════
   PAGE NAVIGATION
   ════════════════════════════ */
function goToPage2() {
  triggerConfetti(80);
  const p1 = document.getElementById('page1');
  const p2 = document.getElementById('page2');

  p1.classList.add('slide-out');
  setTimeout(() => {
    p1.classList.remove('active', 'slide-out');
    p2.classList.add('active', 'slide-in');
    setTimeout(() => {
      p2.classList.remove('slide-in');
      startTyping();
      buildGallery();
    }, 700);
  }, 600);
}


/* ════════════════════════════
   NO BUTTON LOGIC
   ════════════════════════════ */
function handleNo() {
  noClickCount++;
  if (noClickCount === 1) {
    document.body.classList.add('shaking');
    setTimeout(() => document.body.classList.remove('shaking'), 600);
    document.getElementById('noPopup').classList.add('show');
  }
}
function handleNo2() {
  // They insist on NO — bully them into YES with chaos 😆
  document.getElementById('noPopup').classList.remove('show');
  document.body.classList.add('shaking');
  setTimeout(() => document.body.classList.remove('shaking'), 500);
  // Move YES button to poke them
  const btn = document.getElementById('btnYes');
  btn.style.animation = 'glowPulse .3s infinite';
  btn.style.transform  = 'scale(1.15)';
  btn.textContent = 'Okay FINE 🥳';
  setTimeout(() => { btn.style.transform = ''; }, 1000);
}
function closeNoPopup() {
  document.getElementById('noPopup').classList.remove('show');
}


/* ════════════════════════════
   TYPING ANIMATION (Page 2)
   ════════════════════════════ */
function startTyping() {
  const el   = document.getElementById('typingText');
  const text = 'Have a look at it, madam ji 😌';
  let i = 0;
  el.textContent = '';
  const iv = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(iv);
      // Reveal feature buttons with stagger
      revealFeatureButtons();
    }
  }, 60);
}

function revealFeatureButtons() {
  const btns = document.querySelectorAll('.feat-btn');
  btns.forEach((btn, i) => {
    setTimeout(() => {
      btn.style.animationDelay = '0s';
      btn.classList.add('visible');
      btn.style.opacity = '1';
      btn.style.transform = 'none';
    }, i * 220);
  });
}


/* ════════════════════════════
   FEATURE BUTTON RIPPLE
   ════════════════════════════ */
document.querySelectorAll('.feat-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const ripple  = btn.querySelector('.feat-ripple');
    const rect    = btn.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    btn.classList.remove('rippling');
    void btn.offsetWidth;
    btn.classList.add('rippling');
    setTimeout(() => btn.classList.remove('rippling'), 600);
  });
});


/* ════════════════════════════
   1. LIGHTS
   ════════════════════════════ */
function toggleLights() {
  lightsOn = !lightsOn;
  const overlay = document.getElementById('lightsOverlay');
  const btn     = document.getElementById('btnLights');
  overlay.classList.toggle('lit', lightsOn);
  btn.querySelector('.feat-label').textContent = lightsOn ? 'Lights Off 🌙' : 'Lights On';
  btn.querySelector('.feat-icon').textContent  = lightsOn ? '💡' : '🎇';
  if (lightsOn && window._addParticles) window._addParticles(20);
  triggerConfetti(lightsOn ? 30 : 0);
}


/* ════════════════════════════
   2. MUSIC
   ════════════════════════════ */
function toggleMusic() {
  const audio = document.getElementById('bgMusic');
  const eq    = document.getElementById('equalizer');
  const btn   = document.getElementById('btnMusic');

  if (musicPlaying) {
    audio.pause();
    eq.classList.remove('active');
    btn.querySelector('.feat-label').textContent = 'Play Music';
    btn.querySelector('.feat-icon').textContent  = '🎵';
    musicPlaying = false;
  } else {
    audio.play().catch(() => {
      // Autoplay blocked — show message
      showToast('🎵 Tap anywhere first, then try again!');
    });
    eq.classList.add('active');
    btn.querySelector('.feat-label').textContent = 'Pause Music';
    btn.querySelector('.feat-icon').textContent  = '⏸️';
    musicPlaying = true;
  }
}


/* ════════════════════════════
   3. DECORATE
   ════════════════════════════ */
function toggleDecorate() {
  decorated = !decorated;
  const cakeWrap      = document.getElementById('cakeWrap');
  const balloonsRow   = document.getElementById('balloonsRow');
  const decorLayer    = document.getElementById('decorationLayer');
  const btn           = document.getElementById('btnDecorate');

  if (decorated) {
    decorLayer.classList.add('visible');
    cakeWrap.classList.add('show');
    document.querySelectorAll('.balloon').forEach((b, i) => {
      setTimeout(() => b.classList.add('rise'), i * 200);
    });
    btn.querySelector('.feat-label').textContent = 'Un-Decorate';
    triggerConfetti(60);
    if (window._addParticles) window._addParticles(25);
  } else {
    cakeWrap.classList.remove('show');
    document.querySelectorAll('.balloon').forEach(b => b.classList.remove('rise'));
    setTimeout(() => decorLayer.classList.remove('visible'), 700);
    btn.querySelector('.feat-label').textContent = 'Decorate!';
  }
}


/* ════════════════════════════
   4. MESSAGE
   ════════════════════════════ */
function openMessage() {
  document.getElementById('messageModal').classList.add('open');
  startCounter();
  // Stagger reveal message lines
  setTimeout(() => {
    document.querySelectorAll('.msg-line, .msg-special').forEach(el => {
      el.classList.add('revealed');
    });
  }, 300);
  triggerConfetti(20);
}
function closeMessage() {
  document.getElementById('messageModal').classList.remove('open');
  if (counterInterval) clearInterval(counterInterval);
}

function startCounter() {
  function update() {
    const now  = new Date();
    const diff = now - BIRTHDAY;
    const totalSecs = Math.floor(diff / 1000);
    const secs  = totalSecs % 60;
    const mins  = Math.floor(totalSecs / 60) % 60;
    const hours = Math.floor(totalSecs / 3600) % 24;
    const days  = Math.floor(totalSecs / 86400);
    document.getElementById('cDays').textContent  = days.toLocaleString();
    document.getElementById('cHours').textContent = String(hours).padStart(2,'0');
    document.getElementById('cMins').textContent  = String(mins).padStart(2,'0');
    document.getElementById('cSecs').textContent  = String(secs).padStart(2,'0');
  }
  update();
  if (counterInterval) clearInterval(counterInterval);
  counterInterval = setInterval(update, 1000);
}


/* ════════════════════════════
   5. MEMORIES GALLERY
   ════════════════════════════ */
function buildGallery() {
  const grid = document.getElementById('galleryGrid');
  if (grid.children.length > 0) return; // already built

  lbImages = [];
  for (let i = 1; i <= 23; i++) {
    lbImages.push(`image${i}.jpeg`);
  }

  lbImages.forEach((src, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${src}" alt="Memory ${idx+1}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x200/2d0a5e/ff6eb4?text=Photo+${idx+1}'"/>
      <div class="gallery-overlay">🔍</div>
    `;
    item.addEventListener('click', () => openLightbox(idx));
    grid.appendChild(item);
  });
}

function openMemories() {
  document.getElementById('memoriesModal').classList.add('open');
  triggerConfetti(15);
}
function closeMemories() {
  document.getElementById('memoriesModal').classList.remove('open');
}

/* Lightbox */
function openLightbox(idx) {
  lbIndex = idx;
  const lb = document.getElementById('lightbox');
  document.getElementById('lbImg').src = lbImages[lbIndex];
  lb.classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}
function lbNav(dir, e) {
  e.stopPropagation();
  lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
  const img = document.getElementById('lbImg');
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = lbImages[lbIndex];
    img.style.opacity = '1';
  }, 180);
}
// Keyboard nav for lightbox
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'ArrowRight') lbNav(1, e);
  if (e.key === 'ArrowLeft')  lbNav(-1, e);
  if (e.key === 'Escape')     closeLightbox();
});


/* ════════════════════════════
   CONFETTI BURST
   ════════════════════════════ */
function triggerConfetti(count = 50) {
  if (count === 0) return;
  const container = document.getElementById('confettiContainer');
  const colors    = ['#ff6eb4','#ffe066','#b388ff','#80d8ff','#ff8a80','#c8f5a0','#fff'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = colors[~~(Math.random() * colors.length)];
    const left  = Math.random() * 100;
    const drift = (Math.random() - .5) * 200 + 'px';
    const dur   = Math.random() * 2 + 1.5;
    const delay = Math.random() * .8;
    const rot   = Math.random() > .5;
    piece.style.cssText = `
      left:${left}vw;
      background:${color};
      --drift:${drift};
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      transform:rotate(${Math.random()*360}deg);
      ${rot ? 'border-radius:50%;' : ''}
    `;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), (dur + delay + .5) * 1000);
  }
}

/* Click anywhere for mini confetti burst */
document.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
  triggerConfetti(8);
});


/* ════════════════════════════
   TOAST NOTIFICATION
   ════════════════════════════ */
function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed;bottom:30px;left:50%;transform:translateX(-50%);
    background:rgba(35,10,65,.95);border:1px solid rgba(255,255,255,.2);
    color:#fff;font-family:var(--font-body,sans-serif);
    padding:12px 24px;border-radius:50px;z-index:9999;
    box-shadow:0 8px 32px rgba(0,0,0,.4);
    animation:fadeUpIn .4s ease;
    font-size:.9rem;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
    t.style.transition = 'all .4s ease';
    setTimeout(() => t.remove(), 400);
  }, 3000);
}


/* ════════════════════════════
   SCROLL ANIMATIONS (Page 2)
   ════════════════════════════ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
    }
  });
}, { threshold: .15 });

// Observe any .feat-btn that are visible later
document.querySelectorAll('.feat-btn').forEach(el => {
  el.style.transition = 'opacity .5s ease, transform .5s ease, box-shadow .25s, background .25s';
  observer.observe(el);
});