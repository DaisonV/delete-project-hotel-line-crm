const currency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});

const STORAGE_KEY = "hotel-line-crm-v1";
const API_ROOT = "/api";
let apiOnline = false;

const defaultProducts = [
  {
    id: "tooth-kit-35",
    name: "Зубной набор эконом",
    category: "Одноразовые наборы",
    unit: "шт.",
    price: 35,
    minQty: 2000,
    stock: 12000,
    description: "Зубная щетка и паста в индивидуальной упаковке.",
    image:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "tooth-kit-48",
    name: "Зубной набор стандарт",
    category: "Одноразовые наборы",
    unit: "шт.",
    price: 48,
    minQty: 1000,
    stock: 8000,
    description: "Зубной набор в упаковке для гостиничных номеров.",
    image:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "tooth-kit-55",
    name: "Зубной набор премиум",
    category: "Одноразовые наборы",
    unit: "шт.",
    price: 55,
    minQty: 1000,
    stock: 7000,
    description: "Зубной набор улучшенной комплектации в индивидуальной упаковке.",
    image:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "comb",
    name: "Расческа гостиничная",
    category: "Одноразовые наборы",
    unit: "шт.",
    price: 25,
    minQty: 2000,
    stock: 10000,
    description: "Расческа в индивидуальной упаковке для ванной комнаты.",
    image:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "razor",
    name: "Бритва одноразовая",
    category: "Одноразовые наборы",
    unit: "шт.",
    price: 70,
    minQty: 1000,
    stock: 6000,
    description: "Бритва в индивидуальной упаковке для гостиничных номеров.",
    image:
      "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "hygiene-kit",
    name: "Гигиенический набор",
    category: "Одноразовые наборы",
    unit: "шт.",
    price: 25,
    minQty: 1000,
    stock: 9000,
    description: "Компактный гигиенический набор в индивидуальном пакете.",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "shoe-sponge",
    name: "Губка для обуви",
    category: "Одноразовые наборы",
    unit: "шт.",
    price: 30,
    minQty: 1000,
    stock: 7000,
    description: "Губка для ухода за обувью в индивидуальной упаковке.",
    image:
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "shoehorn",
    name: "Ложка для обуви",
    category: "Одноразовые наборы",
    unit: "шт.",
    price: 30,
    minQty: 1000,
    stock: 7000,
    description: "Пластиковая ложка для обуви в индивидуальной упаковке.",
    image:
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "shower-cap",
    name: "Шапочка для душа",
    category: "Одноразовые наборы",
    unit: "шт.",
    price: 25,
    minQty: 1000,
    stock: 10000,
    description: "Одноразовая шапочка для душа в упаковке.",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "soap-15",
    name: "Мыло 15 г",
    category: "Косметика",
    unit: "шт.",
    price: 30,
    minQty: 1000,
    stock: 9000,
    description: "Гостиничное мыло 15 г в индивидуальной упаковке.",
    image:
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "soap-20",
    name: "Мыло 20 г",
    category: "Косметика",
    unit: "шт.",
    price: 35,
    minQty: 500,
    stock: 6000,
    description: "Гостиничное мыло 20 г в индивидуальной упаковке.",
    image:
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "shampoo-gel-20",
    name: "Шампунь и гель для душа 20 г",
    category: "Косметика",
    unit: "шт.",
    price: 40,
    minQty: 1000,
    stock: 5000,
    description: "Косметика 20 г, коробка 1000 шт.",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "shampoo-gel-30",
    name: "Шампунь и гель для душа 30 г",
    category: "Косметика",
    unit: "шт.",
    price: 50,
    minQty: 500,
    stock: 4000,
    description: "Косметика 30 г, коробка 500 шт.",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "shoe-bag",
    name: "Пакет для обуви",
    category: "Одноразовые наборы",
    unit: "шт.",
    price: 25,
    minQty: 1000,
    stock: 8000,
    description: "Пакет для обуви в гостиничный номер.",
    image:
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "slippers-285",
    name: "Тапочки одноразовые 28.5x11.5 см",
    category: "Тапочки",
    unit: "пара",
    price: 130,
    minQty: 700,
    stock: 3500,
    description: "Одноразовые тапочки, 700 пар в мешке.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "towel-35-75",
    name: "Полотенце 35x75 см",
    category: "Текстиль",
    unit: "шт.",
    price: 1000,
    minQty: 10,
    stock: 300,
    description: "Гостиничное полотенце 35x75 см.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "bath-towel-70-140",
    name: "Банное полотенце 70x140 см",
    category: "Текстиль",
    unit: "шт.",
    price: 3200,
    minQty: 10,
    stock: 240,
    description: "Банное полотенце для гостиниц, размер 70x140 см.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "floor-towel-50-80",
    name: "Полотенце для пола 50x80 см",
    category: "Текстиль",
    unit: "шт.",
    price: 1600,
    minQty: 10,
    stock: 260,
    description: "Полотенце для пола в ванную комнату, размер 50x80 см.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "bedding-set",
    name: "Комплект постельного белья",
    category: "Постельное белье",
    unit: "комплект",
    price: 17500,
    minQty: 5,
    stock: 120,
    description: "Подушковая накидка 53x83 см, простыня 260x280 см, пододеяльник 230x220 см. Состав 60% хлопок, 40%.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80",
  },
];

