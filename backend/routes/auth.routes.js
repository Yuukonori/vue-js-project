/**
 * Authentication Routes
 * Handles user login, token verification, and refresh
 */

const express = require("express");
const bcrypt = require("bcrypt");
const { pool } = require("../utils/database");
const { generateToken, authenticateToken, JWT_EXPIRES_IN } = require("../utils/auth");
const { loginRateLimiter } = require("../utils/rateLimiter");

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 * Protected by rate limiter: 10 attempts per 1 minute
 */
router.post("/login", loginRateLimiter, async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const result = await pool.query(
      `SELECT
         u.id, u.full_name AS name, u.email, u.password, u.role, u.department,
         u.position_title AS position, u.cost_center AS "costCenter",
         u.company, u.status, u.is_active, u.avatar, u.location, u.about, COALESCE(u.created_at::text, '2026-05-12') AS created_at,
         (SELECT COUNT(*)::int FROM inventory WHERE assigned_user_id::text = u.id::text) AS assets,
         (SELECT COUNT(*)::int FROM repair_tickets WHERE submitted_by_id::text = u.id::text) AS issues,
         (SELECT COUNT(*)::int FROM repair_tickets WHERE submitted_by_id::text = u.id::text) AS issues_count
       FROM app_users u
       WHERE LOWER(u.email) = $1
       LIMIT 1`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: "User is inactive." });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Remove sensitive data
    delete user.password;
    delete user.is_active;

    // Generate JWT token
    const token = generateToken(user);

    return res.json({
      ok: true,
      user,
      token,
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/verify
 * Verify JWT token and return user data
 */
router.post("/verify", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         u.id, u.full_name AS name, u.email, u.role, u.department,
         u.position_title AS position, u.cost_center AS "costCenter",
         u.company, u.status, u.avatar, u.location, u.about, COALESCE(u.created_at::text, '2026-05-12') AS created_at,
         (SELECT COUNT(*)::int FROM inventory WHERE assigned_user_id::text = u.id::text) AS assets,
         (SELECT COUNT(*)::int FROM repair_tickets WHERE submitted_by_id::text = u.id::text) AS issues,
         (SELECT COUNT(*)::int FROM repair_tickets WHERE submitted_by_id::text = u.id::text) AS issues_count
       FROM app_users u
       WHERE u.id = $1 AND u.is_active = true
       LIMIT 1`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found or inactive." });
    }

    return res.json({ ok: true, user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 */
router.post("/refresh", authenticateToken, (req, res) => {
  try {
    const newToken = generateToken(req.user);

    return res.json({
      ok: true,
      token: newToken,
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
