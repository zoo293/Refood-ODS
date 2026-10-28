/* =============================================
   REFOOD PERÚ — ofertas.js  (v2)
   Listado, filtros por categoría y distrito
   ============================================= */
'use strict';

let allOffers    = [];
let allBiz       = [];
let activeFilter = 'todos';
let activeDistrict = '';
let searchQuery  = '';

document.addEventListener('DOMContentLoaded', () => {
  allOffers = Store.get('rf_offers', []).filter(o => o.active !== false);
  allBiz    = Store.get('rf_businesses_public', []);
  renderOffers();
  initCategoryFilters();
  initSearchListener();
  initDistrictListener();
});

// ─── RENDER ──────────────────────────────────────────────────
function renderOffers() {
  const grid = document.getElementById('offers-grid');
  if (!grid) return;

  let filtered = allOffers;

  // Filter by category
  if (activeFilter !== 'todos') {
    filtered = filtered.filter(o => o.category === activeFilter);
  }

  // Filter by district
  if (activeDistrict) {
    // Find biz IDs in that district
    const bizInDistrict = new Set(allBiz.filter(b => b.district === activeDistrict).map(b => b.id));
    filtered = filtered.filter(o => bizInDistrict.has(o.businessId));
  }

  // Filter by search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(o =>
      o.name.toLowerCase().includes(q) ||
      o.businessName.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q) ||
      (o.description && o.description.toLowerCase().includes(q))
    );
  }

  // Sort: urgent first by default
  filtered.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  const cart    = Store.get('rf_cart', []);
  const favs    = Store.get('rf_favorites', []);
  const cartIds = cart.map(i => i.offerId);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:4rem 2rem;">
        <div style="font-size:3.5rem;margin-bottom:1rem;">🔍</div>
        <h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:.5rem;">Sin resultados</h3>
        <p style="color:var(--text-muted);margin-bottom:1.5rem;">Intenta con otra búsqueda, categoría o distrito</p>
        <button class="btn btn-secondary" onclick="resetFilters()">🔄 Ver todas las ofertas</button>
      </div>`;
    updateResultCount(0);
    return;
  }

  grid.innerHTML = filtered.map(o =>
    renderOfferCard(o, cartIds.includes(o.id), favs.includes(o.id))
  ).join('');

  updateResultCount(filtered.length);
}

function updateResultCount(count) {
  const el = document.getElementById('results-count');
  if (!el) return;
  el.textContent = `${count} oferta${count !== 1 ? 's' : ''} encontrada${count !== 1 ? 's' : ''}`;
}

// ─── CATEGORY FILTERS ────────────────────────────────────────
function initCategoryFilters() {
  document.querySelectorAll('#category-filters .filter-chip[data-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#category-filters .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      renderOffers();
    });
  });
}

// ─── DISTRICT LISTENER ───────────────────────────────────────
function initDistrictListener() {
  document.addEventListener('rf:district', e => {
    activeDistrict = e.detail.district;
    renderOffers();
  });
}

// ─── SEARCH ──────────────────────────────────────────────────
function initSearchListener() {
  document.addEventListener('rf:search', e => {
    searchQuery = e.detail.query;
    renderOffers();
  });
  const input = document.getElementById('global-search');
  if (input) {
    input.addEventListener('input', debounce(e => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderOffers();
    }, 250));
  }
}

// ─── SORT ────────────────────────────────────────────────────
function sortOffers(by) {
  switch (by) {
    case 'expiry':   allOffers.sort((a,b) => new Date(a.expiryDate) - new Date(b.expiryDate)); break;
    case 'discount': allOffers.sort((a,b) => discountPct(b.originalPrice,b.discountPrice) - discountPct(a.originalPrice,a.discountPrice)); break;
    case 'price':    allOffers.sort((a,b) => a.discountPrice - b.discountPrice); break;
    case 'name':     allOffers.sort((a,b) => a.name.localeCompare(b.name,'es')); break;
  }
  renderOffers();
}

// ─── RESET ───────────────────────────────────────────────────
function resetFilters() {
  activeFilter   = 'todos';
  activeDistrict = '';
  searchQuery    = '';

  const search = document.getElementById('global-search');
  if (search) search.value = '';

  document.querySelectorAll('#category-filters .filter-chip').forEach(c => c.classList.remove('active'));
  document.querySelector('#category-filters .filter-chip[data-filter="todos"]')?.classList.add('active');

  document.querySelectorAll('.district-chip').forEach(c => c.classList.remove('active'));
  document.querySelector('.district-chip[data-district=""]')?.classList.add('active');

  renderOffers();
}
