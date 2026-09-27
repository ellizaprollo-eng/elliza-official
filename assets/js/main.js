const navWrap = document.getElementById('navWrap');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = `${maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0}%`;
  navWrap.classList.toggle('scrolled', scrollTop > 20);
  backToTop.classList.toggle('show', scrollTop > 600);
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
  menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.textContent = '☰';
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Active navigation section
const sections = [...document.querySelectorAll('main section[id]')];
const navAnchors = [...navLinks.querySelectorAll('a[href^="#"]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

// Featured work library: 24 items in each category, displayed in four columns
const projectCatalog = {
  graphics: { label: 'Graphics', subtitle: 'Brand and campaign graphic', names: ['Bold Launch', 'Editorial Grid', 'Wellness Story', 'Property Insight', 'Modern Promo', 'Brand Moment'] },
  reels: { label: 'Reels', subtitle: 'Short-form vertical video', names: ['Hook & Hold', 'Motion Story', 'Quick Cut', 'Social Pulse', 'Vertical Story', 'Reel Series'] },
  websites: { label: 'Websites', subtitle: 'Website design and development', names: ['Aster Studio', 'North & Co.', 'Lumina Health', 'Vault Digital', 'Maison Edit', 'Vista Works'] },
  funnels: { label: 'Funnels', subtitle: 'Lead-generation funnel system', names: ['Lead Flow', 'Launch Path', 'Book More', 'Offer Engine', 'Client Journey', 'Conversion Suite'] },
  automation: { label: 'Automation', subtitle: 'CRM and workflow automation', names: ['Smart Pipeline', 'Follow-Up Flow', 'Booking Engine', 'Lead Router', 'Client Onboard', 'Growth System'] },
};

/* ============================================================
   EDIT ONLY THE INDIVIDUAL IMAGE / VIDEO LINKS BELOW
   ------------------------------------------------------------
   Each numbered line controls ONE portfolio card only.

   Example:
   graphicsImages[0]  = Graphic item 01
   graphicsImages[23] = Graphic item 24

   For Reels:
   reelVideoLinks[0] = video file for Reel 01

   The reel card automatically uses the video's first moment
   (about 0.1 second) as its thumbnail. No separate thumbnail link
   is needed. Videos do not autoplay in the grid.

   Image links: direct JPG, JPEG, PNG, WEBP, GIF, or CDN URL.
   For sharp Website/Funnel previews, use screenshots at least
   1920px wide. The card and popup preserve the image aspect ratio
   and never stretch it beyond the available frame width.
   Video links: direct MP4 or WebM URL.
============================================================ */

const graphicsImages = [
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e682eab262a1cfc65aed5.png', // Graphics 01
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68381a0f048050a0d9e6.png', // Graphics 02
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68409c9b37b5fd15a508.png', // Graphics 03
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e6840ecb87d54c1a55cff.png', // Graphics 04
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68401a0f048050a0dad8.png', // Graphics 05
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68401097b81195633285.png', // Graphics 06
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e684d557cc144315a79d5.png', // Graphics 07
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e684f1a0f048050a0dbf0.png', // Graphics 08
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68509c9b37b5fd15ebdf.png', // Graphics 09
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e6859baf5f6da40906162.png', // Graphics 10
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68581097b811956347aa.png', // Graphics 11
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68619c9b37b5fd1608f0.png', // Graphics 12
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68cb1a0f048050a14a8e.png', // Graphics 13
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68cb1a0f048050a14a94.png', // Graphics 14
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68cbbc0b1f5d2ee38bb1.png', // Graphics 15
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68cbbc0b1f5d2ee38bb7.png', // Graphics 16
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68ce1097b81195639f81.png', // Graphics 17
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68cfbaf5f6da409086ee.png', // Graphics 18
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68d0300bfb1db844a6ad.png', // Graphics 19
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68d81a0f048050a14b8e.png', // Graphics 20
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68d8baf5f6da4090a3fc.png', // Graphics 21
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68d3baf5f6da40909829.png', // Graphics 22
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68d4bc0b1f5d2ee38c81.png', // Graphics 23
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e68cf1a0f048050a14ae4.png' // Graphics 24
];

// WEBSITE LINKS: each numbered line controls one column/card.
// Use a full-page screenshot that is 1920px wide or larger for best clarity.
const websiteImages = [
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fb957944acd32bd93e34d.png', // Websites 01 
  
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc364e4e420b6ec3e332c.png', // Websites 02
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc364944acd32bd9a1d46.png', // Websites 03
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc3648d48b5a586ae9908.png', // Websites 04
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc36430b285321cab95c1.png', // Websites 05
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc364e4e420b6ec3e3331.png', // Websites 06
     ];

// FUNNEL LINKS: each numbered line controls one column/card.
// Use a full-page screenshot that is 1920px wide or larger for best clarity.
const funnelImages = [
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc38528b4c07e40607826.png', // Funnels 01
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc385f8478ee0ed9dce93.png', // Funnels 02
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc3858d48b5a586ae9b4a.png', // Funnels 03
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc38528b4c07e4060782c.png', // Funnels 04
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc38530b285321cabb5d0.png', // Funnels 05
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc38852b008d561ad0927.png', // Funnels 06
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc388dd8ffd1870f541ea.png', // Funnels 07
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5fc38530b285321cabb5c2.png', // Funnels 08
];

// LIVE WEBSITE LINKS: replace each # with the actual live website URL.
// The line number matches the Website preview image above.
const websiteLiveLinks = [
  'https://goshenqualitycare.com/', // Website 01 live URL
  'https://framesuite.com/', // Website 02 live URL
  'https://waterleafnaturopathic.com/', // Website 03 live URL
  'https://ffbenterprises.com/', // Website 04 live URL
  'https://www.cloud9ridesbooking.com/', // Website 05 live URL
  'https://kimberleypoolcare.com.au/', // Website 06 live URL
];

// LIVE FUNNEL LINKS: replace each # with the actual live funnel URL.
// The line number matches the Funnel preview image above.
const funnelLiveLinks = [
  'https://sites.leadconnectorhq.com/preview/RhbZu6L6XTvwRte3kgcC', // Funnel 01 live URL
  'https://sites.leadconnectorhq.com/preview/hqDxIGPYci9yVCplQyqL?notrack=true', // Funnel 02 live URL
  'https://ffbenterprises.com/vsl', // Funnel 03 live URL
  'https://lendbox.impruvu.io/vsl', // Funnel 04 live URL
  'https://creditsnipers.com/vsl-page', // Funnel 05 live URL
  'https://validate.inventionpartners.com/home', // Funnel 06 live URL
  'https://airvato.com/airvato', // Funnel 07 live URL
  'https://sites.leadconnectorhq.com/preview/JdI2vNRIiEtSq37JsfaE#survey-UUEsCC03_z', // Funnel 08 live URL
    ];

const automationImages = [
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a63aa3472d046cc1421a999.png', // Automation 01
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a63aa33faf3b5c12c736e11.png', // Automation 02
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a63aa34cf9f8312dcd268d1.png', // Automation 03
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a63aa31da6468156995ffaf.png', // Automation 04
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a63aa33847bbd8a6400b152.png', // Automation 05
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a63aa329eb8e1b1ccf2686e.png', // Automation 06
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a63aa32d3104247ab526d70.png', // Automation 07
  '', // Automation 08
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a63aa3272d046cc1421a520.png', // Automation 09
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a63aa3272d046cc1421a52d.png', // Automation 10
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a63aa31faf3b5c12c736cf6.png', // Automation 11
 
];

const reelVideoLinks = [
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e7843bc0b1f5d2ee9f97d.mp4', // Reel video 01
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e784bab262a1cfc6efdc3.mp4', // Reel video 02
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e784b9c9b37b5fd1dcecb.mp4', // Reel video 03
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e78449c9b37b5fd1dc617.mp4', // Reel video 04
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e78731097b811956d2b9c.mp4', // Reel video 05
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e7852a60fa529fd4d3be2.mp4', // Reel video 06
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e788f557cc1443164a26c.mp4', // Reel video 07
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e7843557cc1443164833d.mp4', // Reel video 08
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e7acbecb87d54c1b0017e.mp4', // Reel video 09
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e7acb300bfb1db84f3804.mp4', // Reel video 10
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e7acb1a0f048050a9c015.mp4', // Reel video 11
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e78a6bc0b1f5d2eea1a06.mp4', // Reel video 12
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e7853557cc144316484a6.mp4', // Reel video 13
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e784c9c9b37b5fd1dced4.mp4', // Reel video 14
  'https://assets.cdn.filesafe.space/FoDdVxsegLCZtxtLaGhl/media/6a5e784bab262a1cfc6efdc9.mp4' // Reel video 15
];

const editablePortfolioLinks = {
  graphics: graphicsImages,
  websites: websiteImages,
  funnels: funnelImages,
  automation: automationImages,
  reels: reelVideoLinks
};

const projectsGrid = document.getElementById('projectsGrid');
const projectItems = [];
Object.entries(projectCatalog).forEach(([category, info]) => {
  const sources = editablePortfolioLinks[category] || [];
  const itemCount = category === 'reels' ? sources.filter(Boolean).length : 24;

  for (let index = 0; index < itemCount; index++) {
    const source = sources[index];

    // Never create an empty portfolio card when its media link is missing.
    if (!source) continue;

    const title = `${info.names[index % info.names.length]} ${String(index + 1).padStart(2, '0')}`;
    const isReel = category === 'reels';
    projectItems.push({
      category,
      title,
      subtitle: info.subtitle,
      image: isReel ? '' : source,
      fullImage: isReel ? '' : source, // Replace separately here later if needed
      video: isReel ? source : '',
      liveUrl: category === 'websites'
        ? (websiteLiveLinks[index] || '#')
        : category === 'funnels'
          ? (funnelLiveLinks[index] || '#')
          : ''
    });
  }
});

projectsGrid.innerHTML = projectItems.map(item => `
  <article class="project-card reveal${item.category !== 'graphics' ? ' is-hidden' : ''}" data-category="${item.category}" data-video="${item.video}" data-image="${item.image}" data-full-image="${item.fullImage || item.image}" data-live-url="${item.liveUrl || ''}" ${item.category !== 'graphics' ? 'style="display:none"' : ''}>
    <a href="${item.liveUrl || '#'}" ${(item.category === 'websites' || item.category === 'funnels') ? 'target="_blank" rel="noopener noreferrer"' : ''} aria-label="${(item.category === 'websites' || item.category === 'funnels') ? `Visit ${item.title}` : `Open ${item.title} project preview`}">
      <div class="project-image">
        ${item.category === 'reels'
          ? `<video muted playsinline preload="metadata" aria-label="Reel preview"><source src="${item.video}" type="video/mp4"></video><span class="reel-play-badge" aria-hidden="true">▶</span>`
          : `<img class="${item.category === 'websites' || item.category === 'funnels' ? 'website-scroll-image' : ''}" src="${item.image}" alt="Portfolio work" loading="lazy" decoding="async" draggable="false">`
        }
      </div>
    </a>
  </article>
`).join('');

// Animated project filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project-card');

const loadMoreButton = document.getElementById('loadMoreProjects');
const INITIAL_VISIBLE_PROJECTS = 8;
const expandedCategories = new Set();

function updateCategoryVisibility(category) {
  const categoryCards = [...projects].filter(card => card.dataset.category === category);
  const supportsLoadMore = category === 'graphics' || category === 'reels';
  const expanded = expandedCategories.has(category);
  categoryCards.forEach((card, index) => {
    card.classList.toggle('is-load-more-hidden', supportsLoadMore && !expanded && index >= INITIAL_VISIBLE_PROJECTS);
  });
  loadMoreButton.hidden = !supportsLoadMore || expanded || categoryCards.length <= INITIAL_VISIBLE_PROJECTS;
  loadMoreButton.dataset.category = category;
}

updateCategoryVisibility('graphics');
loadMoreButton.addEventListener('click', () => {
  const category = loadMoreButton.dataset.category;
  expandedCategories.add(category);
  updateCategoryVisibility(category);
  refreshWebsitePreviews();
});


// Measure each full-page screenshot and scroll it smoothly inside its fixed card frame.
const websitePreviewCards = [...document.querySelectorAll(
  '.project-card[data-category="websites"], .project-card[data-category="funnels"]'
)];

function updateWebsitePreview(card) {
  const frame = card.querySelector('.project-image');
  const image = card.querySelector('.website-scroll-image');
  if (!frame || !image || !frame.clientWidth || !image.naturalWidth || !image.naturalHeight) return;

  const renderedHeight = frame.clientWidth * (image.naturalHeight / image.naturalWidth);
  const distance = Math.max(0, Math.round(renderedHeight - frame.clientHeight));
  const duration = Math.min(16, Math.max(6, distance / 115));

  card.style.setProperty('--website-scroll-distance', distance);
  card.style.setProperty('--website-scroll-duration', `${duration.toFixed(2)}s`);
}

function refreshWebsitePreviews() {
  websitePreviewCards.forEach(updateWebsitePreview);
}

websitePreviewCards.forEach(card => {
  const image = card.querySelector('.website-scroll-image');
  if (!image) return;

  if (image.complete) updateWebsitePreview(card);
  image.addEventListener('load', () => updateWebsitePreview(card));

  // Website and funnel cards open their live URLs when tapped or clicked.
});

let websiteResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(websiteResizeTimer);
  websiteResizeTimer = setTimeout(() => {
    refreshWebsitePreviews();
    updateModalWebsitePreview();
  }, 120);
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    updateCategoryVisibility(filter);
    projects.forEach(project => {
      const show = project.dataset.category === filter;
      if (show) {
        project.style.display = '';
        requestAnimationFrame(() => {
          if (!button.classList.contains('active')) return;
          project.classList.remove('is-hidden');
          updateWebsitePreview(project);
        });
      } else {
        project.classList.add('is-hidden');
        const cardVideo = project.querySelector('video');
        if (cardVideo) { cardVideo.pause(); cardVideo.currentTime = 0; }
        setTimeout(() => { if (project.classList.contains('is-hidden')) project.style.display = 'none'; }, 350);
      }
    });
  });
});

