// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showToast(`Increased ${name} quantity in cart`, 'success');
    } else {
        cart.push({ 
            name, 
            price: parseFloat(price),
            quantity: 1,
            id: Date.now() + Math.random()
        });
        showToast(`${name} added to cart!`, 'success');
    }
    
    saveCart();
    updateCartUI();
}

// Remove from cart
function removeFromCart(itemId) {
    const item = cart.find(i => i.id === itemId);
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
    if (item) {
        showToast(`${item.name} removed from cart`, 'warning');
    }
}

// Update quantity
function updateQuantity(itemId, newQuantity) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartUI();
        }
    }
}

// Clear cart
function clearCart() {
    if (cart.length > 0) {
        cart = [];
        saveCart();
        updateCartUI();
        showToast('Cart cleared', 'warning');
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart UI
function updateCartUI() {
    // Update cart count badge
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;
    }

    // Update cart sidebar
    const cartItems = document.getElementById("cartItems");
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted py-4">Your cart is empty</p>';
        const cartTotal = document.getElementById("cartTotal");
        if (cartTotal) cartTotal.innerText = "0";
        return;
    }

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const itemTotal = Number(item.price) * item.quantity;
        total += itemTotal;
        
        cartItems.innerHTML += `
        <div class="cart-item d-flex mb-3 pb-2 border-bottom">
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between">
                    <h6 class="mb-0">${item.name}</h6>
                    <button class="btn btn-sm text-danger" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <p class="text-muted small mb-1">$${item.price} each</p>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <span class="ms-auto fw-bold">$${itemTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
        `;
    });

    const cartTotal = document.getElementById("cartTotal");
    if (cartTotal) {
        cartTotal.innerText = total.toFixed(2);
    }
}

// Toggle cart sidebar
function toggleCart() {
    const sidebar = document.getElementById("cartSidebar");
    if (sidebar) {
        sidebar.classList.toggle("active");
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
});