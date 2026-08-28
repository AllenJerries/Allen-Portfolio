// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initHeroCanvas();
  initSkillsCanvas();
  initTiltEffect();
  initMagneticButtons();
  initScrollAnimations();
  initProjectFilters();
  initContactForm();
  initEasterEgg();
});

/* ==========================================
   1. Preloader Logic
   ========================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progress = document.getElementById('preloader-progress');
  const consoleText = document.getElementById('preloader-console');
  
  if (!preloader) return;

  const logs = [
    'Initializing system kernels...',
    'Loading CSE modules...',
    'Configuring grid visualizer...',
    'Establishing neural links...',
    'Compiling portfolio structures...',
    'System ready.'
  ];

  let logIndex = 0;
  let percent = 0;

  // Typing simulator
  function typeLog() {
    if (logIndex < logs.length) {
      consoleText.textContent = `> ${logs[logIndex]}`;
      logIndex++;
      setTimeout(typeLog, 250);
    }
  }

  typeLog();

  // Progress Bar
  const interval = setInterval(() => {
    percent += Math.floor(Math.random() * 15) + 5;
    if (percent >= 100) {
      percent = 100;
      clearInterval(interval);
      
      // Delay slightly for completion feel, then slide up
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflowY = 'auto'; // Enable scrolling
        
        // Trigger hero entrance animations
        setTimeout(triggerHeroEntrance, 400);
      }, 500);
    }
    progress.style.width = `${percent}%`;
  }, 100);
}

// Custom hero entry sequence
function triggerHeroEntrance() {
  const heroElements = document.querySelectorAll('.hero .reveal');
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, index * 150);
  });
}

/* ==========================================
   2. Magnetic Digital Trail Cursor
   ========================================== */
