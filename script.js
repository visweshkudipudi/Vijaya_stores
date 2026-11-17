// ==========================================
// 1. EASY STORE CONFIGURATION (Edit Here!)
// ==========================================
const SHOP_CONFIG = {
  name: "Vijaya Store",
  defaultWhatsapp: "918331863654", // Permanent fallback: 91 + 10-digit WhatsApp number
  defaultUpiId: "8331863654@ybl", // Permanent fallback: Shop UPI ID
  adminPin: "24l4", // Change to a private PIN before uploading to GitHub!
};

const STORAGE_KEY = "vijaya_store_products_v2";
const UPI_STORAGE_KEY = "vijaya_store_upi_v1";
const WA_STORAGE_KEY = "vijaya_store_wa_v1";

const CATEGORIES = [
  "All",
  "Kirana",
  "Cool Drinks",
  "Stationery",
  "Fancy",
  "Xerox & Prints",
  "Bills & Recharges",
];

const DEFAULT_PRODUCTS = [
  // Kirana
  { id: 1, name: "Sona Masoori Rice", unit: "1 kg", price: 58, category: "Kirana", inStock: true, image: "" },
  { id: 2, name: "Toor Dal (Kandi Pappu)", unit: "1 kg", price: 145, category: "Kirana", inStock: true, image: "" },
  { id: 3, name: "Sunflower Cooking Oil", unit: "1 Litre Pouch", price: 135, category: "Kirana", inStock: true, image: "" },
  { id: 4, name: "Aashirvaad Atta", unit: "1 kg Pack", price: 62, category: "Kirana", inStock: true, image: "" },
  { id: 5, name: "Sugar / Salt Combo", unit: "1 kg each", price: 68, category: "Kirana", inStock: true, image: "" },

  // Cool Drinks
  { id: 6, name: "Sprite / Thums Up Chilled", unit: "750 ml Bottle", price: 45, category: "Cool Drinks", inStock: true, image: "" },
  { id: 7, name: "Maaza Mango Drink", unit: "600 ml Bottle", price: 40, category: "Cool Drinks", inStock: true, image: "" },
  { id: 8, name: "Bisleri Mineral Water", unit: "1 Litre Bottle", price: 20, category: "Cool Drinks", inStock: true, image: "" },
  { id: 9, name: "Sting Energy Drink", unit: "250 ml Bottle", price: 20, category: "Cool Drinks", inStock: true, image: "" },

  // Stationery
  { id: 10, name: "Classmate Long Notebook", unit: "180 Pages Ruled", price: 55, category: "Stationery", inStock: true, image: "" },
  { id: 11, name: "Reynolds / Hauser Ball Pen Pack", unit: "Pack of 5", price: 50, category: "Stationery", inStock: true, image: "" },
  { id: 12, name: "A4 Printing Paper Bundle", unit: "100 Sheets", price: 85, category: "Stationery", inStock: true, image: "" },
  { id: 13, name: "Geometry Box & Scale Set", unit: "1 Set", price: 95, category: "Stationery", inStock: true, image: "" },

  // Fancy
  { id: 14, name: "Bangles & Hair Clips Set", unit: "Assorted Pack", price: 60, category: "Fancy", inStock: true, image: "" },
  { id: 15, name: "Gift Wrapping & Greeting Card", unit: "Combo", price: 45, category: "Fancy", inStock: true, image: "" },
  { id: 16, name: "Ladies Purse / Pouch", unit: "1 Piece", price: 150, category: "Fancy", inStock: true, image: "" },

  // Xerox & Prints
  { id: 17, name: "B&W Xerox / Printout", unit: "Per Page", price: 2, category: "Xerox & Prints", inStock: true, image: "" },
  { id: 18, name: "Color Printout (A4)", unit: "Per Page", price: 10, category: "Xerox & Prints", inStock: true, image: "" },
  { id: 19, name: "ID Card / Document Lamination", unit: "Per Sheet", price: 25, category: "Xerox & Prints", inStock: true, image: "" },
  { id: 20, name: "Spiral Binding (Project Record)", unit: "Per Book", price: 40, category: "Xerox & Prints", inStock: true, image: "" },

  // Bills & Recharges
  { id: 21, name: "Electricity / Current Bill Service", unit: "Instant Receipt", price: 10, category: "Bills & Recharges", inStock: true, image: "" },
  { id: 22, name: "Mobile Recharge (All Networks)", unit: "Service Counter", price: 0, category: "Bills & Recharges", inStock: true, image: "" },
  { id: 23, name: "DTH Monthly Recharge", unit: "Service Counter", price: 0, category: "Bills & Recharges", inStock: true, image: "" },
  { id: 24, name: "UPI Money Transfer / Cash Service", unit: "Counter Service", price: 10, category: "Bills & Recharges", inStock: true, image: "" },
];

