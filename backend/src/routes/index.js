const express = require('express');
const router = express.Router();

// Import sub-routes
const eventRoutes = require('./eventRoutes');
const categoryRoutes =require('./categoryRoutes')

// Use sub-routes
router.use('/events', eventRoutes); // Routes for events
router.use("/categories", categoryRoutes); // Routes for categories

module.exports = router;