function initCustomCursor() {
  const canvas = document.getElementById('cursor-canvas');
  const dot = document.querySelector('.cursor-dot');
  if (!canvas || !dot) return;

  // Touch device detection — disable entirely
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hasCoarsePointer = window.matchMedia('(hover: none)').matches;
  if (isTouchDevice || hasCoarsePointer) {
    canvas.style.display = 'none';
    dot.style.display = 'none';
    return;
  }

  // Reduced motion — disable trail, keep dot only
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Mouse state
  let mouseX = -200, mouseY = -200;
  let trailX = -200, trailY = -200;
  const TRAIL_LERP = 0.12;

  // Trail points history
  const trail = [];
  const TRAIL_LENGTH = 8;

  // Click ripple
  let ripple = { active: false, x: 0, y: 0, radius: 0, maxRadius: 32, opacity: 0 };

  // Hover state
  let hoverState = 'none';
  let hoveredElement = null;

  // Mouse move handler
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }, { passive: true });

  // Click handler — trigger ripple
  window.addEventListener('click', (e) => {
    ripple = { active: true, x: e.clientX, y: e.clientY, radius: 0, maxRadius: 32, opacity: 0.5 };
  }, { passive: true });

  // Hover state management
  const interactives = document.querySelectorAll('a, button, .filter-btn, .project-card, .hero-photo-card, .dna-tag, .social-btn');
  interactives.forEach(item => {
    item.addEventListener('mouseenter', () => {
      hoveredElement = item;
      if (item.classList.contains('project-card') || item.classList.contains('hero-photo-card')) {
        hoverState = 'view';
        document.body.classList.add('hovering-view');
      } else if (item.classList.contains('btn-magnetic')) {
        hoverState = 'button';
        document.body.classList.add('hovering-button');
      } else {
        hoverState = 'interactive';
        document.body.classList.add('hovering-interactive');
      }
    });

    item.addEventListener('mouseleave', () => {
      hoverState = 'none';
      hoveredElement = null;
      document.body.classList.remove('hovering-interactive', 'hovering-button', 'hovering-view');
    });
  });

  // Animation loop
  let lastTrailTime = 0;

  function animate(time) {
    ctx.clearRect(0, 0, W, H);

    // --- Trail interpolation ---
    trailX += (mouseX - trailX) * TRAIL_LERP;
    trailY += (mouseY - trailY) * TRAIL_LERP;

    // Record trail points (subsampled for smooth density)
    if (time - lastTrailTime > 3) {
      trail.push({ x: trailX, y: trailY });
      if (trail.length > TRAIL_LENGTH) trail.shift();
      lastTrailTime = time;
    }

    // --- Draw trail ---
    if (!prefersReducedMotion && trail.length > 1) {
      for (let i = 0; i < trail.length; i++) {
        const t = i / trail.length;
        const radius = 1 + t * 2;
        const alpha = t * 0.3;

        ctx.beginPath();
        ctx.arc(trail[i].x, trail[i].y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 69, 0, ${alpha})`;
        ctx.fill();
      }

      // Connecting line through trail
      if (trail.length > 2) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 69, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // --- Soft glow around trail head ---
    if (!prefersReducedMotion) {
      const glowRadius = hoverState === 'view' ? 28 : hoverState === 'button' ? 24 : 20;
      const glowAlpha = hoverState === 'view' ? 0.12 : hoverState === 'button' ? 0.1 : 0.07;
      const gradient = ctx.createRadialGradient(trailX, trailY, 0, trailX, trailY, glowRadius);
      gradient.addColorStop(0, `rgba(255, 69, 0, ${glowAlpha})`);
      gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(trailX - glowRadius, trailY - glowRadius, glowRadius * 2, glowRadius * 2);
    }

    // --- Magnetic pull line on button hover ---
    if (hoverState === 'button' && hoveredElement) {
      const rect = hoveredElement.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY);
      ctx.lineTo(cx, cy);
      ctx.strokeStyle = 'rgba(255, 69, 0, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // --- Click ripple ---
    if (ripple.active) {
      ripple.radius += (ripple.maxRadius - ripple.radius) * 0.15;
      ripple.opacity *= 0.92;

      if (ripple.opacity > 0.01) {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 69, 0, ${ripple.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ripple.active = false;
      }
    }

    requestAnimationFrame(animate);
  }
  if (!prefersReducedMotion) requestAnimationFrame(animate);
}

/* ==========================================
   3. Hero Canvas - Floating Binary Drift
   ========================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const isCoarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const particles = [];
  const charSet = ['0', '1', '{', '}', '<', '>', '++', ';'];
  
  // Mouse coordinates relative to hero canvas
  let mouse = { x: null, y: null, radius: 120 };
  
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, { passive: true });

  // Particle Class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.char = charSet[Math.floor(Math.random() * charSet.length)];
      this.fontSize = Math.floor(Math.random() * 12) + 10;
      this.speedY = Math.random() * 0.4 + 0.1;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? '#ff4500' : '#ff8c00';
    }

    update() {
      this.y -= this.speedY; // Float upwards
      this.x += this.speedX;

      // Mouse repel physics
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          this.x += Math.cos(angle) * force * 3;
          this.y += Math.sin(angle) * force * 3;
        }
      }

      // Out of bounds reset
      if (this.y < -20 || this.x < -20 || this.x > width + 20) {
        this.reset();
        this.y = height + 20;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.font = `${this.fontSize}px 'Fira Code', monospace`;
      ctx.fillText(this.char, this.x, this.y);
      ctx.restore();
    }
  }

  // Create initial particles
  const particleCount = Math.floor((width * height) / 18000);
  for (let i = 0; i < Math.min(particleCount, isCoarse ? 40 : 80); i++) {
    particles.push(new Particle());
  }

  // Loop (paused when hero is scrolled out of view to save battery/CPU)
  let rafId = null;
  let running = false;

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    rafId = requestAnimationFrame(animate);
  }

  function startAnim() {
    if (!running) {
      running = true;
      rafId = requestAnimationFrame(animate);
    }
  }

  function stopAnim() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  if (reducedMotion) {
    animate(); // draw a single static frame, then stop
    stopAnim();
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.isIntersecting ? startAnim() : stopAnim());
    }, { threshold: 0.01 });
    observer.observe(canvas);
    if (canvas.getBoundingClientRect().top < window.innerHeight) startAnim();
  } else {
    startAnim();
  }
}

/* ==========================================
   4. Skills Canvas - Interactive Constellation
   ========================================== */
function initSkillsCanvas() {
  const canvas = document.getElementById('skills-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  let mouse = { x: null, y: null, radius: 150 };
  const rect = canvas.getBoundingClientRect();

  canvas.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, { passive: true });

  // Nodes for core skills (matching latest resume tech stack)
  const skillsData = [
    { label: 'JavaScript', category: 'lang', size: 16 },
    { label: 'TypeScript', category: 'lang', size: 14 },
    { label: 'Python', category: 'lang', size: 15 },
    { label: 'Kotlin', category: 'lang', size: 14 },
    { label: 'Java', category: 'lang', size: 14 },
    { label: 'C++', category: 'lang', size: 13 },
    { label: 'SQL', category: 'lang', size: 12 },
    { label: 'React.js', category: 'web', size: 15 },
    { label: 'Tailwind CSS', category: 'web', size: 13 },
    { label: 'Flutter', category: 'web', size: 14 },
    { label: 'Android Dev', category: 'web', size: 14 },
    { label: 'Node.js', category: 'web', size: 15 },
    { label: 'Express.js', category: 'web', size: 13 },
    { label: 'REST APIs', category: 'web', size: 14 },
    { label: 'MongoDB Atlas', category: 'core', size: 14 },
    { label: 'Firestore', category: 'core', size: 13 },
    { label: 'MySQL', category: 'core', size: 12 },
    { label: 'Claude Code', category: 'tools', size: 14 },
    { label: 'AI Agents', category: 'tools', size: 15 },
    { label: 'Prompt Eng.', category: 'tools', size: 13 },
    { label: 'Ollama / LLMs', category: 'tools', size: 14 },
    { label: 'Docker', category: 'tools', size: 12 },
    { label: 'Git / GitHub', category: 'tools', size: 13 },
    { label: 'Electron', category: 'tools', size: 13 }
  ];

  class SkillNode {
    constructor(data, x, y) {
      this.label = data.label;
      this.category = data.category;
      this.size = data.size;
      this.x = x;
      this.y = y;
      
      // Gentle floating vector
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      
      this.originalSize = this.size;
      this.hoverScale = 1;

      // Color coding matching CSS colors
      if (this.category === 'lang') this.color = '#ff4500';
      else if (this.category === 'web') this.color = '#ff8c00';
      else if (this.category === 'tools') this.color = '#e60000';
      else this.color = '#ffa500';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Boundary collision
      if (this.x < 30 || this.x > width - 30) this.vx *= -1;
      if (this.y < 30 || this.y > height - 30) this.vy *= -1;

      // Mouse proximity interaction (attraction and scale)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Pull gently toward mouse
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
          this.hoverScale = 1 + force * 0.4;
        } else {
          this.hoverScale = 1;
        }
      } else {
        this.hoverScale = 1;
      }
    }

    draw() {
      const currentRadius = this.originalSize * this.hoverScale;
      
      // Node glow effect on hover
      if (this.hoverScale > 1) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius + 8, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}15`;
        ctx.fill();
      }

      // Draw Main circle
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.hoverScale > 1 ? 15 : 0;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Label details
      ctx.fillStyle = '#0c0f24';
      ctx.font = `600 ${11 + (this.hoverScale - 1) * 3}px 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(this.label, this.x, this.y - currentRadius - 8);
    }
  }

  const nodes = [];
  skillsData.forEach(skill => {
    // Distribute initial nodes randomly avoiding edges
    const x = Math.random() * (width - 100) + 50;
    const y = Math.random() * (height - 100) + 50;
    nodes.push(new SkillNode(skill, x, y));
  });

  function drawLines() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Draw connections if nodes are close
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          // Opacity maps to distance
          const opacity = (100 - dist) / 100 * 0.15;
          ctx.strokeStyle = `rgba(12, 15, 36, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    drawLines();
    nodes.forEach(node => {
      node.update();
      node.draw();
    });
    rafId = requestAnimationFrame(loop);
  }

  let rafId = null;
  let running = false;

  function startAnim() {
    if (!running) {
      running = true;
      rafId = requestAnimationFrame(loop);
    }
  }

  function stopAnim() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  if (reducedMotion) {
    loop();      // render a single static frame
    stopAnim();
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.isIntersecting ? startAnim() : stopAnim());
    }, { threshold: 0.01 });
    observer.observe(canvas);
    if (canvas.getBoundingClientRect().top < window.innerHeight) startAnim();
  } else {
    startAnim();
  }
}

