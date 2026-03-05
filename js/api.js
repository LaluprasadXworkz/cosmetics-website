const API_URL = "https://makeup-api.herokuapp.com/api/v1/products.json";

let allProducts = [];
let displayedProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// Load products from API
async function loadProducts() {
    const container = document.getElementById("productContainer");
    if (!container) return;
    
    showLoadingSkeleton();
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Store all products (limit to 100 for performance)
        allProducts = data.slice(0, 100);
        
        // Display first page of products
        displayedProducts = allProducts.slice(0, productsPerPage);
        displayProducts(displayedProducts);
        
        // Populate brand filter
        if (document.getElementById('brandFilter')) {
            populateBrandFilter();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML = '<div class="col-12 text-center py-5"><h4>Failed to load products. Please refresh the page.</h4></div>';
    }
}

// Load featured products for homepage
async function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Get random 8 products
        const featured = data.sort(() => 0.5 - Math.random()).slice(0, 8);
        
        container.innerHTML = '';
        featured.forEach(product => {
            container.innerHTML += generateProductCard(product);
        });
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

// Load more products
function loadMoreProducts() {
    const start = displayedProducts.length;
    const end = start + productsPerPage;
    const newProducts = allProducts.slice(start, end);
    
    if (newProducts.length > 0) {
        displayedProducts = [...displayedProducts, ...newProducts];
        displayProducts(displayedProducts);
    } else {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = 'No More Products';
        }
    }
}

// Filter by category
function filterByCategory() {
    const category = document.getElementById('categoryFilter').value;
    const brand = document.getElementById('brandFilter').value;
    const price = document.getElementById('priceFilter').value;
    
    let filtered = allProducts;
    
    if (category) {
        filtered = filtered.filter(p => p.product_type === category);
    }
    
    if (brand) {
        filtered = filtered.filter(p => p.brand === brand);
    }
    
    if (price) {
        filtered = filtered.filter(p => {
            const productPrice = parseFloat(p.price) || 0;
            if (price === '0-10') return productPrice > 0 && productPrice < 10;
            if (price === '10-20') return productPrice >= 10 && productPrice < 20;
            if (price === '20-30') return productPrice >= 20 && productPrice < 30;
            if (price === '30-50') return productPrice >= 30 && productPrice < 50;
            if (price === '50-100') return productPrice >= 50 && productPrice < 100;
            if (price === '100+') return productPrice >= 100;
            return true;
        });
    }
    
    displayedProducts = filtered.slice(0, productsPerPage);
    displayProducts(displayedProducts);
    updateActiveFilters(category, brand, price);
}

// Filter by brand
function filterByBrand() {
    filterByCategory();
}

// Filter by price
function filterByPrice() {
    filterByCategory();
}

// Sort products
function sortProducts() {
    const sortBy = document.getElementById('sortFilter').value;
    let sorted = [...displayedProducts];
    
    switch(sortBy) {
        case 'price-low':
            sorted.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
            break;
        case 'price-high':
            sorted.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
            break;
        case 'name-asc':
            sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        case 'name-desc':
            sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
            break;
        case 'rating':
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        default:
            return;
    }
    
    displayProducts(sorted);
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayedProducts = allProducts.slice(0, productsPerPage);
        displayProducts(displayedProducts);
        return;
    }
    
    const filtered = allProducts.filter(p => 
        (p.name && p.name.toLowerCase().includes(searchTerm)) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerm)) ||
        (p.product_type && p.product_type.toLowerCase().includes(searchTerm))
    );
    
    displayedProducts = filtered.slice(0, productsPerPage);
    displayProducts(displayedProducts);
}

