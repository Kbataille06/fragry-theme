/*
  FRAGRY — Mini Cart Global JS
  Vanilla JS, zero dependencies.
  - Ouvre/ferme le drawer latéral
  - Mise à jour AJAX du panier (quantités, suppression)
  - Barre sticky mobile (affichée si panier non vide)
  - Déclenché par l'évènement custom 'fragry:cart:open'
*/

(function () {
  'use strict';

  /* ── Éléments DOM ── */
  var drawer   = document.getElementById('km-mini-cart');
  var overlay  = document.getElementById('km-cart-overlay');
  var closeBtn = document.getElementById('km-mini-cart-close');
  var cartBar  = document.getElementById('km-cart-bar');
  var barToggle = document.getElementById('km-cart-bar-toggle');

  if (!drawer) return; // snippet non rendu

  /* ──────────────────────────────────────────
     OPEN / CLOSE
  ────────────────────────────────────────── */
  function openCart() {
    drawer.classList.add('km-mini-cart--open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('km-cart-overlay--visible');
    document.body.style.overflow = 'hidden';

    // Barre mobile : indiquer état ouvert
    if (cartBar) {
      cartBar.classList.add('km-cart-bar--open');
      if (barToggle) barToggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeCart() {
    drawer.classList.remove('km-mini-cart--open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('km-cart-overlay--visible');
    document.body.style.overflow = '';

    if (cartBar) {
      cartBar.classList.remove('km-cart-bar--open');
      if (barToggle) barToggle.setAttribute('aria-expanded', 'false');
    }
  }

  /* Fermeture */
  if (closeBtn)  closeBtn.addEventListener('click', closeCart);
  if (overlay)   overlay.addEventListener('click', closeCart);

  /* Touche Échap */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('km-mini-cart--open')) {
      closeCart();
    }
  });

  /* Évènement global déclenché par les boutons "Add to Cart" */
  document.addEventListener('fragry:cart:open', openCart);

  /* Clic sur l'icône panier dans le header */
  document.addEventListener('click', function (e) {
    var headerCartBtn = e.target.closest('#km-header-cart-btn, #km-drawer-cart-btn, .km-mini-cart__open-btn');
    if (headerCartBtn) {
      e.preventDefault();
      openCart();
    }
  });

  /* Barre mobile */
  if (barToggle) {
    barToggle.addEventListener('click', function () {
      if (drawer.classList.contains('km-mini-cart--open')) {
        closeCart();
      } else {
        openCart();
      }
    });
  }

  /* ──────────────────────────────────────────
     BARRE MOBILE — afficher/masquer selon contenu
  ────────────────────────────────────────── */
  function updateCartBar(itemCount, totalPrice) {
    if (!cartBar) return;
    var isMobile = window.innerWidth <= 768;

    if (isMobile && itemCount > 0) {
      cartBar.style.display = 'block';
    } else {
      cartBar.style.display = 'none';
    }

    // Mettre à jour les valeurs affichées
    var countEl = document.getElementById('km-cart-bar-count');
    var totalEl = document.getElementById('km-cart-bar-total');
    if (countEl) countEl.textContent = itemCount;
    if (totalEl && totalPrice !== undefined) {
      // Shopify renvoie le prix en centimes, on formate
      totalEl.textContent = formatMoney(totalPrice);
    }
  }

  // Initialisation au chargement de la page
  (function initCartBar() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        updateCartBar(cart.item_count, cart.total_price);
        updateHeaderCount(cart.item_count);
      })
      .catch(function () {});
  })();

  /* ──────────────────────────────────────────
     MISE À JOUR DU DRAWER (rechargement AJAX)
  ────────────────────────────────────────── */
  function refreshCartDrawer() {
    drawer.classList.add('km-mini-cart--updating');

    return fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        updateCartUI(cart);
        return cart;
      })
      .catch(function (err) {
        console.warn('[Fragry] cart refresh error', err);
      })
      .finally(function () {
        drawer.classList.remove('km-mini-cart--updating');
      });
  }

  function updateCartUI(cart) {
    var body   = document.getElementById('km-cart-body');
    var footer = document.getElementById('km-cart-footer');
    var badge  = document.getElementById('km-cart-count-badge');
    var total  = document.getElementById('km-cart-total');

    // Badge count dans le titre du drawer
    if (badge) badge.textContent = cart.item_count;

    // Compteur header
    updateHeaderCount(cart.item_count);

    // Barre mobile
    updateCartBar(cart.item_count, cart.total_price);

    // Total footer
    if (total) total.textContent = formatMoney(cart.total_price);

    // Footer visibility
    if (footer) {
      footer.style.display = cart.item_count > 0 ? 'flex' : 'none';
    }

    // Rebuild items list
    if (!body) return;

    if (cart.item_count === 0) {
      body.innerHTML = buildEmptyState();
      return;
    }

    body.innerHTML = buildItemsList(cart.items);

    // Rebind events
    bindCartEvents();
  }

  function buildEmptyState() {
    return '<div class="km-mini-cart__empty">' +
      '<div class="km-mini-cart__empty-icon">' +
        '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>' +
          '<line x1="3" y1="6" x2="21" y2="6"/>' +
          '<path d="M16 10a4 4 0 0 1-8 0"/>' +
        '</svg>' +
      '</div>' +
      '<p class="km-mini-cart__empty-msg">Votre panier est vide</p>' +
      '<a href="/collections/all" class="km-btn km-btn--ghost km-mini-cart__shop-link" style="display:flex;justify-content:center;">D\u00e9couvrir nos fragrances</a>' +
    '</div>';
  }

  function buildItemsList(items) {
    var html = '<ul class="km-mini-cart__items" id="km-cart-items-list" aria-label="Articles dans le panier">';

    items.forEach(function (item, idx) {
      var lineIndex = idx + 1;
      var imgHtml = item.featured_image && item.featured_image.url
        ? '<img src="' + item.featured_image.url + '&width=120" alt="' + escHtml(item.title) + '" width="60" height="80" loading="lazy">'
        : '<div style="width:100%;height:100%;background:#2a2a2a;"></div>';

      var variantHtml = item.variant_title && item.variant_title !== 'Default Title'
        ? '<span class="km-mini-cart__item-variant">' + escHtml(item.variant_title) + '</span>'
        : '';

      var vendorHtml = item.vendor
        ? '<span class="km-mini-cart__item-vendor">' + escHtml(item.vendor) + '</span>'
        : '';

      html +=
        '<li class="km-mini-cart__item" data-line="' + lineIndex + '" data-variant-id="' + item.variant_id + '">' +
          '<div class="km-mini-cart__item-img">' + imgHtml + '</div>' +
          '<div class="km-mini-cart__item-info">' +
            vendorHtml +
            '<a href="' + item.url + '" class="km-mini-cart__item-title">' + escHtml(item.title) + '</a>' +
            variantHtml +
            '<div class="km-mini-cart__item-row">' +
              '<div class="km-mini-cart__qty" role="group" aria-label="Quantit\u00e9">' +
                '<button type="button" class="km-mini-cart__qty-btn" data-qty-minus aria-label="Diminuer">−</button>' +
                '<span class="km-mini-cart__qty-val" aria-live="polite">' + item.quantity + '</span>' +
                '<button type="button" class="km-mini-cart__qty-btn" data-qty-plus aria-label="Augmenter">+</button>' +
              '</div>' +
              '<span class="km-mini-cart__item-price">' + formatMoney(item.final_line_price) + '</span>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="km-mini-cart__item-remove" data-remove-line="' + lineIndex + '" aria-label="Supprimer">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 18L18 6M6 6l12 12"/></svg>' +
          '</button>' +
        '</li>';
    });

    html += '</ul>';
    return html;
  }

  /* ──────────────────────────────────────────
     EVENTS SUR LES ITEMS (quantité, suppression)
  ────────────────────────────────────────── */
  function bindCartEvents() {
    var body = document.getElementById('km-cart-body');
    if (!body) return;

    // Délégation sur le body du drawer
    body.addEventListener('click', function (e) {
      var item = e.target.closest('.km-mini-cart__item');
      if (!item) return;

      var line = parseInt(item.dataset.line, 10);

      // Bouton remove
      if (e.target.closest('[data-remove-line]')) {
        updateLine(line, 0);
        return;
      }

      // Bouton +
      if (e.target.closest('[data-qty-plus]')) {
        var qtyEl = item.querySelector('.km-mini-cart__qty-val');
        var current = parseInt(qtyEl ? qtyEl.textContent : '1', 10);
        updateLine(line, current + 1);
        return;
      }

      // Bouton -
      if (e.target.closest('[data-qty-minus]')) {
        var qtyEl2 = item.querySelector('.km-mini-cart__qty-val');
        var cur = parseInt(qtyEl2 ? qtyEl2.textContent : '1', 10);
        if (cur > 1) {
          updateLine(line, cur - 1);
        } else {
          updateLine(line, 0);
        }
        return;
      }
    });
  }

  // Appel initial pour binder les items déjà dans le DOM (rendu Liquid)
  bindCartEvents();

  function updateLine(line, qty) {
    drawer.classList.add('km-mini-cart--updating');
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: line, quantity: qty })
    })
    .then(function (r) { return r.json(); })
    .then(function (cart) {
      updateCartUI(cart);
    })
    .catch(function (err) {
      console.warn('[Fragry] updateLine error', err);
    })
    .finally(function () {
      drawer.classList.remove('km-mini-cart--updating');
    });
  }

  /* ──────────────────────────────────────────
     ADD TO CART global (déclenché par Best Sellers et autres sections)
  ────────────────────────────────────────── */
  window.fragryAddToCart = function (variantId, btn) {
    if (!variantId || (btn && btn.disabled)) return;

    if (btn) {
      btn.disabled = true;
      btn.classList.add('km-product-card__add-btn--loading');
      // Afficher spinner
      var icon = btn.querySelector('[data-state="idle"]');
      if (icon) {
        icon.innerHTML = '<span class="km-spinner" aria-hidden="true"></span>';
      }
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    })
    .then(function (res) {
      if (!res.ok) throw new Error('add-to-cart failed');
      return res.json();
    })
    .then(function () {
      return refreshCartDrawer();
    })
    .then(function () {
      if (btn) {
        btn.classList.remove('km-product-card__add-btn--loading');
        btn.classList.add('km-product-card__add-btn--added');
        // Icône check
        var icon2 = btn.querySelector('[data-state="idle"]');
        if (icon2) {
          icon2.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
        }
        btn.setAttribute('aria-label', 'Ajout\u00e9 au panier !');

        // Ouvrir le mini-cart
        openCart();

        setTimeout(function () {
          btn.classList.remove('km-product-card__add-btn--added');
          btn.disabled = false;
          btn.setAttribute('aria-label', 'Ajouter au panier');
          // Remettre icône panier
          if (icon2) {
            icon2.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
          }
        }, 2200);
      }
    })
    .catch(function () {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('km-product-card__add-btn--loading');
        var icon3 = btn.querySelector('[data-state="idle"]');
        if (icon3) {
          icon3.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
        }
      }
    });
  };

  /* ──────────────────────────────────────────
     HEADER — compteur du panier
  ────────────────────────────────────────── */
  function updateHeaderCount(count) {
    // Tous les badges dans le header
    document.querySelectorAll('.km-cart-count').forEach(function (el) {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  /* ──────────────────────────────────────────
     UTILITAIRES
  ────────────────────────────────────────── */
  function formatMoney(cents) {
    // Utilise Shopify.formatMoney si disponible, sinon formate manuellement
    if (window.Shopify && window.Shopify.formatMoney) {
      return window.Shopify.formatMoney(cents, '{{amount}} €');
    }
    var amount = (cents / 100).toFixed(2).replace('.', ',');
    return amount + '\u00a0\u20ac';
  }

  function escHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
