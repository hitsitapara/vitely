const express = require("express");
const { getCategories } = require("../controllers/categoryController");

const router = express.Router();

// Route to get the list of categories
router.get("/", getCategories);

module.exports = router;
