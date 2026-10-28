/* =============================================
   REFOOD PERÚ — carrito.js
   Gestión del carrito de compras
   ============================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  initConfirmModal();
});

// ─── RENDER CARRITO ──────────────────────────────────────────
function renderCart() {
  const cart    = Store.get('rf_cart', []);
  const wrapper = document.getElementById('cart-wrapper');
  const summary = document.getElementById('cart-summary');
  if (!wrapper) return;

  if (cart.length === 0) {
    wrapper.innerHTML = `
      <div class="cart-empty fade-in">
        <div class="cart-empty-icon">🛒</div>
        <h2 style="font-family:var(--font-display);font-size:1.4rem;margin-bottom:.5rem;">Tu carrito está vacío</h2>
        <p class="cart-empty-text">Explora nuestras ofertas y rescata alimentos a precios increíbles</p>
        <a href="ofertas.html" class="btn btn-primary">Ver Ofertas</a>
      </div>`;
    if (summary) summary.style.display = 'none';
    return;
  }

  if (summary) summary.style.display = '';

  let totalOriginal = 0, totalDiscount = 0;
  const offers = Store.get('rf_offers', []);

  const itemsHTML = cart.map(item => {
    const offer = offers.find(o => o.id === item.offerId);
    const originalPrice = offer ? offer.originalPrice * item.qty : item.price * item.qty;
    const discPrice = item.price * item.qty;
    totalOriginal += originalPrice;
    totalDiscount += discPrice;

    return `
    <div class="cart-item fade-in" data-cart-id="${item.offerId}">
      <div class="cart-item-img">
        <span style="font-size:2rem">${escapeHTML(item.emoji || '🍱')}</span>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${escapeHTML(item.name)}</div>
        <div class="cart-item-business">📍 ${escapeHTML(item.businessName)}</div>
        <div class="cart-item-price">${formatCurrency(item.price * item.qty)}</div>
        ${offer ? `<div style="font-size:.75rem;color:var(--text-light);text-decoration:line-through">${formatCurrency(originalPrice)}</div>` : ''}
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn" onclick="changeQty('${item.offerId}',-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.offerId}',1)">+</button>
        <span class="cart-remove" onclick="removeFromCart('${item.offerId}')" title="Eliminar">🗑️</span>
      </div>
    </div>`;
  }).join('');

  wrapper.innerHTML = `
    <div class="cart-items">${itemsHTML}</div>
    <button class="btn btn-ghost btn-sm" onclick="clearCart()" style="margin-top:.5rem;color:var(--danger)">
      🗑️ Vaciar carrito
    </button>`;

  const saved = totalOriginal - totalDiscount;

  if (summary) {
    summary.innerHTML = `
      <h3 class="cart-summary-title">Resumen del pedido</h3>
      <div class="summary-row">
        <span>Subtotal original</span>
        <span style="text-decoration:line-through;color:var(--text-light)">${formatCurrency(totalOriginal)}</span>
      </div>
      <div class="summary-row">
        <span>Descuento total</span>
        <span class="summary-save">-${formatCurrency(saved)}</span>
      </div>
      <div class="summary-row" style="margin-top:.5rem;padding-top:.7rem;border-top:2px solid var(--border);">
        <span class="fw-700">Total a pagar</span>
        <span class="summary-total">${formatCurrency(totalDiscount)}</span>
      </div>
      <div style="background:var(--primary-light);border-radius:var(--radius-sm);padding:.8rem;margin:1rem 0;text-align:center;">
        <span style="font-size:.85rem;color:var(--primary-dark);font-weight:600;">
          🌱 Ahorras ${formatCurrency(saved)} y rescatas ${cart.length} producto${cart.length > 1 ? 's' : ''}
        </span>
      </div>
      <button class="btn btn-primary btn-full" onclick="openModal('confirm-modal')">
        ✅ Confirmar Reserva
      </button>
      <a href="ofertas.html" class="btn btn-secondary btn-full mt-2">← Seguir comprando</a>`;
  }
}

// ─── CAMBIAR CANTIDAD ─────────────────────────────────────────
function changeQty(offerId, delta) {
  let cart = Store.get('rf_cart', []);
  const idx = cart.findIndex(i => i.offerId === offerId);
  if (idx === -1) return;
  cart[idx].qty = Math.max(1, (cart[idx].qty || 1) + delta);
  Store.set('rf_cart', cart);
  renderCart();
}

// ─── ELIMINAR ITEM ────────────────────────────────────────────
function removeFromCart(offerId) {
  let cart = Store.get('rf_cart', []);
  cart = cart.filter(i => i.offerId !== offerId);
  Store.set('rf_cart', cart);
  showToast('Producto eliminado del carrito', 'info');
  renderCart();
  updateCartBadge();
}

// ─── VACIAR CARRITO ───────────────────────────────────────────
function clearCart() {
  if (!confirm('¿Seguro que quieres vaciar el carrito?')) return;
  Store.set('rf_cart', []);
  showToast('Carrito vaciado', 'info');
  renderCart();
  updateCartBadge();
}

function updateCartBadge() {
  const cart  = Store.get('rf_cart', []);
  const badge = document.getElementById('cart-badge');
  const total = cart.reduce((s,i) => s + (i.qty||1), 0);
  if (badge) { badge.textContent = total; badge.classList.toggle('show', total > 0); }
}

// ─── CONFIRMAR RESERVA ────────────────────────────────────────
function initConfirmModal() {
  const btn = document.getElementById('btn-confirm-reservation');
  if (!btn) return;
  btn.addEventListener('click', confirmReservation);
}

function confirmReservation() {
  const user = Auth.getUser();
  if (!user) { window.location.href = 'login.html'; return; }

  const cart = Store.get('rf_cart', []);
  if (!cart.length) return;

  const total = cart.reduce((s,i) => s + i.price * (i.qty||1), 0);
  const reservation = {
    id: generateId(),
    userId: user.id,
    items: cart,
    total,
    status: 'confirmada',
    createdAt: new Date().toISOString(),
  };

  const reservations = Store.get('rf_reservations', []);
  reservations.push(reservation);
  Store.set('rf_reservations', reservations);

  // Update environmental impact
  const impact = Store.get('rf_impact', { rescued: 0, co2: 0, water: 0 });
  impact.rescued += cart.reduce((s,i) => s + (i.qty||1), 0);
  impact.co2     += cart.reduce((s,i) => s + (i.qty||1), 0) * 0.5;
  impact.water   += cart.reduce((s,i) => s + (i.qty||1), 0) * 150;
  Store.set('rf_impact', impact);

  Store.set('rf_cart', []);
  closeModal('confirm-modal');
  updateCartBadge();

  // 🎉 Confetti + QR Code
  if (typeof launchConfetti === 'function') launchConfetti(4000);
  setTimeout(() => {
    if (typeof showReservationQR === 'function') showReservationQR(reservation.id, total);
  }, 600);
  setTimeout(() => {
    document.getElementById('cart-wrapper').innerHTML = `
      <div class="cart-empty fade-in" style="text-align:center;padding:3rem 2rem;">
        <div style="font-size:4rem;margin-bottom:1rem;">🎉</div>
        <h2 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:.6rem;color:var(--primary-dark)">
          ¡Reserva Confirmada!
        </h2>
        <p style="color:var(--text-muted);max-width:380px;margin:0 auto 1.5rem;line-height:1.7">
          Muestra este mensaje al llegar al local. Tienes 2 horas para recoger tus productos.
        </p>
        <div style="background:var(--primary-light);border-radius:var(--radius-md);padding:1.2rem;display:inline-block;margin-bottom:1.5rem;">
          <strong style="color:var(--primary-dark)">Código de reserva: #${reservation.id.slice(1,7).toUpperCase()}</strong>
        </div>
        <br>
        <a href="ofertas.html" class="btn btn-primary">Ver más ofertas</a>
        <a href="impacto-ambiental.html" class="btn btn-secondary mt-2">🌱 Ver mi impacto</a>
      </div>`;
    if (document.getElementById('cart-summary')) document.getElementById('cart-summary').style.display = 'none';
  }, 400);
}
