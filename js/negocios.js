/* =============================================
   REFOOD PERÚ — negocios.js
   Panel de administración de negocios
   ============================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('panel-page')) return;
  requireBusiness();
  loadPanelData();
  initPanelNav();
  initOfferForm();
  loadBizProfileForm();
  initBizProfileForm();
});

// ─── CARGAR PANEL ─────────────────────────────────────────────
function loadPanelData() {
  const biz = Auth.getBusiness();
  if (!biz) return;

  // Nombre en sidebar
  const nameEl = document.getElementById('panel-biz-name');
  if (nameEl) nameEl.textContent = biz.name;

  const offers      = Store.get('rf_offers', []).filter(o => o.businessId === biz.id);
  const reservations = Store.get('rf_reservations', []);
  const bizReservations = reservations.filter(r => r.items && r.items.some(i => {
    const allOffers = Store.get('rf_offers', []);
    const offer = allOffers.find(o => o.id === i.offerId);
    return offer && offer.businessId === biz.id;
  }));

  const totalRevenue = bizReservations.reduce((s,r) => s + (r.total||0), 0);
  const rescuedItems = bizReservations.reduce((s,r) => s + (r.items||[]).reduce((ss,i) => ss + (i.qty||1), 0), 0);

  // Stats cards
  setEl('stat-offers',       offers.filter(o => o.active).length);
  setEl('stat-reservations', bizReservations.length);
  setEl('stat-revenue',      formatCurrency(totalRevenue));
  setEl('stat-rescued',      rescuedItems);

  // Render offers table
  renderPanelOffers(offers);
  renderReservationsTable(bizReservations);
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── TABLA DE OFERTAS ─────────────────────────────────────────
function renderPanelOffers(offers) {
  const tbody = document.getElementById('offers-tbody');
  if (!tbody) return;

  if (!offers.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted)">
      No has publicado ofertas aún. ¡Crea tu primera oferta!
    </td></tr>`;
    return;
  }

  tbody.innerHTML = offers.map(o => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:.5rem;">
          <span style="font-size:1.3rem;">${escapeHTML(o.emoji||'🍱')}</span>
          <div>
            <div style="font-weight:600;font-size:.9rem;">${escapeHTML(o.name)}</div>
            <div style="font-size:.75rem;color:var(--text-muted);">${escapeHTML(o.category)}</div>
          </div>
        </div>
      </td>
      <td><span style="text-decoration:line-through;color:var(--text-light)">${formatCurrency(o.originalPrice)}</span></td>
      <td style="font-weight:700;color:var(--primary-dark)">${formatCurrency(o.discountPrice)}</td>
      <td><span class="badge badge-red">-${discountPct(o.originalPrice,o.discountPrice)}%</span></td>
      <td>${expiryLabel(o.expiryDate)}</td>
      <td>
        <div style="display:flex;gap:.4rem;">
          <span class="badge ${o.active ? 'badge-green' : 'badge-red'}">${o.active ? 'Activa' : 'Inactiva'}</span>
          <button class="btn btn-sm btn-secondary" onclick="editOffer('${o.id}')">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="deleteOffer('${o.id}')">🗑️</button>
        </div>
      </td>
    </tr>`).join('');
}

// ─── RESERVAS ────────────────────────────────────────────────
function renderReservationsTable(reservations) {
  const tbody = document.getElementById('reservations-tbody');
  if (!tbody) return;

  if (!reservations.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:2rem;color:var(--text-muted)">Aún no tienes reservas</td></tr>`;
    return;
  }

  tbody.innerHTML = reservations.slice().reverse().slice(0, 10).map(r => {
    const d = new Date(r.createdAt);
    return `<tr>
      <td style="font-family:monospace;font-size:.82rem;">#${r.id.slice(1,7).toUpperCase()}</td>
      <td>${d.toLocaleDateString('es-PE')} ${d.toLocaleTimeString('es-PE',{hour:'2-digit',minute:'2-digit'})}</td>
      <td style="font-weight:700;color:var(--primary-dark)">${formatCurrency(r.total)}</td>
      <td><span class="badge badge-green">${r.status}</span></td>
    </tr>`;
  }).join('');
}

// ─── FORM DE OFERTA ───────────────────────────────────────────
function initOfferForm() {
  const form = document.getElementById('form-offer');
  if (!form) return;

  // Price calc preview
  ['offer-original', 'offer-price'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateDiscountPreview);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const biz = Auth.getBusiness();

    const name     = form.querySelector('#offer-name').value.trim();
    const category = form.querySelector('#offer-category').value;
    const original = parseFloat(form.querySelector('#offer-original').value);
    const price    = parseFloat(form.querySelector('#offer-price').value);
    const expiry   = form.querySelector('#offer-expiry').value;
    const stock    = parseInt(form.querySelector('#offer-stock').value) || 1;
    const desc     = form.querySelector('#offer-desc').value.trim();
    const emoji    = form.querySelector('#offer-emoji').value || '🍱';
    const editId   = form.dataset.editId;

    // Validations
    if (!name)     { showToast('Nombre de producto requerido', 'warning'); return; }
    if (!category) { showToast('Selecciona una categoría', 'warning'); return; }
    if (!original || original <= 0) { showToast('Precio original inválido', 'warning'); return; }
    if (!price || price <= 0)       { showToast('Precio con descuento inválido', 'warning'); return; }
    if (price >= original)          { showToast('El precio con descuento debe ser menor al original', 'warning'); return; }
    if (!expiry) { showToast('Fecha de vencimiento requerida', 'warning'); return; }

    let offers = Store.get('rf_offers', []);

    if (editId) {
      // Edit mode
      const idx = offers.findIndex(o => o.id === editId);
      if (idx !== -1) {
        offers[idx] = { ...offers[idx], name, category, originalPrice: original, discountPrice: price, expiryDate: expiry, stock, description: desc, emoji };
        showToast('Oferta actualizada ✅', 'success');
      }
      delete form.dataset.editId;
      document.getElementById('form-offer-title').textContent = 'Nueva Oferta';
      document.getElementById('btn-cancel-edit').style.display = 'none';
    } else {
      // New offer
      const newOffer = {
        id: generateId(), businessId: biz.id, businessName: biz.name,
        name, category, originalPrice: original, discountPrice: price,
        expiryDate: expiry, stock, description: desc, emoji, active: true,
      };
      offers.push(newOffer);
      showToast(`Oferta "${name}" publicada 🎉`, 'success');
    }

    Store.set('rf_offers', offers);
    form.reset();
    showPanel('panel-offers');
    loadPanelData();
  });

  // Cancel edit
  const cancelBtn = document.getElementById('btn-cancel-edit');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      form.reset(); delete form.dataset.editId;
      document.getElementById('form-offer-title').textContent = 'Nueva Oferta';
      cancelBtn.style.display = 'none';
    });
  }
}

function updateDiscountPreview() {
  const orig  = parseFloat(document.getElementById('offer-original')?.value) || 0;
  const price = parseFloat(document.getElementById('offer-price')?.value) || 0;
  const preview = document.getElementById('discount-preview');
  if (!preview) return;
  if (orig > 0 && price > 0 && price < orig) {
    const pct = discountPct(orig, price);
    preview.textContent = `Descuento: ${pct}% | Ahorro: ${formatCurrency(orig - price)}`;
    preview.style.color = 'var(--primary)';
  } else {
    preview.textContent = '';
  }
}

// ─── EDITAR OFERTA ────────────────────────────────────────────
function editOffer(id) {
  const offers = Store.get('rf_offers', []);
  const offer  = offers.find(o => o.id === id);
  if (!offer) return;

  showPanel('panel-new-offer');

  const form = document.getElementById('form-offer');
  if (!form) return;

  form.querySelector('#offer-name').value     = offer.name;
  form.querySelector('#offer-category').value = offer.category;
  form.querySelector('#offer-original').value = offer.originalPrice;
  form.querySelector('#offer-price').value    = offer.discountPrice;
  form.querySelector('#offer-expiry').value   = offer.expiryDate;
  form.querySelector('#offer-stock').value    = offer.stock || 1;
  form.querySelector('#offer-desc').value     = offer.description || '';
  form.querySelector('#offer-emoji').value    = offer.emoji || '🍱';

  form.dataset.editId = id;
  document.getElementById('form-offer-title').textContent = 'Editar Oferta';
  const cancelBtn = document.getElementById('btn-cancel-edit');
  if (cancelBtn) cancelBtn.style.display = 'inline-flex';
  updateDiscountPreview();
}

// ─── ELIMINAR OFERTA ──────────────────────────────────────────
function deleteOffer(id) {
  if (!confirm('¿Seguro que deseas eliminar esta oferta?')) return;
  let offers = Store.get('rf_offers', []);
  offers = offers.filter(o => o.id !== id);
  Store.set('rf_offers', offers);
  showToast('Oferta eliminada', 'info');
  loadPanelData();
}

// ─── PERFIL DEL NEGOCIO ────────────────────────────────────────
// ─── MAPA PICKER EN PANEL ────────────────────────────────────
let panelMap = null, panelMarker = null;

function initBizMapPicker(lat, lng) {
  const el = document.getElementById('panel-map-picker');
  if (!el) return;

  const initLat = lat || -9.19;
  const initLng = lng || -75.01;
  const initZoom = lat ? 15 : 5;

  if (panelMap) {
    panelMap.setView([initLat, initLng], initZoom);
    panelMarker.setLatLng([initLat, initLng]);
    return;
  }

  panelMap = L.map('panel-map-picker', { zoomControl: true, attributionControl: false })
    .setView([initLat, initLng], initZoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(panelMap);

  panelMarker = L.marker([initLat, initLng], {
    draggable: true,
    icon: L.divIcon({
      html: `<div style="background:#1a9e5c;width:22px;height:22px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);"></div>`,
      className: '', iconSize:[22,22], iconAnchor:[11,11]
    })
  }).addTo(panelMap);

  panelMarker.on('dragend', () => savePanelLatLng(panelMarker.getLatLng()));
  panelMap.on('click', e => { panelMarker.setLatLng(e.latlng); savePanelLatLng(e.latlng); });
}

function savePanelLatLng(latlng) {
  document.getElementById('b-lat').value = latlng.lat.toFixed(6);
  document.getElementById('b-lng').value = latlng.lng.toFixed(6);
}

async function searchBizLocation() {
  const query = (document.getElementById('b-loc-search')?.value?.trim() ||
                  document.getElementById('b-address')?.value?.trim()) + ', Perú';
  if (!query || query === ', Perú') { showToast('Escribe una dirección para buscar', 'warning'); return; }
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=pe`, { headers:{'Accept-Language':'es'} });
    const data = await res.json();
    if (!data.length) { showToast('No se encontró esa dirección en Perú', 'warning'); return; }
    const latlng = L.latLng(parseFloat(data[0].lat), parseFloat(data[0].lon));
    panelMarker.setLatLng(latlng);
    panelMap.flyTo(latlng, 16, { duration: 0.8 });
    savePanelLatLng(latlng);
    showToast('📌 Ubicación encontrada', 'success');
  } catch { showToast('Error buscando ubicación', 'error'); }
}

function useBizGPS() {
  if (!navigator.geolocation) { showToast('GPS no disponible', 'warning'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
    panelMarker.setLatLng(latlng);
    panelMap.flyTo(latlng, 16, { duration: 0.8 });
    savePanelLatLng(latlng);
    showToast('📍 Ubicación GPS capturada', 'success');
  }, () => showToast('No se pudo obtener el GPS', 'error'));
}

// ─── PERFIL DEL NEGOCIO ────────────────────────────────────────
function loadBizProfileForm() {
  const biz = Auth.getBusiness();
  if (!biz) return;
  const accounts = Store.get('rf_businesses_accounts', []);
  const full = accounts.find(b => b.id === biz.id) || biz;

  setVal('b-name', full.name);
  setVal('b-type', full.type);
  setVal('b-phone', full.phone);
  setVal('b-email', full.email);
  setVal('b-address', full.address);
  setVal('b-description', full.description);
  setVal('b-hours', full.hours);
  setVal('b-website', full.website);

  const avatarEl = document.getElementById('biz-photo-avatar');
  if (avatarEl) {
    if (full.photo) {
      avatarEl.style.backgroundImage = `url('${full.photo}')`;
      avatarEl.style.backgroundSize = 'cover';
      avatarEl.style.backgroundPosition = 'center';
      avatarEl.textContent = '';
    } else {
      avatarEl.style.backgroundImage = '';
      avatarEl.textContent = full.logo || '🏪';
    }
  }

  // Inicializar mapa picker con coords actuales
  setTimeout(() => initBizMapPicker(full.lat, full.lng), 100);
  if (full.lat) { document.getElementById('b-lat').value = full.lat; document.getElementById('b-lng').value = full.lng; }

  const logoIconEl = document.getElementById('panel-logo-icon');
  if (logoIconEl && full.photo) {
    logoIconEl.style.backgroundImage = `url('${full.photo}')`;
    logoIconEl.style.backgroundSize = 'cover';
    logoIconEl.style.backgroundPosition = 'center';
    logoIconEl.textContent = '';
  }
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

function initBizProfileForm() {
  bindPhotoInput('biz-photo-input', (dataUrl) => { setBusinessPhoto(dataUrl); loadBizProfileForm(); });

  document.getElementById('form-biz-profile')?.addEventListener('submit', e => {
    e.preventDefault();
    const biz = Auth.getBusiness();
    if (!biz) return;

    const latVal = parseFloat(document.getElementById('b-lat').value) || biz.lat;
    const lngVal = parseFloat(document.getElementById('b-lng').value) || biz.lng;

    const updates = {
      name:        document.getElementById('b-name').value.trim(),
      type:        document.getElementById('b-type').value,
      phone:       document.getElementById('b-phone').value.trim(),
      address:     document.getElementById('b-address').value.trim(),
      description: document.getElementById('b-description').value.trim(),
      hours:       document.getElementById('b-hours').value.trim(),
      website:     document.getElementById('b-website').value.trim(),
      lat:         latVal,
      lng:         lngVal,
    };

    if (!updates.name) { showToast('El nombre del negocio es obligatorio', 'warning'); return; }

    const accounts = Store.get('rf_businesses_accounts', []);
    const idx = accounts.findIndex(b => b.id === biz.id);
    if (idx !== -1) { accounts[idx] = { ...accounts[idx], ...updates }; Store.set('rf_businesses_accounts', accounts); }

    const publicBiz = Store.get('rf_businesses_public', []);
    const pIdx = publicBiz.findIndex(b => b.id === biz.id);
    if (pIdx !== -1) { publicBiz[pIdx] = { ...publicBiz[pIdx], ...updates }; Store.set('rf_businesses_public', publicBiz); }

    Store.set('rf_current_business', { ...biz, ...updates });

    const nameEl = document.getElementById('panel-biz-name');
    if (nameEl) nameEl.textContent = updates.name;

    showToast('Información del negocio actualizada ✅', 'success');
  });
}

// ─── NAV DEL PANEL ────────────────────────────────────────────
function initPanelNav() {
  document.querySelectorAll('.panel-nav-item[data-panel]').forEach(item => {
    item.addEventListener('click', () => showPanel(item.dataset.panel));
  });
  showPanel('panel-overview');
}

function showPanel(panelId) {
  document.querySelectorAll('.panel-section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.panel-nav-item').forEach(i => i.classList.remove('active'));
  const section = document.getElementById(panelId);
  if (section) section.classList.remove('hidden');
  const navItem = document.querySelector(`.panel-nav-item[data-panel="${panelId}"]`);
  if (navItem) navItem.classList.add('active');
}
