/*
  FRAGRY — Cart Page (/cart)
  Vanilla JS, zero dependencies.
  Progressively enhances the server-rendered cart form with live
  AJAX quantity updates and removals (falls back to normal form
  submission / url_to_remove links if this script fails to load).
*/

(function () {
  'use strict';

  var itemsList  = document.getElementById('km-cart-page-items');
  var form       = document.getElementById('km-cart-page-form');
  var subtotalEl = document.getElementById('km-cart-page-subtotal');

  if (!itemsList || !form) return;

  /* ── Empêcher la soumission accidentelle (touche Entrée) depuis un champ quantité ── */
  itemsList.addEventListener('keydown', function (e) {
    if (e.target.classList.contains('km-cart-page__qty-input') && e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  });

  /* ── Clics : +, -, supprimer ── */
  itemsList.addEventListener('click', function (e) {
    var row = e.target.closest('.km-cart-page__item');
    if (!row) return;

    var key = row.dataset.key;
    var qtyInput = row.querySelector('.km-cart-page__qty-input');

    if (e.target.closest('[data-qty-plus]')) {
      var next = (parseInt(qtyInput.value, 10) || 0) + 1;
      updateLine(key, next, row);
      return;
    }

    if (e.target.closest('[data-qty-minus]')) {
      var current = parseInt(qtyInput.value, 10) || 0;
      updateLine(key, current > 1 ? current - 1 : 0, row);
      return;
    }

    if (e.target.closest('[data-remove-line]')) {
      e.preventDefault();
      updateLine(key, 0, row);
      return;
    }
  });

  /* ── Saisie manuelle d'une quantité ── */
  itemsList.addEventListener('change', function (e) {
    if (!e.target.classList.contains('km-cart-page__qty-input')) return;
    var row = e.target.closest('.km-cart-page__item');
    var qty = Math.max(0, parseInt(e.target.value, 10) || 0);
    updateLine(row.dataset.key, qty, row);
  });

  function updateLine(key, quantity, row) {
    setLoading(row, true);

    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        handleCartUpdate(cart, key, quantity, row);
      })
      .catch(function (err) {
        console.warn('[Fragry] cart update error', err);
        setLoading(row, false);
      });
  }

  function handleCartUpdate(cart, key, quantity, row) {
    updateHeaderCount(cart.item_count);

    if (cart.item_count === 0) {
      window.location.reload();
      return;
    }

    if (quantity === 0) {
      row.remove();
    } else {
      var updated = null;
      for (var i = 0; i < cart.items.length; i++) {
        if (cart.items[i].key === key) { updated = cart.items[i]; break; }
      }
      if (updated) {
        var qtyInput = row.querySelector('.km-cart-page__qty-input');
        var totalEl = row.querySelector('[data-item-total]');
        if (qtyInput) qtyInput.value = updated.quantity;
        if (totalEl) totalEl.textContent = formatMoney(updated.final_line_price);
      }
      setLoading(row, false);
    }

    if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);
  }

  function setLoading(row, loading) {
    if (row) row.classList.toggle('km-cart-page__item--loading', loading);
  }

  function updateHeaderCount(count) {
    document.querySelectorAll('.km-cart-count').forEach(function (el) {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function formatMoney(cents) {
    if (window.Shopify && window.Shopify.formatMoney) {
      return window.Shopify.formatMoney(cents, '{{amount}} €');
    }
    return (cents / 100).toFixed(2).replace('.', ',') + ' €';
  }

})();
