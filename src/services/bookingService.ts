import { pool } from "../config/db";

import { pool } from "../config/db";

export const createBookingService = async (
  userId: number,
  eventId: number,
  seatNumber: string
) => {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    // Find seat and lock it
    const seatResult = await client.query(
      `
      SELECT id
      FROM seats
      WHERE venue_id = (
        SELECT venue_id
        FROM events
        WHERE id = $1
      )
      AND seat_number = $2
      FOR UPDATE
      `,
      [eventId, seatNumber]
    );

    if (seatResult.rows.length === 0) {
      throw new Error("Seat not found");
    }

    const seatId = seatResult.rows[0].id;

    // Check if already booked
    const bookingResult = await client.query(
      `
      SELECT id
      FROM bookings
      WHERE event_id = $1
      AND seat_id = $2
      `,
      [eventId, seatId]
    );

    if (bookingResult.rows.length > 0) {
      throw new Error("Seat already booked");
    }

    // Get event price
    const eventResult = await client.query(
      `
      SELECT price
      FROM events
      WHERE id = $1
      `,
      [eventId]
    );

    const price = eventResult.rows[0].price;

    // Insert booking
    await client.query(
      `
      INSERT INTO bookings
      (user_id,event_id,seat_id,total_amount)
      VALUES($1,$2,$3,$4)
      `,
      [userId, eventId, seatId, price]
    );

    await client.query("COMMIT");

    return {
      message: "Booking Successful",
    };

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }
};

export const getMyBookingsService = async (userId: number) => {
  const result = await pool.query(
    `
    SELECT
      b.id,
      e.title,
      s.seat_number,
      b.total_amount,
      b.booking_time
    FROM bookings b
    JOIN events e
      ON b.event_id = e.id
    JOIN seats s
      ON b.seat_id = s.id
    WHERE b.user_id = $1
    ORDER BY b.booking_time DESC
    `,
    [userId]
  );

  return result.rows;
};

export const cancelBookingService = async (
  userId: number,
  bookingId: number
) => {

  // Check if booking exists and belongs to the logged-in user
  const bookingResult = await pool.query(
    `
    SELECT *
    FROM bookings
    WHERE id = $1
    AND user_id = $2
    `,
    [bookingId, userId]
  );

  if (bookingResult.rows.length === 0) {
    throw new Error("Booking not found");
  }

  // Delete booking
  await pool.query(
    `
    DELETE FROM bookings
    WHERE id = $1
    `,
    [bookingId]
  );

  return {
    message: "Booking cancelled successfully",
  };
};