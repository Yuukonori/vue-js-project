const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 1. PostgreSQL Connection Configuration (Docker/local)
const dbConfig = {
  user: process.env.DB_USER || process.env.POSTGRES_USER || "admin",
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || "admin@879433",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || process.env.POSTGRES_DB || "n8n_db",
  port: Number(process.env.DB_PORT || 5432),
};

const pool = new Pool({
  user: dbConfig.user,
  password: dbConfig.password,
  host: dbConfig.host,
  database: dbConfig.database,
  port: dbConfig.port,
});

async function bootstrapDatabase() {
  // Initialize schema + seed only once, when tables are not present.
  const existsResult = await pool.query(
    "SELECT to_regclass('public.expiring_assets') AS expiring_assets_table"
  );
  const tableName = existsResult.rows[0]?.expiring_assets_table;

  if (!tableName) {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schemaSql);
    console.log("Database schema initialized from schema.sql");
  }

  // Ensure login users table and default admin exist for existing databases too.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(120) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(80) DEFAULT 'User',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS department VARCHAR(80) DEFAULT 'IT'`);
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS position_title VARCHAR(120) DEFAULT 'Web Administrator'`);
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS cost_center VARCHAR(80) DEFAULT 'CC-IT-001'`);
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS company VARCHAR(120) DEFAULT 'BuilderUI'`);
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS assets_count INTEGER DEFAULT 0`);
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS issues_count INTEGER DEFAULT 0`);
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS status VARCHAR(40) DEFAULT 'Active'`);
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS avatar TEXT`);

  await pool.query(
    `INSERT INTO app_users (
      full_name, email, password, role, department, position_title, cost_center, company, assets_count, issues_count, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT (email) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      department = EXCLUDED.department,
      position_title = EXCLUDED.position_title,
      cost_center = EXCLUDED.cost_center,
      company = EXCLUDED.company,
      assets_count = EXCLUDED.assets_count,
      issues_count = EXCLUDED.issues_count,
      status = EXCLUDED.status`,
    ["Ruki Nasa", "nasaaaxd@gmail.com", "Ruki@123", "Administrator", "IT", "Web Administrator", "CC-IT-001", "BuilderUI", 3, 0, "Active"]
  );
}

// 2. API Endpoints matching all UI Screenshots

app.get("/api/test", (req, res) => res.send("ok"));

// Screenshot: Expiring Assets
app.get("/api/assets/expiring", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expiring_assets ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Screenshot: Recent Repair Tickets
app.get("/api/repair/tickets", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM repair_tickets ORDER BY updated_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Screenshot: Asset Inventory Table
app.get("/api/assets/inventory", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventory ORDER BY asset_id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        full_name AS name,
        email,
        role,
        department,
        position_title AS position,
        cost_center AS "costCenter",
        company,
        assets_count AS assets,
        issues_count AS issues,
        status
      FROM app_users
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const result = await pool.query(
      `SELECT
         id,
         full_name AS name,
         email,
         role,
         department,
         position_title AS position,
         cost_center AS "costCenter",
         company,
         assets_count AS assets,
         issues_count AS issues,
         status,
         is_active,
         avatar
       FROM app_users
       WHERE LOWER(email) = $1 AND password = $2
       LIMIT 1`,
      [email, password]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = result.rows[0];
    if (!user.is_active) {
      return res.status(403).json({ error: "User is inactive." });
    }
    delete user.is_active;
    return res.json({ ok: true, user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/assets/add", async (req, res) => {
  const { asset_id, category, serial_number, service_years, purchase_date, warranty_expiry, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO inventory (asset_id, category, serial_number, service_years, purchase_date, warranty_expiry, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [asset_id, category, serial_number, service_years || 0, purchase_date, warranty_expiry, status]
    );

    // Also add to activity feed
    await pool.query(
      "INSERT INTO activity_feed (type, title, description, time_label) VALUES ($1, $2, $3, $4)",
      ['update', `New ${category} Registered: ${asset_id}`, `Asset ${asset_id} was added to the inventory.`, '']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/assets/update", async (req, res) => {
  const { asset_id: id, category, serial_number, service_years, purchase_date, warranty_expiry, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE inventory SET category = $1, serial_number = $2, service_years = $3, purchase_date = $4, warranty_expiry = $5, status = $6 WHERE asset_id = $7 RETURNING *",
      [category, serial_number, service_years || 0, purchase_date, warranty_expiry, status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Also add to activity feed
    await pool.query(
      "INSERT INTO activity_feed (type, title, description, time_label) VALUES ($1, $2, $3, $4)",
      ['update', `Asset Updated: ${id}`, `Details for asset ${id} were updated.`, '']
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/assets/delete", async (req, res) => {
  const id = req.query.id;
  try {
    const result = await pool.query("DELETE FROM inventory WHERE asset_id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Also add to activity feed
    await pool.query(
      "INSERT INTO activity_feed (type, title, description, time_label) VALUES ($1, $2, $3, $4)",
      ['update', `Asset Deleted: ${id}`, `Asset ${id} was removed from the inventory.`, '']
    );

    res.json({ message: "Asset deleted successfully", deletedAsset: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Screenshot: Real-time Activity Feed
app.get("/api/activity/feed", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM activity_feed ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Screenshot: Critical Maintenance Table
app.get('/api/maintenance/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM maintenance');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/repair/ongoing", (req, res) => {
  res.json([]);
});

app.get("/api/problem-frequency", (req, res) => {
  res.json([]);
});

// Screenshot: Service History (Monitoring Table)
app.get("/api/assets/history", (req, res) => {
  res.json([]);
});

// Screenshot: Audit Logs (Detailed Table)
app.get("/api/logs/audit", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM audit_logs ORDER BY timestamp DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/uptime", (req, res) => {
  res.json({ uptime: Math.floor(process.uptime()) });
});

app.post("/api/users/update-profile", async (req, res) => {
  const { userId, avatar } = req.body;
  console.log(`[Backend] Update profile request for user ${userId}, avatar length: ${avatar?.length || 0}`);
  if (!userId) return res.status(400).json({ error: "User ID is required" });
  try {
    const result = await pool.query(
      "UPDATE app_users SET avatar = $1 WHERE id = $2 RETURNING *",
      [avatar, userId]
    );
    if (result.rowCount === 0) {
      console.warn(`[Backend] User ${userId} not found`);
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`[Backend] Profile updated for user ${userId}`);
    res.json({ ok: true, user: result.rows[0] });
  } catch (err) {
    console.error(`[Backend] Error updating profile for user ${userId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, db: "connected" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    await bootstrapDatabase();
    app.listen(5050, "0.0.0.0", () => {
      console.log("Full-Stack Dashboard Backend running on http://127.0.0.1:5050");
      console.log(
        `DB connected: ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
      );
    });
  } catch (err) {
    console.error("Failed to start backend:", err.message);
    process.exit(1);
  }
}

startServer();
