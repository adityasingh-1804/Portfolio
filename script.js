/* ==========================================================================
   JAVASCRIPT INTERACTIVE CONTROLLER
   Project: B.Tech CSE Student Portfolio (Semester II)
   Author: Aryan Kaushik (ABES Engineering College)
   Description: Clean, pure ES6 Vanilla JavaScript code powering premium
                interactivity, dark/light theme, typing effect, scroll-reveals,
                animated skill-meters, and dynamic contact simulations.
                Heavy comments included to assist in viva explanations!
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. PRELOADER DISMISSAL
     VIVA TIP: "window.load" fires after all images, styles, and assets are ready.
     We fade the loader overlay using CSS transitions and then purge it.
     ========================================================================== */
  window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.classList.add('fade-out');
      // Wait for the opacity transition to complete before disabling display
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }
  });

  // Fallback in case window load takes too long (failsafe)
  setTimeout(() => {
    const preloader = document.querySelector('.preloader');
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  }, 3000);

  /* ==========================================================================
     2. DOCKY STICKY NAVIGATION HEADER
     VIVA TIP: Modifying header classes on the fly based on window scroll offsets.
     ========================================================================== */
  const header = document.querySelector('header');
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Toggle nav backdrop blur & shadow on scroll
    if (scrollPos > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }

    // Toggle Scroll-to-Top button visibility
    if (scrollPos > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Run active link highlighting
    highlightNavLink();

    // Run vertical timeline track update
    updateTimelineProgress();
  });

  /* ==========================================================================
     3. THEME MANAGEMENT SYSTEM (DARK/LIGHT TOGGLE + LOCALSTORAGE)
     VIVA TIP: LocalStorage stores data with no expiration. We store the current
     theme choice so the website remembers the user's choice on reload.
     ========================================================================== */
  const themeToggleBtn = document.getElementById('themeToggle');

  // 1. Check local storage for preference, default to Dark mode if blank
  const savedTheme = localStorage.getItem('theme') || 'dark';

  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }

  // 2. Toggle listener
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');

    // Update local storage configuration
    if (document.body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  });

  /* ==========================================================================
     4. MOBILE NAVIGATION SLIDE DRAWER
     VIVA TIP: Adding and removing classes to control mobile overlay slide states.
     ========================================================================== */
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.querySelector('.nav-links');
  const allNavLinks = document.querySelectorAll('.nav-item');

  // Open/Close menu drawer on hamburger click
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Auto-close menu drawer when clicking on any navigation item
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  /* ==========================================================================
     5. HERO DYNAMIC TYPING EFFECT
     VIVA TIP: Cycles through strings, types characters recursively, deletes
     characters at defined intervals using standard JavaScript intervals.
     ========================================================================== */
  const typingElement = document.getElementById('typewriter');
  const wordsToType = ['Web Developer', 'Frontend Learner', 'Tech Explorer', 'Problem Solver'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100; // Time in milliseconds between characters

  function typeEffect() {
    const currentWord = wordsToType[wordIndex];

    if (isDeleting) {
      // Remove last character
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40; // Speed up deletion for smooth UI flow
    } else {
      // Append next character
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100; // Natural writing cadence speed
    }

    // Word completed typing states
    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000; // Pause at end of completed word
      isDeleting = true;
    }
    // Word fully deleted states
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % wordsToType.length; // Loop around array
      typeSpeed = 300; // Pause before typing next word
    }

    setTimeout(typeEffect, typeSpeed);
  }

  // Kickstart typing sequence
  setTimeout(typeEffect, 1000);

  /* ==========================================================================
     6. PORTFOLIO SCROLL REVEAL (INTERSECTION OBSERVER)
     VIVA TIP: The Intersection Observer API asynchronously watches when target
     elements cross threshold boundary lines in the viewport. Superior to heavy
     onscroll listeners!
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Element crossed target viewport boundary -> reveal it
        entry.target.classList.add('active');
        // Stop observing once visible to maintain static layout stability
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null, // Watch browser viewport container
    threshold: 0.15, // Trigger when 15% of the element is inside the viewport
    rootMargin: '0px 0px -50px 0px' // Offset triggers upwards slightly
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     7. SKILL METERS SCROLL TRIGGERS (DYNAMIC FILL)
     VIVA TIP: We load skill progress widths at 0%. When the skills container is
     scrolled into view, we read 'data-width' and animate their layouts.
     ========================================================================== */
  const skillsSection = document.querySelector('#skills');
  const skillBars = document.querySelectorAll('.skill-fill');

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Set widths to target percentage data attributes
        skillBars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-width');
          bar.style.width = targetWidth;
        });
        // Disconnect observer once skill gauges are activated
        skillsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2 // Trigger when 20% of section is visible
  });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  /* ==========================================================================
     8. VERTICAL TIMELINE HEIGHT CONTROLLER
     Calculates vertical track line height dynamically relative to viewport
     progress inside the education container, activating nodes when crossed.
     ========================================================================== */
  const educationContainer = document.querySelector('.education-container');
  const timelineFill = document.querySelector('.timeline-fill');
  const timelineItems = document.querySelectorAll('.timeline-item');

  function updateTimelineProgress() {
    if (!educationContainer || !timelineFill) return;

    const rect = educationContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate how far down the timeline container has scrolled into view
    const containerTop = rect.top;
    const containerHeight = rect.height;

    // Track scroll position inside container bounds
    let scrollProgress = 0;

    // If top of education section has entered mid-screen
    if (containerTop < windowHeight / 1.5) {
      const scrollYInContainer = (windowHeight / 1.5) - containerTop;
      scrollProgress = Math.min(100, Math.max(0, (scrollYInContainer / containerHeight) * 100));
    }

    // Set height of blue glowing timeline fill track
    timelineFill.style.height = `${scrollProgress}%`;

    // Active timeline node bubbles sequentially as they are crossed
    timelineItems.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      if (itemRect.top < windowHeight / 1.5) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     9. SCROLL ACTIVE LINK HIGH-LIGHTER
     VIVA TIP: Correlates scroll offsets against section top coordinate boundaries.
     Sets .active class on the matching navbar link for polished visual flow.
     ========================================================================== */
  const sections = document.querySelectorAll('section');

  function highlightNavLink() {
    let currentActiveSectionId = '';
    const scrollPos = window.scrollY + 150; // offset for sticky navigation header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentActiveSectionId = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  /* ==========================================================================
     10. SCROLL TO TOP INITIATOR
     Smooth scroll animation to coordinate top boundaries.
     ========================================================================== */
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* ==========================================================================
     11. CONTACT FORM DYNAMIC VALIDATOR & MOCK TRANSFERS
     VIVA TIP: Event capture. We intercept standard form submit behaviors to
     emulate cloud transmissions with loading cues and feedback alerts.
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Stop standard page reloads

      // Gather input data
      const nameInput = document.getElementById('formName').value.trim();
      const emailInput = document.getElementById('formEmail').value.trim();
      const messageInput = document.getElementById('formMessage').value.trim();

      // Basic front-end verification
      if (!nameInput || !emailInput || !messageInput) {
        showFormFeedback('Please fill out all fields.', 'error');
        return;
      }

      // Enter sending mock states
      const originalBtnText = formSubmitBtn.innerHTML;
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="animation: spin 0.8s linear infinite; margin-right: 8px;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor"></path>
        </svg> Sending...`;

      // Simulate a network dispatch latency of 1.8 seconds
      setTimeout(() => {
        // Restore buttons
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalBtnText;

        // Reset inputs
        contactForm.reset();

        // Output gorgeous custom floating success alert card
        showFormFeedback('Message sent successfully! Thank you for connecting.', 'success');
      }, 1800);
    });
  }

  // Floating user alert feedback element
  function showFormFeedback(message, type) {
    // Check if an alert is already active
    const oldAlert = document.querySelector('.feedback-alert');
    if (oldAlert) oldAlert.remove();

    // Create container
    const alertDiv = document.createElement('div');
    alertDiv.className = `feedback-alert ${type}`;

    // Add icon based on success or error
    const icon = type === 'success'
      ? `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
      : `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;

    alertDiv.innerHTML = `${icon} <span>${message}</span>`;

    // Style floating alert container dynamically
    Object.assign(alertDiv.style, {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translate(-50%, 50px)',
      background: type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
      color: '#ffffff',
      padding: '14px 28px',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '0.95rem',
      fontWeight: '600',
      zIndex: '9999',
      opacity: '0',
      transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease'
    });

    document.body.appendChild(alertDiv);

    // Trigger reveal transition
    setTimeout(() => {
      alertDiv.style.opacity = '1';
      alertDiv.style.transform = 'translate(-50%, 0)';
    }, 50);

    // Dismiss automatically after 4 seconds
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      alertDiv.style.transform = 'translate(-50%, 50px)';
      setTimeout(() => alertDiv.remove(), 400);
    }, 4000);
  }
});