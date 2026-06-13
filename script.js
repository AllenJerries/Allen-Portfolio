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
   2. Custom Inertial Cursor
   ========================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  
  if (!cursor || !follower) return;

  // Check if touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    return;
  }

  let mouseX = 0, mouseY = 0; // Actual mouse position
  let followerX = 0, followerY = 0; // Follower position with inertia
  
  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position inner dot instantly
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Follower spring interpolation
  function updateFollower() {
    const dx = mouseX - followerX;
    const dy = mouseY - followerY;
    
    // Lower divisor = faster speed, higher = slower spring glide
    followerX += dx * 0.15;
    followerY += dy * 0.15;
    
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    
    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  // Hover states
  const interactives = document.querySelectorAll('a, button, .filter-btn, .project-card, .hero-photo-card, .dna-tag, .social-btn');
  interactives.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (item.classList.contains('project-card') || item.classList.contains('hero-photo-card')) {
        document.body.classList.add('hovering-view');
      } else if (item.classList.contains('btn-magnetic')) {
        document.body.classList.add('hovering-button');
      } else {
        document.body.classList.add('hovering-interactive');
      }
    });
    
    item.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering-interactive', 'hovering-button', 'hovering-view');
    });
  });
}

/* ==========================================
   3. Hero Canvas - Floating Binary Drift
   ========================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  const particles = [];
  const charSet = ['0', '1', '{', '}', '<', '>', '++', ';'];
  
  // Mouse coordinates relative to hero canvas
  let mouse = { x: null, y: null, radius: 120 };
  
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

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
  for (let i = 0; i < Math.min(particleCount, 80); i++) {
    particles.push(new Particle());
  }

  // Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================
   4. Skills Canvas - Interactive Constellation
   ========================================== */
function initSkillsCanvas() {
  const canvas = document.getElementById('skills-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;

  let mouse = { x: null, y: null, radius: 150 };
  const rect = canvas.getBoundingClientRect();

  canvas.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  // Nodes for core skills (matching resume tech stack)
  const skillsData = [
    { label: 'JavaScript', category: 'lang', size: 16 },
    { label: 'Python', category: 'lang', size: 15 },
    { label: 'Kotlin', category: 'lang', size: 14 },
    { label: 'C', category: 'lang', size: 12 },
    { label: 'React.js', category: 'web', size: 15 },
    { label: 'HTML5', category: 'web', size: 13 },
    { label: 'CSS3', category: 'web', size: 13 },
    { label: 'Tailwind CSS', category: 'web', size: 12 },
    { label: 'Node.js', category: 'web', size: 15 },
    { label: 'Express.js', category: 'web', size: 13 },
    { label: 'REST APIs', category: 'web', size: 13 },
    { label: 'MongoDB', category: 'core', size: 14 },
    { label: 'Firebase', category: 'core', size: 13 },
    { label: 'MySQL', category: 'core', size: 12 },
    { label: 'Git', category: 'tools', size: 13 },
    { label: 'GitHub', category: 'tools', size: 13 },
    { label: 'Android Studio', category: 'tools', size: 12 },
    { label: 'Postman', category: 'tools', size: 11 },
    { label: 'Docker', category: 'tools', size: 12 },
    { label: 'Local LLMs', category: 'core', size: 13 }
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
    requestAnimationFrame(loop);
  }
  loop();
}

/* ==========================================
   5. 3D Card Tilt Effect
   ========================================== */
function initTiltEffect() {
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
    const target = parseInt(element.getAttribute('data-target'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    let count = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // ~60fps refresh rate

    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(count) + suffix;
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

  // Animate skill bars when Skills section comes in
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillsSection = document.getElementById('skills');

  if (skillsSection && skillBars.length > 0) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const width = bar.getAttribute('data-percentage');
            bar.style.width = `${width}%`;
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    skillsObserver.observe(skillsSection);
  }

  // Smooth Scrollspy Link Active State Tracker
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
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
  });
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
   9. Contact Form Simulation
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple loader simulation
    status.style.display = 'block';
    status.textContent = 'Encrypting & sending secure envelope...';
    status.className = 'form-status';

    setTimeout(() => {
      // Success feedback
      status.textContent = 'Message routed successfully! Let\'s build together.';
      status.className = 'form-status success';
      form.reset();

      // Clear fields visual triggers
      const inputs = form.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.dispatchEvent(new Event('input')); // Reset floating label placement
      });
      
      setTimeout(() => {
        status.style.display = 'none';
      }, 5000);
    }, 1500);
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
