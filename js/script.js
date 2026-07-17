/* =====================================================================
   MODERNBOOKS — script.js
   JavaScript application layer.
   Sections:
     1. Data — book catalogue & promo slides
     2. Global state + localStorage persistence
     3. DOM references
     4. Utility helpers (toast, currency, debounce, stars)
     5. Theme engine
     6. Mobile navigation
     7. Hero carousel
     8. Filtering / sorting / rendering the book grid
     9. Cart & wishlist logic
    10. Drawer (tray) rendering & controls
    11. Scroll-to-top
    12. Misc forms (search, newsletter)
    13. Init
   ===================================================================== */

(() => {
  'use strict';

  /* ===================================================================
     1. DATA
  =================================================================== */
  const CATEGORIES = ['Fiction', 'Fantasy', 'Non-Fiction', 'Romance', 'Mystery', 'Science', 'Poetry'];

  // Each book gets a deterministic gradient pair for its placeholder cover,
  // keyed by category, so covers feel intentional rather than random noise.
  const COVER_THEMES = {
    Fiction:      ['#7b4b8a', '#3c2a52'],
    Fantasy:      ['#2e5c6e', '#123044'],
    'Non-Fiction': ['#8a5a2a', '#4a2f12'],
    Romance:      ['#a8405f', '#4a1b2b'],
    Mystery:      ['#33403f', '#101615'],
    Science:      ['#2f6f5e', '#0f2b23'],
    Poetry:       ['#8a6a2e', '#3c2c0f']
  };

  const BOOKS = [
    { id: 1,  title: 'The Glass Orchard',        author: 'Maren Iversen',    category: 'Fiction',     price: 18.5, was: 24.0, rating: 4.6, reviews: 214, stock: true, image: 'images/The Glass Orchard.png' },
    { id: 2,  title: 'Cartographer of Ash',       author: 'Rowan T. Blake',   category: 'Fantasy',     price: 22.0, was: 28.0, rating: 4.8, reviews: 512, stock: true, image: 'images/Cartographer of Ash.png' },
    { id: 3,  title: 'A Quiet Ledger',            author: 'Priya Nair',       category: 'Non-Fiction', price: 15.0, was: 15.0, rating: 4.3, reviews: 98,  stock: true, image: 'images/A Quiet Ledger.jpeg' },
    { id: 4,  title: 'Salt & Second Chances',     author: 'Idris Colton',     category: 'Romance',     price: 12.0, was: 16.0, rating: 4.1, reviews: 340, stock: false, image: 'images/Salt & Second Chances.png' },
    { id: 5,  title: 'The Thirteenth Witness',    author: 'Elena Marchetti',  category: 'Mystery',     price: 20.0, was: 20.0, rating: 4.7, reviews: 401, stock: true, image: 'images/The Thirteenth Witness.jpeg' },
    { id: 6,  title: 'Field Notes on Gravity',    author: 'Dr. Samuel Osei',  category: 'Science',     price: 26.0, was: 32.0, rating: 4.5, reviews: 156, stock: true, image: 'images/Field Notes on Gravity.png' },
    { id: 7,  title: 'Lamplight & Marrow',        author: 'Nadia Ferreira',   category: 'Poetry',      price: 9.5,  was: 9.5,  rating: 4.9, reviews: 88,  stock: true, image: 'images/Lamplight & Marrow.png' },
    { id: 8,  title: 'The Last Cartography',      author: 'Rowan T. Blake',   category: 'Fantasy',     price: 24.0, was: 24.0, rating: 4.4, reviews: 267, stock: true, image: 'images/The Last Cartography.jpeg' },
    { id: 9,  title: 'Ordinary Constellations',   author: 'Maren Iversen',    category: 'Fiction',     price: 17.0, was: 21.0, rating: 4.2, reviews: 133, stock: true, image: 'images/Ordinary Constellations.jpeg' },
    { id: 10, title: 'The Chemistry of Silence',  author: 'Priya Nair',       category: 'Non-Fiction', price: 19.5, was: 19.5, rating: 3.9, reviews: 74,  stock: false, image: 'images/The Chemistry Of Silence.jpeg' },
    { id: 11, title: 'Harbor of Small Lies',      author: 'Idris Colton',     category: 'Romance',     price: 13.5, was: 18.0, rating: 4.0, reviews: 205, stock: true, image: 'images/Harbor of Small Lies.jpeg' },
    { id: 12, title: 'Static on the Line',        author: 'Elena Marchetti',  category: 'Mystery',     price: 21.5, was: 21.5, rating: 4.6, reviews: 189, stock: true, image: 'images/Static on The Line.jpeg' },
    { id: 13, title: 'The Mathematics of Tide',   author: 'Dr. Samuel Osei',  category: 'Science',     price: 29.0, was: 34.0, rating: 4.8, reviews: 302, stock: true, image: 'images/The Mathematics of Tide.png' },
    { id: 14, title: 'Winter Ghazals',            author: 'Nadia Ferreira',   category: 'Poetry',      price: 11.0, was: 11.0, rating: 4.7, reviews: 61,  stock: true, image: 'images/Winter Ghazals.jpeg' },
    { id: 15, title: 'The Cartouche Affair',      author: 'Elena Marchetti',  category: 'Mystery',     price: 18.0, was: 23.0, rating: 4.3, reviews: 145, stock: true, image: 'images/The Cartouche Affair.jpeg' },
    { id: 16, title: 'Everything We Buried',      author: 'Maren Iversen',    category: 'Fiction',     price: 16.5, was: 16.5, rating: 4.1, reviews: 92,  stock: true, image: 'images/Everything We Buried.jpeg' }
  ];

  const PROMO_SLIDES = [
    { tag: 'New Arrival',   title: 'Cartographer of Ash',    text: 'A debut fantasy epic that redraws the map of grief and wonder.', theme: COVER_THEMES.Fantasy, image: 'images/Cartographer of Ash.png' },
    { tag: 'Staff Pick',    title: 'Lamplight & Marrow',      text: 'Poems for the hour after the house has gone quiet.', theme: COVER_THEMES.Poetry, image: 'images/Lamplight & Marrow.png' },
    { tag: 'Up to 25% Off', title: 'Salt & Second Chances',   text: 'This week only — our most-loaned romance, now on the shelf.', theme: COVER_THEMES.Romance, image: 'images/Salt & Second Chances.png' },
    { tag: 'Editor\u2019s Choice', title: 'Field Notes on Gravity', text: 'Popular science that makes the invisible feel close enough to touch.', theme: COVER_THEMES.Science, image: 'images/Field Notes on Gravity.png' }
  ];

  const FLIP_WORDS = ['staying up for', 'missing your stop for', 'dog-earing at 2am', 'lending to a friend'];

  /* ===================================================================
     2. GLOBAL STATE + PERSISTENCE
  =================================================================== */
  const STORAGE_KEY = 'modernbooks_state_v1';

  const state = {
    cart: [],       // [{ id, qty }]
    wishlist: [],   // [id, id, ...]
    theme: 'dark',
    filters: { search: '', category: 'All', maxPrice: 60, minRating: 0 },
    sort: 'popular',
    view: 'grid',
    visibleCount: 8,
    activeTrayTab: 'cart'
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && typeof saved === 'object') {
        state.cart = Array.isArray(saved.cart) ? saved.cart : [];
        state.wishlist = Array.isArray(saved.wishlist) ? saved.wishlist : [];
        state.theme = saved.theme === 'light' ? 'light' : 'dark';
      }
    } catch (err) {
      console.warn('ModernBooks: could not read saved state, starting fresh.', err);
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        cart: state.cart,
        wishlist: state.wishlist,
        theme: state.theme
      }));
    } catch (err) {
      console.warn('ModernBooks: could not save state.', err);
    }
  }

  /* ===================================================================
     3. DOM REFERENCES (guarded — some exist only on index.html)
  =================================================================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const el = {
    html: document.documentElement,
    themeToggle: $('#themeToggle'),
    hamburgerBtn: $('#hamburgerBtn'),
    mobileMenu: $('#mobileMenu'),
    scrollTopBtn: $('#scrollTopBtn'),
    toastStack: $('#toastStack'),
    previewBackdrop: $('#previewBackdrop'),
    previewModal: $('#previewModal'),
    previewCloseBtn: $('#previewCloseBtn'),
    previewBook: $('#previewBook'),
    previewTitle: $('#previewTitle'),
    previewAuthor: $('#previewAuthor'),
    previewHeading: $('#previewHeading'),
    previewSummary: $('#previewSummary'),
    previewPageTitle1: $('#previewPageTitle1'),
    previewPageBody1: $('#previewPageBody1'),
    previewPageTitle2: $('#previewPageTitle2'),
    previewPageBody2: $('#previewPageBody2'),
    previewPageTitle3: $('#previewPageTitle3'),
    previewPageBody3: $('#previewPageBody3'),
    previewPrevBtn: $('#previewPrevBtn'),
    previewNextBtn: $('#previewNextBtn'),

    // Hero / carousel
    carouselTrack: $('#carouselTrack'),
    carouselDots: $('#carouselDots'),
    carouselPrev: $('#carouselPrev'),
    carouselNext: $('#carouselNext'),
    flipWord: $('#flipWord'),
    statBooks: $('#statBooks'),
    heroWishlistBtn: $('#heroWishlistBtn'),

    // Shop
    bookGrid: $('#bookGrid'),
    categoryChips: $('#categoryChips'),
    filterSearch: $('#filterSearch'),
    navSearchInput: $('#navSearchInput'),
    navSearchForm: $('#navSearchForm'),
    priceRange: $('#priceRange'),
    priceRangeValue: $('#priceRangeValue'),
    ratingFilter: $('#ratingFilter'),
    resetFiltersBtn: $('#resetFiltersBtn'),
    sortSelect: $('#sortSelect'),
    resultsCount: $('#resultsCount'),
    gridViewBtn: $('#gridViewBtn'),
    listViewBtn: $('#listViewBtn'),
    loadMoreBtn: $('#loadMoreBtn'),

    // Drawer
    overlay: $('#overlay'),
    contactForm: $('#contactForm'),
    trayDrawer: $('#trayDrawer'),
    drawerTitle: $('#drawerTitle'),
    drawerBody: $('#drawerBody'),
    cartFooter: $('#cartFooter'),
    cartOpenBtn: $('#cartOpenBtn'),
    wishlistOpenBtn: $('#wishlistOpenBtn'),
    drawerCloseBtn: $('#drawerCloseBtn'),
    cartTabBtn: $('#cartTabBtn'),
    wishlistTabBtn: $('#wishlistTabBtn'),
    cartCount: $('#cartCount'),
    wishlistCount: $('#wishlistCount'),
    cartSubtotal: $('#cartSubtotal'),
    cartDiscount: $('#cartDiscount'),
    cartTotal: $('#cartTotal'),
    checkoutBtn: $('#checkoutBtn'),

    newsletterForm: $('#newsletterForm')
  };

  /* ===================================================================
     4. UTILITY HELPERS
  =================================================================== */
  const currency = (n) => `\u20b9${n.toFixed(2)}`;

  function debounce(fn, delay = 250) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  function starsMarkup(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let out = '';
    for (let i = 0; i < 5; i++) {
      if (i < full) out += '<i class="fa-solid fa-star"></i>';
      else if (i === full && half) out += '<i class="fa-solid fa-star-half-stroke"></i>';
      else out += '<i class="fa-regular fa-star"></i>';
    }
    return out;
  }

  function toast(message, type = 'info', icon = 'fa-circle-info') {
    if (!el.toastStack) return;
    const node = document.createElement('div');
    node.className = `toast glass ${type}`;
    const iconClass = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : icon;
    node.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
    el.toastStack.appendChild(node);
    setTimeout(() => node.remove(), 3100);
  }

  function coverGradient(category) {
    const theme = COVER_THEMES[category] || ['#555', '#222'];
    return `linear-gradient(160deg, ${theme[0]}, ${theme[1]})`;
  }

  /* ===================================================================
     5. THEME ENGINE
  =================================================================== */
  function applyTheme() {
    el.html.setAttribute('data-theme', state.theme);
    $$('.icon-btn#themeToggle i, #themeToggle i').forEach((icon) => {
      icon.className = state.theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    });
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    persist();
    toast(`Switched to ${state.theme} mode`, 'info', 'fa-lightbulb');
  }

  /* ===================================================================
     6. MOBILE NAVIGATION
  =================================================================== */
  function toggleMobileMenu() {
    if (!el.hamburgerBtn || !el.mobileMenu) return;
    const isOpen = el.mobileMenu.classList.toggle('open');
    el.hamburgerBtn.classList.toggle('open', isOpen);
    el.hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  }

  /* ===================================================================
     7. HERO CAROUSEL (auto-sliding, dots + arrows)
  =================================================================== */
  let carouselIndex = 0;
  let carouselTimer = null;

  function renderCarousel() {
    if (!el.carouselTrack) return;
    el.carouselTrack.innerHTML = PROMO_SLIDES.map((slide, i) => {
      const style = slide.image ? '' : `background:${`linear-gradient(160deg, ${slide.theme[0]}, ${slide.theme[1]})`}`;
      return `
      <div class="carousel-slide${i === 0 ? ' active' : ''}" ${style ? `style="${style}"` : ''} data-index="${i}">
        ${slide.image ? `<img class="carousel-image" src="${slide.image}" alt="${slide.title}" onerror="this.style.display='none'">` : ''}
        <span class="promo-tag">${slide.tag}</span>
        <h3>${slide.title}</h3>
        <p>${slide.text}</p>
      </div>
    `;
    }).join('');

    el.carouselDots.innerHTML = PROMO_SLIDES.map((_, i) =>
      `<button class="${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`
    ).join('');
  }

  function goToSlide(index) {
    const slides = $$('.carousel-slide', el.carouselTrack);
    const dots = $$('button', el.carouselDots);
    if (!slides.length) return;
    carouselIndex = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === carouselIndex));
    dots.forEach((d, i) => d.classList.toggle('active', i === carouselIndex));
  }

  function startCarouselAutoplay() {
    stopCarouselAutoplay();
    carouselTimer = setInterval(() => goToSlide(carouselIndex + 1), 4200);
  }
  function stopCarouselAutoplay() {
    if (carouselTimer) clearInterval(carouselTimer);
  }

  /* ===================================================================
     8. FILTERING / SORTING / RENDERING THE BOOK GRID
  =================================================================== */
  function renderCategoryChips() {
    if (!el.categoryChips) return;
    const chips = ['All', ...CATEGORIES];
    el.categoryChips.innerHTML = chips.map((cat) =>
      `<button class="chip${cat === state.filters.category ? ' active' : ''}" data-category="${cat}">${cat}</button>`
    ).join('');
  }

  function getFilteredBooks() {
    const { search, category, maxPrice, minRating } = state.filters;
    const term = search.trim().toLowerCase();

    let list = BOOKS.filter((b) => {
      const matchesSearch = !term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term);
      const matchesCategory = category === 'All' || b.category === category;
      const matchesPrice = b.price <= maxPrice;
      const matchesRating = b.rating >= minRating;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    switch (state.sort) {
      case 'price-asc': list = list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = list.sort((a, b) => b.price - a.price); break;
      case 'rating': list = list.sort((a, b) => b.rating - a.rating); break;
      case 'title': list = list.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: list = list.sort((a, b) => b.reviews - a.reviews); // "popular"
    }
    return list;
  }

  function bookCardHTML(book) {
    const inWishlist = state.wishlist.includes(book.id);
    const discount = book.was > book.price ? Math.round(((book.was - book.price) / book.was) * 100) : 0;
    const coverStyle = book.image ? '' : `background:${coverGradient(book.category)}`;
    return `
      <article class="book-card glass" data-id="${book.id}">
        <div class="book-cover"${coverStyle ? ` style="${coverStyle}"` : ''}>
          ${book.image ? `<img class="book-cover-image" src="${book.image}" alt="${book.title} cover" onerror="this.style.display='none'">` : ''}
          <span class="book-category">${book.category}</span>
          <span class="stock-flag ${book.stock ? 'in' : 'out'}">${book.stock ? 'In Stock' : 'Out of Stock'}</span>
          <span class="cover-title">${book.title}</span>
        </div>
        <div class="book-info">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-author">by ${book.author}</p>
          <div class="book-rating">
            <span class="stars" data-id="${book.id}" role="img" aria-label="Rated ${book.rating} out of 5">${starsMarkup(book.rating)}</span>
            <span class="count">${book.rating.toFixed(1)} (${book.reviews})</span>
          </div>
          <div class="book-price">
            <span class="now">${currency(book.price)}</span>
            ${discount > 0 ? `<span class="was">${currency(book.was)}</span><span class="off">-${discount}%</span>` : ''}
          </div>
        </div>
        <div class="book-actions">
          <button class="btn btn-primary add-to-cart-btn" data-id="${book.id}" ${!book.stock ? 'disabled' : ''}>
            <i class="fa-solid fa-cart-plus"></i> ${book.stock ? 'Add to Cart' : 'Sold Out'}
          </button>
          <button class="btn btn-secondary buy-now-btn" data-id="${book.id}" ${!book.stock ? 'disabled' : ''}>Buy Now</button>
          <button class="icon-btn wishlist-btn ${inWishlist ? 'active' : ''}" data-id="${book.id}" aria-label="Toggle wishlist">
            <i class="fa-${inWishlist ? 'solid' : 'regular'} fa-heart"></i>
          </button>
        </div>
      </article>
    `;
  }

  function renderBookGrid() {
    if (!el.bookGrid) return;
    const filtered = getFilteredBooks();
    const visible = filtered.slice(0, state.visibleCount);

    el.resultsCount.textContent = `${filtered.length} title${filtered.length !== 1 ? 's' : ''} found`;
    el.bookGrid.classList.toggle('list-view', state.view === 'list');

    if (!visible.length) {
      el.bookGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-book-skull"></i>
          <p>No books match those filters. Try widening your search.</p>
        </div>`;
    } else {
      el.bookGrid.innerHTML = visible.map(bookCardHTML).join('');
    }

    if (el.loadMoreBtn) {
      el.loadMoreBtn.style.display = filtered.length > visible.length ? 'inline-flex' : 'none';
    }
  }

  function resetFilters() {
    state.filters = { search: '', category: 'All', maxPrice: 60, minRating: 0 };
    state.sort = 'popular';
    state.visibleCount = 8;
    if (el.filterSearch) el.filterSearch.value = '';
    if (el.navSearchInput) el.navSearchInput.value = '';
    if (el.priceRange) el.priceRange.value = 60;
    if (el.priceRangeValue) el.priceRangeValue.textContent = 'Up to \u20b960';
    if (el.sortSelect) el.sortSelect.value = 'popular';
    $$('input[name="rating"]').forEach((r) => { r.checked = r.value === '0'; });
    renderCategoryChips();
    renderBookGrid();
    toast('Filters reset', 'info', 'fa-rotate-left');
  }

  /* ===================================================================
     9. CART & WISHLIST LOGIC
  =================================================================== */
  function addToCart(id, { silent = false } = {}) {
    const book = BOOKS.find((b) => b.id === id);
    if (!book || !book.stock) return;
    const line = state.cart.find((c) => c.id === id);
    if (line) line.qty += 1;
    else state.cart.push({ id, qty: 1 });
    persist();
    updateBadges();
    renderDrawer();
    if (!silent) toast(`${book.title} added to cart`, 'success');
  }

  function buyNow(id) {
    addToCart(id, { silent: true });
    toast('Added to cart — proceeding to checkout', 'success', 'fa-bolt');
    openDrawer('cart');
  }

  function changeQty(id, delta) {
    const line = state.cart.find((c) => c.id === id);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) state.cart = state.cart.filter((c) => c.id !== id);
    persist();
    updateBadges();
    renderDrawer();
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter((c) => c.id !== id);
    persist();
    updateBadges();
    renderDrawer();
    toast('Item removed from cart', 'info', 'fa-trash');
  }

  function toggleWishlist(id) {
    const book = BOOKS.find((b) => b.id === id);
    if (state.wishlist.includes(id)) {
      state.wishlist = state.wishlist.filter((w) => w !== id);
      toast(`${book.title} removed from wishlist`, 'info', 'fa-heart-crack');
    } else {
      state.wishlist.push(id);
      toast(`${book.title} added to wishlist`, 'success', 'fa-heart');
    }
    persist();
    updateBadges();
    renderBookGrid();
    renderDrawer();
  }

  function cartTotals() {
    const items = state.cart.map((c) => ({ ...c, book: BOOKS.find((b) => b.id === c.id) })).filter((c) => c.book);
    const subtotal = items.reduce((sum, c) => sum + c.book.was * c.qty, 0);
    const total = items.reduce((sum, c) => sum + c.book.price * c.qty, 0);
    const discount = subtotal - total;
    return { items, subtotal, discount, total };
  }

  function updateBadges() {
    const cartQty = state.cart.reduce((sum, c) => sum + c.qty, 0);
    if (el.cartCount) el.cartCount.textContent = cartQty;
    if (el.wishlistCount) el.wishlistCount.textContent = state.wishlist.length;
  }

  /* ===================================================================
     10. DRAWER (TRAY) RENDERING & CONTROLS
  =================================================================== */
  function openDrawer(tab) {
    if (!el.trayDrawer) return;
    if (tab) state.activeTrayTab = tab;
    el.trayDrawer.classList.add('open');
    el.overlay.classList.add('open');
    setActiveTab(state.activeTrayTab);
  }
  function closeDrawer() {
    if (!el.trayDrawer) return;
    el.trayDrawer.classList.remove('open');
    el.overlay.classList.remove('open');
  }
  function setActiveTab(tab) {
    state.activeTrayTab = tab;
    el.cartTabBtn.classList.toggle('active', tab === 'cart');
    el.wishlistTabBtn.classList.toggle('active', tab === 'wishlist');
    el.drawerTitle.textContent = tab === 'cart' ? 'Your Cart' : 'Your Wishlist';
    el.cartFooter.style.display = tab === 'cart' ? 'flex' : 'none';
    renderDrawer();
  }

  function renderDrawer() {
    if (!el.drawerBody) return;

    if (state.activeTrayTab === 'cart') {
      const { items, subtotal, discount, total } = cartTotals();
      if (!items.length) {
        el.drawerBody.innerHTML = `
          <div class="empty-tray">
            <i class="fa-solid fa-bag-shopping"></i>
            <p>Your cart is empty. Add a book to begin.</p>
          </div>`;
      } else {
        el.drawerBody.innerHTML = items.map((c) => `
          <div class="tray-item">
            <div class="mini-cover" style="background:${coverGradient(c.book.category)}">${c.book.title}</div>
            <div>
              <div class="tray-title">${c.book.title}</div>
              <div class="tray-price">${currency(c.book.price)} × ${c.qty}</div>
              <div class="qty-stepper">
                <button class="qty-dec" data-id="${c.id}" aria-label="Decrease quantity">−</button>
                <span>${c.qty}</span>
                <button class="qty-inc" data-id="${c.id}" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <button class="tray-remove" data-id="${c.id}" aria-label="Remove item"><i class="fa-solid fa-xmark"></i></button>
          </div>
        `).join('');
      }
      el.cartSubtotal.textContent = currency(subtotal);
      el.cartDiscount.textContent = `\u2212${currency(discount)}`;
      el.cartTotal.textContent = currency(total);
    } else {
      const items = state.wishlist.map((id) => BOOKS.find((b) => b.id === id)).filter(Boolean);
      if (!items.length) {
        el.drawerBody.innerHTML = `
          <div class="empty-tray">
            <i class="fa-regular fa-heart"></i>
            <p>Nothing saved yet. Tap the heart on a book to keep it here.</p>
          </div>`;
      } else {
        el.drawerBody.innerHTML = items.map((b) => `
          <div class="tray-item">
            <div class="mini-cover" style="background:${coverGradient(b.category)}">${b.title}</div>
            <div>
              <div class="tray-title">${b.title}</div>
              <div class="tray-price">${currency(b.price)}</div>
              <button class="btn btn-sm btn-primary move-to-cart-btn" data-id="${b.id}" style="margin-top:0.4rem;">Add to Cart</button>
            </div>
            <button class="tray-remove" data-id="${b.id}" data-wishlist="1" aria-label="Remove from wishlist"><i class="fa-solid fa-xmark"></i></button>
          </div>
        `).join('');
      }
    }
  }

  function checkout() {
    if (!state.cart.length) {
      toast('Your cart is empty', 'error', 'fa-bag-shopping');
      return;
    }
    toast('Order placed! A confirmation has been sent.', 'success', 'fa-circle-check');
    state.cart = [];
    persist();
    updateBadges();
    renderDrawer();
    closeDrawer();
  }

  /* ===================================================================
     11. SCROLL TO TOP
  =================================================================== */
  function handleScroll() {
    if (!el.scrollTopBtn) return;
    el.scrollTopBtn.classList.toggle('visible', window.scrollY > 480);
  }

  /* ===================================================================
     12. EVENT WIRING
  =================================================================== */
  function openPreview(book) {
    if (!el.previewModal || !el.previewBackdrop) return;
    el.previewTitle.textContent = book.title;
    el.previewAuthor.textContent = `by ${book.author}`;
    el.previewHeading.textContent = `Preview ${book.title}`;
    el.previewSummary.textContent = `Flip through a quick sample of ${book.title} and let the shelves feel a little closer to life.`;
    el.previewPageTitle1.textContent = `${book.title} opens with intrigue`;
    el.previewPageBody1.textContent = `The very first pages of ${book.title} introduce a scene that feels intimate, immediate and impossible to leave behind.`;
    el.previewPageTitle2.textContent = `Momentum builds`; 
    el.previewPageBody2.textContent = `The story gathers pace as hidden motives, sharp dialogue and a sense of place pull the reader deeper.`;
    el.previewPageTitle3.textContent = `The final pull`; 
    el.previewPageBody3.textContent = `By the end of the preview, ${book.title} leaves behind a feeling of wonder, longing and curiosity.`;
    el.previewBook.classList.remove('is-open');
    el.previewBook.querySelectorAll('.preview-page').forEach((p, index) => p.classList.toggle('active', index === 0));
    el.previewModal.classList.add('open');
    el.previewBackdrop.classList.add('open');
    el.previewModal.setAttribute('aria-hidden', 'false');
    el.previewBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closePreview() {
    if (!el.previewModal || !el.previewBackdrop) return;
    el.previewModal.classList.remove('open');
    el.previewBackdrop.classList.remove('open');
    el.previewModal.setAttribute('aria-hidden', 'true');
    el.previewBackdrop.setAttribute('aria-hidden', 'true');
  }

  function flipPreviewPage(direction) {
    if (!el.previewBook) return;
    const pages = Array.from(el.previewBook.querySelectorAll('.preview-page'));
    const activeIndex = pages.findIndex((page) => page.classList.contains('active'));
    const nextIndex = (activeIndex + direction + pages.length) % pages.length;
    pages.forEach((page, index) => page.classList.toggle('active', index === nextIndex));
    el.previewBook.classList.toggle('is-open', nextIndex > 0);
  }

  function wireEvents() {
    el.themeToggle && el.themeToggle.addEventListener('click', toggleTheme);
    el.hamburgerBtn && el.hamburgerBtn.addEventListener('click', toggleMobileMenu);
    window.addEventListener('scroll', handleScroll, { passive: true });
    el.scrollTopBtn && el.scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Carousel
    el.carouselPrev && el.carouselPrev.addEventListener('click', () => { goToSlide(carouselIndex - 1); startCarouselAutoplay(); });
    el.carouselNext && el.carouselNext.addEventListener('click', () => { goToSlide(carouselIndex + 1); startCarouselAutoplay(); });
    el.carouselDots && el.carouselDots.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-index]');
      if (!btn) return;
      goToSlide(Number(btn.dataset.index));
      startCarouselAutoplay();
    });

    // Search (nav + sidebar, debounced & synced)
    const onSearch = debounce((value) => {
      state.filters.search = value;
      state.visibleCount = 8;
      renderBookGrid();
    }, 220);

    el.filterSearch && el.filterSearch.addEventListener('input', (e) => {
      if (el.navSearchInput) el.navSearchInput.value = e.target.value;
      onSearch(e.target.value);
    });
    el.navSearchForm && el.navSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    });
    el.navSearchInput && el.navSearchInput.addEventListener('input', (e) => {
      if (el.filterSearch) el.filterSearch.value = e.target.value;
      onSearch(e.target.value);
    });

    // Category chips (delegated)
    el.categoryChips && el.categoryChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      state.filters.category = chip.dataset.category;
      state.visibleCount = 8;
      renderCategoryChips();
      renderBookGrid();
    });

    // Price range
    el.priceRange && el.priceRange.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      state.filters.maxPrice = val;
      el.priceRangeValue.textContent = val >= 60 ? 'Up to \u20b960' : `Up to \u20b9${val}`;
      state.visibleCount = 8;
      renderBookGrid();
    });

    // Rating filter
    el.ratingFilter && el.ratingFilter.addEventListener('change', (e) => {
      if (e.target.name !== 'rating') return;
      state.filters.minRating = Number(e.target.value);
      state.visibleCount = 8;
      renderBookGrid();
    });

    el.resetFiltersBtn && el.resetFiltersBtn.addEventListener('click', resetFilters);

    // Sort
    el.sortSelect && el.sortSelect.addEventListener('change', (e) => {
      state.sort = e.target.value;
      renderBookGrid();
    });

    // View toggle
    el.gridViewBtn && el.gridViewBtn.addEventListener('click', () => {
      state.view = 'grid';
      el.gridViewBtn.classList.add('active');
      el.listViewBtn.classList.remove('active');
      renderBookGrid();
    });
    el.listViewBtn && el.listViewBtn.addEventListener('click', () => {
      state.view = 'list';
      el.listViewBtn.classList.add('active');
      el.gridViewBtn.classList.remove('active');
      renderBookGrid();
    });

    // Load more
    el.loadMoreBtn && el.loadMoreBtn.addEventListener('click', () => {
      state.visibleCount += 4;
      renderBookGrid();
    });

    // Book grid actions (delegated: add-to-cart, buy-now, wishlist, star rating, preview)
    el.bookGrid && el.bookGrid.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.add-to-cart-btn');
      const buyBtn = e.target.closest('.buy-now-btn');
      const wishBtn = e.target.closest('.wishlist-btn');
      const starEl = e.target.closest('.stars[data-id]');
      const card = e.target.closest('.book-card');

      if (addBtn && !addBtn.disabled) addToCart(Number(addBtn.dataset.id));
      if (buyBtn && !buyBtn.disabled) buyNow(Number(buyBtn.dataset.id));
      if (wishBtn) toggleWishlist(Number(wishBtn.dataset.id));
      if (starEl) {
        const book = BOOKS.find((b) => b.id === Number(starEl.dataset.id));
        if (book) toast(`You rated "${book.title}" ${book.rating.toFixed(1)} ★`, 'info', 'fa-star');
      }
      if (card && !(addBtn || buyBtn || wishBtn || starEl)) {
        const book = BOOKS.find((b) => b.id === Number(card.dataset.id));
        if (book) {
          card.classList.add('is-activated');
          setTimeout(() => card.classList.remove('is-activated'), 350);
          openPreview(book);
        }
      }
    });

    // Preview modal controls
    el.previewCloseBtn && el.previewCloseBtn.addEventListener('click', closePreview);
    el.previewBackdrop && el.previewBackdrop.addEventListener('click', closePreview);
    el.previewPrevBtn && el.previewPrevBtn.addEventListener('click', () => flipPreviewPage(-1));
    el.previewNextBtn && el.previewNextBtn.addEventListener('click', () => flipPreviewPage(1));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePreview();
    });

    // Drawer open/close
    el.cartOpenBtn && el.cartOpenBtn.addEventListener('click', () => openDrawer('cart'));
    el.wishlistOpenBtn && el.wishlistOpenBtn.addEventListener('click', () => openDrawer('wishlist'));
    el.heroWishlistBtn && el.heroWishlistBtn.addEventListener('click', () => openDrawer('wishlist'));
    el.drawerCloseBtn && el.drawerCloseBtn.addEventListener('click', closeDrawer);
    el.overlay && el.overlay.addEventListener('click', closeDrawer);
    el.cartTabBtn && el.cartTabBtn.addEventListener('click', () => setActiveTab('cart'));
    el.wishlistTabBtn && el.wishlistTabBtn.addEventListener('click', () => setActiveTab('wishlist'));
    el.checkoutBtn && el.checkoutBtn.addEventListener('click', checkout);

    // Drawer body actions (delegated: qty +/-, remove, move-to-cart)
    el.drawerBody && el.drawerBody.addEventListener('click', (e) => {
      const inc = e.target.closest('.qty-inc');
      const dec = e.target.closest('.qty-dec');
      const remove = e.target.closest('.tray-remove');
      const moveToCart = e.target.closest('.move-to-cart-btn');

      if (inc) changeQty(Number(inc.dataset.id), 1);
      if (dec) changeQty(Number(dec.dataset.id), -1);
      if (moveToCart) { addToCart(Number(moveToCart.dataset.id)); }
      if (remove) {
        const id = Number(remove.dataset.id);
        if (remove.dataset.wishlist) toggleWishlist(id);
        else removeFromCart(id);
      }
    });

    // Escape key closes drawer / mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
        if (el.mobileMenu && el.mobileMenu.classList.contains('open')) toggleMobileMenu();
      }
    });

    // Contact + newsletter forms
    el.contactForm && el.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      el.contactForm.reset();
      toast('Thanks for reaching out! We will get back to you soon.', 'success', 'fa-paper-plane');
    });

    el.newsletterForm && el.newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      el.newsletterForm.reset();
      toast('Subscribed! Welcome to The Marginalia.', 'success', 'fa-envelope-circle-check');
    });
  }

  /* ===================================================================
     13. INIT
  =================================================================== */
  function flipWordAnimation() {
    if (!el.flipWord) return;
    let i = 0;
    setInterval(() => {
      i = (i + 1) % FLIP_WORDS.length;
      el.flipWord.style.opacity = 0;
      setTimeout(() => {
        el.flipWord.textContent = FLIP_WORDS[i];
        el.flipWord.style.opacity = 1;
      }, 300);
    }, 3200);
    el.flipWord.style.transition = 'opacity 0.3s ease';
  }

  function animateBookCount() {
    if (!el.statBooks) return;
    const target = BOOKS.length * 12; // stylised "curated titles" figure
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.statBooks.textContent = current;
    }, 30);
  }

  function init() {
    loadState();
    applyTheme();

    renderCarousel();
    startCarouselAutoplay();
    flipWordAnimation();
    animateBookCount();

    renderCategoryChips();
    renderBookGrid();

    updateBadges();
    setActiveTab('cart');

    wireEvents();
    handleScroll();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
