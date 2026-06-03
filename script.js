// script.js

const categoryContainer = document.getElementById('categories');
const productListContainer = document.getElementById('products-list');
const productSearchInput = document.getElementById('product-search');

const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutSummaryEl = document.getElementById('checkout-summary');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const isProductsPage = currentPage === 'products.html';
const isCartPage = currentPage === 'cart.html';

async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
}

function notify(message, type = 'success') {
    const el = document.getElementById('app-notification');
    if (!el) return;
    el.textContent = message;
    el.className = `notification ${type}`;
    el.style.display = 'block';
    clearTimeout(notify._t);
    notify._t = setTimeout(() => {
        el.style.display = 'none';
    }, 2600);
}

function openModal(id) {
    document.querySelectorAll('.modal.active').forEach(el => el.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function filterProducts(searchTerm) {
    const normalized = (searchTerm || '').trim().toLowerCase();
    if (!normalized) return state.allProducts;
    return state.allProducts.filter(product =>
        product.name.toLowerCase().includes(normalized) ||
        (product.category || '').toLowerCase().includes(normalized) ||
        (product.description || '').toLowerCase().includes(normalized)
    );
}

function formatRs(n) {
    const num = Number(n);
    if (Number.isNaN(num)) return '0';
    return num.toLocaleString('en-IN');
}

function loadCart() {
    try {
        const raw = localStorage.getItem('cart');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

let cart = loadCart();

const state = {
    allProducts: []
};


function renderCategories(categories) {
    if (!categoryContainer) return;

    const counts = categories.reduce((acc, category) => {
        acc[category.name.toLowerCase()] = state.allProducts.filter(p => (p.category || '').toLowerCase() === category.name.toLowerCase()).length;
        return acc;
    }, {});

    categoryContainer.innerHTML = `
        <div class="category-card category-card-all" data-category="__all__">
            <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=600&q=80" alt="All">
            <h3>All Products</h3>
            <p class="category-count">${state.allProducts.length} products</p>
        </div>
        ${categories.map(category => `
            <div class="category-card" data-category="${category.name}">
                <img src="${category.image}" alt="${category.name}">
                <h3>${category.name}</h3>
                <p class="category-count">${counts[category.name.toLowerCase()] || 0} products</p>
            </div>
        `).join('')}
    `;

    // click to filter products
    const cards = Array.from(categoryContainer.querySelectorAll('[data-category]'));
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const selected = card.getAttribute('data-category');
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const filtered = selected === '__all__'
                ? state.allProducts
                : state.allProducts.filter(p => (p.category || '').toLowerCase() === selected.toLowerCase());

            renderProducts(filtered);

            if (checkoutSummaryEl) {
                checkoutSummaryEl.textContent = selected === '__all__'
                    ? `Showing all products (${filtered.length})`
                    : `Category: ${selected} | Products: ${filtered.length}`;
            }
        });
    });

    if (cards.length > 0) {
        cards[0].classList.add('active');
    }
}


