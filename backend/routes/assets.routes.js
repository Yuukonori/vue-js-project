/**
 * Asset Management Routes
 * Handles inventory, expiring assets, and asset assignments
 */

const express = require("express");
const { pool, syncUserAssetCounts } = require("../utils/database");

const router = express.Router();

/**
 * GET /api/assets/expiring
 * Get expiring assets
 */
router.get("/expiring", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expiring_assets ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/assets/inventory
 * Get all inventory assets with assigned user info
 */
router.get("/inventory", async (req, res) => {
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

/**
 * GET /api/assets/history
 * Get asset service history
 */
router.get("/history", (req, res) => {
  res.json([]);
});

/**
 * POST /api/assets/add
 * Add new asset to inventory
 */
router.post("/add", async (req, res) => {
  const {
    asset_id,
    category,
    serial_number,
    service_years,
    purchase_date,
    warranty_expiry,
    status,
    assigned_user_id,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO inventory (
        asset_id, category, serial_number, service_years, 
        purchase_date, warranty_expiry, status, assigned_user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [
        asset_id,
        category,
        serial_number,
        service_years || 0,
        purchase_date,
        warranty_expiry,
        status,
        assigned_user_id ?? null,
      ]
    );

    await syncUserAssetCounts();

    // Add to activity feed
    await pool.query(
      "INSERT INTO activity_feed (type, title, description, time_label) VALUES ($1, $2, $3, $4)",
      [
        "update",
        `New ${category} Registered: ${asset_id}`,
        `Asset ${asset_id} was added to the inventory.`,
        "",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/assets/update
 * Update existing asset
 */
router.put("/update", async (req, res) => {
  const {
    asset_id: id,
    category,
    serial_number,
    service_years,
    purchase_date,
    warranty_expiry,
    status,
    assigned_user_id,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE inventory 
       SET category = $1, serial_number = $2, service_years = $3, 
           purchase_date = $4, warranty_expiry = $5, status = $6, 
           assigned_user_id = $7 
       WHERE asset_id = $8 
       RETURNING *`,
      [
        category,
        serial_number,
        service_years || 0,
        purchase_date,
        warranty_expiry,
        status,
        assigned_user_id ?? null,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Add to activity feed
    await pool.query(
      "INSERT INTO activity_feed (type, title, description, time_label) VALUES ($1, $2, $3, $4)",
      ["update", `Asset Updated: ${id}`, `Details for asset ${id} were updated.`, ""]
    );

    await syncUserAssetCounts();
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/assets/delete
 * Delete asset from inventory
 */
router.delete("/delete", async (req, res) => {
  const id = req.query.id;

  try {
    const result = await pool.query("DELETE FROM inventory WHERE asset_id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Add to activity feed
    await pool.query(
      "INSERT INTO activity_feed (type, title, description, time_label) VALUES ($1, $2, $3, $4)",
      ["update", `Asset Deleted: ${id}`, `Asset ${id} was removed from the inventory.`, ""]
    );

    await syncUserAssetCounts();
    res.json({ message: "Asset deleted successfully", deletedAsset: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/assets/assign
 * Assign asset to user
 */
router.post("/assign", async (req, res) => {
  const assetId = String(req.body?.asset_id ?? "").trim();
  const userId = req.body?.user_id == null ? null : Number(req.body.user_id);

  if (!assetId) return res.status(400).json({ error: "asset_id is required." });
  if (userId !== null && !Number.isFinite(userId))
    return res.status(400).json({ error: "user_id must be a number or null." });

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

module.exports = router;
