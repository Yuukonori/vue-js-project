/**
 * Miscellaneous Routes
 * Handles activity feed, maintenance, access policies, and other endpoints
 */

const express = require("express");
const { pool } = require("../utils/database");

const router = express.Router();

/**
 * GET /api/test
 * Health check endpoint
 */
router.get("/test", (req, res) => res.send("ok"));

/**
 * GET /api/activity/feed
 * Get activity feed
 */
router.get("/activity/feed", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM activity_feed ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/maintenance/tasks
 * Get maintenance tasks
 */
router.get("/maintenance/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM maintenance");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/access-policies
 * Get all access policies
 */
router.get("/access-policies", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT department, allowed_pages, allowed_features
      FROM access_policies
      ORDER BY department ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/access-policies/:department
 * Update access policy for department
 */
router.put("/access-policies/:department", async (req, res) => {
  try {
    const department = String(req.params.department || "").trim().toLowerCase();
    const allowedPages = Array.isArray(req.body?.allowed_pages) ? req.body.allowed_pages : [];
    const allowedFeatures = Array.isArray(req.body?.allowed_features)
      ? req.body.allowed_features
      : [];

    if (!department) return res.status(400).json({ error: "Department is required." });

    const normalizedPages = allowedPages.map((v) => String(v || "").trim()).filter(Boolean);

    const result = await pool.query(
      `INSERT INTO access_policies (department, allowed_pages, allowed_features, updated_at)
       VALUES ($1, $2::jsonb, $3::jsonb, CURRENT_TIMESTAMP)
       ON CONFLICT (department) DO UPDATE
       SET allowed_pages = EXCLUDED.allowed_pages,
           allowed_features = EXCLUDED.allowed_features,
           updated_at = CURRENT_TIMESTAMP
       RETURNING department, allowed_pages, allowed_features, updated_at`,
      [department, JSON.stringify(normalizedPages), JSON.stringify(allowedFeatures)]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/problem-frequency
 * Get problem frequency data
 */
router.get("/problem-frequency", (req, res) => {
  res.json([]);
});

module.exports = router;
