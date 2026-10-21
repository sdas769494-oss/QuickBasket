

/* ===================================
   QUICKBASKET - COMPLETE FRONTEND DEMO
=================================== */

const products = [
  { id: 1, name: "Fresh Apples", category: "Fruits", price: 120, unit: "1 kg", emoji: "🍎", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop", badge: "Fresh pick" },
  { id: 2, name: "Bananas", category: "Fruits", price: 50, unit: "6 pcs", emoji: "🍌", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop", badge: "Popular" },
  { id: 3, name: "Oranges", category: "Fruits", price: 80, unit: "1 kg", emoji: "🍊", image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&auto=format&fit=crop" },
  { id: 4, name: "Fresh Milk", category: "Dairy", price: 30, unit: "500 ml", emoji: "🥛", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop", badge: "Everyday" },
  { id: 5, name: "Cheese", category: "Dairy", price: 95, unit: "200 g", emoji: "🧀", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop" },
  { id: 6, name: "Brown Bread", category: "Bakery", price: 45, unit: "1 pack", emoji: "🍞", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop" },
  { id: 7, name: "Potato Chips", category: "Snacks", price: 20, unit: "1 pack", emoji: "🍟", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop" },
  { id: 8, name: "Chocolate", category: "Snacks", price: 40, unit: "1 bar", emoji: "🍫", image: "https://images.unsplash.com/photo-1548907040-4d42e3c7c7e1?w=500&auto=format&fit=crop" },
  { id: 9, name: "Carrots", category: "Vegetables", price: 40, unit: "500 g", emoji: "🥕", image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=500&auto=format&fit=crop" },
  { id: 10, name: "Broccoli", category: "Vegetables", price: 60, unit: "1 pc", emoji: "🥦", image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&auto=format&fit=crop" },
  { id: 11, name: "Orange Juice", category: "Drinks", price: 75, unit: "1 bottle", emoji: "🧃", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop" },
  { id: 12, name: "Eggs", category: "Dairy", price: 72, unit: "6 pcs", emoji: "🥚", image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop" },
  { id: 13, name: "Tomatoes", category: "Vegetables", price: 35, unit: "500 g", emoji: "🍅", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&auto=format&fit=crop" },
  { id: 14, name: "Green Grapes", category: "Fruits", price: 90, unit: "500 g", emoji: "🍇", image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&auto=format&fit=crop" },
  { id: 15, name: "Cookies", category: "Snacks", price: 35, unit: "1 pack", emoji: "🍪", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop" },
  { id: 16, name: "Fresh Lemons", category: "Vegetables", price: 30, unit: "250 g", emoji: "🍋", image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?w=500&auto=format&fit=crop" }
];

const categories = [
  { name: "All", emoji: "🛒" },
  { name: "Fruits", emoji: "🍎" },
  { name: "Vegetables", emoji: "🥦" },
  { name: "Dairy", emoji: "🥛" },
  { name: "Bakery", emoji: "🍞" },
  { name: "Snacks", emoji: "🍿" },
  { name: "Drinks", emoji: "🧃" }
];

/* ---------- SAFE DOM HELPERS ---------- */

const $ = selector => document.querySelector(selector);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    showToast("Browser storage is unavailable.");
    return false;
  }
}

function money(value) {
  return "₹" + value.toLocaleString("en-IN");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

/* ---------- APPLICATION STATE ---------- */

let selectedCategory = "All";
let searchTerm = "";
let sortMode = "default";

const savedCart = readStorage("qb_cart", {});
let cart = {};

for (const product of products) {
  const quantity = Number(savedCart?.[product.id]);
  if (Number.isSafeInteger(quantity) && quantity > 0 && quantity <= 99) {
    cart[product.id] = quantity;
  }
}

let profile = readStorage("qb_profile", null);
let deliveryLocation = readStorage("qb_location", "Your location");
let orders = readStorage("qb_demo_orders", []);

if (!Array.isArray(orders)) orders = [];

let toastTimer;

function persistCart() {
  saveStorage("qb_cart", cart);
}

/* ---------- CATEGORIES ---------- */

function renderCategories() {
  $("#categories").innerHTML = categories.map(category => `
    <button
      class="category-card ${selectedCategory === category.name ? "active" : ""}"
      data-category="${category.name}"
      aria-pressed="${selectedCategory === category.name}">
      <span class="category-emoji">${category.emoji}</span>
      <strong>${category.name === "All" ? "All products" : category.name}</strong>
    </button>
  `).join("");
}

/* ---------- PRODUCTS ---------- */

function getFilteredProducts() {
  let list = products.filter(product => {
    const categoryMatch =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const text = {product.name} {product.category}.toLowerCase();
    const searchMatch = text.includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  if (sortMode === "low") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortMode === "high") {
    list.sort((a, b) => b.price - a.price);
  } else if (sortMode === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

function renderProducts() {
  const list = getFilteredProducts();

  $("#productTitle").textContent =
    selectedCategory === "All"
      ? "Popular products"
      : selectedCategory;

  $("#activeFilters").textContent =
    ${list.length} product{list.length === 1 ? "" : "s"} found;

  ("emptyMessage").hidden = list.length !== 0;

  ("productGrid").innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-photo">
        <img
          src="{escapeHTML(product.image)}"
          alt="{escapeHTML(product.name)}"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';">
        <span class="fallback-emoji">${product.emoji}</span>
        ${product.badge
          ? <span class="product-badge">${escapeHTML(product.badge)}</span>
          : ""}
      </div>
      <div class="product-info">
        <span class="product-unit">${escapeHTML(product.unit)}</span>
        <h3>${escapeHTML(product.name)}</h3>
        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
          <button class="add-btn" data-add="${product.id}">
            ${cart[product.id] ? ADD + ({cart[product.id]}) : "ADD +"}
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

/* ---------- CART ---------- */

function getCartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function getSubtotal() {
  return products.reduce(
    (sum, product) => sum + product.price * (cart[product.id] || 0),
    0
  );
}

function getDeliveryFee() {
  const subtotal = getSubtotal();
  return subtotal === 0 || subtotal >= 499 ? 0 : 25;
}

function renderCart() {
  const cartProducts = products.filter(product => cart[product.id] > 0);

  $("#cartCount").textContent = getCartCount();
  $("#subtotal").textContent = money(getSubtotal());
  $("#deliveryFee").textContent =
    getDeliveryFee() === 0 && getSubtotal() > 0
      ? "FREE"
      : money(getDeliveryFee());

  $("#cartTotal").textContent =
    money(getSubtotal() + getDeliveryFee());

  $("#checkoutTotal").textContent =
    money(getSubtotal() + getDeliveryFee());

  if (cartProducts.length === 0) {
    $("#cartItems").innerHTML = `
      <div class="empty-state">
        <div>🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add your favourite groceries to get started.</p>
      </div>
    `;
    return;
  }

  $("#cartItems").innerHTML = cartProducts.map(product => `
    <div class="cart-item">
      <img
        class="cart-item-photo"
        src="${escapeHTML(product.image)}"
        alt="${escapeHTML(product.name)}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';">
      <span class="cart-item-emoji">${product.emoji}</span>
      <div class="cart-item-info">
        <strong>${escapeHTML(product.name)}</strong>
        <small>${money(product.price)} × ${cart[product.id]}</small>
      </div>
      <div class="quantity-controls">
        <button data-minus="${product.id}" aria-label="Decrease quantity">−</button>
        <span>${cart[product.id]}</span>
        <button data-plus="${product.id}" aria-label="Increase quantity">+</button>
      </div>
    </div>
  `).join("");
}

function addToCart(id) {
  if (!products.some(product => product.id === id)) return;

  if ((cart[id] || 0) >= 99) {
    showToast("Maximum quantity is 99.");
    return;
  }

  cart[id] = (cart[id] || 0) + 1;
  persistCart();
  renderCart();
  renderProducts();
  showToast("Added to your cart!");
}

function changeQuantity(id, amount) {
  if (!products.some(product => product.id === id)) return;

  const next = (cart[id] || 0) + amount;

  if (next <= 0) {
    delete cart[id];
  } else if (next <= 99) {
    cart[id] = next;
  } else {
    showToast("Maximum quantity is 99.");
    return;
  }

  persistCart();
  renderCart();
  renderProducts();
}

/* ---------- DRAWER ---------- */

function openCart() {
  closeAllDialogs();

  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  $("#overlay").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  $("#overlay").classList.remove("show");
  document.body.style.overflow = "";
}

/* ---------- DIALOGS ---------- */

const dialogs = [
  ("#accountDialog"),
  ("#locationDialog"),
  ("#checkoutDialog"),
  ("#helpDialog")
];

function closeAllDialogs() {
  dialogs.forEach(dialog => {
    if (dialog.open) dialog.close();
  });
}

function showDialog(dialog) {
  closeCart();
  closeAllDialogs();
  dialog.showModal();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

/* ---------- SEARCH & FILTER EVENTS ---------- */

("categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;
  renderCategories();
  renderProducts();
});

("#productGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

("cartItems").addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");

  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
});

("searchInput").addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderProducts();
});

("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchTerm = $("#searchInput").value.trim();
  renderProducts();
  $("#products").scrollIntoView({ behavior: "smooth" });
});

("sortSelect").addEventListener("change", event => {
  sortMode = event.target.value;
  renderProducts();
});

("resetFilters").addEventListener("click", () => {
  selectedCategory = "All";
  searchTerm = "";
  sortMode = "default";

  ("searchInput").value = "";
  ("sortSelect").value = "default";

  renderCategories();
  renderProducts();
});

("cartBtn").addEventListener("click", openCart);
("closeCart").addEventListener("click", closeCart);
("verlay").addEventListener("click", closeCart);

/* ---------- LOCATION ---------- */

function updateLocation() {
  ("#locationLabel").textContent = deliveryLocation;
}

("locationBtn").addEventListener("click", () => {
  ("#locationInput").value =
    deliveryLocation === "Your location" ? "" : deliveryLocation;

  showDialog($("#locationDialog"));
});

("closeLocation").addEventListener("click", () => {
  ("#locationDialog").close();
});

("locationForm").addEventListener("submit", event => {
  event.preventDefault();

  const location = $("#locationInput").value.trim();
  if (!location) return;

  deliveryLocation = location;
  saveStorage("qb_location", deliveryLocation);
  updateLocation();

  ("locationDialog").close();
  showToast("Demo location saved.");
});

/* ---------- DEMO ACCOUNT ---------- */

function renderAccount() {
  if (profile && profile.name && profile.email) {
    ("accountBtn").textContent = 👤 ${profile.name.split(" ")[0]};
    ("accountName").value = profile.name;
    ("accountEmail").value = profile.email;
    ("logoutBtn").hidden = false;
  } else {
    ("accountBtn").textContent = "👤 Account";
    ("accountName").value = "";
    ("accountEmail").value = "";
    ("logoutBtn").hidden = true;
  }
}

("#accountBtn").addEventListener("click", () => {
  ("accountMessage").textContent = "";
  renderAccount();
  showDialog($("#accountDialog"));
});

("closeAccount").addEventListener("click", () => {
  ("accountDialog").close();
});

("accountForm").addEventListener("submit", event => {
  event.preventDefault();

  profile = {
    name: ("accountName").value.trim(),
    email: ("accountEmail").value.trim()
  };

  if (!profile.name || !profile.email) return;

  saveStorage("qb_profile", profile);
  renderAccount();

  ("#accountMessage").textContent =
    "Demo profile saved in this browser. This is not real authentication.";

  showToast("Demo profile saved.");
});

$("#logoutBtn").addEventListener("click", () => {
  profile = null;

  try {
    localStorage.removeItem("qb_profile");
  } catch {}

  renderAccount();
  ("#accountMessage").textContent = "Demo profile cleared.";
});

/* ---------- CHECKOUT & DEMO ORDERS ---------- */

("checkoutBtn").addEventListener("click", () => {
  if (getCartCount() === 0) {
    showToast("Please add products to your cart first.");
    return;
  }

  ("checkoutTotal").textContent =
    money(getSubtotal() + getDeliveryFee());

  ("checkoutMessage").textContent = "";

  if (profile) {
    ("#customerName").value = profile.name;
  }

  showDialog(("checkoutDialog"));
});

("closeCheckout").addEventListener("click", () => {
  ("checkoutDialog").close();
});

("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();

  if (getCartCount() === 0) {
    ("#checkoutDialog").close();
    showToast("Your cart is empty.");
    return;
  }

  const phone = ("customerPhone").value.trim();

  if (!/^[0-9]{10}$/.test(phone)) {
    ("#checkoutMessage").textContent =
      "Please enter a valid 10-digit phone number.";
    return;
  }

  const order = {
    id: "QB" + Date.now().toString().slice(-8),
    date: new Date().toISOString(),
    customer: ("customerName").value.trim(),
    phone: phone,
    address: ("customerAddress").value.trim(),
    items: products
      .filter(product => cart[product.id] > 0)
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: cart[product.id]
      })),
    subtotal: getSubtotal(),
    delivery: getDeliveryFee(),
    total: getSubtotal() + getDeliveryFee(),
    status: "Demo order created"
  };

  if (!order.customer || !order.address) {
    ("checkoutMessage").textContent =
      "Please complete all required fields.";
    return;
  }

  orders.push(order);

  if (!saveStorage("qb_demo_orders", orders)) {
    orders.pop();
    $("#checkoutMessage").textContent =
      "Could not save this demo order. Check browser storage.";
    return;
  }

  cart = {};
  persistCart();
  renderCart();
  renderProducts();

  ("#checkoutForm").reset();
  ("#checkoutDialog").close();

  showToast(Demo order {order.id} saved in this browser.);
  alert(
    Demo order created!\nOrder ID: {order.id}\nTotal: {money(order.total)}\n\nNo real delivery or payment was requested.
  );
});

/* ---------- HELP & KEYBOARD ---------- */

("footerHelp").addEventListener("click", () => {
  showDialog(("#helpDialog"));
});

("closeHelp").addEventListener("click", () => {
  ("#helpDialog").close();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
  }
});

/* ---------- START WEBSITE ---------- */

renderCategories();
renderProducts();
renderCart();
renderAccount();
updateLocation();