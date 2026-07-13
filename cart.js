/* ================================================
   FocusLab — Gestion du panier (localStorage)
   ================================================ */

const CART_KEY = 'focuslab_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id, name, price, imgClass) {
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty += 1; }
  else { cart.push({ id, name, price, imgClass, qty: 1 }); }
  saveCart(cart);
  showToast('Ajouté au panier !');
  /* BOS — Umami funnel event. Defensif, jamais bloquant. Ajout 02/07/2026. */
  try { if (window.umami && typeof umami.track === 'function') umami.track('add_to_cart', { produit: name, prix: Number(price || 0), boutique: 'focuslab' }); } catch (e) {}
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

function clearCart() { saveCart([]); }

function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function updateCartUI() {
  const count = cartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span></span>`;
    document.body.appendChild(t);
  }
  t.querySelector('span').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ---- Header scroll effect ---- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ---- Mobile menu ---- */
function initMobileMenu() {
  const btn = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  const close = document.querySelector('.mobile-menu__close');
  if (!btn || !menu) return;
  /* BOS 09/07/2026 — bloque défilement page robuste (mobile + desktop) */
  btn.addEventListener('click', () => { menu.classList.add('open'); btn.setAttribute('aria-expanded','true'); document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden'; document.body.style.position = 'fixed'; document.body.style.width = '100%'; });
  close && close.addEventListener('click', () => { menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); document.body.style.overflow = ''; document.documentElement.style.overflow = ''; document.body.style.position = ''; document.body.style.width = ''; });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); document.body.style.overflow = ''; document.documentElement.style.overflow = ''; document.body.style.position = ''; document.body.style.width = ''; }));
}

/* ---- Quantity selector ---- */
function initQtySelector() {
  const minusBtn = document.getElementById('qty-minus');
  const plusBtn  = document.getElementById('qty-plus');
  const display  = document.getElementById('qty-value');
  if (!minusBtn || !display) return;
  let qty = 1;
  minusBtn.addEventListener('click', () => { if(qty > 1) { qty--; display.textContent = qty; } });
  plusBtn.addEventListener('click',  () => { qty++; display.textContent = qty; });
  return { getQty: () => qty };
}

/* ---- Render cart page ---- */
function renderCartPage() {
  const itemsEl = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  if (!itemsEl) return;
  const cart = getCart();
  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    emptyEl && (emptyEl.style.display = 'block');
    document.getElementById('cart-subtotal') && (document.getElementById('cart-subtotal').textContent = '0,00 €');
    document.getElementById('cart-total') && (document.getElementById('cart-total').textContent = '0,00 €');
    return;
  }
  emptyEl && (emptyEl.style.display = 'none');
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__thumb ${item.imgClass || ''}">
        <div style="width:80px;height:80px;display:flex;align-items:center;justify-content:center;font-size:2rem;">${getProductEmoji(item.id)}</div>
      </div>
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">${(item.price).toFixed(2).replace('.',',')} €</div>
        <div style="font-size:.8rem;color:var(--text-light)">Qté : ${item.qty}</div>
      </div>
      <button class="cart-item__remove" onclick="removeFromCart('${item.id}'); renderCartPage();" aria-label="Supprimer">Supprimer</button>
    </div>
  `).join('');
  const subtotal = cartTotal();
  // BOS 13/07/2026 — La remise -10% annoncée par le bandeau n'était PAS appliquée sur FocusLab
  // (le client payait le plein tarif). Elle l'est désormais, comme sur les autres boutiques.
  // Source de vérité du calcul : window.BOS_PROMO.discount() (bos-promo.js) → même montant
  // que celui envoyé à PayPal et à Stripe.
  const discount = cartDiscount(cart);
  const total = Math.round((subtotal - discount) * 100) / 100;
  // BOS 13/07/2026 — le checkout CB (bos-stripe.js) facture EXACTEMENT ce total affiche.
  window.bosCartTotal = function(){ return total; };

  document.getElementById('cart-subtotal') && (document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2).replace('.',',') + ' €');

  const promoRow = document.getElementById('cart-promo-row');
  const promoEl  = document.getElementById('cart-discount');
  if (promoRow && promoEl) {
    promoRow.style.display = discount > 0 ? 'flex' : 'none';
    promoEl.textContent = '-' + discount.toFixed(2).replace('.', ',') + ' €';
  }

  const totalEl = document.getElementById('cart-total');
  if (totalEl) {
    if (discount > 0) {
      totalEl.innerHTML = '<span style="text-decoration:line-through;color:#9ca3af;font-size:.9em;margin-right:8px">' +
        subtotal.toFixed(2).replace('.', ',') + ' €</span><span style="color:#10b981">' +
        total.toFixed(2).replace('.', ',') + ' €</span>';
    } else {
      totalEl.textContent = total.toFixed(2).replace('.', ',') + ' €';
    }
  }
}