function renderProducts(products) {
    if (!productListContainer) return;
    productListContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image || 'https://via.placeholder.com/300?text=No+Image'}" alt="${product.name}" style="width: 100%; height: 200px; object-fit:cover; border-radius:10px;">
            <h3>${product.name}</h3>
            <p>Rs. ${formatRs(product.price)}</p>
            <p class="stock">Stock: ${product.stock ?? 'N/A'}</p>
            <div class="product-actions">
                <button type="button" class="btn btn-ghost" data-view-product="${product.id}">View</button>
                <button type="button" class="btn btn-add" data-add-to-cart="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
            </div>
        </div>
    `).join('');

    productListContainer.querySelectorAll('[data-view-product]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-view-product'), 10);
            const product = state.allProducts.find(p => p.id === id);
            if (!product) return;
            openProductModal(product);
        });
    });

    productListContainer.querySelectorAll('[data-add-to-cart]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-add-to-cart'), 10);
            const name = btn.getAttribute('data-name');
            const price = Number(btn.getAttribute('data-price'));
            const image = btn.getAttribute('data-image') || '';
            if (Number.isNaN(id) || !name || Number.isNaN(price)) return;
            addToCart(id, name, price, image);
        });
    });
}

function renderCart() {
    if (!cartItemsEl || !cartTotalEl) return;

    if (!cart.length) {
        cartItemsEl.innerHTML = `<div class="cart-empty">Your cart is empty.</div>`;
        cartTotalEl.textContent = 'Rs. 0';
        if (checkoutSummaryEl) checkoutSummaryEl.textContent = '';
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + Number(item.price || 0) * (Number(item.quantity) || 1), 0);

    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-thumbnail">
                <img src="${item.image || 'https://via.placeholder.com/150?text=No+Image'}" alt="${item.name}">
            </div>
            <div class="cart-item-body">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Rs. ${formatRs((item.price || 0) * (item.quantity || 1))}</div>
                <div class="cart-item-controls">
                    <button type="button" class="btn btn-ghost" data-change-qty="${item.id}" data-delta="-1">−</button>
                    <span class="cart-item-qty">${item.quantity || 1}</span>
                    <button type="button" class="btn btn-ghost" data-change-qty="${item.id}" data-delta="1">+</button>
                </div>
            </div>
            <button type="button" class="btn btn-remove" data-remove-cart="${item.id}">Remove</button>
        </div>
    `).join('');

    cartTotalEl.textContent = `Rs. ${formatRs(totalPrice)}`;
    if (checkoutSummaryEl) checkoutSummaryEl.textContent = `Total payable: Rs. ${formatRs(totalPrice)}`;

    cartItemsEl.querySelectorAll('[data-change-qty]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-change-qty'), 10);
            const delta = parseInt(btn.getAttribute('data-delta'), 10);
            if (Number.isNaN(id) || Number.isNaN(delta)) return;
            updateCartQuantity(id, delta);
        });
    });

    cartItemsEl.querySelectorAll('[data-remove-cart]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-remove-cart'), 10);
            if (Number.isNaN(id)) return;
            removeFromCart(id);
        });
    });
}

function updateCartQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity = Math.max(1, (item.quantity || 1) + delta);
    saveCart();
    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    notify('🗑️ Item removed from cart.', 'success');
}

function addToCart(productId, productName, price, image = '') {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
        existing.price = price;
        if (image) existing.image = image;
    } else {
        cart.push({ id: productId, name: productName, price, quantity: 1, image });
    }

    saveCart();
    renderCart();
    notify(`✅ ${productName} added to cart!`, 'success');
}

function toggleMenu() {
    document.querySelector('.nav-links')?.classList.toggle('active');
}

function openProductModal(product) {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    modal.querySelector('.modal-product-image')?.setAttribute('src', product.image || 'https://via.placeholder.com/400?text=No+Image');
    modal.querySelector('.modal-product-image')?.setAttribute('alt', product.name);
    const titleEl = modal.querySelector('.modal-product-title');
    const priceEl = modal.querySelector('.modal-product-price');
    const stockEl = modal.querySelector('.modal-product-stock');
    const descEl = modal.querySelector('.modal-product-description');
    if (titleEl) titleEl.textContent = product.name;
    if (priceEl) priceEl.textContent = `Rs. ${formatRs(product.price)}`;
    if (stockEl) stockEl.textContent = `Stock: ${product.stock ?? 'N/A'}`;
    if (descEl) descEl.textContent = product.description || 'No description available.';
    const modalAddButton = modal.querySelector('.modal-add-cart');
    modalAddButton?.setAttribute('data-add-to-cart', product.id);
    modalAddButton?.setAttribute('data-image', product.image || '');

    modal.classList.add('active');
}

async function loadData() {
    try {
        const apiCategories = await fetchJson('/api/categories');
        const apiProducts = await fetchJson('/api/products');

        state.allProducts = apiProducts;

        renderCategories(apiCategories);
        renderProducts(apiProducts);
        renderCart();
    } catch (error) {

        console.error('API fetch failed:', error);
        notify('❌ Failed to load data: ' + (error.message || 'Unknown error'), 'error');
    }
}

// Contact form
async function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const message = document.getElementById('contact-message')?.value.trim();

    if (!name || !email || !message) {
        notify('Please fill out all fields.', 'error');
        return;
    }

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Unable to send message.');
        }

        notify('✅ ' + result.message, 'success');
        document.getElementById('contact-form')?.reset();
    } catch (error) {
        console.error(error);
        notify('❌ ' + (error.message || 'Failed to submit contact form.'), 'error');
    }
}

async function handleRegisterSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('register-name')?.value.trim();
    const email = document.getElementById('register-email')?.value.trim();
    const password = document.getElementById('register-password')?.value.trim();

    if (!name || !email || !password) {
        notify('Please complete all fields.', 'error');
        return;
    }
    if (!validateEmail(email)) {
        notify('Please enter a valid email.', 'error');
        return;
    }
    if (password.length < 4) {
        notify('Password must be at least 4 characters.', 'error');
        return;
    }

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Registration failed');
        }

        closeModal('register-modal');
        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('userName', result.user.name);
        notify('✅ Registration successful! Welcome ' + result.user.name, 'success');
    } catch (error) {
        notify('❌ ' + (error.message || 'Registration failed'), 'error');
    }
}

