
import request from "supertest";
import app from "../app";

describe("Events", () => {
  it("should return the list of events", async () => {
    const response = await request(app)
      .get("/events");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.events)).toBe(true);
  });
});

