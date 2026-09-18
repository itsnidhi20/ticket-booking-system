import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { pool } from "../config/db";

describe("Payments", () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const email = `payment-test-${Date.now()}@example.com`;

    const result = await pool.query(
      `
      INSERT INTO users
      (name, email, password_hash, is_verified, role)
      VALUES ($1, $2, $3, true, 'user')
      RETURNING id
      `,
      ["Payment Test User", email, "test-hash"]
    );

    userId = result.rows[0].id;

    token = jwt.sign(
      {
        id: userId,
        role: "user",
        email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
  });

  afterAll(async () => {
    await pool.query(
      `DELETE FROM users WHERE id = $1`,
      [userId]
    );
  });

  it("should reject payment verification without JWT", async () => {
    const response = await request(app)
      .post("/payments/verify")
      .send({
        razorpay_order_id: "order_test",
        razorpay_payment_id: "pay_test",
        razorpay_signature: "invalid",
      });

    expect(response.status).toBe(401);
  });

  it("should reject payment verification with missing fields", async () => {
    const response = await request(app)
      .post("/payments/verify")
      .set("Authorization", `Bearer ${token}`)
      .send({
        razorpay_order_id: "order_test",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Invalid payment verification details"
    );
  });

  it("should reject an invalid Razorpay signature", async () => {
    const response = await request(app)
      .post("/payments/verify")
      .set("Authorization", `Bearer ${token}`)
      .send({
        razorpay_order_id: "order_test",
        razorpay_payment_id: "pay_test",
        razorpay_signature: "definitely-invalid-signature",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Invalid payment signature"
    );
  });

  it("should reject payment verification for a non-existent booking", async () => {
    const crypto = await import("crypto");

    const orderId = "order_nonexistent";
    const paymentId = "pay_nonexistent";

    const signature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const response = await request(app)
      .post("/payments/verify")
      .set("Authorization", `Bearer ${token}`)
      .send({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Booking not found for this payment"
    );
  });
});