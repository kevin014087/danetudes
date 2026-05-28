(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    WA_NUMBER: '22589767600',
    CLAPAY_LINK: 'https://clp.ci/0BAKPN',
    SCROLL_THRESHOLD: 20,
    CAROUSEL_INTERVAL: 5000,
    ANIMATION_DURATION: 1000
  };

  // WhatsApp messages in both languages
  const WA_MESSAGES = {
    fr: {
      general    : 'Bonjour, je souhaite des informations.',
      reservation: 'Bonjour, je souhaite réserver un cours.',
      annulation : 'Bonjour, je souhaite annuler ma réservation.',
      devis      : 'Bonjour, je souhaite recevoir un devis.',
      fle        : 'Bonjour, je cherche des cours de FLE.',
      adulte     : 'Bonjour, je suis intéressé(e) par l\'alphabétisation.',
      primaire   : 'Bonjour, je souhaite inscrire un enfant (Primaire).',
      college    : 'Bonjour, je souhaite inscrire un élève (Collège).',
      lycee      : 'Bonjour, je souhaite inscrire un élève (Lycée).',
    },
    en: {
      general    : 'Hello, I would like information about your courses.',
      reservation: 'Hello, I would like to book a course.',
      annulation : 'Hello, I would like to cancel my booking.',
      devis      : 'Hello, I would like to receive a quote.',
      fle        : 'Hello, I am looking for French language courses.',
      adulte     : 'Hello, I am interested in adult literacy courses.',
      primaire   : 'Hello, I would like to enrol a child (Primary).',
      college    : 'Hello, I would like to enrol a student (Middle school).',
      lycee      : 'Hello, I would like to enrol a student (High school).',
    }
  };

  // State
  let isTransitioning = false;
  let currentSlide = 0;
  let carouselTimer = null;
  let countersAnimated = false;

  // DOM Elements
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  const carouselTrack = document.getElementById('carousel-track');
  const carouselDots = document.getElementById('carousel-dots');
  const carouselProgress = document.getElementById('carousel-progress');
  const slides = document.querySelectorAll('.carousel-slide');

  // Initialize
  function init() {
    setupNavbar();
    setupCarousel();
    setupCounters();
    setupFAQ();
    setupWhatsApp();
    setupClapay();
    setupSmoothScroll();
    // admin UI removed; no need to hide floats on special pages
    setupTeacherSidebar();
    setupDynamicOffers();
  }

  // Navbar functionality
  function setupNavbar() {
    if (!navbar || !navToggle || !navMobile) return;

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
      navMobile.classList.toggle('active');
      navToggle.classList.toggle('active');
      document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    const mobileLinks = navMobile.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Scroll effect
    let lastScrollY = window.scrollY;
    function handleScroll() {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > CONFIG.SCROLL_THRESHOLD) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
      }

      lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Carousel functionality
  function setupCarousel() {
    if (!carouselTrack || slides.length === 0) return;

    // Create dots
    if (carouselDots) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
      });
    }

    // Navigation buttons
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    carouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) nextSlide();
      if (touchEndX > touchStartX + swipeThreshold) prevSlide();
    }

    // Auto-play
    startCarouselTimer();

    // Pause on hover
    carouselTrack.addEventListener('mouseenter', stopCarouselTimer);
    carouselTrack.addEventListener('mouseleave', startCarouselTimer);
  }

  function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    currentSlide = index;
    carouselTrack.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    const dots = carouselDots?.querySelectorAll('.dot');
    if (dots) {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    // Restart progress bar
    if (carouselProgress) {
      carouselProgress.style.transition = 'none';
      carouselProgress.style.width = '0';
      setTimeout(() => {
        carouselProgress.style.transition = `width ${CONFIG.CAROUSEL_INTERVAL}ms linear`;
        carouselProgress.style.width = '100%';
      }, 50);
    }

    setTimeout(() => {
      isTransitioning = false;
    }, 600);
  }

  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }

  function startCarouselTimer() {
    stopCarouselTimer();
    carouselTimer = setInterval(nextSlide, CONFIG.CAROUSEL_INTERVAL);
  }

  function stopCarouselTimer() {
    if (carouselTimer) {
      clearInterval(carouselTimer);
      carouselTimer = null;
    }
  }

  // Counter animation
  function setupCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          animateCounters();
          countersAnimated = true;
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = CONFIG.ANIMATION_DURATION;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  }

  // FAQ functionality
  function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // WhatsApp functionality
  function setupWhatsApp() {
    // Update WA messages when language changes
    window.updateWALang = function(lang) {
      // This function is called by i18n.js when language changes
    };

    // Open WhatsApp function
    window.openWA = function(type = 'general') {
      const lang = window.getLang ? window.getLang() : 'fr';
      const msg = WA_MESSAGES[lang]?.[type]
        || WA_MESSAGES.fr[type]
        || WA_MESSAGES.fr.general;
      
      const url = `https://wa.me/${CONFIG.WA_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Bind WA buttons
    document.querySelectorAll('[data-wa]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-wa');
        openWA(type);
      });
    });
  }

  // Clapay functionality
  function setupClapay() {
    window.openClapay = function() {
      window.open(CONFIG.CLAPAY_LINK, '_blank', 'noopener,noreferrer');
    };

    // Bind Clapay buttons
    document.querySelectorAll('[data-clapay]').forEach(btn => {
      btn.addEventListener('click', openClapay);
    });
  }

  // Smooth scroll
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // UI adjustments for special pages are not required

  // Teacher sidebar functionality
  function setupDynamicOffers() {
    const offersContainer = document.querySelector('#dynamic-offers, #public-offers-list');
    if (!offersContainer) return;

    fetch('/api/offres')
      .then(response => response.json())
      .then(offres => {
        const publishedOffers = offres.filter(offre => offre.statut === 'publié');
        if (publishedOffers.length === 0) {
          return;
        }

        const markup = publishedOffers.map(offre => {
          return `
            <div class="service-detail-card">
              <div class="service-header">
                <div class="service-icon">📌</div>
                <h2>${offre.titre}</h2>
              </div>
              <div class="service-content">
                <h3>${offre.categorie || 'Offre'}</h3>
                <p>${offre.description || 'Description à venir.'}</p>
                <p><strong>Prix :</strong> ${offre.prix || 'Sur devis'}</p>
                <div class="service-actions">
                  <button class="btn btn-primary" data-wa="reservation">💬 Réserver</button>
                  <a class="btn btn-outline" href="contact.html">Voir plus</a>
                </div>
              </div>
            </div>
          `;
        }).join('');

        offersContainer.innerHTML = markup;
        const fallbackGrid = document.querySelector('.static-fallback');
        if (fallbackGrid) {
          fallbackGrid.style.display = 'none';
        }
      })
      .catch(() => {
        // Failed to load dynamic offers: keep static fallback
      });
  }

  function setupTeacherSidebar() {
    const teacherCards = document.querySelectorAll('.teacher-card');
    const sidebar = document.getElementById('teacher-sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    
    if (!sidebar || !teacherCards.length) return;
    
    // Teacher data
    const teachers = {
      daniel: {
        name: 'Daya Ezechiel Tchickiwla',
        role: 'Coach FLE',
        bio: 'Profil international formé entre la Côte d\'Ivoire et l\'Inde, il combine une base scientifique (microbiologie, contrôle qualité) avec de solides compétences en communication et interculturel. Son immersion en milieu anglophone lui a permis de maîtriser l\'anglais et de comprendre les difficultés des apprenants. Aujourd\'hui, il enseigne le FLE avec une approche pratique et personnalisée, visant à développer la confiance, l\'expression et l\'ouverture culturelle des étudiants.',
        photo: 'assets/images/teacher-1.jpg'
      },
      marie: {
        name: 'Marie Konan',
        role: 'Responsable FLE & Alphabétisation',
        bio: 'Marie Konan est experte en didactique du français langue étrangère. Elle accompagne les expatriés et les adultes dans leur apprentissage avec patience et bienveillance.',
        photo: 'assets/images/teacher-2.webp'
      },
      jean: {
        name: 'Jean Yapo',
        role: 'Enseignant Mathématiques & Physique',
        bio: 'Jean Yapo est enseignant certifié avec plus de 10 ans d\'expérience. Il aide les élèves à comprendre les concepts complexes et à exceller dans les examens.',
        photo: 'assets/images/teacher-3.webp'
      },
      fatou: {
        name: 'Fatou Bamba',
        role: 'Enseignante Français & Littérature',
        bio: 'Fatou Bamba est passionnée par la littérature et la langue française. Elle aide les élèves à développer leur expression écrite et leur amour de la lecture.',
        photo: 'assets/images/teacher-4.webp'
      }
    };
    
    // Open sidebar on card click
    teacherCards.forEach(card => {
      card.addEventListener('click', () => {
        const teacherId = card.getAttribute('data-teacher');
        const teacher = teachers[teacherId];
        
        if (teacher) {
          const lang = window.getLang ? window.getLang() : 'fr';
          const roleKey = teacherId === 'daniel' ? 'team.r1' : teacherId === 'marie' ? 'team.r2' : teacherId === 'jean' ? 'team.r3' : 'team.r4';
          const bioKey = `team.bio.${teacherId}`;
          
          const translatedRole = window.TRANSLATIONS?.[lang]?.[roleKey] || teacher.role;
          const translatedBio = window.TRANSLATIONS?.[lang]?.[bioKey] || teacher.bio;
          
          document.getElementById('sidebar-name').textContent = teacher.name;
          document.getElementById('sidebar-role').textContent = translatedRole;
          document.getElementById('sidebar-bio-text').textContent = translatedBio;
          document.getElementById('sidebar-photo').src = teacher.photo;
          document.getElementById('sidebar-photo').alt = teacher.name;
          
          sidebar.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    
    // Close sidebar
    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