// Project gallery modal with previous/next navigation.
const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
let lastFocused = null;
let activeCategory = 'graphics';
let activeCategoryIndex = 0;
const zoomInButton = document.getElementById('zoomIn');
const zoomOutButton = document.getElementById('zoomOut');
const zoomResetButton = document.getElementById('zoomReset');
let automationZoom = 0;
let automationPanX = 0;
let automationPanY = 0;
let automationDragging = false;
let automationDragStartX = 0;
let automationDragStartY = 0;
let automationPanStartX = 0;
let automationPanStartY = 0;

function applyAutomationPan() {
  modal.style.setProperty('--automation-pan-x', `${automationPanX}px`);
  modal.style.setProperty('--automation-pan-y', `${automationPanY}px`);
}

function resetAutomationPan() {
  automationPanX = 0;
  automationPanY = 0;
  applyAutomationPan();
}

function setAutomationZoom(nextZoom) {
  automationZoom = Math.max(0, Math.min(200, Math.round(nextZoom)));
  modal.style.setProperty('--automation-zoom-level', automationZoom);
  zoomResetButton.textContent = `${automationZoom}%`;
  zoomOutButton.disabled = automationZoom === 0;
  zoomInButton.disabled = automationZoom === 200;
  if (automationZoom === 0) resetAutomationPan();
}
zoomInButton.addEventListener('click', event => { event.stopPropagation(); setAutomationZoom(automationZoom + 10); });
zoomOutButton.addEventListener('click', event => { event.stopPropagation(); setAutomationZoom(automationZoom - 10); });
zoomResetButton.addEventListener('click', event => { event.stopPropagation(); setAutomationZoom(0); });
modal.querySelector('.modal-image')?.addEventListener('wheel', event => {
  if (!modal.classList.contains('is-automation')) return;
  event.preventDefault();
  setAutomationZoom(automationZoom + (event.deltaY < 0 ? 5 : -5));
}, { passive: false });
setAutomationZoom(0);