const stages = ["Новый", "Счет", "В работе", "Отгружен"];
const deprecatedProductIds = new Set([
  "linen-set",
  "towel-pack",
  "robe",
  "amenity-kit",
  "slippers",
  "cleaning-cart",
  "mini-bar",
  "key-cards",
]);
const page = document.body.dataset.page || "store";
const isAdminPage = page === "admin";

const demoState = {
  products: structuredClone(defaultProducts),
  cart: {},
  orders: [
    {
      id: 1012,
      clientName: "Boutique Hotel Arman",
      phone: "+7 701 222 45 45",
      status: "Счет",
      comment: "Нужен счет с доставкой до пятницы",
      createdAt: "2026-05-14",
      items: [
        { productId: "tooth-kit-48", qty: 1000, price: 48 },
        { productId: "shampoo-gel-20", qty: 1000, price: 40 },
        { productId: "slippers-285", qty: 700, price: 130 },
      ],
    },
    {
      id: 1013,
      clientName: "Avenue Apartments",
      phone: "+7 777 100 20 30",
      status: "В работе",
      comment: "Самовывоз со склада",
      createdAt: "2026-05-16",
      items: [
        { productId: "towel-35-75", qty: 20, price: 1000 },
        { productId: "bath-towel-70-140", qty: 20, price: 3200 },
        { productId: "bedding-set", qty: 5, price: 17500 },
      ],
    },
    {
      id: 1014,
      clientName: "Grand Plaza",
      phone: "+7 705 888 11 22",
      status: "Новый",
      comment: "Сравнивают поставщиков, интересует текстиль",
      createdAt: "2026-05-18",
      items: [
        { productId: "soap-20", qty: 500, price: 35 },
        { productId: "hygiene-kit", qty: 1000, price: 25 },
      ],
    },
  ],
  leads: [
    {
      id: 201,
      name: "Hotel Nomad",
      phone: "+7 747 331 10 10",
      need: "Комплектация номеров",
      value: 480000,
      status: "Новый",
    },
    {
      id: 202,
      name: "Resort Bay",
      phone: "+7 702 900 40 50",
      need: "Гостиничная косметика",
      value: 320000,
      status: "Счет",
    },
  ],
};

const elements = {
  pageTitle: document.querySelector("#pageTitle"),
  navButtons: document.querySelectorAll(".nav-button"),
  views: document.querySelectorAll(".view"),
  searchInput: document.querySelector("#searchInput"),
  categoryFilter: document.querySelector("#categoryFilter"),
  productGrid: document.querySelector("#productGrid"),
  productSettings: document.querySelector("#productSettings"),
  productForm: document.querySelector("#productForm"),
  cartCount: document.querySelector("#cartCount"),
  mobileCartBar: document.querySelector(".mobile-cart-bar"),
  mobileCartCount: document.querySelector("#mobileCartCount"),
  mobileCartTotal: document.querySelector("#mobileCartTotal"),
  cartItems: document.querySelector("#cartItems"),
  cartTotal: document.querySelector("#cartTotal"),
  checkoutForm: document.querySelector("#checkoutForm"),
  cartPanel: document.querySelector("#cartPanel"),
  openCartButtons: document.querySelectorAll("[data-open-cart]"),
  closeCartButtons: document.querySelectorAll("[data-close-cart]"),
  cartOverlay: document.querySelector(".cart-overlay"),
  pipeline: document.querySelector("#pipeline"),
  leadForm: document.querySelector("#leadForm"),
  ordersTable: document.querySelector("#ordersTable"),
  orderStatusFilter: document.querySelector("#orderStatusFilter"),
  clientList: document.querySelector("#clientList"),
  clientSearch: document.querySelector("#clientSearch"),
  seedButton: document.querySelector("#seedButton"),
  logoutButton: document.querySelector("#logoutButton"),
  toast: document.querySelector("#toast"),
  todayRevenue: document.querySelector("#todayRevenue"),
  metricRevenue: document.querySelector("#metricRevenue"),
  metricOrders: document.querySelector("#metricOrders"),
  metricClients: document.querySelector("#metricClients"),
  metricAverage: document.querySelector("#metricAverage"),
};

