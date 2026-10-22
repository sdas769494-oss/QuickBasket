const products = [
  {
    id: 1,
    name: "Fresh Apples",
    category: "Fruits",
    price: 120,
    unit: "1 kg",
    emoji: "🍎",
  },
  {
    id: 2,
    name: "Bananas",
    category: "Fruits",
    price: 50,
    unit: "6 pcs",
    emoji: "🍌",
  },
  {
    id: 3,
    name: "Fresh Oranges",
    category: "Fruits",
    price: 80,
    unit: "1 kg",
    emoji: "🍊",
  },
  {
    id: 4,
    name: "Fresh Milk",
    category: "Dairy",
    price: 30,
    unit: "500 ml",
    emoji: "🥛",
  },
  {
    id: 5,
    name: "Cheese",
    category: "Dairy",
    price: 95,
    unit: "200 g",
    emoji: "🧀",
  },
  {
    id: 6,
    name: "Brown Bread",
    category: "Bakery",
    price: 45,
    unit: "1 pack",
    emoji: "🍞",
  },
  {
    id: 7,
    name: "Potato Chips",
    category: "Snacks",
    price: 20,
    unit: "1 pack",
    emoji: "🍟",
  },
  {
    id: 8,
    name: "Chocolate",
    category: "Snacks",
    price: 40,
    unit: "1 bar",
    emoji: "🍫",
  },
  {
    id: 9,
    name: "Fresh Carrots",
    category: "Vegetables",
    price: 40,
    unit: "500 g",
    emoji: "🥕",
  },
  {
    id: 10,
    name: "Broccoli",
    category: "Vegetables",
    price: 60,
    unit: "1 pc",
    emoji: "🥦",
  },
  {
    id: 11,
    name: "Orange Juice",
    category: "Drinks",
    price: 75,
    unit: "1 bottle",
    emoji: "🧃",
  },
  {
    id: 12,
    name: "Eggs",
    category: "Dairy",
    price: 72,
    unit: "6 pcs",
    emoji: "🥚",
  },
];

const categories = [
  { name: "All", emoji: "🛒" },
  { name: "Fruits", emoji: "🍎" },
  { name: "Vegetables", emoji: "🥦" },
  { name: "Dairy", emoji: "🥛" },
  { name: "Bakery", emoji: "🍞" },
  { name: "Snacks", emoji: "🍿" },
  { name: "Drinks", emoji: "🧃" },
];

let selectedCategory = "All";
let cart = {};

const productGrid = document.getElementById("productGrid");
const categoryContainer = document.getElementById("categories");
const searchInput = document.getElementById("searchInput");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function renderCategories() {
  categoryContainer.innerHTML = categories
    .map(
      (category) => `
    <button class="category ${selectedCategory === category.name ? "active" : ""}"
      data-category="${category.name}">
      <span class="emoji">${category.emoji}</span>
      <strong>${category.name}</strong>
    </button>
  `,
    )
    .join("");
}

function renderProducts() {
  const search = searchInput.value.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  document.getElementById("emptyMessage").hidden = filtered.length > 0;

  productGrid.innerHTML = filtered
    .map(
      (product) => `
    <article class="product-card">
      <div class="product-image">${product.emoji}</div>
      <p class="unit">${product.unit}</p>
      <h3>${product.name}</h3>
      <div class="product-bottom">
        <strong>₹${product.price}</strong>
        <button class="add-btn" data-add="${product.id}">
          ${cart[product.id] ? "Added +" : "ADD +"}
        </button>
      </div>
    </article>
  `,
    )
    .join("");
}

function renderCart() {
  const cartProducts = products.filter((product) => cart[product.id]);

  const count = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );

  const total = cartProducts.reduce(
    (sum, product) => sum + product.price * cart[product.id],
    0,
  );

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = "₹${total}";

  document.getElementById("cartItems").innerHTML = cartProducts.length
    ? cartProducts
        .map(
          (product) => `
      <div class="cart-item">
        <span class="cart-emoji">${product.emoji}</span>
        <div class="cart-item-info">
          <strong>${product.name}</strong>
          <small>₹${product.price} × ${cart[product.id]}</small>
        </div>
        <div class="quantity-controls">
          <button data-minus="${product.id}" aria-label="Decrease quantity">−</button>
          <span>${cart[product.id]}</span>
          <button data-plus="${product.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
    `,
        )
        .join("")
    : "<p style='padding:20px 0'>Your cart is empty. Add some products!</p>";
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  renderProducts();
}

function changeQuantity(id, amount) {
  cart[id] = (cart[id] || 0) + amount;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  renderCart();
  renderProducts();
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.classList.add("show");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.classList.remove("show");
}

categoryContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;
  renderCategories();
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

document.getElementById("cartItems").addEventListener("click", (event) => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");

  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
});

searchInput.addEventListener("input", renderProducts);

document.getElementById("showAllBtn").addEventListener("click", () => {
  selectedCategory = "All";
  searchInput.value = "";
  renderCategories();
  renderProducts();
});

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

const loginDialog = document.getElementById("loginDialog");

document.getElementById("loginBtn").addEventListener("click", () => {
  loginDialog.showModal();
});

document.getElementById("closeLogin").addEventListener("click", () => {
  loginDialog.close();
});

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("userName").value.trim();

  document.getElementById("loginMessage").textContent =
    " Hello, ${name}! This is only a demo. Real account login is not connected yet. ";
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  const count = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );

  if (count === 0) {
    alert("Please add products to your cart first.");
    return;
  }

  alert(
    "Cart ready! Real checkout and order placement will be added in the next step.",
  );
});

renderCategories();
renderProducts();
renderCart();
