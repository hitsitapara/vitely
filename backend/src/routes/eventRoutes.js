const express = require("express");
const { createEvent, getEvents, updateEvent, deleteEvent } = require("../controllers/eventController");
const { validateEvent } = require("../middlewares/validationMiddleware");
const { sanitizeInput } = require("../middlewares/sanitizeMiddleware");

const router = express.Router();

router.post("/", sanitizeInput, validateEvent, createEvent);
router.get("/", getEvents);
router.put("/:id", sanitizeInput, validateEvent, updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