// Click-and-drag hand panning for zoomed automation images.
modalImage.addEventListener('pointerdown', event => {
  if (!modal.classList.contains('is-automation') || automationZoom === 0 || event.button !== 0) return;
  automationDragging = true;
  automationDragStartX = event.clientX;
  automationDragStartY = event.clientY;
  automationPanStartX = automationPanX;
  automationPanStartY = automationPanY;
  modalImage.classList.add('is-dragging');
  modalImage.setPointerCapture(event.pointerId);
  event.preventDefault();
});

modalImage.addEventListener('pointermove', event => {
  if (!automationDragging) return;
  automationPanX = automationPanStartX + (event.clientX - automationDragStartX);
  automationPanY = automationPanStartY + (event.clientY - automationDragStartY);
  applyAutomationPan();
});

function stopAutomationDrag(event) {
  if (!automationDragging) return;
  automationDragging = false;
  modalImage.classList.remove('is-dragging');
  if (event?.pointerId != null && modalImage.hasPointerCapture(event.pointerId)) {
    modalImage.releasePointerCapture(event.pointerId);
  }
}
modalImage.addEventListener('pointerup', stopAutomationDrag);
modalImage.addEventListener('pointercancel', stopAutomationDrag);
modalImage.addEventListener('lostpointercapture', stopAutomationDrag);


