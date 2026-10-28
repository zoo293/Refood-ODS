/* =============================================
   REFOOD PERÚ — auth.js
   Autenticación de usuarios y negocios
   ============================================= */

'use strict';

// ─── REGISTRO DE USUARIO ─────────────────────────────────────
function initUserRegister() {
  const form = document.getElementById('form-register');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors(form);

    const name     = form.querySelector('#reg-name').value.trim();
    const email    = form.querySelector('#reg-email').value.trim().toLowerCase();
    const phone    = form.querySelector('#reg-phone').value.trim();
    const password = form.querySelector('#reg-password').value;
    const confirm  = form.querySelector('#reg-confirm').value;
    const terms    = form.querySelector('#reg-terms').checked;

    let valid = true;

    if (!name || name.length < 3)    { showFieldError('reg-name',     'Ingresa tu nombre completo (mín. 3 caracteres)'); valid = false; }
    if (!validateEmail(email))        { showFieldError('reg-email',    'Correo electrónico inválido'); valid = false; }
    if (!phone || phone.length < 9)   { showFieldError('reg-phone',    'Ingresa un teléfono válido (mín. 9 dígitos)'); valid = false; }
    if (password.length < 6)          { showFieldError('reg-password', 'La contraseña debe tener al menos 6 caracteres'); valid = false; }
    if (password !== confirm)         { showFieldError('reg-confirm',  'Las contraseñas no coinciden'); valid = false; }
    if (!terms)                       { showToast('Debes aceptar los términos y condiciones', 'warning'); valid = false; }

    if (!valid) return;

    const users = Store.get('rf_users', []);
    if (users.find(u => u.email === email)) {
      showFieldError('reg-email', 'Este correo ya está registrado');
      return;
    }

    const newUser = {
      id: generateId(), name, email, phone,
      password: btoa(password), // basic encoding (not production-safe)
      createdAt: new Date().toISOString(),
      avatar: null, address: '', district: ''
    };
    users.push(newUser);
    Store.set('rf_users', users);
    Store.set('rf_current_user', { id: newUser.id, name, email, phone, address: '', district: '' });

    showToast(`¡Bienvenido/a ${name}! 🎉`, 'success');
    setTimeout(() => window.location.href = 'ofertas.html', 1200);
  });
}

// ─── LOGIN DE USUARIO ────────────────────────────────────────
function initUserLogin() {
  const form = document.getElementById('form-login');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors(form);

    const email    = form.querySelector('#login-email').value.trim().toLowerCase();
    const password = form.querySelector('#login-password').value;

    if (!validateEmail(email)) { showFieldError('login-email', 'Correo inválido'); return; }
    if (!password)              { showFieldError('login-password', 'Ingresa tu contraseña'); return; }

    const users = Store.get('rf_users', []);
    const user  = users.find(u => u.email === email && atob(u.password) === password);

    if (!user) {
      showToast('Correo o contraseña incorrectos', 'error'); return;
    }

    Store.set('rf_current_user', { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address || '', district: user.district || '' });
    showToast(`¡Hola, ${user.name.split(' ')[0]}! 👋`, 'success');
    const redirect = new URLSearchParams(window.location.search).get('redirect') || 'ofertas.html';
    setTimeout(() => window.location.href = redirect, 900);
  });

  // Toggle password
  initPasswordToggle('login-password', 'toggle-login-pass');
}

