/*
  FRAGRY GLOBAL JS
  Vanilla JS, zero dependencies
*/

document.addEventListener('DOMContentLoaded', () => {
  // Add loaded class to hero for background animation
  const hero = document.querySelector('.hero');
  if (hero) {
    // Slight delay to ensure paint
    setTimeout(() => {
      hero.classList.add('is-loaded');
    }, 100);

    // Parallax effect for hero background
    const heroBgMedia = document.querySelector('.hero__bg img, .hero__bg video');
    if (heroBgMedia) {
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            if (scrolled <= hero.offsetHeight) {
              heroBgMedia.style.transform = `translateY(calc(-10% + ${scrolled * 0.4}px))`;
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }

  // Scroll interactions (fade up elements)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Back to top button
  const backToTopBtn = document.getElementById('km-back-to-top');
  if (backToTopBtn) {
    let tickingBtt = false;
    window.addEventListener('scroll', () => {
      if (!tickingBtt) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 300) {
            backToTopBtn.classList.add('is-visible');
          } else {
            backToTopBtn.classList.remove('is-visible');
          }
          tickingBtt = false;
        });
        tickingBtt = true;
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
