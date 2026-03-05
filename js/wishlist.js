// Initialize wishlist from localStorage
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Add to wishlist
function addToWishlist(name) {
    if (!wishlist.includes(name)) {
        wishlist.push(name);
        saveWishlist();
        updateWishlistUI();
        showToast(`${name} added to wishlist!`, 'success');
    } else {
        showToast(`${name} is already in your wishlist`, 'warning');
    }
}

// Remove from wishlist
function removeFromWishlist(name) {
    wishlist = wishlist.filter(item => item !== name);
    saveWishlist();
    updateWishlistUI();
    showToast(`${name} removed from wishlist`, 'warning');
}

// Toggle wishlist item
function toggleWishlistItem(name) {
    if (wishlist.includes(name)) {
        removeFromWishlist(name);
    } else {
        addToWishlist(name);
    }
}

// Clear wishlist
function clearWishlist() {
    if (wishlist.length > 0) {
        wishlist = [];
        saveWishlist();
        updateWishlistUI();
        showToast('Wishlist cleared', 'warning');
    }
}

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Update wishlist UI
function updateWishlistUI() {
    // Update wishlist count badge
    const wishlistCount = document.getElementById("wishlistCount");
    if (wishlistCount) {
        wishlistCount.innerText = wishlist.length;
    }

    // Update wishlist panel
    const wishlistItems = document.getElementById("wishlistItems");
    if (!wishlistItems) return;

    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<p class="text-center text-muted py-4">Your wishlist is empty</p>';
        return;
    }

    wishlistItems.innerHTML = "";
    wishlist.forEach(item => {
        wishlistItems.innerHTML += `
        <div class="wishlist-item d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <span>${item}</span>
            <button class="btn btn-sm text-danger" onclick="removeFromWishlist('${item.replace(/'/g, "\\'")}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        `;
    });
}

// Toggle wishlist panel
function toggleWishlist() {
    const panel = document.getElementById("wishlistPanel");
    if (panel) {
        panel.classList.toggle("active");
    }
}

// Initialize wishlist on page load
document.addEventListener('DOMContentLoaded', function() {
    updateWishlistUI();
});