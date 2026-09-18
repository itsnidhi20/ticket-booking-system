
import { pool } from "../config/db";

afterAll(async () => {
  await pool.end();
});

