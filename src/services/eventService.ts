import { pool } from "../config/db";

export const listEvents = async () => {
  const result = await pool.query(`SELECT * FROM events ORDER BY event_date`);
  return result.rows;
};

export const getSeatsForEvent = async (eventId: number) => {
  const result = await pool.query(
    `SELECT s.id, s.seat_number FROM seats s WHERE s.venue_id = (SELECT venue_id FROM events WHERE id = $1) ORDER BY s.seat_number`,
    [eventId]
  );

  return result.rows;
};
