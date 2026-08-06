/**
 * Meet Allen AI — Digital Portfolio Assistant Engine
 * 100% Offline, Fast & Recruiter-Focused Knowledge Engine
 */

(function () {
  'use me strict';

  // ════════════════════════════════════════════════════════════
  // 1. OFFLINE KNOWLEDGE BASE & RESPONSE DATA
  // ════════════════════════════════════════════════════════════
  const ALLEN_KNOWLEDGE = {
    profile: {
      name: "Allen Jerries A L",
      title: "MERN Stack Developer | Mobile App Developer | AI Enthusiast",
      degree: "B.E. Computer Science & Engineering",
      college: "Coimbatore Institute of Engineering and Technology",
      gradYear: "2023 - 2027",
      cgpa: "7.9 / 10",
      location: "Coimbatore, Tamil Nadu, India",
      email: "jerriesallen@gmail.com",
      phone: "+91 9360972523",
      github: "https://github.com/AllenJerries",
      linkedin: "https://linkedin.com/in/allen-jerries-a-l",
      resume: "Resume/ALLEN resume.pdf",
      currentGoal: "Seeking Full Stack, Backend & Mobile App Developer roles to build scalable APIs, local AI solutions, and high-performance apps."
    },

    projects: [
      {
        id: "quantum-ai",
        title: "JERRIES QUANTUM AI",
        tag: "PERSONAL AI OPERATING SYSTEM",
        desc: "Advanced Personal AI Operating System powered by Local Large Language Models (LLMs), featuring persistent memory, multi-agent workflows, voice interaction, terminal automation, and offline AI processing.",
        tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Ollama", "AI Agents"],
        github: "https://github.com/AllenJerries",
        category: "aiml"
      },
      {
        id: "soundmaster-ai",
        title: "SoundMaster AI",
        tag: "AI-POWERED DESKTOP SYSTEM",
        desc: "AI-powered Windows Audio Control Center built with Electron, React, TypeScript & Node.js. Features Equalizer APO integration, smart audio profiles, automatic app-based EQ switching, and real-time audio visualization.",
        tech: ["Electron", "React.js", "TypeScript", "Node.js", "Equalizer APO"],
        github: "https://github.com/AllenJerries/SoundMaster-AI",
        category: "aiml"
      },
      {
        id: "forensix",
        title: "ForensiX – AI Digital Crime Investigation Assistant",
        tag: "AI-POWERED DIGITAL FORENSICS",
        desc: "Enterprise-grade AI Digital Crime Investigation Platform featuring OCR, evidence correlation, entity extraction, relationship analysis, timeline reconstruction, and automated forensic reporting.",
        tech: ["Python", "Streamlit", "EasyOCR", "Ollama", "Digital Forensics"],
        github: "https://github.com/AllenJerries/ForensiX_Digital_Crime_Investigation_Assistant",
        category: "aiml"
      },
      {
        id: "shopverse",
        title: "ShopVerse – Full Stack E-Commerce Platform",
        tag: "FULL STACK E-COMMERCE PLATFORM",
        desc: "A full-stack e-commerce platform built with the MERN stack, featuring user authentication, product management, cart functionality, order tracking, and an end-to-end shopping workflow.",
        tech: ["MongoDB", "Express.js", "React.js", "Node.js", "JWT Auth"],
        github: "https://github.com/AllenJerries/ShopVerse-Full-Stack-MERN-E-Commerce-Platform-",
        category: "web"
      },
      {
        id: "smart-surveillance",
        title: "Smart Surveillance",
        tag: "MOBILE SAFETY APPLICATION",
        desc: "Personal Safety & Crash Detection App built with Kotlin and Firebase featuring real-time safety monitoring, crash detection API, automated emergency alerts, and real-time location tracking.",
        tech: ["Kotlin", "Firebase", "Crash Detection API", "Location Sync"],
        github: "https://github.com/AllenJerries",
        category: "systems"
      },
      {
        id: "client-tracker",
        title: "Client Requirements Tracker",
        tag: "CLIENT TRACKING & UTILITY",
        desc: "Lightweight client requirement tracking application for freelancers and developers. Converts requirement lists into interactive checklists, tracks progress, and saves data locally in browser Local Storage.",
        tech: ["JavaScript", "HTML5", "CSS3", "Local Storage", "Productivity Tool"],
        github: "https://github.com/AllenJerries/Client-Requirements-Tracker",
        category: "web"
      }
    ],

    internship: {
      role: "Full Stack Web Development Intern",
      company: "Cannyfore Technology Solutions Pvt Ltd",
      duration: "June 2025",
      highlights: [
        "Developed a full-stack movie ticket booking web application.",
        "Engineered REST APIs using React.js, Node.js, Express.js, and MongoDB.",
        "Implemented secure authentication, booking management systems, and database schemas."
      ]
    },

    skills: {
      languages: ["Java", "JavaScript (ES6)", "TypeScript", "Python", "Kotlin", "C", "C++", "SQL"],
      frontend: ["HTML5", "CSS3", "React.js", "Tailwind CSS", "XML"],
      backend: ["Node.js", "Express.js", "REST APIs"],
      databases: ["MongoDB", "MongoDB Atlas", "MySQL", "Firebase (Firestore)"],
      mobile: ["Android Development (Kotlin)", "Flutter"],
      tools: ["Git", "GitHub", "Docker", "Electron", "Postman"],
      ai_tools: ["Ollama", "Claude Code", "Prompt Engineering", "LLM Integration", "AI Agent Development"]
    }
  };

  // ════════════════════════════════════════════════════════════
  // 2. INTELLIGENT INTENT MATCHER & RESPONSE GENERATOR
  // ════════════════════════════════════════════════════════════
  function queryKnowledgeBase(input) {
    const text = input.toLowerCase().trim();

    // 1. Tell me about Allen / Intro / Who is Allen / Overview
    if (matchAny(text, ['who', 'about allen', 'tell me about', 'intro', 'overview', 'bio', 'who is', 'background', 'profile'])) {
      return {
        text: `👋 <strong>Hi! Here is an executive summary of Allen Jerries:</strong><br><br>
               <strong>Allen Jerries A L</strong> is a <strong>MERN Stack Developer</strong>, <strong>Mobile App Developer</strong>, and <strong>AI Enthusiast</strong> pursuing a <strong>B.E. in Computer Science & Engineering</strong> at <em>Coimbatore Institute of Engineering and Technology</em> (CGPA 7.9/10).<br><br>
               He specializes in engineering secure REST APIs, real-time safety monitoring systems, AI agents & local LLM tools (Ollama, Claude Code), and full-stack web & mobile applications.`,
        actions: [
          { text: "🚀 Best Project", prompt: "Best Project" },
          { text: "💻 Technical Skills", prompt: "Technical Skills" },
          { text: "💼 Internship", prompt: "Internship" },
          { text: "📄 Resume", link: ALLEN_KNOWLEDGE.profile.resume }
        ]
      };
    }

    // 2. Best Project / Top Project
    if (matchAny(text, ['best project', 'top project', 'favorite project', 'flagship', 'star project', 'highlight project'])) {
      const qAI = ALLEN_KNOWLEDGE.projects[0];
      const soundAI = ALLEN_KNOWLEDGE.projects[1];
      return {
        text: `🚀 <strong>Allen's Flagship Creations:</strong><br><br>
               <strong>1. ${qAI.title}</strong> — ${qAI.desc}<br><br>
               <strong>2. ${soundAI.title}</strong> — ${soundAI.desc}`,
        cards: [qAI, soundAI],
        actions: [
          { text: "📁 Show All Projects", prompt: "Show Portfolio Projects" },
          { text: "🌐 Open GitHub", link: ALLEN_KNOWLEDGE.profile.github }
        ]
      };
    }

    // 3. Projects / Show Portfolio Projects
    if (matchAny(text, ['project', 'projects', 'portfolio', 'creations', 'built', 'work', 'apps', 'web apps'])) {
      return {
        text: `📁 <strong>Allen has built 10+ real-world software applications.</strong> Here are key featured projects:`,
        cards: ALLEN_KNOWLEDGE.projects.slice(0, 4),
        actions: [
          { text: "🐙 View GitHub Repos", link: ALLEN_KNOWLEDGE.profile.github },
          { text: "💻 Technical Skills", prompt: "Technical Skills" }
        ]
      };
    }

    // 4. Technical Skills / Tech Stack / Languages
    if (matchAny(text, ['skill', 'skills', 'stack', 'tech', 'languages', 'frontend', 'backend', 'database', 'tools', 'coding'])) {
      const s = ALLEN_KNOWLEDGE.skills;
      return {
        text: `💻 <strong>Allen's Complete Technical Skills:</strong><br><br>
               • <strong>Programming Languages:</strong> ${s.languages.join(', ')}<br>
               • <strong>Frontend:</strong> ${s.frontend.join(', ')}<br>
               • <strong>Backend:</strong> ${s.backend.join(', ')}<br>
               • <strong>Databases:</strong> ${s.databases.join(', ')}<br>
               • <strong>Mobile Development:</strong> ${s.mobile.join(', ')}<br>
               • <strong>Tools & Technologies:</strong> ${s.tools.join(', ')}<br>
               • <strong>AI & Developer Tools:</strong> ${s.ai_tools.join(', ')}`,
        actions: [
          { text: "🚀 View Projects", prompt: "Show Portfolio Projects" },
          { text: "💼 Internship", prompt: "Internship" }
        ]
      };
    }

    // 5. Education / Degree / College
    if (matchAny(text, ['education', 'degree', 'college', 'university', 'cgpa', 'school', 'marks', 'academic', 'gpa', 'study'])) {
      const p = ALLEN_KNOWLEDGE.profile;
      return {
        text: `🎓 <strong>Academic Qualifications:</strong><br><br>
               🏛️ <strong>Degree:</strong> ${p.degree}<br>
               🏫 <strong>Institution:</strong> ${p.college}<br>
               📅 <strong>Duration:</strong> ${p.gradYear}<br>
               📈 <strong>CGPA:</strong> ${p.cgpa}<br><br>
               🏫 <strong>Class XII (Secondary):</strong> Kongunadu Matric. Hr. Sec. School (74.5%)`,
        actions: [
          { text: "💻 Technical Skills", prompt: "Technical Skills" },
          { text: "📄 Resume", link: p.resume }
        ]
      };
    }

    // 6. Internship / Experience / Work
    if (matchAny(text, ['intern', 'internship', 'experience', 'company', 'work', 'job', 'cannyfore'])) {
      const i = ALLEN_KNOWLEDGE.internship;
      return {
        text: `💼 <strong>Internship Experience:</strong><br><br>
               🎯 <strong>Role:</strong> ${i.role}<br>
               🏢 <strong>Company:</strong> ${i.company} (${i.duration})<br><br>
               <strong>Key Deliverables:</strong><br>
               • ${i.highlights.join('<br>• ')}`,
        actions: [
          { text: "🚀 View Projects", prompt: "Show Portfolio Projects" },
          { text: "📞 Contact Allen", prompt: "Contact" }
        ]
      };
    }

    // 7. Certifications / Credentials
    if (matchAny(text, ['certif', 'credential', 'achievement', 'award', 'course'])) {
      return {
        text: `🏆 <strong>Certifications & Highlights:</strong><br><br>
               • <strong>Full Stack Web Development Certification</strong> (MERN & REST API design)<br>
               • <strong>Summer Internship Certification</strong> at Cannyfore Technology Solutions<br>
               • <strong>AI & Local LLM Integration</strong> specialization<br>
               • Maintained a strong <strong>7.9/10 CGPA</strong> in Computer Science Engineering`,
        actions: [
          { text: "📄 View Resume", link: ALLEN_KNOWLEDGE.profile.resume },
          { text: "💼 Internship Details", prompt: "Internship" }
        ]
      };
    }

    // 8. Resume / CV
    if (matchAny(text, ['resume', 'cv', 'download resume', 'document', 'pdf'])) {
      return {
        text: `📄 <strong>Allen's Official Resume:</strong><br><br>
               You can inspect or download the official resume PDF directly below.`,
        actions: [
          { text: "⬇️ Download Resume PDF", link: ALLEN_KNOWLEDGE.profile.resume, isDownload: true },
          { text: "🔗 LinkedIn Profile", link: ALLEN_KNOWLEDGE.profile.linkedin }
        ]
      };
    }

    // 9. Contact / Reach out / Email / Phone
    if (matchAny(text, ['contact', 'email', 'phone', 'call', 'reach', 'hire', 'mail', 'connect', 'touch', 'location'])) {
      const p = ALLEN_KNOWLEDGE.profile;
      return {
        text: `📞 <strong>Direct Contact Hub:</strong><br><br>
               ✉️ <strong>Email:</strong> <a href="mailto:${p.email}" class="ai-link">${p.email}</a><br>
               📱 <strong>Phone:</strong> <a href="tel:${p.phone}" class="ai-link">${p.phone}</a><br>
               📍 <strong>Location:</strong> ${p.location}<br>
               🐙 <strong>GitHub:</strong> <a href="${p.github}" target="_blank" class="ai-link">github.com/AllenJerries</a><br>
               💼 <strong>LinkedIn:</strong> <a href="${p.linkedin}" target="_blank" class="ai-link">linkedin.com/in/allen-jerries-a-l</a>`,
        actions: [
          { text: "✉️ Send Message via Contact Form", action: "scroll_contact" },
          { text: "📄 Download Resume", link: p.resume }
        ]
      };
    }

    // 10. Current Goal / Career Objective / Hire
    if (matchAny(text, ['goal', 'career', 'objective', 'future', 'seeking', 'role', 'why hire', 'hire allen'])) {
      return {
        text: `📍 <strong>Allen's Current Career Focus:</strong><br><br>
               ${ALLEN_KNOWLEDGE.profile.currentGoal}<br><br>
               <strong>Why Hire Allen?</strong><br>
               • Proven ability to design & ship full-stack web and mobile apps.<br>
               • Strong foundation in algorithms, REST APIs, and database architecture.<br>
               • Hands-on experience with modern AI tools (Local LLMs, Ollama, AI Agents).`,
        actions: [
          { text: "🚀 View Projects", prompt: "Show Portfolio Projects" },
          { text: "📞 Connect with Allen", prompt: "Contact" }
        ]
      };
    }

    // Fallback response for unhandled queries
    return {
      text: `🤖 I'm specialized in Allen's portfolio! Here are key areas you can explore about <strong>Allen Jerries</strong>:`,
      actions: [
        { text: "👋 Tell me about Allen", prompt: "Tell me about Allen" },
        { text: "🚀 Best Project", prompt: "Best Project" },
        { text: "💻 Technical Skills", prompt: "Technical Skills" },
        { text: "📄 Resume", link: ALLEN_KNOWLEDGE.profile.resume }
      ]
    };
  }

  function matchAny(text, keywords) {
    return keywords.some(k => text.includes(k));
  }

  // ════════════════════════════════════════════════════════════
  // 3. UI CONTROLLER & MICRO-INTERACTIONS
  // ════════════════════════════════════════════════════════════
  let triggerBtn, panel, closeBtn, chatLog, inputForm, userInput, chipsContainer;
  let isTyping = false;

  function initAllenAI() {
    triggerBtn = document.getElementById('allen-ai-trigger');
    panel = document.getElementById('allen-ai-panel');
    closeBtn = document.getElementById('allen-ai-close');
    chatLog = document.getElementById('ai-chat-log');
    inputForm = document.getElementById('ai-input-form');
    userInput = document.getElementById('ai-user-input');
    chipsContainer = document.getElementById('ai-prompt-chips');

    if (!triggerBtn || !panel) return;

    // Toggle Panel
    triggerBtn.addEventListener('click', togglePanel);
    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    // Prompt Chips click listener
    if (chipsContainer) {
      chipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.ai-chip');
        if (chip && !isTyping) {
          const promptText = chip.getAttribute('data-prompt');
          if (promptText) handleUserQuery(promptText);
        }
      });
    }

    // Input form submission
    if (inputForm) {
      inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = userInput.value.trim();
        if (val && !isTyping) {
          userInput.value = '';
          handleUserQuery(val);
        }
      });
    }

    // Chat Log Action Delegation
    if (chatLog) {
      chatLog.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.ai-action-btn');
        if (actionBtn && !isTyping) {
          const prompt = actionBtn.getAttribute('data-prompt');
          const link = actionBtn.getAttribute('data-link');
          const action = actionBtn.getAttribute('data-action');

          if (prompt) {
            handleUserQuery(prompt);
          } else if (link) {
            window.open(link, '_blank');
          } else if (action === 'scroll_contact') {
            closePanel();
            const contactSection = document.getElementById('contact');
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  }

  function togglePanel() {
    if (panel.classList.contains('active')) {
      closePanel();
    } else {
      openPanel();
    }
  }

  function openPanel() {
    panel.classList.remove('hidden');
    // Force reflow for smooth transform scale
    void panel.offsetWidth;
    panel.classList.add('active');
    triggerBtn.classList.add('open');
    if (userInput) userInput.focus();
  }

  function closePanel() {
    panel.classList.remove('active');
    triggerBtn.classList.remove('open');
    setTimeout(() => {
      if (!panel.classList.contains('active')) {
        panel.classList.add('hidden');
      }
    }, 350);
  }

  // Handle Query Flow: User Msg -> Thinking Dots -> AI Response
  async function handleUserQuery(queryText) {
    if (isTyping) return;
    isTyping = true;

    // 1. Append User Message
    appendUserMessage(queryText);
    scrollToBottom();

    // 2. Show Thinking Indicator
    const thinkingElem = appendThinkingIndicator();
    scrollToBottom();

    // 3. Simulate AI Reasoning Delay (450ms)
    await new Promise(res => setTimeout(res, 500));

    // Remove thinking indicator
    if (thinkingElem && thinkingElem.parentNode) {
      thinkingElem.parentNode.removeChild(thinkingElem);
    }

    // 4. Generate Knowledge Response
    const response = queryKnowledgeBase(queryText);

    // 5. Append AI Message with Typing / Card Rendering
    await appendAIMessage(response);

    isTyping = false;
    scrollToBottom();
  }

  function appendUserMessage(text) {
    const msgRow = document.createElement('div');
    msgRow.className = 'ai-message-row user';
    msgRow.innerHTML = `
      <div class="user-msg-content">${escapeHTML(text)}</div>
    `;
    chatLog.appendChild(msgRow);
  }

  function appendThinkingIndicator() {
    const row = document.createElement('div');
    row.className = 'ai-message-row ai thinking-row';
    row.innerHTML = `
      <div class="ai-msg-avatar">✨</div>
      <div class="ai-msg-content thinking-box">
        <span class="ai-dot"></span>
        <span class="ai-dot"></span>
        <span class="ai-dot"></span>
      </div>
    `;
    chatLog.appendChild(row);
    return row;
  }

  async function appendAIMessage(response) {
    const row = document.createElement('div');
    row.className = 'ai-message-row ai';
    
    const avatar = document.createElement('div');
    avatar.className = 'ai-msg-avatar';
    avatar.textContent = '✨';

    const content = document.createElement('div');
    content.className = 'ai-msg-content';

    row.appendChild(avatar);
    row.appendChild(content);
    chatLog.appendChild(row);

    // Type text smoothly
    const textHolder = document.createElement('div');
    textHolder.className = 'ai-text-holder';
    content.appendChild(textHolder);

    // Instant HTML insertion for clean formatted text with smooth fade
    textHolder.innerHTML = response.text;
    textHolder.style.opacity = '0';
    textHolder.style.transform = 'translateY(4px)';
    textHolder.style.transition = 'all 0.3s ease';

    await new Promise(r => setTimeout(r, 50));
    textHolder.style.opacity = '1';
    textHolder.style.transform = 'translateY(0)';

    // Render Cards if present
    if (response.cards && response.cards.length > 0) {
      const cardsContainer = document.createElement('div');
      cardsContainer.className = 'ai-cards-container';

      response.cards.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'ai-project-card glass';
        card.innerHTML = `
          <div class="ai-card-tag">${proj.tag}</div>
          <div class="ai-card-title">${proj.title}</div>
          <div class="ai-card-desc">${proj.desc}</div>
          <div class="ai-card-tech">
            ${proj.tech.map(t => `<span class="ai-tech-pill">${t}</span>`).join('')}
          </div>
          <div class="ai-card-footer">
            <a href="${proj.github}" target="_blank" class="ai-card-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Repository</span>
            </a>
          </div>
        `;
        cardsContainer.appendChild(card);
      });
      content.appendChild(cardsContainer);
    }

    // Render Smart Action Buttons
    if (response.actions && response.actions.length > 0) {
      const actionsWrap = document.createElement('div');
      actionsWrap.className = 'ai-smart-actions';

      response.actions.forEach(act => {
        const btn = document.createElement('button');
        btn.className = 'ai-action-btn';
        btn.textContent = act.text;
        if (act.prompt) btn.setAttribute('data-prompt', act.prompt);
        if (act.link) btn.setAttribute('data-link', act.link);
        if (act.action) btn.setAttribute('data-action', act.action);
        actionsWrap.appendChild(btn);
      });

      content.appendChild(actionsWrap);
    }
  }

  function scrollToBottom() {
    if (chatLog) {
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllenAI);
  } else {
    initAllenAI();
  }
})();
