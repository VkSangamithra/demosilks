/**
 * DEMO SILKS - Main Application Script
 * Handles Cart, Wishlist, Notifications, Modals, Mini Cart Drawer, Search, and Currency
 */

// Currency System
const CURRENCY_RATES = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  GBP: { symbol: '£', rate: 0.0095, label: 'GBP (£)' },
  EUR: { symbol: '€', rate: 0.011, label: 'EUR (€)' },
  AED: { symbol: 'AED ', rate: 0.044, label: 'AED (د.إ)' }
};

function getActiveCurrency() {
  return localStorage.getItem('Demo_currency') || 'INR';
}

function setActiveCurrency(curr) {
  localStorage.setItem('Demo_currency', curr);
  window.location.reload();
}

// State Management
const DemoStore = {
  getCart() {
    try {
      const data = localStorage.getItem('Demo_cart');
      if (data) return JSON.parse(data);
      // Seed initial 3 items to match reference navbar badge '3'
      if (typeof SAREE_PRODUCTS !== 'undefined' && SAREE_PRODUCTS.length >= 2) {
        const initialCart = [
          { ...SAREE_PRODUCTS[0], quantity: 1, customNote: "" },
          { ...SAREE_PRODUCTS[1], quantity: 2, customNote: "" }
        ];
        localStorage.setItem('Demo_cart', JSON.stringify(initialCart));
        return initialCart;
      }
      return [];
    } catch (e) {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem('Demo_cart', JSON.stringify(cart));
    DemoStore.updateBadges();
  },

  addToCart(productId, quantity = 1, customNote = "") {
    const product = SAREE_PRODUCTS.find(p => p.id === parseInt(productId));
    if (!product) return;

    let cart = DemoStore.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
      if (customNote) cart[existingIndex].customNote = customNote;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        category: product.categoryName,
        sku: product.sku,
        quantity: quantity,
        customNote: customNote
      });
    }

    DemoStore.saveCart(cart);
    DemoStore.showToast(`🛍️ "${product.name}" added to your Cart!`);
    openMiniCart();
  },

  removeFromCart(productId) {
    let cart = DemoStore.getCart();
    cart = cart.filter(item => item.id !== parseInt(productId));
    DemoStore.saveCart(cart);
    DemoStore.showToast("Item removed from Cart");
    renderMiniCartContent();
  },

  updateCartQty(productId, delta) {
    let cart = DemoStore.getCart();
    const item = cart.find(i => i.id === parseInt(productId));
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== parseInt(productId));
      }
      DemoStore.saveCart(cart);
      renderMiniCartContent();
    }
  },

  getWishlist() {
    try {
      const data = localStorage.getItem('Demo_wishlist');
      if (data) return JSON.parse(data);
      // Seed initial 2 items to match reference navbar badge '2'
      if (typeof SAREE_PRODUCTS !== 'undefined' && SAREE_PRODUCTS.length >= 3) {
        const initialWish = [SAREE_PRODUCTS[0].id, SAREE_PRODUCTS[2].id];
        localStorage.setItem('Demo_wishlist', JSON.stringify(initialWish));
        return initialWish;
      }
      return [1, 3];
    } catch (e) {
      return [1, 3];
    }
  },

  saveWishlist(list) {
    localStorage.setItem('Demo_wishlist', JSON.stringify(list));
    DemoStore.updateBadges();
  },

  toggleWishlist(productId) {
    const id = parseInt(productId);
    const product = SAREE_PRODUCTS.find(p => p.id === id);
    if (!product) return;

    let list = DemoStore.getWishlist();
    const index = list.indexOf(id);

    if (index > -1) {
      list.splice(index, 1);
      DemoStore.saveWishlist(list);
      DemoStore.showToast(`Removed from Wishlist`);
      return false;
    } else {
      list.push(id);
      DemoStore.saveWishlist(list);
      DemoStore.showToast(`❤️ "${product.name}" saved to your Wishlist!`);
      return true;
    }
  },

  isWishlisted(productId) {
    const list = DemoStore.getWishlist();
    return list.includes(parseInt(productId));
  },

  updateBadges() {
    const cart = DemoStore.getCart();
    const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartBadges = document.querySelectorAll('.cart-badge');
    cartBadges.forEach(b => {
      b.textContent = totalCartItems;
      b.style.display = totalCartItems > 0 ? 'flex' : 'none';
    });

    const wishlist = DemoStore.getWishlist();
    const wishBadges = document.querySelectorAll('.wish-badge');
    wishBadges.forEach(b => {
      b.textContent = wishlist.length;
      b.style.display = wishlist.length > 0 ? 'flex' : 'none';
    });

    // Update wishlist buttons icon state on current page
    document.querySelectorAll('.saree-wish-btn').forEach(btn => {
      const pId = parseInt(btn.dataset.id);
      if (DemoStore.isWishlisted(pId)) {
        btn.classList.add('active');
        btn.innerHTML = '❤️';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '🤍';
      }
    });
  },

  showToast(message) {
    let toast = document.getElementById('DemoToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'DemoToast';
      toast.className = 'toast-box';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  },

  formatPrice(amount) {
    const currKey = getActiveCurrency();
    const curr = CURRENCY_RATES[currKey] || CURRENCY_RATES.INR;
    const converted = Math.round(amount * curr.rate);
    return curr.symbol + converted.toLocaleString('en-IN');
  },

  openWhatsApp(message = "") {
    const defaultMsg = encodeURIComponent("Namaste DEMO SILKS! I am interested in your luxury saree collection. Could you assist me with a bridal / festive recommendation?");
    const text = message ? encodeURIComponent(message) : defaultMsg;
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  },

  openProductWhatsApp(productId) {
    const p = SAREE_PRODUCTS.find(item => item.id === parseInt(productId));
    if (!p) return;
    const msg = `Namaste DEMO SILKS! I would like to inquire about the ${p.name} (SKU: ${p.sku}) priced at ${DemoStore.formatPrice(p.price)}. Please share drape video and availability!`;
    DemoStore.openWhatsApp(msg);
  }
};

