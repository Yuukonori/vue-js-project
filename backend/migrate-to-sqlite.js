require("dotenv").config();
const path = require("path");
const { Pool } = require("pg");
const sqlite3 = require("sqlite3").verbose();

const sourcePool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postgres",
  port: Number(process.env.DB_PORT || 5432),
});

const targetPath = path.join(__dirname, "new-database.sqlite");

const TABLES = [
  "expiring_assets",
  "repair_tickets",
  "inventory",
  "activity_feed",
  "maintenance",
  "ongoing_repairs",
  "service_history",
  "audit_logs",
  "problem_frequency",
  "app_users",
  "access_policies",
];

function quoteIdentifier(name) {
  return `"${name.replace(/"/g, "\"\"")}"`;
}

function normalizeValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

function runSql(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function allSql(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function ensureSqliteTable(db, tableName) {
  const colsQuery = `
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = $1
    ORDER BY ordinal_position
  `;
  const colsResult = await sourcePool.query(colsQuery, [tableName]);
  if (!colsResult.rows.length) return false;

  const columnDefs = colsResult.rows.map((col) => {
    const colName = quoteIdentifier(col.column_name);
    const type = col.data_type.toLowerCase();
    if (
      type.includes("integer") ||
      type.includes("numeric") ||
      type.includes("real") ||
      type.includes("double")
    ) {
      return `${colName} NUMERIC`;
    }
    if (type.includes("boolean")) return `${colName} INTEGER`;
    return `${colName} TEXT`;
  });

  const createSql = `CREATE TABLE IF NOT EXISTS ${quoteIdentifier(
    tableName
  )} (${columnDefs.join(", ")});`;
  await runSql(db, createSql);
  return true;
}

async function copyTable(db, tableName) {
  const sourceRows = await sourcePool.query(
    `SELECT * FROM ${quoteIdentifier(tableName)}`
  );
  const rows = sourceRows.rows;

  await runSql(db, `DELETE FROM ${quoteIdentifier(tableName)}`);
  if (!rows.length) return 0;

  const columns = Object.keys(rows[0]);
  const colSql = columns.map(quoteIdentifier).join(", ");
  const placeholders = columns.map(() => "?").join(", ");
  const insertSql = `INSERT INTO ${quoteIdentifier(
    tableName
  )} (${colSql}) VALUES (${placeholders})`;

  for (const row of rows) {
    const values = columns.map((c) => normalizeValue(row[c]));
    await runSql(db, insertSql, values);
  }
  return rows.length;
}

async function main() {
  const db = new sqlite3.Database(targetPath);
  try {
    for (const table of TABLES) {
      const exists = await ensureSqliteTable(db, table);
      if (!exists) {
        console.log(`Skipped ${table} (not found in PostgreSQL).`);
        continue;
      }
      const count = await copyTable(db, table);
      console.log(`Copied ${count} row(s) from ${table}.`);
    }

    const check = await allSql(
      db,
      "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name"
    );
    console.log("SQLite DB created:", targetPath);
    console.log("Tables:", check.map((r) => r.name).join(", "));
  } finally {
    db.close();
    await sourcePool.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
