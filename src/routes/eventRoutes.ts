import { Router } from "express";
import { pool } from "../config/db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.id,
        e.title,
        e.description,
        v.name AS venue,
        e.event_date,
        e.start_time,
        e.end_time,
        e.price
      FROM events e
      JOIN venues v
      ON e.venue_id = v.id
      ORDER BY e.event_date;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;