// Render Saree Card HTML Helper
function createSareeCardHTML(product) {
  const isWish = DemoStore.isWishlisted(product.id);
  return `
    <div class="saree-card" data-id="${product.id}" data-category="${product.category}">
      <div class="saree-thumb-wrapper">
        <a href="product-details.html?id=${product.id}">
          <img src="${product.images[0]}" alt="${product.name}" class="saree-thumb" loading="lazy" />
        </a>
        <div class="saree-badges">
          ${product.isBestSeller ? '<span class="badge-tag badge-bestseller">Best Seller</span>' : ''}
          ${product.isNew ? '<span class="badge-tag badge-new">New Arrival</span>' : ''}
          <span class="badge-tag badge-silkmark">✓ Silk Mark</span>
        </div>
        <button class="saree-wish-btn ${isWish ? 'active' : ''}" data-id="${product.id}" title="Save to Wishlist" onclick="handleWishlistClick(event, ${product.id})">
          ${isWish ? '❤️' : '🤍'}
        </button>
        <button class="saree-quick-view" onclick="openQuickViewModal(${product.id})">
          Quick View
        </button>
      </div>
      <div class="saree-content">
        <span class="saree-category">${product.categoryName}</span>
        <h3 class="saree-title">
          <a href="product-details.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="saree-specs-mini">
          <span>✨ ${product.fabric}</span>
          <span>👑 ${product.zari.split(' ')[0]} Zari</span>
        </div>
        <div class="saree-price-row">
          <span class="saree-current-price">${DemoStore.formatPrice(product.price)}</span>
          <span class="saree-original-price">${DemoStore.formatPrice(product.originalPrice)}</span>
          <span class="saree-discount-badge">${product.discountPercent}% OFF</span>
        </div>
        <div class="saree-actions">
          <button class="btn-add-cart" onclick="DemoStore.addToCart(${product.id})">
            Add To Cart
          </button>
          <button class="btn-wa-inquire" title="Inquire on WhatsApp" onclick="DemoStore.openProductWhatsApp(${product.id})">
            💬
          </button>
        </div>
      </div>
    </div>
  `;
}

