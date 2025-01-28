const pool = require("../config/database");
const asyncHandler = require("express-async-handler");
const { getPagination } = require("../utils/paginationHelper");

// Create an event
const createEvent = asyncHandler(async (req, res) => {
  const { name, description, starttime, endtime, category_ids } = req.body;

  try {
    const eventResult = await pool.query(
      `INSERT INTO events (name, description, starttime, endtime) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, starttime, endtime]
    );

    const eventId = eventResult.rows[0].id;

    const insertCategories = category_ids.map((categoryId) => {
      return pool.query(
        `INSERT INTO event_categories (event_id, category_id) VALUES ($1, $2)`,
        [eventId, categoryId]
      );
    });

    await Promise.all(insertCategories);

    res.status(201).json({
      message: "Event created successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get events with pagination and filtering
const getEvents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category_id, name } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Build dynamic query with filters
    let query = `
      SELECT 
        e.id, e.name, e.description, e.starttime, e.endtime,
        json_agg(json_build_object('id', c.id, 'name', c.name)) AS categories
      FROM events e
      LEFT JOIN event_categories ec ON e.id = ec.event_id
      LEFT JOIN categories c ON ec.category_id = c.id
    `;
    let conditions = [];
    let queryParams = [];

    // Filter by category
    if (category_id) {
      conditions.push(`ec.category_id = $${queryParams.length + 1}`);
      queryParams.push(category_id);
    }

    // Filter by name (case insensitive search)
    if (name) {
      conditions.push(`LOWER(e.name) LIKE $${queryParams.length + 1}`);
      queryParams.push(`%${name.toLowerCase()}%`);
    }

    // Apply conditions if any
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Group and paginate
    query += ` GROUP BY e.id LIMIT $${queryParams.length + 1} OFFSET $${
      queryParams.length + 2
    }`;
    queryParams.push(limit, offset);

    const events = await pool.query(query, queryParams);

    // Get total count of events for pagination
    const totalQuery = `
      SELECT COUNT(DISTINCT e.id) AS total 
      FROM events e
      LEFT JOIN event_categories ec ON e.id = ec.event_id
      ${conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""}
    `;
    const total = await pool.query(
      totalQuery,
      queryParams.slice(0, queryParams.length - 2)
    ); // Remove limit/offset params

    res.json({
      data: {
        events: events.rows,
        total: parseInt(total.rows[0].total),
        totalPages: Math.ceil(total.rows[0].total / limit),
        currentPage: page,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update an event by ID
const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, starttime, endtime, category_ids } = req.body;

  // Update event and categories
  await pool.query("BEGIN");
  const result = await pool.query(
    "UPDATE events SET name = $1, description = $2, starttime = $3, endtime = $4 WHERE id = $5 RETURNING *",
    [name, description, starttime, endtime, id]
  );

  await pool.query("DELETE FROM event_categories WHERE event_id = $1", [id]);
  const insertQuery = `
      INSERT INTO event_categories (event_id, category_id)
      SELECT $1, unnest($2::INTEGER[])
    `;
  await pool.query(insertQuery, [id, category_ids]);
  await pool.query("COMMIT");

  if (insertQuery.rowCount === 0) {
    return res.status(400).json({ error: "Invalid category ID" });
  }
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Event not found" });
  }
  res.json({ message: "Event updated successfully" });
});

// Delete an event by ID
const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM events WHERE id = $1 RETURNING *",
    [id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Event not found" });
  }

  res.status(204).json({ message: "Event deleted successfully" });
});

module.exports = { createEvent, getEvents, updateEvent, deleteEvent };
