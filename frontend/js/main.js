const API_URL = "http://localhost:5000/api/products";

// State
let products = [];
let cart = JSON.parse(localStorage.getItem("shopnova_cart")) || [];

// DOM Elements
const productListEl = document.getElementById("product-list");
const cartCountEl = document.getElementById("cart-count");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  fetchProducts();
});

// Fetch products from backend or use Fallback Data if backend is down
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.warn(
      "Backend API not reachable. Using fallback data for demonstration.",
      error,
    );
    useFallbackData();
  }
}

function useFallbackData() {
  products = [
    {
      _id: "1",
      name: "Wireless Noise-Canceling Headphones",
      description:
        "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
      price: 299.99,
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
    },
    {
      _id: "2",
      name: "Smart Fitness Watch",
      description:
        "Track your heart rate, sleep, and workouts with our water-resistant smart watch.",
      price: 149.99,
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
    },
    {
      _id: "3",
      name: "Mechanical Keyboard",
      description:
        "RGB backlit mechanical keyboard with tactile switches for satisfying typing.",
      price: 89.99,
      imageUrl:
        "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000",
    },
  ];
  renderProducts(products);
}

// Render Products to DOM
function renderProducts(productsToRender) {
  productListEl.innerHTML = "";

  if (productsToRender.length === 0) {
    productListEl.innerHTML =
      '<div class="col-12 text-center py-5"><h4>No products found.</h4></div>';
    return;
  }

  productsToRender.forEach((product, index) => {
    // Stagger animation delay
    const delay = index * 0.1;

    const col = document.createElement("div");
    col.className = "col-sm-6 col-lg-4";
    col.style.animation = `fadeInUp 0.6s ease forwards ${delay}s`;
    col.style.opacity = "0";

    col.innerHTML = `
            <div class="card product-card">
                <div class="product-img-wrapper">
                    <img src="${product.imageUrl}" class="product-img" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                </div>
                <div class="card-body d-flex flex-column text-start">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="text-muted small flex-grow-1">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="product-price">₦${product.price.toFixed(2)}</span>
                        <button class="btn btn-add-cart" onclick="addToCart('${product._id}')">
                            <i class="bi bi-cart-plus me-1"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    productListEl.appendChild(col);
  });
}

// Cart Functionality
function addToCart(productId) {
  const product = products.find((p) => p._id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item._id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartCount();

  // Add visual feedback (toast or simple alert fallback)
  alert(`${product.name} added to cart!`);
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