// Quick View Modal
function openQuickViewModal(productId) {
  const p = SAREE_PRODUCTS.find(item => item.id === parseInt(productId));
  if (!p) return;

  let modal = document.getElementById('quickViewModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quickViewModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 850px;">
      <button class="modal-close-btn" onclick="closeQuickViewModal()">✕</button>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
        <div>
          <img id="qvMainImg" src="${p.images[0]}" alt="${p.name}" style="width: 100%; border-radius: 12px; aspect-ratio: 3/4; object-fit: cover;" />
          <div style="display: flex; gap: 8px; margin-top: 10px;">
            ${p.images.map((img, i) => `
              <img src="${img}" style="width: 60px; height: 75px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid ${i === 0 ? 'var(--color-gold)' : 'transparent'}" onclick="document.getElementById('qvMainImg').src='${img}'" />
            `).join('')}
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <span style="font-size: 0.75rem; color: var(--color-gold-dark); text-transform: uppercase; font-weight: 700;">${p.categoryName} • ${p.sku}</span>
          <h2 style="font-size: 1.4rem; color: var(--color-maroon-dark); line-height: 1.3;">${p.name}</h2>
          <div style="display: flex; align-items: baseline; gap: 10px;">
            <span style="font-size: 1.5rem; font-weight: 800; color: var(--color-primary-maroon);">${DemoStore.formatPrice(p.price)}</span>
            <span style="text-decoration: line-through; color: #9ca3af;">${DemoStore.formatPrice(p.originalPrice)}</span>
            <span style="font-size: 0.8rem; color: var(--color-emerald); font-weight: 700;">${p.discountPercent}% OFF</span>
          </div>
          <p style="font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.6;">${p.description}</p>
          <div style="background: rgba(197, 155, 39, 0.08); padding: 12px; border-radius: 8px; font-size: 0.85rem;">
            <div><strong>Fabric:</strong> ${p.fabric}</div>
            <div><strong>Zari:</strong> ${p.zari}</div>
            <div><strong>Origin:</strong> ${p.specs.Origin}</div>
            <div><strong>Silk Mark:</strong> Verified 100% Pure</div>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="btn-royal-primary" style="flex: 1;" onclick="DemoStore.addToCart(${p.id}); closeQuickViewModal();">
              Add To Cart
            </button>
            <a href="product-details.html?id=${p.id}" class="btn-royal-outline">
              Full Details →
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeQuickViewModal() {
  const modal = document.getElementById('quickViewModal');
  if (modal) modal.classList.remove('active');
}

// Mini Cart Drawer
function openMiniCart() {
  let drawer = document.getElementById('miniCartDrawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'miniCartDrawer';
    drawer.className = 'cart-drawer-overlay';
    drawer.onclick = (e) => {
      if (e.target === drawer) closeMiniCart();
    };
    document.body.appendChild(drawer);
  }

  renderMiniCartContent();
  drawer.classList.add('active');
}

function closeMiniCart() {
  const drawer = document.getElementById('miniCartDrawer');
  if (drawer) drawer.classList.remove('active');
}

function renderMiniCartContent() {
  const drawer = document.getElementById('miniCartDrawer');
  if (!drawer) return;

  const cart = DemoStore.getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  drawer.innerHTML = `
    <div class="cart-drawer-panel">
      <div class="cart-drawer-header">
        <div class="cart-drawer-title">
          <i class="fa-solid fa-bag-shopping" style="color:var(--color-primary-maroon);"></i>
          <span>Your Royal Cart (${cart.reduce((a,b) => a + b.quantity, 0)})</span>
        </div>
        <button onclick="closeMiniCart()" style="background:none; border:none; font-size:1.3rem; color:var(--color-maroon-dark); cursor:pointer;">✕</button>
      </div>

      <div class="cart-drawer-body">
        ${cart.length === 0 ? `
          <div style="text-align:center; padding:50px 20px; color:var(--color-text-muted);">
            <div style="font-size:3rem; margin-bottom:12px;">🛍️</div>
            <h4 style="color:var(--color-maroon-dark); margin-bottom:6px;">Your cart is currently empty</h4>
            <p style="font-size:0.85rem; margin-bottom:20px;">Discover handwoven Kanjivaram and Banarasi heirlooms.</p>
            <a href="shop.html" class="btn-royal-primary" onclick="closeMiniCart()">Browse Sarees</a>
          </div>
        ` : cart.map(item => `
          <div class="cart-drawer-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
              <div style="font-size:0.72rem; color:var(--color-gold-dark); font-weight:700; text-transform:uppercase;">${item.category}</div>
              <h5 style="font-size:0.88rem; color:var(--color-maroon-dark); line-height:1.3; margin:2px 0 4px 0;">${item.name}</h5>
              <div style="font-weight:700; color:var(--color-primary-maroon); font-size:0.95rem;">${DemoStore.formatPrice(item.price)}</div>
              ${item.customNote ? `<div style="font-size:0.7rem; color:var(--color-emerald); margin-top:2px;">✨ ${item.customNote}</div>` : ''}
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
              <div class="qty-control" style="transform:scale(0.85); transform-origin:right center;">
                <button class="qty-btn" onclick="DemoStore.updateCartQty(${item.id}, -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="DemoStore.updateCartQty(${item.id}, 1)">+</button>
              </div>
              <button onclick="DemoStore.removeFromCart(${item.id})" style="border:none; background:none; color:#dc2626; font-size:0.72rem; cursor:pointer;">✕</button>
            </div>
          </div>
        `).join('')}
      </div>

      ${cart.length > 0 ? `
        <div class="cart-drawer-footer">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <span style="font-weight:600; color:var(--color-text-dark);">Subtotal:</span>
            <span style="font-family:var(--font-royal); font-size:1.3rem; font-weight:800; color:var(--color-primary-maroon);">
              ${DemoStore.formatPrice(subtotal)}
            </span>
          </div>
          <div style="font-size:0.75rem; color:var(--color-text-muted);">
            ✓ Complimentary Pan-India Delivery & Silk Mark Tag
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:6px;">
            <a href="cart.html" class="btn-royal-outline" style="text-align:center; padding:10px;">
              View Full Cart
            </a>
            <a href="cart.html" class="btn-royal-primary" style="text-align:center; padding:10px;">
              Checkout →
            </a>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// Live Search Overlay Modal
function openSearchModal() {
  let modal = document.getElementById('searchModalOverlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'searchModalOverlay';
    modal.className = 'search-modal-overlay';
    modal.onclick = (e) => {
      if (e.target === modal) closeSearchModal();
    };
    modal.innerHTML = `
      <div class="search-modal-box">
        <div class="search-modal-header">
          <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:20px; color:var(--color-gold); font-size:1.2rem;"></i>
          <input type="text" id="liveModalSearchInput" class="search-modal-input" placeholder="Search by silk, motif, color or occasion (e.g. Kanjivaram, Red, Peacock)..." oninput="handleLiveSearch(this.value)" autocomplete="off">
          <button onclick="closeSearchModal()" style="border:none; background:none; font-size:1.3rem; color:var(--color-text-muted); cursor:pointer;">✕</button>
        </div>

        <div style="padding:12px 20px; background:rgba(197, 155, 39, 0.08); border-bottom:1px solid var(--color-gold-border); display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:0.75rem;">
          <span style="font-weight:700; color:var(--color-maroon-dark);">Trending:</span>
          <button class="eval-pill" onclick="triggerSearchTag('Kanjivaram')">Kanjivaram</button>
          <button class="eval-pill" onclick="triggerSearchTag('Banarasi')">Banarasi Brocade</button>
          <button class="eval-pill" onclick="triggerSearchTag('Bridal')">Bridal Red</button>
          <button class="eval-pill" onclick="triggerSearchTag('Organza')">Tissue Organza</button>
          <button class="eval-pill" onclick="triggerSearchTag('Gold')">Gold Zari</button>
        </div>

        <div id="liveSearchResults" class="search-modal-results">
          <!-- Populated live -->
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal.classList.add('active');
  setTimeout(() => {
    const input = document.getElementById('liveModalSearchInput');
    if (input) {
      input.focus();
      handleLiveSearch(input.value);
    }
  }, 100);
}

function closeSearchModal() {
  const modal = document.getElementById('searchModalOverlay');
  if (modal) modal.classList.remove('active');
}

function triggerSearchTag(tag) {
  const input = document.getElementById('liveModalSearchInput');
  if (input) {
    input.value = tag;
    handleLiveSearch(tag);
  }
}

function handleLiveSearch(query) {
  const resultsContainer = document.getElementById('liveSearchResults');
  if (!resultsContainer) return;

  const q = (query || '').toLowerCase().trim();
  let matches = SAREE_PRODUCTS;

  if (q) {
    matches = SAREE_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.color.toLowerCase().includes(q) ||
      p.occasion.toLowerCase().includes(q)
    );
  } else {
    matches = SAREE_PRODUCTS.slice(0, 4); // default suggestions
  }

  if (matches.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align:center; padding:30px 10px; color:var(--color-text-muted);">
        <p>No sarees found matching "<strong>${query}</strong>".</p>
        <a href="shop.html" class="btn-royal-outline" style="margin-top:10px; font-size:0.75rem;" onclick="closeSearchModal()">
          View Entire Saree Catalog
        </a>
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = `
    <div style="font-size:0.75rem; color:var(--color-gold-dark); font-weight:700; margin-bottom:6px; text-transform:uppercase;">
      ${q ? `Found ${matches.length} Sarees` : 'Featured Heirlooms'}
    </div>
    ${matches.map(p => `
      <div class="search-result-item" onclick="window.location.href='product-details.html?id=${p.id}'">
        <img src="${p.images[0]}" alt="${p.name}">
        <div style="flex:1;">
          <div style="font-size:0.7rem; color:var(--color-gold-dark); font-weight:700; text-transform:uppercase;">${p.categoryName} • ${p.occasion}</div>
          <h5 style="font-size:0.92rem; color:var(--color-maroon-dark); margin:2px 0 4px 0;">${p.name}</h5>
          <div style="display:flex; align-items:baseline; gap:8px;">
            <span style="font-weight:800; color:var(--color-primary-maroon); font-size:0.95rem;">${DemoStore.formatPrice(p.price)}</span>
            <span style="font-size:0.75rem; color:#9ca3af; text-decoration:line-through;">${DemoStore.formatPrice(p.originalPrice)}</span>
            <span style="font-size:0.7rem; color:var(--color-emerald); font-weight:700;">${p.discountPercent}% OFF</span>
          </div>
        </div>
        <button class="btn-royal-gold" style="padding:6px 12px; font-size:0.7rem;" onclick="event.stopPropagation(); DemoStore.addToCart(${p.id}); closeSearchModal();">
          Add
        </button>
      </div>
    `).join('')}
  `;
}

// Global Wishlist click handler
function handleWishlistClick(event, productId) {
  event.preventDefault();
  event.stopPropagation();
  DemoStore.toggleWishlist(productId);
}

// Video Call Appointment Modal
function openVideoCallModal() {
  let modal = document.getElementById('videoCallModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'videoCallModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content" style="max-width:540px;">
        <button class="modal-close-btn" onclick="closeVideoCallModal()">✕</button>
        <div style="text-align:center; margin-bottom:20px;">
          <span class="section-tag">Private Video Consultation</span>
          <h2 style="font-size:1.6rem; color:var(--color-maroon-dark);">Book Live Saree Viewing</h2>
          <div class="section-divider">
            <span></span><i class="fa-solid fa-video"></i><span></span>
          </div>
          <p style="font-size:0.85rem; color:var(--color-text-muted);">
            Experience silk fall, pure zari reflections, and matching blouse swatches on a private WhatsApp video call with our senior stylist.
          </p>
        </div>

        <form onsubmit="handleVideoCallBooking(event)">
          <div style="margin-bottom:12px;">
            <label style="display:block; font-size:0.78rem; font-weight:700; margin-bottom:4px;">Your Name *</label>
            <input type="text" id="vcName" required placeholder="e.g. Ananya Rao" style="width:100%; padding:9px 12px; border:1px solid var(--color-gold-border); border-radius:8px;">
          </div>
          <div style="margin-bottom:12px;">
            <label style="display:block; font-size:0.78rem; font-weight:700; margin-bottom:4px;">WhatsApp Number with Country Code *</label>
            <input type="tel" id="vcPhone" required placeholder="+91 98450 XXXXX" style="width:100%; padding:9px 12px; border:1px solid var(--color-gold-border); border-radius:8px;">
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px;">
            <div>
              <label style="display:block; font-size:0.78rem; font-weight:700; margin-bottom:4px;">Preferred Date *</label>
              <input type="date" id="vcDate" required style="width:100%; padding:8px 10px; border:1px solid var(--color-gold-border); border-radius:8px;">
            </div>
            <div>
              <label style="display:block; font-size:0.78rem; font-weight:700; margin-bottom:4px;">Time Slot *</label>
              <select id="vcSlot" style="width:100%; padding:8px 10px; border:1px solid var(--color-gold-border); border-radius:8px; background:#fff;">
                <option>11:00 AM - 12:00 PM IST</option>
                <option>02:00 PM - 03:00 PM IST</option>
                <option>04:30 PM - 05:30 PM IST</option>
                <option>07:00 PM - 08:00 PM IST (Evening)</option>
              </select>
            </div>
          </div>
          <div style="margin-bottom:20px;">
            <label style="display:block; font-size:0.78rem; font-weight:700; margin-bottom:4px;">Saree Types to Shortlist</label>
            <input type="text" id="vcInterest" placeholder="e.g. Bridal Kanjivaram in Crimson / Banarasi Jaal" style="width:100%; padding:9px 12px; border:1px solid var(--color-gold-border); border-radius:8px;">
          </div>
          <button type="submit" class="btn-royal-primary" style="width:100%; padding:12px;">
            <i class="fa-brands fa-whatsapp"></i> Confirm WhatsApp Video Appointment
          </button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.classList.add('active');
}

function closeVideoCallModal() {
  const modal = document.getElementById('videoCallModal');
  if (modal) modal.classList.remove('active');
}

function handleVideoCallBooking(e) {
  e.preventDefault();
  const name = document.getElementById('vcName').value;
  const phone = document.getElementById('vcPhone').value;
  const date = document.getElementById('vcDate').value;
  const slot = document.getElementById('vcSlot').value;
  const interest = document.getElementById('vcInterest').value;

  closeVideoCallModal();
  DemoStore.showToast(`✨ Appointment scheduled! Our stylist will message you on WhatsApp.`);

  const msg = `Namaste DEMO SILKS! I have booked a Video Shopping Appointment.\n\nName: ${name}\nDate: ${date}\nSlot: ${slot}\nLooking for: ${interest || 'Bridal/Festive Sarees'}\n\nPlease confirm availability!`;
  window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
}

// Global Nav Bar & Interactive Components Initializer
function renderGlobalComponents(activePageKey = "") {
  // 1. Floating WhatsApp Button
  if (!document.querySelector('.floating-wa-btn')) {
    const waBtn = document.createElement('a');
    waBtn.href = "javascript:void(0)";
    waBtn.className = "floating-wa-btn";
    waBtn.title = "Chat on WhatsApp with Saree Stylist";
    waBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    waBtn.onclick = () => DemoStore.openWhatsApp();
    document.body.appendChild(waBtn);
  }

  // 2. Connect Header Search and Cart Actions
  document.querySelectorAll('a[title="Search Sarees"], a[title="Search"], button[title="Search Sarees"]').forEach(a => {
    a.onclick = (e) => {
      e.preventDefault();
      openSearchModal();
    };
  });

  document.querySelectorAll('a[title="Shopping Cart"], a[title="Cart"]').forEach(a => {
    // Only intercept if not currently on cart.html itself
    if (activePageKey !== 'cart') {
      a.href = "javascript:void(0)";
      a.onclick = (e) => {
        e.preventDefault();
        openMiniCart();
      };
    }
  });

  // 4. Connect Book Video Call buttons in Header
  document.querySelectorAll('.main-header .btn-royal-primary').forEach(btn => {
    if (btn.textContent.includes('Book Video Call')) {
      btn.href = "javascript:void(0)";
      btn.onclick = (e) => {
        e.preventDefault();
        openVideoCallModal();
      };
    }
  });

  // 5. Connect Currency Selector in Top Bar
  const curKey = getActiveCurrency();
  const topBarInner = document.querySelector('.top-bar-inner .top-bar-links');
  if (topBarInner) {
    const curSelect = document.createElement('select');
    curSelect.className = 'currency-selector';
    curSelect.title = "Select Currency";
    curSelect.innerHTML = Object.entries(CURRENCY_RATES).map(([k, v]) => `
      <option value="${k}" ${k === curKey ? 'selected' : ''}>${v.label}</option>
    `).join('');
    curSelect.onchange = (e) => setActiveCurrency(e.target.value);
    
    // Replace text span with select
    const span = Array.from(topBarInner.children).find(c => c.tagName === 'SPAN');
    if (span) {
      topBarInner.replaceChild(curSelect, span);
    } else {
      topBarInner.appendChild(curSelect);
    }
  }

  // Update badge counts
  DemoStore.updateBadges();
}

// Mobile Navigation Drawer Toggle
function toggleMobileNav() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.querySelector('.mobile-menu-btn i');
  if (menu) {
    const isHidden = window.getComputedStyle(menu).display === 'none';
    menu.style.display = isHidden ? 'block' : 'none';
    if (btn) {
      if (isHidden) {
        btn.classList.remove('fa-bars');
        btn.classList.add('fa-xmark');
      } else {
        btn.classList.remove('fa-xmark');
        btn.classList.add('fa-bars');
      }
    }
  }
}

// Mobile Filter Sidebar Toggle (Shop Page)
function toggleMobileFilterSidebar() {
  const sidebar = document.querySelector('.filter-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('mobile-open');
    if (sidebar.classList.contains('mobile-open')) {
      sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Auto close mobile drawer when clicking outside or resizing to desktop
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const btn = document.querySelector('.mobile-menu-btn');
  if (menu && menu.style.display === 'block') {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.style.display = 'none';
      const icon = btn ? btn.querySelector('i') : null;
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 992) {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.style.display = 'none';
    const btn = document.querySelector('.mobile-menu-btn i');
    if (btn) {
      btn.classList.remove('fa-xmark');
      btn.classList.add('fa-bars');
    }
    const sidebar = document.querySelector('.filter-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');
  }
});

// Sticky Stacking Cards Scroll Physics & Animation (PGNexa-Style Adapted to Royal Silks)
function initStackingCardsAnimation() {
  const container = document.getElementById('stackingCardsContainer');
  if (!container) return;
  const cards = Array.from(container.querySelectorAll('.stack-card'));
  if (cards.length < 2) return;

  function onScroll() {
    const vh = window.innerHeight;
    const isMobile = window.innerWidth <= 600;
    const headerOffset = isMobile ? 76 : 92;
    const stepOffset = isMobile ? 16 : 22;

    cards.forEach((card, index) => {
      const nextCard = cards[index + 1];
      if (!nextCard) {
        card.style.transform = '';
        card.style.filter = '';
        return;
      }

      const nextRect = nextCard.getBoundingClientRect();
      const targetTop = headerOffset + (index + 1) * stepOffset;
      const startOverlap = vh * 0.88;
      const fullOverlap = targetTop;

      let progress = (startOverlap - nextRect.top) / (startOverlap - fullOverlap);
      progress = Math.max(0, Math.min(1, progress));

      const scale = 1 - (progress * 0.05);
      const translateY = - (progress * 8);
      const brightness = 1 - (progress * 0.08);

      card.style.transform = `scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(1)}px)`;
      card.style.filter = `brightness(${brightness.toFixed(3)})`;
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}

// Initialise on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  DemoStore.updateBadges();
  initStackingCardsAnimation();

  // Close modals when clicking overlay
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
    }
  });
});
