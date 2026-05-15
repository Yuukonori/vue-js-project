/**
 * BuilderUI Management System - Backend Server
 * 
 * Main server file that initializes Express app and routes
 * Connects to PostgreSQL database and handles API requests
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { bootstrapDatabase, dbEngine } = require("./utils/database");

// Import route modules
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const assetRoutes = require("./routes/assets.routes");
const ticketRoutes = require("./routes/tickets.routes");
const miscRoutes = require("./routes/misc.routes");

const app = express();
const PORT = process.env.PORT || 5050;

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ============================================================================
// ROUTES
// ============================================================================

// Authentication routes
app.use("/api/auth", authRoutes);

// User management routes
app.use("/api/users", userRoutes);

// Asset management routes
app.use("/api/assets", assetRoutes);

// Repair ticket routes
app.use("/api/repair", ticketRoutes);

// Miscellaneous routes (activity, maintenance, access policies)
app.use("/api", miscRoutes);

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

/**
 * Initialize database and start server
 */
async function startServer() {
  try {
    // Bootstrap database schema and seed data
    await bootstrapDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log("=".repeat(60));
      console.log("  BuilderUI Management System - Backend Server");
      console.log("=".repeat(60));
      console.log(`  ✓ Server running on http://localhost:${PORT}`);
      console.log(`  ✓ Database connected`);
      console.log(`  ✓ API endpoints ready`);
      console.log("=".repeat(60));
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Start the server
startServer();

// ============================================================================
// ERROR HANDLING
// ============================================================================

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
