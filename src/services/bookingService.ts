import { pool } from "../config/db";
import { razorpay } from "../config/razorpay";

export const createBookingService = async (
  userId: number,
  eventId: number,
  seatNumbers: string[]
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const eventResult = await client.query(
      `
      SELECT venue_id
      FROM events
      WHERE id = $1
      `,
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      throw new Error("Event not found");
    }

    const venueId = eventResult.rows[0].venue_id;

    // Prevent duplicate seats in the same request
    const uniqueSeatNumbers = [...new Set(seatNumbers)];

    if (uniqueSeatNumbers.length !== seatNumbers.length) {
      throw new Error("Duplicate seat selected");
    }

    const sortedSeatNumbers = [...uniqueSeatNumbers].sort();

    let totalAmount = 0;
    const bookingIds: number[] = [];

    for (const seatNumber of sortedSeatNumbers) {
      // Lock the specific event seat
      const seatResult = await client.query(
        `
        SELECT id, price
        FROM seats
        WHERE venue_id = $1
        AND event_id = $2
        AND seat_number = $3
        FOR UPDATE
        `,
        [venueId, eventId, seatNumber]
      );

      if (seatResult.rows.length === 0) {
        throw new Error(`Seat ${seatNumber} not found`);
      }

      const seatId = seatResult.rows[0].id;
      const seatPrice = Number(seatResult.rows[0].price);

      if (!Number.isFinite(seatPrice) || seatPrice <= 0) {
        throw new Error(`Invalid price for seat ${seatNumber}`);
      }

      // Remove expired pending booking for this seat
      await client.query(
        `
        DELETE FROM bookings
        WHERE event_id = $1
        AND seat_id = $2
        AND status = 'PENDING'
        AND expires_at <= NOW()
        `,
        [eventId, seatId]
      );

      // Check whether the seat is already booked/reserved
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

      totalAmount += seatPrice;

      // Create temporary pending booking
      const bookingInsertResult = await client.query(
        `
        INSERT INTO bookings
        (
          user_id,
          event_id,
          seat_id,
          total_amount,
          status,
          expires_at
        )
        VALUES ($1, $2, $3, $4, 'PENDING', NOW() + INTERVAL '10 minutes')
        RETURNING id
        `,
        [userId, eventId, seatId, seatPrice]
      );

      bookingIds.push(bookingInsertResult.rows[0].id);
    }

    // Create Razorpay order using backend-calculated amount
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `ticket_${eventId}_${userId}_${Date.now()}`,
    });

    // Attach Razorpay order ID to all booking rows
    await client.query(
      `
      UPDATE bookings
      SET razorpay_order_id = $1
      WHERE id = ANY($2::int[])
      `,
      [razorpayOrder.id, bookingIds]
    );

    await client.query("COMMIT");

    return {
      message: "Payment initiated",
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      seats: seatNumbers,
      bookingIds,
      keyId: process.env.RAZORPAY_KEY_ID,
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


export const verifyBookingPaymentService = async (
  userId: number,
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock all bookings belonging to this Razorpay order
    const bookingResult = await client.query(
      `
      SELECT id, status, expires_at
      FROM bookings
      WHERE razorpay_order_id = $1
      AND user_id = $2
      FOR UPDATE
      `,

      [razorpayOrderId, userId]
    );

    if (bookingResult.rows.length === 0) {
      throw new Error("Booking not found for this payment");
    }

    // If payment was already verified, don't process it again
    const alreadyPaid = bookingResult.rows.every(
      (booking) => booking.status === "PAID"
    );

    if (alreadyPaid) {
      await client.query("COMMIT");

      return {
        message: "Payment already verified",
      };
    }

    // Check whether the temporary reservation expired
    const expiredBooking = bookingResult.rows.find(
      (booking) =>
        booking.status === "PENDING" &&
        booking.expires_at &&
        new Date(booking.expires_at) <= new Date()
    );

    if (expiredBooking) {
      throw new Error("Payment session expired");
    }

    // Mark all seats belonging to this payment as PAID
    await client.query(
      `
      UPDATE bookings
      SET
        status = 'PAID',
        payment_id = $1,
        expires_at = NULL
      WHERE razorpay_order_id = $2
      AND user_id = $3
      `,
      [razorpayPaymentId, razorpayOrderId, userId]
    );

    await client.query("COMMIT");

    return {
      message: "Booking confirmed successfully",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

