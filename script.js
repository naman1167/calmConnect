// Cinematic Splash Screen Logic for CalmConnect
window.addEventListener('DOMContentLoaded', function () {
  const splash = document.getElementById('splashScreen');
  const mainApp = document.getElementById('mainApp');
  const logoText = document.getElementById('splashLogoText');
  const tagline = document.querySelector('.splash-tagline');
  const orb = document.getElementById('glowingOrb');
  const starsCanvas = document.getElementById('splashStars');
  const muteBtn = document.getElementById('muteBtn');
  const ambient = document.getElementById('splashAmbient');

  // Responsive canvas for twinkling stars
  function resizeStars() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
  }
  resizeStars();
  window.addEventListener('resize', resizeStars);

  // Draw twinkling stars
  const ctx = starsCanvas.getContext('2d');
  const STAR_COUNT = 60;
  let stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.5,
      a: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.002 + 0.001,
      twinkle: Math.random() * 0.5 + 0.5
    });
  }
  function drawStars() {
    ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    for (let s of stars) {
      s.a += s.speed;
      let tw = 0.7 + 0.3 * Math.sin(s.a) * s.twinkle;
      ctx.globalAlpha = tw;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#b993d6';
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStars);
  }
  drawStars();

  // Typing animation for CalmConnect
  const appName = 'CalmConnect';
  let i = 0;
  function typeLogo() {
    if (i <= appName.length) {
      logoText.textContent = appName.slice(0, i);
      i++;
      setTimeout(typeLogo, 90);
    } else {
      // Fade in tagline after typing
      setTimeout(() => {
        tagline.classList.add('splash-tagline-visible');
      }, 1000);
    }
  }
  setTimeout(typeLogo, 900); // Start typing after orb floats in

  // Ambient sound logic
  let muted = false;
  function updateMuteBtn() {
    muteBtn.textContent = muted ? '🔇' : '🔊';
    muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
  }
  muteBtn.addEventListener('click', function () {
    muted = !muted;
    ambient.muted = muted;
    updateMuteBtn();
  });
  ambient.volume = 0.25;
  ambient.play().catch(() => {});
  updateMuteBtn();

  // Hide splash and show main app after 5.5s
  setTimeout(() => {
    if (splash) {
      splash.classList.add('splash-hide');
      setTimeout(() => {
        splash.style.display = 'none';
        if (mainApp) mainApp.style.display = '';
        ambient.pause();
      }, 1200); // match CSS transition
    }
  }, 5500);

  // Mood-based background logic
  const emojiBtns = document.querySelectorAll('.emoji-btn');
  const animatedBg = document.querySelector('.animated-bg');
  const moodClasses = ['mood-sad-bg', 'mood-angry-bg', 'mood-sleepy-bg', 'mood-happy-bg', 'mood-neutral-bg'];

  // --- Particle Animation for Dashboard ---
  const dashboardParticles = document.getElementById('dashboardParticles');
  let particleMood = 'neutral';
  function resizeDashboardParticles() {
    dashboardParticles.width = window.innerWidth;
    dashboardParticles.height = window.innerHeight;
  }
  resizeDashboardParticles();
  window.addEventListener('resize', resizeDashboardParticles);

  const particleColors = {
    sad: ['#a1c4fd', '#c2e9fb'],
    angry: ['#ff8177', '#ff867a'],
    sleepy: ['#cfd9df', '#e2ebf0'],
    happy: ['#fbc2eb', '#a6c1ee'],
    neutral: ['#e0c3fc', '#8ec5fc']
  };

  let particles = [];
  function createParticles(mood) {
    const count = 32;
    particles = [];
    for (let i = 0; i < count; i++) {
      const color = particleColors[mood][i % 2];
      particles.push({
        x: Math.random() * dashboardParticles.width,
        y: Math.random() * dashboardParticles.height,
        r: Math.random() * 2.5 + 1.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.3,
        color
      });
    }
  }
  function drawParticles() {
    const ctx = dashboardParticles.getContext('2d');
    ctx.clearRect(0, 0, dashboardParticles.width, dashboardParticles.height);
    for (let p of particles) {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > dashboardParticles.width) p.dx *= -1;
      if (p.y < 0 || p.y > dashboardParticles.height) p.dy *= -1;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawParticles);
  }
  createParticles('neutral');
  drawParticles();

  // --- Emoji Selector: Breathing Ring & Mood Logic ---
  function selectEmoji(mood) {
    emojiBtns.forEach(btn => btn.classList.remove('selected'));
    const btn = Array.from(emojiBtns).find(b => b.dataset.mood === mood);
    if (btn) btn.classList.add('selected');
  }

  // --- Glass Avatar Mood Reaction ---
  const avatarFace = document.getElementById('avatarFace');
  const glassAvatar = document.getElementById('glassAvatar');
  const avatarFaces = {
    sad: '😢',
    angry: '😡',
    sleepy: '😴',
    happy: '😍',
    neutral: '🙂'
  };
  function updateAvatar(mood) {
    avatarFace.textContent = avatarFaces[mood] || '🙂';
    glassAvatar.style.boxShadow = `0 4px 32px ${particleColors[mood][0]}cc, 0 0 0 8px ${particleColors[mood][1]}33, inset 0 1.5px 18px 0 #fff2`;
    glassAvatar.style.background = `linear-gradient(120deg, ${particleColors[mood][0]}22, ${particleColors[mood][1]}22)`;
  }

  // --- Mood Quote Generator ---
  const moodQuote = document.getElementById('moodQuote');
  const moodQuotes = {
    sad: "It's okay to feel sad. This moment will pass, and you are not alone.",
    angry: 'Take a deep breath. You have the strength to respond with calm.',
    sleepy: 'Rest is productive. Give yourself permission to recharge.',
    happy: 'Savor this joy. Let it fill your heart and inspire your day!',
    neutral: "Every feeling is valid. You are doing your best, and that's enough."
  };
  function updateQuote(mood) {
    moodQuote.textContent = moodQuotes[mood] || '';
  }

  // --- Sound Feedback ---
  const moodChime = new Audio('assets/audio/chime.mp3');
  moodChime.volume = 0.25;
  function playChime() {
    moodChime.currentTime = 0;
    moodChime.play().catch(()=>{});
  }

  // --- Mood Change Handler ---
  function setMood(mood) {
    moodClasses.forEach(cls => animatedBg.classList.remove(cls));
    if (mood) {
      animatedBg.classList.add(`mood-${mood}-bg`);
      localStorage.setItem('calmconnect-mood', mood);
    } else {
      localStorage.removeItem('calmconnect-mood');
    }
    updateCursorMood(mood);
    selectEmoji(mood);
    createParticles(mood);
    updateAvatar(mood);
    updateQuote(mood);
    particleMood = mood;
    playChime();
  }

  emojiBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setMood(btn.dataset.mood);
    });
    btn.addEventListener('mouseenter', playChime);
  });

  // Restore last mood
  const lastMood = localStorage.getItem('calmconnect-mood');
  if (lastMood) setMood(lastMood);
  else setMood('neutral');

  // --- Scroll-based Reveal ---
  function revealOnScroll() {
    document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // Add fade-in/slide-up to cards/sections
  function addRevealClasses() {
    document.querySelectorAll('.module-card').forEach((el,i) => {
      el.classList.add('slide-up');
      el.style.transitionDelay = (i*0.12+0.2)+'s';
    });
    document.querySelectorAll('.dashboard-header, .mood-selector, #glassAvatar, #moodQuote').forEach((el,i) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = (i*0.12)+'s';
    });
  }
  addRevealClasses();

  // --- Animated Transitions for Module Cards ---
  document.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.add('fade-out');
      setTimeout(() => {
        // Placeholder: here you would show the module with a real transition
        card.classList.remove('fade-out');
      }, 700);
    });
  });

  // Custom glowing cursor
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  const moodCursorColors = {
    sad: 'radial-gradient(circle, #a1c4fd 60%, #c2e9fb 100%, transparent 100%)',
    angry: 'radial-gradient(circle, #ff8177 60%, #ff867a 100%, transparent 100%)',
    sleepy: 'radial-gradient(circle, #cfd9df 60%, #e2ebf0 100%, transparent 100%)',
    happy: 'radial-gradient(circle, #fbc2eb 60%, #a6c1ee 100%, transparent 100%)',
    neutral: 'radial-gradient(circle, #e0c3fc 60%, #8ec5fc 100%, transparent 100%)',
    default: 'radial-gradient(circle, #8ec5fc 60%, #b993d6 100%, transparent 100%)'
  };

  function updateCursorMood(mood) {
    cursor.style.background = moodCursorColors[mood] || moodCursorColors.default;
  }

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX - 16 + 'px';
    cursor.style.top = e.clientY - 16 + 'px';
  });

  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.85)';
  });
  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
  });

  // --- Custom Animated Cursor ---
  (function() {
    const cursor = document.getElementById('customCursor');
    if (!cursor) return;
    document.body.style.cursor = 'none';
    let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
    let cursorX = mouseX, cursorY = mouseY;
    let rafId;
    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.22;
      cursorY += (mouseY - cursorY) * 0.22;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      rafId = requestAnimationFrame(animateCursor);
    }
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor.style.display === 'none') cursor.style.display = '';
    });
    animateCursor();
    // Hover effect on interactive elements
    const hoverSelectors = ['button', '.feature-card', '.mood-planet', 'a', '[tabindex]'];
    hoverSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
      });
    });
    // Mood color effect
    function setCursorMood(mood) {
      cursor.classList.remove('cursor-angry','cursor-calm','cursor-happy','cursor-sad','cursor-tired');
      if (mood) cursor.classList.add('cursor-' + mood);
    }
    // Listen for mood changes (assume setMood is called elsewhere)
    window.setCursorMood = setCursorMood;
    // Try to auto-detect mood from localStorage on load
    const lastMood = localStorage.getItem('calmconnect-mood');
    if (lastMood) setCursorMood(lastMood);
    // Hide on mobile/touch
    function checkMobile() {
      if (window.innerWidth < 700 || 'ontouchstart' in window) {
        cursor.style.display = 'none';
        document.body.style.cursor = '';
        cancelAnimationFrame(rafId);
      } else {
        cursor.style.display = '';
        document.body.style.cursor = 'none';
        animateCursor();
      }
    }
    window.addEventListener('resize', checkMobile);
    checkMobile();
  })();
  // --- End Custom Animated Cursor ---
  // To update mood, call window.setCursorMood('angry'|'calm'|'happy'|'sad'|'tired') from your mood logic.

  // --- Feature Card Click Functionality ---
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', function() {
      const tool = card.getAttribute('data-tool');
      let msg = '';
      switch (tool) {
        case 'chatbot': msg = 'Opening Chatbot...'; break;
        case 'breathing': msg = 'Opening Breathing Exercises...'; break;
        case 'music': msg = 'Opening Mindful Music...'; break;
        case 'moodfood': msg = 'Opening MoodFood...'; break;
        case 'journal': msg = 'Opening Journal...'; break;
        case 'moodtracker': msg = 'Opening Mood Tracker...'; break;
        default: msg = 'Opening...';
      }
      alert(msg);
      // TODO: Replace alert with real module loading logic
    });
  });
  // --- Mood Planet Click Functionality ---
  document.querySelectorAll('.mood-planet').forEach(btn => {
    btn.addEventListener('click', function() {
      const mood = btn.getAttribute('data-mood');
      alert('You selected: ' + mood.charAt(0).toUpperCase() + mood.slice(1));
      // TODO: Replace alert with real mood logic
    });
  });
}); 