// -10% sur le produit le plus cher du panier (arrondi au centime).
// Identique à bos-promo.js / bos-paypal.js / bos-stripe.js : un seul et même montant partout.
function cartDiscount(cart) {
  if (window.BOS_PROMO && typeof window.BOS_PROMO.discount === 'function') {
    return window.BOS_PROMO.discount(cart);
  }
  if (!cart || !cart.length) return 0;
  let max = 0;
  cart.forEach(i => { const p = Number(i.price) || 0; if (p > max) max = p; });
  return max > 0 ? Math.round(max * 10) / 100 : 0;
}

function getProductEmoji(id) {
  const map = { 'barre-lumineuse': '🖥️', 'lampe-led': '💡', 'minuteur-pomodoro': '⏱️', 'support-laptop': '💻', 'tapis-bureau': '🖱️' };
  return map[id] || '📦';
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  updateCartUI();
  renderCartPage();

  /* "Ajouter au panier" buttons on product pages */
  const addBtn = document.getElementById('add-to-cart-btn');
  if (addBtn) {
    const qtyCtrl = initQtySelector();
    addBtn.addEventListener('click', () => {
      const productId    = addBtn.dataset.productId;
      const productName  = addBtn.dataset.productName;
      const productPrice = parseFloat(addBtn.dataset.productPrice);
      const imgClass     = addBtn.dataset.imgClass || '';
      const qty = qtyCtrl ? qtyCtrl.getQty() : 1;
      for (let i = 0; i < qty; i++) addToCart(productId, productName, productPrice, imgClass);
    });
  }

  /* Email capture — Web3Forms (AJAX) */
  initEmailForms();
});

/* ---- Email capture forms (Web3Forms) ---- */
function initEmailForms() {
  document.querySelectorAll('.w3-email-form').forEach(form => {
    const consent = form.querySelector('input[name="consent"]');
    const btn = form.querySelector('button[type="submit"]');

    /* Désactiver le bouton tant que le consentement RGPD n'est pas coché */
    if (consent && btn) {
      btn.disabled = !consent.checked;
      consent.addEventListener('change', () => { btn.disabled = !consent.checked; });
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (consent && !consent.checked) {
        showToast('Merci de cocher la case de consentement.');
        return;
      }
      const original = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          showFormSuccess(form);
        } else {
          if (btn) { btn.disabled = false; btn.textContent = original; }
          showToast('Oups, une erreur est survenue. Réessaie dans un instant.');
        }
      } catch (err) {
        if (btn) { btn.disabled = false; btn.textContent = original; }
        showToast('Connexion impossible. Vérifie ton réseau et réessaie.');
      }
    });
  });
}

function showFormSuccess(form) {
  const msg = document.createElement('div');
  msg.className = 'form-success';
  msg.innerHTML = "<strong>Merci ! Tu es inscrit(e) à la newsletter.</strong><br>Tu seras averti(e) en avant-première de nos prochains produits et offres.";
  form.parentNode.insertBefore(msg, form);
  form.style.display = 'none';
}

/* BOS — expose panier pour checkout PayPal cross-page (fix isolation cart multi-boutique, 01/07/2026) */
try { window.getCart = getCart; window.BOS_CART_KEY = CART_KEY; } catch (e) {}