/* ==========================================
   5. 3D Card Tilt Effect
   ========================================== */
function initTiltEffect() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return; // touch: skip 3D tilt
  const cards = document.querySelectorAll('.hero-interactive-card, .hero-photo-card, .project-card, .bento-card:not(.bento-stats)');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside the element
      const y = e.clientY - rect.top;  // y coordinate inside the element
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation angles (-10deg to 10deg)
      const rotateX = -((y - height / 2) / height) * 20;
      const rotateY = ((x - width / 2) / width) * 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ==========================================
   6. Magnetic Button Physics
   ========================================== */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return; // touch: skip magnetic pull
  const magneticWrappers = document.querySelectorAll('.btn-magnetic-container');

  magneticWrappers.forEach(wrapper => {
    const btn = wrapper.querySelector('.btn-magnetic');
    
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Move button 40% towards mouse coordinates
      btn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });

    wrapper.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
    });
  });
}

/* ==========================================
   7. Scroll Animations & Stats Count-Up
   ========================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const statNumbers = document.querySelectorAll('.stat-number');

  // Trigger reveals when scrolling in
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // Count up stats when in viewport
  const countUp = (element) => {
    const target = parseFloat(element.getAttribute('data-target')) || 0;
    const suffix = element.getAttribute('data-suffix') || '';
    const hasDecimal = String(target).indexOf('.') !== -1;
    const format = (n) => n.toFixed(hasDecimal ? 2 : 0);
    let count = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // ~60fps refresh rate

    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        element.textContent = format(target) + suffix;
        clearInterval(timer);
      } else {
        element.textContent = format(count) + suffix;
      }
    }, 16);
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => statsObserver.observe(num));

  // Smooth Scrollspy Link Active State Tracker (rAF-throttled)
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  let scrollTicking = false;
  const handleScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      let current = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - 150;
        if (pageYOffset >= top) {
          current = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
      scrollTicking = false;
    });
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ==========================================
   8. Project Filtering
   ========================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active classes
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Hide card logic with scale transitions
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================
   9. Contact Form — Real Email via EmailJS
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const submitBtnText = document.getElementById('submit-btn-text');

  if (!form) return;

  // ─── EmailJS Credentials ───────────────────────────────────────
  const EMAILJS_SERVICE_ID  = 'service_ipja5ik';
  const EMAILJS_TEMPLATE_ID = 'template_default';
  const EMAILJS_PUBLIC_KEY  = 'fIVbMqg3gpdoiAmWa';
  // ──────────────────────────────────────────────────────────────

  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Loading state
    submitBtn.disabled = true;
    submitBtnText.textContent = 'Transmitting...';
    status.style.display = 'block';
    status.textContent = 'Encrypting & routing secure transmission...';
    status.className = 'form-status';

    let success = false;

    // Try EmailJS first
    if (typeof emailjs !== 'undefined' && EMAILJS_TEMPLATE_ID && EMAILJS_TEMPLATE_ID !== 'template_default') {
      try {
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
        success = true;
      } catch (err) {
        console.warn('EmailJS attempt failed, switching to direct mail backup...', err);
      }
    }

    // Direct Mail Service Backup (FormSubmit API to jerriesallen@gmail.com)
    if (!success) {
      try {
        const formData = new FormData(form);
        const data = {
          name: formData.get('from_name') || form.querySelector('#name')?.value,
          email: formData.get('from_email') || form.querySelector('#email')?.value,
          subject: formData.get('subject') || form.querySelector('#subject')?.value || 'New Portfolio Contact',
          message: formData.get('message') || form.querySelector('#message')?.value,
          _captcha: "false",
          _subject: `[Portfolio Transmission] ${formData.get('subject') || 'New Message'}`
        };

        const res = await fetch('https://formsubmit.co/ajax/jerriesallen@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success === "true" || json.success === true || res.status === 200) {
            success = true;
          }
        }
      } catch (fallbackErr) {
        console.error('Direct mail API error:', fallbackErr);
      }
    }

    if (success) {
      status.textContent = '✓ Transmission deployed successfully! Check your email inbox.';
      status.className = 'form-status success';
      form.reset();

      // Clear floating labels placement
      form.querySelectorAll('.form-input').forEach(input => {
        input.dispatchEvent(new Event('input'));
      });

      setTimeout(() => {
        status.style.display = 'none';
      }, 6000);
    } else {
      status.textContent = '✗ Transmission failed. Please email directly: jerriesallen@gmail.com';
      status.className = 'form-status error';

      setTimeout(() => {
        status.style.display = 'none';
      }, 7000);
    }

    submitBtn.disabled = false;
    submitBtnText.textContent = 'Deploy Transmission';
  });
}

/* ==========================================
   10. Easter Egg: Code RainConfetti
   ========================================== */
