const PRODUCTS_API = 'http://localhost:5000/api/products';

document.addEventListener('DOMContentLoaded', () => {
    // Check admin access
    const userStr = localStorage.getItem('shopnova_user');
    if (!userStr) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(userStr);
    if (!user.isAdmin) {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('add-product-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('add-btn');
            const alertEl = document.getElementById('admin-alert');
            
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...';
            
            const productData = {
                name: document.getElementById('prod-name').value,
                description: document.getElementById('prod-desc').value,
                price: parseFloat(document.getElementById('prod-price').value),
                stock: parseInt(document.getElementById('prod-stock').value),
                category: document.getElementById('prod-category').value,
                imageUrl: document.getElementById('prod-image').value
            };

            try {
                const res = await fetch(PRODUCTS_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify(productData)
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    alertEl.textContent = 'Product added successfully!';
                    alertEl.className = 'alert alert-success mt-3 shadow-sm';
                    alertEl.classList.remove('d-none');
                    form.reset();
                } else {
                    alertEl.textContent = data.message || 'Failed to add product';
                    alertEl.className = 'alert alert-danger mt-3 shadow-sm';
                    alertEl.classList.remove('d-none');
                }
            } catch (err) {
                alertEl.textContent = 'Network error. Backend might be down.';
                alertEl.className = 'alert alert-danger mt-3 shadow-sm';
                alertEl.classList.remove('d-none');
            }
            
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-plus-circle-fill me-2"></i>Publish Product';
            
            setTimeout(() => {
                alertEl.classList.add('d-none');
            }, 5000);
        });
    }
});