const viewTitles = {
  crm: "CRM панель",
  orders: "Заявки",
  clients: "Клиенты",
  products: "Товары",
};

let state = loadState();
let products = state.products;
normalizeCart();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return structuredClone(demoState);
  }

  try {
    const merged = { ...structuredClone(demoState), ...JSON.parse(saved) };
    merged.products = normalizeProducts(merged.products);
    return merged;
  } catch {
    return structuredClone(demoState);
  }
}

function normalizeProducts(savedProducts = []) {
  const normalizedDefaults = defaultProducts.map((defaultProduct) => {
    const savedProduct = savedProducts.find((product) => product.id === defaultProduct.id);
    return { ...defaultProduct, ...savedProduct };
  });
  const customProducts = savedProducts.filter((product) => {
    return (
      product.id &&
      !deprecatedProductIds.has(product.id) &&
      !defaultProducts.some((defaultProduct) => defaultProduct.id === product.id)
    );
  });

  return [...normalizedDefaults, ...customProducts];
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function apiRequest(path, options = {}) {
  if (window.location.protocol === "file:") return null;

  try {
    const response = await fetch(`${API_ROOT}${path}`, options);
    if (!response.ok) return null;
    apiOnline = true;
    if (response.status === 204) return true;
    return response.json();
  } catch {
    return null;
  }
}

async function syncFromApi() {
  const remoteState = await apiRequest("/state");
  if (!remoteState) return;

  state = {
    ...state,
    products: remoteState.products || [],
    orders: remoteState.orders || [],
    leads: remoteState.leads || [],
  };
  products = state.products;
  normalizeCart();
  renderCategories();
  render();
}

async function ensureAdminSession() {
  if (!isAdminPage || window.location.protocol === "file:") return;
  const session = await apiRequest("/session");
  if (session && !session.authenticated) {
    window.location.href = `/login.html?next=${encodeURIComponent(window.location.pathname)}`;
  }
}

function jsonOptions(body, method = "POST") {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function formatMoney(value) {
  return currency.format(value || 0);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function productById(productId) {
  return products.find((product) => product.id === productId);
}

function normalizeCart() {
  Object.entries(state.cart).forEach(([productId, qty]) => {
    const product = productById(productId);
    if (!product) {
      delete state.cart[productId];
      return;
    }

    if (qty < product.minQty) {
      state.cart[productId] = product.minQty;
    }
  });
}

function minQtyLabel(product) {
  return `Мин. заказ: ${product.minQty} ${product.unit}`;
}

function orderTotal(order) {
  return order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function showToast(message) {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2400);
}

function switchView(viewName) {
  if (!isAdminPage) return;
  elements.navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });
  elements.views.forEach((view) => {
    view.classList.toggle("active", view.id === `${viewName}View`);
  });
  elements.pageTitle.textContent = viewTitles[viewName] || viewTitles.crm;
  render();
}

function renderCategories() {
  if (!elements.categoryFilter) return;
  const selectedCategory = elements.categoryFilter.value || "Все";
  const categories = ["Все", ...new Set(products.map((product) => product.category))];
  elements.categoryFilter.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join("");
  elements.categoryFilter.value = categories.includes(selectedCategory) ? selectedCategory : "Все";
}

function renderProducts() {
  if (!elements.productGrid) return;
  const search = elements.searchInput.value.trim().toLowerCase();
  const category = elements.categoryFilter.value || "Все";
  const filtered = products.filter((product) => {
    const matchesCategory = category === "Все" || product.category === category;
    const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    return matchesCategory && haystack.includes(search);
  });

  elements.productGrid.innerHTML =
    filtered
      .map((product) => {
        return `
          <article class="product-card">
            <div class="product-photo">
              <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
              <span class="product-badge">${escapeHtml(product.category)}</span>
            </div>
            <div>
              <h3>${escapeHtml(product.name)}</h3>
              <p>${escapeHtml(product.description)}</p>
            </div>
            <span class="min-order">${escapeHtml(minQtyLabel(product))}</span>
            <div class="price-row">
              <div>
                <strong>${formatMoney(product.price)}</strong>
                <span>за ${escapeHtml(product.unit)}</span>
              </div>
            </div>
            <button class="primary-button full" type="button" data-add-product="${escapeHtml(product.id)}">
              Добавить
            </button>
          </article>
        `;
      })
      .join("") || `<div class="empty-state">Товары не найдены</div>`;
}

function renderCart() {
  if (!elements.cartItems || !elements.cartTotal || !elements.cartCount) return;
  const entries = Object.entries(state.cart);
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [productId, qty]) => {
    const product = productById(productId);
    return sum + product.price * qty;
  }, 0);

  elements.cartCount.textContent = count;
  elements.cartTotal.textContent = formatMoney(total);
  if (elements.mobileCartCount && elements.mobileCartTotal && elements.mobileCartBar) {
    elements.mobileCartCount.textContent = count;
    elements.mobileCartTotal.textContent = formatMoney(total);
    elements.mobileCartBar.classList.toggle("has-items", count > 0);
  }

  elements.cartItems.innerHTML =
    entries
      .map(([productId, qty]) => {
        const product = productById(productId);
        return `
          <div class="cart-line">
            <div>
              <strong>${escapeHtml(product.name)}</strong>
              <span>${formatMoney(product.price)} за ${escapeHtml(product.unit)}</span>
              <span>${escapeHtml(minQtyLabel(product))}</span>
            </div>
            <div class="qty-control">
              <button class="qty-button" type="button" data-dec="${escapeHtml(product.id)}">−</button>
              <strong>${qty}</strong>
              <button class="qty-button" type="button" data-inc="${escapeHtml(product.id)}">+</button>
            </div>
          </div>
        `;
      })
      .join("") || `<div class="cart-empty">Добавьте товары из витрины</div>`;
}

