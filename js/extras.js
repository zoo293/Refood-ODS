/* =============================================
   REFOOD PERÚ — extras.js
   QR, Confetti, WhatsApp, Animaciones, Accesibilidad
   ============================================= */
'use strict';

/* =============================================
   CONFETTI
   ============================================= */
function launchConfetti(duration = 3000) {
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);

  const ctx  = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors  = ['#1a9e5c','#f0a500','#3498db','#e74c3c','#8e44ad','#48d888','#fff','#f39c12'];
  const emojis  = ['🌿','🥗','🍎','🥛','🥦','🌱','⭐','💚'];
  const pieces  = [];

  for (let i = 0; i < 130; i++) {
    pieces.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height - canvas.height,
      w:     Math.random() * 10 + 5,
      h:     Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      emoji: Math.random() > .65 ? emojis[Math.floor(Math.random() * emojis.length)] : null,
      vx:    (Math.random() - .5) * 4,
      vy:    Math.random() * 3 + 2,
      angle: Math.random() * 360,
      spin:  (Math.random() - .5) * 8,
      opacity: 1,
    });
  }

  const start = Date.now();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - start;
    if (elapsed > duration) { canvas.remove(); return; }

    pieces.forEach(p => {
      p.x     += p.vx;
      p.y     += p.vy;
      p.angle += p.spin;
      p.vy    += .05; // gravity
      if (elapsed > duration - 1000) p.opacity = Math.max(0, p.opacity - .01);

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle * Math.PI / 180);

      if (p.emoji) {
        ctx.font = `${p.w * 2}px serif`;
        ctx.fillText(p.emoji, -p.w, p.h);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();

      if (p.y > canvas.height + 20) { p.y = -10; p.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* =============================================
   QR CODE (usando la API de Google Charts)
   ============================================= */
function generateQR(text, size = 200) {
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=0d6e3e&bgcolor=ffffff&margin=10`;
}

function showReservationQR(reservationId, total) {
  const qrData = `REFOOD-PERU|RES:${reservationId}|TOTAL:${total}|FECHA:${new Date().toLocaleDateString('es-PE')}`;
  const qrUrl  = generateQR(qrData, 220);

  let modal = document.getElementById('qr-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'qr-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:380px;text-align:center;">
        <div class="modal-header">
          <h3 class="modal-title">✅ Reserva Confirmada</h3>
          <button class="modal-close" onclick="closeModal('qr-modal')">✕</button>
        </div>
        <div style="padding:.5rem 0 1.5rem;">
          <p style="color:var(--text-muted);font-size:.88rem;margin-bottom:1rem;">
            Muestra este código QR al llegar al local. Válido por <strong>2 horas</strong>.
          </p>
          <div style="background:#f7fbf9;border-radius:var(--radius-md);padding:1rem;display:inline-block;margin-bottom:1rem;">
            <img id="qr-img" src="${qrUrl}" width="200" height="200" alt="QR Reserva" style="border-radius:8px;display:block;"/>
          </div>
          <div style="font-family:monospace;font-size:1.2rem;font-weight:900;color:var(--primary-dark);letter-spacing:.1em;margin-bottom:.5rem;">
            #${reservationId.slice(1,7).toUpperCase()}
          </div>
          <div style="font-size:.82rem;color:var(--text-muted);">Total: <strong>${formatCurrency(total)}</strong></div>
          <div style="display:flex;gap:.7rem;justify-content:center;margin-top:1.2rem;">
            <button class="btn btn-primary btn-sm" onclick="shareWhatsApp('${reservationId}','${total}')">📱 Compartir</button>
            <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Imprimir</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  openModal('qr-modal');
}

/* =============================================
   COMPARTIR EN WHATSAPP / REDES
   ============================================= */
function shareWhatsApp(reservationId, total) {
  const code = reservationId ? reservationId.slice(1,7).toUpperCase() : '';
  const text = `🌿 *REFOOD PERÚ* — ¡Acabo de rescatar alimentos!\n\n` +
               `📋 Reserva: #${code}\n` +
               `💰 Total ahorrado: ${formatCurrency(total)}\n` +
               `🌍 Cada compra ayuda a reducir el desperdicio alimentario en Lima.\n\n` +
               `👉 Únete en: https://refoodperu.pe`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

function shareOffer(offer) {
  const text = `🛍️ *REFOOD PERÚ* — ¡Oferta increíble!\n\n` +
               `${offer.emoji} *${offer.name}*\n` +
               `📍 ${offer.businessName}\n` +
               `💰 Antes: ${formatCurrency(offer.originalPrice)} → Ahora: ${formatCurrency(offer.discountPrice)}\n` +
               `🔥 ¡${discountPct(offer.originalPrice, offer.discountPrice)}% de descuento!\n\n` +
               `👉 Reserva en: https://refoodperu.pe`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

function shareOfferInstagram(offer) {
  // Instagram doesn't support direct text sharing, copy to clipboard instead
  const text = `🌿 ${offer.emoji} ${offer.name} — ¡${discountPct(offer.originalPrice,offer.discountPrice)}% OFF en REFOOD PERÚ! #RefoodPeru #SostenibilidadAlimentaria #LimaPeru`;
  navigator.clipboard?.writeText(text).then(() => showToast('Texto copiado para Instagram 📋', 'success'));
}

/* =============================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================= */
function initScrollAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    .scroll-hidden { opacity:0; transform:translateY(28px); transition:opacity .55s ease, transform .55s ease; }
    .scroll-hidden.scroll-visible { opacity:1; transform:translateY(0); }
    .scroll-hidden.delay-1 { transition-delay:.1s; }
    .scroll-hidden.delay-2 { transition-delay:.2s; }
    .scroll-hidden.delay-3 { transition-delay:.3s; }
    .scroll-hidden.delay-4 { transition-delay:.4s; }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('scroll-visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  // Animate sections, cards, stat items, benefit cards
  document.querySelectorAll(
    '.benefit-card, .step-card, .stat-item, .offer-card, .review-card, ' +
    '.testimonial-card, .fact-card, .comparison-card, .impact-metric, ' +
    '.section-header, .hero-stat, .flash-card, .badge-card'
  ).forEach((el, i) => {
    el.classList.add('scroll-hidden');
    if (i % 4 === 1) el.classList.add('delay-1');
    if (i % 4 === 2) el.classList.add('delay-2');
    if (i % 4 === 3) el.classList.add('delay-3');
    observer.observe(el);
  });
}

/* =============================================
   SKELETON LOADERS MEJORADOS
   ============================================= */
function renderSkeletonCards(containerId, count = 6) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = Array.from({length: count}, () => `
    <div style="background:#fff;border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--border);">
      <div class="skeleton" style="height:185px;border-radius:0;"></div>
      <div style="padding:1.1rem 1.2rem;">
        <div class="skeleton" style="height:12px;width:60px;margin-bottom:.8rem;border-radius:50px;"></div>
        <div class="skeleton" style="height:18px;width:90%;margin-bottom:.5rem;border-radius:4px;"></div>
        <div class="skeleton" style="height:14px;width:65%;margin-bottom:.8rem;border-radius:4px;"></div>
        <div style="display:flex;gap:.7rem;align-items:center;">
          <div class="skeleton" style="height:14px;width:55px;border-radius:4px;"></div>
          <div class="skeleton" style="height:22px;width:70px;border-radius:4px;"></div>
        </div>
      </div>
      <div style="padding:0 1.2rem 1.2rem;">
        <div class="skeleton" style="height:40px;border-radius:var(--radius-sm);"></div>
      </div>
    </div>`).join('');
}

/* =============================================
   MODO DALTÓNICO / ACCESIBILIDAD
   ============================================= */
const COLORBLIND_MODES = {
  normal:       null,
  deuteranopia: `filter:url('#deuteranopia')`,   // rojo-verde
  protanopia:   `filter:url('#protanopia')`,      // rojo
  tritanopia:   `filter:url('#tritanopia')`,      // azul-amarillo
  highcontrast: `--primary:#006600;--accent:#cc7700;--text-muted:#444;`,
};

function initColorBlindMode() {
  // SVG filters for color blindness simulation
  const svgFilters = `
  <svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;">
    <defs>
      <filter id="deuteranopia">
        <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="protanopia">
        <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>
      <filter id="tritanopia">
        <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
  </svg>`;
  document.body.insertAdjacentHTML('afterbegin', svgFilters);

  const saved = Store.get('rf_colorblind', 'normal');
  applyColorBlindMode(saved);
}

function applyColorBlindMode(mode) {
  Store.set('rf_colorblind', mode);
  const body = document.body;
  // Remove all filters
  body.style.filter = '';
  body.style.removeProperty('--primary');
  body.style.removeProperty('--accent');
  body.style.removeProperty('--text-muted');

  if (mode === 'deuteranopia') body.style.filter = "url('#deuteranopia')";
  else if (mode === 'protanopia') body.style.filter = "url('#protanopia')";
  else if (mode === 'tritanopia') body.style.filter = "url('#tritanopia')";
  else if (mode === 'highcontrast') {
    document.documentElement.style.setProperty('--primary','#006600');
    document.documentElement.style.setProperty('--accent','#cc7700');
    document.documentElement.style.setProperty('--text-muted','#333');
  }

  // Update selector if exists
  const sel = document.getElementById('colorblind-select');
  if (sel) sel.value = mode;
}

/* =============================================
   CALCULADORA DE AHORRO ANUAL
   ============================================= */
function calcAnnualSavings(visitsPerWeek, avgSaving) {
  const weekly  = visitsPerWeek * avgSaving;
  const monthly = weekly * 4.33;
  const annual  = weekly * 52;
  const co2     = (visitsPerWeek * 52) * 0.5;
  const meals   = Math.floor(annual / 8);
  return { weekly, monthly, annual, co2, meals };
}

/* =============================================
   HISTORIAL DE PRECIOS
   ============================================= */
function getPriceHistory(offerId) {
  // Simulate price history (in a real app this would be from a DB)
  const base = Store.get('rf_offers',[]).find(o => o.id === offerId);
  if (!base) return [];
  const history = [];
  const days = 14;
  for (let i = days; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const variation = 1 + (Math.random() - 0.5) * 0.2;
    history.push({
      date:  d.toLocaleDateString('es-PE', {day:'2-digit',month:'short'}),
      price: +(base.discountPrice * variation).toFixed(2),
    });
  }
  // Last entry is always current price
  history[history.length-1].price = base.discountPrice;
  return history;
}

/* =============================================
   AVATAR PERSONALIZABLE
   ============================================= */
const AVATARS = ['🌿','🥗','🌱','🍎','🥦','🌍','🌾','🥕','🍊','🥑','🫐','🌻','🐝','🦋','⭐','🏆'];

function renderAvatarPicker(containerId, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const current = Auth.getUser()?.avatar || '🌿';
  container.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center;">
      ${AVATARS.map(a => `
        <button onclick="selectAvatar('${a}')" style="
          width:48px;height:48px;border-radius:50%;font-size:1.6rem;
          border:2.5px solid ${a===current?'var(--primary)':'var(--border)'};
          background:${a===current?'var(--primary-light)':'var(--bg)'};
          cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;
        ">${a}</button>`).join('')}
    </div>`;
}

function selectAvatar(emoji) {
  const user = Auth.getUser();
  if (!user) return;
  const users = Store.get('rf_users', []);
  const idx   = users.findIndex(u => u.id === user.id);
  if (idx !== -1) { users[idx].avatar = emoji; Store.set('rf_users', users); }
  Store.set('rf_current_user', {...user, avatar: emoji});
  showToast(`Avatar actualizado ${emoji}`, 'success');
  // Re-render avatar picker
  renderAvatarPicker('avatar-picker', null);
  // Update navbar avatar
  const navAvatar = document.querySelector('.nav-avatar');
  if (navAvatar) navAvatar.textContent = emoji;
}

/* =============================================
   MULTI-IDIOMA (ES / EN)
   ============================================= */
const TRANSLATIONS = {
  es: {
    'nav.home':       'Inicio',
    'nav.offers':     'Ofertas',
    'nav.map':        'Mapa',
    'nav.impact':     'Impacto',
    'nav.reviews':    'Reseñas',
    'nav.business':   'Soy Negocio',
    'hero.title':     'Rescata alimentos, ahorra dinero y salva el planeta',
    'hero.cta':       'Ver ofertas ahora',
    'hero.register':  'Registrarse gratis',
    'cart.empty':     'Tu carrito está vacío',
    'cart.confirm':   'Confirmar Reserva',
    'offers.filter':  'Filtrar por categoría',
    'offers.search':  'Buscar productos, tiendas o categorías…',
    'login.title':    'Bienvenido de vuelta',
    'login.btn':      'Ingresar a mi cuenta',
  },
  en: {
    'nav.home':       'Home',
    'nav.offers':     'Offers',
    'nav.map':        'Map',
    'nav.impact':     'Impact',
    'nav.reviews':    'Reviews',
    'nav.business':   'I\'m a Business',
    'hero.title':     'Rescue food, save money and protect the planet',
    'hero.cta':       'See offers now',
    'hero.register':  'Register for free',
    'cart.empty':     'Your cart is empty',
    'cart.confirm':   'Confirm Reservation',
    'offers.filter':  'Filter by category',
    'offers.search':  'Search products, stores or categories…',
    'login.title':    'Welcome back',
    'login.btn':      'Sign in to my account',
  },
};

function t(key) {
  const lang = Store.get('rf_lang', 'es');
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['es'][key] || key;
}

function setLanguage(lang) {
  Store.set('rf_lang', lang);
  // Apply translations to elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = t(key);
    else el.textContent = t(key);
  });
  // Update lang toggle
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  showToast(lang === 'en' ? '🇬🇧 Language: English' : '🇵🇪 Idioma: Español', 'info', 1500);
}

function initLanguage() {
  setLanguage(Store.get('rf_lang', 'es'));
}

/* =============================================
   EXPORTAR PDF (reservas del usuario)
   ============================================= */
function exportReservationsPDF() {
  const user = Auth.getUser();
  if (!user) { showToast('Inicia sesión primero', 'warning'); return; }

  const reservations = Store.get('rf_reservations', []).filter(r => r.userId === user.id);
  const savings      = getUserSavings(user.id);
  const rescued      = reservations.reduce((s,r) => s + (r.items||[]).reduce((ss,i) => ss + (i.qty||1), 0), 0);

  // Open print window with styled HTML
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>REFOOD PERÚ — Historial de ${escapeHTML(user.name)}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:Arial,sans-serif; color:#1a2e22; padding:2rem; max-width:800px; margin:0 auto; }
  .header { text-align:center; padding:1.5rem; background:linear-gradient(135deg,#0d2b1a,#1a9e5c); color:#fff; border-radius:12px; margin-bottom:2rem; }
  .logo { font-size:2rem; font-weight:900; margin-bottom:.3rem; }
  .subtitle { opacity:.8; font-size:.95rem; }
  .user-name { font-size:1.4rem; font-weight:700; margin:.8rem 0 .2rem; }
  .summary { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-bottom:2rem; }
  .summary-box { background:#f7fbf9; border:1px solid #d1f5e3; border-radius:8px; padding:1rem; text-align:center; }
  .summary-num { font-size:1.8rem; font-weight:900; color:#0d6e3e; }
  .summary-lbl { font-size:.8rem; color:#5a7060; margin-top:.2rem; }
  table { width:100%; border-collapse:collapse; margin-bottom:1.5rem; }
  th { background:#1a9e5c; color:#fff; padding:.6rem .8rem; text-align:left; font-size:.85rem; }
  td { padding:.6rem .8rem; border-bottom:1px solid #e8f5ee; font-size:.85rem; }
  tr:nth-child(even) td { background:#f7fbf9; }
  .footer { text-align:center; padding:1rem; color:#6b8070; font-size:.8rem; border-top:1px solid #d1f5e3; margin-top:2rem; }
  .green { color:#0d6e3e; font-weight:700; }
  @media print { body { padding:.5rem; } }
</style>
</head>
<body>
<div class="header">
  <div class="logo">🌿 REFOOD PERÚ</div>
  <div class="subtitle">Historial de reservas y ahorro</div>
  <div class="user-name">${escapeHTML(user.name)}</div>
  <div style="font-size:.85rem;opacity:.75;">${user.email} · Generado ${new Date().toLocaleDateString('es-PE',{day:'2-digit',month:'long',year:'numeric'})}</div>
</div>

<div class="summary">
  <div class="summary-box">
    <div class="summary-num">${reservations.length}</div>
    <div class="summary-lbl">Total de reservas</div>
  </div>
  <div class="summary-box">
    <div class="summary-num">${formatCurrency(savings.totalSaved)}</div>
    <div class="summary-lbl">Dinero ahorrado</div>
  </div>
  <div class="summary-box">
    <div class="summary-num">${rescued}</div>
    <div class="summary-lbl">Productos rescatados</div>
  </div>
</div>

<h3 style="margin-bottom:.8rem;color:#0d2b1a;">📋 Detalle de reservas</h3>
${reservations.length === 0 ? '<p style="color:#6b8070;padding:1rem 0;">Aún no tienes reservas.</p>' : `
<table>
  <thead><tr><th>Código</th><th>Fecha</th><th>Productos</th><th>Total</th><th>Estado</th></tr></thead>
  <tbody>
    ${reservations.slice().reverse().map(r => `
      <tr>
        <td><strong>#${r.id.slice(1,7).toUpperCase()}</strong></td>
        <td>${new Date(r.createdAt).toLocaleDateString('es-PE')}</td>
        <td>${(r.items||[]).map(i=>escapeHTML(i.name||'')).join(', ')}</td>
        <td class="green">${formatCurrency(r.total)}</td>
        <td>${r.status||'confirmada'}</td>
      </tr>`).join('')}
  </tbody>
</table>`}

<div class="footer">
  🌱 Gracias por rescatar alimentos con REFOOD PERÚ · Lima, Perú · ${new Date().getFullYear()}
</div>
</body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

/* =============================================
   CHAT IA (Recomendaciones)
   ============================================= */
function getAIRecommendations() {
  const user  = Auth.getUser();
  const favs  = Store.get('rf_favorites', []);
  const cart  = Store.get('rf_cart', []);
  const resv  = Store.get('rf_reservations', []).filter(r => r.userId === user?.id);
  const offers = Store.get('rf_offers', []).filter(o => o.active !== false);

  // Simple recommendation logic based on history
  const boughtCats = {};
  resv.forEach(r => (r.items||[]).forEach(i => {
    const o = offers.find(x => x.id === i.offerId);
    if (o) boughtCats[o.category] = (boughtCats[o.category]||0) + 1;
  }));

  const favOffers = offers.filter(o => favs.includes(o.id));
  const topCat    = Object.entries(boughtCats).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const recs      = topCat
    ? offers.filter(o => o.category === topCat && !cart.find(c=>c.offerId===o.id)).slice(0,3)
    : offers.sort((a,b) => discountPct(b.originalPrice,b.discountPrice) - discountPct(a.originalPrice,a.discountPrice)).slice(0,3);

  return { topCat, recs, favOffers };
}

/* =============================================
   RETO MENSUAL COLECTIVO
   ============================================= */
function getMonthlyChallenge() {
  const reservations = Store.get('rf_reservations', []);
  const thisMonth    = new Date().getMonth();
  const thisYear     = new Date().getFullYear();

  const monthRes = reservations.filter(r => {
    const d = new Date(r.createdAt);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const rescued  = monthRes.reduce((s,r) => s + (r.items||[]).reduce((ss,i) => ss + (i.qty||1), 0), 0);
  const goal     = 10000; // kg objetivo del mes
  const progress = Math.min(100, (rescued / goal) * 100);

  const days = new Date(thisYear, thisMonth + 1, 0).getDate();
  const today = new Date().getDate();
  const daysLeft = days - today;

  return {
    rescued,
    goal,
    progress,
    daysLeft,
    monthName: new Date().toLocaleDateString('es-PE', {month:'long', year:'numeric'})
  };
}

/* =============================================
   PRECIO COMPARADOR (2 productos)
   ============================================= */
function compareOffers(id1, id2) {
  const offers = Store.get('rf_offers', []);
  const o1 = offers.find(o => o.id === id1);
  const o2 = offers.find(o => o.id === id2);
  if (!o1 || !o2) return null;

  return {
    o1, o2,
    winner: discountPct(o1.originalPrice, o1.discountPrice) > discountPct(o2.originalPrice, o2.discountPrice) ? 'o1' : 'o2',
    diff:   Math.abs(o1.discountPrice - o2.discountPrice),
  };
}

/* =============================================
   DIARIO DE IMPACTO (calendario)
   ============================================= */
function buildImpactCalendar(userId) {
  const reservations = Store.get('rf_reservations',[]).filter(r => r.userId === userId);
  const dates = new Set(reservations.map(r => new Date(r.createdAt).toISOString().split('T')[0]));
  return dates;
}

function renderImpactCalendar(containerId, userId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const activeDates = buildImpactCalendar(userId);
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();
  const days  = new Date(year, month+1, 0).getDate();
  const first = new Date(year, month, 1).getDay();
  const monthName = now.toLocaleDateString('es-PE',{month:'long',year:'numeric'});

  const dayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const blanks   = Array.from({length:first}, () => `<div></div>`).join('');

  const dayCells = Array.from({length:days}, (_,i) => {
    const d      = new Date(year, month, i+1);
    const key    = d.toISOString().split('T')[0];
    const active = activeDates.has(key);
    const today  = d.toDateString() === now.toDateString();
    return `<div style="
      width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;
      font-size:.78rem;font-weight:${today?'900':'500'};cursor:default;
      background:${active?'var(--primary)':'transparent'};
      color:${active?'#fff':today?'var(--primary-dark)':'var(--text-muted)'};
      border:${today&&!active?'2px solid var(--primary)':'none'};
      title='${active?'¡Rescataste hoy!':''}'
    ">${i+1}${active?'':''}</div>`;
  }).join('');

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:.8rem;font-family:var(--font-display);font-weight:700;text-transform:capitalize;">
      📅 ${monthName}
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,32px);gap:.3rem;justify-content:center;">
      ${dayNames.map(d=>`<div style="text-align:center;font-size:.7rem;font-weight:700;color:var(--text-muted);">${d}</div>`).join('')}
      ${blanks}${dayCells}
    </div>
    <div style="display:flex;gap:1rem;justify-content:center;margin-top:.8rem;font-size:.75rem;color:var(--text-muted);">
      <span><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--primary);margin-right:.3rem;vertical-align:middle;"></span>Día con rescate</span>
      <span>Total: <strong style="color:var(--primary-dark);">${activeDates.size} días</strong></span>
    </div>`;
}

/* =============================================
   FOTO DE PERFIL (usuarios y negocios)
   ============================================= */

// Lee un archivo de imagen, lo redimensiona/comprime y devuelve un dataURL (base64)
function readAndResizeImage(file, maxSize, callback) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Selecciona un archivo de imagen válido', 'warning');
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    showToast('La imagen es demasiado pesada (máx. 8MB)', 'warning');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        if (width > height) { height = Math.round(height * (maxSize / width)); width = maxSize; }
        else { width = Math.round(width * (maxSize / height)); height = maxSize; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => showToast('No se pudo leer la imagen', 'error');
    img.src = e.target.result;
  };
  reader.onerror = () => showToast('No se pudo leer el archivo', 'error');
  reader.readAsDataURL(file);
}

// Guarda la foto de perfil del usuario actual
function setUserPhoto(dataUrl) {
  const user = Auth.getUser();
  if (!user) return;
  const users = Store.get('rf_users', []);
  const idx = users.findIndex(u => u.id === user.id);
  if (idx !== -1) { users[idx].photo = dataUrl; Store.set('rf_users', users); }
  Store.set('rf_current_user', { ...user, photo: dataUrl });
  if (typeof renderNavbar === 'function') renderNavbar();
  showToast('Foto de perfil actualizada ✅', 'success');
}

// Guarda la foto del negocio actual (logo)
function setBusinessPhoto(dataUrl) {
  const biz = Auth.getBusiness();
  if (!biz) return;
  const accounts = Store.get('rf_businesses_accounts', []);
  const idx = accounts.findIndex(b => b.id === biz.id);
  if (idx !== -1) { accounts[idx].photo = dataUrl; Store.set('rf_businesses_accounts', accounts); }
  const publicBiz = Store.get('rf_businesses_public', []);
  const pIdx = publicBiz.findIndex(b => b.id === biz.id);
  if (pIdx !== -1) { publicBiz[pIdx].photo = dataUrl; Store.set('rf_businesses_public', publicBiz); }
  Store.set('rf_current_business', { ...biz, photo: dataUrl });
  showToast('Foto del negocio actualizada ✅', 'success');
}

// Engancha un <input type="file"> a un selector de avatar circular dado
function bindPhotoInput(inputId, onResult, maxSize = 400) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (file) readAndResizeImage(file, maxSize, onResult);
    input.value = '';
  });
}

/* =============================================
   INIT EXTRAS
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initColorBlindMode();
  initLanguage();
  // Scroll animations (only on non-map pages)
  const page = window.location.pathname.split('/').pop() || '';
  if (!page.includes('mapa')) {
    setTimeout(initScrollAnimations, 300);
  }
});