// Reel cards remain paused and use the video's natural first frame as the preview.

function categoryItems(category) {
  return projectItems.filter(item => item.category === category);
}

function stopModalVideo() {
  modalVideo.pause();
  modalVideo.removeAttribute('src');
  modalVideo.load();
}

function updateModalWebsitePreview() {
  if (!modal.classList.contains('is-website-preview')) return;
  const frame = modal.querySelector('.modal-image');
  if (!frame || !modalImage.naturalWidth || !modalImage.naturalHeight) return;

  const renderedHeight = frame.clientWidth * (modalImage.naturalHeight / modalImage.naturalWidth);
  const distance = Math.max(0, Math.round(renderedHeight - frame.clientHeight));
  const duration = Math.min(22, Math.max(7, distance / 125));

  modal.style.setProperty('--modal-website-scroll-distance', distance);
  modal.style.setProperty('--modal-website-scroll-duration', `${duration.toFixed(2)}s`);
}

modalImage.addEventListener('load', updateModalWebsitePreview);

// On touch devices, tap the popup screenshot to scroll; tap again to return.
modal.querySelector('.modal-image')?.addEventListener('pointerup', event => {
  if (!modal.classList.contains('is-website-preview')) return;
  if (!window.matchMedia('(pointer: coarse)').matches) return;
  event.preventDefault();
  event.stopPropagation();
  modal.classList.toggle('is-popup-scrolling');
});

