// Display products in grid
function displayProducts(products) {
    const container = document.getElementById("productContainer");
    if (!container) return;

    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><h4>No products found</h4></div>';
        return;
    }

    products.forEach(p => {
        container.innerHTML += generateProductCard(p);
    });
}

// Generate product card HTML
function generateProductCard(p) {
    // Ensure we have valid data
    const name = p.name || 'Product Name';
    const price = p.price ? parseFloat(p.price).toFixed(2) : '10.00';
    const image = p.image_link || 'https://via.placeholder.com/300';
    const brand = p.brand || 'LuxeBeauty';
    const rating = p.rating || (Math.random() * 2 + 3); // Mock rating for demo
    const stars = generateStars(rating);
    const inStock = p.rating > 0 || Math.random() > 0.2; // Mock stock status
    const productId = p.id || Math.random().toString(36).substr(2, 9);
    
    // Escape special characters for onclick
    const safeName = name.replace(/'/g, "\\'");
    
    return `
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="card product-card h-100">
            ${!inStock ? '<span class="badge bg-danger position-absolute m-2">Out of Stock</span>' : ''}
            <img src="${image}" class="card-img-top product-image" 
                 alt="${name}" onclick="viewProduct('${productId}')" loading="lazy" style="cursor: pointer; height: 200px; object-fit: contain;">
            <div class="card-body">
                <h6 class="product-brand text-muted small">${brand}</h6>
                <h6 class="product-title">${name.substring(0, 40)}${name.length > 40 ? '...' : ''}</h6>
                
                <div class="rating mb-2">
                    ${stars} <span class="text-muted small">(${Math.floor(rating * 20)} reviews)</span>
                </div>
                
                <div class="price-section mb-2">
                    <span class="h5 fw-bold">$${price}</span>
                </div>
                
                <button class="btn btn-dark btn-sm w-100 mb-2" 
                        onclick="addToCart('${safeName}', ${price})"
                        ${!inStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                
                <button class="btn btn-outline-danger btn-sm w-100" 
                        onclick="toggleWishlistItem('${safeName}')">
                    <i class="fas fa-heart"></i> Wishlist
                </button>
            </div>
        </div>
    </div>
    `;
}

// Generate star ratings
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else if (i === fullStars && halfStar) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-warning"></i>';
        }
    }
    return stars;
}

// View product details
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Show loading skeleton
function showLoadingSkeleton() {
    const container = document.getElementById("productContainer");
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
        container.innerHTML += `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card skeleton-card h-100">
                <div class="skeleton-image" style="height: 200px;"></div>
                <div class="card-body">
                    <div class="skeleton-text w-50 mb-2" style="height: 20px;"></div>
                    <div class="skeleton-text w-75 mb-2" style="height: 20px;"></div>
                    <div class="skeleton-text w-25 mb-3" style="height: 20px;"></div>
                    <div class="skeleton-text w-100" style="height: 38px;"></div>
                </div>
            </div>
        </div>
        `;
    }
}

// Show toast notification (if bootstrap is available)
function showToast(message, type = 'success') {
    // Check if bootstrap toast is available
    if (typeof bootstrap === 'undefined') {
        alert(message);
        return;
    }
    
    // Check if toast container exists
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    const toastId = 'toast-' + Date.now();
    const bgColor = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : 'bg-warning';
    
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgColor} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    // Remove after hiding
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}



// // Generate product card HTML
// function generateProductCard(p) {
//     // Ensure we have valid data
//     const name = p.name || 'Product Name';
//     const price = p.price ? parseFloat(p.price).toFixed(2) : '19.99';
//     const image = p.image_link || 'https://via.placeholder.com/300';
//     const brand = p.brand || 'LuxeBeauty';
//     const rating = p.rating || 4.5;
//     const stars = generateStars(rating);
//     const productId = p.id;
    
//     // Escape special characters for onclick
//     const safeName = name.replace(/'/g, "\\'");
    
//     return `
//     <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
//         <div class="card product-card h-100">
//             <img src="${image}" class="card-img-top product-image" 
//                  alt="${name}" onclick="viewProduct('${productId}')" loading="lazy" style="cursor: pointer; height: 200px; object-fit: contain;">
//             <div class="card-body">
//                 <h6 class="product-brand text-muted small">${brand}</h6>
//                 <h6 class="product-title">${name.substring(0, 40)}${name.length > 40 ? '...' : ''}</h6>
                
//                 <div class="rating mb-2">
//                     ${stars} <span class="text-muted small">(${rating} stars)</span>
//                 </div>
                
//                 <div class="price-section mb-2">
//                     <span class="h5 fw-bold">$${price}</span>
//                 </div>
                
//                 <button class="btn btn-dark btn-sm w-100 mb-2" 
//                         onclick="addToCart('${safeName}', ${price})">
//                     <i class="fas fa-shopping-cart"></i> Add to Cart
//                 </button>
                
//                 <button class="btn btn-outline-danger btn-sm w-100" 
//                         onclick="toggleWishlistItem('${safeName}')">
//                     <i class="fas fa-heart"></i> Wishlist
//                 </button>
//             </div>
//         </div>
//     </div>
//     `;
// }