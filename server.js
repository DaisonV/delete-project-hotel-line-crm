const fs = require("fs");
const path = require("path");
const express = require("express");
const session = require("express-session");
const connectPgSimple = require("connect-pg-simple");
const multer = require("multer");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, "uploads");

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. PostgreSQL-backed API will not start correctly.");
}

fs.mkdirSync(uploadDir, { recursive: true });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
});
const PgSession = connectPgSimple(session);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
      cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`);
    },
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith("image/"));
  },
});

const seedProducts = [
  ["tooth-kit-35", "Зубной набор эконом", "Одноразовые наборы", "шт.", 35, 2000, 12000, "Зубная щетка и паста в индивидуальной упаковке.", "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=700&q=80"],
  ["tooth-kit-48", "Зубной набор стандарт", "Одноразовые наборы", "шт.", 48, 1000, 8000, "Зубной набор в упаковке для гостиничных номеров.", "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=700&q=80"],
  ["tooth-kit-55", "Зубной набор премиум", "Одноразовые наборы", "шт.", 55, 1000, 7000, "Зубной набор улучшенной комплектации в индивидуальной упаковке.", "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=700&q=80"],
  ["comb", "Расческа гостиничная", "Одноразовые наборы", "шт.", 25, 2000, 10000, "Расческа в индивидуальной упаковке для ванной комнаты.", "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=700&q=80"],
  ["razor", "Бритва одноразовая", "Одноразовые наборы", "шт.", 70, 1000, 6000, "Бритва в индивидуальной упаковке для гостиничных номеров.", "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=700&q=80"],
  ["hygiene-kit", "Гигиенический набор", "Одноразовые наборы", "шт.", 25, 1000, 9000, "Компактный гигиенический набор в индивидуальном пакете.", "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80"],
  ["shoe-sponge", "Губка для обуви", "Одноразовые наборы", "шт.", 30, 1000, 7000, "Губка для ухода за обувью в индивидуальной упаковке.", "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=700&q=80"],
  ["shoehorn", "Ложка для обуви", "Одноразовые наборы", "шт.", 30, 1000, 7000, "Пластиковая ложка для обуви в индивидуальной упаковке.", "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=700&q=80"],
  ["shower-cap", "Шапочка для душа", "Одноразовые наборы", "шт.", 25, 1000, 10000, "Одноразовая шапочка для душа в упаковке.", "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80"],
  ["soap-15", "Мыло 15 г", "Косметика", "шт.", 30, 1000, 9000, "Гостиничное мыло 15 г в индивидуальной упаковке.", "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=700&q=80"],
  ["soap-20", "Мыло 20 г", "Косметика", "шт.", 35, 500, 6000, "Гостиничное мыло 20 г в индивидуальной упаковке.", "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=700&q=80"],
  ["shampoo-gel-20", "Шампунь и гель для душа 20 г", "Косметика", "шт.", 40, 1000, 5000, "Косметика 20 г, коробка 1000 шт.", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80"],
  ["shampoo-gel-30", "Шампунь и гель для душа 30 г", "Косметика", "шт.", 50, 500, 4000, "Косметика 30 г, коробка 500 шт.", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80"],
  ["shoe-bag", "Пакет для обуви", "Одноразовые наборы", "шт.", 25, 1000, 8000, "Пакет для обуви в гостиничный номер.", "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=700&q=80"],
  ["slippers-285", "Тапочки одноразовые 28.5x11.5 см", "Тапочки", "пара", 130, 700, 3500, "Одноразовые тапочки, 700 пар в мешке.", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"],
  ["towel-35-75", "Полотенце 35x75 см", "Текстиль", "шт.", 1000, 10, 300, "Гостиничное полотенце 35x75 см.", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=700&q=80"],
  ["bath-towel-70-140", "Банное полотенце 70x140 см", "Текстиль", "шт.", 3200, 10, 240, "Банное полотенце для гостиниц, размер 70x140 см.", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=700&q=80"],
  ["floor-towel-50-80", "Полотенце для пола 50x80 см", "Текстиль", "шт.", 1600, 10, 260, "Полотенце для пола в ванную комнату, размер 50x80 см.", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=700&q=80"],
  ["bedding-set", "Комплект постельного белья", "Постельное белье", "комплект", 17500, 5, 120, "Подушковая накидка 53x83 см, простыня 260x280 см, пододеяльник 230x220 см. Состав 60% хлопок, 40%.", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80"],
];

app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadDir));
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    name: "hotel_line.sid",
    secret: process.env.SESSION_SECRET || "dev-session-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 12,
    },
  }),
);

function isAdmin(req) {
  return Boolean(req.session?.admin);
}

function requireAdminPage(req, res, next) {
  if (isAdmin(req)) {
    next();
    return;
  }
  res.redirect(`/login.html?next=${encodeURIComponent(req.originalUrl)}`);
}

function requireAdminApi(req, res, next) {
  if (isAdmin(req)) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
}

function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    unit: row.unit,
    price: Number(row.price),
    minQty: Number(row.min_qty),
    stock: Number(row.stock),
    description: row.description || "",
    image: row.image || "",
  };
}

function toLead(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    need: row.need,
    value: Number(row.value),
    status: row.status,
  };
}

function formatMoney(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

async function notifyTelegram(order) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const state = await getState();
  const productsById = new Map(state.products.map((product) => [product.id, product]));
  const lines = order.items.map((item) => {
    const product = productsById.get(item.productId);
    const name = product?.name || item.productId;
    return `• ${name}: ${item.qty} × ${formatMoney(item.price)}`;
  });
  const total = order.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const text = [
    `Новая заявка #${order.id}`,
    `Клиент: ${order.clientName}`,
    `Телефон: ${order.phone}`,
    `Сумма: ${formatMoney(total)}`,
    order.comment ? `Комментарий: ${order.comment}` : "",
    "",
    "Товары:",
    lines.join("\n"),
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      console.warn(`Telegram notification failed: ${response.status}`);
    }
  } catch (error) {
    console.warn(`Telegram notification failed: ${error.message}`);
  }
}

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      unit TEXT NOT NULL DEFAULT 'шт.',
      price NUMERIC NOT NULL DEFAULT 0,
      min_qty INTEGER NOT NULL DEFAULT 1,
      stock INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      client_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Новый',
      comment TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL,
      qty INTEGER NOT NULL,
      price NUMERIC NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      need TEXT NOT NULL,
      value NUMERIC NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Новый',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM products");
  if (rows[0].count === 0) {
    for (const product of seedProducts) {
      await pool.query(
        `INSERT INTO products (id, name, category, unit, price, min_qty, stock, description, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        product,
      );
    }
  }
}

async function waitForDatabase() {
  const maxAttempts = Number(process.env.DB_CONNECT_ATTEMPTS || 30);
  const delayMs = Number(process.env.DB_CONNECT_DELAY_MS || 3000);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch (error) {
      const isLastAttempt = attempt === maxAttempts;
      console.warn(
        `Database is not ready yet (${attempt}/${maxAttempts}): ${error.code || error.message}`,
      );

      if (isLastAttempt) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function getState() {
  const [productsResult, ordersResult, itemsResult, leadsResult] = await Promise.all([
    pool.query("SELECT * FROM products ORDER BY created_at DESC, name ASC"),
    pool.query("SELECT * FROM orders ORDER BY id DESC"),
    pool.query("SELECT * FROM order_items ORDER BY id ASC"),
    pool.query("SELECT * FROM leads ORDER BY id DESC"),
  ]);

  const itemsByOrder = new Map();
  for (const row of itemsResult.rows) {
    const items = itemsByOrder.get(row.order_id) || [];
    items.push({
      productId: row.product_id,
      qty: Number(row.qty),
      price: Number(row.price),
    });
    itemsByOrder.set(row.order_id, items);
  }

  return {
    products: productsResult.rows.map(toProduct),
    orders: ordersResult.rows.map((row) => ({
      id: row.id,
      clientName: row.client_name,
      phone: row.phone,
      status: row.status,
      comment: row.comment || "",
      createdAt: row.created_at.toISOString().slice(0, 10),
      items: itemsByOrder.get(row.id) || [],
    })),
    leads: leadsResult.rows.map(toLead),
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/session", (req, res) => {
  res.json({ authenticated: isAdmin(req) });
});

app.post("/api/login", (req, res) => {
  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD || "admin";
  const { username = "", password = "" } = req.body || {};
  const normalizedUsername = String(username).trim();
  const normalizedPassword = String(password);

  if (normalizedUsername === expectedUser && normalizedPassword === expectedPassword) {
    req.session.admin = true;
    req.session.username = normalizedUsername;
    res.json({ ok: true });
    return;
  }

  console.warn(`Failed admin login for user "${normalizedUsername || "empty"}"`);
  res.status(401).json({ error: "Неверный логин или пароль" });
});

app.post("/api/logout", requireAdminApi, (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }
    res.clearCookie("hotel_line.sid");
    res.json({ ok: true });
  });
});

app.get("/api/state", async (_req, res, next) => {
  try {
    res.json(await getState());
  } catch (error) {
    next(error);
  }
});

app.post("/api/orders", async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { clientName, phone, comment = "", items = [] } = req.body;
    await client.query("BEGIN");
    const orderResult = await client.query(
      `INSERT INTO orders (client_name, phone, comment, status)
       VALUES ($1, $2, $3, 'Новый')
       RETURNING *`,
      [clientName, phone, comment],
    );
    const order = orderResult.rows[0];
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, qty, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.productId, item.qty, item.price],
      );
    }
    await client.query("COMMIT");
    const savedOrder = (await getState()).orders.find((item) => item.id === order.id);
    notifyTelegram(savedOrder).catch((error) => {
      console.warn(`Telegram notification failed: ${error.message}`);
    });
    res.status(201).json(savedOrder);
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

app.patch("/api/orders/:id", requireAdminApi, async (req, res, next) => {
  try {
    const { status } = req.body;
    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [status, req.params.id]);
    res.json((await getState()).orders.find((order) => order.id === Number(req.params.id)));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/orders/:id", requireAdminApi, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM orders WHERE id = $1", [req.params.id]);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.post("/api/leads", requireAdminApi, async (req, res, next) => {
  try {
    const { name, phone, need, value = 0 } = req.body;
    const result = await pool.query(
      `INSERT INTO leads (name, phone, need, value, status)
       VALUES ($1, $2, $3, $4, 'Новый')
       RETURNING *`,
      [name, phone, need, value],
    );
    res.status(201).json(toLead(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/leads/:id", requireAdminApi, async (req, res, next) => {
  try {
    const { status } = req.body;
    const result = await pool.query("UPDATE leads SET status = $1 WHERE id = $2 RETURNING *", [status, req.params.id]);
    res.json(result.rows[0] ? toLead(result.rows[0]) : null);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/leads/:id", requireAdminApi, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM leads WHERE id = $1", [req.params.id]);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.post("/api/products", requireAdminApi, async (req, res, next) => {
  try {
    const product = req.body;
    const result = await pool.query(
      `INSERT INTO products (id, name, category, unit, price, min_qty, stock, description, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        product.id,
        product.name,
        product.category,
        product.unit,
        product.price,
        product.minQty,
        product.stock,
        product.description || "",
        product.image || "",
      ],
    );
    res.status(201).json(toProduct(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

app.patch("/api/products/:id", requireAdminApi, async (req, res, next) => {
  try {
    const product = req.body;
    const result = await pool.query(
      `UPDATE products
       SET name = $1, category = $2, unit = $3, price = $4, min_qty = $5,
           stock = $6, description = $7, image = $8, updated_at = now()
       WHERE id = $9
       RETURNING *`,
      [
        product.name,
        product.category,
        product.unit,
        product.price,
        product.minQty,
        product.stock,
        product.description || "",
        product.image || "",
        req.params.id,
      ],
    );
    res.json(result.rows[0] ? toProduct(result.rows[0]) : null);
  } catch (error) {
    next(error);
  }
});

app.post("/api/products/:id/image", requireAdminApi, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Image file is required" });
      return;
    }
    const image = `/uploads/${req.file.filename}`;
    const result = await pool.query(
      "UPDATE products SET image = $1, updated_at = now() WHERE id = $2 RETURNING *",
      [image, req.params.id],
    );
    res.json(result.rows[0] ? toProduct(result.rows[0]) : null);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/products/:id", requireAdminApi, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index.html", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", requireAdminPage, (_req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/admin.html", requireAdminPage, (_req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/login", (_req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/login.html", (_req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/app.js", (_req, res) => {
  res.sendFile(path.join(__dirname, "app.js"));
});

app.get("/styles.css", (_req, res) => {
  res.sendFile(path.join(__dirname, "styles.css"));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});

waitForDatabase()
  .then(initDb)
  .then(() => {
    app.listen(port, () => {
      console.log(`Hotel Line CRM is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database", error);
    process.exit(1);
  });
