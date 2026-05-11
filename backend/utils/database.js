/**
 * Database Utilities
 * Handles PostgreSQL connection and common database operations
 */

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

// Database Configuration
const dbConfig = {
  user: process.env.DB_USER || process.env.POSTGRES_USER || "admin",
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || "admin@879433",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || process.env.POSTGRES_DB || "n8n_db",
  port: Number(process.env.DB_PORT || 5432),
};

// Create connection pool
const pool = new Pool(dbConfig);

/**
 * Sync user asset counts from inventory table
 * Updates app_users.assets_count and asset_ids based on assigned assets
 */
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

/**
 * Bootstrap database schema and seed data
 * Runs on server startup to ensure database is properly initialized
 */
async function bootstrapDatabase() {
  // Check if tables exist
  const existsResult = await pool.query(
    "SELECT to_regclass('public.expiring_assets') AS expiring_assets_table"
  );
  const tableName = existsResult.rows[0]?.expiring_assets_table;

  // Initialize schema if tables don't exist
  if (!tableName) {
    const schemaPath = path.join(__dirname, "..", "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schemaSql);
    console.log("✓ Database schema initialized from schema.sql");
  }

  // Ensure app_users table exists
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

  // Add additional columns if they don't exist
  const columns = [
    "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS department VARCHAR(80) DEFAULT 'IT'",
    "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS position_title VARCHAR(120) DEFAULT 'Web Administrator'",
    "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS cost_center VARCHAR(80) DEFAULT 'CC-IT-001'",
    "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS company VARCHAR(120) DEFAULT 'BuilderUI'",
    "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS assets_count INTEGER DEFAULT 0",
    "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS asset_ids JSONB DEFAULT '[]'::jsonb",
    "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS issues_count INTEGER DEFAULT 0",
    "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS status VARCHAR(40) DEFAULT 'Active'",
    "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS avatar TEXT",
    "ALTER TABLE inventory ADD COLUMN IF NOT EXISTS assigned_user_id INTEGER",
    "ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS category VARCHAR(50)",
    "ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS priority VARCHAR(20)",
    "ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS asset_tag VARCHAR(100)",
    "ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS description TEXT",
    "ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS submitted_by_id INTEGER",
    "ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS prepared_by VARCHAR(100)",
    "ALTER TABLE repair_tickets ADD COLUMN IF NOT EXISTS evidence JSONB DEFAULT '[]'::jsonb",
  ];

  for (const query of columns) {
    await pool.query(query);
  }

  // Create access_policies table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS access_policies (
      department VARCHAR(80) PRIMARY KEY,
      allowed_pages JSONB NOT NULL DEFAULT '[]'::jsonb,
      allowed_features JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    ALTER TABLE access_policies 
    ADD COLUMN IF NOT EXISTS allowed_features JSONB NOT NULL DEFAULT '[]'::jsonb
  `);

  // Migrate ticket_id to SERIAL if needed
  const tableInfo = await pool.query(`
    SELECT data_type 
    FROM information_schema.columns 
    WHERE table_name = 'repair_tickets' AND column_name = 'ticket_id'
  `);

  if (tableInfo.rows[0]?.data_type === "character varying") {
    console.log("Migrating repair_tickets.ticket_id to SERIAL...");
    await pool.query(`ALTER TABLE repair_tickets DROP CONSTRAINT IF EXISTS repair_tickets_pkey`);
    await pool.query(`TRUNCATE repair_tickets CASCADE`);
    await pool.query(`ALTER TABLE repair_tickets ALTER COLUMN ticket_id TYPE INTEGER USING ticket_id::integer`);
    await pool.query(`CREATE SEQUENCE IF NOT EXISTS repair_tickets_ticket_id_seq`);
    await pool.query(`ALTER TABLE repair_tickets ALTER COLUMN ticket_id SET DEFAULT nextval('repair_tickets_ticket_id_seq')`);
    await pool.query(`ALTER TABLE repair_tickets ADD PRIMARY KEY (ticket_id)`);
  }

  // Seed default access policies
  await pool.query(`
    INSERT INTO access_policies (department, allowed_pages, allowed_features)
    VALUES
      ('finance', '["/dashboard","/assets","/support","/repair-history"]'::jsonb, '[]'::jsonb),
      ('hr', '["/dashboard","/assets","/support","/repair-history"]'::jsonb, '[]'::jsonb),
      ('procurement', '["/dashboard","/assets","/support","/repair-history"]'::jsonb, '[]'::jsonb),
      ('it', '["*"]'::jsonb, '["network_map", "all_tickets"]'::jsonb)
    ON CONFLICT (department) DO NOTHING
  `);

  // Create default admin users
  const hashedRukiPassword = await bcrypt.hash("Ruki@123", 10);
  const hashedRioPassword = await bcrypt.hash("Rio@123", 10);

  await pool.query(
    `INSERT INTO app_users (
      full_name, email, password, role, department, position_title, 
      cost_center, company, assets_count, issues_count, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT (email) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      password = EXCLUDED.password,
      role = EXCLUDED.role,
      department = EXCLUDED.department,
      position_title = EXCLUDED.position_title,
      cost_center = EXCLUDED.cost_center,
      company = EXCLUDED.company,
      assets_count = EXCLUDED.assets_count,
      issues_count = EXCLUDED.issues_count,
      status = EXCLUDED.status`,
    [
      "Ruki Nasa",
      "nasaaaxd@gmail.com",
      hashedRukiPassword,
      "Administrator",
      "IT",
      "Web Administrator",
      "CC-IT-001",
      "BuilderUI",
      3,
      0,
      "Active",
    ]
  );

  await pool.query(
    `INSERT INTO app_users (
      full_name, email, password, role, department, position_title, 
      cost_center, company, assets_count, issues_count, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT (email) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      password = EXCLUDED.password,
      role = EXCLUDED.role,
      department = EXCLUDED.department,
      position_title = EXCLUDED.position_title,
      cost_center = EXCLUDED.cost_center,
      company = EXCLUDED.company,
      status = EXCLUDED.status`,
    [
      "Rio Tsukasa",
      "riotsukasaaa@gmail.com",
      hashedRioPassword,
      "Staff",
      "Finance",
      "Finance",
      "FN-OPS-01",
      "BuilderUI",
      0,
      0,
      "Active",
    ]
  );

  // Assign assets to users
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
  console.log("✓ Database bootstrap completed");
}

module.exports = {
  pool,
  syncUserAssetCounts,
  bootstrapDatabase,
};