function openCart() {
  elements.cartPanel?.classList.add("open");
  document.body.classList.add("cart-open");
}

function closeCart() {
  elements.cartPanel?.classList.remove("open");
  document.body.classList.remove("cart-open");
}

function renderMetrics() {
  if (
    !elements.todayRevenue ||
    !elements.metricRevenue ||
    !elements.metricOrders ||
    !elements.metricClients ||
    !elements.metricAverage
  ) {
    return;
  }
  const activeOrders = state.orders.filter((order) => order.status !== "Отгружен");
  const revenue = activeOrders.reduce((sum, order) => sum + orderTotal(order), 0);
  const allRevenue = state.orders.reduce((sum, order) => sum + orderTotal(order), 0);
  const clients = getClients();
  const average = state.orders.length ? allRevenue / state.orders.length : 0;

  elements.todayRevenue.textContent = formatMoney(revenue);
  elements.metricRevenue.textContent = formatMoney(revenue);
  elements.metricOrders.textContent = activeOrders.length;
  elements.metricClients.textContent = clients.length;
  elements.metricAverage.textContent = formatMoney(average);
}

function renderPipeline() {
  if (!elements.pipeline) return;
  const deals = [
    ...state.leads,
    ...state.orders.map((order) => ({
      id: `order-${order.id}`,
      name: order.clientName,
      phone: order.phone,
      need: order.comment || "Заказ из витрины",
      value: orderTotal(order),
      status: order.status,
      isOrder: true,
      orderId: order.id,
      deleteType: "order",
    })),
  ];

  elements.pipeline.innerHTML = stages
    .map((stage) => {
      const stageDeals = deals.filter((deal) => deal.status === stage);
      const sum = stageDeals.reduce((total, deal) => total + Number(deal.value || 0), 0);
      return `
        <section class="stage">
          <div class="stage-header">
            <span>${stage}</span>
            <span>${formatMoney(sum)}</span>
          </div>
          ${
            stageDeals
              .map(
                (deal) => `
                  <article class="deal-card">
                    <strong>${deal.name}</strong>
                    <small>${deal.phone}</small>
                    <small>${deal.need}</small>
                    <strong>${formatMoney(deal.value)}</strong>
                    <div class="deal-actions">
                      ${stage !== stages[0] ? `<button class="status-button" type="button" data-move-deal="${deal.id}" data-direction="-1">Назад</button>` : ""}
                      ${stage !== stages[stages.length - 1] ? `<button class="status-button" type="button" data-move-deal="${deal.id}" data-direction="1">Дальше</button>` : ""}
                      <button class="status-button danger-button" type="button" data-delete-deal="${deal.id}">Удалить</button>
                    </div>
                  </article>
                `,
              )
              .join("") || `<div class="cart-empty">Пусто</div>`
          }
        </section>
      `;
    })
    .join("");
}

