// Dunsmore Services — site interactions

// Mobile nav toggle
const nav = document.querySelector('.nav');
const toggle = document.getElementById('nav-toggle');

if (nav && toggle) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  // Close the menu after choosing a link
  nav.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll reveals (skipped when the visitor prefers reduced motion)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealed = document.querySelectorAll('.reveal');

if (prefersReduced || !('IntersectionObserver' in window)) {
  revealed.forEach((el) => el.classList.add('in'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealed.forEach((el) => observer.observe(el));
}

// Estimate form: compose an email in the visitor's mail app
const form = document.getElementById('estimate-form');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const message = form.elements.message.value.trim();

    if (!name || !phone || !message) {
      form.reportValidity();
      return;
    }

    const subject = `Estimate request from ${name}`;
    const body = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      '',
      'What needs doing:',
      message,
    ].join('\n');

    window.location.href =
      'mailto:dunsmoreservicesllc@gmail.com' +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  });
}

// Photo lightbox
const lightbox = document.getElementById('lightbox');

if (lightbox) {
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  const shots = Array.from(document.querySelectorAll('img[data-full]'));
  let current = -1;
  let lastFocus = null;

  const show = (i) => {
    current = (i + shots.length) % shots.length;
    const shot = shots[current];
    lbImg.src = shot.dataset.full;
    lbImg.alt = shot.alt;
    lbCap.textContent = shot.alt;
  };

  const open = (i) => {
    lastFocus = document.activeElement;
    show(i);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lb-close').focus();
  };

  const close = () => {
    lightbox.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  shots.forEach((img, i) => {
    img.addEventListener('click', () => open(i));
  });

  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', () => show(current - 1));
  document.getElementById('lb-next').addEventListener('click', () => show(current + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}

// Footer year
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
