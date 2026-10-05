// Demo Products Dataset
const products = [
    { id: 1, name: "Wireless Headphones", price: 99.99, category: "Electronics", icon: "🎧", desc: "Premium noise-canceling over-ear wireless headphones.", featured: true },
    { id: 2, name: "Minimalist Watch", price: 149.99, category: "Accessories", icon: "⌚", desc: "Sleek and elegant stainless steel watch with leather band.", featured: true },
    { id: 3, name: "Classic Hoodie", price: 59.99, category: "Clothing", icon: "🧥", desc: "Ultra-soft cotton blend hoodie perfect for everyday comfort.", featured: true },
    { id: 4, name: "Mechanical Keyboard", price: 119.99, category: "Electronics", icon: "⌨️", desc: "Tactile RGB mechanical keyboard for typing and gaming.", featured: true },
    { id: 5, name: "Leather Backpack", price: 89.99, category: "Accessories", icon: "🎒", desc: "Spacious premium leather backpack with modern compartments.", featured: false },
    { id: 6, name: "Running Sneakers", price: 129.99, category: "Clothing", icon: "👟", desc: "Lightweight and breathable sneakers with active responsive cushioning.", featured: false },
    { id: 7, name: "Smart Fitness Band", price: 49.99, category: "Electronics", icon: "⌚", desc: "Track workouts, heart rate, and sleep with multi-day battery life.", featured: false },
    { id: 8, name: "Polarized Sunglasses", price: 34.99, category: "Accessories", icon: "🕶️", desc: "Classic style polarized sunglasses providing maximum UV protection.", featured: false },
    { id: 9, name: "Denim Jacket", price: 79.99, category: "Clothing", icon: "👕", desc: "Timeless durable denim jacket with a relaxed vintage fit.", featured: false },
    { id: 10, name: "Wireless Charging Pad", price: 29.99, category: "Electronics", icon: "🔋", desc: "Fast-charging sleek minimalist qi wireless charging station.", featured: false }
];

// App State Management
let cart = JSON.parse(localStorage.getItem('vibemarket_cart')) || [];

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateCartCount();
    
    // Check which page we are on
    if (document.getElementById('featured-products')) {
        renderFeaturedProducts();
    }
    
    if (document.getElementById('products-list')) {
        renderShopProducts(products);
        initShopEventListeners();
        handleURLParams();
    }

    // Common mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }
});

// Theme Management (Light/Dark Mode)
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('vibemarket_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('vibemarket_theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

// Render Featured Products (Home Page)
function renderFeaturedProducts() {
    const container = document.getElementById('featured-products');
    const featured = products.filter(p => p.featured);
    container.innerHTML = featured.map(p => createProductCardHTML(p)).join('');
}

// Render Products List (Shop Page)
function renderShopProducts(productsToRender) {
    const container = document.getElementById('products-list');
    if (productsToRender.length === 0) {
        container.innerHTML = `<p class="no-results">No products matched your criteria.</p>`;
        return;
    }
    container.innerHTML = productsToRender.map(p => createProductCardHTML(p)).join('');
}

function createProductCardHTML(product) {
    return `
        <div class="product-card" onclick="navigateToDetail(${product.id}, event)">
            <div class="product-img-wrapper">${product.icon}</div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-primary add-to-cart-btn" onclick="handleAddToCart(${product.id}, event)">Add to Cart</button>
            </div>
        </div>
    `;
}

// Shop Event Listeners (Filtering & Searching)
function initShopEventListeners() {
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let activeCategory = 'all';
    let searchQuery = '';

    function filterAndSearch() {
        let filtered = products;
        if (activeCategory !== 'all') {
            filtered = filtered.filter(p => p.category === activeCategory);
        }
        if (searchQuery) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        renderShopProducts(filtered);
    }

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterAndSearch();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            activeCategory = e.target.dataset.category;
            filterAndSearch();
        });
    });

    // View toggling with header links
    const cartNavLink = document.getElementById('cart-nav-link');
    if (cartNavLink) {
        cartNavLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('cart');
        });
    }

    document.getElementById('back-to-shop').addEventListener('click', () => switchView('shop'));
    document.getElementById('back-to-shop-from-cart').addEventListener('click', () => switchView('shop'));
}

// Routing Simulation via Views
function switchView(viewName) {
    const shopView = document.getElementById('shop-view');
    const detailsView = document.getElementById('details-view');
    const cartView = document.getElementById('cart-view');

    shopView.classList.add('hidden');
    detailsView.classList.add('hidden');
    cartView.classList.add('hidden');

    if (viewName === 'shop') {
        shopView.classList.remove('hidden');
    } else if (viewName === 'details') {
        detailsView.classList.remove('hidden');
    } else if (viewName === 'cart') {
        cartView.classList.remove('hidden');
        renderCart();
    }
}

function navigateToDetail(productId, event) {
    if (event.target.classList.contains('add-to-cart-btn')) return;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const content = document.getElementById('product-details-content');
    content.innerHTML = `
        <div class="details-img-view">${product.icon}</div>
        <div class="details-meta">
            <span class="product-category">${product.category}</span>
            <h2>${product.name}</h2>
            <div class="price">$${product.price.toFixed(2)}</div>
            <p class="description">${product.desc}</p>
            <button class="btn btn-primary" onclick="handleAddToCart(${product.id}, event)">Add to Shopping Cart</button>
        </div>
    `;
    switchView('details');
}

function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'cart') {
        switchView('cart');
    }
}

// Shopping Cart Core Logic
function handleAddToCart(productId, event) {
    if (event) event.stopPropagation();
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
}

function changeQty(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }
    
    saveCart();
    updateCartCount();
    renderCart();
}

function removeCartItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function renderCart() {
    const itemsList = document.getElementById('cart-items-list');
    const summaryCount = document.getElementById('summary-count');
    const summaryTotal = document.getElementById('summary-total');

    if (cart.length === 0) {
        itemsList.innerHTML = `<p style="padding: 2rem 0; text-align:center; color: var(--text-secondary);">Your cart is currently empty.</p>`;
        summaryCount.textContent = '0';
        summaryTotal.textContent = '$0.00';
        return;
    }

    itemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img">${item.icon}</div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="product-category">${item.category}</p>
                <div class="cart-item-qty" style="margin-top: 0.5rem;">
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeCartItem(${item.id})" style="margin-left: 1rem;">Remove</button>
                </div>
            </div>
            <div style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    summaryCount.textContent = totalItems;
    summaryTotal.textContent = `$${totalPrice.toFixed(2)}`;
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = totalItems;
    }
}

function saveCart() {
    localStorage.setItem('vibemarket_cart', JSON.stringify(cart));
}
