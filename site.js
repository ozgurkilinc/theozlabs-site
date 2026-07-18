document.documentElement.classList.add('js');

const TIE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="TheOzLabs orange tie"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff9a3d"/><stop offset="1" stop-color="#ff5f2e"/></linearGradient></defs><path fill="url(#g)" d="M23 8h18l5 10-9 9 10 25-15 8-15-8 10-25-9-9 5-10Z"/><path fill="#ffb15f" d="m23 8 9 8 9-8-4 13H27L23 8Z"/></svg>`;
const TIE_ICON = `data:image/svg+xml,${encodeURIComponent(TIE_SVG)}`;

const APP_INFO = {
  'serialflow.html': { key: 'serialflow', name: 'SerialFlow' },
  'postertile.html': { key: 'postertile', name: 'PosterTile' },
  'bookletflow.html': { key: 'bookletflow', name: 'BookletFlow' },
  'sheetnest.html': { key: 'sheetnest', name: 'SheetNest' }
};

const ASSET_SCRIPTS = [
  'assets/serialflow.js',
  'assets/postertile-icon.js',
  'assets/bookletflow-icon.js',
  'assets/sheetnest-icon.js'
];

const customStyle = document.createElement('style');
customStyle.textContent = `
.brand-mark{display:grid!important;place-items:center!important;width:40px!important;height:40px!important;border-radius:13px!important;background:#fff!important;box-shadow:0 10px 25px rgba(255,111,48,.20)!important;overflow:hidden!important}
.brand-mark img{width:28px;height:28px;display:block}
.app-card{padding-right:108px!important}
.app-card .app-icon{position:absolute;right:24px;top:24px;width:70px;height:70px;border-radius:18px;object-fit:contain;background:#fff;padding:5px;box-shadow:0 12px 26px rgba(30,20,70,.16);z-index:2}
.badge.canva-users{background:#eeeaff;color:#563dda;border:1px solid rgba(112,85,255,.22)}
.product-glyph{width:190px!important;height:190px!important;padding:8px!important;background:#fff!important;box-shadow:0 20px 42px rgba(30,20,70,.14)!important;border-radius:42px!important;overflow:hidden!important}
.product-glyph .product-icon{width:100%;height:100%;object-fit:contain;display:block;border-radius:32px}
.status-app{display:flex;align-items:center;gap:15px;min-width:0}
.status-icon{width:52px;height:52px;border-radius:14px;object-fit:contain;background:#fff;padding:4px;box-shadow:0 8px 20px rgba(30,20,70,.12);flex:0 0 auto}
.status-state.canva-users{background:#eeeaff!important;color:#563dda!important;border:1px solid rgba(112,85,255,.22)}
@media(max-width:700px){.app-card{padding-right:84px!important}.app-card .app-icon{width:56px;height:56px;right:18px;top:18px;border-radius:15px}.product-glyph{width:155px!important;height:155px!important}.status-icon{width:44px;height:44px}}
@media(prefers-color-scheme:dark){.brand-mark{background:#211b31!important}.badge.canva-users,.status-state.canva-users{background:#2b2447!important;color:#c8bcff!important;border-color:#51457d!important}.app-card .app-icon,.product-glyph,.status-icon{background:#fff!important}}
`;
document.head.appendChild(customStyle);

function applyBrand() {
  document.querySelectorAll('.brand-mark').forEach((mark) => {
    mark.textContent = '';
    const img = document.createElement('img');
    img.src = TIE_ICON;
    img.alt = '';
    mark.appendChild(img);
  });
  let favicon = document.querySelector('link[rel~="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.href = TIE_ICON;
}
applyBrand();

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

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });
}

function canvaBadge(badge) {
  if (!badge) return;
  badge.textContent = 'For Canva users';
  badge.classList.remove('success', 'review');
  badge.classList.add('canva-users');
}

function appImage(key, className, alt) {
  const src = window.THEOZ_ASSETS && window.THEOZ_ASSETS[key];
  if (!src) return null;
  const img = document.createElement('img');
  img.src = src;
  img.className = className;
  img.alt = alt;
  img.decoding = 'async';
  return img;
}

function hydrateApps() {
  document.querySelectorAll('.app-card[href]').forEach((card) => {
    const href = (card.getAttribute('href') || '').split('/').pop();
    const app = APP_INFO[href];
    if (!app) return;
    const oldIcon = card.querySelector('.app-icon');
    if (oldIcon) oldIcon.remove();
    const image = appImage(app.key, 'app-icon', `${app.name} icon`);
    if (image) card.prepend(image);
    canvaBadge(card.querySelector('.badge'));
  });

  const product = APP_INFO[current];
  if (product) {
    const glyph = document.querySelector('.product-glyph');
    if (glyph) {
      const image = appImage(product.key, 'product-icon', `${product.name} icon`);
      if (image) {
        glyph.textContent = '';
        glyph.appendChild(image);
      }
    }
    document.querySelectorAll('.product-hero .badge').forEach(canvaBadge);
  }

  const statusList = document.querySelector('.status-list');
  if (statusList) {
    const rows = [
      ['Public website','Company, app, support, privacy, and terms pages','GitHub Pages','Operational',''],
      ['Support email','Questions and issue reports','hello.theozlabs@gmail.com','Operational',''],
      ['SerialFlow','Variable-data production and synchronized serial fields','Canva workflow','For Canva users','serialflow'],
      ['PosterTile','Large-format tiling, page order, and assembly guidance','Canva workflow','For Canva users','postertile'],
      ['BookletFlow','Booklet imposition, folding order, and page preparation','Canva workflow','For Canva users','bookletflow'],
      ['SheetNest','Efficient print-sheet packing by size, quantity, and spacing','Canva workflow','For Canva users','sheetnest']
    ];
    statusList.innerHTML = '';
    rows.forEach(([name, description, detail, state, key]) => {
      const row = document.createElement('div');
      row.className = 'status-row reveal is-visible';
      const left = document.createElement('div');
      if (key) {
        left.className = 'status-app';
        const image = appImage(key, 'status-icon', `${name} icon`);
        if (image) left.appendChild(image);
      }
      const text = document.createElement('div');
      text.innerHTML = `<strong>${name}</strong><p>${description}</p>`;
      left.appendChild(text);
      const middle = document.createElement('span');
      middle.textContent = detail;
      const right = document.createElement('span');
      right.className = `status-state${state === 'For Canva users' ? ' canva-users' : ''}`;
      right.textContent = state;
      row.append(left, middle, right);
      statusList.appendChild(row);
    });
    const statusTitle = document.querySelector('.hero.compact h1');
    const statusLead = document.querySelector('.hero.compact .lead');
    if (statusTitle) statusTitle.textContent = 'Services online. Built for Canva users.';
    if (statusLead) statusLead.textContent = 'Current availability for TheOzLabs public pages, Canva workflows, and support services.';
  }
}

Promise.all(ASSET_SCRIPTS.map(loadScript)).then(hydrateApps);

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
