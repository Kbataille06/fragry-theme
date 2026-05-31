/**
 * Antigravity Recommendations API
 * Gère le chargement asynchrone des recommandations (Produit & Panier) et l'ajout Ajax
 */
class AntigravityRecommendations {
  constructor() {
    this.init();
  }

  init() {
    this.loadRecommendations('[data-product-recommendations]');
    this.loadRecommendations('[data-cart-recommendations]');
  }

  loadRecommendations(selector) {
    const container = document.querySelector(selector);
    if (!container) return;

    const url = container.dataset.url;
    if (!url) return;

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return response.text();
      })
      .then(text => {
        const html = new DOMParser().parseFromString(text, 'text/html');
        const newContent = html.querySelector(selector);
        
        if (newContent && newContent.innerHTML.trim().length > 0) {
          container.innerHTML = newContent.innerHTML;
          
          // Initialiser les boutons d'ajout rapide uniquement pour le panier
          if (selector === '[data-cart-recommendations]') {
            this.initQuickAdd(container);
          }
        }
      })
      .catch(error => console.error('Antigravity API Error:', error));
  }

  initQuickAdd(container) {
    const buttons = container.querySelectorAll('.js-quick-add');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const variantId = button.dataset.variantId;
        if (!variantId) return;

        this.addToCart(variantId, button);
      });
    });
  }

  addToCart(variantId, button) {
    const originalText = button.textContent;
    button.textContent = 'Ajout en cours...';
    button.classList.add('is-loading');

    const data = {
      items: [{
        id: parseInt(variantId, 10),
        quantity: 1
      }]
    };

    fetch(window.Shopify?.routes?.root || '/' + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(cart => {
      button.textContent = '✓ Ajouté';
      button.classList.remove('is-loading');
      
      // Mettre à jour le tiroir panier de votre thème (selon votre propre logique)
      document.dispatchEvent(new CustomEvent('cart:updated'));
      
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    })
    .catch(error => {
      console.error('Add to Cart Error:', error);
      button.textContent = 'Erreur';
      button.classList.remove('is-loading');
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AntigravityRecommendations();
});
