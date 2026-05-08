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

async function syncUserAssetCounts() {
  await pool.query(`
    WITH user_assets AS (
      SELECT
        assigned_user_id AS user_id,
        COUNT(*)::int AS cnt,
        jsonb_agg(asset_id ORDER BY asset_id) AS ids
      FROM inventory
      WHERE assigned_user_id IS NOT NULL
      GROUP BY assigned_user_id
    )
    UPDATE app_users u
    SET
      assets_count = COALESCE(ua.cnt, 0),
      asset_ids = COALESCE(ua.ids, '[]'::jsonb)
    FROM app_users all_users
    LEFT JOIN user_assets ua ON ua.user_id = all_users.id
    WHERE u.id = all_users.id
  `);

  await pool.query(`
    UPDATE app_users
    SET
      assets_count = 0,
      asset_ids = '[]'::jsonb
    WHERE id NOT IN (
      SELECT DISTINCT assigned_user_id
      FROM inventory
      WHERE assigned_user_id IS NOT NULL
    )
  `);
}

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
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS asset_ids JSONB DEFAULT '[]'::jsonb`);
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS issues_count INTEGER DEFAULT 0`);
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS status VARCHAR(40) DEFAULT 'Active'`);
  await pool.query(`ALTER TABLE app_users ADD COLUMN IF NOT EXISTS avatar TEXT`);
  await pool.query(`ALTER TABLE inventory ADD COLUMN IF NOT EXISTS assigned_user_id INTEGER`);
  await pool.query(`ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS category VARCHAR(50)`);
  await pool.query(`ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS priority VARCHAR(20)`);
  await pool.query(`ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS asset_tag VARCHAR(100)`);
  await pool.query(`ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS description TEXT`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS access_policies (
      department VARCHAR(80) PRIMARY KEY,
      allowed_pages JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    INSERT INTO access_policies (department, allowed_pages)
    VALUES
      ('finance', '["/dashboard","/assets","/support","/repair-history"]'::jsonb),
      ('hr', '["/dashboard","/assets","/support","/repair-history"]'::jsonb),
      ('procurement', '["/dashboard","/assets","/support","/repair-history"]'::jsonb),
      ('it', '["*"]'::jsonb)
    ON CONFLICT (department) DO NOTHING
  `);

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

  // Ensure second user exists for assignment demo.
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
      status = EXCLUDED.status`,
    ["Rio Tsukasa", "riotsukasaaa@gmail.com", "Rio@123", "Staff", "Finance", "Finance", "FN-OPS-01", "BuilderUI", 0, 0, "Active"]
  );

  // One-time mapping of current 3 assets: 2 for Ruki, 1 for Rio.
  await pool.query(`
    WITH ranked_assets AS (
      SELECT asset_id, ROW_NUMBER() OVER (ORDER BY asset_id) AS rn
      FROM inventory
    ),
    users_map AS (
      SELECT
        MAX(CASE WHEN full_name = 'Ruki Nasa' THEN id END) AS ruki_id,
        MAX(CASE WHEN full_name = 'Rio Tsukasa' THEN id END) AS rio_id
      FROM app_users
    )
    UPDATE inventory i
    SET assigned_user_id = CASE
      WHEN ra.rn IN (1,2) THEN um.ruki_id
      WHEN ra.rn = 3 THEN um.rio_id
      ELSE i.assigned_user_id
    END
    FROM ranked_assets ra, users_map um
    WHERE i.asset_id = ra.asset_id
      AND i.assigned_user_id IS NULL
  `);

  await syncUserAssetCounts();
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

app.post("/api/repair/tickets", async (req, res) => {
  try {
    const category = String(req.body?.category ?? "hardware").trim().toLowerCase();
    const subject = String(req.body?.subject ?? "").trim();
    const priority = String(req.body?.priority ?? "low").trim().toLowerCase();
    const assetTag = String(req.body?.assetTag ?? "").trim();
    const description = String(req.body?.description ?? "").trim();

    if (!subject) {
      return res.status(400).json({ error: "Subject is required." });
    }

    const now = new Date();
    const ticketId = `${now.getTime()}-${Math.floor(Math.random() * 1000)}`;
    const status = priority === "high" ? "URGENT" : "PENDING";

    const result = await pool.query(
      `INSERT INTO repair_tickets (ticket_id, category, priority, subject, asset_tag, description, status, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)
       RETURNING *`,
      [ticketId, category, priority, subject, assetTag || null, description || null, status]
    );

    await pool.query(
      "INSERT INTO activity_feed (type, title, description, time_label) VALUES ($1, $2, $3, $4)",
      [
        "update",
        `Ticket Submitted: ${ticketId}`,
        `New support ticket created${assetTag ? ` for ${assetTag}` : ""}${description ? "." : ""}`,
        "",
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.put("/api/repair/tickets/:id", async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) return res.status(400).json({ error: "Ticket ID is required." });

    const category = String(req.body?.category ?? "hardware").trim().toLowerCase();
    const priority = String(req.body?.priority ?? "low").trim().toLowerCase();
    const subject = String(req.body?.subject ?? "").trim();
    const assetTag = String(req.body?.assetTag ?? "").trim();
    const description = String(req.body?.description ?? "").trim();
    const status = String(req.body?.status ?? "").trim().toUpperCase();
    if (!subject || !status) {
      return res.status(400).json({ error: "Subject and status are required." });
    }

    const result = await pool.query(
      `UPDATE repair_tickets
       SET category = $1,
           priority = $2,
           subject = $3,
           asset_tag = $4,
           description = $5,
           status = $6,
           updated_at = CURRENT_DATE
       WHERE ticket_id = $7
       RETURNING *`,
      [category, priority, subject, assetTag || null, description || null, status, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "Ticket not found." });
    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/repair/tickets/:id", async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) return res.status(400).json({ error: "Ticket ID is required." });

    const result = await pool.query(
      `DELETE FROM repair_tickets WHERE ticket_id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "Ticket not found." });
    return res.json({ ok: true, deleted: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Screenshot: Asset Inventory Table
app.get("/api/assets/inventory", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        i.*,
        u.full_name AS assigned_user_name
      FROM inventory i
      LEFT JOIN app_users u ON u.id = i.assigned_user_id
      ORDER BY i.asset_id ASC
    `);
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
        asset_ids AS "assetIds",
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

app.get("/api/access-policies", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT department, allowed_pages
      FROM access_policies
      ORDER BY department ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/access-policies/:department", async (req, res) => {
  try {
    const department = String(req.params.department || "").trim().toLowerCase();
    const allowedPages = Array.isArray(req.body?.allowed_pages) ? req.body.allowed_pages : [];
    if (!department) return res.status(400).json({ error: "Department is required." });

    const normalizedPages = allowedPages
      .map(v => String(v || "").trim())
      .filter(Boolean);

    const result = await pool.query(
      `INSERT INTO access_policies (department, allowed_pages, updated_at)
       VALUES ($1, $2::jsonb, CURRENT_TIMESTAMP)
       ON CONFLICT (department) DO UPDATE
       SET allowed_pages = EXCLUDED.allowed_pages,
           updated_at = CURRENT_TIMESTAMP
       RETURNING department, allowed_pages, updated_at`,
      [department, JSON.stringify(normalizedPages)]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const role = String(req.body?.role ?? "User").trim();
    const department = String(req.body?.department ?? "IT").trim();
    const position = String(req.body?.position ?? "Staff").trim();
    const costCenter = String(req.body?.costCenter ?? "CC-001").trim();
    const company = String(req.body?.company ?? "BuilderUI").trim();
    const assets = Number(req.body?.assets ?? 0);
    const issues = Number(req.body?.issues ?? 0);
    const status = String(req.body?.status ?? "Active").trim();

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    // app_users.password is required in schema; set a temporary default for created users.
    const tempPassword = "ChangeMe@123";

    const result = await pool.query(
      `INSERT INTO app_users (
        full_name, email, password, role, department, position_title, cost_center, company, assets_count, issues_count, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING
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
        status`,
      [name, email, tempPassword, role, department, position, costCenter, company, assets, issues, status]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err?.code === "23505") {
      return res.status(409).json({ error: "Email already exists." });
    }
    return res.status(500).json({ error: err.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid user id." });

    const name = String(req.body?.name ?? "").trim();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const role = String(req.body?.role ?? "User").trim();
    const department = String(req.body?.department ?? "IT").trim();
    const position = String(req.body?.position ?? "Staff").trim();
    const costCenter = String(req.body?.costCenter ?? "CC-001").trim();
    const company = String(req.body?.company ?? "BuilderUI").trim();
    const assets = Number(req.body?.assets ?? 0);
    const issues = Number(req.body?.issues ?? 0);
    const status = String(req.body?.status ?? "Active").trim();

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const result = await pool.query(
      `UPDATE app_users
       SET full_name = $1,
           email = $2,
           role = $3,
           department = $4,
           position_title = $5,
           cost_center = $6,
           company = $7,
           assets_count = $8,
           issues_count = $9,
           status = $10
       WHERE id = $11
       RETURNING
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
         status`,
      [name, email, role, department, position, costCenter, company, assets, issues, status, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "User not found." });
    return res.json(result.rows[0]);
  } catch (err) {
    if (err?.code === "23505") return res.status(409).json({ error: "Email already exists." });
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid user id." });

    const result = await pool.query(
      `DELETE FROM app_users WHERE id = $1 RETURNING id, full_name AS name, email`,
      [id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "User not found." });
    return res.json({ ok: true, deleted: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
  const { asset_id, category, serial_number, service_years, purchase_date, warranty_expiry, status, assigned_user_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO inventory (asset_id, category, serial_number, service_years, purchase_date, warranty_expiry, status, assigned_user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [asset_id, category, serial_number, service_years || 0, purchase_date, warranty_expiry, status, assigned_user_id ?? null]
    );
    await syncUserAssetCounts();

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
  const { asset_id: id, category, serial_number, service_years, purchase_date, warranty_expiry, status, assigned_user_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE inventory SET category = $1, serial_number = $2, service_years = $3, purchase_date = $4, warranty_expiry = $5, status = $6, assigned_user_id = $7 WHERE asset_id = $8 RETURNING *",
      [category, serial_number, service_years || 0, purchase_date, warranty_expiry, status, assigned_user_id ?? null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Also add to activity feed
    await pool.query(
      "INSERT INTO activity_feed (type, title, description, time_label) VALUES ($1, $2, $3, $4)",
      ['update', `Asset Updated: ${id}`, `Details for asset ${id} were updated.`, '']
    );

    await syncUserAssetCounts();
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

    await syncUserAssetCounts();
    res.json({ message: "Asset deleted successfully", deletedAsset: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/assets/assign", async (req, res) => {
  const assetId = String(req.body?.asset_id ?? "").trim();
  const userId = req.body?.user_id == null ? null : Number(req.body.user_id);

  if (!assetId) return res.status(400).json({ error: "asset_id is required." });
  if (userId !== null && !Number.isFinite(userId)) return res.status(400).json({ error: "user_id must be a number or null." });

  try {
    const result = await pool.query(
      "UPDATE inventory SET assigned_user_id = $1 WHERE asset_id = $2 RETURNING *",
      [userId, assetId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Asset not found." });
    await syncUserAssetCounts();
    return res.json({ ok: true, asset: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
