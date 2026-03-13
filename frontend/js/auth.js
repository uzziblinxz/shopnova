const AUTH_API_URL = "http://localhost:5000/api/auth";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }

  updateNavForAuth();
});

function showAlert(message, type = "danger") {
  const alertEl = document.getElementById("auth-alert");
  if (!alertEl) {
    console.warn("showAlert called but auth-alert element not found:", message);
    return;
  }
  alertEl.textContent = message;
  alertEl.className = `alert alert-${type} mt-3 mb-4`;
  alertEl.classList.remove("d-none");
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById("login-btn");
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  btn.disabled = true;
  btn.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

  try {
    const res = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text || res.statusText };
    }

    if (res.ok) {
      localStorage.setItem("shopnova_user", JSON.stringify(data));
      showAlert("Login successful!", "success");
      setTimeout(() => {
        window.location.href = data.isAdmin ? "admin.html" : "index.html";
      }, 1000);
    } else {
      showAlert(data.message || "Login failed");
      btn.disabled = false;
      btn.textContent = "Sign In";
    }
  } catch (err) {
    showAlert("Network error. Is the server running?");
    btn.disabled = false;
    btn.textContent = "Sign In";
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const btn = document.getElementById("signup-btn");
  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  btn.disabled = true;
  btn.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

  try {
    const res = await fetch(`${AUTH_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, password }),
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text || res.statusText };
    }

    if (res.ok) {
      localStorage.setItem("shopnova_user", JSON.stringify(data));
      showAlert("Account created successfully!", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      showAlert(data.message || "Registration failed");
      btn.disabled = false;
      btn.textContent = "Create Account";
    }
  } catch (err) {
    showAlert("Network error. Is the server running?");
    btn.disabled = false;
    btn.textContent = "Create Account";
  }
}

function updateNavForAuth() {
  const userStr = localStorage.getItem("shopnova_user");
  const navbarNav = document.querySelector(".navbar-nav");

  if (userStr && navbarNav) {
    try {
      const user = JSON.parse(userStr);
      console.log("User signed in:", user.name);

      // Check if login/sign up links exist and remove them
      const loginLinks = Array.from(
        navbarNav.querySelectorAll(".nav-link"),
      ).filter(
        (el) => el.textContent === "Sign In" || el.textContent === "Sign Up",
      );

      loginLinks.forEach((link) => link.parentElement.remove());

      // Add user info and logout
      if (!document.getElementById("nav-user-dropdown")) {
        const li = document.createElement("li");
        li.className = "nav-item dropdown";
        li.id = "nav-user-dropdown";
        let adminLink = user.isAdmin
          ? '<li><a class="dropdown-item text-primary fw-bold" href="admin.html"><i class="bi bi-shield-lock me-2"></i>Admin Panel</a></li><li><hr class="dropdown-divider"></li>'
          : "";

        li.innerHTML = `
                    <a class="nav-link dropdown-toggle fw-bold" href="#" role="button" data-bs-toggle="dropdown">
                        <i class="bi bi-person-circle me-1"></i> ${user.name}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end shadow">
                        ${adminLink}
                        <li><a class="dropdown-item cursor-pointer text-danger" id="logout-btn"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                    </ul>
                `;

        // Insert right before the cart link if it exists, otherwise append to end
        const cartLinkParent =
          navbarNav.querySelector(".cart-link")?.parentElement;
        if (cartLinkParent) {
          navbarNav.insertBefore(li, cartLinkParent);
        } else {
          navbarNav.appendChild(li);
        }

        document.getElementById("logout-btn").addEventListener("click", () => {
          localStorage.removeItem("shopnova_user");
          window.location.href = "index.html";
        });
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
      localStorage.removeItem("shopnova_user");
    }
  }
}
