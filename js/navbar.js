/* =============================================
   REFOOD PERÚ — navbar.js  v6 FINAL
   ============================================= */
'use strict';

(function injectNavbar() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const active = (href) => page === href ? 'class="active"' : '';

  const navHTML = `
<nav class="navbar" id="main-navbar">
  <div class="nav-container">
    <a href="index.html" class="nav-logo">
      <div class="logo-icon">🌿</div>
      REFOOD <span>PERÚ</span>
    </a>
    <ul class="nav-links">
      <li><a href="index.html"             ${active('index.html')}>Inicio</a></li>
      <li><a href="ofertas.html"           ${active('ofertas.html')}>Ofertas</a></li>
      <li><a href="mapa.html"              ${active('mapa.html')}>Mapa</a></li>
      <li><a href="impacto-ambiental.html" ${active('impacto-ambiental.html')}>Impacto</a></li>
      <li><a href="ranking.html"           ${active('ranking.html')}>Ranking</a></li>
      <li><a href="blog.html"              ${active('blog.html')}>Blog</a></li>
      <li><a href="herramientas.html"      ${active('herramientas.html')}>Herramientas</a></li>
      <li><a href="login-negocio.html"     ${active('login-negocio.html')}>Soy Negocio</a></li>
    </ul>
    <div id="nav-auth-zone" class="nav-actions"></div>
    <div class="notif-wrap" id="notif-wrap" style="position:relative;">
      <button class="notif-bell" onclick="toggleNotifPanel()" title="Notificaciones">
        🔔<span class="notif-dot" id="notif-dot"></span>
      </button>
      <div class="notif-panel" id="notif-panel" style="display:none;">
        <div class="notif-head">
          <span>🔔 Notificaciones</span>
          <span style="font-size:.78rem;cursor:pointer;" onclick="markAllRead()">Marcar leído</span>
        </div>
        <div id="notif-list"></div>
      </div>
    </div>
    <button class="nav-cart-btn" onclick="window.location='carrito.html'" title="Carrito" style="position:relative;">
      🛒<span class="cart-badge" id="cart-badge"></span>
    </button>
    <button class="theme-toggle" id="theme-toggle" onclick="toggleTheme()" title="Cambiar tema">🌙</button>
    <button class="hamburger" id="hamburger-btn" aria-label="Menú">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="mobile-menu" id="mobile-menu">
  <a href="index.html">🏠 Inicio</a>
  <a href="ofertas.html">🛍️ Ofertas</a>
  <a href="mapa.html">🗺️ Mapa</a>
  <a href="mapa-calor.html">🌡️ Mapa de Calor</a>
  <a href="impacto-ambiental.html">🌱 Impacto</a>
  <a href="resenas.html">⭐ Reseñas</a>
  <a href="ranking.html">🏆 Ranking</a>
  <a href="blog.html">📰 Blog</a>
  <a href="herramientas.html">🛠️ Herramientas</a>
  <a href="login-negocio.html">🏪 Soy Negocio</a>
  <a href="login.html">🔑 Ingresar</a>
  <a href="registro.html">✨ Registrarse</a>
</div>`;

  document.body.insertAdjacentHTML('afterbegin', navHTML);
})();