function renderOrders() {
  if (!elements.ordersTable || !elements.orderStatusFilter) return;
  const filter = elements.orderStatusFilter.value;
  const orders = filter === "all" ? state.orders : state.orders.filter((order) => order.status === filter);

  elements.ordersTable.innerHTML =
    orders
      .map(
        (order) => `
          <tr>
            <td data-label="Заявка">#${order.id}</td>
            <td data-label="Клиент">${order.clientName}<br><small>${order.phone}</small></td>
            <td data-label="Сумма"><strong>${formatMoney(orderTotal(order))}</strong></td>
            <td data-label="Статус"><span class="status-pill ${statusClass(order.status)}">${order.status}</span></td>
            <td data-label="Действие">
              <button class="status-button" type="button" data-next-order="${order.id}">
                Следующий статус
              </button>
              <button class="status-button danger-button" type="button" data-delete-order="${order.id}">
                Удалить
              </button>
            </td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="5">Заявок с таким статусом нет</td></tr>`;
}

function statusClass(status) {
  return {
    "Счет": "invoice",
    "В работе": "work",
    "Отгружен": "done",
  }[status] || "";
}

function getClients() {
  const map = new Map();
  state.orders.forEach((order) => {
    const key = order.phone || order.clientName;
    const previous = map.get(key);
    const total = orderTotal(order) + (previous?.total || 0);
    map.set(key, {
      name: order.clientName,
      phone: order.phone,
      orders: (previous?.orders || 0) + 1,
      total,
      lastStatus: order.status,
    });
  });

  state.leads.forEach((lead) => {
    if (!map.has(lead.phone)) {
      map.set(lead.phone, {
        name: lead.name,
        phone: lead.phone,
        orders: 0,
        total: Number(lead.value || 0),
        lastStatus: lead.status,
      });
    }
  });

  return [...map.values()].sort((a, b) => b.total - a.total);
}

function renderClients() {
  if (!elements.clientList || !elements.clientSearch) return;
  const search = elements.clientSearch.value.trim().toLowerCase();
  const clients = getClients().filter((client) => {
    return `${client.name} ${client.phone}`.toLowerCase().includes(search);
  });

  elements.clientList.innerHTML =
    clients
      .map(
        (client) => `
          <article class="client-card">
            <strong>${client.name}</strong>
            <small>${client.phone}</small>
            <div class="client-meta">
              <span>${client.orders} заказов</span>
              <span>${client.lastStatus}</span>
            </div>
            <strong>${formatMoney(client.total)}</strong>
          </article>
        `,
      )
      .join("") || `<div class="empty-state">Клиенты не найдены</div>`;
}

function renderProductSettings() {
  if (!elements.productSettings) return;

  elements.productSettings.innerHTML = products
    .map(
      (product) => `
        <article class="product-editor-card">
          <div class="product-editor-photo">
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
          </div>
          <div class="product-editor-fields">
            <label>
              Название
              <input value="${escapeHtml(product.name)}" data-product-field="name" data-product-id="${escapeHtml(product.id)}">
            </label>
            <label>
              Категория
              <input value="${escapeHtml(product.category)}" data-product-field="category" data-product-id="${escapeHtml(product.id)}">
            </label>
            <label>
              Цена
              <input type="number" min="0" step="1" value="${product.price}" data-product-field="price" data-product-id="${escapeHtml(product.id)}">
            </label>
            <label>
              Мин. закупка
              <input type="number" min="1" step="1" value="${product.minQty}" data-product-field="minQty" data-product-id="${escapeHtml(product.id)}">
            </label>
            <label>
              Ед. изм.
              <input value="${escapeHtml(product.unit)}" data-product-field="unit" data-product-id="${escapeHtml(product.id)}">
            </label>
            <label>
              Склад
              <input type="number" min="0" step="1" value="${product.stock}" data-product-field="stock" data-product-id="${escapeHtml(product.id)}">
            </label>
            <label class="wide-field">
              Фото URL
              <input value="${escapeHtml(product.image)}" data-product-field="image" data-product-id="${escapeHtml(product.id)}">
            </label>
            <label class="wide-field">
              Загрузить фото
              <input type="file" accept="image/*" data-product-image="${escapeHtml(product.id)}">
              <small>Квадрат или 4:3, минимум 800x600 px, до 3 МБ. Товар по центру, светлый фон, без текста.</small>
            </label>
            <label class="wide-field">
              Описание
              <textarea rows="3" data-product-field="description" data-product-id="${escapeHtml(product.id)}">${escapeHtml(product.description)}</textarea>
            </label>
            <button class="status-button danger-button" type="button" data-delete-product="${escapeHtml(product.id)}">Удалить товар</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function render() {
  renderProducts();
  renderCart();
  renderMetrics();
  renderPipeline();
  renderOrders();
  renderClients();
  renderProductSettings();
  saveState();
}

function addToCart(productId) {
  const product = productById(productId);
  if (!product) return;
  const currentQty = state.cart[productId] || 0;
  state.cart[productId] = currentQty ? currentQty + 1 : product.minQty;
  showToast(currentQty ? "Количество увеличено" : `${product.name}: добавлен минимум ${product.minQty} ${product.unit}`);
  render();
}

function changeCartQty(productId, delta) {
  const product = productById(productId);
  if (!product) return;
  const nextQty = (state.cart[productId] || 0) + delta;
  if (nextQty < product.minQty) {
    delete state.cart[productId];
    showToast("Товар удален из корзины");
  } else {
    state.cart[productId] = nextQty;
  }
  render();
}

async function createOrder(formData) {
  const entries = Object.entries(state.cart);
  if (!entries.length) {
    showToast("Корзина пустая");
    return;
  }

  const id = Math.max(1000, ...state.orders.map((order) => order.id)) + 1;
  const items = entries.map(([productId, qty]) => {
    const product = productById(productId);
    return {
      productId,
      qty: Math.max(qty, product.minQty),
      price: product.price,
    };
  });

  const orderPayload = {
    id,
    clientName: formData.get("clientName").trim(),
    phone: formData.get("phone").trim(),
    status: "Новый",
    comment: formData.get("comment").trim(),
    createdAt: new Date().toISOString().slice(0, 10),
    items,
  };

  const savedOrder = await apiRequest(
    "/orders",
    jsonOptions({
      clientName: orderPayload.clientName,
      phone: orderPayload.phone,
      comment: orderPayload.comment,
      items,
    }),
  );

  state.orders.unshift(savedOrder || orderPayload);
  state.cart = {};
  elements.checkoutForm?.reset();
  elements.cartPanel?.classList.remove("open");
  document.body.classList.remove("cart-open");
  showToast(`Заявка #${savedOrder?.id || id} отправлена. Мы свяжемся с вами.`);
  render();
}

async function addLead(formData) {
  const id = Math.max(200, ...state.leads.map((lead) => Number(lead.id))) + 1;
  const leadPayload = {
    id,
    name: formData.get("name").trim(),
    phone: formData.get("phone").trim(),
    need: formData.get("need"),
    value: Number(formData.get("value") || 0),
    status: "Новый",
  };
  const savedLead = await apiRequest("/leads", jsonOptions(leadPayload));
  state.leads.unshift(savedLead || leadPayload);
  elements.leadForm?.reset();
  showToast("Лид добавлен в CRM");
  render();
}

async function moveDeal(id, direction) {
  const numericDirection = Number(direction);
  const targetOrder = state.orders.find((order) => `order-${order.id}` === String(id));
  const targetLead = state.leads.find((lead) => String(lead.id) === String(id));
  const deal = targetOrder || targetLead;
  if (!deal) return;

  const currentIndex = stages.indexOf(deal.status);
  const nextIndex = Math.min(stages.length - 1, Math.max(0, currentIndex + numericDirection));
  deal.status = stages[nextIndex];
  if (targetOrder) {
    await apiRequest(`/orders/${targetOrder.id}`, jsonOptions({ status: deal.status }, "PATCH"));
  }
  if (targetLead) {
    await apiRequest(`/leads/${targetLead.id}`, jsonOptions({ status: deal.status }, "PATCH"));
  }
  showToast(`Статус изменен: ${deal.status}`);
  render();
}

async function moveOrderToNextStatus(orderId) {
  const order = state.orders.find((item) => item.id === Number(orderId));
  if (!order) return;
  const currentIndex = stages.indexOf(order.status);
  order.status = stages[Math.min(stages.length - 1, currentIndex + 1)];
  await apiRequest(`/orders/${order.id}`, jsonOptions({ status: order.status }, "PATCH"));
  showToast(`Заказ #${order.id}: ${order.status}`);
  render();
}

async function deleteOrder(orderId) {
  const order = state.orders.find((item) => item.id === Number(orderId));
  if (!order) return;

  const ok = window.confirm(`Удалить заявку #${order.id} от "${order.clientName}"?`);
  if (!ok) return;

  state.orders = state.orders.filter((item) => item.id !== Number(orderId));
  await apiRequest(`/orders/${orderId}`, { method: "DELETE" });
  saveState();
  render();
  showToast(`Заявка #${order.id} удалена`);
}

async function deleteDeal(dealId) {
  if (String(dealId).startsWith("order-")) {
    await deleteOrder(String(dealId).replace("order-", ""));
    return;
  }

  const lead = state.leads.find((item) => String(item.id) === String(dealId));
  if (!lead) return;

  const ok = window.confirm(`Удалить лид "${lead.name}"?`);
  if (!ok) return;

  state.leads = state.leads.filter((item) => String(item.id) !== String(dealId));
  await apiRequest(`/leads/${dealId}`, { method: "DELETE" });
  saveState();
  render();
  showToast("Лид удален");
}

function syncProducts() {
  state.products = products;
  renderCategories();
  saveState();
}

async function updateProduct(productId, field, rawValue) {
  const product = productById(productId);
  if (!product) return;

  if (["price", "minQty", "stock"].includes(field)) {
    const value = Number(rawValue);
    if (field === "price") product.price = Math.max(0, value || 0);
    if (field === "minQty") product.minQty = Math.max(1, Math.floor(value || 1));
    if (field === "stock") product.stock = Math.max(0, Math.floor(value || 0));
  } else {
    product[field] = String(rawValue || "").trim();
  }

  if (field === "minQty") {
    if (state.cart[productId] && state.cart[productId] < product.minQty) {
      state.cart[productId] = product.minQty;
    }
  }

  syncProducts();
  await apiRequest(`/products/${encodeURIComponent(productId)}`, jsonOptions(product, "PATCH"));
  render();
}

async function createProduct(formData) {
  const name = formData.get("name").trim();
  if (!name) return;

  const product = {
    id: `product-${Date.now()}`,
    name,
    category: formData.get("category").trim() || "Каталог",
    unit: formData.get("unit").trim() || "шт.",
    price: Math.max(0, Number(formData.get("price") || 0)),
    minQty: Math.max(1, Math.floor(Number(formData.get("minQty") || 1))),
    stock: Math.max(0, Math.floor(Number(formData.get("stock") || 0))),
    description: formData.get("description").trim(),
    image:
      formData.get("image").trim() ||
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
  };

  const savedProduct = await apiRequest("/products", jsonOptions(product));
  products.unshift(savedProduct || product);
  elements.productForm?.reset();
  syncProducts();
  render();
  showToast("Товар добавлен");
}

async function deleteProduct(productId) {
  const product = productById(productId);
  if (!product) return;

  const ok = window.confirm(`Удалить товар "${product.name}" из каталога?`);
  if (!ok) return;

  products = products.filter((item) => item.id !== productId);
  delete state.cart[productId];
  await apiRequest(`/products/${encodeURIComponent(productId)}`, { method: "DELETE" });
  syncProducts();
  render();
  showToast("Товар удален");
}

function uploadProductImage(productId, file) {
  if (!file) return;
  if (file.size > 3 * 1024 * 1024) {
    showToast("Фото слишком большое. Выберите файл до 3 МБ.");
    return;
  }

  if (apiOnline || window.location.protocol !== "file:") {
    const formData = new FormData();
    formData.append("image", file);
    apiRequest(`/products/${encodeURIComponent(productId)}/image`, {
      method: "POST",
      body: formData,
    }).then((savedProduct) => {
      if (savedProduct) {
        const index = products.findIndex((product) => product.id === productId);
        if (index >= 0) products[index] = savedProduct;
        syncProducts();
        render();
        showToast("Фото товара обновлено");
        return;
      }

      readProductImageLocally(productId, file);
    });
    return;
  }

  readProductImageLocally(productId, file);
}

function readProductImageLocally(productId, file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    updateProduct(productId, "image", reader.result);
    showToast("Фото товара обновлено");
  });
  reader.readAsDataURL(file);
}

