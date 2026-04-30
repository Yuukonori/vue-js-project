const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

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
}

// 2. API Endpoints matching all UI Screenshots

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
      ['update', `New ${category} Registered: ${asset_id}`, `Asset ${asset_id} was added to the inventory.`, 'JUST NOW']
    );

    res.status(201).json(result.rows[0]);
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

app.get('/api/problem-frequency', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM problem_frequency ORDER BY frequency_value DESC');
        // Transform the database rows to match the frontend expected format
        const bars = result.rows.map(row => ({
            text: row.problem_name,
            value: row.frequency_value,
            color: row.bar_color
        }));
        res.json(bars);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Screenshot: Ongoing Repairs (Cards)
app.get("/api/repair/ongoing", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ongoing_repairs ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Screenshot: Service History (Monitoring Table)
app.get("/api/assets/history", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM service_history ORDER BY last_service DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