function showModalItem(index, direction = 0) {
  const items = categoryItems(activeCategory);
  if (!items.length) return;
  activeCategoryIndex = (index + items.length) % items.length;
  const item = items[activeCategoryIndex];
  const reel = item.category === 'reels';

  const media = modal.querySelector('.modal-image');
  media.classList.remove('slide-left', 'slide-right');
  if (direction) {
    void media.offsetWidth;
    media.classList.add(direction > 0 ? 'slide-right' : 'slide-left');
  }

  const websitePreview = item.category === 'websites' || item.category === 'funnels';
  const automationPreview = item.category === 'automation';
  modal.classList.toggle('is-reel', reel);
  modal.classList.toggle('is-automation', automationPreview);
  if (automationPreview) { setAutomationZoom(0); resetAutomationPan(); }
  modal.classList.toggle('is-website-preview', websitePreview);
  modal.classList.remove('is-popup-scrolling');

  if (reel) {
    modalImage.style.display = 'none';
    modalVideo.style.display = 'block';
    stopModalVideo();
    modalVideo.src = item.video;
    modalVideo.load();
    // The popup video plays only after the user has clicked/opened it.
    modalVideo.play().catch(() => {});
  } else {
    stopModalVideo();
    modalVideo.style.display = 'none';
    modalImage.style.display = 'block';
    modalImage.src = item.fullImage || item.image;
    modalImage.alt = websitePreview ? 'Full website or funnel design preview' : 'Portfolio work';
    if (websitePreview) {
      if (modalImage.complete) requestAnimationFrame(updateModalWebsitePreview);
    } else {
      modal.style.removeProperty('--modal-website-scroll-distance');
      modal.style.removeProperty('--modal-website-scroll-duration');
    }
  }
}

projects.forEach(card => {
  const link = card.querySelector('a');
  link.addEventListener('click', event => {
    const category = card.dataset.category;

    // Website and Funnel cards open their own editable live URL in a new tab.
    if (category === 'websites' || category === 'funnels') {
      const liveUrl = card.dataset.liveUrl;

      // Keep placeholder links from navigating until a real URL is added.
      if (!liveUrl || liveUrl === '#') {
        event.preventDefault();
        console.warn(`Add a live URL for this ${category.slice(0, -1)} portfolio item.`);
      }
      return;
    }

    // Graphics, Reels and Automation keep the existing popup.
    event.preventDefault();
    lastFocused = link;
    activeCategory = category;
    const cardsInCategory = [...projects].filter(project => project.dataset.category === activeCategory);
    activeCategoryIndex = cardsInCategory.indexOf(card);
    showModalItem(activeCategoryIndex);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modalClose.focus(), 50);
  });
});

modalPrev.addEventListener('click', event => {
  event.stopPropagation();
  showModalItem(activeCategoryIndex - 1, -1);
});
modalNext.addEventListener('click', event => {
  event.stopPropagation();
  showModalItem(activeCategoryIndex + 1, 1);
});

function closeModal() {
  modal.classList.remove('open', 'is-reel', 'is-automation', 'is-website-preview', 'is-popup-scrolling');
  resetAutomationPan();
  stopModalVideo();
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => {
  if (!modal.classList.contains('open')) return;
  if (event.key === 'Escape') closeModal();
  if (event.key === 'Tab') {
    const focusable = [...modal.querySelectorAll('button:not(:disabled), video[controls]')]
      .filter(el => el.offsetParent !== null);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!modal.contains(document.activeElement)) { event.preventDefault(); first?.focus(); }
    else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  if (event.target === modalVideo) return;
  if (event.key === 'ArrowLeft') showModalItem(activeCategoryIndex - 1, -1);
  if (event.key === 'ArrowRight') showModalItem(activeCategoryIndex + 1, 1);
});

