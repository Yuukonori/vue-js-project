/**
 * Database Utilities
 * Handles PostgreSQL connection and common database operations
 */

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

// Database Configuration from environment variables
const dbConfig = {
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postgres",
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
    "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS location VARCHAR(255) DEFAULT 'Phnom Penh, Cambodia'",
    "ALTER TABLE app_users ADD COLUMN IF NOT EXISTS about TEXT DEFAULT 'System administrator with full access to platform management, user oversight, and system configuration.'",
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



  await syncUserAssetCounts();
  console.log("✓ Database bootstrap completed");
}

module.exports = {
  pool,
  syncUserAssetCounts,
  bootstrapDatabase,
};