// Load saved products, UPI ID & WhatsApp number
let PRODUCTS = JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(DEFAULT_PRODUCTS);
let ACTIVE_UPI_ID = localStorage.getItem(UPI_STORAGE_KEY) || SHOP_CONFIG.defaultUpiId;
let ACTIVE_WHATSAPP = localStorage.getItem(WA_STORAGE_KEY) || SHOP_CONFIG.defaultWhatsapp;

let selectedCategory = "All";
let cart = [];

// ==========================================
// 2. Storefront Rendering & Image Fallback
// ==========================================
function renderProductImageBox(p) {
  const imgSrc = (p.image || "").trim();
  if (!imgSrc) {
    return `
      <div class="prod-img-wrap">
        <div class="no-img-placeholder">
          <span>🖼️</span>
          <p>No image available for this product</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="prod-img-wrap">
      <img
        src="${imgSrc}"
        alt="${p.name}"
        loading="lazy"
        onerror="this.parentElement.innerHTML='<div class=\\'no-img-placeholder\\'><span>🖼️</span><p>No image available for this product</p></div>'"
      />
    </div>
  `;
}

function syncUpiDisplay() {
  const disp = document.getElementById("display-upi-id");
  const cartDisp = document.getElementById("cart-upi-id");
  if (disp) disp.textContent = ACTIVE_UPI_ID;
  if (cartDisp) cartDisp.textContent = ACTIVE_UPI_ID;
  updateUpiPaymentWidgets();
}

function copyUpiId() {
  navigator.clipboard?.writeText(ACTIVE_UPI_ID);
  alert(`✅ Copied UPI ID: ${ACTIVE_UPI_ID}`);
}

function renderCategories() {
  const bar = document.getElementById("category-bar");
  bar.innerHTML = CATEGORIES.map(
    (cat) => `
      <button class="cat-btn ${cat === selectedCategory ? "active" : ""}" onclick="selectCategory('${cat}')">
        ${cat}
      </button>
    `
  ).join("");
}

function selectCategory(cat) {
  selectedCategory = cat;
  renderCategories();
  renderProducts();
}

function renderProducts() {
  const query = document.getElementById("search-input").value.toLowerCase().trim();
  const grid = document.getElementById("product-grid");

  const filtered = PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:#94a3b8; grid-column: 1 / -1;">No matching items found. Try another search or category.</p>`;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (p) => `
      <div class="product-card" style="opacity:${p.inStock === false ? "0.65" : "1"}">
        <div>
          ${renderProductImageBox(p)}
          <span class="prod-cat">${p.category}</span>
          <h4 class="prod-title">${p.name}</h4>
          <p class="prod-unit">${p.unit}</p>
        </div>
        <div class="prod-bottom">
          <span class="prod-price">${p.price > 0 ? "₹" + p.price : "Counter Rate"}</span>
          ${
            p.inStock === false
              ? `<span class="out-stock-badge">Out of Stock</span>`
              : `<button class="add-btn" onclick="addToCart(${p.id})">+ Add</button>`
          }
        </div>
      </div>
    `
    )
    .join("");
}

function addToCart(id) {
  const item = PRODUCTS.find((p) => p.id === id);
  if (!item || item.inStock === false) return;
  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartUI();
}

function changeQty(id, delta) {
  const idx = cart.findIndex((c) => c.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartUI();
}

function updateUpiPaymentWidgets() {
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const upiUri = `upi://pay?pa=${encodeURIComponent(ACTIVE_UPI_ID)}&pn=${encodeURIComponent(
    SHOP_CONFIG.name
  )}&am=${totalPrice.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Vijaya Store Pre-Order")}`;

  const qrImg = document.getElementById("upi-qr-img");
  const deepLink = document.getElementById("upi-deep-link");
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}`;
  }
  if (deepLink) {
    deepLink.href = upiUri;
    deepLink.onclick = function (e) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      navigator.clipboard?.writeText(ACTIVE_UPI_ID);
      if (!isMobile) {
        e.preventDefault();
        alert(
          `📱 You are on a PC/Laptop!\n\n✅ Copied UPI ID: ${ACTIVE_UPI_ID}\n💰 Amount to Pay: ₹${totalPrice}\n\nScan the QR code with PhonePe / GPay / Paytm on your phone, or open this site on mobile.`
        );
      }
    };
  }
}

function toggleUpiBox() {
  const selected = document.querySelector('input[name="payMode"]:checked').value;
  const box = document.getElementById("upi-checkout-box");
  box.style.display = selected === "Paid Online via UPI" ? "flex" : "none";
  updateUpiPaymentWidgets();
}

function updateCartUI() {
  const countEl = document.getElementById("cart-count");
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  countEl.textContent = totalQty;
  totalEl.textContent = totalPrice;
  updateUpiPaymentWidgets();

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p style="color:#94a3b8; text-align:center; margin-top:2rem;">Your pre-order list is empty. Add items from the store!</p>`;
    return;
  }

  itemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br />
          <span style="color:#94a3b8;">₹${item.price} × ${item.qty}</span>
        </div>
        <div class="qty-controls">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span style="margin:0 6px;">${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `
    )
    .join("");
}

function toggleCart() {
  document.getElementById("cart-drawer").classList.toggle("open");
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Please add at least one item to your pre-order list first!");
    return;
  }
  const custName = document.getElementById("customer-name").value.trim() || "Customer";
  const pickupTime = document.getElementById("customer-note").value.trim() || "Coming soon to counter";
  const payMode = document.querySelector('input[name="payMode"]:checked').value;
  const utrNo = document.getElementById("upi-utr-input").value.trim();
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (payMode === "Paid Online via UPI" && !utrNo) {
    alert("Please enter your 12-digit UPI Ref / UTR number after paying, or select 'Pay at Counter'.");
    return;
  }

  const paymentLine =
    payMode === "Paid Online via UPI"
      ? `💳 *Payment:* Paid Online via UPI (UTR: ${utrNo})`
      : `💵 *Payment:* Will Pay at Counter (Cash / UPI)`;

  const lines = [
    `🛍️ *Counter Pre-Order — ${SHOP_CONFIG.name}*`,
    `👤 *Customer Name:* ${custName}`,
    `⏰ *Pickup Time:* ${pickupTime}`,
    `🏪 *Mode:* Self-Pickup & Manual Receipt at Counter (No Home Delivery)`,
    paymentLine,
    ``,
    `*Pre-Ordered Items:*`,
    ...cart.map((i, idx) => `${idx + 1}. ${i.name} (${i.unit}) × ${i.qty} = ₹${i.price * i.qty}`),
    ``,
    `💰 *Estimated Counter Total: ₹${totalPrice}*`,
  ];

  const url = `https://wa.me/${ACTIVE_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank");
}

