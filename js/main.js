/**
 * Virasat Suites & Banquets - BY K.N. GROUP
 * Vanilla JavaScript strictly limited to:
 * 1. Sticky header scroll effect
 * 2. Mobile navigation toggle / close on link click
 * 3. High-Performance IntersectionObserver for CSS entrance/reveal animations
 * 4. Active nav state sync
 * 5. Contact form submission feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Effect
  const header = document.querySelector('.virasat-header');
  if (header) {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 40) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Navigation: auto-close menu when link clicked
  const navCollapse = document.getElementById('virasatNav');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  if (navCollapse && window.bootstrap) {
    const bsCollapse = new bootstrap.Collapse(navCollapse, { toggle: false });
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navCollapse.classList.contains('show')) {
          bsCollapse.hide();
        }
      });
    });
  }

  // 3. High-Performance IntersectionObserver for CSS Fade-In & Reveal Animations
  // Respects prefers-reduced-motion media query
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealSelectors = '.reveal, .reveal-up, .reveal-fade, .reveal-left, .reveal-right, .reveal-scale, [data-reveal]';
  const revealElements = document.querySelectorAll(revealSelectors);

  if (!prefersReducedMotion && 'IntersectionObserver' in window && revealElements.length > 0) {
    // Observer options optimized for smooth entrance without triggering too late
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12,
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;

          // Apply natural staggered cascade for multi-card grid rows
          const parentRow = target.closest('.row');
          if (parentRow && !target.style.transitionDelay && !target.className.includes('reveal-delay')) {
            const siblings = Array.from(parentRow.querySelectorAll(revealSelectors));
            const index = siblings.indexOf(target);
            if (index > 0) {
              const delay = Math.min(index * 100, 400); // capped at 400ms for responsiveness
              target.style.transitionDelay = `${delay}ms`;
            }
          }

          // Trigger CSS hardware-accelerated transition
          target.classList.add('is-visible');

          // Once animation completes, clean up will-change to release GPU layer memory
          const onTransitionEnd = () => {
            target.classList.add('animation-done');
            target.removeEventListener('transitionend', onTransitionEnd);
          };
          target.addEventListener('transitionend', onTransitionEnd, { once: true });

          // Unobserve immediately: zero continuous performance impact
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Graceful fallback: immediately display content if observer is unsupported or motion reduced
    revealElements.forEach((el) => {
      el.classList.add('is-visible');
      el.classList.add('animation-done');
    });
  }

  // 4. Highlight Active Navigation Item Based on Current Page
  const currentPath = window.location.pathname;
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      const pageName = href.replace('./', '').replace('/', '');
      const pathName = currentPath.split('/').pop();
      if ((pathName === '' || pathName === 'index.html') && (pageName === 'index.html' || pageName === '')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else if (pathName && pathName === pageName) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    }
  });

  // 5. Contact Form submission handler (frontend UX feedback)
  const contactForm = document.getElementById('enquiryForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }

      // Display luxury success state
      if (formSuccessAlert) {
        formSuccessAlert.classList.remove('d-none');
        formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      contactForm.reset();
      contactForm.classList.remove('was-validated');
    });
  }
});
