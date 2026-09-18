import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import app from "../app";
import { pool } from "../config/db";

describe("Authorization", () => {
  let userToken: string;
  let adminToken: string;
  let userId: number;
  let adminId: number;

  beforeAll(async () => {
    const userEmail = `auth-user-${Date.now()}@example.com`;
    const adminEmail = `auth-admin-${Date.now()}@example.com`;

    const passwordHash = await bcrypt.hash(
      "TestPassword123",
      10
    );

    const userResult = await pool.query(
      `
      INSERT INTO users
      (name, email, password_hash, is_verified, role)
      VALUES ($1, $2, $3, true, 'user')
      RETURNING id
      `,
      [
        "Authorization Test User",
        userEmail,
        passwordHash,
      ]
    );

    const adminResult = await pool.query(
      `
      INSERT INTO users
      (name, email, password_hash, is_verified, role)
      VALUES ($1, $2, $3, true, 'admin')
      RETURNING id
      `,
      [
        "Authorization Test Admin",
        adminEmail,
        passwordHash,
      ]
    );

    userId = userResult.rows[0].id;
    adminId = adminResult.rows[0].id;

    userToken = jwt.sign(
      {
        id: userId,
        role: "user",
        email: userEmail,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    adminToken = jwt.sign(
      {
        id: adminId,
        role: "admin",
        email: adminEmail,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
  });

  afterAll(async () => {
    await pool.query(
      `DELETE FROM users WHERE id IN ($1, $2)`,
      [userId, adminId]
    );
  });

  it("should reject normal users from admin dashboard", async () => {
    const response = await request(app)
      .get("/admin/dashboard")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Access denied. Admins only."
    );
  });

  it("should reject unauthenticated users from admin routes", async () => {
    const response = await request(app)
      .get("/admin/dashboard");

    expect(response.status).toBe(401);
  });

  it("should allow an admin to access the admin dashboard", async () => {
    const response = await request(app)
      .get("/admin/dashboard")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });
});