function bindEvents() {
  elements.navButtons.forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  elements.searchInput?.addEventListener("input", renderProducts);
  elements.categoryFilter?.addEventListener("change", renderProducts);
  elements.clientSearch?.addEventListener("input", renderClients);
  elements.orderStatusFilter?.addEventListener("change", renderOrders);

  elements.openCartButtons.forEach((button) => {
    button.addEventListener("click", openCart);
  });
  elements.closeCartButtons.forEach((button) => {
    button.addEventListener("click", closeCart);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCart();
  });

  document.addEventListener("click", (event) => {
    const addProductId = event.target.closest("[data-add-product]")?.dataset.addProduct;
    const incProductId = event.target.closest("[data-inc]")?.dataset.inc;
    const decProductId = event.target.closest("[data-dec]")?.dataset.dec;
    const nextOrderId = event.target.closest("[data-next-order]")?.dataset.nextOrder;
    const moveButton = event.target.closest("[data-move-deal]");
    const deleteDealId = event.target.closest("[data-delete-deal]")?.dataset.deleteDeal;
    const deleteOrderId = event.target.closest("[data-delete-order]")?.dataset.deleteOrder;
    const deleteProductId = event.target.closest("[data-delete-product]")?.dataset.deleteProduct;

    if (addProductId) addToCart(addProductId);
    if (incProductId) changeCartQty(incProductId, 1);
    if (decProductId) changeCartQty(decProductId, -1);
    if (nextOrderId) moveOrderToNextStatus(nextOrderId);
    if (moveButton) moveDeal(moveButton.dataset.moveDeal, moveButton.dataset.direction);
    if (deleteDealId) deleteDeal(deleteDealId);
    if (deleteOrderId) deleteOrder(deleteOrderId);
    if (deleteProductId) deleteProduct(deleteProductId);
  });

  document.addEventListener("change", (event) => {
    const productField = event.target.closest("[data-product-field]");
    const productImage = event.target.closest("[data-product-image]");

    if (productField) {
      updateProduct(productField.dataset.productId, productField.dataset.productField, productField.value);
    }
    if (productImage) {
      uploadProductImage(productImage.dataset.productImage, productImage.files?.[0]);
    }
  });

  elements.checkoutForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    createOrder(new FormData(elements.checkoutForm));
  });

  elements.leadForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    addLead(new FormData(elements.leadForm));
  });

  elements.productForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    createProduct(new FormData(elements.productForm));
  });

  elements.seedButton?.addEventListener("click", () => {
    state = structuredClone(demoState);
    products = state.products;
    renderCategories();
    saveState();
    render();
    showToast("Демо-данные восстановлены");
  });

  elements.logoutButton?.addEventListener("click", async () => {
    await apiRequest("/logout", { method: "POST" });
    window.location.href = "/login.html";
  });
}

function initApp() {
  renderCategories();
  bindEvents();
  render();
  ensureAdminSession();
  syncFromApi();
}

initApp();
