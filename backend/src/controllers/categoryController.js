const pool = require("../config/database");
const asyncHandler = require("express-async-handler");

// Get all categories
const getCategories = asyncHandler(async (req, res) => {
  const result = await pool.query("SELECT * FROM categories ORDER BY name ASC");
  res.status(200).json(result.rows);
});

module.exports = { getCategories };