// Gradually brighten the secondary services statement while scrolling through it
const servicesSecondary = document.getElementById('servicesSecondary');
function updateServicesColor() {
  if (!servicesSecondary) return;
  const rect = servicesSecondary.getBoundingClientRect();
  const viewportStart = window.innerHeight * 0.92;
  const viewportEnd = window.innerHeight * 0.30;
  const progress = Math.max(0, Math.min(1, (viewportStart - rect.top) / (viewportStart - viewportEnd)));
  const start = [117, 111, 104];
  const end = [247, 244, 238];
  const rgb = start.map((value, index) => Math.round(value + (end[index] - value) * progress));
  servicesSecondary.style.color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
window.addEventListener('scroll', updateServicesColor, { passive: true });
window.addEventListener('resize', updateServicesColor);
updateServicesColor();

// Expandable service rows
document.querySelectorAll('.service-row').forEach(row => {
  row.setAttribute('tabindex', '0');
  row.setAttribute('role', 'button');
  row.setAttribute('aria-expanded', 'false');
  const toggle = () => {
    const expanded = row.classList.toggle('expanded');
    row.setAttribute('aria-expanded', String(expanded));
  };
  row.addEventListener('click', toggle);
  row.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});

// Testimonial slider
const testimonialCards = [...document.querySelectorAll('.quote-card')];
const prevBtn = document.getElementById('testimonialPrev');
const nextBtn = document.getElementById('testimonialNext');
let testimonialIndex = 0;

function renderTestimonials() {
  const mobile = window.innerWidth < 720;
  testimonialCards.forEach((card, index) => {
    card.style.display = !mobile || index === testimonialIndex ? '' : 'none';
  });
  prevBtn.style.display = mobile ? '' : 'none';
  nextBtn.style.display = mobile ? '' : 'none';
}
prevBtn.addEventListener('click', () => { testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length; renderTestimonials(); });
nextBtn.addEventListener('click', () => { testimonialIndex = (testimonialIndex + 1) % testimonialCards.length; renderTestimonials(); });
window.addEventListener('resize', renderTestimonials);
renderTestimonials();

// Scroll reveal and animated counters
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('.stats strong').forEach(stat => {
  const original = stat.textContent.trim();
  const match = original.match(/(\d+)/);
  if (!match) return;
  const target = Number(match[1]);
  const suffix = original.replace(match[1], '');
  const counterObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    const start = performance.now();
    const duration = 1100;
    function animate(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      stat.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    counterObserver.disconnect();
  }, { threshold: .7 });
  counterObserver.observe(stat);
});

