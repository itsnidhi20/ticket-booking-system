import { Router } from "express";
import { pool } from "../config/db";

const router = Router();

// Get all events
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

// Get seats for an event
router.get("/:id/seats", async (req, res) => {
  try {
    const eventId = Number(req.params.id);

    const result = await pool.query(
      `
      SELECT
        s.id,
        s.seat_number,
        EXISTS (
          SELECT 1
          FROM bookings b
          WHERE b.seat_id = s.id
          AND b.event_id = $1
        ) AS booked
      FROM seats s
      WHERE s.venue_id = (
        SELECT venue_id
        FROM events
        WHERE id = $1
      )
      ORDER BY s.seat_number;
      `,
      [eventId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;