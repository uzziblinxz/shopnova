// State
let cart = JSON.parse(localStorage.getItem("shopnova_cart")) || [];

// DOM Elements
const cartItemsContainer = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const subtotalEl = document.getElementById("cart-subtotal");
const totalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();
});

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x fs-1 text-muted mb-3 d-block"></i>
                <h5 class="text-muted">Your cart is completely empty.</h5>
                <a href="index.html#products" class="btn btn-outline-primary mt-3">Continue Shopping</a>
            </div>
        `;
    checkoutBtn.disabled = true;
    updateTotals();
    return;
  }

  checkoutBtn.disabled = false;

  cart.forEach((item) => {
    const itemEl = document.createElement("div");
    itemEl.className = "d-flex align-items-center mb-4 border-bottom pb-4 row";

    itemEl.innerHTML = `
            <div class="col-3 col-md-2">
                <img src="${item.imageUrl}" alt="${item.name}" class="img-fluid rounded shadow-sm" onerror="this.src='https://via.placeholder.com/100?text=No+Image'">
            </div>
            <div class="col-9 col-md-10 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div class="ms-md-3 mb-2 mb-md-0 flex-grow-1">
                    <h5 class="mb-1 text-truncate" style="max-width: 250px;">${item.name}</h5>
                    <span class="text-muted small">${item.category || "Product"}</span>
                </div>
                
                <div class="d-flex align-items-center mx-md-4">
                    <button class="btn btn-sm btn-outline-secondary px-2 py-0 fs-5" onclick="updateQuantity('${item._id}', -1)">-</button>
                    <input type="text" class="form-control form-control-sm text-center mx-2" style="width: 50px;" value="${item.quantity}" readonly>
                    <button class="btn btn-sm btn-outline-secondary px-2 py-0 fs-5" onclick="updateQuantity('${item._id}', 1)">+</button>
                </div>

                <div class="ms-md-3 mt-2 mt-md-0">
                    <h5 class="mb-0 text-primary fw-bold">₦${(item.price * item.quantity).toFixed(2)}</h5>
                </div>
                
                <div class="ms-md-4 mt-2 mt-md-0">
                    <button class="btn btn-outline-danger btn-sm" onclick="removeItem('${item._id}')" title="Remove">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    cartItemsContainer.appendChild(itemEl);
  });

  updateTotals();
}

function updateQuantity(productId, change) {
  const itemIndex = cart.findIndex((item) => item._id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += change;

    // Remove if 0
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }

    saveCart();
    renderCart();
    updateCartCount();
  }
}

function removeItem(productId) {
  cart = cart.filter((item) => item._id !== productId);
  saveCart();
  renderCart();
  updateCartCount();
}

function updateTotals() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  subtotalEl.textContent = `₦${subtotal.toFixed(2)}`;
  totalEl.textContent = `₦${subtotal.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem("shopnova_cart", JSON.stringify(cart));
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
  }
}

// Mock Checkout Process
checkoutBtn.addEventListener("click", () => {
  alert(
    "Mock Checkout Successful! In a real app this would send an order to the Node.js backend.",
  );
  cart = [];
  saveCart();
  renderCart();
  updateCartCount();
});
