/**
 * Repair Tickets Routes
 * Handles support ticket creation, updates, and management
 */

const express = require("express");
const { pool } = require("../utils/database");

const router = express.Router();

/**
 * GET /api/repair/tickets
 * Get all repair tickets with submitter info
 */
router.get("/tickets", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, u.full_name as submitted_by_name
      FROM repair_tickets t
      LEFT JOIN app_users u ON t.submitted_by_id = u.id
      ORDER BY t.updated_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/repair/tickets
 * Create new repair ticket
 */
router.post("/tickets", async (req, res) => {
  const start = Date.now();

  try {
    const category = String(req.body?.category ?? "hardware").trim().toLowerCase();
    const subject = String(req.body?.subject ?? "").trim();
    const priority = String(req.body?.priority ?? "low").trim().toLowerCase();
    const assetTag = String(req.body?.assetTag ?? "").trim();
    const description = String(req.body?.description ?? "").trim();
    const submittedBy = req.body?.submittedBy ? Number(req.body.submittedBy) : null;
    const evidence = Array.isArray(req.body?.evidence) ? req.body.evidence : [];

    console.log(
      `[Backend] Creating ticket. Evidence count: ${evidence.length}, Total payload size: ~${Math.round(JSON.stringify(req.body).length / 1024)} KB`
    );

    if (!subject) {
      return res.status(400).json({ error: "Subject is required." });
    }

    const now = new Date();
    const result = await pool.query(
      `INSERT INTO repair_tickets (
        category, priority, subject, asset_tag, description, 
        status, submitted_by_id, evidence, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9)
       RETURNING ticket_id`,
      [
        category,
        priority,
        subject,
        assetTag || null,
        description || null,
        priority === "high" ? "URGENT" : "PENDING",
        submittedBy,
        JSON.stringify(evidence),
        now,
      ]
    );

    const ticketId = result.rows[0].ticket_id;

    // Add to activity feed
    await pool.query(
      "INSERT INTO activity_feed (type, title, description, time_label) VALUES ($1, $2, $3, $4)",
      [
        "update",
        `Ticket Submitted: ${ticketId}`,
        `New support ticket created${assetTag ? ` for ${assetTag}` : ""}${description ? "." : ""}`,
        "Just now",
      ]
    );

    const duration = Date.now() - start;
    console.log(`[Backend] Ticket ${ticketId} created in ${duration}ms`);

    res.status(201).json({
      message: "Ticket submitted successfully.",
      ticket_id: ticketId,
    });
  } catch (err) {
    console.error(`[Backend] Error creating ticket:`, err.message);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/repair/tickets/:id
 * Update existing repair ticket
 */
router.put("/tickets/:id", async (req, res) => {
  const start = Date.now();

  try {
    const id = String(req.params.id || "").trim();
    if (!id) return res.status(400).json({ error: "Ticket ID is required." });

    const evidence = Array.isArray(req.body?.evidence) ? req.body.evidence : [];
    console.log(
      `[Backend] Updating ticket ${id}. Evidence count: ${evidence.length}, Total payload size: ~${Math.round(JSON.stringify(req.body).length / 1024)} KB`
    );

    const category = String(req.body?.category ?? "hardware").trim().toLowerCase();
    const priority = String(req.body?.priority ?? "low").trim().toLowerCase();
    const subject = String(req.body?.subject ?? "").trim();
    const assetTag = String(req.body?.assetTag ?? "").trim();
    const description = String(req.body?.description ?? "").trim();
    const status = String(req.body?.status ?? "").trim().toUpperCase();
    const preparedBy = String(req.body?.preparedBy ?? "").trim();

    if (!subject || !status) {
      return res.status(400).json({ error: "Subject and status are required." });
    }

    const result = await pool.query(
      `UPDATE repair_tickets
       SET category = $1, priority = $2, subject = $3, asset_tag = $4,
           description = $5, status = $6, prepared_by = $7, 
           evidence = $8::jsonb, updated_at = NOW()
       WHERE ticket_id = $9
       RETURNING *`,
      [
        category,
        priority,
        subject,
        assetTag || null,
        description || null,
        status,
        preparedBy || null,
        JSON.stringify(evidence),
        id,
      ]
    );

    const duration = Date.now() - start;
    console.log(`[Backend] Ticket ${id} updated in ${duration}ms`);

    if (result.rowCount === 0) return res.status(404).json({ error: "Ticket not found." });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(`[Backend] Error updating ticket:`, err.message);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/repair/tickets/:id
 * Delete repair ticket
 */
router.delete("/tickets/:id", async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) return res.status(400).json({ error: "Ticket ID is required." });

    const result = await pool.query(`DELETE FROM repair_tickets WHERE ticket_id = $1 RETURNING *`, [
      id,
    ]);

    if (result.rowCount === 0) return res.status(404).json({ error: "Ticket not found." });
    return res.json({ ok: true, deleted: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/repair/ongoing
 * Get ongoing repair tickets
 */
router.get("/ongoing", (req, res) => {
  res.json([]);
});

module.exports = router;
