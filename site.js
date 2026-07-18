document.documentElement.classList.add('js');

const menuButton = document.querySelector('[data-menu-button]');
const navLinks = document.querySelector('[data-nav-links]');
if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
}

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === current || (current === 'index.html' && href === 'index.html')) {
    link.setAttribute('aria-current', 'page');
  }
});

const reveal = (entry) => entry.target.classList.add('is-visible');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        reveal(entry);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
} else {
  document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'));
}

const pages = ['apps.html','serialflow.html','postertile.html','bookletflow.html','sheetnest.html','status.html','support.html','privacy.html','terms.html'];
const idle = window.requestIdleCallback || ((callback) => setTimeout(callback, 400));
idle(() => {
  pages.filter((page) => page !== current).forEach((page) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = page;
    document.head.appendChild(link);
  });
});