// Custom cursor for desktop pointers
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
if (window.matchMedia('(pointer:fine)').matches) {
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`;
    dot.style.opacity = ring.style.opacity = '1';
    if (!ringRunning) { ringRunning = true; requestAnimationFrame(moveRing); }
  });
  // Only animate while the ring is catching up, so the page is idle when the mouse rests.
  let ringRunning = false;
  function moveRing() {
    ringX += (mouseX - ringX) * .16;
    ringY += (mouseY - ringY) * .16;
    ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
    if (Math.abs(mouseX - ringX) + Math.abs(mouseY - ringY) > .3) requestAnimationFrame(moveRing);
    else ringRunning = false;
  }
  document.querySelectorAll('a, button, .service-row, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = '0'; });
}


// Intro loader and staged hero reveal
const loader = document.getElementById('siteLoader');
const loaderBar = document.getElementById('loaderBar');
const loaderPercent = document.getElementById('loaderPercent');

// Wrap hero title lines without changing the visible wording
const heroTitle = document.querySelector('.hero h1');
if (heroTitle && !heroTitle.querySelector('.hero-line')) {
  const nodes = [...heroTitle.childNodes];
  let chunks = [];
  let current = '';
  nodes.forEach(node => {
    if (node.nodeName === 'BR') {
      chunks.push(current); current = '';
    } else if (node.nodeType === Node.TEXT_NODE) {
      current += node.textContent;
    } else {
      current += node.outerHTML || '';
    }
  });
  if (current.trim()) chunks.push(current);
  if (chunks.length > 1) {
    heroTitle.innerHTML = chunks.map(line => `<span class="hero-line"><span class="hero-line-inner">${line}</span></span>`).join('');
  }
}

let loadProgress = 0;
const loaderTimer = setInterval(() => {
  loadProgress += Math.max(1, Math.round((100 - loadProgress) * .12));
  loadProgress = Math.min(loadProgress, 100);
  loaderBar.style.width = `${loadProgress}%`;
  loaderPercent.textContent = String(loadProgress).padStart(2, '0');
  if (loadProgress >= 100) {
    clearInterval(loaderTimer);
    setTimeout(() => {
      loader.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
    }, 220);
  }
}, 45);

// Magnetic controls inspired by premium creative-studio interactions
if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.btn, .nav-cta, .filter-btn, .testimonial-controls button').forEach(el => {
    el.classList.add('magnetic');
    el.addEventListener('mousemove', event => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * .18}px, ${y * .18}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

// Project hover lens, tilt, and floating "View" cursor
const projectBubble = document.getElementById('projectViewBubble');
let bubbleX = 0, bubbleY = 0, bubbleTargetX = 0, bubbleTargetY = 0;
let bubbleRunning = false;
function animateProjectBubble() {
  bubbleX += (bubbleTargetX - bubbleX) * .18;
  bubbleY += (bubbleTargetY - bubbleY) * .18;
  projectBubble.style.left = `${bubbleX}px`;
  projectBubble.style.top = `${bubbleY}px`;
  if (Math.abs(bubbleTargetX - bubbleX) + Math.abs(bubbleTargetY - bubbleY) > .3) requestAnimationFrame(animateProjectBubble);
  else bubbleRunning = false;
}
function startProjectBubble() {
  if (!bubbleRunning) { bubbleRunning = true; requestAnimationFrame(animateProjectBubble); }
}

projects.forEach(card => {
  const inner = card.querySelector('a');
  card.addEventListener('mousemove', event => {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    card.style.setProperty('--mx', `${px * 100}%`);
    card.style.setProperty('--my', `${py * 100}%`);
    const rotateY = (px - .5) * 4;
    const rotateX = (.5 - py) * 4;
    if (inner) inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    bubbleTargetX = event.clientX;
    bubbleTargetY = event.clientY;
    startProjectBubble();
  });
  card.addEventListener('mouseenter', () => projectBubble.classList.add('show'));
  card.addEventListener('mouseleave', () => {
    projectBubble.classList.remove('show');
    if (inner) inner.style.transform = '';
  });
});

// Word-by-word scroll illumination for the What I Do statement
if (servicesSecondary) {
  const words = servicesSecondary.textContent.trim().split(/\s+/);
  servicesSecondary.innerHTML = words.map(word => `<span class="reveal-word">${word}&nbsp;</span>`).join('');
  const revealWords = [...servicesSecondary.querySelectorAll('.reveal-word')];
  function illuminateServiceWords() {
    const rect = servicesSecondary.getBoundingClientRect();
    const start = window.innerHeight * .90;
    const end = window.innerHeight * .24;
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    const litCount = Math.ceil(progress * revealWords.length);
    revealWords.forEach((word, index) => word.classList.toggle('is-lit', index < litCount));
  }
  window.removeEventListener('scroll', updateServicesColor);
  window.removeEventListener('resize', updateServicesColor);
  servicesSecondary.style.color = '';
  window.addEventListener('scroll', illuminateServiceWords, { passive: true });
  window.addEventListener('resize', illuminateServiceWords);
  illuminateServiceWords();
}

// Floating image previews for service rows
const servicePreview = document.getElementById('servicePreview');
const servicePreviewImage = document.getElementById('servicePreviewImage');
let previewX = 0, previewY = 0, previewTargetX = 0, previewTargetY = 0;
let previewRunning = false;
function animateServicePreview() {
  previewX += (previewTargetX - previewX) * .14;
  previewY += (previewTargetY - previewY) * .14;
  servicePreview.style.left = `${previewX}px`;
  servicePreview.style.top = `${previewY}px`;
  if (Math.abs(previewTargetX - previewX) + Math.abs(previewTargetY - previewY) > .3) requestAnimationFrame(animateServicePreview);
  else previewRunning = false;
}

document.querySelectorAll('.service-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    const previewImage = row.dataset.previewImage;
    if (!previewImage) return;
    servicePreviewImage.src = previewImage;
    servicePreviewImage.alt = row.dataset.previewAlt || '';
    servicePreview.classList.add('show');
  });
  row.addEventListener('mousemove', event => {
    previewTargetX = Math.min(window.innerWidth - 140, event.clientX + 150);
    previewTargetY = Math.max(120, Math.min(window.innerHeight - 120, event.clientY));
    if (!previewRunning) { previewRunning = true; requestAnimationFrame(animateServicePreview); }
  });
  row.addEventListener('mouseleave', () => servicePreview.classList.remove('show'));
});

// Subtle depth while scrolling, without changing the page composition
const heroHeading = document.querySelector('.hero h1');
const ctaHeading = document.querySelector('.cta h2');
let depthTicking = false;
function updateDepth() {
  const y = window.scrollY;
  if (heroHeading && y < window.innerHeight * 1.2) {
    heroHeading.style.transform = `translateY(${y * .055}px)`;
  }
  if (ctaHeading) {
    const r = ctaHeading.getBoundingClientRect();
    const proximity = Math.max(0, 1 - Math.abs(r.top - window.innerHeight * .45) / window.innerHeight);
    ctaHeading.style.transform = `scale(${.965 + proximity * .035})`;
  }
  depthTicking = false;
}
window.addEventListener('scroll', () => {
  if (!depthTicking) { requestAnimationFrame(updateDepth); depthTicking = true; }
}, { passive: true });
updateDepth();




// Vivid Motion-inspired response across the entire page while preserving the ring cursor.
const heroSection = document.querySelector('.hero');
// The glow and grid live on their own layers so pointer updates restyle only them, not the whole page.
const pageGlow = document.getElementById('pageGlow');
const pageGrid = document.getElementById('pageGrid');
if (window.matchMedia('(pointer:fine)').matches) {
  // Batch pointer updates to one per frame; each update restyles the page background.
  let pointerEvent = null;
  document.addEventListener('pointermove', event => {
    if (!pointerEvent) requestAnimationFrame(applyPointer);
    pointerEvent = event;
  }, { passive: true });
  function applyPointer() {
    const event = pointerEvent;
    pointerEvent = null;
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    pageGlow.style.setProperty('--page-x', `${x}%`);
    pageGlow.style.setProperty('--page-y', `${y}%`);
    pageGrid.style.setProperty('--page-grid-x', `${(x - 50) * -.09}px`);
    pageGrid.style.setProperty('--page-grid-y', `${(y - 50) * -.09}px`);

    if (heroSection && window.scrollY < heroSection.offsetHeight) {
      heroSection.style.setProperty('--hero-x', `${x}%`);
      heroSection.style.setProperty('--hero-y', `${y}%`);
      heroSection.style.setProperty('--hero-shift-x', `${(x - 50) * .12}px`);
      heroSection.style.setProperty('--hero-shift-y', `${(y - 50) * .12}px`);
      heroSection.style.setProperty('--hero-shift-x-reverse', `${(x - 50) * -.08}px`);
      heroSection.style.setProperty('--hero-shift-y-reverse', `${(y - 50) * -.08}px`);
    }
  }
  document.addEventListener('mouseleave', () => {
    pageGlow.style.setProperty('--page-x', '50%');
    pageGlow.style.setProperty('--page-y', '35%');
    pageGrid.style.setProperty('--page-grid-x', '0px');
    pageGrid.style.setProperty('--page-grid-y', '0px');
  });
}

  
// Hand cursor and click-drag scrolling for the process cards.
const processViewport = document.getElementById('processViewport');
if (processViewport) {
  let dragging = false, startX = 0, startScrollLeft = 0;
  processViewport.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || processViewport.closest('.is-pinned')) return;
    dragging = true;
    startX = event.clientX;
    startScrollLeft = processViewport.scrollLeft;
    processViewport.classList.add('is-dragging');
    processViewport.setPointerCapture(event.pointerId);
  });
  processViewport.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    processViewport.scrollLeft = startScrollLeft - (event.clientX - startX) * 1.25;
    event.preventDefault();
  });
  const stopProcessDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    processViewport.classList.remove('is-dragging');
    if (event.pointerId != null && processViewport.hasPointerCapture(event.pointerId)) processViewport.releasePointerCapture(event.pointerId);
  };
  processViewport.addEventListener('pointerup', stopProcessDrag);
  processViewport.addEventListener('pointercancel', stopProcessDrag);
  processViewport.addEventListener('lostpointercapture', stopProcessDrag);
}

// Pinned horizontal scroll: the Process section holds while the cards slide
// from Step 01 to Step 04, then releases back to vertical scrolling.
const processSection = document.getElementById('process');
const processPin = processSection?.querySelector('.process-pin');
const processTrack = processViewport?.querySelector('.process-track');
if (processSection && processPin && processTrack && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  processSection.classList.add('is-pinned');
  // Cards slide in faster than lazy loading reacts, so fetch their images once the section is near.
  const processImageObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    processTrack.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
    processImageObserver.disconnect();
  }, { rootMargin: '100% 0px' });
  processImageObserver.observe(processSection);
  let processDistance = 0;
  let processTicking = false;

  function updateProcessPin() {
    processTicking = false;
    const scrolled = -processSection.getBoundingClientRect().top;
    const progress = processDistance ? Math.min(1, Math.max(0, scrolled / processDistance)) : 0;
    processTrack.style.transform = `translate3d(${(-progress * processDistance).toFixed(1)}px, 0, 0)`;
  }

  function measureProcessPin() {
    processViewport.scrollLeft = 0;
    const styles = getComputedStyle(processViewport);
    const padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    processDistance = Math.max(0, Math.round(processTrack.scrollWidth + padding - processViewport.clientWidth));
    processSection.style.height = `${processPin.offsetHeight + processDistance}px`;
    updateProcessPin();
  }

  window.addEventListener('scroll', () => {
    if (!processTicking) { processTicking = true; requestAnimationFrame(updateProcessPin); }
  }, { passive: true });
  window.addEventListener('resize', measureProcessPin);
  window.addEventListener('load', measureProcessPin);
  measureProcessPin();
}