function sendServiceRequest(event) {
  event.preventDefault();
  const type = document.getElementById("service-type").value;
  const number = document.getElementById("service-number").value.trim();
  const amount = document.getElementById("service-amount").value.trim();

  const msg = [
    `⚡ *Counter Service Pre-Booking — ${SHOP_CONFIG.name}*`,
    `📌 *Service:* ${type}`,
    `🔢 *Number / Details:* ${number}`,
    `💳 *Amount & Pickup Note:* ${amount}`,
    `🧾 *Mode:* Will settle & collect receipt manually at counter`,
  ].join("\n");

  const url = `https://wa.me/${ACTIVE_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

// ==========================================
// 3. Admin Image Compressor & Manager
// ==========================================
function compressImageToDataUrl(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const maxSize = 260;
      let width = img.width;
      let height = img.height;

      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function handleNewItemFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  compressImageToDataUrl(file, (dataUrl) => {
    document.getElementById("new-item-img").value = dataUrl;
    alert("✅ Photo ready! Click '+ Add' to add this item.");
  });
}

function handleRowImageUpload(idx, event) {
  const file = event.target.files[0];
  if (!file) return;
  compressImageToDataUrl(file, (dataUrl) => {
    document.getElementById(`edit-img-${idx}`).value = dataUrl;
    const previewCell = document.getElementById(`thumb-preview-${idx}`);
    if (previewCell) {
      previewCell.innerHTML = `<img src="${dataUrl}" class="admin-thumb" alt="Preview" />`;
    }
  });
}

function openAdminLogin() {
  document.getElementById("admin-pin-input").value = "";
  document.getElementById("admin-login-error").textContent = "";
  document.getElementById("admin-login-modal").classList.add("open");
  setTimeout(() => document.getElementById("admin-pin-input").focus(), 100);
}

function closeAdminLogin() {
  document.getElementById("admin-login-modal").classList.remove("open");
}

function verifyAdminPin() {
  const entered = document.getElementById("admin-pin-input").value.trim();
  if (entered === SHOP_CONFIG.adminPin) {
    closeAdminLogin();
    document.getElementById("admin-upi-input").value = ACTIVE_UPI_ID;
    document.getElementById("admin-wa-input").value = ACTIVE_WHATSAPP;
    renderAdminTable();
    document.getElementById("admin-panel-modal").classList.add("open");
  } else {
    document.getElementById("admin-login-error").textContent = "❌ Incorrect PIN. Try again.";
  }
}

function closeAdminPanel() {
  document.getElementById("admin-panel-modal").classList.remove("open");
}

function renderAdminTable() {
  const tbody = document.getElementById("admin-table-body");
  const catOptions = CATEGORIES.filter((c) => c !== "All");

  tbody.innerHTML = PRODUCTS.map((p, idx) => {
    const safeImg = (p.image || "").trim();
    const thumbHtml = safeImg
      ? `<img src="${safeImg}" class="admin-thumb" alt="${p.name}" />`
      : `<div class="admin-thumb">No Img</div>`;

    return `
      <tr>
        <td id="thumb-preview-${idx}">${thumbHtml}</td>
        <td>
          <div class="admin-img-cell">
            <input type="text" id="edit-img-${idx}" value="${safeImg}" placeholder="Paste URL or upload" />
            <label class="file-upload-btn" title="Upload photo">
              📷
              <input type="file" accept="image/*" hidden onchange="handleRowImageUpload(${idx}, event)" />
            </label>
          </div>
        </td>
        <td><input type="text" id="edit-name-${idx}" value="${p.name}" /></td>
        <td><input type="text" id="edit-unit-${idx}" value="${p.unit}" /></td>
        <td>
          <select id="edit-cat-${idx}">
            ${catOptions
              .map((c) => `<option value="${c}" ${c === p.category ? "selected" : ""}>${c}</option>`)
              .join("")}
          </select>
        </td>
        <td><input type="number" id="edit-price-${idx}" value="${p.price}" min="0" /></td>
        <td style="text-align:center;">
          <input type="checkbox" id="edit-stock-${idx}" ${p.inStock !== false ? "checked" : ""} />
        </td>
        <td><button class="del-row-btn" onclick="adminDeleteProduct(${idx})">🗑️</button></td>
      </tr>
    `;
  }).join("");
}

function saveAdminChanges() {
  const newUpi = document.getElementById("admin-upi-input").value.trim();
  const rawWa = document.getElementById("admin-wa-input").value.replace(/\D/g, "");

  if (newUpi) {
    ACTIVE_UPI_ID = newUpi;
    localStorage.setItem(UPI_STORAGE_KEY, ACTIVE_UPI_ID);
  }

  if (rawWa) {
    ACTIVE_WHATSAPP = rawWa.length === 10 ? "91" + rawWa : rawWa;
    localStorage.setItem(WA_STORAGE_KEY, ACTIVE_WHATSAPP);
  }

  PRODUCTS = PRODUCTS.map((p, idx) => ({
    ...p,
    image: document.getElementById(`edit-img-${idx}`).value.trim(),
    name: document.getElementById(`edit-name-${idx}`).value.trim() || p.name,
    unit: document.getElementById(`edit-unit-${idx}`).value.trim() || p.unit,
    category: document.getElementById(`edit-cat-${idx}`).value,
    price: Number(document.getElementById(`edit-price-${idx}`).value) || 0,
    inStock: document.getElementById(`edit-stock-${idx}`).checked,
  }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCTS));
    syncUpiDisplay();
    renderProducts();
    closeAdminPanel();
    alert("✅ Saved all product photos, rates & store settings!");
  } catch (err) {
    alert("⚠️ Storage full because too many large photos were uploaded. Use image URLs for more items!");
  }
}

function adminAddProduct(event) {
  event.preventDefault();
  const name = document.getElementById("new-item-name").value.trim();
  const unit = document.getElementById("new-item-unit").value.trim();
  const category = document.getElementById("new-item-cat").value;
  const price = Number(document.getElementById("new-item-price").value) || 0;
  const image = document.getElementById("new-item-img").value.trim();

  const nextId = PRODUCTS.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  PRODUCTS.unshift({ id: nextId, name, unit, category, price, inStock: true, image });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCTS));
  event.target.reset();
  renderAdminTable();
  renderProducts();
}

function adminDeleteProduct(idx) {
  if (confirm(`Remove "${PRODUCTS[idx].name}" from the store?`)) {
    PRODUCTS.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCTS));
    renderAdminTable();
    renderProducts();
  }
}

function resetDefaultRates() {
  if (confirm("Reset all items, images and prices back to original defaults?")) {
    PRODUCTS = structuredClone(DEFAULT_PRODUCTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCTS));
    renderAdminTable();
    renderProducts();
  }
}

function exportRatesFile() {
  const backupData = {
    whatsappNumber: ACTIVE_WHATSAPP,
    upiId: ACTIVE_UPI_ID,
    products: PRODUCTS,
  };
  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "vijaya_store_backup.json";
  a.click();
}

// Shortcut: Press Ctrl + Shift + A anywhere to open Admin Login
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
    openAdminLogin();
  }
});

// Initialize Page
syncUpiDisplay();
renderCategories();
renderProducts();
updateCartUI();
