/**
 * Portfolio Main Interactive JavaScript
 * Includes: Theme Toggle, Typing Animation, Stats Counter,
 * Project Filters & Dynamic Modal, Form Validation & Toast Notification.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initThemeToggle();
  initNavbarBehavior();
  initTypingEffect();
  initStatsCounter();
  initSkillBars();
  initContactForm();
  initBackToTop();
  initJourneyTabs();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  
  if (!themeToggleBtn) return;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('theme-preference') || 'dark';
  applyTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme-preference', newTheme);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'bi bi-moon-stars-fill text-indigo';
        themeToggleBtn.setAttribute('title', 'สลับเป็นโหมดกลางคืน (Switch to Dark)');
      } else {
        themeIcon.className = 'bi bi-sun-fill text-warning';
        themeToggleBtn.setAttribute('title', 'สลับเป็นโหมดกลางวัน (Switch to Light)');
      }
    }
  }
}

/* ==========================================================================
   2. Navbar Scroll Behavior & Mobile Collapse
   ========================================================================== */
function initNavbarBehavior() {
  const navbar = document.querySelector('.custom-navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbarCollapse = document.getElementById('navbarNav');

  // Change navbar styling on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Auto-close mobile navbar on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });
}

/* ==========================================================================
   3. Dynamic Typing Effect (Hero Section)
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typingText');
  if (!typingElement) return;

  const roles = [
    'นักศึกษาวิทยาลัยอาชีวศึกษานครศรีธรรมราช 🎓',
    'สาขาธุรกิจดิจิทัล (Digital Business) 📱',
    'Web Developer & UI/UX Designer 💻',
    'Creative Tech Explorer ✨'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 45;
  const pauseTime = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   4. Stats Counter on Scroll (Intersection Observer)
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
          const suffix = stat.getAttribute('data-suffix') || '';
          animateNumber(stat, target, suffix);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.getElementById('about');
  if (statsSection) {
    observer.observe(statsSection);
  }

  function animateNumber(element, target, suffix) {
    let current = 0;
    const duration = 1600;
    const frameRate = 30;
    const step = target / (duration / frameRate);

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
    }, frameRate);
  }
}

/* ==========================================================================
   5. Animated Skill Progress Bars on Scroll
   ========================================================================== */
function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-progress-fill');
  if (!skillFills.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        skillFills.forEach(bar => {
          const width = bar.getAttribute('data-width') || '0%';
          bar.style.width = width;
        });
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }
}

/* ==========================================================================
   6. Project Filtering (All, Web App, Mobile/API, UI/UX)
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease';
            item.style.opacity = '1';
          }, 40);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. Project Detail Modal Data Handler
   ========================================================================== */
const projectData = {
  1: {
    title: 'OmniMarket - E-Commerce Platform',
    category: 'Full Stack Web App',
    image: 'assets/projects/project1.jpg',
    description: 'ระบบร้านค้าออนไลน์เต็มรูปแบบ (Full E-Commerce Web Application) พร้อมระบบจัดการตะกร้าสินค้า แคตตาล็อกแสดงสินค้าแบบตอบสนอง แดชบอร์ดสรุปยอดขายสำหรับผู้ขาย และระบบชำระเงินจำลองที่มีความปลอดภัยสูง',
    tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Bootstrap 5', 'Stripe API'],
    demoUrl: '#',
    codeUrl: 'https://github.com'
  },
  2: {
    title: 'Aura - AI Data Analytics Dashboard',
    category: 'AI & Data Dashboard',
    image: 'assets/projects/project2.jpg',
    description: 'แพลตฟอร์มวิเคราะห์ข้อมูลและมอนิเตอร์โมเดลปัญญาประดิษฐ์ (AI / ML Pipeline Monitoring) แบบเรียลไทม์ พร้อมกราฟข้อมูลเชิงโต้ตอบ การคำนวณอัตราความแม่นยำ แจ้งเตือนข้อผิดพลาด และสรุปรายงานผล',
    tech: ['Next.js', 'Python FastAPI', 'Chart.js', 'PostgreSQL', 'Tailwind/Bootstrap', 'Docker'],
    demoUrl: '#',
    codeUrl: 'https://github.com'
  },
  3: {
    title: 'Synapse PM - Collaborative Task Flow',
    category: 'SaaS Web Application',
    image: 'assets/projects/project3.jpg',
    description: 'เว็บแอปพลิเคชันสำหรับบริหารจัดการงานและโปรเจกต์ของทีมสไตล์ Kanban Board รองรับการลากวาง (Drag & Drop) จัดการสมาชิก กำหนดส่ง และอัปเดตสถานะแบบเรียลไทม์ผ่าน WebSockets',
    tech: ['Vue.js', 'Node.js', 'Socket.io', 'Redis', 'Bootstrap 5'],
    demoUrl: '#',
    codeUrl: 'https://github.com'
  },
  4: {
    title: 'Avalon - Fintech & Crypto Mobile App',
    category: 'Mobile & UI/UX',
    image: 'assets/projects/project4.jpg',
    description: 'ดีไซน์และพัฒนาส่วนติดต่อผู้ใช้งานแอปพลิเคชันกระเป๋าเงินดิจิทัล (Fintech & Crypto Wallet) หน้าจอจัดการบัตรเครดิต ประวัติการทำธุรกรรม กราฟวิเคราะห์พอร์ตโฟลิโอ และระบบยืนยันตัวตนด้วย Biometrics',
    tech: ['Figma', 'React Native', 'TypeScript', 'Tailwind', 'REST API'],
    demoUrl: '#',
    codeUrl: 'https://github.com'
  }
};

