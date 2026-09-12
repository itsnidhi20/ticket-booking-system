import { pool } from "../config/db";

// ===============================
// Get All Events
// ===============================
export const listEvents = async () => {
  const result = await pool.query(`
    SELECT
      e.*,
      v.name AS venue_name,
      v.city,
      v.address
    FROM events e
    JOIN venues v
      ON e.venue_id = v.id
    ORDER BY e.event_date, e.start_time
  `);

  return result.rows;
};

// ===============================
// Get Seats For Event
// ===============================
export const getSeatsForEvent = async (eventId: number) => {
  const result = await pool.query(
    `
    SELECT
      s.id,
      s.seat_number,
      s.row_name,
      s.section,
      s.price,

      EXISTS (
        SELECT 1
        FROM bookings b
        WHERE b.seat_id = s.id
        AND b.event_id = $1
      ) AS booked

    FROM seats s
    WHERE s.event_id = $1
    ORDER BY s.row_name, s.seat_number
    `,
    [eventId]
  );

  return result.rows;
};