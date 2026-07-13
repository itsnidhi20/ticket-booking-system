import { pool } from "../config/db";

export const createBookingService = async (
  userId: number,
  eventId: number,
  seatNumbers: string[]
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get event price once
    const eventResult = await client.query(
      `
      SELECT price, venue_id
      FROM events
      WHERE id = $1
      `,
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      throw new Error("Event not found");
    }

    const price = Number(eventResult.rows[0].price);
    const venueId = eventResult.rows[0].venue_id;

    for (const seatNumber of seatNumbers) {
      // Lock seat
      const seatResult = await client.query(
        `
        SELECT id
        FROM seats
        WHERE venue_id = $1
        AND seat_number = $2
        FOR UPDATE
        `,
        [venueId, seatNumber]
      );

      if (seatResult.rows.length === 0) {
        throw new Error(`Seat ${seatNumber} not found`);
      }

      const seatId = seatResult.rows[0].id;

      // Already booked?
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
        throw new Error(`Seat ${seatNumber} already booked`);
      }

      // Insert booking
      await client.query(
        `
        INSERT INTO bookings
        (user_id,event_id,seat_id,total_amount)
        VALUES($1,$2,$3,$4)
        `,
        [userId, eventId, seatId, price]
      );
    }

    await client.query("COMMIT");

    return {
      message: "Booking Successful",
      seats: seatNumbers,
      totalAmount: price * seatNumbers.length,
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