import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import app from "../app";
import { pool } from "../config/db";
import { razorpay } from "../config/razorpay";

describe("Cancellation", () => {
  let token: string;
  let userId: number;
  let eventId: number;
  let seatId: number;

  beforeAll(async () => {
    const email = `cancel-test-${Date.now()}@example.com`;
    const passwordHash = await bcrypt.hash("TestPassword123", 10);

    const userResult = await pool.query(
      `
      INSERT INTO users
      (name, email, password_hash, is_verified, role)
      VALUES ($1, $2, $3, true, 'user')
      RETURNING id
      `,
      ["Cancellation Test User", email, passwordHash]
    );

    userId = userResult.rows[0].id;

    token = jwt.sign(
      {
        id: userId,
        role: "user",
        email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const eventResult = await pool.query(
      `
      INSERT INTO events
      (
        title,
        description,
        venue_id,
        event_date,
        start_time,
        end_time,
        price
      )
      SELECT
        'Cancellation Test Event',
        'Test event',
        id,
        CURRENT_DATE + INTERVAL '10 days',
        '18:00',
        '20:00',
        500
      FROM venues
      LIMIT 1
      RETURNING id
      `
    );

    if (eventResult.rows.length === 0) {
      throw new Error("No venue available for cancellation test");
    }

    eventId = eventResult.rows[0].id;

    const seatResult = await pool.query(
      `
      INSERT INTO seats
      (venue_id, event_id, seat_number, row_name, section, price)
      SELECT
        venue_id,
        id,
        'TEST-C1',
        'TEST',
        'TEST',
        500
      FROM events
      WHERE id = $1
      RETURNING id
      `,
      [eventId]
    );

    seatId = seatResult.rows[0].id;
  });

  afterAll(async () => {
    await pool.query(
      `DELETE FROM events WHERE id = $1`,
      [eventId]
    );

    await pool.query(
      `DELETE FROM users WHERE id = $1`,
      [userId]
    );
  });

  it("should reject cancellation without JWT", async () => {
    const response = await request(app)
      .delete("/bookings/999999");

    expect(response.status).toBe(401);
  });

  it("should reject cancellation of a non-existent booking", async () => {
    const response = await request(app)
      .delete("/bookings/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Booking not found");
  });

  it("should reject cancellation of a pending booking", async () => {
    const result = await pool.query(
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
      VALUES ($1, $2, $3, 500, 'PENDING', NOW() + INTERVAL '10 minutes')
      RETURNING id
      `,
      [userId, eventId, seatId]
    );

    const bookingId = result.rows[0].id;

    const response = await request(app)
      .delete(`/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Only paid bookings can be cancelled"
    );

    await pool.query(
      `DELETE FROM bookings WHERE id = $1`,
      [bookingId]
    );
  });

  it("should cancel a paid booking and initiate refund", async () => {
    const result = await pool.query(
      `
      INSERT INTO bookings
      (
        user_id,
        event_id,
        seat_id,
        total_amount,
        status,
        payment_id
      )
      VALUES ($1, $2, $3, 500, 'PAID', 'pay_test_cancellation')
      RETURNING id
      `,
      [userId, eventId, seatId]
    );

    const bookingId = result.rows[0].id;

        const refundMock = jest.spyOn(
        razorpay.payments,
        "refund"
        );

        refundMock.mockImplementation(
        async () => ({ id: "rfnd_test_cancellation" } as any)
        );

    const response = await request(app)
      .delete(`/bookings/${bookingId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.message).toBe(
      "Booking cancelled and refund initiated successfully"
    );

    expect(refundMock).toHaveBeenCalledWith(
      "pay_test_cancellation",
      {
        amount: 50000,
      }
    );

    const bookingCheck = await pool.query(
      `SELECT id FROM bookings WHERE id = $1`,
      [bookingId]
    );

    expect(bookingCheck.rows.length).toBe(0);

    refundMock.mockRestore();
  });
});