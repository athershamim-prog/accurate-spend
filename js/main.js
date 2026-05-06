/* ===========================
   Accurate Spend — main.js
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky nav ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ── Mobile menu toggle ── */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const icon = menuBtn.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    });
  }

  /* ── Solutions dropdown ── */
  const dropdownTrigger = document.getElementById('solutions-trigger');
  const dropdownMenu    = document.getElementById('solutions-dropdown');
  if (dropdownTrigger && dropdownMenu) {
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('open');
    });
    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('open');
    });
    dropdownMenu.addEventListener('click', e => e.stopPropagation());
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (mobileMenu) mobileMenu.classList.remove('open');
      }
    });
  });

  /* ── Contact form submission ── */
  const demoForm = document.getElementById('demo-form');
  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = demoForm.querySelector('button[type="submit"]');
      btn.textContent = 'Request Sent!';
      btn.disabled = true;
      btn.style.background = '#007f71';
      demoForm.reset();
      const msg = document.getElementById('form-success');
      if (msg) msg.classList.remove('hidden');
    });
  }

  /* ── Animate stats counter ── */
  const animateValue = (el, start, end, suffix, duration) => {
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + (end - start) * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const end    = parseInt(el.dataset.end);
        const suffix = el.dataset.suffix || '';
        animateValue(el, 0, end, suffix, 1200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));

  /* ── Highlight active page in nav ── */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === path) link.classList.add('active');
  });

});
