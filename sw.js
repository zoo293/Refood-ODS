/* =============================================
   REFOOD PERÚ — Service Worker v6
   PWA offline support — todas las páginas
   ============================================= */

const CACHE_NAME  = 'refood-v6';
const OFFLINE_URL = '404.html';

const STATIC_ASSETS = [
  '/',
  'index.html','ofertas.html','carrito.html','favoritos.html',
  'mapa.html','mapa-calor.html','perfil.html','impacto-ambiental.html',
  'resenas.html','ranking.html','blog.html','herramientas.html',
  'login.html','registro.html','login-negocio.html','registro-negocio.html',
  'panel-negocio.html','404.html','manifest.json',
  'css/styles.css',
  'js/app.js','js/auth.js','js/ofertas.js','js/carrito.js',
  'js/mapa.js','js/negocios.js','js/navbar.js','js/extras.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(OFFLINE_URL));
    })
  );
});

self.addEventListener('push', e => {
  const data    = e.data ? e.data.json() : {};
  const options = {
    body:    data.body || '¡Nuevas ofertas disponibles en REFOOD PERÚ!',
    icon:    '/icon-192.png',
    badge:   '/badge-72.png',
    vibrate: [100, 50, 100],
    data:    { url: data.url || '/ofertas.html' },
    actions: [
      { action:'view',    title:'🛍️ Ver oferta' },
      { action:'dismiss', title:'Cerrar' }
    ]
  };
  e.waitUntil(self.registration.showNotification(data.title || 'REFOOD PERÚ', options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action !== 'dismiss') {
    e.waitUntil(clients.openWindow(e.notification.data?.url || '/ofertas.html'));
  }
});
