// Main initialization file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true
        });
    }
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.offer-banner form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                if (typeof showToast !== 'undefined') {
                    showToast('Thank you for subscribing!');
                } else {
                    alert('Thank you for subscribing!');
                }
                this.reset();
            }
        });
    }
    
    // Close cart/wishlist when clicking outside
    document.addEventListener('click', function(e) {
        const cart = document.getElementById('cartSidebar');
        const wishlist = document.getElementById('wishlistPanel');
        
        if (cart && cart.classList.contains('active')) {
            const cartBtn = e.target.closest('[onclick="toggleCart()"]');
            const isCartClick = cart.contains(e.target) || cartBtn;
            
            if (!isCartClick) {
                toggleCart();
            }
        }
        
        if (wishlist && wishlist.classList.contains('active')) {
            const wishlistBtn = e.target.closest('[onclick="toggleWishlist()"]');
            const isWishlistClick = wishlist.contains(e.target) || wishlistBtn;
            
            if (!isWishlistClick) {
                toggleWishlist();
            }
        }
    });
});

// Back to top button functionality
window.onscroll = function() {
    let btn = document.getElementById('backToTop');
    
    if (!btn) {
        btn = createBackToTopButton();
    }
    
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }
};

function createBackToTopButton() {
    // Check if button already exists
    let btn = document.getElementById('backToTop');
    if (btn) return btn;
    
    btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Back to top');
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        display: none;
        z-index: 99;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        background-color: #ffd700;
        color: black;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.3s;
    `;
    
    btn.onmouseover = function() {
        this.style.backgroundColor = '#b8860b';
        this.style.transform = 'translateY(-3px)';
    };
    
    btn.onmouseout = function() {
        this.style.backgroundColor = '#ffd700';
        this.style.transform = 'translateY(0)';
    };
    
    btn.onclick = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    document.body.appendChild(btn);
    return btn;
}