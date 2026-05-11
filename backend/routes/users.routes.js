/**
 * User Management Routes
 * Handles CRUD operations for users
 */

const express = require("express");
const bcrypt = require("bcrypt");
const { pool } = require("../utils/database");

const router = express.Router();

/**
 * GET /api/users
 * Get all users
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id, full_name AS name, email, role, department,
        position_title AS position, cost_center AS "costCenter",
        company, assets_count AS assets, asset_ids AS "assetIds",
        issues_count AS issues, status
      FROM app_users
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/users
 * Create new user
 */
router.post("/", async (req, res) => {
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

    // Hash temporary password for new users
    const tempPassword = "ChangeMe@123";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const result = await pool.query(
      `INSERT INTO app_users (
        full_name, email, password, role, department, position_title, 
        cost_center, company, assets_count, issues_count, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING
        id, full_name AS name, email, role, department,
        position_title AS position, cost_center AS "costCenter",
        company, assets_count AS assets, issues_count AS issues, status`,
      [name, email, hashedPassword, role, department, position, costCenter, company, assets, issues, status]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err?.code === "23505") {
      return res.status(409).json({ error: "Email already exists." });
    }
    return res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/users/:id
 * Update user
 */
router.put("/:id", async (req, res) => {
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
       SET full_name = $1, email = $2, role = $3, department = $4,
           position_title = $5, cost_center = $6, company = $7,
           assets_count = $8, issues_count = $9, status = $10
       WHERE id = $11
       RETURNING
         id, full_name AS name, email, role, department,
         position_title AS position, cost_center AS "costCenter",
         company, assets_count AS assets, issues_count AS issues, status`,
      [name, email, role, department, position, costCenter, company, assets, issues, status, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "User not found." });
    return res.json(result.rows[0]);
  } catch (err) {
    if (err?.code === "23505") return res.status(409).json({ error: "Email already exists." });
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/users/:id
 * Delete user
 */
router.delete("/:id", async (req, res) => {
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

module.exports = router;
