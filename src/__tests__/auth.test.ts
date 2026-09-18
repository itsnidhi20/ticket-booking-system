
import request from "supertest";
import app from "../app";

describe("Authentication", () => {
  it("should reject access to profile without JWT", async () => {
    const response = await request(app)
      .get("/users/profile");

    expect(response.status).toBe(401);
  });

  it("should reject access to profile with an invalid JWT", async () => {
    const response = await request(app)
      .get("/users/profile")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
  });

  it("should reject login with an incorrect password", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "warankarnidhi@gmail.com",
        password: "definitely-wrong-password",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should reject login when the user does not exist", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: `nonexistent-${Date.now()}@example.com`,
        password: "SomePassword123",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should reject access with an invalid Authorization format", async () => {
    const response = await request(app)
      .get("/users/profile")
      .set("Authorization", "NotBearer token");

    expect(response.status).toBe(401);
  });
});