function initProjectModal() {
  const detailBtns = document.querySelectorAll('.btn-project-detail');
  const modalEl = document.getElementById('projectModal');
  if (!modalEl) return;

  const modalTitle = document.getElementById('modalProjectTitle');
  const modalCat = document.getElementById('modalProjectCat');
  const modalImg = document.getElementById('modalProjectImg');
  const modalDesc = document.getElementById('modalProjectDesc');
  const modalTech = document.getElementById('modalProjectTech');
  const modalDemoBtn = document.getElementById('modalDemoBtn');
  const modalCodeBtn = document.getElementById('modalCodeBtn');

  detailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-id');
      const data = projectData[projectId];

      if (data) {
        modalTitle.textContent = data.title;
        modalCat.textContent = data.category;
        modalImg.src = data.image;
        modalImg.alt = data.title;
        modalDesc.textContent = data.description;
        
        // Render tech tags
        modalTech.innerHTML = data.tech.map(t => `<span class="tag-pill me-1 mb-1">${t}</span>`).join('');
        
        modalDemoBtn.href = data.demoUrl;
        modalCodeBtn.href = data.codeUrl;

        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    });
  });
}

/* ==========================================================================
   8. Contact Form Validation & Toast Notification
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const toastEl = document.getElementById('contactToast');
  const toastMessage = document.getElementById('toastMessage');
  const submitBtn = document.getElementById('btnSubmitForm');

  if (!form || !toastEl) return;

  const toast = new bootstrap.Toast(toastEl, { delay: 4500 });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    form.classList.add('was-validated');

    // Simulate sending with loading state
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      กำลังส่งข้อความ...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;

      const nameVal = document.getElementById('contactName')?.value || 'คุณ';
      toastMessage.innerHTML = `<strong>ขอบคุณค่ะคุณ ${nameVal}!</strong> ข้อความของคุณถูกส่งเรียบร้อยแล้ว ฉันจะรีบติดต่อกลับโดยเร็วที่สุดค่ะ`;
      toast.show();

      // Reset form
      form.reset();
      form.classList.remove('was-validated');
    }, 1200);
  });
}

/* ==========================================================================
   9. Floating Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   10. Education & Experience Tabs + Chronological Sort Order Toggle
   ========================================================================== */
function initJourneyTabs() {
  const tabEduBtn = document.getElementById('tabEducationBtn');
  const tabExpBtn = document.getElementById('tabExperienceBtn');
  const paneEdu = document.getElementById('journey-education');
  const paneExp = document.getElementById('journey-experience');

  if (!tabEduBtn || !tabExpBtn || !paneEdu || !paneExp) return;

  // Tab switching
  tabEduBtn.addEventListener('click', () => {
    tabEduBtn.classList.add('active');
    tabExpBtn.classList.remove('active');
    paneEdu.classList.remove('d-none');
    paneExp.classList.add('d-none');
  });

  tabExpBtn.addEventListener('click', () => {
    tabExpBtn.classList.add('active');
    tabEduBtn.classList.remove('active');
    paneExp.classList.remove('d-none');
    paneEdu.classList.add('d-none');
  });

  // Sort Order Toggle (Latest First vs Oldest First)
  const sortToggleBtn = document.getElementById('eduSortToggleBtn');
  const sortLabel = document.getElementById('eduSortLabel');
  const timelineContainer = document.getElementById('educationTimelineContainer');

  if (sortToggleBtn && sortLabel && timelineContainer) {
    let isNewestFirst = true;

    sortToggleBtn.addEventListener('click', () => {
      isNewestFirst = !isNewestFirst;
      const items = Array.from(timelineContainer.querySelectorAll('.edu-timeline-item'));

      // Sort items based on data-order (5 = ปริญญาตรี, 1 = ประถม)
      items.sort((a, b) => {
        const orderA = parseInt(a.getAttribute('data-order') || '0', 10);
        const orderB = parseInt(b.getAttribute('data-order') || '0', 10);
        return isNewestFirst ? orderB - orderA : orderA - orderB;
      });

      // Animate container out and in
      timelineContainer.style.opacity = '0.3';
      timelineContainer.style.transform = 'translateY(8px)';
      timelineContainer.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

      setTimeout(() => {
        timelineContainer.innerHTML = '';
        items.forEach(item => timelineContainer.appendChild(item));

        timelineContainer.style.opacity = '1';
        timelineContainer.style.transform = 'translateY(0)';

        if (isNewestFirst) {
          sortLabel.innerHTML = 'แสดงล่าสุดก่อน (ปริญญาตรี &rarr; ประถม)';
        } else {
          sortLabel.innerHTML = 'แสดงเริ่มต้นก่อน (ประถม &rarr; ปริญญาตรี)';
        }
      }, 200);
    });
  }
}