function initEasterEgg() {
  const eggBtn = document.getElementById('easter-egg-btn');
  if (!eggBtn) return;

  eggBtn.addEventListener('click', () => {
    // Trigger canvas screen takeover
    const rainCanvas = document.createElement('canvas');
    rainCanvas.style.position = 'fixed';
    rainCanvas.style.top = '0';
    rainCanvas.style.left = '0';
    rainCanvas.style.width = '100vw';
    rainCanvas.style.height = '100vh';
    rainCanvas.style.zIndex = '99999';
    rainCanvas.style.pointerEvents = 'none';
    document.body.appendChild(rainCanvas);

    const ctx = rainCanvas.getContext('2d');
    let width = rainCanvas.width = window.innerWidth;
    let height = rainCanvas.height = window.innerHeight;

    // Matrix characters (vibrant, futuristic code)
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ{}<>;++==';
    const alphabet = chars.split('');

    const fontSize = 14;
    const columns = width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    // Modern vibrant color gradients for rain
    const colors = ['#ff4500', '#ff8c00', '#e60000', '#ffa500', '#ff5f56'];

    let frames = 0;
    
    function draw() {
      // semi-transparent background to give fading tail
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        
        // Dynamic cycling gradient color
        ctx.fillStyle = colors[Math.floor(Math.sin(i + frames * 0.05) * 2.5 + 2.5)];
        ctx.font = `600 ${fontSize}px monospace`;
        
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      frames++;
      
      if (frames < 200) {
        requestAnimationFrame(draw);
      } else {
        // Smoothly fade canvas out and destroy it
        rainCanvas.style.transition = 'opacity 1.5s ease-out';
        rainCanvas.style.opacity = '0';
        setTimeout(() => {
          rainCanvas.remove();
        }, 1500);
      }
    }
    draw();
  });
}
