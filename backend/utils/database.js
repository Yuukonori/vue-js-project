/**
 * Mock Database Utilities
 * The actual database has been removed. 
 * This file exists to prevent require() errors in route files until they are updated to use the external API.
 */

module.exports = {
  pool: {
    query: async () => {
      // Return empty data to prevent crashes in routes that haven't been migrated yet
      console.warn("WARNING: Database has been removed. A route attempted to query the database.");
      return { rows: [], rowCount: 0 };
    }
  }
};