// ─── REGISTRO DE NEGOCIO ─────────────────────────────────────
function initBusinessRegister() {
  const form = document.getElementById('form-biz-register');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors(form);

    const bizName  = form.querySelector('#biz-name').value.trim();
    const bizType  = form.querySelector('#biz-type').value;
    const address  = form.querySelector('#biz-address').value.trim();
    const phone    = form.querySelector('#biz-phone').value.trim();
    const email    = form.querySelector('#biz-email').value.trim().toLowerCase();
    const password = form.querySelector('#biz-password').value;
    const confirm  = form.querySelector('#biz-confirm').value;
    const ruc      = form.querySelector('#biz-ruc').value.trim();

    let valid = true;
    if (!bizName)                    { showFieldError('biz-name',     'Nombre del negocio requerido'); valid = false; }
    if (!bizType)                    { showFieldError('biz-type',     'Selecciona el tipo de negocio'); valid = false; }
    if (!address)                    { showFieldError('biz-address',  'Dirección requerida'); valid = false; }
    if (!phone || phone.length < 9)  { showFieldError('biz-phone',    'Teléfono inválido'); valid = false; }
    if (!validateEmail(email))       { showFieldError('biz-email',    'Correo inválido'); valid = false; }
    if (password.length < 6)         { showFieldError('biz-password', 'Mínimo 6 caracteres'); valid = false; }
    if (password !== confirm)        { showFieldError('biz-confirm',  'Las contraseñas no coinciden'); valid = false; }
    if (!ruc || ruc.length !== 11)   { showFieldError('biz-ruc',      'RUC debe tener 11 dígitos'); valid = false; }

    if (!valid) return;

    const accounts = Store.get('rf_businesses_accounts', []);
    if (accounts.find(b => b.email === email)) {
      showFieldError('biz-email', 'Este correo ya está registrado'); return;
    }

    // Leer coordenadas del selector de mapa (o usar Lima como fallback)
    const latVal = parseFloat(form.querySelector('#biz-lat')?.value) || -12.0464;
    const lngVal = parseFloat(form.querySelector('#biz-lng')?.value) || -77.0428;

    if (!form.querySelector('#biz-lat')?.value) {
      showToast('Selecciona la ubicación de tu negocio en el mapa 📌', 'warning');
      return;
    }

    const bizId = generateId();
    const newBiz = {
      id: bizId, name: bizName, type: bizType, address, phone, email,
      password: btoa(password), ruc, logo: '🏪', rating: 0, totalOffers: 0,
      lat: latVal, lng: lngVal, createdAt: new Date().toISOString(), active: true
    };
    accounts.push(newBiz);
    Store.set('rf_businesses_accounts', accounts);

    // Add to public list
    const publicBiz = Store.get('rf_businesses_public', []);
    publicBiz.push({ id: bizId, name: bizName, type: bizType, address, phone, email, logo: '🏪', rating: 0, totalOffers: 0, lat: latVal, lng: lngVal });
    Store.set('rf_businesses_public', publicBiz);

    Store.set('rf_current_business', { id: bizId, name: bizName, type: bizType, address, phone, email, lat: latVal, lng: lngVal });
    showToast(`¡Negocio "${bizName}" registrado! 🎉`, 'success');
    setTimeout(() => window.location.href = 'panel-negocio.html', 1200);
  });
}

// ─── LOGIN DE NEGOCIO ────────────────────────────────────────
function initBusinessLogin() {
  const form = document.getElementById('form-biz-login');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors(form);

    const email    = form.querySelector('#biz-login-email').value.trim().toLowerCase();
    const password = form.querySelector('#biz-login-password').value;

    if (!validateEmail(email)) { showFieldError('biz-login-email', 'Correo inválido'); return; }
    if (!password)              { showFieldError('biz-login-password', 'Contraseña requerida'); return; }

    const accounts = Store.get('rf_businesses_accounts', []);
    const biz = accounts.find(b => b.email === email && atob(b.password) === password);

    if (!biz) { showToast('Correo o contraseña incorrectos', 'error'); return; }

    const { password: _pw, ...bizSession } = biz;
    Store.set('rf_current_business', bizSession);
    showToast(`¡Bienvenido/a, ${biz.name}! 📊`, 'success');
    setTimeout(() => window.location.href = 'panel-negocio.html', 900);
  });
}

// ─── VALIDACIONES ─────────────────────────────────────────────
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function showFieldError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.add('error');
  const err = field.closest('.form-group')?.querySelector('.form-error');
  if (err) err.textContent = msg;
}

function clearErrors(form) {
  form.querySelectorAll('.form-control').forEach(f => f.classList.remove('error'));
  form.querySelectorAll('.form-error').forEach(e => e.textContent = '');
}

function initPasswordToggle(inputId, toggleId) {
  const input  = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);
  if (!input || !toggle) return;
  toggle.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
    toggle.textContent = input.type === 'password' ? '👁️' : '🙈';
  });
}

// ─── PROTEGER PÁGINAS ────────────────────────────────────────
function requireUser() {
  if (!Auth.isUser()) {
    const redirect = window.location.pathname.split('/').pop();
    window.location.href = `login.html?redirect=${redirect}`;
  }
}
function requireBusiness() {
  if (!Auth.isBusiness()) {
    window.location.href = 'login-negocio.html';
  }
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initUserRegister();
  initUserLogin();
  initBusinessRegister();
  initBusinessLogin();
});
