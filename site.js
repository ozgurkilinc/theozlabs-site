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
  'assets/postertile-1.js','assets/postertile-2.js','assets/postertile-3.js',
  'assets/postertile-4.js','assets/postertile-5.js','assets/postertile-6.js',
  'assets/bookletflow.js',
  'assets/sheetnest-1.js','assets/sheetnest-2.js','assets/sheetnest-3.js'
];

const customStyle = document.createElement('style');
customStyle.textContent = `
.brand-mark{display:grid!important;place-items:center!important;width:40px!important;height:40px!important;border-radius:13px!important;background:#fff!important;box-shadow:0 10px 25px rgba(255,111,48,.20)!important;overflow:hidden!important}
.brand-mark img{width:28px;height:28px;display:block}
.app-card{padding-right:105px!important}
.app-card .app-icon{position:absolute;right:24px;top:24px;width:66px;height:66px;border-radius:18px;object-fit:cover;box-shadow:0 12px 26px rgba(30,20,70,.16);z-index:2}
.badge.review{background:#fff1e7;color:#b94b16;border:1px solid rgba(255,111,48,.22)}
.product-glyph{width:180px!important;height:180px!important;padding:0!important;background:transparent!important;box-shadow:none!important;border-radius:42px!important;overflow:hidden!important}
.product-glyph .product-icon{width:100%;height:100%;object-fit:cover;display:block}
.status-app{display:flex;align-items:center;gap:15px;min-width:0}
.status-icon{width:48px;height:48px;border-radius:13px;object-fit:cover;box-shadow:0 8px 20px rgba(30,20,70,.12);flex:0 0 auto}
.status-state.review{background:#fff1e7!important;color:#b94b16!important;border:1px solid rgba(255,111,48,.22)}
@media(max-width:700px){.app-card{padding-right:82px!important}.app-card .app-icon{width:52px;height:52px;right:18px;top:18px;border-radius:14px}.product-glyph{width:150px!important;height:150px!important}.status-icon{width:42px;height:42px}}
@media(prefers-color-scheme:dark){.brand-mark{background:#211b31!important}.badge.review,.status-state.review{background:#3b241c!important;color:#ffb17b!important;border-color:#6b3825!important}}
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
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function reviewBadge(badge) {
  if (!badge) return;
  badge.textContent = 'In Canva review';
  badge.classList.remove('success');
  badge.classList.add('review');
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
    if (!card.querySelector('.app-icon')) {
      const image = appImage(app.key, 'app-icon', `${app.name} icon`);
      if (image) card.prepend(image);
    }
    reviewBadge(card.querySelector('.badge'));
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
    document.querySelectorAll('.product-hero .badge').forEach(reviewBadge);
  }

  const statusList = document.querySelector('.status-list');
  if (statusList) {
    const rows = [
      ['Public website','Company, app, support, privacy, and terms pages','GitHub Pages','Operational',''],
      ['Support email','Questions and issue reports','hello.theozlabs@gmail.com','Operational',''],
      ['SerialFlow','Variable-data production and synchronized serial fields','Canva marketplace review','In review','serialflow'],
      ['PosterTile','Large-format tiling, page order, and assembly guidance','Canva marketplace review','In review','postertile'],
      ['BookletFlow','Booklet imposition, folding order, and page preparation','Canva marketplace review','In review','bookletflow'],
      ['SheetNest','Efficient print-sheet packing by size, quantity, and spacing','Canva marketplace review','In review','sheetnest']
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
      right.className = `status-state${state === 'In review' ? ' review' : ''}`;
      right.textContent = state;
      row.append(left, middle, right);
      statusList.appendChild(row);
    });
    const statusTitle = document.querySelector('.hero.compact h1');
    const statusLead = document.querySelector('.hero.compact .lead');
    if (statusTitle) statusTitle.textContent = 'Services online. Apps in Canva review.';
    if (statusLead) statusLead.textContent = 'Current availability for TheOzLabs public pages, application reviews, and support services.';
  }
}

(async () => {
  try {
    for (const src of ASSET_SCRIPTS) await loadScript(src);
    hydrateApps();
  } catch (error) {
    console.error('TheOzLabs asset loading failed', error);
    document.querySelectorAll('.badge').forEach(reviewBadge);
  }
})();

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
