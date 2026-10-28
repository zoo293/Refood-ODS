/* =============================================
   REFOOD PERÚ — mapa.js
   Integración con Google Maps
   ============================================= */

'use strict';

let map, markers = [], infoWindows = [];

// ─── INIT MAP ─────────────────────────────────────────────────
function initMap() {
  const center = { lat: -12.0922, lng: -77.0500 };

  map = new google.maps.Map(document.getElementById('map'), {
    center, zoom: 13,
    styles: mapStyles(),
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  loadStoreMarkers();
}

// ─── MARCADORES ───────────────────────────────────────────────
function loadStoreMarkers() {
  const businesses = Store.get('rf_businesses_public', []);
  const offers     = Store.get('rf_offers', []).filter(o => o.active !== false);

  businesses.forEach((biz, idx) => {
    const bizOffers = offers.filter(o => o.businessId === biz.id);

    const marker = new google.maps.Marker({
      position: { lat: biz.lat, lng: biz.lng },
      map,
      title: biz.name,
      icon: {
        url: createMarkerIcon(biz.logo, bizOffers.length),
        scaledSize: new google.maps.Size(48, 48),
      },
      animation: google.maps.Animation.DROP,
    });

    const offersHTML = bizOffers.slice(0, 3).map(o => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:.3rem 0;border-bottom:1px solid #f0f0f0;">
        <span style="font-size:.8rem;">${escapeHTML(o.emoji)} ${escapeHTML(o.name)}</span>
        <span style="font-size:.8rem;font-weight:700;color:#1a9e5c;">${formatCurrency(o.discountPrice)}</span>
      </div>`).join('');

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="font-family:'Inter',sans-serif;max-width:260px;padding:.3rem;">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.6rem;">
            <span style="font-size:1.4rem;">${biz.logo}</span>
            <div>
              <strong style="font-size:.95rem;color:#1a2e22;">${escapeHTML(biz.name)}</strong>
              <div style="font-size:.75rem;color:#6b8070;">${escapeHTML(biz.address)}</div>
            </div>
          </div>
          ${bizOffers.length > 0 ? `
            <div style="background:#f7fbf9;border-radius:8px;padding:.5rem;margin-bottom:.6rem;">
              <div style="font-size:.78rem;font-weight:700;color:#1a9e5c;margin-bottom:.3rem;">
                🌟 ${bizOffers.length} oferta${bizOffers.length>1?'s':''} disponible${bizOffers.length>1?'s':''}
              </div>
              ${offersHTML}
            </div>` : '<p style="font-size:.82rem;color:#6b8070;">Sin ofertas activas hoy</p>'}
          <a href="ofertas.html" style="display:block;text-align:center;background:#1a9e5c;color:#fff;padding:.4rem;border-radius:6px;font-size:.82rem;font-weight:600;text-decoration:none;">
            Ver ofertas →
          </a>
        </div>`,
    });

    marker.addListener('click', () => {
      infoWindows.forEach(iw => iw.close());
      infoWindow.open(map, marker);
      highlightSidebarItem(biz.id);
    });

    markers.push(marker);
    infoWindows.push(infoWindow);

    // Populate sidebar
    addSidebarItem(biz, bizOffers.length, marker, infoWindow, idx);
  });
}

// ─── SIDEBAR ──────────────────────────────────────────────────
function addSidebarItem(biz, offersCount, marker, infoWindow, idx) {
  const list = document.getElementById('map-stores-list');
  if (!list) return;

  const item = document.createElement('div');
  item.className = 'map-store-item';
  item.dataset.bizId = biz.id;
  item.innerHTML = `
    <div style="display:flex;align-items:center;gap:.6rem;">
      <span style="font-size:1.3rem;">${biz.logo}</span>
      <div style="flex:1;">
        <div class="map-store-name">${escapeHTML(biz.name)}</div>
        <div class="map-store-address">📍 ${escapeHTML(biz.address)}</div>
        <div class="map-store-offers">${offersCount > 0 ? `🟢 ${offersCount} oferta${offersCount>1?'s':''}` : '⚫ Sin ofertas hoy'}</div>
      </div>
    </div>`;

  item.addEventListener('click', () => {
    map.setCenter(marker.getPosition());
    map.setZoom(16);
    infoWindows.forEach(iw => iw.close());
    infoWindow.open(map, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marker.setAnimation(null), 1500);
    highlightSidebarItem(biz.id);
  });

  list.appendChild(item);
}

function highlightSidebarItem(bizId) {
  document.querySelectorAll('.map-store-item').forEach(el => {
    el.style.background = el.dataset.bizId === bizId ? 'var(--primary-light)' : '';
  });
}

// ─── MARKER ICON (SVG canvas) ─────────────────────────────────
function createMarkerIcon(emoji, count) {
  const canvas = document.createElement('canvas');
  canvas.width = 48; canvas.height = 56;
  const ctx = canvas.getContext('2d');

  // Pin shape
  ctx.beginPath();
  ctx.arc(24, 22, 20, 0, Math.PI * 2);
  ctx.fillStyle = '#1a9e5c';
  ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();

  // Pointer
  ctx.beginPath();
  ctx.moveTo(17, 38); ctx.lineTo(24, 54); ctx.lineTo(31, 38);
  ctx.fillStyle = '#1a9e5c'; ctx.fill();

  // Emoji
  ctx.font = '18px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 24, 22);

  // Badge count
  if (count > 0) {
    ctx.beginPath();
    ctx.arc(39, 8, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c'; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 9px Inter,sans-serif';
    ctx.fillText(count, 39, 8);
  }

  return canvas.toDataURL();
}

// ─── MAP STYLES ───────────────────────────────────────────────
function mapStyles() {
  return [
    { featureType:'water', stylers:[{color:'#c9dde8'}] },
    { featureType:'landscape', stylers:[{color:'#f7fbf9'}] },
    { featureType:'road', elementType:'geometry', stylers:[{color:'#ffffff'}] },
    { featureType:'road', elementType:'labels.text.fill', stylers:[{color:'#6b8070'}] },
    { featureType:'poi', stylers:[{visibility:'simplified'}] },
    { featureType:'poi.park', stylers:[{color:'#d1f5e3'},{visibility:'on'}] },
    { featureType:'transit', stylers:[{visibility:'off'}] },
    { featureType:'administrative', elementType:'labels.text.fill', stylers:[{color:'#1a2e22'}] },
  ];
}

// ─── FILTRO DE MAPA ───────────────────────────────────────────
function filterMapByType(type) {
  const businesses = Store.get('rf_businesses_public', []);
  markers.forEach((marker, idx) => {
    const biz = businesses[idx];
    if (!biz) return;
    const show = !type || biz.type === type;
    marker.setVisible(show);
  });
  document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.map-filter-btn[data-type="${type || 'all'}"]`);
  if (btn) btn.classList.add('active');
}

// ─── GEOLOCALIZACIÓN ─────────────────────────────────────────
function goToMyLocation() {
  if (!navigator.geolocation) { showToast('Geolocalización no disponible', 'warning'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    map.setCenter(loc); map.setZoom(15);
    new google.maps.Marker({
      position: loc, map,
      icon: { url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
      title: 'Mi ubicación',
    });
    showToast('Mostrando tu ubicación', 'success');
  }, () => showToast('No se pudo obtener tu ubicación', 'error'));
}
