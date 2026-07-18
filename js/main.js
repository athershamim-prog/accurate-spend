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
      if (servicesDrop) servicesDrop.classList.remove('open');
    });
    document.addEventListener('click', () => {
      dropdownMenu.classList.remove('open');
    });
    dropdownMenu.addEventListener('click', e => e.stopPropagation());
  }

  /* ── Services dropdown ── */
  const servicesTrigger = document.getElementById('services-trigger');
  const servicesDrop    = document.getElementById('services-dropdown');
  if (servicesTrigger && servicesDrop) {
    servicesTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      servicesDrop.classList.toggle('open');
      if (dropdownMenu) dropdownMenu.classList.remove('open');
    });
    document.addEventListener('click', () => {
      servicesDrop.classList.remove('open');
    });
    servicesDrop.addEventListener('click', e => e.stopPropagation());
  }

  /* ── Mobile nav accordions (Solutions / Services) ── */
  document.querySelectorAll('.mobile-nav-toggle').forEach(btn => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    btn.addEventListener('click', () => {
      const isOpen = target.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
    });
  });

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
    demoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = demoForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

      const data = {};
      new FormData(demoForm).forEach((value, key) => { data[key] = value; });

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Server error');

        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Request Sent!';
        btn.style.background = '#007f71';
        demoForm.reset();
        const msg = document.getElementById('form-success');
        if (msg) msg.classList.remove('hidden');
        msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        const errEl = document.getElementById('form-error');
        if (errEl) errEl.classList.remove('hidden');
      }
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

  /* ── Scroll reveal (Challenge + Background sections) ── */
  const reveals = document.querySelectorAll('.reveal, .sr, .sr-group');
  if (reveals.length) {
    if ('IntersectionObserver' in window) {
      const revealIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
        });
      }, { threshold: 0.15 });
      reveals.forEach(el => revealIO.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('in'));
    }
  }

  /* ── Challenge: spotlight the centered issue, dim upcoming, fill the rail ── */
  const issues = [...document.querySelectorAll('.issue')];
  if (issues.length) {
    const cCounter  = document.getElementById('challenge-counter');
    const cRailFill = document.getElementById('challenge-rail-fill');
    const cRail     = document.querySelector('.rail');
    const onChallengeScroll = () => {
      const mid = window.innerHeight * 0.5;
      let activeIdx = -1;
      issues.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top < mid && r.bottom > 120) activeIdx = i;
      });
      issues.forEach((el, i) => {
        el.classList.toggle('active', i === activeIdx);
        el.classList.toggle('dim', i > activeIdx);
      });
      if (cCounter) cCounter.textContent = Math.max(0, activeIdx + 1);
      if (cRailFill && cRail) {
        if (activeIdx >= 0) {
          const rr = cRail.getBoundingClientRect();
          const ar = issues[activeIdx].getBoundingClientRect();
          cRailFill.style.height = Math.max(0, ar.bottom - rr.top) + 'px';
        } else {
          cRailFill.style.height = '0px';
        }
      }
    };
    window.addEventListener('scroll', onChallengeScroll, { passive: true });
    window.addEventListener('resize', onChallengeScroll);
    onChallengeScroll();
  }

});