// Load product details
async function loadProductDetails(productId) {
    const container = document.getElementById('productDetailContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-warning" role="status"></div><p class="mt-3">Loading product details...</p></div>';
    
    try {
        // Fetch specific product
        const response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products/${productId}.json`);
        const product = await response.json();
        
        const stars = generateStars(product.rating || 4.5);
        
        container.innerHTML = `
            <div class="col-lg-6 mb-4" data-aos="fade-right">
                <img src="${product.image_link || 'https://via.placeholder.com/600'}" class="img-fluid rounded-3" alt="${product.name}" style="max-height: 500px; object-fit: contain;">
            </div>
            <div class="col-lg-6" data-aos="fade-left">
                <h1 class="display-5 fw-bold">${product.name}</h1>
                <p class="text-muted">${product.brand || 'LuxeBeauty'}</p>
                <div class="rating mb-3">
                    ${stars} <span class="text-muted ms-2">(${(product.rating || 4.5).toFixed(1)} stars)</span>
                </div>
                <h2 class="display-6 fw-bold mb-4">$${product.price || '19.99'}</h2>
                <p class="mb-4">${product.description || 'No description available.'}</p>
                
                <div class="mb-4">
                    <label class="form-label fw-bold">Quantity</label>
                    <input type="number" class="form-control" value="1" min="1" id="quantity" style="width: 100px;">
                </div>
                
                <div class="d-flex gap-3">
                    <button class="btn btn-dark btn-lg flex-grow-1" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price || 19.99})">
                        Add to Cart
                    </button>
                    <button class="btn btn-outline-danger btn-lg" onclick="addToWishlist('${product.name.replace(/'/g, "\\'")}')">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                
                <div class="mt-4">
                    <h5>Product Details</h5>
                    <ul class="list-unstyled">
                        <li><i class="fas fa-check text-warning me-2"></i> Category: ${product.product_type || 'Makeup'}</li>
                        <li><i class="fas fa-check text-warning me-2"></i> Brand: ${product.brand || 'LuxeBeauty'}</li>
                    </ul>
                </div>
            </div>
        `;
        
        // Load related products
        if (product.product_type) {
            loadRelatedProducts(product.product_type, product.id);
        }
        
    } catch (error) {
        console.error('Error loading product details:', error);
        container.innerHTML = '<div class="col-12 text-center py-5"><h4>Error loading product details</h4></div>';
    }
}

// Load related products
async function loadRelatedProducts(category, currentId) {
    const container = document.getElementById('relatedProducts');
    if (!container) return;
    
    try {
        const response = await fetch(`${API_URL}?product_type=${category}`);
        const products = await response.json();
        
        const related = products.filter(p => p.id != currentId).slice(0, 4);
        
        if (related.length === 0) {
            container.innerHTML = '<div class="col-12 text-center"><p>No related products found</p></div>';
            return;
        }
        
        container.innerHTML = '';
        related.forEach(p => {
            container.innerHTML += `
                <div class="col-md-3 col-6 mb-3">
                    <div class="card product-card h-100" onclick="viewProduct('${p.id}')">
                        <img src="${p.image_link || 'https://via.placeholder.com/300'}" class="card-img-top product-image" alt="${p.name}" style="height: 150px; object-fit: contain; cursor: pointer;">
                        <div class="card-body p-2">
                            <h6 class="product-title small">${p.name.substring(0, 30)}</h6>
                            <p class="fw-bold mb-0">$${p.price || '19.99'}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
    } catch (error) {
        console.error('Error loading related products:', error);
        container.innerHTML = '<div class="col-12 text-center"><p>Failed to load related products</p></div>';
    }
}

// Populate brand filter
function populateBrandFilter() {
    const brands = [...new Set(allProducts.map(p => p.brand).filter(b => b))];
    const select = document.getElementById('brandFilter');
    
    if (!select) return;
    
    select.innerHTML = '<option value="">All Brands</option>';
    brands.sort().forEach(brand => {
        select.innerHTML += `<option value="${brand}">${brand}</option>`;
    });
}

// Update active filters display
function updateActiveFilters(category, brand, price) {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    
    let html = '';
    if (category) html += `<span class="badge bg-dark me-2 mb-2">Category: ${category} <i class="fas fa-times ms-2" style="cursor: pointer;" onclick="clearFilter('category')"></i></span>`;
    if (brand) html += `<span class="badge bg-dark me-2 mb-2">Brand: ${brand} <i class="fas fa-times ms-2" style="cursor: pointer;" onclick="clearFilter('brand')"></i></span>`;
    if (price) html += `<span class="badge bg-dark me-2 mb-2">Price: ${price} <i class="fas fa-times ms-2" style="cursor: pointer;" onclick="clearFilter('price')"></i></span>`;
    
    container.innerHTML = html;
}

// Clear filter
function clearFilter(filter) {
    if (filter === 'category') {
        document.getElementById('categoryFilter').value = '';
    } else if (filter === 'brand') {
        document.getElementById('brandFilter').value = '';
    } else if (filter === 'price') {
        document.getElementById('priceFilter').value = '';
    }
    filterByCategory();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load products if on products page
    if (document.getElementById('productContainer')) {
        loadProducts();
    }
    
    // Load featured products if on homepage
    if (document.getElementById('featuredProducts')) {
        loadFeaturedProducts();
    }
});