async function handleLoginSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value.trim();

    if (!email || !password) {
        notify('Please enter both email and password.', 'error');
        return;
    }
    if (!validateEmail(email)) {
        notify('Please enter a valid email.', 'error');
        return;
    }

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Login failed');
        }

        closeModal('login-modal');
        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('userName', result.user.name);
        notify('✅ Login successful! Welcome ' + result.user.name, 'success');
    } catch (error) {
        notify('❌ ' + (error.message || 'Login failed'), 'error');
    }
}

async function registerUser() {
    const name = prompt('Enter your name:');
    if (!name) return;

    const email = prompt('Enter your email:');
    if (!email) return;

    const password = prompt('Enter password (min 4 characters):');
    if (!password || password.length < 4) {
        notify('❌ Password must be at least 4 characters', 'error');
        return;
    }

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();
        if (!response.ok) {
            notify('❌ ' + (result.error || 'Registration failed'), 'error');
            return;
        }

        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('userName', result.user.name);
        notify(`✅ Registration successful! User ID: ${result.user.id}`, 'success');
    } catch (error) {
        notify('❌ Error: ' + error.message, 'error');
    }
}

async function loginUser() {
    const email = prompt('Enter your email:');
    if (!email) return;

    const password = prompt('Enter password:');
    if (!password) return;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (!response.ok) {
            notify('❌ ' + (result.error || 'Login failed'), 'error');
            return;
        }

        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('userName', result.user.name);
        notify('✅ Login successful! Welcome ' + result.user.name, 'success');
    } catch (error) {
        notify('❌ Error: ' + error.message, 'error');
    }
}

async function createOrder() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        notify('❌ Please login first!', 'error');
        openModal('login-modal');
        return;
    }

    if (!cart.length) {
        notify('❌ Your cart is empty!', 'error');
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const address = prompt('Enter shipping address:');

    if (!address) return;

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: parseInt(userId, 10),
                items: cart,
                totalPrice,
                shippingAddress: address
            })
        });

        const result = await response.json();
        if (!response.ok) {
            notify('❌ ' + (result.errors ? result.errors[0] : 'Order creation failed'), 'error');
            return;
        }

        cart = [];
        saveCart();
        renderCart();
        notify(`✅ Order created! Order ID: ${result.order.id}\nTotal: Rs. ${formatRs(totalPrice)}`, 'success');
    } catch (error) {
        notify('❌ Error: ' + error.message, 'error');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Nav buttons
    document.getElementById('nav-login')?.addEventListener('click', () => openModal('login-modal'));
    document.getElementById('nav-register')?.addEventListener('click', () => openModal('register-modal'));

    document.getElementById('shop-now')?.addEventListener('click', () => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('view-categories')?.addEventListener('click', () => {
        document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('login-form')?.addEventListener('submit', handleLoginSubmit);
    document.getElementById('register-form')?.addEventListener('submit', handleRegisterSubmit);

    // Cart buttons
    document.getElementById('checkout-btn')?.addEventListener('click', createOrder);
    document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
        cart = [];
        saveCart();
        renderCart();
        notify('🗑️ Cart cleared.', 'success');
    });

    document.getElementById('product-search')?.addEventListener('input', event => {
        const query = event.target.value;
        renderProducts(filterProducts(query));
    });

    const productModal = document.getElementById('product-modal');
    document.getElementById('product-modal-close')?.addEventListener('click', () => closeModal('product-modal'));
    productModal?.addEventListener('click', event => {
        if (event.target === productModal) closeModal('product-modal');
    });
    document.querySelector('.modal-add-cart')?.addEventListener('click', event => {
        const button = event.currentTarget;
        const id = parseInt(button.getAttribute('data-add-to-cart'), 10);
        const image = button.getAttribute('data-image') || '';
        const product = state.allProducts.find(p => p.id === id);
        if (!product) return;
        addToCart(product.id, product.name, product.price, image);
        closeModal('product-modal');
    });

    document.addEventListener('keyup', event => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => modal.classList.remove('active'));
        }
    });

    loadData();
    document.getElementById('contact-form')?.addEventListener('submit', handleContactSubmit);
});

