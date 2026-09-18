import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import app from "../app";
import { pool } from "../config/db";

describe("Bookings", () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const email = `booking-test-${Date.now()}@example.com`;
    const passwordHash = await bcrypt.hash("TestPassword123", 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (name, email, password_hash, is_verified, role)
      VALUES ($1, $2, $3, true, 'user')
      RETURNING id
      `,
      ["Booking Test User", email, passwordHash]
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

  it("should reject booking without JWT", async () => {
    const response = await request(app)
      .post("/bookings")
      .send({
        eventId: 3,
        seatNumbers: ["A1"],
      });

    expect(response.status).toBe(401);
  });

  it("should reject booking with an invalid JWT", async () => {
    const response = await request(app)
      .post("/bookings")
      .set("Authorization", "Bearer invalid-token")
      .send({
        eventId: 3,
        seatNumbers: ["A1"],
      });

    expect(response.status).toBe(401);
  });

  it("should return user's bookings", async () => {
  const response = await request(app)
    .get("/bookings/my")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});

  it("should reject booking for a non-existent event", async () => {
    const response = await request(app)
      .post("/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        eventId: 999999,
        seatNumbers: ["A1"],
      });

    expect(response.status).not.toBe(201);
  });

  it("should reject booking when seat numbers are missing", async () => {
    const response = await request(app)
      .post("/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        eventId: 3,
      });

    expect(response.status).not.toBe(201);
  });

  it("should reject duplicate seat numbers", async () => {
    const response = await request(app)
      .post("/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        eventId: 3,
        seatNumbers: ["A1", "A1"],
      });

    expect(response.status).not.toBe(201);
  });
});